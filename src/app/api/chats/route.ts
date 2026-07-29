import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@/lib/auth'
import { db, newId } from '@/lib/db'

export async function GET(req: NextRequest) {
  const user = await currentUser()
  if (!user) return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 })
  const subject = req.nextUrl.searchParams.get('subject')
  const rows = db().prepare(`
    SELECT id, subject, title, sources_json, created_at, last_message_at,
           (SELECT COUNT(*) FROM messages m WHERE m.chat_id = chats.id) AS message_count
    FROM chats WHERE user_id = ? AND deleted_at IS NULL ${subject ? 'AND subject = ?' : ''}
    ORDER BY last_message_at DESC LIMIT 100
  `).all(...(subject ? [user.id, subject] : [user.id]))
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  const user = await currentUser()
  if (!user) return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 })
  const { subject, sources } = await req.json().catch(() => ({}))
  if (typeof subject !== 'string' || !subject) return NextResponse.json({ error: 'Fach fehlt' }, { status: 400 })
  const id = newId('c')
  db().prepare('INSERT INTO chats (id, user_id, subject, sources_json) VALUES (?, ?, ?, ?)')
    .run(id, user.id, subject.slice(0, 80), JSON.stringify(Array.isArray(sources) ? sources.slice(0, 50) : []))
  return NextResponse.json({ id })
}
