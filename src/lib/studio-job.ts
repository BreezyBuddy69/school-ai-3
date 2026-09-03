import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { db, newId, bumpUsage, refundUsage, touchStreak, DATA_DIR } from '@/lib/db'
import { readTopic } from '@/lib/subjects'
import { callN8n, type HookKind } from '@/lib/n8n'
import { buildSummaryPrompt, sanitizeSummaryConfig } from '@/lib/summary'
import { buildPodcastPrompt, sanitizePodcastConfig, buildTablePrompt, sanitizeTableConfig } from '@/lib/studio-config'
import type { MindmapNode } from '@/components/studio/MindmapModal'
import type { User } from '@/lib/auth'

// Studio-Generierungen laufen als serverseitiger Job, nicht als lang offener
// Browser-Request. Der Ablauf ist damit:
//
//   POST /api/studio/<tool>  →  Projektzeile mit status='pending' + Auftrag,
//                               Antwort sofort (kein Warten am Draht)
//   after()                  →  runStudioJob() ruft n8n, schreibt Ergebnis
//   Client                   →  fragt die Zeile ab, bis status != 'pending'
//
// Warum: ein Fach- oder Tab-Wechsel, ein WLAN-Aussetzer oder ein zugeklappter
// Laptop hat vorher die Generierung mitgerissen ("Die Generierung hat nicht
// geklappt", obwohl n8n sauber durchlief). Jetzt überlebt der Auftrag den
// Browser, und ein Fehlschlag bleibt als wiederholbare Karte stehen, statt in
// einem alert() zu verpuffen.

export const STUDIO_TOOLS = ['lernkarten', 'zusammenfassung', 'quiz', 'mindmap', 'podcast', 'tabelle'] as const
export type StudioTool = (typeof STUDIO_TOOLS)[number]

export interface StudioJobParams {
  tool: StudioTool
  subject: string
  prompt: string
  sources: string[]
  config?: unknown
}

const NAME_PREFIX: Record<StudioTool, string> = {
  lernkarten: 'Lernkarten', zusammenfassung: 'Zusammenfassung', quiz: 'Quiz',
  mindmap: 'Mindmap', podcast: 'Podcast', tabelle: 'Tabelle',
}

/** Rohes PCM (Gemini-TTS: 24kHz/16-bit/mono über OpenRouter) in eine abspielbare WAV-Datei verpacken. */
function pcmToWav(pcm: Buffer, sampleRate = 24000, channels = 1, bitsPerSample = 16): Buffer {
  const blockAlign = channels * (bitsPerSample / 8)
  const header = Buffer.alloc(44)
  header.write('RIFF', 0)
  header.writeUInt32LE(36 + pcm.length, 4)
  header.write('WAVE', 8)
  header.write('fmt ', 12)
  header.writeUInt32LE(16, 16)
  header.writeUInt16LE(1, 20)
  header.writeUInt16LE(channels, 22)
  header.writeUInt32LE(sampleRate, 24)
  header.writeUInt32LE(sampleRate * blockAlign, 28)
  header.writeUInt16LE(blockAlign, 32)
  header.writeUInt16LE(bitsPerSample, 34)
  header.write('data', 36)
  header.writeUInt32LE(pcm.length, 40)
  return Buffer.concat([header, pcm])
}

/** n8n liefert JSON manchmal in Markdown-Zäunen — tolerant parsen. */
function parseJsonArray<T>(raw: string): T[] {
  const cleaned = raw.replace(/```(?:json)?/g, '').trim()
  const start = cleaned.indexOf('[')
  const end = cleaned.lastIndexOf(']')
  if (start === -1 || end === -1) throw new Error('Kein JSON-Array in der Antwort')
  return JSON.parse(cleaned.slice(start, end + 1)) as T[]
}

/** Dasselbe für ein einzelnes JSON-Objekt (Mindmap-Wurzel) statt eines Arrays. */
function parseJsonObject<T>(raw: string): T {
  const cleaned = raw.replace(/```(?:json)?/g, '').trim()
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')
  if (start === -1 || end === -1) throw new Error('Kein JSON-Objekt in der Antwort')
  return JSON.parse(cleaned.slice(start, end + 1)) as T
}

