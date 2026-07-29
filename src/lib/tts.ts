// Server-only: Google Cloud Text-to-Speech (Neural2) für den Sprachmodus —
// eine echte KI-Stimme statt der robotischen Browser-Stimme. Ohne
// GOOGLE_TTS_API_KEY läuft alles weiter über window.speechSynthesis im
// Client (derselbe Demo-Fallback-Gedanke wie bei N8N_BASE).

const API_KEY = process.env.GOOGLE_TTS_API_KEY
const VOICE = process.env.GOOGLE_TTS_VOICE || 'de-DE-Neural2-F'
// Kostenkontrolle: Sprachmodus-Antworten sollen ohnehin kurz/knackig sein,
// nicht der ganze Roman — begrenzt zugleich die Kosten pro Synthese.
const MAX_LEN = 1200

export function ttsAvailable(): boolean {
  return !!API_KEY
}

/** Grobe Markdown-Entschärfung, damit keine Sternchen/Codeblöcke vorgelesen werden. */
function cleanForSpeech(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, ' Codebeispiel. ')
    .replace(/\$\$?[^$]*\$\$?/g, ' Formel. ')
    .replace(/[#*_>`|]/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .slice(0, MAX_LEN)
}

/** Liefert base64-kodiertes MP3 oder null (nicht konfiguriert / Fehler → Client fällt auf Browser-Stimme zurück). */
export async function synthesizeSpeech(text: string): Promise<string | null> {
  if (!API_KEY) return null
  const clean = cleanForSpeech(text).trim()
  if (!clean) return null
  try {
    const res = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: { text: clean },
        voice: { languageCode: 'de-DE', name: VOICE },
        audioConfig: { audioEncoding: 'MP3', speakingRate: 1.0 },
      }),
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) return null
    const json = (await res.json()) as { audioContent?: string }
    return typeof json.audioContent === 'string' ? json.audioContent : null
  } catch {
    return null
  }
}
