import { NextRequest, NextResponse } from 'next/server'
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { currentUser } from '@/lib/auth'
import { db, newId, bumpUsage, touchStreak, DATA_DIR } from '@/lib/db'
import { gateStudio, gatePodcast } from '@/lib/tiers'
import { readTopic } from '@/lib/subjects'
import { callN8n, type HookKind } from '@/lib/n8n'
import { allow } from '@/lib/rate-limit'
import { buildSummaryPrompt, sanitizeSummaryConfig, type SummaryConfig } from '@/lib/summary'
import type { MindmapNode } from '@/components/studio/MindmapModal'

// Ein Endpunkt für alle Studio-Werkzeuge. Der Unterschied zwischen den Tools
// ist (a) der n8n-Workflow und (b) wie die Antwort geparst/gespeichert wird.

const TOOLS = ['lernkarten', 'zusammenfassung', 'quiz', 'mindmap', 'podcast'] as const
type Tool = (typeof TOOLS)[number]

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

export type { SummaryConfig } from '@/lib/summary'

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

export async function POST(req: NextRequest, { params }: { params: Promise<{ tool: string }> }) {
  const { tool } = await params
  if (!TOOLS.includes(tool as Tool)) return NextResponse.json({ error: 'Unbekanntes Werkzeug' }, { status: 404 })
  const user = await currentUser()
  if (!user) return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 })

  const gate = tool === 'podcast' ? gatePodcast(user.tier, user.id) : gateStudio(user.tier, user.id, tool)
  if (!gate.ok) return NextResponse.json({ error: gate.reason, upgrade: gate.upgrade }, { status: 402 })
  if (!allow(`studio:${user.id}`, 10, 60_000)) {
    return NextResponse.json({ error: 'Kurz durchatmen — zu viele Generierungen auf einmal.' }, { status: 429 })
  }

  const body = await req.json().catch(() => ({}))
  const subject = String(body.subject ?? '').slice(0, 80)
  const prompt = String(body.prompt ?? '').trim().slice(0, 2000)
  const sources: string[] = Array.isArray(body.sources) ? body.sources.slice(0, 12) : []
  if (!subject || !prompt) return NextResponse.json({ error: 'Fach oder Thema fehlt' }, { status: 400 })

  const readSources = sources
    .map((slug) => ({ slug, topic: readTopic(slug) }))
    .filter((s): s is { slug: string; topic: NonNullable<ReturnType<typeof readTopic>> } => !!s.topic)
  const sourceContents = readSources.map((s) => ({ topic: s.slug, content: s.topic.content }))

  const cfg: SummaryConfig | null = tool === 'zusammenfassung' ? sanitizeSummaryConfig(body.config) : null

  const content = cfg ? buildSummaryPrompt(prompt, cfg) : prompt

  try {
    const raw = await callN8n(tool as HookKind, user.tier, {
      content,
      profile: { name: user.name, class: user.klasse, jahr: user.jahr, profile: user.profil },
      selectedSources: sourceContents,
      subject,
    })

    let stored: string
    const namePrefix = { lernkarten: 'Lernkarten', zusammenfassung: 'Zusammenfassung', quiz: 'Quiz', mindmap: 'Mindmap', podcast: 'Podcast' }[tool as Tool]
    const id = newId('p')
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
      if (parsed.audioBase64) {
        const wav = pcmToWav(Buffer.from(parsed.audioBase64, 'base64'))
        mkdirSync(path.join(DATA_DIR, 'audio'), { recursive: true })
        writeFileSync(path.join(DATA_DIR, 'audio', `${id}.wav`), wav)
        audioPath = `${id}.wav`
      }
      stored = JSON.stringify({ script: parsed.script, audioPath })
    } else {
      stored = cfg ? JSON.stringify({ markdown: raw, config: cfg }) : raw
    }

    const name = `${namePrefix}: ${prompt.slice(0, 60)}`

    // Prüfungs-Ordner: Projekte aus derselben Themenauswahl landen automatisch
    // im selben Ordner (eine Prüfung kann mehrere Themen abdecken).
    let folderId: string | null = null
    if (readSources.length > 0) {
      const topicKey = [...sources].sort().join('|')
      const titles = readSources.map((s) => s.topic.title)
      const folderName = (titles.length <= 2 ? titles.join(' & ') : `${titles.slice(0, 2).join(', ')} & +${titles.length - 2} weitere`).slice(0, 80)
      const d = db()
      d.prepare(`
        INSERT INTO project_folders (id, user_id, subject, name, topic_key) VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(user_id, subject, topic_key) DO NOTHING
      `).run(newId('f'), user.id, subject, folderName, topicKey)
      const folder = d.prepare('SELECT id FROM project_folders WHERE user_id = ? AND subject = ? AND topic_key = ?')
        .get(user.id, subject, topicKey) as { id: string } | undefined
      folderId = folder?.id ?? null
    }

    db().prepare('INSERT INTO projects (id, user_id, subject, type, name, content, folder_id) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(id, user.id, subject, tool, name, stored, folderId)

    // Lernkarten wandern zusätzlich als SRS-Karten in die Fälligkeits-Queue.
    if (tool === 'lernkarten') {
      const insert = db().prepare('INSERT INTO cards (project_id, user_id, front, back) VALUES (?, ?, ?, ?)')
      for (const c of JSON.parse(stored) as { front: string; back: string }[]) insert.run(id, user.id, c.front, c.back)
    }

    bumpUsage(user.id, `studio:${tool}`)
    touchStreak(user.id)
    return NextResponse.json({ id, name, type: tool, subject, content: stored })
  } catch {
    return NextResponse.json({ error: 'Die Generierung hat nicht geklappt — probier es nochmal.' }, { status: 502 })
  }
}
