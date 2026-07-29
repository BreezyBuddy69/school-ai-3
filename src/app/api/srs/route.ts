import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@/lib/auth'
import { db, touchStreak } from '@/lib/db'
import { nextDue } from '@/lib/srs'

/** Fällige Karten (Leitner-Queue). */
export async function GET() {
  const user = await currentUser()
  if (!user) return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 })
  const due = db().prepare(`
    SELECT c.id, c.front, c.back, c.box, p.subject, p.name AS deck
    FROM cards c JOIN projects p ON p.id = c.project_id
    WHERE c.user_id = ? AND c.due_at <= datetime('now')
    ORDER BY c.due_at LIMIT 50
  `).all(user.id)
  const total = db().prepare('SELECT COUNT(*) AS n FROM cards WHERE user_id = ?').get(user.id) as { n: number }
  return NextResponse.json({ due, total: total.n })
}

/** Antwort auf eine Karte: richtig/falsch → Box + Fälligkeit anpassen. */
export async function POST(req: NextRequest) {
  const user = await currentUser()
  if (!user) return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 })
  const { cardId, correct } = await req.json().catch(() => ({}))
  const card = db().prepare('SELECT id, box FROM cards WHERE id = ? AND user_id = ?').get(Number(cardId), user.id) as { id: number; box: number } | undefined
  if (!card) return NextResponse.json({ error: 'Karte nicht gefunden' }, { status: 404 })
  const { box, dueAt } = nextDue(card.box, !!correct)
  db().prepare('UPDATE cards SET box = ?, due_at = ?, reps = reps + 1, lapses = lapses + ? WHERE id = ?')
    .run(box, dueAt, correct ? 0 : 1, card.id)
  touchStreak(user.id)
  return NextResponse.json({ ok: true, box })
}
