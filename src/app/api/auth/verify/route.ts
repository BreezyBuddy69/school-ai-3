import { NextRequest, NextResponse } from 'next/server'
import { consumeAuthToken, createSession } from '@/lib/auth'
import { db, audit } from '@/lib/db'

/**
 * Klick auf den Link in der Bestätigungs-Mail (GET, öffnet im Browser).
 * Das IST der Login: nur wer die Mailbox kontrolliert, kann diesen Link
 * überhaupt aufrufen — Registrierung selbst loggt niemanden mehr ein.
 */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token') ?? ''
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
  // Hinter Tunnel/Proxy zeigt req.url auf localhost — öffentliche URL gewinnt.
  const origin = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin
  const userId = token ? consumeAuthToken(token, 'verify') : null
  if (!userId) {
    return NextResponse.redirect(`${origin}${base}/login?verify=expired`)
  }
  db().prepare('UPDATE users SET verified = 1 WHERE id = ?').run(userId)
  await createSession(userId)
  audit('email_verified', userId)
  return NextResponse.redirect(`${origin}${base}/chat?verified=1`)
}
