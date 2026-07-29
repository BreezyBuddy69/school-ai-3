import {
  AlignmentType, BorderStyle, Document, Footer, HeadingLevel, Packer, PageBreak,
  PageNumber, Paragraph, ShadingType, Table, TableCell, TableRow, TextRun, WidthType,
} from 'docx'

// Markdown → .docx. Das Dokument ist das Kaufargument: Eltern halten es in
// der Hand, wenn der CHF-25-Code bezahlt wird. Deckblatt, Akzent-Callouts,
// saubere Tabellen, Seitenzahlen — besser als zwei Stunden Handarbeit.

const ACCENT = '0071E3'
const INK = '1D1D1F'
const MUTED = '6E6E73'
const PARCHMENT = 'F5F5F7'

export interface WordMeta {
  titel: string
  fach: string
  schueler?: string
  klasse?: string
  niveau?: string
  appUrl?: string
}

// ── Inline-Markdown: **fett**, *kursiv*, `code`, $mathe$ ────────────────────

function inlineRuns(text: string, base?: { bold?: boolean; size?: number; color?: string }): TextRun[] {
  const runs: TextRun[] = []
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\$[^$]+\$)/g
  let last = 0
  for (const m of text.matchAll(re)) {
    if (m.index! > last) runs.push(new TextRun({ text: text.slice(last, m.index), ...base }))
    const token = m[0]
    if (token.startsWith('**')) runs.push(new TextRun({ text: token.slice(2, -2), bold: true, ...base }))
    else if (token.startsWith('`')) runs.push(new TextRun({ text: token.slice(1, -1), font: 'Consolas', shading: { type: ShadingType.SOLID, color: PARCHMENT, fill: PARCHMENT }, ...base }))
    else if (token.startsWith('$')) runs.push(new TextRun({ text: token.slice(1, -1), italics: true, font: 'Cambria Math', ...base }))
    else runs.push(new TextRun({ text: token.slice(1, -1), italics: true, ...base }))
    last = m.index! + token.length
  }
  if (last < text.length) runs.push(new TextRun({ text: text.slice(last), ...base }))
  return runs.length ? runs : [new TextRun({ text, ...base })]
}

// ── Block-Parser ─────────────────────────────────────────────────────────────

type Block =
  | { kind: 'heading'; level: number; text: string }
  | { kind: 'para'; text: string }
  | { kind: 'bullet'; items: string[] }
  | { kind: 'ordered'; items: string[] }
  | { kind: 'quote'; text: string }
  | { kind: 'table'; header: string[]; rows: string[][] }
  | { kind: 'code'; text: string }
  | { kind: 'math'; text: string }
  | { kind: 'hr' }

function parseBlocks(md: string): Block[] {
  const lines = md.replace(/\r\n/g, '\n').split('\n')
  const blocks: Block[] = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (!line.trim()) { i++; continue }
    const h = line.match(/^(#{1,4})\s+(.*)/)
    if (h) { blocks.push({ kind: 'heading', level: h[1].length, text: h[2].trim() }); i++; continue }
    if (/^(---|\*\*\*|___)\s*$/.test(line)) { blocks.push({ kind: 'hr' }); i++; continue }
    if (line.startsWith('```')) {
      const buf: string[] = []; i++
      while (i < lines.length && !lines[i].startsWith('```')) { buf.push(lines[i]); i++ }
      i++
      blocks.push({ kind: 'code', text: buf.join('\n') }); continue
    }
    if (line.startsWith('$$')) {
      const buf: string[] = [line.replace(/^\$\$/, '')]
      if (!line.slice(2).includes('$$')) {
        i++
        while (i < lines.length && !lines[i].includes('$$')) { buf.push(lines[i]); i++ }
        if (i < lines.length) buf.push(lines[i].replace(/\$\$/, ''))
      } else buf[0] = buf[0].replace(/\$\$$/, '')
      i++
      blocks.push({ kind: 'math', text: buf.join(' ').trim() }); continue
    }
    if (line.startsWith('>')) {
      const buf: string[] = []
      while (i < lines.length && lines[i].startsWith('>')) { buf.push(lines[i].replace(/^>\s?/, '')); i++ }
      blocks.push({ kind: 'quote', text: buf.join(' ').trim() }); continue
    }
    if (/^\s*[-*+]\s+/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) { items.push(lines[i].replace(/^\s*[-*+]\s+/, '')); i++ }
      blocks.push({ kind: 'bullet', items }); continue
    }
    if (/^\s*\d+[.)]\s+/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) { items.push(lines[i].replace(/^\s*\d+[.)]\s+/, '')); i++ }
      blocks.push({ kind: 'ordered', items }); continue
    }
    if (line.includes('|') && i + 1 < lines.length && /^\s*\|?[\s:|-]+\|/.test(lines[i + 1])) {
      const parseRow = (l: string) => l.split('|').map((c) => c.trim()).filter((_, idx, arr) => !(idx === 0 && arr[0] === '') && !(idx === arr.length - 1 && arr[arr.length - 1] === ''))
      const header = parseRow(line)
      i += 2
      const rows: string[][] = []
      while (i < lines.length && lines[i].includes('|') && lines[i].trim()) { rows.push(parseRow(lines[i])); i++ }
      blocks.push({ kind: 'table', header, rows }); continue
    }
    const buf: string[] = []
    while (i < lines.length && lines[i].trim() && !/^(#{1,4}\s|>|```|\s*[-*+]\s|\s*\d+[.)]\s)/.test(lines[i]) && !(lines[i].includes('|') && i + 1 < lines.length && /^\s*\|?[\s:|-]+\|/.test(lines[i + 1]))) {
      buf.push(lines[i]); i++
    }
    blocks.push({ kind: 'para', text: buf.join(' ') })
  }
  return blocks
}

