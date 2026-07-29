'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Volume2, Square } from 'lucide-react'
import { Markdown } from '@/components/Markdown'
import { speak } from '@/components/voice/VoiceOverlay'
import { TOOLS, type ToolId } from '@/components/studio/StudioPanel'
import type { TranscriptItem } from './useChatStream'

const TOOL_META = Object.fromEntries(TOOLS.map((t) => [t.id, t])) as Record<ToolId, (typeof TOOLS)[number]>

// Das Transkript ist die Signatur-Oberfläche: Tool-Bubbles mit Status-Punkt
// (klickbar, IN/OUT), „Gedacht für Ns", Gooey-Denk-Blase. Jede Bubble
// entspricht echter Serverarbeit — das Transkript IST der Vertrauensbeweis.

function ToolBubble({ item }: { item: Extract<TranscriptItem, { kind: 'tool' }> }) {
  const [open, setOpen] = useState(false)
  const hasBody = !!(item.out || item.input)
  return (
    <div className="tool-bubble">
      <button className="tb-head" onClick={() => hasBody && setOpen((o) => !o)} style={{ cursor: hasBody ? 'pointer' : 'default' }}>
        <span className={`status-dot ${item.status === 'running' ? 'running' : item.status === 'ok' ? 'ok' : 'err'}`} />
        <span style={{ fontSize: 14, flexShrink: 0 }}>{item.icon}</span>
        <span className="tb-title">{item.title}</span>
        <span className="tb-detail">{item.detail}</span>
      </button>
      {open && hasBody && (
        <div className="tb-body">
          {item.input && (<><div className="tb-label">IN</div><div className="tb-code">{item.input}</div></>)}
          {item.out && (<><div className="tb-label">OUT</div><div className="tb-code">{item.out}</div></>)}
        </div>
      )}
    </div>
  )
}

// Aktionskarte: Der Server hat einen Studio-Werkzeug-Wunsch erkannt (Lernkarten,
// Zusammenfassung, Quiz, Mindmap, Podcast) und fragt nach, statt einfach
// Chat-Text zu liefern. Bei auto=true (Pro/Premium mit eingeschaltetem
// Auto-Ausführen) startet die Aktion sofort.
function ActionCard({ item, onAccept, onDecline }: {
  item: Extract<TranscriptItem, { kind: 'action' }>
  onAccept?: (tool: ToolId, topic: string, auto: boolean, original: string) => void
  onDecline?: (original: string) => void
}) {
  const [state, setState] = useState<'idle' | 'accepted' | 'declined'>('idle')
  const fired = useRef(false)
  useEffect(() => {
    if (item.auto && !fired.current) {
      fired.current = true
      setState('accepted')
      onAccept?.(item.tool, item.topic, true, item.original)
    }
  }, [item, onAccept])

  const meta = TOOL_META[item.tool]
  const Icon = meta.Icon
  const toolLabel = meta.title
  const topicLabel = item.topic ? `«${item.topic}»` : 'dieses Thema'
  return (
    <div className="card anim-in" style={{ alignSelf: 'stretch', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10, borderColor: 'var(--accent)', borderWidth: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon size={16} style={{ color: 'var(--accent)' }} />
        <span style={{ fontSize: 14, fontWeight: 600 }}>{toolLabel} erkannt</span>
      </div>
      <span style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--ink-muted)' }}>
        {item.auto
          ? <>Auto-Ausführen ist an — ich erstelle {toolLabel.toLowerCase()} zu {topicLabel} direkt.</>
          : <>Soll ich im Studio {toolLabel.toLowerCase()} zu {topicLabel} erstellen?{item.tool === 'zusammenfassung' ? ' Dort kannst du Niveau, Länge und Stil wählen.' : ''}</>}
      </span>
      {!item.auto && state === 'idle' && (
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-primary btn-sm" onClick={() => { setState('accepted'); onAccept?.(item.tool, item.topic, false, item.original) }}>
            Ja, erstellen
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => { setState('declined'); onDecline?.(item.original) }}>
            Nein, nur antworten
          </button>
        </div>
      )}
      {state === 'accepted' && !item.auto && <span className="t-caption">Alles klar — wird erstellt.</span>}
      {state === 'declined' && <span className="t-caption">Ok — ich antworte normal im Chat.</span>}
    </div>
  )
}

