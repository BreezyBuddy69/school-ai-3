'use client'

import { useMemo, useState } from 'react'
import { Check, Search } from 'lucide-react'

// Kontext-Kontrolle: welche Themen die KI in diesem Chat lesen darf.
// "Ganzes Fach" / pro Jahr als Ein-Tap-Scopes, Suche, dann Feinauswahl.

export interface PickerTopic { slug: string; label: string; year: string }

export function TopicPicker({
  subject, topics, initial, onConfirm, onCancel,
}: {
  subject: string
  topics: PickerTopic[]
  initial: string[]
  onConfirm: (slugs: string[]) => void
  onCancel?: () => void
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set(initial))
  const [search, setSearch] = useState('')
  const [yearFilter, setYearFilter] = useState<string | null>(null)

  const years = useMemo(() => [...new Set(topics.map((t) => t.year))].sort(), [topics])
  const filtered = topics.filter((t) =>
    (!yearFilter || t.year === yearFilter) &&
    (!search || t.label.toLowerCase().includes(search.toLowerCase()))
  )

  function toggle(slug: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(slug)) next.delete(slug); else next.add(slug)
      return next
    })
  }
  function selectScope(scope: string[] ) {
    setSelected(new Set(scope))
  }

  const yearLabel = (y: string) => (y === 'vokabeln' ? 'Vokabeln' : /^\d+$/.test(y) ? `${y}. Jahr` : y)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 620, width: '100%', margin: '0 auto' }}>
      <div>
        <h1 className="t-display">{subject}</h1>
        <p className="t-caption" style={{ marginTop: 6 }}>
          Wähl die Themen, die die KI in diesem Chat kennen soll — sie liest sie sichtbar, bevor sie antwortet.
        </p>
        {initial.length > 0 && (
          <p className="t-caption" style={{ marginTop: 4, opacity: 0.7 }}>
            Vorausgewählt wie im letzten Chat — passe die Auswahl an oder tippe auf <strong>Keine</strong> zum Zurücksetzen.
          </p>
        )}
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button className="btn btn-quiet btn-sm" onClick={() => selectScope(topics.map((t) => t.slug))}>Ganzes Fach</button>
        {years.filter((y) => y !== 'vokabeln').map((y) => (
          <button key={y} className="btn btn-quiet btn-sm" onClick={() => selectScope(topics.filter((t) => t.year === y).map((t) => t.slug))}>
            {yearLabel(y)}
          </button>
        ))}
        <button className="btn btn-ghost btn-sm" onClick={() => selectScope([])}>Keine</button>
      </div>

      <div style={{ position: 'relative' }}>
        <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-faint)' }} />
        <input
          className="field" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Thema suchen…" style={{ paddingLeft: 38 }}
        />
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <button className="btn btn-sm" onClick={() => setYearFilter(null)}
          style={{ background: !yearFilter ? 'var(--accent)' : 'var(--parchment)', color: !yearFilter ? '#fff' : 'var(--ink-muted)' }}>
          Alle
        </button>
        {years.map((y) => (
          <button key={y} className="btn btn-sm" onClick={() => setYearFilter(yearFilter === y ? null : y)}
            style={{ background: yearFilter === y ? 'var(--accent)' : 'var(--parchment)', color: yearFilter === y ? '#fff' : 'var(--ink-muted)' }}>
            {yearLabel(y)}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 8 }}>
        {filtered.map((t) => {
          const on = selected.has(t.slug)
          return (
            <button
              key={t.slug} onClick={() => toggle(t.slug)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', textAlign: 'left',
                borderRadius: 12, cursor: 'pointer', font: 'inherit',
                border: `1px solid ${on ? 'var(--accent)' : 'var(--hairline)'}`,
                background: on ? 'var(--accent-soft)' : 'var(--canvas)',
                transition: 'border-color 120ms ease, background 120ms ease',
              }}
            >
              <span style={{
                width: 18, height: 18, borderRadius: 6, flexShrink: 0,
                border: `1.5px solid ${on ? 'var(--accent)' : 'var(--ink-faint)'}`,
                background: on ? 'var(--accent)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {on && <Check size={12} color="#fff" strokeWidth={3} />}
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', fontSize: 13.5, fontWeight: 500, textTransform: 'capitalize' }}>{t.label}</span>
                <span className="t-caption">{yearLabel(t.year)}</span>
              </span>
            </button>
          )
        })}
        {filtered.length === 0 && <p className="t-caption">Nichts gefunden.</p>}
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingBottom: 24 }}>
        {onCancel && <button className="btn btn-ghost" onClick={onCancel}>Abbrechen</button>}
        <button className="btn btn-primary" onClick={() => onConfirm([...selected])}>
          Chat starten{selected.size > 0 ? ` · ${selected.size} ${selected.size === 1 ? 'Thema' : 'Themen'}` : ''}
        </button>
      </div>
    </div>
  )
}
