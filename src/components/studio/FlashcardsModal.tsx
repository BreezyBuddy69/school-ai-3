'use client'

import { useEffect, useState } from 'react'
import { Download, Printer } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { api, downloadWordExport } from '@/lib/utils'
import { escapeHtml, printAsPdf } from '@/lib/print'

// Karten-Viewer (Deck durchblättern) + SRS-Review-Modus (Leitner-Queue).
// Tastatur: ←/→ blättern, Leertaste dreht, ESC schliesst.

interface Card { front: string; back: string }
export interface DueCard { id: number; front: string; back: string; box: number; subject: string; deck: string }

export function FlashcardsModal({ projectId, name, cards, tier, onClose }: {
  projectId: string; name: string; cards: Card[]; tier: 'free' | 'pro' | 'premium'; onClose: () => void
}) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const canWord = tier === 'pro' || tier === 'premium'

  async function downloadWord() {
    setDownloading(true)
    await downloadWordExport(projectId, name)
    setDownloading(false)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') { setIndex((i) => Math.min(i + 1, cards.length - 1)); setFlipped(false) }
      if (e.key === 'ArrowLeft') { setIndex((i) => Math.max(i - 1, 0)); setFlipped(false) }
      if (e.key === ' ') { e.preventDefault(); setFlipped((f) => !f) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [cards.length])

  if (cards.length === 0) return null
  const card = cards[index]

  function printPdf() {
    const rows = cards.map((c) => `<tr><td>${escapeHtml(c.front)}</td><td>${escapeHtml(c.back)}</td></tr>`).join('')
    printAsPdf(name, `<h1>${escapeHtml(name)}</h1><table><tr><th>Frage</th><th>Antwort</th></tr>${rows}</table>`)
  }

  return (
    <Modal title={name} onClose={onClose} wide
      footer={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="iconbtn" onClick={printPdf} title="Als PDF drucken"><Printer size={15} /></button>
          {canWord && (
            <button className="iconbtn" onClick={downloadWord} disabled={downloading} title="Als Word (.docx) herunterladen">
              <Download size={15} />
            </button>
          )}
          <button className="btn btn-quiet btn-sm" disabled={index === 0} onClick={() => { setIndex((i) => i - 1); setFlipped(false) }}>← Zurück</button>
          <div style={{ flex: 1, height: 3, background: 'var(--hairline)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${((index + 1) / cards.length) * 100}%`, background: 'var(--accent)', borderRadius: 99, transition: 'width 200ms ease' }} />
          </div>
          <span className="t-caption">{index + 1} / {cards.length}</span>
          <button className="btn btn-quiet btn-sm" disabled={index === cards.length - 1} onClick={() => { setIndex((i) => i + 1); setFlipped(false) }}>Weiter →</button>
        </div>
      }
    >
      <button
        onClick={() => setFlipped((f) => !f)}
        style={{
          width: '100%', minHeight: 300, border: 'none', cursor: 'pointer', font: 'inherit',
          borderRadius: 20, padding: '44px 48px', textAlign: 'center',
          background: flipped ? 'var(--accent)' : 'var(--parchment)',
          color: flipped ? '#fff' : 'var(--ink)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18,
          transition: 'background 200ms ease',
        }}
      >
        <span className="t-micro" style={{ color: flipped ? 'rgba(255,255,255,0.7)' : undefined }}>
          {flipped ? 'Antwort' : 'Frage'}
        </span>
        <span style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.5, fontFamily: 'var(--font-display)' }}>
          {flipped ? card.back : card.front}
        </span>
        <span style={{ fontSize: 11.5, opacity: 0.45 }}>Klicken oder Leertaste zum Umdrehen</span>
      </button>
    </Modal>
  )
}

/** Review-Modus: fällige Karten aus allen Decks, richtig/falsch → Leitner-Box. */
export function ReviewModal({ due, onClose, onFinished }: { due: DueCard[]; onClose: () => void; onFinished: () => void }) {
  const [queue, setQueue] = useState(due)
  const [flipped, setFlipped] = useState(false)
  const [doneCount, setDoneCount] = useState(0)

  async function answer(correct: boolean) {
    const card = queue[0]
    setFlipped(false)
    setQueue((q) => q.slice(1))
    setDoneCount((n) => n + 1)
    fetch(api('/api/srs'), {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cardId: card.id, correct }),
    }).catch(() => {})
  }

  if (queue.length === 0) {
    return (
      <Modal title="Wiederholung" onClose={() => { onFinished(); onClose() }}>
        <div style={{ textAlign: 'center', padding: '28px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ fontSize: 40 }}>✓</span>
          <span className="t-title">Alles wiederholt!</span>
          <p className="t-caption">{doneCount} Karten heute geschafft. Die nächsten werden fällig, sobald ihre Leitner-Box es sagt.</p>
          <button className="btn btn-primary" style={{ alignSelf: 'center', marginTop: 8 }} onClick={() => { onFinished(); onClose() }}>Fertig</button>
        </div>
      </Modal>
    )
  }

  const card = queue[0]
  return (
    <Modal title={`Wiederholung · noch ${queue.length}`} onClose={() => { onFinished(); onClose() }} wide>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <span className="t-caption">{card.subject} · {card.deck} · Box {card.box}</span>
        <button
          onClick={() => setFlipped((f) => !f)}
          style={{
            width: '100%', minHeight: 240, border: 'none', cursor: 'pointer', font: 'inherit',
            borderRadius: 20, padding: '36px 40px', textAlign: 'center',
            background: flipped ? 'var(--accent)' : 'var(--parchment)',
            color: flipped ? '#fff' : 'var(--ink)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14,
            transition: 'background 200ms ease',
          }}
        >
          <span className="t-micro" style={{ color: flipped ? 'rgba(255,255,255,0.7)' : undefined }}>{flipped ? 'Antwort' : 'Frage'}</span>
          <span style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.5, fontFamily: 'var(--font-display)' }}>{flipped ? card.back : card.front}</span>
        </button>
        {flipped ? (
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button className="btn" style={{ background: 'rgba(208,52,44,0.1)', color: 'var(--err)' }} onClick={() => answer(false)}>Nicht gewusst</button>
            <button className="btn" style={{ background: 'rgba(29,154,78,0.12)', color: 'var(--ok)' }} onClick={() => answer(true)}>Gewusst</button>
          </div>
        ) : (
          <p className="t-caption" style={{ textAlign: 'center' }}>Erst überlegen, dann umdrehen.</p>
        )}
      </div>
    </Modal>
  )
}
