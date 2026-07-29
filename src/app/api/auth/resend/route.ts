import { NextResponse } from 'next/server'
import { currentUser } from '@/lib/auth'
import { sendVerifyMail } from '@/lib/mailer'
import { allow } from '@/lib/rate-limit'

/** Bestätigungs-Mail erneut senden (nur eigener, angemeldeter Account). */
export async function POST() {
  const user = await currentUser()
  if (!user) return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 })
  if (user.verified) return NextResponse.json({ ok: true, alreadyVerified: true })
  if (!allow(`resend:${user.id}`, 3, 10 * 60_000)) {
    return NextResponse.json({ error: 'Gerade erst gesendet — schau in dein Postfach (auch Spam).' }, { status: 429 })
  }
  const verify = await sendVerifyMail(user.id, user.email)
  return NextResponse.json({
    ok: true,
    sent: verify.sent,
    ...(verify.link ? { verifyLink: verify.link } : {}),
    ...(verify.code ? { verifyCode: verify.code } : {}),
  })
}
