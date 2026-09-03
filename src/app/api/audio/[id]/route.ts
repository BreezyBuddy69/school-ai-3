import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { currentUser } from '@/lib/auth'
import { db, DATA_DIR } from '@/lib/db'

// Audio wird bewusst mit Content-Length und Range-Unterstützung ausgeliefert:
// ohne beides kennt der Browser die Gesamtdauer nicht (der Player zeigt dann
// nur die laufende Zeit ohne Ende) und Springen im Stück schlägt fehl.

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
    const base = {
      'Content-Type': 'audio/wav',
      'Cache-Control': 'private, max-age=31536000, immutable',
      'Accept-Ranges': 'bytes',
    }
    const range = req.headers.get('range')?.match(/bytes=(\d*)-(\d*)/)
    if (range) {
      const start = range[1] ? Number(range[1]) : 0
      const end = range[2] ? Math.min(Number(range[2]), bytes.length - 1) : bytes.length - 1
      if (start >= bytes.length || start > end) {
        return new NextResponse(null, { status: 416, headers: { ...base, 'Content-Range': `bytes */${bytes.length}` } })
      }
      const slice = bytes.subarray(start, end + 1)
      return new NextResponse(new Uint8Array(slice), {
        status: 206,
        headers: { ...base, 'Content-Range': `bytes ${start}-${end}/${bytes.length}`, 'Content-Length': String(slice.length) },
      })
    }
    return new NextResponse(new Uint8Array(bytes), {
      headers: { ...base, 'Content-Length': String(bytes.length) },
    })
  } catch {
    return NextResponse.json({ error: 'Audio-Datei fehlt' }, { status: 404 })
  }
}
