import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { currentUser } from '@/lib/auth'
import { db, DATA_DIR } from '@/lib/db'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await currentUser()
  if (!user) return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 })

  const project = db().prepare("SELECT content FROM projects WHERE id = ? AND user_id = ? AND type = 'podcast'")
    .get(id, user.id) as { content: string } | undefined
  if (!project) return NextResponse.json({ error: 'Podcast nicht gefunden' }, { status: 404 })

  const { audioPath } = JSON.parse(project.content) as { audioPath: string | null }
  if (!audioPath) return NextResponse.json({ error: 'Kein Audio vorhanden' }, { status: 404 })

  try {
    const bytes = readFileSync(path.join(DATA_DIR, 'audio', audioPath))
    return new NextResponse(new Uint8Array(bytes), {
      headers: { 'Content-Type': 'audio/wav', 'Cache-Control': 'private, max-age=31536000, immutable' },
    })
  } catch {
    return NextResponse.json({ error: 'Audio-Datei fehlt' }, { status: 404 })
  }
}
