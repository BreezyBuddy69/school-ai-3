import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

/** Öffentliche Read-only-Ansicht eines geteilten Chats. */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const share = db().prepare('SELECT chat_id FROM shares WHERE id = ?').get(id) as { chat_id: string } | undefined
  if (!share) return NextResponse.json({ error: 'Link nicht gefunden' }, { status: 404 })
  const chat = db().prepare('SELECT subject, title FROM chats WHERE id = ? AND deleted_at IS NULL').get(share.chat_id) as { subject: string; title: string | null } | undefined
  if (!chat) return NextResponse.json({ error: 'Chat wurde gelöscht' }, { status: 404 })
  const messages = db().prepare('SELECT role, content FROM messages WHERE chat_id = ? ORDER BY id').all(share.chat_id)
  return NextResponse.json({ subject: chat.subject, title: chat.title, messages })
}