// Plan-Blase (Claude-Code-Look, bisher ungenutzte .plan-bubble/.plan-step-CSS):
// zeigt agentische Fortschritts-Schritte statt eines stummen Modal-Spinners.
function PlanBubble({ item }: { item: Extract<TranscriptItem, { kind: 'plan' }> }) {
  return (
    <div className="plan-bubble anim-in">
      {item.steps.map((s) => (
        <div key={s.id} className={`plan-step${s.status === 'active' ? ' active' : s.status === 'done' ? ' done' : s.status === 'err' ? ' err' : ''}`}>
          <span className="plan-glyph">{s.status === 'done' ? '✓' : s.status === 'err' ? '✗' : '●'}</span>
          <span className="plan-text">{s.label}</span>
        </div>
      ))}
    </div>
  )
}

function GateCard({ reason, upgrade }: { reason: string; upgrade: string }) {
  const href = upgrade === 'signup' ? 'login' : 'pricing'
  const label = upgrade === 'signup' ? 'Kostenlos registrieren' : upgrade === 'premium' ? 'Premium entdecken' : 'Pro entdecken'
  return (
    <div className="card anim-in" style={{ alignSelf: 'stretch', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12, borderColor: 'var(--accent)', borderWidth: 1 }}>
      <span style={{ fontSize: 14, lineHeight: 1.5 }}>{reason}</span>
      <Link href={href} className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-start' }}>{label}</Link>
    </div>
  )
}

export function Transcript({ items, empty, onActionAccept, onActionDecline }: {
  items: TranscriptItem[]
  empty?: React.ReactNode
  onActionAccept?: (tool: ToolId, topic: string, auto: boolean, original: string) => void
  onActionDecline?: (original: string) => void
}) {
  const bottomRef = useRef<HTMLDivElement>(null)
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }) }, [items])

  // Vorlesen: eine Antwort gleichzeitig, Klick auf ■ (oder eine andere) stoppt.
  const [speakingIdx, setSpeakingIdx] = useState<number | null>(null)
  const [canSpeak, setCanSpeak] = useState(false)
  useEffect(() => {
    setCanSpeak(typeof window !== 'undefined' && !!window.speechSynthesis)
    return () => { window.speechSynthesis?.cancel() }
  }, [])
  function toggleSpeak(i: number, text: string) {
    if (speakingIdx === i) {
      window.speechSynthesis?.cancel()
      setSpeakingIdx(null)
      return
    }
    setSpeakingIdx(i)
    speak(text, () => setSpeakingIdx((cur) => (cur === i ? null : cur)))
  }

  if (items.length === 0 && empty) return <>{empty}</>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '20px 0 8px' }}>
      {items.map((item, i) => {
        switch (item.kind) {
          case 'user':
            return <div key={i} className="msg user">{item.text}</div>
          case 'assistant':
            return (
              <div key={i} className="msg assistant" style={{ position: 'relative' }}>
                <Markdown>{item.text}</Markdown>
                {!item.streaming && canSpeak && (
                  <button
                    onClick={() => toggleSpeak(i, item.text)}
                    className="btn btn-ghost btn-sm"
                    aria-label={speakingIdx === i ? 'Vorlesen stoppen' : 'Antwort vorlesen'}
                    style={{ marginTop: 6, padding: '4px 10px', fontSize: 12, color: speakingIdx === i ? 'var(--accent)' : 'var(--ink-muted)' }}
                  >
                    {speakingIdx === i ? <><Square size={12} /> Stopp</> : <><Volume2 size={13} /> Vorlesen</>}
                  </button>
                )}
              </div>
            )
          case 'tool':
            return <ToolBubble key={item.id} item={item} />
          case 'thought':
            return <div key={i} className="thought-marker">Gedacht für {item.seconds}s</div>
          case 'thinking':
            return (
              <div key={i} className={`thinking-loader ${item.slow === 1 ? 'slow' : item.slow === 2 ? 'slower' : ''}`} role="status" aria-label="Denkt nach">
                <div className="gooey" />
              </div>
            )
          case 'notice':
            return <div key={i} className="msg notice">{item.text}</div>
          case 'error':
            return <div key={i} className="msg error">{item.text}</div>
          case 'gate':
            return <GateCard key={i} reason={item.reason} upgrade={item.upgrade} />
          case 'action':
            return <ActionCard key={i} item={item} onAccept={onActionAccept} onDecline={onActionDecline} />
          case 'plan':
            return <PlanBubble key={item.id} item={item} />
        }
      })}
      <div ref={bottomRef} />
    </div>
  )
}
