'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { Wordmark } from '@/components/ui/Logo'
import { Markdown } from '@/components/Markdown'
import { api } from '@/lib/utils'

// Öffentliche Read-only-Ansicht eines geteilten Chats — mit dezentem
// „Das ist LG KI"-Banner. Jeder geteilte Chat ist Akquise.

interface SharedChat { subject: string; title: string | null; messages: { role: 'user' | 'assistant'; content: string }[] }

export default function SharePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [chat, setChat] = useState<SharedChat | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch(api(`/api/share/${id}`)).then(async (r) => {
      if (!r.ok) { setError(true); return }
      setChat(await r.json())
    }).catch(() => setError(true))
  }, [id])

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--parchment)' }}>
      <nav className="glass hairline-b" style={{ position: 'sticky', top: 0, zIndex: 10, padding: '11px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}><Wordmark size={24} /></Link>
        <span style={{ flex: 1 }} />
        <Link href="/login?register=1" className="btn btn-primary btn-sm">Selbst ausprobieren</Link>
      </nav>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '28px 18px 80px' }}>
        {error && <p className="t-caption" style={{ textAlign: 'center', padding: 40 }}>Dieser Link existiert nicht (mehr).</p>}
        {chat && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <span className="t-micro">{chat.subject} · geteilter Chat</span>
              {chat.title && <h1 className="t-title" style={{ fontSize: 20, marginTop: 4 }}>{chat.title}</h1>}
            </div>
            {chat.messages.map((m, i) => (
              m.role === 'user'
                ? <div key={i} className="msg user" style={{ alignSelf: 'flex-end', marginLeft: 'auto', maxWidth: '85%' }}>{m.content}</div>
                : <div key={i} className="card" style={{ padding: '16px 20px' }}><Markdown>{m.content}</Markdown></div>
            ))}
            <div className="card" style={{ padding: '18px 20px', textAlign: 'center', borderColor: 'var(--accent)', marginTop: 12 }}>
              <p style={{ fontSize: 14, marginBottom: 10 }}>Das war <strong>LG KI</strong> — der Lernassistent fürs LG Vaduz.</p>
              <Link href="/login?register=1" className="btn btn-primary btn-sm">Kostenlos starten</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
