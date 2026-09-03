// Konfigurierbare Studio-Werkzeuge ausser der Zusammenfassung (die liegt samt
// Intent-Erkennung in summary.ts): Podcast und Tabelle. Wie dort wandert die
// Konfiguration als Klartext in den Prompt — n8n bleibt unverändert, es gibt
// keinen zweiten Ort, an dem Optionen gepflegt werden müssten.

// ── Podcast ──────────────────────────────────────────────────────────────────

export interface PodcastConfig {
  laenge: 'kurz' | 'standard' | 'lang'
  tiefe: 'ueberblick' | 'deep' | 'pruefung'
  ton: 'locker' | 'sachlich' | 'story'
  extras: string[]
}

export const DEFAULT_PODCAST_CONFIG: PodcastConfig = {
  laenge: 'standard', tiefe: 'ueberblick', ton: 'locker', extras: [],
}

/** Zielminuten je Länge — dieselbe Tabelle nutzt die UI für ihre Beschriftung. */
export const PODCAST_MINUTES = { kurz: 3, standard: 7, lang: 12 } as const

// Deutsche Sprechgeschwindigkeit der TTS-Stimme: ~135 Wörter/Minute (an den
// bisherigen Podcasts gemessen). Das Skript ist der einzige Hebel auf die
// Länge — die Synthese liest exakt so lange, wie der Text hergibt.
const WORDS_PER_MINUTE = 135

const TIEFE_TEXT = {
  ueberblick: 'Tiefe: Überblick — die grossen Linien, damit man das Thema als Ganzes versteht.',
  deep: 'Tiefe: Deep Dive — geh wirklich in die Tiefe, erkläre Mechanismen, Herleitungen und Sonderfälle statt nur Begriffe zu nennen.',
  pruefung: 'Tiefe: Prüfungsfokus — konzentriere dich auf das, was erfahrungsgemäss geprüft wird: typische Aufgabentypen, Stolperfallen, häufige Fehler.',
}
const TON_TEXT = {
  locker: 'Ton: locker und gesprochen, wie ein guter Nachhilfelehrer, der neben einem sitzt. Du-Form, kurze Sätze, gern mal ein Vergleich aus dem Alltag.',
  sachlich: 'Ton: sachlich und konzentriert, ohne Geplauder — klare Struktur, präzise Fachsprache, jeder Satz trägt Information.',
  story: 'Ton: als Geschichte erzählt — ein roter Faden mit Spannungsbogen, in den die Fachinhalte eingebettet sind.',
}

export function buildPodcastPrompt(base: string, cfg: PodcastConfig): string {
  const minutes = PODCAST_MINUTES[cfg.laenge]
  const words = minutes * WORDS_PER_MINUTE
  const extras = cfg.extras.length ? `Bau ausserdem ein: ${cfg.extras.join(', ')}.` : ''
  return [
    `Erstelle ein Podcast-Skript zum Thema: ${base}`,
    `Ziel-Länge: ca. ${minutes} Minuten gesprochen — das sind rund ${words} Wörter. Halte diese Länge ein (±15%), nicht kürzer.`,
    TIEFE_TEXT[cfg.tiefe], TON_TEXT[cfg.ton], extras,
    'Schreibe reinen Sprechtext: keine Überschriften, keine Aufzählungszeichen, keine Regieanweisungen, keine Sprecher-Namen, keine Emojis.',
    'Formeln und Zahlen ausgeschrieben, wie man sie spricht (also "E gleich m mal c hoch zwei", nicht "$E=mc^2$").',
    'Beginne mit einem Satz, worum es geht, und schliesse mit einer kurzen Zusammenfassung der Kernpunkte.',
  ].filter(Boolean).join('\n')
}

export function sanitizePodcastConfig(raw: unknown): PodcastConfig {
  const r = (raw ?? {}) as Record<string, unknown>
  return {
    laenge: ['kurz', 'standard', 'lang'].includes(r.laenge as string) ? r.laenge as PodcastConfig['laenge'] : 'standard',
    tiefe: ['ueberblick', 'deep', 'pruefung'].includes(r.tiefe as string) ? r.tiefe as PodcastConfig['tiefe'] : 'ueberblick',
    ton: ['locker', 'sachlich', 'story'].includes(r.ton as string) ? r.ton as PodcastConfig['ton'] : 'locker',
    extras: Array.isArray(r.extras) ? r.extras.slice(0, 6).map((x) => String(x).slice(0, 60)) : [],
  }
}

// ── Tabelle ──────────────────────────────────────────────────────────────────
// Eigenes Werkzeug, aber kein eigener n8n-Workflow: die Tabelle läuft über den
// Zusammenfassungs-Hook (siehe n8n.ts) — dasselbe Modell, nur ein anderer
// Auftrag. Ergebnis ist Markdown mit genau einer Tabelle, damit Web-Ansicht,
// Word- und Excel-Export alle dieselbe Quelle haben.

export interface TableConfig {
  art: 'vergleich' | 'begriffe' | 'zeitstrahl' | 'formeln' | 'frei'
  umfang: 'klein' | 'mittel' | 'gross'
  spalten: string
}

export const DEFAULT_TABLE_CONFIG: TableConfig = { art: 'vergleich', umfang: 'mittel', spalten: '' }

const ART_TEXT = {
  vergleich: 'Art: Vergleichstabelle — stelle die zentralen Begriffe/Positionen einander gegenüber, eine Zeile pro verglichenem Ding.',
  begriffe: 'Art: Begriffstabelle — Fachbegriff, Definition in einem Satz, Beispiel.',
  zeitstrahl: 'Art: Zeittabelle — Jahr/Zeitraum, Ereignis, Bedeutung; chronologisch sortiert.',
  formeln: 'Art: Formelsammlung — Formel, Bedeutung der Variablen, wann man sie anwendet.',
  frei: 'Art: die Struktur, die zum Thema am besten passt.',
}
const UMFANG_ROWS = { klein: '6–8', mittel: '12–16', gross: '20–30' }

export function buildTablePrompt(base: string, cfg: TableConfig): string {
  return [
    `Erstelle eine Tabelle zum Thema: ${base}`,
    ART_TEXT[cfg.art],
    `Umfang: ${UMFANG_ROWS[cfg.umfang]} Zeilen.`,
    cfg.spalten.trim() ? `Gewünschte Spalten: ${cfg.spalten.trim()}.` : '',
    'Antworte mit einer einzigen Markdown-Tabelle (Kopfzeile + Trennzeile + Datenzeilen), davor genau eine Zeile "# <Titel>".',
    'Kein Fliesstext davor oder danach, keine Erklärung, keine Code-Zäune.',
    'Jede Zelle kurz halten (max. ein Satz), Zeilenumbrüche innerhalb einer Zelle vermeiden.',
  ].filter(Boolean).join('\n')
}

export function sanitizeTableConfig(raw: unknown): TableConfig {
  const r = (raw ?? {}) as Record<string, unknown>
  return {
    art: ['vergleich', 'begriffe', 'zeitstrahl', 'formeln', 'frei'].includes(r.art as string) ? r.art as TableConfig['art'] : 'vergleich',
    umfang: ['klein', 'mittel', 'gross'].includes(r.umfang as string) ? r.umfang as TableConfig['umfang'] : 'mittel',
    spalten: typeof r.spalten === 'string' ? r.spalten.slice(0, 120) : '',
  }
}
