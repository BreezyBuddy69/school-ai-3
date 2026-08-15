'use client'

import { useEffect, useRef, useState } from 'react'
import { Logo } from '@/components/ui/Logo'
import { Typewriter } from '@/components/ui/Typewriter'
import { api } from '@/lib/utils'

const THINK_WORDS = ['Denkt nach', 'Grübelt', 'Kombiniert Fakten', 'Prüft Quellen', 'Sortiert Gedanken', 'Formuliert Antwort']

// Stumme 5s-Ausschnitte aus der Mitte von Subway-Surfers-/GTA-Gameplay —
// seltenes Easter Egg statt Dauerzustand (siehe public/fun-loader/*.mp4).
const CLIPS = [
  'subway16-1.mp4', 'subway16-2.mp4', 'subway16-3.mp4', 'subway16-4.mp4', 'subway16-5.mp4', 'subway16-6.mp4',
  'subway9-1.mp4', 'subway9-2.mp4', 'subway9-3.mp4', 'subway9-4.mp4',
  'gta-1.mp4', 'gta-2.mp4', 'gta-3.mp4', 'gta-4.mp4', 'gta-5.mp4', 'gta-6.mp4', 'gta-7.mp4', 'gta-8.mp4',
]

// Wie lang der Cross-Fade beim Zurückwechseln auf Gooey dauert — muss zur
// CSS-Transition von .fun-box.fading passen (siehe globals.css).
const FADE_MS = 400

type Variant = 'gooey' | 'typewriter' | 'dvd' | 'clip'

// Gooey bleibt der Normalfall, der Claude-Code-Typewriter ist ein zweiter
// "normaler" Zustand — DVD-Bounce und Gameplay-Clip sind bewusst selten.
// Reduced-Motion überspringt beide Spielereien komplett.
function pickVariant(): Variant {
  if (typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches) return 'gooey'
  const r = Math.random()
  if (r < 0.75) return 'gooey'
  if (r < 0.90) return 'typewriter'
  if (r < 0.96) return 'clip'
  return 'dvd'
}

export function ThinkingLoader({ slow }: { slow?: 0 | 1 | 2 }) {
  const [variant] = useState(pickVariant)
  const [clip] = useState(() => CLIPS[Math.floor(Math.random() * CLIPS.length)])
  const [fading, setFading] = useState(false)
  const [fallback, setFallback] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  // Erst ausblenden, dann erst zurück auf Gooey wechseln — kein harter Schnitt.
  function fadeToFallback() {
    setFading(true)
    timer.current = setTimeout(() => setFallback(true), FADE_MS)
  }

  // DVD-Bounce hat kein natürliches Ende wie ein Video — nach 5s zurück zum
  // normalen Gooey, falls die Antwort noch länger braucht ("sollte s wieder
  // weg und normal ladeanimation").
  useEffect(() => {
    if (variant !== 'dvd') return
    const t = setTimeout(fadeToFallback, 5000)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant])

  useEffect(() => () => clearTimeout(timer.current), [])

  const active = fallback ? 'gooey' : variant

  if (active === 'typewriter') {
    return (
      <div className="thinking-loader claude-loader" role="status" aria-label="Denkt nach">
        <span className="cl-glyph"><Logo size={18} /></span>
        <Typewriter words={THINK_WORDS} className="cl-text" typeMs={45} deleteMs={24} holdMs={900} />
      </div>
    )
  }

  if (active === 'dvd') {
    return (
      <div className={`fun-box${fading ? ' fading' : ''}`} role="status" aria-label="Denkt nach">
        <div className="dvd-track-x">
          <div className="dvd-track-y"><Logo size={24} /></div>
        </div>
      </div>
    )
  }

  if (active === 'clip') {
    return (
      <div className={`fun-box${fading ? ' fading' : ''}`} role="status" aria-label="Denkt nach — Video lädt im Hintergrund weiter">
        <video
          className="fun-clip"
          src={api(`/fun-loader/${clip}`)}
          autoPlay muted playsInline
          onEnded={fadeToFallback}
          onError={fadeToFallback}
        />
        <span className="fun-loading-badge" aria-hidden="true">
          <span className="fun-loading-dot" /><span className="fun-loading-dot" /><span className="fun-loading-dot" />
        </span>
      </div>
    )
  }

  return (
    <div className={`thinking-loader ${slow === 1 ? 'slow' : slow === 2 ? 'slower' : ''}`} role="status" aria-label="Denkt nach">
      <div className="gooey" />
    </div>
  )
}
