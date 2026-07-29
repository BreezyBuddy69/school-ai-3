import { scryptSync, randomBytes, randomInt, timingSafeEqual, createHash } from 'node:crypto'
import { cookies } from 'next/headers'
import { db, newId } from './db'

// Bewusst handgerollt statt Supabase/NextAuth: eine Schule, ein Server,
// ein Cookie. scrypt aus node:crypto (kein bcrypt-Native-Build), Sessions
// als zufällige Tokens, in der DB nur als SHA-256-Hash gespeichert.

const COOKIE = 'lgki_session'
const SESSION_DAYS = 180

export type Tier = 'free' | 'pro' | 'premium'

export interface User {
  id: string
  email: string
  name: string | null
  klasse: string | null
  jahr: number | null
  profil: string | null
  school: string | null
  personal: string | null
  tier: Tier
  tier_expires: string | null
  verified: number
  auto_actions: number
}

// ── Passwörter ───────────────────────────────────────────────────────────────

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `scrypt$${salt}$${hash}`
}

export function verifyPassword(password: string, stored: string): boolean {
  const [scheme, salt, hash] = stored.split('$')
  if (scheme !== 'scrypt' || !salt || !hash) return false
  const candidate = scryptSync(password, salt, 64)
  const expected = Buffer.from(hash, 'hex')
  return candidate.length === expected.length && timingSafeEqual(candidate, expected)
}

// ── Sessions ─────────────────────────────────────────────────────────────────

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

export async function createSession(userId: string): Promise<void> {
  const token = randomBytes(32).toString('hex')
  const expires = new Date(Date.now() + SESSION_DAYS * 86400000)
  db().prepare('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)')
    .run(hashToken(token), userId, expires.toISOString())
  const jar = await cookies()
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    expires,
    path: '/',
  })
}

export async function destroySession(): Promise<void> {
  const jar = await cookies()
  const token = jar.get(COOKIE)?.value
  if (token) db().prepare('DELETE FROM sessions WHERE token_hash = ?').run(hashToken(token))
  jar.delete(COOKIE)
}

/** Aktueller Nutzer — Tier wird HIER entschieden, serverseitig, nie im Client. */
export async function currentUser(): Promise<User | null> {
  const jar = await cookies()
  const token = jar.get(COOKIE)?.value
  if (!token) return null
  const row = db().prepare(`
    SELECT u.id, u.email, u.name, u.klasse, u.jahr, u.profil, u.school, u.personal, u.tier, u.tier_expires, u.verified, u.auto_actions
    FROM sessions s JOIN users u ON u.id = s.user_id
    WHERE s.token_hash = ? AND s.expires_at > datetime('now')
  `).get(hashToken(token)) as User | undefined
  if (!row) return null
  // Abgelaufene Tiers fallen automatisch auf free zurück (Schuljahres-Codes).
  if (row.tier !== 'free' && row.tier_expires && row.tier_expires < new Date().toISOString()) {
    db().prepare("UPDATE users SET tier = 'free', tier_expires = NULL WHERE id = ?").run(row.id)
    row.tier = 'free'
    row.tier_expires = null
  }
  return row
}

export async function requireUser(): Promise<User> {
  const user = await currentUser()
  if (!user) throw new AuthError('Nicht angemeldet')
  return user
}

export class AuthError extends Error {}

// ── Registrierung / Login ────────────────────────────────────────────────────

export function registerUser(email: string, password: string, name?: string): User {
  const id = newId('u')
  db().prepare('INSERT INTO users (id, email, pass_hash, name) VALUES (?, ?, ?, ?)')
    .run(id, email.trim().toLowerCase(), hashPassword(password), name?.trim() || null)
  return { id, email: email.trim().toLowerCase(), name: name?.trim() || null, klasse: null, jahr: null, profil: null, school: 'LG Vaduz', personal: null, tier: 'free', tier_expires: null, verified: 0, auto_actions: 0 }
}

/**
 * Überschreibt Passwort (+ optional Namen) eines noch NIE bestätigten Kontos.
 * Solange niemand die E-Mail-Adresse bewiesen hat, gehört der Account
 * jedem, der sie zuletzt registriert — verifiziert wird trotzdem erst durch
 * den Mail-Link, darum ist das Fenster für Missbrauch wirkungslos.
 */
