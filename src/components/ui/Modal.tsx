'use client'

import { useEffect, useState } from 'react'
import { Maximize2, Minimize2, X } from 'lucide-react'

// Fokusmodus: derselbe Dialog, nur fast bildschirmfüllend und mit stärker
// abgedunkeltem Hintergrund — zum Lernen, wenn drumherum nichts ablenken soll.
// Die Wahl bleibt pro Gerät gespeichert (F oder der Knopf im Kopf schalten um).

const FOCUS_KEY = 'lgki-focus-mode'

export function Modal({
  title, onClose, children, wide = false, footer, focusable = false,
}: {
  title?: string
  onClose: () => void
  children: React.ReactNode
  wide?: boolean
  footer?: React.ReactNode
  /** Blendet den Fokus-Umschalter ein (Viewer ja, kleine Formulare nein). */
  focusable?: boolean
}) {
  const [focus, setFocus] = useState(false)

  useEffect(() => {
    if (focusable) setFocus(localStorage.getItem(FOCUS_KEY) === '1')
  }, [focusable])

  function toggleFocus() {
    setFocus((f) => {
      localStorage.setItem(FOCUS_KEY, f ? '0' : '1')
      return !f
    })
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      // „f" schaltet den Fokusmodus — aber nie, während jemand tippt.
      const el = e.target as HTMLElement | null
      const typing = el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)
      if (focusable && !typing && (e.key === 'f' || e.key === 'F')) { e.preventDefault(); toggleFocus() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, focusable])

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: focus ? 'rgba(0,0,0,0.72)' : 'rgba(0,0,0,0.4)',
        backdropFilter: `blur(${focus ? 22 : 14}px)`, WebkitBackdropFilter: `blur(${focus ? 22 : 14}px)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: focus ? 'clamp(10px, 2.5vh, 28px)' : 16,
        transition: 'background 220ms ease',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="glass-strong anim-panel"
        style={{
          width: '100%',
          maxWidth: focus ? 1180 : wide ? 860 : 440,
          height: focus ? '100%' : undefined,
          maxHeight: focus ? '100%' : '90dvh',
          borderRadius: focus ? 20 : 24,
          boxShadow: 'var(--shadow-float)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          transition: 'max-width 260ms var(--spring)',
        }}
      >
        {title && (
          <div className="hairline-b" style={{ padding: '16px 22px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
            <h2 className="t-title" style={{ flex: 1 }}>{title}</h2>
            {focusable && (
              <button
                className="iconbtn" onClick={toggleFocus}
                style={{ color: focus ? 'var(--accent)' : undefined }}
                title={focus ? 'Fokusmodus verlassen (F)' : 'Fokusmodus (F)'}
                aria-pressed={focus}
              >
                {focus ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
            )}
            <button className="iconbtn" onClick={onClose} aria-label="Schliessen"><X size={17} /></button>
          </div>
        )}
        <div style={{ flex: 1, overflowY: 'auto', padding: focus ? 'clamp(20px, 3vw, 40px)' : '20px 22px' }}>{children}</div>
        {footer && <div className="hairline-t" style={{ padding: '14px 22px', flexShrink: 0 }}>{footer}</div>}
      </div>
    </div>
  )
}
