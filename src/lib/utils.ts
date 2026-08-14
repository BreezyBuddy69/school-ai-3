import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** basePath-sicherer API/Asset-Pfad (Traefik-PathPrefix-Deployment). */
export function api(path: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${path}`
}

export const SUBJECT_GLYPHS: Record<string, string> = {
  Mathematik: '∑', Biologie: '❊', Geschichte: '◈', Deutsch: 'Aa',
  Englisch: 'En', Franzoesisch: 'Fr', Physik: 'φ', Chemie: '⌬',
  Informatik: '{ }', Philosophie: '⚖', Statistik: '∿',
  Geografie: '⛰', 'Wirtschaft und Recht': '§',
  Kunsterziehung: '❖', Musikerziehung: '♪', 'Religion und Kultur': '☯',
}

export function subjectGlyph(subject: string): string {
  return SUBJECT_GLYPHS[subject] ?? subject.slice(0, 2)
}

/** Word-Export herunterladen (/api/export/word) — geteilt von Zusammenfassung-, Karteikarten- und Quiz-Ansicht. */
export async function downloadWordExport(projectId: string, filename: string): Promise<boolean> {
  try {
    const res = await fetch(api('/api/export/word'), {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId }),
    })
    if (!res.ok) return false
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.docx`
    a.click()
    URL.revokeObjectURL(url)
    return true
  } catch {
    return false
  }
}

export function timeAgo(iso: string): string {
  const s = (Date.now() - new Date(iso + (iso.endsWith('Z') ? '' : 'Z')).getTime()) / 1000
  if (s < 60) return 'gerade eben'
  if (s < 3600) return `vor ${Math.floor(s / 60)} min`
  if (s < 86400) return `vor ${Math.floor(s / 3600)} h`
  const d = Math.floor(s / 86400)
  return d === 1 ? 'gestern' : `vor ${d} Tagen`
}
