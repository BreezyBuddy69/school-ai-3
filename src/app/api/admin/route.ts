import { NextRequest, NextResponse } from 'next/server'
import { randomBytes, timingSafeEqual } from 'node:crypto'
import { db } from '@/lib/db'

// Jaydens Cockpit-API. Auth: Bearer ADMIN_TOKEN (env). Ohne gesetztes Token
// ist /admin komplett deaktiviert — es gibt keinen Default-Zugang.

function authorized(req: NextRequest): boolean {
  const token = process.env.ADMIN_TOKEN
  if (!token) return false
  const header = req.headers.get('authorization') ?? ''
  const provided = header.replace(/^Bearer\s+/i, '')
  const a = Buffer.from(provided)
  const b = Buffer.from(token)
  return a.length === b.length && timingSafeEqual(a, b)
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
  const d = db()
  const stats = {
    users: (d.prepare('SELECT COUNT(*) n FROM users').get() as { n: number }).n,
    byTier: d.prepare('SELECT tier, COUNT(*) n FROM users GROUP BY tier').all(),
    messagesToday: (d.prepare("SELECT COALESCE(SUM(count),0) n FROM usage WHERE day = date('now') AND kind = 'messages'").get() as { n: number }).n,
    messages7d: (d.prepare("SELECT COALESCE(SUM(count),0) n FROM usage WHERE day >= date('now','-7 days') AND kind = 'messages'").get() as { n: number }).n,
    messagesByDay: d.prepare("SELECT day, SUM(count) n FROM usage WHERE day >= date('now','-6 days') AND kind = 'messages' GROUP BY day ORDER BY day").all(),
    studio7d: d.prepare("SELECT kind, SUM(count) n FROM usage WHERE day >= date('now','-7 days') AND kind LIKE 'studio:%' GROUP BY kind").all(),
    codes: d.prepare('SELECT tier, COUNT(*) total, SUM(CASE WHEN redeemed_count >= max_redemptions THEN 1 ELSE 0 END) voll FROM codes WHERE revoked = 0 GROUP BY tier').all(),
    codeList: d.prepare('SELECT code, tier, redeemed_count, max_redemptions, revoked, expires_at, created_at FROM codes ORDER BY created_at DESC LIMIT 200').all(),
    redemptions: d.prepare('SELECT r.code, r.redeemed_at, u.email FROM code_redemptions r JOIN users u ON u.id = r.user_id ORDER BY r.redeemed_at DESC LIMIT 50').all(),
    feedback: d.prepare('SELECT id, email, text, created_at FROM feedback ORDER BY id DESC LIMIT 50').all(),
    audit: d.prepare('SELECT ts, event, detail FROM audit_log ORDER BY id DESC LIMIT 100').all(),
  }
  return NextResponse.json(stats)
}

/** Aktionen: Codes generieren / Code sperren. */
export async function POST(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
  const body = await req.json().catch(() => ({}))
  const d = db()

  if (body.action === 'generate') {
    const tier = body.tier === 'premium' ? 'premium' : 'pro'
    const count = Math.min(Math.max(Number(body.count) || 1, 1), 100)
    // Einlösungen pro Code frei wählbar (Klassen-Codes: 1 Code, N Schüler:innen).
    // Ohne Angabe gelten die alten Defaults: Pro 1×, Premium 4×.
    const uses = Math.min(Math.max(Number(body.uses) || (tier === 'premium' ? 4 : 1), 1), 100)
    const codes: string[] = []
    const ins = d.prepare('INSERT INTO codes (code, tier, max_redemptions) VALUES (?, ?, ?)')
    for (let i = 0; i < count; i++) {
      const part = () => randomBytes(2).toString('hex').toUpperCase()
      const code = `LGKI-${tier === 'premium' ? 'PREM' : 'PRO'}-${part()}-${part()}`
      ins.run(code, tier, uses)
      codes.push(code)
    }
    return NextResponse.json({ ok: true, codes, uses })
  }

  if (body.action === 'revoke' && typeof body.code === 'string') {
    d.prepare('UPDATE codes SET revoked = 1 WHERE code = ?').run(body.code.toUpperCase())
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Unbekannte Aktion' }, { status: 400 })
}
