import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { gateWordExport } from '@/lib/tiers'
import { renderWordSummary, renderWordFlashcards, renderWordQuiz, type WordMeta, type WordQuizQuestion } from '@/lib/docx'
import type { MindmapNode } from '@/components/studio/MindmapModal'
import type { SummaryConfig } from '@/lib/summary'

// Word-Export für alle Studio-Tools. Zusammenfassung, Tabelle, Podcast-Skript
// und Mindmap laufen alle über renderWordSummary — der Markdown-Renderer kann
// Überschriften, Tabellen und Listen, mehr braucht keiner der drei.

const NIVEAU_LABEL: Record<string, string> = { grundlagen: 'Grundlagen', solide: 'Solide', matura: 'Matura' }
const NAME_PREFIX: Record<string, string> = {
  zusammenfassung: 'Zusammenfassung', lernkarten: 'Lernkarten', quiz: 'Quiz',
  tabelle: 'Tabelle', podcast: 'Podcast', mindmap: 'Mindmap',
}

/** Mindmap-Baum als eingerückte Markdown-Liste — im Word-Dokument die lesbarste Form. */
function mindmapToMarkdown(tree: MindmapNode): string {
  const out: string[] = [`# ${tree.label}`, '']
  const walk = (nodes: MindmapNode[], depth: number) => {
    for (const n of nodes) {
      out.push(`${'  '.repeat(depth)}- ${n.label}`)
      if (n.children?.length) walk(n.children, depth + 1)
    }
  }
  walk(tree.children ?? [], 0)
  return out.join('\n')
}

export async function POST(req: NextRequest) {
  const user = await currentUser()
  if (!user) return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 })
  const gate = gateWordExport(user.tier)
  if (!gate.ok) return NextResponse.json({ error: gate.reason, upgrade: gate.upgrade }, { status: 402 })

  const { projectId } = await req.json().catch(() => ({}))
  const project = db().prepare("SELECT id, subject, type, name, content FROM projects WHERE id = ? AND user_id = ? AND status = 'ready'")
    .get(String(projectId), user.id) as { id: string; subject: string; type: string; name: string; content: string } | undefined
  if (!project) return NextResponse.json({ error: 'Projekt nicht gefunden' }, { status: 404 })

  const titel = project.name.replace(new RegExp(`^${NAME_PREFIX[project.type] ?? ''}:\\s*`, 'i'), '')
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
  } else if (project.type === 'mindmap') {
    buffer = await renderWordSummary(mindmapToMarkdown(JSON.parse(project.content) as MindmapNode), meta)
  } else if (project.type === 'podcast') {
    const { script } = JSON.parse(project.content) as { script: string }
    buffer = await renderWordSummary(`# ${titel}\n\n${script}`, meta)
  } else {
    let markdown = project.content
    let config: SummaryConfig | null = null
    try {
      const parsed = JSON.parse(project.content)
      if (parsed.markdown) { markdown = parsed.markdown; config = parsed.config ?? null }
    } catch { /* Altformat: rohes Markdown */ }
    buffer = await renderWordSummary(markdown, { ...meta, niveau: config?.niveau ? NIVEAU_LABEL[config.niveau] : undefined })
  }

  const filename = `${project.subject} — ${titel}`.replace(/[^\wäöüÄÖÜß \-–]/g, '').slice(0, 80)
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}.docx"; filename*=UTF-8''${encodeURIComponent(filename)}.docx`,
    },
  })
}
