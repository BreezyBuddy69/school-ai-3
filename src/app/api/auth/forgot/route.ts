import { NextRequest, NextResponse } from 'next/server'
import { findUserByEmail } from '@/lib/auth'
import { sendResetMail } from '@/lib/mailer'
import { allow } from '@/lib/rate-limit'
import { audit, hashIp } from '@/lib/db'

// Antwortet IMMER gleich ({ok:true}) — ob die E-Mail existiert, verrät der
// Endpunkt nicht (User-Enumeration). Der Reset-Link geht nur per Mail raus
// (oder ins Server-Log, solange lgki-mail fehlt) — nie in die Response.

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local'
  if (!allow(`forgot:${hashIp(ip)}`, 5, 10 * 60_000)) {
    return NextResponse.json({ error: 'Zu viele Versuche — warte ein paar Minuten.' }, { status: 429 })
  }
  const { email } = await req.json().catch(() => ({}))
  if (typeof email === 'string' && email.includes('@')) {
    const user = findUserByEmail(email)
    if (user) {
      await sendResetMail(user.id, user.email)
      audit('reset_requested', user.email, hashIp(ip))
    }
  }
  return NextResponse.json({ ok: true })
}
