// Zusammenfassungs-Konfiguration + Prompt-Bau — gemeinsam genutzt vom
// Studio-Endpunkt und der agentischen Aktion im Chat.

import type { ToolId } from '@/components/studio/StudioPanel'

export interface SummaryConfig {
  niveau: 'grundlagen' | 'solide' | 'matura'
  laenge: 'kompakt' | 'standard' | 'ausfuehrlich'
  stil: 'fliesstext' | 'stichpunkte' | 'lernskript'
  extras: string[]
}

export const DEFAULT_SUMMARY_CONFIG: SummaryConfig = {
  niveau: 'solide', laenge: 'standard', stil: 'lernskript', extras: [],
}

const NIVEAU_TEXT = {
  grundlagen: 'Grundlagen-Niveau: Erkläre von Null an, setze kein Vorwissen voraus, nutze Alltagsbeispiele.',
  solide: 'Solides Niveau: Grundbegriffe sind bekannt, fokussiere auf Zusammenhänge und typische Prüfungsfragen.',
  matura: 'Matura-Niveau: präzise Fachsprache, Transferaufgaben, typische Maturafragen und Stolperfallen.',
}
const LAENGE_TEXT = {
  kompakt: 'Kompakt: 1–2 Seiten, nur das Wesentliche.',
  standard: 'Standard: 3–5 Seiten, ausgewogen.',
  ausfuehrlich: 'Ausführlich: 6+ Seiten, vollständig mit Beispielen.',
}
const STIL_TEXT = {
  fliesstext: 'Stil: zusammenhängender Fliesstext mit klaren Absätzen.',
  stichpunkte: 'Stil: strukturierte Stichpunkte und kurze Merklisten.',
  lernskript: 'Stil: Lernskript mit Merksätzen (als Blockquote) und Übungsfragen am Ende jedes Abschnitts.',
}

export function buildSummaryPrompt(base: string, cfg: SummaryConfig): string {
  const extras = cfg.extras.length ? `Zusätzlich einbauen: ${cfg.extras.join(', ')}.` : ''
  return [
    `Erstelle eine Zusammenfassung zum Thema: ${base}`,
    NIVEAU_TEXT[cfg.niveau], LAENGE_TEXT[cfg.laenge], STIL_TEXT[cfg.stil], extras,
    'Format: Markdown mit # Überschriften, ## Abschnitten, **Fettung**, Tabellen wo sinnvoll,',
    'Blockquotes (>) für Merksätze mit Präfix "Merke:" oder "Achtung Prüfung:".',
    'Mathematische Formeln als LaTeX ($...$ bzw. $$...$$).',
  ].filter(Boolean).join('\n')
}

export function sanitizeSummaryConfig(raw: unknown): SummaryConfig {
  const r = (raw ?? {}) as Record<string, unknown>
  return {
    niveau: ['grundlagen', 'solide', 'matura'].includes(r.niveau as string) ? r.niveau as SummaryConfig['niveau'] : 'solide',
    laenge: ['kompakt', 'standard', 'ausfuehrlich'].includes(r.laenge as string) ? r.laenge as SummaryConfig['laenge'] : 'standard',
    stil: ['fliesstext', 'stichpunkte', 'lernskript'].includes(r.stil as string) ? r.stil as SummaryConfig['stil'] : 'lernskript',
    extras: Array.isArray(r.extras) ? r.extras.slice(0, 6).map(String) : [],
  }
}

// ── Erkennung: will die Nachricht eines der Studio-Werkzeuge? (agentische
// Aktion im Chat) — ein Keyword-Set pro Tool, geprüft in fester Reihenfolge,
// damit z.B. "Zusammenfassung als Lernkarten" nicht zweideutig bleibt.
const TOOL_ORDER: ToolId[] = ['lernkarten', 'quiz', 'mindmap', 'podcast', 'zusammenfassung']

const TOOL_KEYWORDS: Record<ToolId, RegExp> = {
  lernkarten: /(lernkarten|karteikarten|flashcards?|leitner.?karten)/i,
  quiz: /(quiz|prüfungsfragen|testfragen|multiple.?choice|üb(u|ue)ngsfragen)/i,
  mindmap: /(mind ?map|mindkarte|gedankenkarte)/i,
  podcast: /(podcast|hörbeitrag|audio.?zusammenfassung)/i,
  zusammenfassung: /(zusammenfassung|zusammen ?fassen|fass .{0,40}zusammen|\bzsmf\b|\bzf\b|summary|lernskript)/i,
}

const TOOL_STRIP: Record<ToolId, RegExp> = {
  lernkarten: /\blernkarten\b|\bkarteikarten\b|\bflashcards?\b|\bleitner.?karten\b/gi,
  quiz: /\bquiz\b|\bprüfungsfragen\b|\btestfragen\b|\bmultiple.?choice\b|\büb(u|ue)ngsfragen\b/gi,
  mindmap: /\bmind ?map\b|\bmindkarte\b|\bgedankenkarte\b/gi,
  podcast: /\bpodcast\b|\bhörbeitrag\b|\baudio.?zusammenfassung\b/gi,
  zusammenfassung: /zusammen ?fassung(en)?|zusammen ?fassen|\bfass(e|t)?\b|\bzusammen\b|\bzsmf\b|\bsummary\b|\blernskript\b/gi,
}

const COMMON_STRIP = /\b(hallo|hi|hey|servus|moin|hoi|kannst|könntest|kann|würdest|du|mir|mal|bitte|noch|jetzt|mach(en|e|st)?|erstell(en|e|st)?|gib|schreib(e|st)?|eine?[nmrs]?|word|als|davon|dazu|darüber|über|zum|thema|zu[rm]?|die|der|das|den|und|ein|kurze?|bzw|zf)\b/gi

/** Erkennt, ob die Nachricht ein Studio-Werkzeug will, und welches Thema gemeint ist. */
export function detectStudioIntent(message: string): { tool: ToolId; topic: string } | null {
  const m = message.toLowerCase()
  const tool = TOOL_ORDER.find((t) => TOOL_KEYWORDS[t].test(m))
  if (!tool) return null
  // Thema = Nachricht ohne die Auftrags-Floskeln
  const topic = message
    .replace(TOOL_STRIP[tool], ' ')
    .replace(COMMON_STRIP, ' ')
    .replace(/(^|\s)übers?(?=\s|$)/gi, ' ') // \b greift bei Umlaut-Anfang nicht
    .replace(/[?!.,;:]+/g, ' ')
    .replace(/\s+/g, ' ').trim()
  return { tool, topic: topic.length >= 3 ? topic : '' }
}
