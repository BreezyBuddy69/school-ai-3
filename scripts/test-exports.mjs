// Selbsttest für die selbstgebaute .xlsx-Datei und die Markdown→Zeilen-Umwandlung.
// Beides ist handgeschriebenes Format-Gefummel — genau da lohnt ein Test.
//   node --experimental-strip-types scripts/test-exports.mjs
import assert from 'node:assert/strict'
import JSZip from 'jszip'
import { renderXlsx, markdownToSheet } from '../src/lib/xlsx.ts'

// ── markdownToSheet ──────────────────────────────────────────────────────────
const md = `# Bindungsarten

| Bindungsart | Teilchen | Beispiel |
|---|---|---|
| **Ionisch** | Ionen | NaCl |
| Kovalent | Atome | H2O |
`
const sheet = markdownToSheet(md)
assert.deepEqual(sheet.header, ['Bindungsart', 'Teilchen', 'Beispiel'])
assert.equal(sheet.rows.length, 2)
assert.deepEqual(sheet.rows[0], ['Ionisch', 'Ionen', 'NaCl'], 'Fettung muss aus der Zelle raus')

// Ohne Tabelle: Zeilenliste statt Fehler
const fallback = markdownToSheet('# Titel\n\nErste Zeile\nZweite Zeile')
assert.deepEqual(fallback.header, ['Inhalt'])
assert.equal(fallback.rows.length, 3)

// ── renderXlsx ───────────────────────────────────────────────────────────────
const buf = await renderXlsx({
  name: 'Bindungsarten',
  header: sheet.header,
  rows: [...sheet.rows, ['Zahl', '42', 'Umlaut: Grösse & <Zeichen>']],
})
assert.ok(buf.length > 500, 'Datei ist verdächtig klein')
assert.equal(buf.subarray(0, 2).toString(), 'PK', 'kein ZIP-Container')

const zip = await JSZip.loadAsync(buf)
for (const part of ['[Content_Types].xml', '_rels/.rels', 'xl/workbook.xml', 'xl/_rels/workbook.xml.rels', 'xl/styles.xml', 'xl/worksheets/sheet1.xml']) {
  assert.ok(zip.file(part), `Teil fehlt: ${part}`)
}
const xml = await zip.file('xl/worksheets/sheet1.xml').async('string')
assert.ok(xml.includes('<t xml:space="preserve">Bindungsart</t>'), 'Kopfzeile fehlt')
assert.ok(xml.includes('r="A4"'), 'Letzte Zeile fehlt')
assert.ok(xml.includes('<v>42</v>'), 'Zahl muss als Zahl geschrieben sein, nicht als Text')
assert.ok(xml.includes('Grösse &amp; &lt;Zeichen&gt;'), 'Sonderzeichen nicht maskiert')
assert.ok(!/&(?!amp;|lt;|gt;|quot;|apos;|#)/.test(xml), 'unmaskiertes & im XML')

console.log('✓ Excel-Export und Markdown-Umwandlung in Ordnung')
