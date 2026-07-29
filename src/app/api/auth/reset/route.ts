import { NextRequest, NextResponse } from 'next/server'
import { consumeAuthToken, updatePassword, createSession } from '@/lib/auth'
import { audit, db } from '@/lib/db'
import { failDelay } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  const { token, password } = await req.json().catch(() => ({}))
  if (typeof password !== 'string' || password.length < 8) {
    return NextResponse.json({ error: 'Passwort braucht mindestens 8 Zeichen.' }, { status: 400 })
  }
  const userId = typeof token === 'string' ? consumeAuthToken(token, 'reset') : null
  if (!userId) {
    await failDelay()
    return NextResponse.json({ error: 'Der Link ist ungültig oder abgelaufen — fordere einen neuen an.' }, { status: 400 })
  }
  updatePassword(userId, password)
  // Der Reset-Link kam per Mail an — wer ihn einlösen konnte, hat die
  // Adresse damit ebenso bewiesen wie über den Bestätigungslink.
  db().prepare('UPDATE users SET verified = 1 WHERE id = ?').run(userId)
  await createSession(userId)
  audit('password_reset', userId)
  return NextResponse.json({ ok: true })
}
