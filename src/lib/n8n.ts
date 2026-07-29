// Einziger Ort, an dem n8n-Webhooks existieren. Diese Datei läuft NUR auf
// dem Server — der Browser sieht weder URLs noch Secrets (im alten school-ai
// standen die Pro-Webhooks im Client-Bundle; genau das ist hier abgestellt).
//
// Ohne N8N_BASE läuft alles im Demo-Modus: deterministische Mock-Antworten,
// klar gekennzeichnet — `docker compose up` auf nackter Maschine bleibt vorführbar.
// Vollständiger Vertrag inkl. Zielbild (Tool-Calls, Streaming): N8N-CONTRACT.md.

import type { Tier } from './auth'

const BASE = process.env.N8N_BASE // z.B. https://n8n.halovisionai.cloud/webhook
const SECRET = process.env.N8N_SECRET

// Bestehende Workflows (Stand school-ai v1) — pro Feature ein free/pro-Paar.
const HOOKS = {
  chat: { free: 'lgagentfree-42ae-8caf-4bf7db07019d', pro: 'lgagent-42ae-8caf-4bf7db07019d' },
  lernkarten: { free: 'lgagentkarteikartenfree-42ae-8caf-4bf7db07019d', pro: 'lgagentkarteikartenpro-42ae-8caf-4bf7db07019d' },
  zusammenfassung: { free: 'lgagentzusammenfassungfree-42ae-8caf-4bf7db07019d', pro: 'lgagentzusammenfassungpro-42ae-8caf-4bf7db07019d' },
  quiz: { free: 'lgagentquizfree-42ae-8caf-4bf7db07019d', pro: 'lgagentquizpro-42ae-8caf-4bf7db07019d' },
  mindmap: { free: 'lgagentmindmapfree-42ae-8caf-4bf7db07019d', pro: 'lgagentmindmapfree-42ae-8caf-4bf7db07019d'.replace('free', 'pro') },
  // Podcast hat nur einen Workflow (kein separates Free-Modell-Routing) —
  // free/pro/premium landen auf demselben Webhook; gatePodcast() sperrt Free vorher aus.
  podcast: { free: 'lgagentpodcast-42ae-8caf-4bf7db07019d', pro: 'lgagentpodcast-42ae-8caf-4bf7db07019d' },
  // Kurzer Cleanup-Pass für diktierten Sprachmodus-Text (Wispr-Flow-Stil):
  // Füllwörter raus, Interpunktion korrigiert, Bedeutung unverändert.
  voiceCleanup: { free: 'lgagentvoicecleanupfree-42ae-8caf-4bf7db07019d', pro: 'lgagentvoicecleanuppro-42ae-8caf-4bf7db07019d' },
} as const

export type HookKind = keyof typeof HOOKS

export function isDemoMode(): boolean {
  return !BASE
}

/**
 * Transaktions-Mails (E-Mail-Bestätigung, Passwort-Reset) über den Webhook
 * `lgki-mail` (Spezifikation: N8N-CONTRACT.md — Webhook-Trigger → Gmail-Node).
 * Solange der Workflow nicht existiert, liefert das false und die App zeigt
 * dem Nutzer den Link direkt (Verify) bzw. loggt ihn serverseitig (Reset).
 */
export async function sendMail(to: string, subject: string, text: string): Promise<boolean> {
  if (!BASE) return false
  try {
    const res = await fetch(`${BASE}/lgki-mail`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(SECRET ? { 'X-LGKI-Secret': SECRET } : {}) },
      body: JSON.stringify({ to, subject, text }),
      signal: AbortSignal.timeout(15_000),
    })
    return res.ok
  } catch {
    return false
  }
}

/**
 * Best-effort Log-Eintrag für neue Registrierungen im bestehenden Google-Sheet
 * "LG KI db" (Webhook `lgagentdatenbank-…`, schon in n8n verdrahtet — bisher
 * ungenutzt). Darf die Registrierung nie verzögern oder scheitern lassen.
 */
export async function logRegistration(email: string, tier: Tier): Promise<void> {
  if (!BASE) return
  try {
    await fetch(`${BASE}/lgagentdatenbank-42ae-8caf-4bf7db07019d`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(SECRET ? { 'X-LGKI-Secret': SECRET } : {}) },
      body: JSON.stringify({ event: 'register', profile: { email }, tier }),
      signal: AbortSignal.timeout(8_000),
    })
  } catch {
    // Sheet-Log ist reine Kür — kein Nutzer merkt etwas von einem Fehler hier.
  }
}

/**
 * Best-effort Log-Eintrag für Code-Einlösungen, derselbe Webhook wie
 * `logRegistration()` (`event` unterscheidet die Zeile in n8n). Der Code
 * selbst verschwindet nach Verbrauch aus der DB (siehe redeem/route.ts) —
 * dieses Sheet ist damit das einzige dauerhafte Protokoll, welcher Code an
 * wen ging. Darf die Einlösung nie verzögern oder scheitern lassen.
 */
export async function logRedemption(email: string, code: string, tier: Tier): Promise<void> {
  if (!BASE) return
  try {
    await fetch(`${BASE}/lgagentdatenbank-42ae-8caf-4bf7db07019d`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(SECRET ? { 'X-LGKI-Secret': SECRET } : {}) },
      body: JSON.stringify({ event: 'redeem', profile: { email }, tier, code }),
      signal: AbortSignal.timeout(8_000),
    })
  } catch {
    // Sheet-Log ist reine Kür — kein Nutzer merkt etwas von einem Fehler hier.
  }
}

