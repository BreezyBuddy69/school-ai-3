import { sendMail } from './n8n'
import { createAuthToken, createVerificationCode } from './auth'

// Bestätigungs- und Reset-Mails. Verify-Link und -Code sind ein De-facto-Login
// (beide erzeugen beim Einlösen eine Session) — sie verlassen diese Datei
// darum ausschliesslich per Mail. Keine Ausnahme, auch nicht ohne
// konfigurierten Mailversand: ein Code, der neben dem Eingabefeld steht,
// beweist nichts. Wer die Mail nicht bekommt, besitzt die Adresse nicht.
//
// Der Code ist der primäre Weg (auf derselben Seite eingebbar) — der Link ist
// nur eine Abkürzung. Beide Mails formuliert n8n aus einem festen Template;
// von hier gehen nur Token und Code raus, die Domain im Link steht in n8n.

export async function sendVerifyMail(userId: string, email: string): Promise<boolean> {
  const token = createAuthToken(userId, 'verify')
  const code = createVerificationCode(userId)
  const sent = await sendMail(email, 'verify', token, code)
  // n8n unten: Code/Token nur ins Server-Log (nie in die Response).
  // Der Aufrufer entscheidet, was er dem Nutzer sagt.
  if (!sent) console.log(`[lgki] Bestätigungs-Code für ${email} (nicht versendet): ${code}`)
  return sent
}

export async function sendResetMail(userId: string, email: string): Promise<boolean> {
  const token = createAuthToken(userId, 'reset')
  const sent = await sendMail(email, 'reset', token)
  if (!sent) console.log(`[lgki] Passwort-Reset für ${email} (nicht versendet), Token: ${token}`)
  return sent
}
