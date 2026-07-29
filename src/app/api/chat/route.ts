import { NextRequest } from 'next/server'
import { currentUser } from '@/lib/auth'
import { db, newId, bumpUsage, touchStreak, hashIp } from '@/lib/db'
import { gateMessage } from '@/lib/tiers'
import { readTopic } from '@/lib/subjects'
import { callN8n, isDemoMode } from '@/lib/n8n'
import { studentContext } from '@/lib/curriculum'
import { allow } from '@/lib/rate-limit'
import { detectStudioIntent } from '@/lib/summary'
import { synthesizeSpeech, ttsAvailable } from '@/lib/tts'

// Das Herz der App: EIN Endpunkt, der ehrlich streamt, was passiert.
// SSE-Events: tool (Werkzeug-Bubble), thought (Gedacht für Ns), delta
// (Antwort-Text), gate (Limit erreicht), done, error.
// Jede Tool-Bubble entspricht echter Serverarbeit — kein Agentic-Theater.

interface ChatBody {
  chatId?: string
  subject?: string
  message?: string
  sources?: string[]
  voice?: boolean
  skipAction?: boolean
}

// Anonyme Nachrichten sind kürzer gekappt als eingeloggte (8000) — begrenzt
// Tokenkosten pro Abuse-Request, ohne echte Schulfragen einzuschränken.
const ANON_MESSAGE_MAX_LEN = 500
// Globaler Tages-Deckel über ALLE anonymen Trial-Calls hinweg (nicht nur pro
// IP) — verhindert, dass verteilte Anfragen (IP-Rotation) das Pro-Modell im
// Trial unbegrenzt Tokenkosten verursachen lassen. Bei Erreichen fällt der
// Trial weich auf das Free-Modell zurück statt die Seite zu blockieren.
const ANON_TRIAL_DAILY_CAP = 300

function sse(obj: Record<string, unknown>): string {
  return `data: ${JSON.stringify(obj)}\n\n`
}

