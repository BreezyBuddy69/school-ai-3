import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await currentUser()
  if (!user) return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 })
  const body = await req.json().catch(() => ({}))
  if (typeof body.name === 'string' && body.name.trim()) {
    db().prepare('UPDATE project_folders SET name = ? WHERE id = ? AND user_id = ?').run(body.name.trim().slice(0, 80), id, user.id)
  }
  return NextResponse.json({ ok: true })
}
