import { NextRequest, NextResponse } from 'next/server'
import { unlinkSync } from 'node:fs'
import path from 'node:path'
import { currentUser } from '@/lib/auth'
import { db, newId, DATA_DIR } from '@/lib/db'

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