export async function POST(req: NextRequest) {
  const encoder = new TextEncoder()
  const user = await currentUser()
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local'
  const body = (await req.json().catch(() => ({}))) as ChatBody
  const message = (body.message ?? '').trim().slice(0, user ? 8000 : ANON_MESSAGE_MAX_LEN)
  const subject = (body.subject ?? '').slice(0, 80)

  const stream = new ReadableStream({
    async start(controller) {
      const emit = (obj: Record<string, unknown>) => controller.enqueue(encoder.encode(sse(obj)))
      try {
        if (!message) { emit({ type: 'error', message: 'Leere Nachricht.' }); return }

        // ── Gates: serverseitig, ohne Ausnahme ──────────────────────────────
        let tier: 'free' | 'pro' | 'premium' = 'free'
        if (user) {
          tier = user.tier
          const gate = gateMessage(tier, user.id)
          if (!gate.ok) { emit({ type: 'gate', reason: gate.reason, upgrade: gate.upgrade }); return }
        } else {
          // 3 anonyme Nachrichten pro Tag und IP: Wert zeigen vor der Signup-Wand.
          if (!allow(`anonchat:${hashIp(ip)}`, 3, 24 * 3600_000)) {
            emit({ type: 'gate', reason: 'Du hast 3 Gratis-Fragen ausprobiert — erstell dir ein kostenloses Konto und mach weiter.', upgrade: 'signup' })
            return
          }
          // Zeig das gute (Pro-)Modell im Trial, damit der erste Eindruck zählt —
          // sobald man sich registriert, landet man wie gewohnt auf Free. Ein
          // globaler Tages-Deckel (nicht nur pro IP) hält die Kosten im Rahmen;
          // ist er erreicht, fällt der Trial weich auf Free zurück statt zu blocken.
          tier = allow('anon-trial-global', ANON_TRIAL_DAILY_CAP, 24 * 3600_000) ? 'pro' : 'free'
        }
        if (!allow(`chat:${user?.id ?? hashIp(ip)}`, 20, 60_000)) {
          emit({ type: 'error', message: 'Kurz durchatmen — zu viele Anfragen auf einmal.' }); return
        }

        // ── Agentische Aktion: Studio-Werkzeug-Wunsch erkannt? ──────────────
        // Statt zu antworten, schickt der Server eine Aktionskarte. Der Client
        // fragt nach (oder führt bei Pro/Premium mit auto_actions direkt aus)
        // und ruft dann /api/studio/<tool> — dort greifen die Studio-Gates
        // wie immer. skipAction=true (Nutzer hat „nur antworten" gewählt)
        // und der Sprachmodus überspringen die Erkennung.
        if (user && !body.voice && !body.skipAction) {
          const intent = detectStudioIntent(message)
          if (intent) {
            const auto = tier !== 'free' && !!user.auto_actions
            emit({ type: 'action', tool: intent.tool, topic: intent.topic, auto, original: message })
            emit({ type: 'done', chatId: body.chatId ?? null })
            return
          }
        }

        // ── Chat laden/anlegen (nur für angemeldete Nutzer persistent) ─────
        let chatId = body.chatId ?? null
        let sources = body.sources ?? []
        let history: { role: string; content: string }[] = []
        if (user) {
          if (chatId) {
            const chat = db().prepare('SELECT id, subject, sources_json FROM chats WHERE id = ? AND user_id = ? AND deleted_at IS NULL')
              .get(chatId, user.id) as { id: string; subject: string; sources_json: string } | undefined
            if (!chat) { emit({ type: 'error', message: 'Chat nicht gefunden.' }); return }
            sources = body.sources ?? JSON.parse(chat.sources_json)
            history = (db().prepare('SELECT role, content FROM messages WHERE chat_id = ? ORDER BY id DESC LIMIT 10')
              .all(chatId) as { role: string; content: string }[]).reverse()
          } else {
            chatId = newId('c')
            db().prepare('INSERT INTO chats (id, user_id, subject, sources_json) VALUES (?, ?, ?, ?)')
              .run(chatId, user.id, subject, JSON.stringify(sources))
            emit({ type: 'chat', chatId })
          }
          db().prepare('INSERT INTO messages (chat_id, role, content) VALUES (?, ?, ?)').run(chatId, 'user', message)
        }

        // ── Quellen lesen: echte Dateizugriffe, ehrlich gezeigt ─────────────
        const sourceContents: { topic: string; content: string }[] = []
        for (const slug of sources.slice(0, 12)) {
          const toolId = newId('t')
          const label = slug.split('/').pop()?.replace(/-/g, ' ') ?? slug
          emit({ type: 'tool', id: toolId, icon: '📖', title: 'Liest Thema', detail: `„${label}"`, status: 'running' })
          const topic = readTopic(slug)
          if (topic) {
            sourceContents.push({ topic: slug, content: topic.content })
            emit({ type: 'tool', id: toolId, status: 'ok', out: `${topic.bytes.toLocaleString('de-CH')} Bytes gelesen` })
          } else {
            emit({ type: 'tool', id: toolId, status: 'err', out: 'Thema nicht gefunden' })
          }
        }

        // ── n8n-Aufruf (Modellwahl passiert in n8n, nach Tier) ─────────────
        const profilePayload = user ? {
          name: user.name, class: user.klasse, jahr: user.jahr,
          profile: user.profil, school: user.school, personal: user.personal,
          context: studentContext(user.jahr, user.profil, user.klasse),
        } : { context: 'Anonyme:r Besucher:in — freundlich zum Registrieren einladen, wenn es passt.' }

        const t0 = Date.now()
        const answer = await callN8n('chat', tier, {
          message,
          history: [...history, { role: 'user', content: message }].slice(-10),
          profile: profilePayload,
          selectedSources: sourceContents,
          subject,
          voice: !!body.voice,
        })
        const thinkSeconds = Math.round((Date.now() - t0) / 1000)
        if (thinkSeconds >= 2) emit({ type: 'thought', seconds: thinkSeconds })

        // ── Antwort streamen (progressive Anzeige) ──────────────────────────
        const CHUNK = 24
        for (let i = 0; i < answer.length; i += CHUNK) {
          emit({ type: 'delta', text: answer.slice(i, i + CHUNK) })
          if (i + CHUNK < answer.length) await new Promise((r) => setTimeout(r, 12))
        }

        // ── Persistieren + Buchhaltung ──────────────────────────────────────
        if (user && chatId) {
          const meta = JSON.stringify({ thinkSeconds, sources: sources.length, demo: isDemoMode() })
          db().prepare('INSERT INTO messages (chat_id, role, content, meta_json) VALUES (?, ?, ?, ?)')
            .run(chatId, 'assistant', answer, meta)
          const title = db().prepare('SELECT title FROM chats WHERE id = ?').get(chatId) as { title: string | null }
          if (!title.title) {
            const auto = message.length > 44 ? `${message.slice(0, 44)}…` : message
            db().prepare('UPDATE chats SET title = ? WHERE id = ?').run(auto, chatId)
            emit({ type: 'title', title: auto })
          }
          db().prepare("UPDATE chats SET last_message_at = datetime('now') WHERE id = ?").run(chatId)
          bumpUsage(user.id, 'messages')
          touchStreak(user.id)
        }

        // ── Echte KI-Stimme (Pro/Premium) statt Browser-TTS ─────────────────
        // Derselbe `tier`, der oben schon die Anon-Trial/Free-Entscheidung
        // trifft, steuert auch das hier — keine neue Kostenfläche, dasselbe
        // Tages-Budget deckelt beides. Ohne GOOGLE_TTS_API_KEY (oder auf
        // Free) fällt der Client automatisch auf speechSynthesis zurück.
        if (body.voice && (tier === 'pro' || tier === 'premium') && ttsAvailable()) {
          const audio = await synthesizeSpeech(answer)
          if (audio) emit({ type: 'audio', data: audio })
        }

        emit({ type: 'done', chatId })
      } catch (e) {
        try {
          emit({ type: 'error', message: e instanceof Error && e.message.includes('n8n') ? 'Die KI ist gerade nicht erreichbar — probier es gleich nochmal.' : 'Etwas ist schiefgelaufen.' })
        } catch { /* Stream bereits zu (Client weg) */ }
      } finally {
        try { controller.close() } catch { /* bereits geschlossen */ }
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  })
}
