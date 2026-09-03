import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { renderXlsx, markdownToSheet, type SheetData } from '@/lib/xlsx'
import type { MindmapNode } from '@/components/studio/MindmapModal'

// Excel-Export (.xlsx) für alles, was Zeilen und Spalten hat: Tabellen,
// Lernkarten (Frage/Antwort — direkt in Quizlet & Co. importierbar), Quiz,
// Mindmap (Ebenen als Spalten) und Zusammenfassungen mit Tabelle.
// Kein Tier-Gate: die Datei entsteht lokal im Container, kostet also nichts.

const NAME_PREFIX: Record<string, string> = {
  zusammenfassung: 'Zusammenfassung', lernkarten: 'Lernkarten', quiz: 'Quiz', tabelle: 'Tabelle', mindmap: 'Mindmap',
}

/** Mindmap als Zeilen: eine Zeile pro Blattpfad, eine Spalte pro Ebene. */
function mindmapToRows(tree: MindmapNode): { header: string[]; rows: string[][] } {
  const rows: string[][] = []
  let depthMax = 1
  const walk = (node: MindmapNode, trail: string[]) => {
    const path = [...trail, node.label]
    depthMax = Math.max(depthMax, path.length)
    if (node.children?.length) for (const c of node.children) walk(c, path)
    else rows.push(path)
  }
  walk(tree, [])
  return { header: Array.from({ length: depthMax }, (_, i) => `Ebene ${i + 1}`), rows }
}

export async function POST(req: NextRequest) {
  const user = await currentUser()
  if (!user) return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 })

  const { projectId } = await req.json().catch(() => ({}))
  const project = db().prepare("SELECT subject, type, name, content FROM projects WHERE id = ? AND user_id = ? AND status = 'ready'")
    .get(String(projectId), user.id) as { subject: string; type: string; name: string; content: string } | undefined
  if (!project) return NextResponse.json({ error: 'Projekt nicht gefunden' }, { status: 404 })

  const titel = project.name.replace(new RegExp(`^${NAME_PREFIX[project.type] ?? ''}:\\s*`, 'i'), '')
  let sheet: SheetData
  if (project.type === 'lernkarten') {
    const cards = JSON.parse(project.content) as { front: string; back: string }[]
    sheet = { name: titel, header: ['Frage', 'Antwort'], rows: cards.map((c) => [c.front, c.back]) }
  } else if (project.type === 'quiz') {
    const qs = JSON.parse(project.content) as { frage: string; a: string; b: string; c: string; d: string; correct: string }[]
    sheet = {
      name: titel,
      header: ['Nr.', 'Frage', 'A', 'B', 'C', 'D', 'Richtig'],
      rows: qs.map((q, i) => [String(i + 1), q.frage, q.a, q.b, q.c, q.d, q.correct.toUpperCase()]),
    }
  } else if (project.type === 'mindmap') {
    sheet = { name: titel, ...mindmapToRows(JSON.parse(project.content) as MindmapNode) }
  } else if (project.type === 'tabelle' || project.type === 'zusammenfassung') {
    let markdown = project.content
    try { const p = JSON.parse(project.content); if (p.markdown) markdown = p.markdown } catch { /* Altformat */ }
    sheet = { name: titel, ...markdownToSheet(markdown) }
  } else {
    return NextResponse.json({ error: 'Für dieses Werkzeug gibt es keinen Excel-Export' }, { status: 400 })
  }

  const buffer = await renderXlsx(sheet)
  const filename = `${project.subject} — ${titel}`.replace(/[^\wäöüÄÖÜß \-–]/g, '').slice(0, 80)
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}.xlsx"; filename*=UTF-8''${encodeURIComponent(filename)}.xlsx`,
    },
  })
}