// ── Blöcke → docx-Elemente ───────────────────────────────────────────────────

function calloutBox(text: string): Table {
  const isWarn = /^achtung/i.test(text)
  const label = isWarn ? 'ACHTUNG PRÜFUNG' : 'MERKE'
  const body = text.replace(/^(merke|achtung( prüfung)?)\s*[:!]?\s*/i, '')
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
      bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
      right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
      left: { style: BorderStyle.SINGLE, size: 24, color: ACCENT },
      insideHorizontal: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
      insideVertical: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    },
    rows: [new TableRow({
      children: [new TableCell({
        shading: { type: ShadingType.SOLID, color: 'EAF2FD', fill: 'EAF2FD' },
        margins: { top: 140, bottom: 140, left: 220, right: 220 },
        children: [
          new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 16, color: ACCENT })], spacing: { after: 60 } }),
          new Paragraph({ children: inlineRuns(body) }),
        ],
      })],
    })],
  })
}

const TABLE_BORDERS = {
  top: { style: BorderStyle.SINGLE, size: 4, color: 'DDDDDD' },
  bottom: { style: BorderStyle.SINGLE, size: 4, color: 'DDDDDD' },
  left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: 'EEEEEE' },
  insideVertical: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
}

function tableHeaderCell(text: string): TableCell {
  return new TableCell({
    shading: { type: ShadingType.SOLID, color: INK, fill: INK },
    margins: { top: 90, bottom: 90, left: 140, right: 140 },
    children: [new Paragraph({ children: [new TextRun({ text, bold: true, color: 'FFFFFF', size: 19 })] })],
  })
}

function blockToDocx(b: Block): (Paragraph | Table)[] {
  switch (b.kind) {
    case 'heading': {
      const map = [HeadingLevel.HEADING_1, HeadingLevel.HEADING_1, HeadingLevel.HEADING_2, HeadingLevel.HEADING_3, HeadingLevel.HEADING_4]
      return [new Paragraph({ heading: map[b.level], children: inlineRuns(b.text) })]
    }
    case 'para':
      return [new Paragraph({ children: inlineRuns(b.text), spacing: { after: 160 } })]
    case 'bullet':
      return b.items.map((t) => new Paragraph({ children: inlineRuns(t), bullet: { level: 0 }, spacing: { after: 60 } }))
    case 'ordered':
      return b.items.map((t, i) => new Paragraph({
        children: [new TextRun({ text: `${i + 1}.  `, bold: true, color: ACCENT }), ...inlineRuns(t)],
        spacing: { after: 60 }, indent: { left: 360 },
      }))
    case 'quote':
      return [calloutBox(b.text), new Paragraph({ spacing: { after: 120 }, children: [] })]
    case 'code':
      return b.text.split('\n').map((l) => new Paragraph({
        children: [new TextRun({ text: l || ' ', font: 'Consolas', size: 18 })],
        shading: { type: ShadingType.SOLID, color: PARCHMENT, fill: PARCHMENT },
        spacing: { after: 0 },
      }))
    case 'math':
      return [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: b.text, italics: true, font: 'Cambria Math', size: 26 })],
        spacing: { before: 120, after: 160 },
      })]
    case 'table': {
      const headerRow = new TableRow({ tableHeader: true, children: b.header.map((h) => tableHeaderCell(h.replace(/\*\*/g, ''))) })
      const rows = b.rows.map((r, ri) => new TableRow({
        children: r.map((c) => new TableCell({
          shading: ri % 2 === 1 ? { type: ShadingType.SOLID, color: PARCHMENT, fill: PARCHMENT } : undefined,
          margins: { top: 80, bottom: 80, left: 140, right: 140 },
          children: [new Paragraph({ children: inlineRuns(c) })],
        })),
      }))
      return [
        new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, borders: TABLE_BORDERS, rows: [headerRow, ...rows] }),
        new Paragraph({ spacing: { after: 160 }, children: [] }),
      ]
    }
    case 'hr':
      return [new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'DDDDDD' } }, spacing: { before: 120, after: 240 }, children: [] })]
  }
}

// ── Dokument ─────────────────────────────────────────────────────────────────
// Deckblatt + Kopf-/Fusszeilen-Rahmen ist für alle drei Export-Typen
// (Zusammenfassung, Lernkarten, Quiz) identisch — nur der Inhaltsteil unterscheidet sich.

