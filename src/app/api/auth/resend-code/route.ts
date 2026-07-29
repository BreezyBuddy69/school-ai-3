import { NextRequest, NextResponse } from 'next/server'
import { findUserByEmail } from '@/lib/auth'
import { sendVerifyMail } from '@/lib/mailer'
import { allow } from '@/lib/rate-limit'
import { audit, hashIp } from '@/lib/db'

// Unauthentifiziert (der Nutzer hat ja noch keine Session) — antwortet darum
// immer gleich ({ok:true}), egal ob das Konto existiert (User-Enumeration).
export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local'
  if (!allow(`resend-code:${hashIp(ip)}`, 5, 10 * 60_000)) {
    return NextResponse.json({ error: 'Zu viele Versuche — warte ein paar Minuten.' }, { status: 429 })
  }
  const { email } = await req.json().catch(() => ({}))
  let demo: { verifyLink?: string; verifyCode?: string } = {}
  if (typeof email === 'string' && email.includes('@')) {
    const user = findUserByEmail(email)
    if (user && !user.verified && allow(`resend-code-acct:${user.id}`, 3, 10 * 60_000)) {
      const verify = await sendVerifyMail(user.id, user.email)
      demo = { verifyLink: verify.link, verifyCode: verify.code }
      audit('resend_code', user.email, hashIp(ip))
    }
  }
  return NextResponse.json({ ok: true, ...demo })
}
