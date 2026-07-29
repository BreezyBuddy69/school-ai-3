import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  const user = await currentUser()
  if (!user) return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 })
  const subject = req.nextUrl.searchParams.get('subject')
  const rows = db().prepare(`
    SELECT p.id, p.subject, p.type, p.name, p.content, p.pinned, p.created_at, p.folder_id, f.name AS folder_name
    FROM projects p LEFT JOIN project_folders f ON f.id = p.folder_id
    WHERE p.user_id = ? ${subject ? 'AND p.subject = ?' : ''}
    ORDER BY p.pinned DESC, p.created_at DESC LIMIT 200
  `).all(...(subject ? [user.id, subject] : [user.id]))
  return NextResponse.json(rows)
}
