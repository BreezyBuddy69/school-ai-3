import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@/lib/auth'
import { db, hashIp } from '@/lib/db'
import { allow } from '@/lib/rate-limit'
import { notifyFeedback } from '@/lib/n8n'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local'
  if (!allow(`feedback:${hashIp(ip)}`, 5, 10 * 60_000)) {
    return NextResponse.json({ error: 'Zu viel Feedback auf einmal.' }, { status: 429 })
  }
  const user = await currentUser()
  const { text } = await req.json().catch(() => ({}))
  if (typeof text !== 'string' || !text.trim()) return NextResponse.json({ error: 'Leeres Feedback' }, { status: 400 })
  const trimmed = text.trim().slice(0, 4000)
  db().prepare('INSERT INTO feedback (user_id, email, text) VALUES (?, ?, ?)')
    .run(user?.id ?? null, user?.email ?? null, trimmed)
  await notifyFeedback(trimmed, user?.email ?? null, user?.tier)
  return NextResponse.json({ ok: true })
}
