import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@/lib/auth'
import { db, newId } from '@/lib/db'

/** Kurzer Share-Link statt Base64-Monster-URL: Server speichert die Referenz. */
export async function POST(req: NextRequest) {
  const user = await currentUser()
  if (!user) return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 })
  const { chatId } = await req.json().catch(() => ({}))
  const chat = db().prepare('SELECT id FROM chats WHERE id = ? AND user_id = ? AND deleted_at IS NULL').get(String(chatId), user.id)
  if (!chat) return NextResponse.json({ error: 'Chat nicht gefunden' }, { status: 404 })
  const existing = db().prepare('SELECT id FROM shares WHERE chat_id = ?').get(String(chatId)) as { id: string } | undefined
  const id = existing?.id ?? newId('s')
  if (!existing) db().prepare('INSERT INTO shares (id, chat_id) VALUES (?, ?)').run(id, String(chatId))
  return NextResponse.json({ id })
}
