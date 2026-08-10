import { NextRequest, NextResponse } from 'next/server'
import { registerUser, findUserByEmail, updatePendingRegistration } from '@/lib/auth'
import { sendVerifyMail } from '@/lib/mailer'
import { logRegistration } from '@/lib/n8n'
import { allow, failDelay } from '@/lib/rate-limit'
import { audit, hashIp } from '@/lib/db'

// Registrierung loggt NICHT mehr automatisch ein — Login gibt es erst, wenn
// der Bestätigungslink aus der Mail geklickt wurde (siehe /api/auth/verify).
// Sonst könnte jede fremde E-Mail-Adresse sofort benutzt werden, ohne dass
// deren Besitzer je zugestimmt hat.
export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local'
  if (!allow(`register:${hashIp(ip)}`, 5, 10 * 60_000)) {
    return NextResponse.json({ error: 'Zu viele Versuche — probier es in ein paar Minuten nochmal.' }, { status: 429 })
  }
  const { email, password, name } = await req.json().catch(() => ({}))
  if (typeof email !== 'string' || !email.includes('@') || email.length > 200) {
    return NextResponse.json({ error: 'Bitte gib eine gültige E-Mail an.' }, { status: 400 })
  }
  if (typeof password !== 'string' || password.length < 8) {
    return NextResponse.json({ error: 'Passwort braucht mindestens 8 Zeichen.' }, { status: 400 })
  }

  const existing = findUserByEmail(email)
  if (existing?.verified) {
    await failDelay()
    return NextResponse.json({ error: 'Diese E-Mail ist schon registriert — melde dich an.' }, { status: 409 })
  }

  let user
  if (existing) {
    // Noch nie bestätigt: Adresse gehört (noch) niemandem bewiesenermassen —
    // der aktuelle Versuch darf Passwort/Name neu setzen. Wer die Mail nie
    // bekommt (weil ihm die Adresse nicht gehört), kommt trotzdem nie rein.
    if (!allow(`register-claim:${existing.id}`, 5, 10 * 60_000)) {
      return NextResponse.json({ error: 'Zu viele Versuche — probier es in ein paar Minuten nochmal.' }, { status: 429 })
    }
    updatePendingRegistration(existing.id, password, typeof name === 'string' ? name : undefined)
    user = existing
    audit('register_reclaim', user.email, hashIp(ip))
  } else {
    user = registerUser(email, password, typeof name === 'string' ? name : undefined)
    audit('register', user.email, hashIp(ip))
    logRegistration(user.email, user.tier)
  }

  // Kein Ersatzweg, wenn die Mail nicht rausgeht (N8N_SECRET fehlt, n8n unten):
  // kein Code in der Response, keine Auto-Freischaltung. Beides hiesse, dass
  // sich jede:r mit einer fremden Adresse anmelden kann — der Punkt der
  // Bestätigung ist ja gerade, dass nur der Besitzer der Adresse weiterkommt.
  // Das Konto bleibt unbestätigt liegen; ein späterer Versuch übernimmt es.
  if (!(await sendVerifyMail(user.id, user.email))) {
    audit('register_mail_failed', user.email, hashIp(ip))
    return NextResponse.json(
      { error: 'Wir können dir gerade keine Bestätigungsmail schicken. Bitte probier es in ein paar Minuten nochmal.' },
      { status: 503 }
    )
  }
  return NextResponse.json({ ok: true, verifyMailSent: true })
}
