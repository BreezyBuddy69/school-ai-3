import { NextRequest, NextResponse } from 'next/server'
import { getSubjectTree, readTopic, listSections, searchTopics } from '@/lib/subjects'

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams

  // Volltextsuche über Titel UND Inhalt — findet "Photosynthese" auch dann,
  // wenn die Datei "zellstoffwechsel.md" heisst. Kein LLM, kein Token.
  const q = p.get('q')
  if (q) return NextResponse.json({ hits: searchTopics(q, p.get('subject') ?? undefined) })

  // Abschnitte ("Lernziele") eines Themas für die Feinauswahl im Picker.
  const sectionsOf = p.get('sections')
  if (sectionsOf) return NextResponse.json({ sections: listSections(sectionsOf) })

  const slug = p.get('topic')
  if (slug) {
    const topic = readTopic(slug)
    if (!topic) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 })
    return NextResponse.json(topic)
  }
  return NextResponse.json(getSubjectTree())
}
