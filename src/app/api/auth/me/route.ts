import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  const user = await currentUser()
  if (!user) return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 })
  const streak = db().prepare('SELECT current FROM streaks WHERE user_id = ?').get(user.id) as { current: number } | undefined
  return NextResponse.json({
    id: user.id, email: user.email, name: user.name,
    klasse: user.klasse, jahr: user.jahr, profil: user.profil,
    school: user.school, personal: user.personal, tier: user.tier,
    verified: !!user.verified,
    autoActions: !!user.auto_actions,
    streak: streak?.current ?? 0,
    onboarded: !!(user.klasse || user.jahr),
  })
}

/** Profil-Update (Onboarding + Einstellungen). Tier ist hier NICHT schreibbar. */
export async function PATCH(req: NextRequest) {
  const user = await currentUser()
  if (!user) return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 })
  const body = await req.json().catch(() => ({}))
  const fields: Record<string, unknown> = {}
  for (const key of ['name', 'klasse', 'profil', 'school', 'personal'] as const) {
    if (typeof body[key] === 'string') fields[key] = body[key].slice(0, 300) || null
  }
  if (typeof body.jahr === 'number' && body.jahr >= 1 && body.jahr <= 7) fields.jahr = Math.round(body.jahr)
  // Auto-Ausführen von Aktionen: speicherbar für alle, wirksam nur bei Pro/Premium (Chat-Route prüft das Tier).
  if (typeof body.autoActions === 'boolean') fields.auto_actions = body.autoActions ? 1 : 0
  if (Object.keys(fields).length === 0) return NextResponse.json({ ok: true })
  const sets = Object.keys(fields).map((k) => `${k} = ?`).join(', ')
  db().prepare(`UPDATE users SET ${sets} WHERE id = ?`).run(...Object.values(fields) as (string | number | null)[], user.id)
  return NextResponse.json({ ok: true })
}
