import fs from 'node:fs'
import path from 'node:path'

// Fachinhalte sind Markdown-Dateien: data/subjects/<Fach>/<Jahr|Kategorie>/<thema>.md
// Slug-Format überall: "Fach/Jahr/thema" (ohne .md). Von Hand geschrieben und
// (später) aus OneNote importiert — das Format bleibt dasselbe.

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

/** Liest ein Thema; Pfad wird gegen data/subjects verankert (kein Traversal). */
export function readTopic(slug: string): { title: string; content: string; bytes: number } | null {
  const safe = slug.replace(/\.\./g, '').replace(/^\/+/, '')
  const file = path.join(SUBJECTS_DIR, `${safe}.md`)
  if (!file.startsWith(SUBJECTS_DIR)) return null
  if (!fs.existsSync(file)) return null
  const content = fs.readFileSync(file, 'utf-8')
  const title = path.basename(safe).replace(/-/g, ' ')
  return { title, content, bytes: Buffer.byteLength(content) }
}

export interface TopicRef { slug: string; label: string; year: string; subject: string }

export function searchTopics(query: string, subject?: string): TopicRef[] {
  const tree = getSubjectTree()
  const q = query.toLowerCase()
  const hits: TopicRef[] = []
  for (const [subj, years] of Object.entries(tree)) {
    if (subject && subj !== subject) continue
    for (const [year, topics] of Object.entries(years)) {
      for (const [label, slug] of Object.entries(topics)) {
        if (label.toLowerCase().includes(q) || slug.toLowerCase().includes(q)) {
          hits.push({ slug, label, year, subject: subj })
        }
      }
    }
  }
  return hits.slice(0, 25)
}
