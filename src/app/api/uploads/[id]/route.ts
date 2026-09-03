import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@/lib/auth'
import { deleteUpload } from '@/lib/uploads'

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await currentUser()
  if (!user) return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 })
  deleteUpload(user.id, id)
  return NextResponse.json({ ok: true })
}