interface RawMindmapNode { label?: string; children?: RawMindmapNode[] }
const MINDMAP_MAX_NODES = 60
const MINDMAP_MAX_DEPTH = 5 // Wurzel + 4 Ebenen (n8n-Prompt bittet um Wurzel + 3, kleine Sicherheitsmarge)

/** Verschachteltes Rohobjekt aus n8n in einen MindmapNode-Baum mit stabilen, pfadbasierten IDs umwandeln. */
function toMindmapTree(raw: RawMindmapNode): MindmapNode {
  let count = 0
  function walk(n: RawMindmapNode, id: string, depth: number): MindmapNode {
    count++
    const label = String(n.label ?? '').trim() || 'Ohne Titel'
    const rawChildren = depth < MINDMAP_MAX_DEPTH && Array.isArray(n.children) ? n.children : []
    const children: MindmapNode[] = []
    for (let i = 0; i < rawChildren.length && count < MINDMAP_MAX_NODES; i++) {
      children.push(walk(rawChildren[i], `${id}-${i}`, depth + 1))
    }
    return children.length ? { id, label, children } : { id, label }
  }
  return walk(raw, '0', 0)
}

/**
 * Legt die Projektzeile im Zustand `pending` an (inkl. Prüfungs-Ordner) und
 * gibt sie zurück. Der Auftrag selbst wandert als JSON in `content` — daraus
 * speist sich sowohl der Lauf als auch ein späterer Wiederholungsversuch.
 */
export function createStudioJob(user: User, params: StudioJobParams) {
  const title = NAME_PREFIX[params.tool]
  const name = `${title}: ${params.prompt.slice(0, 60)}`
  const id = newId('p')

  // Prüfungs-Ordner: Projekte aus derselben Themenauswahl landen automatisch
  // im selben Ordner (eine Prüfung kann mehrere Themen abdecken).
  let folderId: string | null = null
  const readSources = params.sources.map((slug) => readTopic(slug, user.id)).filter((t) => !!t)
  if (readSources.length > 0) {
    const topicKey = [...params.sources].sort().join('|')
    const titles = readSources.map((s) => s!.title)
    const folderName = (titles.length <= 2 ? titles.join(' & ') : `${titles.slice(0, 2).join(', ')} & +${titles.length - 2} weitere`).slice(0, 80)
    const d = db()
    d.prepare(`
      INSERT INTO project_folders (id, user_id, subject, name, topic_key) VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(user_id, subject, topic_key) DO NOTHING
    `).run(newId('f'), user.id, params.subject, folderName, topicKey)
    const folder = d.prepare('SELECT id FROM project_folders WHERE user_id = ? AND subject = ? AND topic_key = ?')
      .get(user.id, params.subject, topicKey) as { id: string } | undefined
    folderId = folder?.id ?? null
  }

  db().prepare(`
    INSERT INTO projects (id, user_id, subject, type, name, content, folder_id, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
  `).run(id, user.id, params.subject, params.tool, name, JSON.stringify({ job: params }), folderId)

  // Kontingent zählt ab dem Auftrag, nicht ab dem Ergebnis — sonst könnte man
  // sich am Tageslimit vorbei zehn Jobs gleichzeitig starten. Scheitert der
  // Job, bucht runStudioJob() wieder zurück.
  bumpUsage(user.id, `studio:${params.tool}`)
  touchStreak(user.id)

  return { id, name, type: params.tool, subject: params.subject, status: 'pending' as const, folderId }
}

/** Liest den Auftrag einer pending/error-Zeile zurück (für Lauf und Wiederholung). */
export function jobParams(content: string): StudioJobParams | null {
  try {
    const parsed = JSON.parse(content) as { job?: StudioJobParams }
    return parsed.job ?? null
  } catch { return null }
}

/**
 * Führt den Job aus und schreibt das Ergebnis in die Projektzeile. Wirft nie —
 * ein Fehler landet als `status='error'` samt Meldung in der Zeile, sodass die
 * Karte im Studio einen Wiederholen-Knopf zeigen kann.
 */
