'use client'

import { useCallback, useRef, useState } from 'react'
import { api } from '@/lib/utils'
import type { ToolId } from '@/components/studio/StudioPanel'

// Client-Seite des SSE-Protokolls aus /api/chat. Baut das Transkript aus
// ehrlichen Events: Tool-Bubbles, „Gedacht für Ns", gestreamter Text.

export type TranscriptItem =
  | { kind: 'user'; text: string }
  | { kind: 'assistant'; text: string; streaming?: boolean }
  | { kind: 'tool'; id: string; icon: string; title: string; detail?: string; status: 'running' | 'ok' | 'err'; out?: string; input?: string }
  | { kind: 'thought'; seconds: number }
  | { kind: 'thinking'; slow?: 0 | 1 | 2 }
  | { kind: 'notice'; text: string }
  | { kind: 'error'; text: string }
  | { kind: 'gate'; reason: string; upgrade: string }
  | { kind: 'action'; tool: ToolId; topic: string; auto: boolean; original: string }
  | { kind: 'plan'; id: string; steps: { id: string; label: string; status: 'active' | 'done' | 'err' }[] }

export interface SendOptions {
  chatId?: string | null
  subject: string
  sources: string[]
  voice?: boolean
  skipAction?: boolean
  /** Nachricht nicht erneut als User-Bubble anzeigen (z.B. Resend nach Aktionskarte). */
  silent?: boolean
}

export function useChatStream(onDone?: (answer: string, audioBase64?: string) => void) {
  const [items, setItems] = useState<TranscriptItem[]>([])
  const [busy, setBusy] = useState(false)
  const [chatId, setChatId] = useState<string | null>(null)
  const [title, setTitle] = useState<string | null>(null)
  const slowTimers = useRef<ReturnType<typeof setTimeout>[]>([])

  const reset = useCallback((initial: TranscriptItem[] = []) => {
    setItems(initial)
    setChatId(null)
    setTitle(null)
  }, [])

  const send = useCallback(async (message: string, opts: SendOptions) => {
    if (busy || !message.trim()) return
    setBusy(true)
    if (opts.chatId) setChatId(opts.chatId)
    setItems((prev) => opts.silent
      ? [...prev, { kind: 'thinking', slow: 0 }]
      : [...prev, { kind: 'user', text: message }, { kind: 'thinking', slow: 0 }])

    // Gooey-Loader eskaliert farblich, wenn es ungewöhnlich lang dauert.
    slowTimers.current = [
      setTimeout(() => setItems((p) => p.map((it) => it.kind === 'thinking' ? { ...it, slow: 1 } : it)), 8000),
      setTimeout(() => setItems((p) => p.map((it) => it.kind === 'thinking' ? { ...it, slow: 2 } : it)), 20000),
    ]

    let answer = ''
    let audioB64: string | undefined
    try {
      const res = await fetch(api('/api/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId: opts.chatId ?? undefined, subject: opts.subject, message, sources: opts.sources, voice: opts.voice, skipAction: opts.skipAction }),
      })
      if (!res.body) throw new Error('Kein Stream')
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const events = buffer.split('\n\n')
        buffer = events.pop() ?? ''
        for (const raw of events) {
          const line = raw.trim()
          if (!line.startsWith('data:')) continue
          const ev = JSON.parse(line.slice(5))
          setItems((prev) => {
            const next = [...prev]
            const dropThinking = () => {
              const i = next.findIndex((it) => it.kind === 'thinking')
              if (i !== -1) next.splice(i, 1)
            }
            switch (ev.type) {
              case 'chat': setChatId(ev.chatId); break
              case 'title': setTitle(ev.title); break
              case 'tool': {
                const i = next.findIndex((it) => it.kind === 'tool' && it.id === ev.id)
                if (i !== -1) {
                  next[i] = { ...(next[i] as Extract<TranscriptItem, { kind: 'tool' }>), ...ev, kind: 'tool' }
                } else {
                  // Tool-Bubble erscheint VOR dem Denk-Loader
                  const t = next.findIndex((it) => it.kind === 'thinking')
                  const bubble = { kind: 'tool' as const, id: ev.id, icon: ev.icon ?? '⚙️', title: ev.title ?? '', detail: ev.detail, status: ev.status ?? 'running', out: ev.out, input: ev.input }
                  if (t !== -1) next.splice(t, 0, bubble); else next.push(bubble)
                }
                break
              }
              case 'thought': {
                const t = next.findIndex((it) => it.kind === 'thinking')
                const marker = { kind: 'thought' as const, seconds: ev.seconds }
                if (t !== -1) next.splice(t, 0, marker); else next.push(marker)
                break
              }
              case 'delta': {
                answer += ev.text
                dropThinking()
                const last = next[next.length - 1]
                if (last?.kind === 'assistant' && last.streaming) {
                  next[next.length - 1] = { ...last, text: last.text + ev.text }
                } else {
                  next.push({ kind: 'assistant', text: ev.text, streaming: true })
                }
                break
              }
              case 'audio': audioB64 = ev.data; break
              case 'action': dropThinking(); next.push({ kind: 'action', tool: ev.tool, topic: ev.topic ?? '', auto: !!ev.auto, original: ev.original ?? '' }); break
              case 'gate': dropThinking(); next.push({ kind: 'gate', reason: ev.reason, upgrade: ev.upgrade }); break
              case 'error': dropThinking(); next.push({ kind: 'error', text: ev.message }); break
              case 'done': {
                dropThinking()
                const last = next[next.length - 1]
                if (last?.kind === 'assistant') next[next.length - 1] = { ...last, streaming: false }
                if (ev.chatId) setChatId(ev.chatId)
                break
              }
            }
            return next
          })
        }
      }
      onDone?.(answer, audioB64)
    } catch {
      setItems((prev) => [...prev.filter((it) => it.kind !== 'thinking'), { kind: 'error', text: 'Verbindung unterbrochen — probier es nochmal.' }])
    } finally {
      slowTimers.current.forEach(clearTimeout)
      setBusy(false)
    }
  }, [busy, onDone])

  return { items, setItems, busy, send, chatId, setChatId, title, setTitle, reset }
}