export function updatePendingRegistration(userId: string, password: string, name?: string) {
  const d = db()
  d.prepare('UPDATE users SET pass_hash = ? WHERE id = ?').run(hashPassword(password), userId)
  if (name?.trim()) d.prepare('UPDATE users SET name = ? WHERE id = ?').run(name.trim(), userId)
}

export function findUserByEmail(email: string): (User & { pass_hash: string }) | null {
  const row = db().prepare('SELECT id, email, name, klasse, jahr, profil, school, personal, tier, tier_expires, verified, auto_actions, pass_hash FROM users WHERE email = ?')
    .get(email.trim().toLowerCase()) as (User & { pass_hash: string }) | undefined
  return row ?? null
}

// ── Einmal-Tokens (E-Mail-Bestätigung, Passwort-Reset) ──────────────────────

export function createAuthToken(userId: string, kind: 'verify' | 'reset'): string {
  const token = randomBytes(32).toString('hex')
  const hours = kind === 'verify' ? 48 : 1
  const d = db()
  // Alte Tokens desselben Zwecks ersetzen — es gilt immer nur der neueste.
  d.prepare('DELETE FROM auth_tokens WHERE user_id = ? AND kind = ?').run(userId, kind)
  d.prepare('INSERT INTO auth_tokens (token_hash, user_id, kind, expires_at) VALUES (?, ?, ?, ?)')
    .run(hashToken(token), userId, kind, new Date(Date.now() + hours * 3600_000).toISOString())
  return token
}

/** Löst einen Token ein (Einmalgebrauch) und liefert die user_id — oder null. */
export function consumeAuthToken(token: string, kind: 'verify' | 'reset'): string | null {
  const d = db()
  const row = d.prepare("SELECT user_id FROM auth_tokens WHERE token_hash = ? AND kind = ? AND expires_at > datetime('now')")
    .get(hashToken(token), kind) as { user_id: string } | undefined
  if (!row) return null
  d.prepare('DELETE FROM auth_tokens WHERE token_hash = ?').run(hashToken(token))
  return row.user_id
}

export function updatePassword(userId: string, password: string) {
  const d = db()
  d.prepare('UPDATE users SET pass_hash = ? WHERE id = ?').run(hashPassword(password), userId)
  // Alle Sessions beenden — wer das Passwort resettet, wirft Fremde raus.
  d.prepare('DELETE FROM sessions WHERE user_id = ?').run(userId)
}

// ── Bestätigungscode (Alternative zum Mail-Link) ────────────────────────────
// Der Link zeigt auf NEXT_PUBLIC_APP_URL — bei wechselnden Dev-Tunneln (ngrok)
// oder noch unentschiedener Domain ist das unzuverlässig. Der Code funktioniert
// unabhängig davon: er wird direkt auf derselben Seite eingegeben.

const CODE_MINUTES = 30

export function createVerificationCode(userId: string): string {
  const code = String(randomInt(100000, 1000000))
  const expires = new Date(Date.now() + CODE_MINUTES * 60_000).toISOString()
  db().prepare('UPDATE users SET verify_code_hash = ?, verify_code_expires = ? WHERE id = ?')
    .run(hashToken(code), expires, userId)
  return code
}

/** Löst einen Code ein (Einmalgebrauch) und liefert die user_id — oder null. */
export function consumeVerificationCode(email: string, code: string): string | null {
  const d = db()
  const row = d.prepare('SELECT id, verify_code_hash, verify_code_expires FROM users WHERE email = ?')
    .get(email.trim().toLowerCase()) as { id: string; verify_code_hash: string | null; verify_code_expires: string | null } | undefined
  if (!row?.verify_code_hash || !row.verify_code_expires) return null
  if (row.verify_code_expires < new Date().toISOString()) return null
  if (hashToken(code.trim()) !== row.verify_code_hash) return null
  d.prepare('UPDATE users SET verify_code_hash = NULL, verify_code_expires = NULL WHERE id = ?').run(row.id)
  return row.id
}