export async function runStudioJob(user: User, projectId: string, params: StudioJobParams): Promise<void> {
  const { tool } = params
  try {
    const sourceContents = params.sources
      .map((slug) => ({ slug, topic: readTopic(slug, user.id) }))
      .filter((s) => !!s.topic)
      .map((s) => ({ topic: s.slug, content: s.topic!.content }))

    const content =
      tool === 'zusammenfassung' ? buildSummaryPrompt(params.prompt, sanitizeSummaryConfig(params.config))
      : tool === 'podcast' ? buildPodcastPrompt(params.prompt, sanitizePodcastConfig(params.config))
      : tool === 'tabelle' ? buildTablePrompt(params.prompt, sanitizeTableConfig(params.config))
      : params.prompt

    const raw = await callN8n(tool as HookKind, user.tier, {
      content,
      profile: { name: user.name, class: user.klasse, jahr: user.jahr, profile: user.profil },
      selectedSources: sourceContents,
      subject: params.subject,
    })

    let stored: string
    if (tool === 'lernkarten') {
      const cards = parseJsonArray<{ front: string; back: string }>(raw)
        .filter((c) => c.front && c.back).slice(0, 100)
      if (cards.length === 0) throw new Error('Keine Karten erhalten')
      stored = JSON.stringify(cards)
    } else if (tool === 'quiz') {
      const qs = parseJsonArray<{ frage: string; a: string; b: string; c: string; d: string; correct: string }>(raw)
        .filter((q) => q.frage && q.correct).slice(0, 50)
      if (qs.length === 0) throw new Error('Keine Fragen erhalten')
      stored = JSON.stringify(qs)
    } else if (tool === 'mindmap') {
      const rawTree = parseJsonObject<RawMindmapNode>(raw)
      if (!rawTree.label) throw new Error('Keine Mindmap erhalten')
      stored = JSON.stringify(toMindmapTree(rawTree))
    } else if (tool === 'podcast') {
      const parsed = JSON.parse(raw) as { script: string; audioBase64: string | null }
      if (!parsed.script) throw new Error('Kein Skript erhalten')
      let audioPath: string | null = null
      let durationSec: number | null = null
      if (parsed.audioBase64) {
        const pcm = Buffer.from(parsed.audioBase64, 'base64')
        mkdirSync(path.join(DATA_DIR, 'audio'), { recursive: true })
        writeFileSync(path.join(DATA_DIR, 'audio', `${projectId}.wav`), pcmToWav(pcm))
        audioPath = `${projectId}.wav`
        // Exakte Länge aus dem PCM statt aus dem Browser: 24 kHz, 16 Bit, mono
        // → 48'000 Bytes pro Sekunde. Der Player zeigt die Gesamtzeit damit
        // sofort an, auch bevor die Datei fertig geladen ist.
        durationSec = Math.round((pcm.length / (24000 * 2)) * 10) / 10
      }
      stored = JSON.stringify({ script: parsed.script, audioPath, durationSec, config: sanitizePodcastConfig(params.config) })
    } else if (tool === 'tabelle') {
      if (!raw.includes('|')) throw new Error('Keine Tabelle in der Antwort')
      stored = JSON.stringify({ markdown: raw.replace(/```(?:markdown)?/g, '').trim(), config: sanitizeTableConfig(params.config) })
    } else {
      stored = JSON.stringify({ markdown: raw, config: sanitizeSummaryConfig(params.config) })
    }

    db().prepare("UPDATE projects SET content = ?, status = 'ready', error = NULL WHERE id = ? AND user_id = ?")
      .run(stored, projectId, user.id)

    // Lernkarten wandern zusätzlich als SRS-Karten in die Fälligkeits-Queue.
    if (tool === 'lernkarten') {
      const insert = db().prepare('INSERT INTO cards (project_id, user_id, front, back) VALUES (?, ?, ?, ?)')
      for (const c of JSON.parse(stored) as { front: string; back: string }[]) insert.run(projectId, user.id, c.front, c.back)
    }
  } catch (err) {
    console.error(`studio/${tool} job ${projectId} failed:`, err)
    const message = err instanceof Error && /abort|timeout/i.test(err.message)
      ? 'Die KI hat zu lange gebraucht.'
      : 'Die Generierung hat nicht geklappt.'
    db().prepare("UPDATE projects SET status = 'error', error = ? WHERE id = ? AND user_id = ?")
      .run(message, projectId, user.id)
    refundUsage(user.id, `studio:${tool}`)
  }
}
