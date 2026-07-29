'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'

export function Modal({
  title, onClose, children, wide = false, footer,
}: {
  title?: string
  onClose: () => void
  children: React.ReactNode
  wide?: boolean
  footer?: React.ReactNode
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="glass-strong anim-panel"
        style={{ width: '100%', maxWidth: wide ? 860 : 440, maxHeight: '90dvh', borderRadius: 24, boxShadow: 'var(--shadow-float)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
      >
        {title && (
          <div className="hairline-b" style={{ padding: '16px 22px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
            <h2 className="t-title" style={{ flex: 1 }}>{title}</h2>
            <button className="iconbtn" onClick={onClose} aria-label="Schliessen"><X size={17} /></button>
          </div>
        )}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 22px' }}>{children}</div>
        {footer && <div className="hairline-t" style={{ padding: '14px 22px', flexShrink: 0 }}>{footer}</div>}
      </div>
    </div>
  )
}
