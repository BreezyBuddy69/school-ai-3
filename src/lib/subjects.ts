import fs from 'node:fs'
import path from 'node:path'

// Fachinhalte sind Markdown-Dateien: data/subjects/<Fach>/<Jahr|Kategorie>/<thema>.md
// Slug-Format überall: "Fach/Jahr/thema" (ohne .md). Von Hand geschrieben und
// (später) aus OneNote importiert — das Format bleibt dasselbe.
//
// Ein Slug darf zusätzlich einzelne Abschnitte wählen: "Fach/Jahr/thema#1,3".
// Die "## "-Überschriften der Datei SIND die Lernziele — jede Themendatei ist
// in 6–10 davon gegliedert. Damit lässt sich ein Thema ganz und das nächste
// nur zur Hälfte in den Chat-Kontext nehmen, ohne ein zweites Datenmodell.

const SUBJECTS_DIR = path.join(process.cwd(), 'data', 'subjects')

export type SubjectTree = Record<string, Record<string, Record<string, string>>>

let cache: { tree: SubjectTree; at: number } | null = null

/** Fach → Jahr/Kategorie → Themen-Label → Slug. 30 s Cache, damit Inhalte per Datei-Drop aktualisierbar bleiben. */
export function getSubjectTree(): SubjectTree {
  if (cache && Date.now() - cache.at < 30_000) return cache.tree
  const tree: SubjectTree = {}
  if (!fs.existsSync(SUBJECTS_DIR)) return tree
  for (const subject of fs.readdirSync(SUBJECTS_DIR)) {
    const subjectPath = path.join(SUBJECTS_DIR, subject)
    if (!fs.statSync(subjectPath).isDirectory()) continue
    tree[subject] = {}
    for (const year of fs.readdirSync(subjectPath)) {
      const yearPath = path.join(subjectPath, year)
      if (!fs.statSync(yearPath).isDirectory()) continue
      tree[subject][year] = {}
      for (const file of fs.readdirSync(yearPath)) {
        if (!file.endsWith('.md')) continue
        const label = file.replace(/\.md$/, '').replace(/-/g, ' ')
        tree[subject][year][label] = `${subject}/${year}/${file.replace(/\.md$/, '')}`
      }
    }
  }
  cache = { tree, at: Date.now() }
  return tree
}

// ── Slug + Abschnitte ────────────────────────────────────────────────────────

/** Trennt "Fach/Jahr/thema#1,3" in Datei-Slug und 1-basierte Abschnittsnummern. */
function parseSlug(slug: string): { file: string; sections: number[] } {
  const [file, sel] = slug.split('#')
  const sections = (sel ?? '')
    .split(',')
    .map((n) => Number(n.trim()))
    .filter((n) => Number.isInteger(n) && n > 0)
  return { file, sections }
}

/** Dateipfad zu einem Slug, gegen data/subjects verankert (kein Traversal). */
function resolve(fileSlug: string): string | null {
  const safe = fileSlug.replace(/\.\./g, '').replace(/^\/+/, '')
  const file = path.join(SUBJECTS_DIR, `${safe}.md`)
  if (!file.startsWith(SUBJECTS_DIR)) return null
  if (!fs.existsSync(file)) return null
  return file
}

