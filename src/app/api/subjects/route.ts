import { NextRequest, NextResponse } from 'next/server'
import { getSubjectTree, readTopic } from '@/lib/subjects'

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('topic')
  if (slug) {
    const topic = readTopic(slug)
    if (!topic) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 })
    return NextResponse.json(topic)
  }
  return NextResponse.json(getSubjectTree())
}
