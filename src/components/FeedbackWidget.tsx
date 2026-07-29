'use client'

import { useState } from 'react'
import { MessageSquareHeart } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { api } from '@/lib/utils'

// Einziger Feedback-Einstiegspunkt der App — die Landing verspricht „sag es
// mir über das Feedback-Feld in der App" (siehe page.tsx), das Backend
// (/api/feedback) und das Admin-Cockpit existierten schon, nur die UI fehlte.
// Zwei Stellen binden dasselbe Widget ein: Footer (auch für anonyme
// Besucher:innen) und Einstellungen (für eingeloggte Nutzer:innen).

export function FeedbackWidget({ variant = 'link' }: { variant?: 'link' | 'row' }) {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [state, setState] = useState<'idle' | 'busy' | 'sent' | 'error'>('idle')

  async function send() {
    if (!text.trim()) return
    setState('busy')
    try {
      const res = await fetch(api('/api/feedback'), {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim() }),
      })
      if (!res.ok) { setState('error'); return }
      setState('sent')
      setText('')
      setTimeout(() => { setOpen(false); setState('idle') }, 1400)
    } catch {
      setState('error')
    }
  }

  return (
    <>
      {variant === 'link' ? (
        <button
          onClick={() => setOpen(true)}
          style={{ border: 'none', background: 'transparent', cursor: 'pointer', font: 'inherit', color: 'inherit' }}
          className="t-caption"
        >
          Feedback geben
        </button>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="btn btn-sm"
          style={{ width: '100%', justifyContent: 'flex-start', background: 'var(--parchment)', color: 'var(--ink)' }}
        >
          <MessageSquareHeart size={14} /> Feedback geben
        </button>
      )}

      {open && (
        <Modal title="Feedback" onClose={() => setOpen(false)}
          footer={
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={send} disabled={state === 'busy' || state === 'sent' || !text.trim()}>
              {state === 'sent' ? 'Danke! 🙏' : state === 'busy' ? 'Wird gesendet…' : 'Senden'}
            </button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p className="t-caption">
              Fehler gefunden, Thema fehlt, Idee für ein neues Feature? Geht direkt an Jayden — auch anonym möglich.
            </p>
            <textarea
              className="field" rows={4} autoFocus value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="z.B. Im Quiz zu Trigonometrie fehlt Frage 3…"
            />
            {state === 'error' && <p style={{ color: 'var(--err)', fontSize: 13 }}>Ging leider nicht — probier's gleich nochmal.</p>}
          </div>
        </Modal>
      )}
    </>
  )
}
