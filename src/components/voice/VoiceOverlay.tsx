'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Check, X } from 'lucide-react'
import { api } from '@/lib/utils'

// Diktier-Pille (Wispr-Flow-Stil, Referenz: ChatGPT-Diktiermodus): Klick auf
// den Mic-Button im Composer startet, Balken zeigen echten Mic-Pegel, ✓
// stoppt + schickt den Rohtext durch einen kurzen KI-Cleanup-Pass
// (/api/voice/cleanup — Nemotron free / DeepSeek V4 Flash pro), das Ergebnis
// landet im Composer-Textfeld. X verwirft die Aufnahme. Kein Auto-Senden,
// keine gesprochene Antwort mehr über den Mic-Button (D... Rückfrage-Antwort
// des Nutzers: reines Diktieren).

type Phase = 'listening' | 'processing' | 'error'

export function voiceSupported(): boolean {
  return typeof window !== 'undefined' &&
    !!((window as unknown as Record<string, unknown>).SpeechRecognition || (window as unknown as Record<string, unknown>).webkitSpeechRecognition)
}

const ERROR_LABEL: Record<string, string> = {
  'not-allowed': 'Mikrofon-Zugriff verweigert — erlaub ihn im Browser.',
  'service-not-allowed': 'Mikrofon-Zugriff verweigert — erlaub ihn im Browser.',
  network: 'Keine Verbindung zur Spracherkennung.',
  'audio-capture': 'Kein Mikrofon gefunden.',
}

/** Diktier-Pille: läuft neben/im Composer, ersetzt das alte Vollbild- bzw. Konversations-Voice. */
export function DictationPill({ onResult, onCancel }: {
  onResult: (text: string) => void
  onCancel: () => void
}) {
  const [phase, setPhase] = useState<Phase>('listening')
  const [error, setError] = useState<string | null>(null)
  const barsRef = useRef<(HTMLSpanElement | null)[]>([])
  const recRef = useRef<SpeechRecognitionLike | null>(null)
  const stoppingRef = useRef(false)
  const transcriptRef = useRef('')
  const phaseRef = useRef<Phase>('listening')
  phaseRef.current = phase

  // ── Mic-Pegel (Web Audio Analyser) treibt die Balkenhöhe ──────────────────
  useEffect(() => {
    let ctx: AudioContext | null = null
    let raf = 0
    let stream: MediaStream | null = null
    navigator.mediaDevices?.getUserMedia({ audio: true }).then((s) => {
      stream = s
      ctx = new AudioContext()
      const src = ctx.createMediaStreamSource(s)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 256
      src.connect(analyser)
      const buf = new Uint8Array(analyser.frequencyBinCount)
      const tick = () => {
        analyser.getByteTimeDomainData(buf)
        let sum = 0
        for (const v of buf) { const d = (v - 128) / 128; sum += d * d }
        const level = Math.sqrt(sum / buf.length)
        if (phaseRef.current === 'listening') {
          const scale = 0.35 + Math.min(level * 4.5, 1) * 0.65
          for (const bar of barsRef.current) if (bar) bar.style.transform = `scaleY(${scale.toFixed(3)})`
        }
        raf = requestAnimationFrame(tick)
      }
      tick()
    }).catch(() => {
      setError('Mikrofon nicht verfügbar — erlaub den Zugriff im Browser.')
      setPhase('error')
    })
    return () => {
      cancelAnimationFrame(raf)
      stream?.getTracks().forEach((t) => t.stop())
      ctx?.close().catch(() => {})
    }
  }, [])

  // ── Spracherkennung: continuous + Auto-Neustart, bis der Nutzer stoppt ────
  // (Chrome/Edge beenden `continuous`-Sessions periodisch von selbst — ohne
  // Neustart bricht die Aufnahme nach kurzer Zeit unbemerkt ab.)
  useEffect(() => {
    const W = window as unknown as Record<string, new () => SpeechRecognitionLike>
    const Ctor = W.SpeechRecognition ?? W.webkitSpeechRecognition
    if (!Ctor) { setError('Sprachmodus wird von diesem Browser nicht unterstützt.'); setPhase('error'); return }

    function start() {
      const rec = new Ctor()
      rec.lang = 'de-CH'
      rec.continuous = true
      rec.interimResults = true
      rec.onresult = (e: SpeechRecognitionEventLike) => {
        let finalText = ''
        for (let i = 0; i < e.results.length; i++) {
          const r = e.results[i]
          if (r.isFinal) finalText += r[0].transcript
        }
        if (finalText.trim()) transcriptRef.current = finalText.trim()
      }
      rec.onerror = (e: { error?: string }) => {
        const code = e?.error ?? ''
        if (code === 'no-speech' || code === 'aborted') return // harmlos, einfach weiterhören
        setError(ERROR_LABEL[code] ?? 'Spracherkennung ist unterbrochen — nochmal versuchen.')
        setPhase('error')
        stoppingRef.current = true
      }
      rec.onend = () => {
        if (!stoppingRef.current) { try { rec.start() } catch { /* schon aktiv */ } }
      }
      recRef.current = rec
      try { rec.start() } catch { /* schon aktiv */ }
    }
    start()
    return () => { stoppingRef.current = true; recRef.current?.abort?.() }
  }, [])

  const stop = useCallback(() => {
    stoppingRef.current = true
    recRef.current?.abort?.()
  }, [])

  async function confirm() {
    stop()
    const raw = transcriptRef.current.trim()
    if (!raw) { onCancel(); return }
    setPhase('processing')
    try {
      const res = await fetch(api('/api/voice/cleanup'), {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: raw }),
      })
      const data = await res.json().catch(() => ({}))
      onResult(typeof data.text === 'string' && data.text.trim() ? data.text.trim() : raw)
    } catch {
      onResult(raw)
    }
  }

  function cancel() {
    stop()
    onCancel()
  }

  const label = phase === 'error' ? error : phase === 'processing' ? 'Wird bereinigt…' : 'Ich höre zu…'

  return (
    <div className="glass voice-pill anim-panel" data-phase={phase}>
      <div className="voice-pill-bars" aria-hidden>
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} ref={(el) => { barsRef.current[i] = el }} className="voice-pill-bar" style={{ animationDelay: `${i * 0.08}s` }} />
        ))}
      </div>
      <span className="voice-pill-label">{label}</span>
      <div className="voice-pill-actions">
        <button onClick={cancel} className="voice-pill-btn cancel" aria-label="Aufnahme verwerfen" title="Verwerfen">
          <X size={14} />
        </button>
        {phase !== 'error' && (
          <button onClick={confirm} disabled={phase === 'processing'} className="voice-pill-btn confirm" aria-label="Aufnahme übernehmen" title="Übernehmen">
            <Check size={14} />
          </button>
        )}
      </div>
    </div>
  )
}

