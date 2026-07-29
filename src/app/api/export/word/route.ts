import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { gateWordExport } from '@/lib/tiers'
import { renderWordSummary, renderWordFlashcards, renderWordQuiz, type WordMeta, type WordQuizQuestion } from '@/lib/docx'
import type { SummaryConfig } from '@/app/api/studio/[tool]/route'

// Word-Export für alle drei textbasierten Studio-Tools (Zusammenfassung,
// Lernkarten, Quiz) — Mindmap/Podcast haben eigene Export-Wege (PNG/Audio).

const NIVEAU_LABEL: Record<string, string> = { grundlagen: 'Grundlagen', solide: 'Solide', matura: 'Matura' }
const NAME_PREFIX: Record<string, string> = { zusammenfassung: 'Zusammenfassung', lernkarten: 'Lernkarten', quiz: 'Quiz' }

export async function POST(req: NextRequest) {
  const user = await currentUser()
  if (!user) return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 })
  const gate = gateWordExport(user.tier)
  if (!gate.ok) return NextResponse.json({ error: gate.reason, upgrade: gate.upgrade }, { status: 402 })

  const { projectId } = await req.json().catch(() => ({}))
  const project = db().prepare("SELECT id, subject, type, name, content FROM projects WHERE id = ? AND user_id = ? AND type IN ('zusammenfassung','lernkarten','quiz')")
    .get(String(projectId), user.id) as { id: string; subject: string; type: string; name: string; content: string } | undefined
  if (!project) return NextResponse.json({ error: 'Projekt nicht gefunden' }, { status: 404 })

  const titel = project.name.replace(new RegExp(`^${NAME_PREFIX[project.type]}:\\s*`, 'i'), '')
  const meta: WordMeta = {
    titel, fach: project.subject,
    schueler: user.name ?? undefined,
    klasse: user.klasse ?? undefined,
    appUrl: process.env.NEXT_PUBLIC_APP_URL?.replace(/^https?:\/\//, ''),
  }

  let buffer: Buffer
  if (project.type === 'lernkarten') {
    const cards = JSON.parse(project.content) as { front: string; back: string }[]
    buffer = await renderWordFlashcards(cards, meta)
  } else if (project.type === 'quiz') {
    const questions = JSON.parse(project.content) as WordQuizQuestion[]
    buffer = await renderWordQuiz(questions, meta)
  } else {
    let markdown = project.content
    let config: SummaryConfig | null = null
    try {
      const parsed = JSON.parse(project.content)
      if (parsed.markdown) { markdown = parsed.markdown; config = parsed.config ?? null }
    } catch { /* Altformat: rohes Markdown */ }
    buffer = await renderWordSummary(markdown, { ...meta, niveau: config ? NIVEAU_LABEL[config.niveau] : undefined })
  }

  const filename = `${project.subject} — ${titel}`.replace(/[^\wäöüÄÖÜß \-–]/g, '').slice(0, 80)
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}.docx"; filename*=UTF-8''${encodeURIComponent(filename)}.docx`,
    },
  })
}
