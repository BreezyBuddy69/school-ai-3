import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@/lib/auth'
import { db, audit, hashIp } from '@/lib/db'
import { allow, failDelay } from '@/lib/rate-limit'
import { logRedemption } from '@/lib/n8n'

// Einlösung nach dem Sable-Plattform-Muster: EINE Transaktion, deren UPDATE
// nur greift, wenn der Code wirklich noch frei ist — Doppel-Einlösung ist
// damit auch bei gleichzeitigen Requests strukturell unmöglich.
// Premium-Codes: max_redemptions = 4 (du + 3 Freunde).

/** Tier gilt bis Schuljahresende (15. August). */
function schuljahresEnde(): string {
  const now = new Date()
  const year = now.getMonth() >= 7 && now.getDate() > 15 ? now.getFullYear() + 1 : (now.getMonth() >= 8 ? now.getFullYear() + 1 : now.getFullYear())
  const end = new Date(Date.UTC(year, 7, 15))
  if (end.getTime() < Date.now()) end.setUTCFullYear(end.getUTCFullYear() + 1)
  return end.toISOString()
}

const DEMO_CODES = ['LGKI-PRO-DEMO-0001', 'LGKI-PREM-DEMO-0001']

/**
 * Zwei feste Testcodes für die lokale Entwicklung, damit der Einlöse-Flow ohne
 * echten Pro-Code vorführbar ist. NICHT an `isDemoMode()` hängen: die Live-Instanz
 * lief zeitweise ohne N8N_SECRET, und dann verschenkte ein öffentlich bekannter
 * String Pro/Premium. In Produktion werden die Codes darum aktiv entfernt —
 * auch die, die eine frühere Version schon in die DB geschrieben hat.
 */
function seedDemoCodes() {
  const d = db()
  if (process.env.NODE_ENV === 'production') {
    const del = d.prepare('DELETE FROM codes WHERE code = ?')
    for (const c of DEMO_CODES) del.run(c)
    return
  }
  const ins = d.prepare('INSERT OR IGNORE INTO codes (code, tier, max_redemptions) VALUES (?, ?, ?)')
  ins.run(DEMO_CODES[0], 'pro', 1)
  ins.run(DEMO_CODES[1], 'premium', 4)
}

export async function POST(req: NextRequest) {
  const user = await currentUser()
  if (!user) return NextResponse.json({ error: 'Melde dich zuerst an, dann kannst du deinen Code einlösen.' }, { status: 401 })

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local'
  const ipH = hashIp(ip)
  if (!allow(`redeem:${ipH}`, 8, 10 * 60_000)) {
    audit('redeem_ratelimited', user.email, ipH)
    return NextResponse.json({ error: 'Zu viele Versuche — warte ein paar Minuten.' }, { status: 429 })
  }

  const { code } = await req.json().catch(() => ({}))
  const normalized = String(code ?? '').toUpperCase().replace(/\s/g, '')
  if (!/^LGKI-[A-Z]+-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(normalized)) {
    await failDelay()
    return NextResponse.json({ error: 'Das sieht nicht wie ein LG-KI-Code aus (Format: LGKI-PRO-XXXX-XXXX).' }, { status: 422 })
  }

  seedDemoCodes()
  const d = db()
  d.exec('BEGIN IMMEDIATE')
  try {
    // Hat dieser Account den Code schon benutzt?
    const already = d.prepare('SELECT 1 FROM code_redemptions WHERE code = ? AND user_id = ?').get(normalized, user.id)
    if (already) {
      d.exec('ROLLBACK')
      await failDelay()
      return NextResponse.json({ error: 'Diesen Code hast du schon eingelöst.' }, { status: 409 })
    }
    // Atomarer Kern: zählt nur hoch, wenn noch Plätze frei sind.
    const result = d.prepare(`
      UPDATE codes SET redeemed_count = redeemed_count + 1
      WHERE code = ? AND revoked = 0 AND redeemed_count < max_redemptions
        AND (expires_at IS NULL OR expires_at > datetime('now'))
    `).run(normalized)
    if (result.changes === 0) {
      d.exec('ROLLBACK')
      await failDelay()
      const exists = d.prepare('SELECT redeemed_count, max_redemptions, revoked FROM codes WHERE code = ?').get(normalized) as { redeemed_count: number; max_redemptions: number; revoked: number } | undefined
      audit('redeem_failed', `${user.email} ${normalized}`, ipH)
      if (!exists) return NextResponse.json({ error: 'Ungültiger Code. Dein Code wurde NICHT verbraucht.' }, { status: 404 })
      if (exists.revoked) return NextResponse.json({ error: 'Dieser Code wurde gesperrt.' }, { status: 410 })
      return NextResponse.json({ error: 'Dieser Code ist bereits vollständig eingelöst.' }, { status: 409 })
    }
    const codeRow = d.prepare('SELECT tier, redeemed_count, max_redemptions FROM codes WHERE code = ?').get(normalized) as { tier: 'pro' | 'premium'; redeemed_count: number; max_redemptions: number }
    d.prepare('INSERT INTO code_redemptions (code, user_id) VALUES (?, ?)').run(normalized, user.id)
    // Upgrade, nie Downgrade: Premium bleibt Premium, auch wenn ein Pro-Code kommt.
    const newTier = user.tier === 'premium' ? 'premium' : codeRow.tier
    d.prepare('UPDATE users SET tier = ?, tier_expires = ? WHERE id = ?').run(newTier, schuljahresEnde(), user.id)
    // Code ist verkauft und jetzt verbraucht (letzte freie Einlösung) — er
    // verschwindet komplett aus der DB, damit „verkaufte Codes" nicht als
    // gültig herumliegen. Einlösungs-Historie lebt danach nur noch im
    // audit_log und im Google-Sheet (logRedemption unten).
    const consumed = codeRow.redeemed_count >= codeRow.max_redemptions
    if (consumed) {
      d.prepare('DELETE FROM code_redemptions WHERE code = ?').run(normalized)
      d.prepare('DELETE FROM codes WHERE code = ?').run(normalized)
    }
    d.exec('COMMIT')
    audit('redeem_ok', `${user.email} ${normalized} → ${newTier}${consumed ? ' (Code verbraucht, gelöscht)' : ''}`, ipH)
    logRedemption(user.email, normalized, newTier)
    return NextResponse.json({ ok: true, tier: newTier, bis: schuljahresEnde().slice(0, 10) })
  } catch (e) {
    d.exec('ROLLBACK')
    audit('redeem_error', String(e), ipH)
    return NextResponse.json({ error: 'Serverfehler — dein Code wurde NICHT verbraucht.' }, { status: 500 })
  }
}