async function assembleDocx(meta: WordMeta, body: (Paragraph | Table)[]): Promise<Buffer> {
  const cover: Paragraph[] = [
    new Paragraph({ spacing: { before: 3200 }, children: [] }),
    new Paragraph({
      children: [new TextRun({ text: meta.fach.toUpperCase(), bold: true, size: 20, color: ACCENT, characterSpacing: 40 })],
      spacing: { after: 260 },
    }),
    new Paragraph({
      children: [new TextRun({ text: meta.titel, bold: true, size: 64, color: INK })],
      spacing: { after: 340 },
    }),
    ...(meta.niveau ? [new Paragraph({
      children: [new TextRun({ text: `Niveau: ${meta.niveau}`, size: 22, color: MUTED })],
      spacing: { after: 80 },
    })] : []),
    new Paragraph({
      children: [new TextRun({
        text: [meta.schueler, meta.klasse, 'Liechtensteinisches Gymnasium'].filter(Boolean).join('  ·  '),
        size: 22, color: MUTED,
      })],
      spacing: { after: 80 },
    }),
    new Paragraph({
      children: [new TextRun({ text: new Date().toLocaleDateString('de-CH', { day: 'numeric', month: 'long', year: 'numeric' }), size: 22, color: MUTED })],
    }),
    new Paragraph({ children: [new PageBreak()] }),
  ]

  const doc = new Document({
    creator: 'LG KI',
    title: `${meta.titel} — ${meta.fach}`,
    styles: {
      default: {
        document: { run: { font: 'Calibri', size: 22, color: INK }, paragraph: { spacing: { line: 300 } } },
        heading1: { run: { font: 'Calibri', size: 34, bold: true, color: INK }, paragraph: { spacing: { before: 360, after: 160 } } },
        heading2: { run: { font: 'Calibri', size: 27, bold: true, color: ACCENT }, paragraph: { spacing: { before: 280, after: 120 } } },
        heading3: { run: { font: 'Calibri', size: 23, bold: true, color: INK }, paragraph: { spacing: { before: 220, after: 100 } } },
      },
    },
    sections: [{
      properties: { page: { margin: { top: 1250, bottom: 1250, left: 1250, right: 1250 } } },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: `Erstellt mit LG KI${meta.appUrl ? ` — ${meta.appUrl}` : ''}    ·    Seite `, size: 16, color: MUTED }),
              new TextRun({ children: [PageNumber.CURRENT], size: 16, color: MUTED }),
              new TextRun({ text: ' von ', size: 16, color: MUTED }),
              new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: MUTED }),
            ],
          })],
        }),
      },
      children: [...cover, ...body],
    }],
  })

  return Packer.toBuffer(doc)
}

export async function renderWordSummary(markdown: string, meta: WordMeta): Promise<Buffer> {
  const blocks = parseBlocks(markdown)
  // Erste H1 nicht doppeln — steht schon auf dem Deckblatt.
  const body = blocks[0]?.kind === 'heading' && blocks[0].level === 1 ? blocks.slice(1) : blocks
  return assembleDocx(meta, body.flatMap(blockToDocx))
}

export async function renderWordFlashcards(cards: { front: string; back: string }[], meta: WordMeta): Promise<Buffer> {
  const headerRow = new TableRow({ tableHeader: true, children: [tableHeaderCell('Frage'), tableHeaderCell('Antwort')] })
  const rows = cards.map((c, i) => new TableRow({
    children: [c.front, c.back].map((t) => new TableCell({
      shading: i % 2 === 1 ? { type: ShadingType.SOLID, color: PARCHMENT, fill: PARCHMENT } : undefined,
      margins: { top: 100, bottom: 100, left: 140, right: 140 },
      children: [new Paragraph({ children: inlineRuns(t) })],
    })),
  }))
  const table = new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, borders: TABLE_BORDERS, rows: [headerRow, ...rows] })
  return assembleDocx(meta, [table])
}

export interface WordQuizQuestion { frage: string; a: string; b: string; c: string; d: string; correct: string }

export async function renderWordQuiz(questions: WordQuizQuestion[], meta: WordMeta): Promise<Buffer> {
  const body: (Paragraph | Table)[] = []
  questions.forEach((q, i) => {
    body.push(new Paragraph({
      children: [new TextRun({ text: `${i + 1}.  `, bold: true, color: ACCENT }), ...inlineRuns(q.frage)],
      spacing: { before: i === 0 ? 0 : 220, after: 100 },
    }))
    for (const [key, label] of [['A', q.a], ['B', q.b], ['C', q.c], ['D', q.d]] as const) {
      const isCorrect = key === q.correct.toUpperCase()
      body.push(new Paragraph({
        children: [new TextRun({ text: `${key})  `, bold: isCorrect, color: isCorrect ? '1D9A4E' : MUTED }), ...inlineRuns(label)],
        indent: { left: 360 }, spacing: { after: 40 },
      }))
    }
  })
  return assembleDocx(meta, body)
}
