import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'

async function ownChat(id: string) {
  const user = await currentUser()
  if (!user) return { user: null, chat: null }
  const chat = db().prepare('SELECT id, subject, title, sources_json, created_at FROM chats WHERE id = ? AND user_id = ? AND deleted_at IS NULL')
    .get(id, user.id) as { id: string; subject: string; title: string | null; sources_json: string; created_at: string } | undefined
  return { user, chat: chat ?? null }
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { user, chat } = await ownChat(id)
  if (!user) return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 })
  if (!chat) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 })
  const messages = db().prepare('SELECT id, role, content, meta_json, created_at FROM messages WHERE chat_id = ? ORDER BY id').all(id)
  return NextResponse.json({ ...chat, sources: JSON.parse(chat.sources_json), messages })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { user, chat } = await ownChat(id)
  if (!user) return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 })
  if (!chat) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 })
  const body = await req.json().catch(() => ({}))
  if (typeof body.title === 'string' && body.title.trim()) {
    db().prepare('UPDATE chats SET title = ? WHERE id = ?').run(body.title.trim().slice(0, 120), id)
  }
  if (Array.isArray(body.sources)) {
    db().prepare('UPDATE chats SET sources_json = ? WHERE id = ?').run(JSON.stringify(body.sources.slice(0, 50)), id)
  }
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { user, chat } = await ownChat(id)
  if (!user) return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 })
  if (!chat) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 })
  db().prepare("UPDATE chats SET deleted_at = datetime('now') WHERE id = ?").run(id)
  return NextResponse.json({ ok: true })
}
