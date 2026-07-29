import { NextRequest, NextResponse } from 'next/server'
import { findUserByEmail, verifyPassword, createSession } from '@/lib/auth'
import { sendVerifyMail } from '@/lib/mailer'
import { allow, failDelay } from '@/lib/rate-limit'
import { audit, hashIp } from '@/lib/db'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local'
  if (!allow(`login:${hashIp(ip)}`, 10, 10 * 60_000)) {
    return NextResponse.json({ error: 'Zu viele Versuche — probier es in ein paar Minuten nochmal.' }, { status: 429 })
  }
  const { email, password } = await req.json().catch(() => ({}))
  const user = typeof email === 'string' ? findUserByEmail(email) : null
  if (!user || typeof password !== 'string' || !verifyPassword(password, user.pass_hash)) {
    await failDelay()
    audit('login_failed', typeof email === 'string' ? email : '?', hashIp(ip))
    return NextResponse.json({ error: 'E-Mail oder Passwort stimmt nicht.' }, { status: 401 })
  }
  if (!user.verified) {
    // Passwort stimmt zwar, aber niemand hat je bewiesen, dass die Adresse
    // ihm gehört — kein Login ohne Bestätigungscode (oder Mail-Link).
    if (allow(`login-verify-resend:${user.id}`, 3, 10 * 60_000)) {
      await sendVerifyMail(user.id, user.email)
    }
    audit('login_blocked_unverified', user.email, hashIp(ip))
    return NextResponse.json(
      { error: 'Bitte bestätige zuerst deine E-Mail — wir haben dir gerade einen Code geschickt.', reason: 'unverified' },
      { status: 403 }
    )
  }
  await createSession(user.id)
  audit('login', user.email, hashIp(ip))
  return NextResponse.json({ ok: true })
}
