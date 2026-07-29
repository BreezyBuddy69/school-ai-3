import { sendMail, isDemoMode } from './n8n'
import { createAuthToken, createVerificationCode } from './auth'

// Bestätigungs- und Reset-Mails. Verify-Link und -Code sind ein De-facto-Login
// (beide erzeugen beim Einlösen eine Session) — sie dürfen darum NIE in einer
// API-Response an einen unauthentifizierten Aufrufer landen. Ausnahme: reiner
// Demo-Betrieb ohne N8N_BASE, wo es schlicht keinen Mail-Versand gibt und die
// App den kompletten Flow trotzdem vorführbar halten muss.
//
// Der Code ist der primäre Weg (auf derselben Seite eingebbar, funktioniert
// unabhängig von NEXT_PUBLIC_APP_URL) — der Link ist nur eine Abkürzung für
// den Fall, dass die öffentliche URL gerade stabil ist.

function appUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:8100'
}

export async function sendVerifyMail(userId: string, email: string): Promise<{ sent: boolean; link?: string; code?: string }> {
  const token = createAuthToken(userId, 'verify')
  const link = `${appUrl()}/api/auth/verify?token=${token}`
  const code = createVerificationCode(userId)
  const sent = await sendMail(
    email,
    'LG KI — bestätige deine E-Mail',
    `Hey!\n\nDein Bestätigungscode für LG KI:\n\n${code}\n\nGib ihn auf der Anmelde-Seite ein (gilt 30 Minuten). Alternativ direkt per Link: ${link}\n\nFalls du dich nicht registriert hast, ignorier diese Mail einfach.\n\n— LG KI · von Schülern, für Schüler`
  )
  if (!sent) console.log(`[lgki] Bestätigungs-Code für ${email} (nicht versendet): ${code} — Link: ${link}`)
  return { sent, ...(isDemoMode() ? { link, code } : {}) }
}

export async function sendResetMail(userId: string, email: string): Promise<boolean> {
  const token = createAuthToken(userId, 'reset')
  const link = `${appUrl()}/reset?token=${token}`
  const sent = await sendMail(
    email,
    'LG KI — Passwort zurücksetzen',
    `Hey!\n\nMit diesem Link kannst du dein LG-KI-Passwort neu setzen (gilt 1 Stunde):\n\n${link}\n\nFalls du das nicht warst, ignorier diese Mail — dein Passwort bleibt unverändert.\n\n— LG KI`
  )
  if (!sent) {
    // Mail-Workflow fehlt noch: Link nur ins Server-Log (nie in die Response).
    console.log(`[lgki] Passwort-Reset für ${email} (Mail nicht konfiguriert): ${link}`)
  }
  return sent
}
