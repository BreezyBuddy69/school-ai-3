import { NextRequest, NextResponse, after } from 'next/server'
import { unlinkSync } from 'node:fs'
import path from 'node:path'
import { currentUser } from '@/lib/auth'
import { db, newId, DATA_DIR } from '@/lib/db'
import { jobParams, runStudioJob } from '@/lib/studio-job'

/** Einzelne Projektzeile — der Client fragt sie ab, solange eine Generierung läuft. */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await currentUser()
  if (!user) return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 })
  const row = db().prepare(`
    SELECT p.id, p.subject, p.type, p.name, p.content, p.pinned, p.created_at, p.folder_id, p.status, p.error, f.name AS folder_name
    FROM projects p LEFT JOIN project_folders f ON f.id = p.folder_id
    WHERE p.id = ? AND p.user_id = ?
  `).get(id, user.id)
  if (!row) return NextResponse.json({ error: 'Projekt nicht gefunden' }, { status: 404 })
  return NextResponse.json(row)
}

/**
 * Wiederholung einer fehlgeschlagenen Generierung — der Auftrag steht noch in
 * der Zeile, es muss also nichts neu getippt werden. Kein zusätzliches
 * Kontingent: der Fehlversuch wurde beim Scheitern zurückgebucht.
 */
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await currentUser()
  if (!user) return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 })
  const row = db().prepare("SELECT content, status FROM projects WHERE id = ? AND user_id = ? AND status = 'error'")
    .get(id, user.id) as { content: string } | undefined
  if (!row) return NextResponse.json({ error: 'Kein wiederholbarer Auftrag' }, { status: 404 })
  const job = jobParams(row.content)
  if (!job) return NextResponse.json({ error: 'Auftrag nicht mehr lesbar' }, { status: 410 })

  db().prepare("UPDATE projects SET status = 'pending', error = NULL WHERE id = ? AND user_id = ?").run(id, user.id)
  after(() => runStudioJob(user, id, job))
  return NextResponse.json({ id, status: 'pending' }, { status: 202 })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await currentUser()
  if (!user) return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 })
  const body = await req.json().catch(() => ({}))
  if (typeof body.name === 'string' && body.name.trim()) {
    db().prepare('UPDATE projects SET name = ? WHERE id = ? AND user_id = ?').run(body.name.trim().slice(0, 120), id, user.id)
  }
  if (typeof body.pinned === 'boolean') {
    db().prepare('UPDATE projects SET pinned = ? WHERE id = ? AND user_id = ?').run(body.pinned ? 1 : 0, id, user.id)
  }
  // Manuelles Einsortieren: entweder in einen bestehenden Ordner (folderId,
  // null = rausnehmen) oder in einen neu angelegten (newFolderName).
  if (typeof body.newFolderName === 'string' && body.newFolderName.trim()) {
    const project = db().prepare('SELECT subject FROM projects WHERE id = ? AND user_id = ?').get(id, user.id) as { subject: string } | undefined
    if (project) {
      const folderId = newId('f')
      db().prepare('INSERT INTO project_folders (id, user_id, subject, name, topic_key) VALUES (?, ?, ?, ?, ?)')
        .run(folderId, user.id, project.subject, body.newFolderName.trim().slice(0, 80), `manual:${folderId}`)
      db().prepare('UPDATE projects SET folder_id = ? WHERE id = ? AND user_id = ?').run(folderId, id, user.id)
    }
  } else if ('folderId' in body) {
    const folderId = typeof body.folderId === 'string' ? body.folderId : null
    db().prepare('UPDATE projects SET folder_id = ? WHERE id = ? AND user_id = ?').run(folderId, id, user.id)
  }
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await currentUser()
  if (!user) return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 })

  const project = db().prepare("SELECT content FROM projects WHERE id = ? AND user_id = ? AND type = 'podcast'")
    .get(id, user.id) as { content: string } | undefined
  if (project) {
    try {
      const { audioPath } = JSON.parse(project.content) as { audioPath: string | null }
      if (audioPath) unlinkSync(path.join(DATA_DIR, 'audio', audioPath))
    } catch { /* Datei schon weg oder Content im Altformat — egal, Projektzeile wird trotzdem gelöscht */ }
  }

  db().prepare('DELETE FROM projects WHERE id = ? AND user_id = ?').run(id, user.id)
  return NextResponse.json({ ok: true })
}