/**
 * Ruft einen n8n-Workflow auf. `tier` wählt die Modell-Route (free-Modelle vs.
 * bezahlte) — das Modell-Routing selbst lebt in n8n, Keys verlassen n8n nie.
 * Antwortformat der v1-Workflows: { output: string }.
 */
export async function callN8n(kind: HookKind, tier: Tier, payload: Record<string, unknown>): Promise<string> {
  if (!BASE) return demoResponse(kind, payload)
  const route = tier === 'free' ? HOOKS[kind].free : HOOKS[kind].pro
  const res = await fetch(`${BASE}/${route}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(SECRET ? { 'X-LGKI-Secret': SECRET } : {}),
    },
    body: JSON.stringify({ ...payload, tier }),
    // Podcast = Skript-Agent + TTS-Synthese hintereinander, das dauert real
    // 2-2.5 Minuten (live gemessen) — braucht mehr Luft als die Text-Tools.
    signal: AbortSignal.timeout(kind === 'podcast' ? 240_000 : 120_000),
  })
  if (!res.ok) throw new Error(`n8n ${kind} antwortete ${res.status}`)
  const raw = await res.text()
  // Podcast liefert {script, audioBase64} statt {output} — roh durchreichen,
  // der Aufrufer (studio/[tool]/route.ts) parst das Objekt selbst.
  if (kind === 'podcast') return raw
  let result: string
  try {
    const json = JSON.parse(raw)
    result = typeof json === 'string' ? json : (json.output ?? json.text ?? json.answer ?? raw)
  } catch {
    result = raw
  }
  // Stürzt der n8n-Agent intern ab (z.B. Fehler im LangChain-Agent-Node),
  // feuert "Respond to Webhook" nie — der Webhook antwortet trotzdem mit
  // 200 und leerem Body. Ohne diese Prüfung endet der Chat wortlos: kein
  // Fehler, keine Antwort, nur ein stehengebliebenes "Gedacht für Ns".
  if (!result.trim() && kind !== 'voiceCleanup') {
    throw new Error(`n8n ${kind} lieferte eine leere Antwort (Agent vermutlich abgestürzt)`)
  }
  return result
}

// ── Demo-Modus ───────────────────────────────────────────────────────────────

function demoResponse(kind: HookKind, payload: Record<string, unknown>): string {
  const topic = String(payload.subject ?? payload.topic ?? 'dein Thema')
  switch (kind) {
    case 'chat':
      return [
        `**Demo-Modus** — es ist kein n8n-Backend konfiguriert (\`N8N_BASE\` fehlt), darum antwortet hier eine Mock-KI.`,
        ``,
        `Deine Frage zu **${topic}** würde normalerweise so beantwortet:`,
        ``,
        `1. Kernidee in einem Satz`,
        `2. Schritt-für-Schritt-Erklärung mit Beispiel`,
        `3. $E = mc^2$ — Formeln werden mit KaTeX gerendert`,
        ``,
        `> **Prüfungs-Tipp:** Genau so sähe ein Callout im echten Betrieb aus.`,
      ].join('\n')
    case 'lernkarten':
      return JSON.stringify([
        { front: 'Was ist der Demo-Modus?', back: 'Mock-Antworten ohne n8n-Backend — zum Testen des kompletten Flows.' },
        { front: 'Wie aktiviert man die echte KI?', back: 'N8N_BASE und N8N_SECRET in .env setzen, Workflows nach N8N-CONTRACT.md bauen.' },
        { front: 'Welches Karteikarten-System nutzt LG KI?', back: 'Leitner-Boxen (1–5) mit täglicher Fälligkeits-Queue.' },
      ])
    case 'quiz':
      return JSON.stringify([
        { frage: 'In welchem Modus läuft diese Instanz?', a: 'Produktiv', b: 'Demo', c: 'Wartung', d: 'Offline', correct: 'B' },
        { frage: 'Wo wird das KI-Modell gewählt?', a: 'Im Browser', b: 'In Next.js', c: 'In n8n', d: 'In SQLite', correct: 'C' },
      ])
    case 'mindmap':
      return JSON.stringify({
        label: topic,
        children: [
          { label: 'Demo-Modus', children: [{ label: 'Mock-Antworten' }, { label: 'Kein n8n nötig' }, { label: 'Voller UI-Flow' }] },
          { label: 'Echtbetrieb', children: [{ label: 'N8N_BASE setzen' }, { label: 'Workflows deployen' }, { label: 'Secret prüfen' }] },
        ],
      })
    case 'zusammenfassung':
      return [
        `# ${topic} — Zusammenfassung (Demo)`,
        ``,
        `## Worum es geht`,
        `Dies ist eine Demo-Zusammenfassung. Im Echtbetrieb liefert n8n hier strukturierten, niveau-angepassten Inhalt.`,
        ``,
        `## Merke`,
        `> Die Konfiguration (Niveau, Länge, Stil) wandert als Teil des Prompts an den Workflow.`,
        ``,
        `| Begriff | Bedeutung |`,
        `|---|---|`,
        `| Demo-Modus | Betrieb ohne n8n-Backend |`,
        `| Word-Export | Rendert genau diese Struktur als .docx |`,
      ].join('\n')
    case 'podcast':
      return JSON.stringify({
        script: `Demo-Modus: Hier stünde das gesprochene Skript zu ${topic}. Ohne N8N_BASE gibt es keine echte Audio-Generierung — das kommt erst im Echtbetrieb über OpenRouter/Gemini-TTS.`,
        audioBase64: null,
      })
    case 'voiceCleanup':
      // Ohne Backend einfach den diktierten Text unverändert zurückgeben —
      // der Diktier-Flow bleibt so auch im Demo-Modus vollständig testbar.
      return String(payload.text ?? '')
  }
}
