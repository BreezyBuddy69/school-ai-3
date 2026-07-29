'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowUp, Mic } from 'lucide-react'
import { DictationPill, voiceSupported } from '@/components/voice/VoiceOverlay'

// Die Liquid-Glass-Pille (Sable2 #bar): Orb links, wachsende Textarea,
// Mic + Senden rechts. Buttons bleiben unten verankert, während die Textarea
// nach oben wächst. Mic startet eine Diktier-Pille (Wispr-Flow-Stil) direkt
// über dem Composer — das Ergebnis landet im Textfeld, kein Auto-Senden.

// Wächst bis max. ~3.5 Zeilen (lineHeight 1.4 * 16px + Padding), danach wie
// bei ChatGPT: Box bleibt fix, überschüssiger Text scrollt intern und der
// obere Rand verblasst statt hart abzuschneiden.
const MAX_TA_HEIGHT = 88

export function Composer({
  onSend, busy, placeholder,
}: {
  onSend: (text: string) => void
  busy: boolean
  placeholder?: string
}) {
  const [value, setValue] = useState('')
  const [overflowing, setOverflowing] = useState(false)
  const [dictating, setDictating] = useState(false)
  const [voiceOk, setVoiceOk] = useState(false)
  const taRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => { setVoiceOk(voiceSupported()) }, [])

  function submit() {
    const text = value.trim()
    if (!text || busy) return
    setValue('')
    if (taRef.current) taRef.current.style.height = 'auto'
    setOverflowing(false)
    onSend(text)
  }

  function autoGrow() {
    const ta = taRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = `${Math.min(ta.scrollHeight, MAX_TA_HEIGHT)}px`
    setOverflowing(ta.scrollHeight > MAX_TA_HEIGHT)
  }

  function insertDictated(text: string) {
    setDictating(false)
    if (!text.trim()) return
    setValue((prev) => (prev.trim() ? `${prev.trim()} ${text.trim()}` : text.trim()))
    requestAnimationFrame(() => {
      const ta = taRef.current
      if (!ta) return
      autoGrow()
      ta.focus()
      ta.selectionStart = ta.selectionEnd = ta.value.length
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {dictating && (
        <div style={{ alignSelf: 'center' }}>
          <DictationPill onResult={insertDictated} onCancel={() => setDictating(false)} />
        </div>
      )}
      <div
        className="glass"
        style={{
          display: 'flex', alignItems: 'flex-end', gap: 10,
          minHeight: 60, padding: '12px 12px 12px 16px', borderRadius: 30,
          boxShadow: 'var(--shadow-float)',
        }}
      >
        <div
          aria-hidden
          style={{
            width: 24, height: 24, borderRadius: '50%', flexShrink: 0, marginBottom: 6,
            background: 'conic-gradient(from 0deg, #c96442, #d4a27f, #d97757, #c96442)',
            animation: busy ? 'orb-spin 1.1s linear infinite' : 'orb-breathe 4s ease-in-out infinite',
          }}
        />
        <style>{`
          @keyframes orb-breathe { 0%,100% { transform: scale(1); opacity: .9; } 50% { transform: scale(1.08); opacity: 1; } }
          @keyframes orb-spin { to { transform: rotate(360deg); } }
          .composer-ta { scrollbar-width: none; }
          .composer-ta::-webkit-scrollbar { display: none; }
        `}</style>
        <textarea
          ref={taRef}
          className="composer-ta"
          rows={1}
          value={value}
          onChange={(e) => { setValue(e.target.value); autoGrow() }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() }
          }}
          placeholder={placeholder ?? 'Frag mich etwas…'}
          style={{
            flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent',
            font: 'inherit', fontSize: 16, lineHeight: 1.4, color: 'var(--ink)',
            caretColor: 'var(--accent)', resize: 'none', overflowY: 'auto', maxHeight: MAX_TA_HEIGHT,
            WebkitMaskImage: overflowing ? 'linear-gradient(to bottom, transparent, black 14px)' : 'none',
            maskImage: overflowing ? 'linear-gradient(to bottom, transparent, black 14px)' : 'none',
            padding: '4px 0 6px',
          }}
        />
        {voiceOk && (
          <button
            className="iconbtn"
            onClick={() => setDictating(true)}
            disabled={dictating}
            title="Diktieren"
            aria-label="Diktieren"
            style={{ marginBottom: 2, opacity: dictating ? 0.45 : 1 }}
          >
            <Mic size={17} />
          </button>
        )}
        <button
          onClick={submit}
          disabled={busy || !value.trim()}
          aria-label="Senden"
          style={{
            width: 36, height: 36, borderRadius: '50%', border: 'none', flexShrink: 0, marginBottom: 2,
            background: value.trim() && !busy ? 'var(--accent)' : 'var(--parchment)',
            color: value.trim() && !busy ? '#fff' : 'var(--ink-faint)',
            cursor: value.trim() && !busy ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 150ms ease, transform 150ms var(--spring)',
          }}
        >
          <ArrowUp size={18} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  )
}