/** Zerlegt Markdown an den "## "-Überschriften; `head` ist alles davor (Titel, Fach, Hinweise). */
function splitSections(md: string): { head: string; sections: { title: string; body: string }[] } {
  const parts = md.split(/^## /m)
  const head = parts.shift() ?? ''
  const sections = parts.map((p) => {
    const nl = p.indexOf('\n')
    return { title: (nl === -1 ? p : p.slice(0, nl)).trim(), body: `## ${p}`.trimEnd() }
  })
  return { head, sections }
}

/** Die Abschnittstitel eines Themas — 1-basiert, passend zu "#1,3" im Slug. */
export function listSections(slug: string): string[] {
  const file = resolve(parseSlug(slug).file)
  if (!file) return []
  return splitSections(fs.readFileSync(file, 'utf-8')).sections.map((s) => s.title)
}

/**
 * Liest ein Thema — ganz, oder nur die im Slug gewählten Abschnitte.
 * Der Kopf der Datei (Titel, Fach, Klasse) bleibt immer dabei, sonst verliert
 * ein einzelner Abschnitt seinen Zusammenhang.
 */
export function readTopic(slug: string): { title: string; content: string; bytes: number } | null {
  const { file: rel, sections } = parseSlug(slug)
  const file = resolve(rel)
  if (!file) return null
  const raw = fs.readFileSync(file, 'utf-8')
  const name = path.basename(rel).replace(/-/g, ' ')
  if (sections.length === 0) return { title: name, content: raw, bytes: Buffer.byteLength(raw) }

  const { head, sections: all } = splitSections(raw)
  const picked = sections.map((n) => all[n - 1]).filter(Boolean)
  // Nummern zeigen ins Leere (Datei wurde umgebaut): lieber das ganze Thema als
  // gar nichts — die Auswahl war eine Einschränkung, keine Bedingung.
  if (picked.length === 0) return { title: name, content: raw, bytes: Buffer.byteLength(raw) }
  const content = [head.trim(), ...picked.map((s) => s.body)].join('\n\n')
  return {
    title: `${name} › ${picked.map((s) => s.title).join(' · ')}`,
    content,
    bytes: Buffer.byteLength(content),
  }
}

// ── Suche ────────────────────────────────────────────────────────────────────

export interface TopicRef { slug: string; label: string; year: string; subject: string }
export interface TopicHit extends TopicRef { section?: number; sectionTitle?: string; snippet?: string }

type IndexEntry = TopicRef & { haystack: string; sections: { title: string; body: string }[] }
let index: { entries: IndexEntry[]; at: number } | null = null

/** Volltext-Index über alle Themendateien (2,4 MB) — passt in den Speicher, 60 s Cache. */
function getIndex(): IndexEntry[] {
  if (index && Date.now() - index.at < 60_000) return index.entries
  const entries: IndexEntry[] = []
  for (const [subject, years] of Object.entries(getSubjectTree())) {
    for (const [year, topics] of Object.entries(years)) {
      for (const [label, slug] of Object.entries(topics)) {
        const file = resolve(slug)
        if (!file) continue
        const raw = fs.readFileSync(file, 'utf-8')
        entries.push({
          slug, label, year, subject,
          haystack: `${label}\n${raw}`.toLowerCase(),
          sections: splitSections(raw).sections,
        })
      }
    }
  }
  index = { entries, at: Date.now() }
  return entries
}

/** Kurzer Textausschnitt um den ersten Treffer, damit sichtbar ist WARUM etwas passt. */
function snippetAround(body: string, needle: string): string | undefined {
  const at = body.toLowerCase().indexOf(needle)
  if (at === -1) return undefined
  const from = Math.max(0, at - 40)
  const text = body.slice(from, from + 130).replace(/\s+/g, ' ').trim()
  return `${from > 0 ? '…' : ''}${text}…`
}

/**
 * Sucht in Titel UND Inhalt. Trifft eine Suche einen einzelnen Abschnitt, wird
 * dieser Abschnitt als eigener Treffer zurückgegeben ("Zelle › 3. Mitose") —
 * damit landet nur das Nötige im Kontext statt der ganzen Datei.
 * Alle Suchwörter müssen vorkommen (UND), Reihenfolge egal.
 */
export function searchTopics(query: string, subject?: string): TopicHit[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (words.length === 0) return []
  const hits: TopicHit[] = []

  for (const e of getIndex()) {
    if (subject && e.subject !== subject) continue
    if (!words.every((w) => e.haystack.includes(w))) continue

    const inLabel = words.every((w) => e.label.toLowerCase().includes(w))
    // Abschnitte, die alle Suchwörter selbst enthalten: die sind die präzise Antwort.
    const matching = e.sections
      .map((s, i) => ({ s, i }))
      .filter(({ s }) => words.every((w) => `${s.title}\n${s.body}`.toLowerCase().includes(w)))

    // Steht der Begriff schon im Themennamen, ist das ganze Thema gemeint —
    // dann nicht zusätzlich jeden einzelnen Abschnitt vorschlagen.
    if (inLabel || matching.length === 0 || matching.length === e.sections.length) {
      hits.push({ ...ref(e) })
    }
    if (!inLabel) {
      for (const { s, i } of matching.slice(0, 3)) {
        hits.push({
          ...ref(e),
          slug: `${e.slug}#${i + 1}`,
          section: i + 1,
          sectionTitle: s.title,
          snippet: snippetAround(s.body, words[0]),
        })
      }
    }
    if (hits.length >= 40) break
  }
  // Themennamen-Treffer zuerst — wer "Mitose" tippt, will die Mitose-Datei oben.
  const q = words.join(' ')
  return hits
    .sort((a, b) => score(b, q) - score(a, q))
    .slice(0, 25)
}

function ref(e: IndexEntry): TopicHit {
  return { slug: e.slug, label: e.label, year: e.year, subject: e.subject }
}

function score(h: TopicHit, q: string): number {
  if (h.label.toLowerCase().includes(q)) return 3
  if (h.sectionTitle?.toLowerCase().includes(q)) return 2
  return h.section ? 1 : 0
}
