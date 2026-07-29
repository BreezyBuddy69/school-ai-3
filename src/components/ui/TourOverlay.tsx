'use client'

import { useEffect, useState } from 'react'

// Fokus-Tour für neue Nutzer: dimmt + verwischt die ganze Seite bis auf ein
// Loch über dem Zielelement. Statt einer SVG-Maske auf einem einzigen
// geblurten Layer (backdrop-filter + mask-image bricht kompositionsbedingt in
// mehreren Chromium-Versionen — der Blur "blutet" dann sichtbar in die
// maskierte Aussparung hinein) zerlegen wir den Dimm-/Blur-Layer in bis zu
// vier Bänder, die das Loch exakt umschliessen. So liegt dort nie irgendein
// geblurtes Element — die Aussparung bleibt garantiert gestochen scharf.
// Ziele werden per [data-tour="..."] gesucht; fehlt eins (z.B. Sidebar auf
// Mobile ausgeblendet) oder hat Grösse 0, wird der Schritt automatisch übersprungen.

export interface TourStep {
  target: string | null
  title: string
  text: string
  /** Erzwingt Platzierung der Karte seitlich statt über/unter dem Ziel — für
   *  schmale, hohe Ziele wie die Sidebar (eine Höhen-Heuristik allein würde
   *  auch breite, zufällig hohe Ziele wie das Fächer-Grid fälschlich treffen). */
  side?: boolean
}

interface Rect { top: number; left: number; width: number; height: number }
interface Band { top: number; left: number; width: number; height: number }

const CARD_W = 300
const DIM_BG = 'rgba(20, 16, 12, 0.42)'

