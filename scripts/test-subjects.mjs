// Selbsttest für Abschnittsauswahl und Volltextsuche gegen die echten
// Lehrplandateien. Läuft ohne Framework:  node scripts/test-subjects.mjs
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const SUBJECTS_DIR = path.join(process.cwd(), 'data', 'subjects')

// Erstes Thema mit mindestens 3 Abschnitten suchen — Testdaten aus dem Bestand,
// damit der Test mitwandert, wenn Dateien dazukommen oder umbenannt werden.
function anyTopicWithSections(min) {
  for (const subject of fs.readdirSync(SUBJECTS_DIR)) {
    const sp = path.join(SUBJECTS_DIR, subject)
    if (!fs.statSync(sp).isDirectory()) continue
    for (const year of fs.readdirSync(sp)) {
      const yp = path.join(sp, year)
      if (!fs.statSync(yp).isDirectory()) continue
      for (const f of fs.readdirSync(yp)) {
        if (!f.endsWith('.md')) continue
        const raw = fs.readFileSync(path.join(yp, f), 'utf-8')
        if ((raw.match(/^## /gm) ?? []).length >= min) {
          return `${subject}/${year}/${f.replace(/\.md$/, '')}`
        }
      }
    }
  }
  throw new Error(`Keine Themendatei mit ${min}+ Abschnitten gefunden`)
}

const { readTopic, listSections, searchTopics } = await import('../src/lib/subjects.ts')

const slug = anyTopicWithSections(3)
const sections = listSections(slug)
assert.ok(sections.length >= 3, 'listSections liefert die Abschnitte')

const full = readTopic(slug)
const part = readTopic(`${slug}#1,3`)
assert.ok(full && part, 'beide Lesarten liefern ein Ergebnis')
assert.ok(part.bytes < full.bytes, 'Teilauswahl ist kleiner als das ganze Thema')
assert.ok(part.content.includes(sections[0]), 'gewählter Abschnitt 1 ist drin')
assert.ok(part.content.includes(sections[2]), 'gewählter Abschnitt 3 ist drin')
assert.ok(!part.content.includes(`## ${sections[1]}`), 'nicht gewählter Abschnitt 2 fehlt')
assert.ok(part.title.includes('›'), 'Titel nennt die gewählten Abschnitte')

// Ungültige Nummern dürfen nicht zu leerem Kontext führen.
assert.equal(readTopic(`${slug}#99`).bytes, full.bytes, 'unbekannter Abschnitt → ganzes Thema')

// Kein Pfad-Traversal, auch nicht mit Abschnitts-Suffix.
assert.equal(readTopic('../../../etc/passwd'), null, 'Traversal wird abgewiesen')
assert.equal(readTopic('../../package#1'), null, 'Traversal mit Abschnitt wird abgewiesen')

// Volltext: ein Wort aus dem Fliesstext, das garantiert NICHT im Dateinamen steht.
const body = readTopic(slug).content
const word = (body.match(/\b[a-zäöüA-ZÄÖÜ]{9,}\b/g) ?? [])
  .find((w) => !slug.toLowerCase().includes(w.toLowerCase()))
assert.ok(word, 'Testwort im Fliesstext gefunden')
const hits = searchTopics(word)
assert.ok(hits.some((h) => h.slug.startsWith(slug)), `Volltext findet "${word}" in ${slug}`)

assert.deepEqual(searchTopics('   '), [], 'leere Suche liefert nichts')

console.log(`ok — ${sections.length} Abschnitte in ${slug}, Volltext fand "${word}" (${hits.length} Treffer)`)
