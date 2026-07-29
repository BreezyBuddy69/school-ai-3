import { NextRequest, NextResponse } from 'next/server'
import { consumeVerificationCode, createSession } from '@/lib/auth'
import { db, audit, hashIp } from '@/lib/db'
import { allow, failDelay } from '@/lib/rate-limit'

/** Bestätigungscode aus der Mail einlösen — Alternative zum Klick auf den Link. */
export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local'
  const { email, code } = await req.json().catch(() => ({}))
  if (typeof email !== 'string' || typeof code !== 'string' || !/^\d{6}$/.test(code.trim())) {
    return NextResponse.json({ error: 'Bitte gib den 6-stelligen Code aus der Mail ein.' }, { status: 400 })
  }
  const emailKey = email.trim().toLowerCase()
  // Zwei Limits: pro IP (breite Streuung) und pro Konto (gezieltes Raten
  // desselben 6-stelligen Codes über wechselnde IPs hinweg).
  if (!allow(`verify-code:${hashIp(ip)}`, 10, 10 * 60_000) || !allow(`verify-code-acct:${emailKey}`, 8, 15 * 60_000)) {
    return NextResponse.json({ error: 'Zu viele Versuche — fordere einen neuen Code an.' }, { status: 429 })
  }
  const userId = consumeVerificationCode(emailKey, code.trim())
  if (!userId) {
    await failDelay()
    audit('verify_code_failed', emailKey, hashIp(ip))
    return NextResponse.json({ error: 'Code ist falsch oder abgelaufen.' }, { status: 400 })
  }
  db().prepare('UPDATE users SET verified = 1 WHERE id = ?').run(userId)
  await createSession(userId)
  audit('email_verified_code', userId)
  return NextResponse.json({ ok: true })
}
