import JSZip from 'jszip'

// Minimaler .xlsx-Schreiber. Eine echte Excel-Datei ist ein ZIP mit fünf
// XML-Teilen — genau die stehen hier. Kein SheetJS/ExcelJS als Abhängigkeit:
// wir brauchen eine Kopfzeile, Textzellen und Spaltenbreiten, sonst nichts.
// (JSZip liegt ohnehin im Baum, `docx` baut damit seine .docx-Dateien.)

export interface SheetData {
  name: string
  header: string[]
  rows: string[][]
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** 0 → A, 25 → Z, 26 → AA */
function colName(i: number): string {
  let s = ''
  for (let n = i; n >= 0; n = Math.floor(n / 26) - 1) s = String.fromCharCode(65 + (n % 26)) + s
  return s
}

/** Reine Zahlen als Zahl schreiben, alles andere als Inline-String (spart sharedStrings.xml). */
function cell(ref: string, value: string, style: number): string {
  const s = style ? ` s="${style}"` : ''
  if (/^-?\d+([.,]\d+)?$/.test(value.trim())) {
    return `<c r="${ref}"${s}><v>${value.trim().replace(',', '.')}</v></c>`
  }
  return `<c r="${ref}"${s} t="inlineStr"><is><t xml:space="preserve">${esc(value)}</t></is></c>`
}

function sheetXml(data: SheetData): string {
  const widths = data.header.map((h, i) => {
    const longest = Math.max(h.length, ...data.rows.map((r) => (r[i] ?? '').length))
    return `<col min="${i + 1}" max="${i + 1}" width="${Math.min(Math.max(longest + 4, 12), 70)}" customWidth="1"/>`
  }).join('')
  const rows = [data.header, ...data.rows].map((cells, ri) =>
    `<row r="${ri + 1}">${cells.map((v, ci) => cell(`${colName(ci)}${ri + 1}`, v ?? '', ri === 0 ? 1 : 0)).join('')}</row>`,
  ).join('')
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>
<cols>${widths}</cols>
<sheetData>${rows}</sheetData>
</worksheet>`
}

const STYLES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><color rgb="FFFFFFFF"/><sz val="11"/><name val="Calibri"/></font></fonts>
<fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF3D3929"/><bgColor indexed="64"/></patternFill></fill></fills>
<borders count="1"><border/></borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="2">
<xf xfId="0" numFmtId="0" fontId="0" fillId="0" borderId="0" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>
<xf xfId="0" numFmtId="0" fontId="1" fillId="2" borderId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment vertical="center"/></xf>
</cellXfs>
</styleSheet>`

export async function renderXlsx(data: SheetData): Promise<Buffer> {
  const zip = new JSZip()
  zip.file('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>`)
  zip.file('_rels/.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`)
  zip.file('xl/workbook.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheets><sheet name="${esc(data.name.replace(/[\\/?*[\]:]/g, ' ').slice(0, 31)) || 'Tabelle'}" sheetId="1" r:id="rId1"/></sheets>
</workbook>`)
  zip.file('xl/_rels/workbook.xml.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`)
  zip.file('xl/styles.xml', STYLES)
  zip.file('xl/worksheets/sheet1.xml', sheetXml(data))
  return zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' })
}

/**
 * Erste Markdown-Tabelle aus einem Text ziehen (Tabellen-Werkzeug und
 * Zusammenfassungen liefern Markdown; für Excel brauchen wir Zeilen/Spalten).
 * Fehlt eine Tabelle, wird der Text zeilenweise in eine Spalte gelegt — besser
 * eine schlichte Liste als ein Fehler.
 */
export function markdownToSheet(markdown: string): { header: string[]; rows: string[][] } {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n')
  const start = lines.findIndex((l, i) => l.includes('|') && /^\s*\|?[\s:|-]+\|/.test(lines[i + 1] ?? ''))
  if (start === -1) {
    const rows = lines.map((l) => l.replace(/^#+\s*/, '').trim()).filter(Boolean).map((l) => [l])
    return { header: ['Inhalt'], rows }
  }
  const parseRow = (l: string) => l.split('|').map((c) => c.trim().replace(/\*\*/g, ''))
    .filter((_, idx, arr) => !(idx === 0 && arr[0] === '') && !(idx === arr.length - 1 && arr[arr.length - 1] === ''))
  const header = parseRow(lines[start])
  const rows: string[][] = []
  for (let i = start + 2; i < lines.length && lines[i].includes('|') && lines[i].trim(); i++) rows.push(parseRow(lines[i]))
  return { header, rows }
}