// ── Echte KI-Stimme (Pro/Premium, base64-MP3 vom Server) — weiterhin genutzt
// vom "Vorlesen"-Button in Transcript.tsx (unabhängig vom Mic-Button). ──────
let currentAudio: HTMLAudioElement | null = null

export function playAudio(base64: string, onEnd: () => void, onError?: () => void) {
  stopAudio()
  const fail = () => { currentAudio = null; (onError ?? onEnd)() }
  try {
    const audio = new Audio(`data:audio/mp3;base64,${base64}`)
    currentAudio = audio
    audio.onended = () => { currentAudio = null; onEnd() }
    audio.onerror = fail
    audio.play().catch(fail)
  } catch {
    fail()
  }
}

export function stopAudio() {
  if (currentAudio) { currentAudio.pause(); currentAudio = null }
}

/** Antwort vorlesen (Markdown grob entschärft, damit keine Sternchen vorgelesen werden). */
export function speak(text: string, onEnd: () => void) {
  const synth = window.speechSynthesis
  if (!synth) { onEnd(); return }
  synth.cancel()
  const clean = text
    .replace(/```[\s\S]*?```/g, ' Codebeispiel. ')
    .replace(/\$\$?[^$]*\$\$?/g, ' Formel. ')
    .replace(/[#*_>`|]/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .slice(0, 2400)
  const u = new SpeechSynthesisUtterance(clean)
  u.lang = 'de-CH'
  const voice = synth.getVoices().find((v) => v.lang.startsWith('de'))
  if (voice) u.voice = voice
  u.onend = onEnd
  u.onerror = onEnd
  synth.speak(u)
}

// Minimale Typen für die Web Speech API (kein DOM-Lib-Eintrag in TS)
interface SpeechRecognitionLike {
  lang: string
  continuous: boolean
  interimResults: boolean
  onresult: ((e: SpeechRecognitionEventLike) => void) | null
  onerror: ((e: { error?: string }) => void) | null
  onend: (() => void) | null
  start: () => void
  abort?: () => void
}
interface SpeechRecognitionEventLike {
  results: ArrayLike<{ isFinal: boolean } & ArrayLike<{ transcript: string }>>
}
