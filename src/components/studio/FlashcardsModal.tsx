'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Check, X } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { ExportBar } from '@/components/studio/ExportBar'
import { api } from '@/lib/utils'
import { escapeHtml, printAsPdf } from '@/lib/print'

// Karten-Viewer (Deck durchblättern, sortieren, bewerten) + SRS-Review-Modus
// (Leitner-Queue). Tastatur: ←/→ blättern, Leertaste dreht, 1/2 bewerten.

interface Card { front: string; back: string }
export interface DueCard { id: number; front: string; back: string; box: number; subject: string; deck: string }

/** Karte mit Leitner-Zustand — kommt aus /api/srs?project=…, sobald das Deck offen ist. */
interface DeckCard extends Card { id: number; box: number; lapses: number }

type Filter = 'alle' | 'schwierig' | 'sitzt'

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'alle', label: 'Alle' },
  { id: 'schwierig', label: 'Noch schwierig' },
  { id: 'sitzt', label: 'Sitzt' },
]

export function FlashcardsModal({ projectId, name, cards, onClose }: {
  projectId: string; name: string; cards: Card[]; onClose: () => void
}) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [deck, setDeck] = useState<DeckCard[] | null>(null)
  const [filter, setFilter] = useState<Filter>('alle')

  // Bewertungen brauchen die Karten-IDs aus der Datenbank — dieselbe
  // Leitner-Queue wie die tägliche Wiederholung, kein zweites System.
  useEffect(() => {
    fetch(api(`/api/srs?project=${encodeURIComponent(projectId)}`))
      .then((r) => r.json())
      .then((d) => Array.isArray(d.cards) && d.cards.length > 0 && setDeck(d.cards))
      .catch(() => {})
  }, [projectId])

  // Box 1–2 = wackelt noch, ab Box 3 sitzt es. Innerhalb der Ansicht zuerst
  // das Schwierigste (niedrigste Box, meiste Fehler).
  const view = useMemo(() => {
    if (!deck) return cards.map((c, i) => ({ ...c, id: -i - 1, box: 0, lapses: 0 }))
    const filtered = deck.filter((c) => filter === 'alle' || (filter === 'schwierig' ? c.box <= 2 : c.box >= 3))
    return filter === 'schwierig' ? [...filtered].sort((a, b) => a.box - b.box || b.lapses - a.lapses) : filtered
  }, [deck, cards, filter])

  const clamped = Math.min(index, Math.max(view.length - 1, 0))
  const card = view[clamped]

  const rate = useCallback((correct: boolean) => {
    if (!card || card.id < 0) return
    setDeck((d) => d?.map((c) => (c.id === card.id
      ? { ...c, box: correct ? Math.min(c.box + 1, 5) : 1, lapses: c.lapses + (correct ? 0 : 1) }
      : c)) ?? null)
    fetch(api('/api/srs'), {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cardId: card.id, correct }),
    }).catch(() => {})
    setFlipped(false)
    setIndex((i) => Math.min(i + 1, view.length - 1))
  }, [card, view.length])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') { setIndex((i) => Math.min(i + 1, view.length - 1)); setFlipped(false) }
      if (e.key === 'ArrowLeft') { setIndex((i) => Math.max(i - 1, 0)); setFlipped(false) }
      if (e.key === ' ') { e.preventDefault(); setFlipped((f) => !f) }
      if (e.key === '1') rate(false)
      if (e.key === '2') rate(true)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [view.length, rate])

  if (cards.length === 0) return null

  function printPdf() {
    const rows = cards.map((c) => `<tr><td>${escapeHtml(c.front)}</td><td>${escapeHtml(c.back)}</td></tr>`).join('')
    printAsPdf(name, `<h1>${escapeHtml(name)}</h1><table><tr><th>Frage</th><th>Antwort</th></tr>${rows}</table>`)
  }

  const counts = deck ? {
    schwierig: deck.filter((c) => c.box <= 2).length,
    sitzt: deck.filter((c) => c.box >= 3).length,
  } : null

  return (
    <Modal title={name} onClose={onClose} wide focusable
      footer={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button className="btn btn-quiet btn-sm" disabled={clamped === 0} onClick={() => { setIndex(clamped - 1); setFlipped(false) }}>←</button>
            <div style={{ flex: 1, height: 3, background: 'var(--hairline)', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${view.length ? ((clamped + 1) / view.length) * 100 : 0}%`, background: 'var(--accent)', borderRadius: 99, transition: 'width 200ms ease' }} />
            </div>
            <span className="t-caption">{view.length ? clamped + 1 : 0} / {view.length}</span>
            <button className="btn btn-quiet btn-sm" disabled={clamped >= view.length - 1} onClick={() => { setIndex(clamped + 1); setFlipped(false) }}>→</button>
          </div>
          <ExportBar projectId={projectId} filename={name} onPrint={printPdf} />
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, height: '100%' }}>
        {deck && (
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
            {FILTERS.map((f) => {
              const n = f.id === 'alle' ? deck.length : counts![f.id]
              return (
                <button key={f.id} onClick={() => { setFilter(f.id); setIndex(0); setFlipped(false) }}
                  className="btn btn-sm"
                  style={{ background: filter === f.id ? 'var(--accent)' : 'var(--parchment)', color: filter === f.id ? '#fff' : 'var(--ink-muted)' }}>
                  {f.label} · {n}
                </button>
              )
            })}
            <span className="t-caption" style={{ marginLeft: 'auto' }}>Bewerten mit 1 / 2 · umdrehen mit Leertaste</span>
          </div>
        )}

        {card ? (
          <>
            <button
              onClick={() => setFlipped((f) => !f)}
              style={{
                width: '100%', flex: 1, minHeight: 300, border: 'none', cursor: 'pointer', font: 'inherit',
                borderRadius: 20, padding: '44px 48px', textAlign: 'center',
                background: flipped ? 'var(--accent)' : 'var(--parchment)',
                color: flipped ? '#fff' : 'var(--ink)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18,
                transition: 'background 200ms ease',
              }}
            >
              <span className="t-micro" style={{ color: flipped ? 'rgba(255,255,255,0.7)' : undefined }}>
                {flipped ? 'Antwort' : 'Frage'}{card.box > 0 ? ` · Box ${card.box}` : ''}
              </span>
              <span style={{ fontSize: 'clamp(20px, 2.6vw, 30px)', fontWeight: 600, lineHeight: 1.5, fontFamily: 'var(--font-display)' }}>
                {flipped ? card.back : card.front}
              </span>
              <span style={{ fontSize: 11.5, opacity: 0.45 }}>Klicken oder Leertaste zum Umdrehen</span>
            </button>
            {deck && (
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                <button className="btn" style={{ background: 'rgba(208,52,44,0.1)', color: 'var(--err)' }} onClick={() => rate(false)}>
                  <X size={15} /> Nicht gewusst
                </button>
                <button className="btn" style={{ background: 'rgba(29,154,78,0.12)', color: 'var(--ok)' }} onClick={() => rate(true)}>
                  <Check size={15} /> Gewusst
                </button>
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 34 }}>✓</span>
            <span className="t-title">Nichts in dieser Ansicht</span>
            <p className="t-caption">In „{FILTERS.find((f) => f.id === filter)?.label}" liegt gerade keine Karte.</p>
          </div>
        )}
      </div>
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
    <Modal title={`Wiederholung · noch ${queue.length}`} onClose={() => { onFinished(); onClose() }} wide focusable>
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
