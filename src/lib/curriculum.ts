import fs from 'node:fs'
import path from 'node:path'

// LG-Vaduz-Curriculum: 7 Jahre, 6 Profile. Basisdaten handkuratiert,
// scripts/scrape-curriculum.mjs reichert von lg-vaduz.li an.

export interface Profile { id: string; name: string; kurz: string; profilfaecher: string[]; profilfaecherHinweis?: string }

export interface Curriculum {
  school: string
  struktur: { unterstufe: number[]; oberstufe: number[]; hinweis: string }
  profile: Profile[]
  grundlagenfaecher: string[]
  fachSlugMap: Record<string, string>
}

let cached: Curriculum | null = null

export function getCurriculum(): Curriculum {
  if (cached) return cached
  const file = path.join(process.cwd(), 'data', 'curriculum', 'curriculum.json')
  cached = JSON.parse(fs.readFileSync(file, 'utf-8')) as Curriculum
  return cached
}

/** Fächer, die ein Schüler mit Jahr+Profil tatsächlich hat (Grundlagen + Profil ab Oberstufe). */
export function subjectsFor(jahr: number | null, profilId: string | null): string[] {
  const c = getCurriculum()
  const base = [...c.grundlagenfaecher]
  if (jahr && jahr >= 4 && profilId) {
    const p = c.profile.find((x) => x.id === profilId)
    if (p) for (const f of p.profilfaecher) if (!base.includes(f)) base.push(f)
  }
  return base
}

/** Beschreibung des Schülers für den System-Kontext der KI. */
export function studentContext(jahr: number | null, profilId: string | null, klasse: string | null): string {
  const c = getCurriculum()
  const parts = ['Schüler:in am Liechtensteinischen Gymnasium Vaduz (7 Jahre: 1–3 Unterstufe, 4–7 Oberstufe).']
  if (klasse) parts.push(`Klasse ${klasse}.`)
  if (jahr) parts.push(`Schuljahr ${jahr} (${jahr <= 3 ? 'Unterstufe' : 'Oberstufe'}).`)
  if (profilId) {
    const p = c.profile.find((x) => x.id === profilId)
    if (p) parts.push(`Profil «${p.name}» mit Profilfächern: ${p.profilfaecher.join(', ')}.`)
  }
  return parts.join(' ')
}