export function TourOverlay({ steps, onDone }: { steps: TourStep[]; onDone: () => void }) {
  const [i, setI] = useState(0)
  const [rect, setRect] = useState<Rect | null>(null)
  const [viewport, setViewport] = useState({ w: 0, h: 0 })
  const step = steps[i]

  useEffect(() => {
    function measure() {
      setViewport({ w: window.innerWidth, h: window.innerHeight })
      if (!step.target) { setRect(null); return }
      const el = document.querySelector(`[data-tour="${step.target}"]`)
      const r = el?.getBoundingClientRect()
      if (!r || r.width === 0 || r.height === 0) {
        setRect(null)
        if (i < steps.length - 1) setI(i + 1)
        else onDone()
        return
      }
      setRect({ top: r.top, left: r.left, width: r.width, height: r.height })
    }
    measure()
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', measure, true)
    return () => { window.removeEventListener('resize', measure); window.removeEventListener('scroll', measure, true) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, step.target])

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onDone() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onDone])

  function next() { if (i < steps.length - 1) setI(i + 1); else onDone() }

  const pad = 10
  const hole = rect ? { x: rect.left - pad, y: rect.top - pad, w: rect.width + pad * 2, h: rect.height + pad * 2 } : null
  const radius = hole ? Math.min(20, hole.h / 2, hole.w / 2) : 0
  const vw = viewport.w || 1920
  const vh = viewport.h || 1080

  // Vier Bänder rund um das Loch statt einer maskierten Vollfläche — jedes
  // Band ist ein eigenständiges, rechteckiges Element, das nirgends über die
  // Aussparung hinausragt.
  const bands: Band[] = hole
    ? [
        { top: 0, left: 0, width: vw, height: Math.max(0, hole.y) },
        { top: hole.y + hole.h, left: 0, width: vw, height: Math.max(0, vh - (hole.y + hole.h)) },
        { top: Math.max(0, hole.y), left: 0, width: Math.max(0, hole.x), height: hole.h },
        { top: Math.max(0, hole.y), left: hole.x + hole.w, width: Math.max(0, vw - (hole.x + hole.w)), height: hole.h },
      ].filter((b) => b.width > 0 && b.height > 0)
    : [{ top: 0, left: 0, width: vw, height: vh }]

  let cardTop = vh / 2, cardLeft = vw / 2, cardTransform = 'translate(-50%, -50%)'
  let arrow: { dir: 'up' | 'down' | 'left' | 'right'; x: number; y: number } | null = null

  if (hole) {
    if (step.side) {
      // Erzwungene Seiten-Platzierung (z.B. Sidebar oder Studio-Panel) — Karte
      // daneben, auf der Seite mit mehr Platz (links vom Ziel, falls rechts
      // davon kein Raum mehr ist — z.B. bei einem Ziel am rechten Bildschirmrand).
      const roomRight = vw - (hole.x + hole.w)
      const placeRight = roomRight > CARD_W + 90
      cardTop = Math.min(Math.max(hole.y + hole.h / 2, 140), vh - 140)
      cardTransform = 'translateY(-50%)'
      if (placeRight) {
        cardLeft = hole.x + hole.w + 74
        arrow = { dir: 'left', x: hole.x + hole.w, y: cardTop }
      } else {
        cardLeft = Math.max(hole.x - 74, CARD_W + 16)
        cardTransform = 'translate(-100%, -50%)'
        arrow = { dir: 'right', x: hole.x, y: cardTop }
      }
    } else {
      const roomBelow = vh - (hole.y + hole.h) - 90
      const below = roomBelow > 190
      cardTop = below ? hole.y + hole.h + 90 : hole.y - 90
      cardTransform = below ? 'translateX(-50%)' : 'translate(-50%, -100%)'
      cardLeft = Math.min(Math.max(hole.x + hole.w / 2, CARD_W / 2 + 16), vw - CARD_W / 2 - 16)
      arrow = { dir: below ? 'up' : 'down', x: hole.x + hole.w / 2, y: below ? hole.y + hole.h : hole.y }
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200 }} role="dialog" aria-modal="true">
      {bands.map((b, k) => (
        <div
          key={k}
          onClick={onDone}
          style={{
            position: 'fixed', top: b.top, left: b.left, width: b.width, height: b.height,
            background: DIM_BG,
            backdropFilter: 'blur(5px)', WebkitBackdropFilter: 'blur(5px)',
          }}
        />
      ))}

      {hole && (
        <div aria-hidden className="tour-ring" style={{ position: 'fixed', top: hole.y, left: hole.x, width: hole.w, height: hole.h, borderRadius: radius }} />
      )}

      {arrow && <TourArrow dir={arrow.dir} x={arrow.x} y={arrow.y} />}

      <div
        key={i}
        className="card glass-strong anim-panel"
        style={{
          position: 'fixed', top: cardTop, left: cardLeft, transform: cardTransform,
          width: CARD_W, maxWidth: 'calc(100vw - 32px)', padding: '20px 22px',
          display: 'flex', flexDirection: 'column', gap: 12,
          boxShadow: 'var(--shadow-float)', zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', gap: 5 }}>
          {steps.map((_, k) => (
            <div key={k} style={{
              width: k === i ? 18 : 6, height: 6, borderRadius: 99,
              background: k <= i ? 'var(--accent)' : 'var(--hairline)',
              transition: 'all 250ms var(--spring)',
            }} />
          ))}
        </div>
        <div>
          <h3 className="t-title" style={{ fontSize: 16 }}>{step.title}</h3>
          <p className="t-caption" style={{ marginTop: 6, lineHeight: 1.55, fontSize: 13 }}>{step.text}</p>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="btn btn-ghost btn-sm" onClick={onDone}>Überspringen</button>
          <button className="btn btn-primary btn-sm" onClick={next}>{i === steps.length - 1 ? 'Los geht’s' : 'Weiter'}</button>
        </div>
      </div>
    </div>
  )
}

function TourArrow({ dir, x, y }: { dir: 'up' | 'down' | 'left' | 'right'; x: number; y: number }) {
  const W = 44, H = 60
  let left = x - W / 2, top = y - H / 2, orient: string | undefined
  let bounceAxis: 'X' | 'Y' = 'Y'
  if (dir === 'up') { top = y + 8; orient = undefined }
  else if (dir === 'down') { top = y - 8 - H; orient = 'scaleY(-1)' }
  else if (dir === 'right') { left = x - 8 - W; top = y - H / 2; orient = 'rotate(90deg)'; bounceAxis = 'X' }
  else { left = x + 8; top = y - H / 2; orient = 'rotate(-90deg)'; bounceAxis = 'X' }

  return (
    <div
      aria-hidden
      style={{ position: 'fixed', left, top, width: W, height: H, zIndex: 2, pointerEvents: 'none', animation: `tour-bounce-${bounceAxis} 1.3s ease-in-out infinite` }}
    >
      <svg width={W} height={H} viewBox="0 0 44 60" style={{ transform: orient }}>
        <path d="M14 54 C 10 34, 26 30, 30 8" fill="none" stroke="var(--accent)" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M22 14 L 30 8 L 34 18" fill="none" stroke="var(--accent)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}
