'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, ChevronDown, ChevronRight, Search } from 'lucide-react'
import { api } from '@/lib/utils'
import { SubjectIntro } from './SubjectIntro'

// Kontext-Kontrolle: welche Themen die KI in diesem Chat lesen darf.
// "Ganzes Fach" / pro Jahr als Ein-Tap-Scopes, Suche, dann Feinauswahl.
//
// Ein Thema lässt sich ganz wählen oder nur in einzelnen Abschnitten (die
// "## "-Überschriften der Themendatei = die Lernziele). Intern liegt die
// Auswahl als Map Datei → 'all' | Set<Abschnittsnummer>; nach aussen geht sie
// als Slug-Liste raus: "Fach/Jahr/thema" bzw. "Fach/Jahr/thema#1,3".

export interface PickerTopic { slug: string; label: string; year: string }

type Pick = 'all' | Set<number>
type Selection = Map<string, Pick>

interface Hit { slug: string; label: string; year: string; subject: string; section?: number; sectionTitle?: string; snippet?: string }

function parseInitial(slugs: string[]): Selection {
  const sel: Selection = new Map()
  for (const s of slugs) {
    const [file, part] = s.split('#')
    if (!part) { sel.set(file, 'all'); continue }
    const nums = part.split(',').map(Number).filter((n) => Number.isInteger(n) && n > 0)
    const cur = sel.get(file)
    if (cur === 'all') continue
    sel.set(file, new Set([...(cur ?? []), ...nums]))
  }
  return sel
}

function serialize(sel: Selection): string[] {
  const out: string[] = []
  for (const [file, pick] of sel) {
    if (pick === 'all') out.push(file)
    else if (pick.size > 0) out.push(`${file}#${[...pick].sort((a, b) => a - b).join(',')}`)
  }
  return out
}

export function TopicPicker({
  subject, topics, initial, onConfirm, onCancel,
}: {
  subject: string
  topics: PickerTopic[]
  initial: string[]
  onConfirm: (slugs: string[]) => void
  onCancel?: () => void
}) {
  const [selected, setSelected] = useState<Selection>(() => parseInitial(initial))
  const [search, setSearch] = useState('')
  const [hits, setHits] = useState<Hit[] | null>(null)
  const [searching, setSearching] = useState(false)
  const [yearFilter, setYearFilter] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [sections, setSections] = useState<Record<string, string[]>>({})

  const years = useMemo(() => [...new Set(topics.map((t) => t.year))].sort(), [topics])

  // Volltextsuche serverseitig (Titel + Inhalt). Debounce, damit nicht jeder
  // Tastendruck eine Anfrage auslöst; ein leeres Feld zeigt wieder die Liste.
  const seq = useRef(0)
  useEffect(() => {
    const q = search.trim()
    if (q.length < 2) { setHits(null); setSearching(false); return }
    setSearching(true)
    const mine = ++seq.current
    const t = setTimeout(async () => {
      try {
        const res = await fetch(api(`/api/subjects?q=${encodeURIComponent(q)}&subject=${encodeURIComponent(subject)}`))
        const data = await res.json()
        if (mine === seq.current) setHits(data.hits ?? [])
      } finally {
        if (mine === seq.current) setSearching(false)
      }
    }, 250)
    return () => clearTimeout(t)
  }, [search, subject])

  function update(fn: (next: Selection) => void) {
    setSelected((prev) => { const next = new Map(prev); fn(next); return next })
  }

  function toggleTopic(file: string) {
    update((next) => { if (next.has(file)) next.delete(file); else next.set(file, 'all') })
  }

  function toggleSection(file: string, n: number, total: number) {
    update((next) => {
      const cur = next.get(file)
      // Ganzes Thema war gewählt: ein abgewählter Abschnitt macht daraus alle anderen.
      const set = cur === 'all' ? new Set(Array.from({ length: total }, (_, i) => i + 1)) : new Set(cur ?? [])
      if (set.has(n)) set.delete(n); else set.add(n)
      if (set.size === 0) next.delete(file)
      else if (set.size === total) next.set(file, 'all')
      else next.set(file, set)
    })
  }

  async function expand(file: string) {
    setExpanded(expanded === file ? null : file)
    if (sections[file]) return
    const res = await fetch(api(`/api/subjects?sections=${encodeURIComponent(file)}`))
    const data = await res.json()
    setSections((s) => ({ ...s, [file]: data.sections ?? [] }))
  }

  function selectScope(files: string[]) {
    setSelected(new Map(files.map((f) => [f, 'all' as Pick])))
  }

  const filtered = topics.filter((t) => !yearFilter || t.year === yearFilter)
  const yearLabel = (y: string) => (y === 'vokabeln' ? 'Vokabeln' : /^\d+$/.test(y) ? `${y}. Jahr` : y)

  // Zählt Themen, nicht Slugs — "Zelle (2 von 6 Abschnitten)" bleibt ein Thema.
  const count = selected.size
  const partial = [...selected.values()].filter((p) => p !== 'all').length

  const box = (on: boolean, size = 18) => (
    <span style={{
      width: size, height: size, borderRadius: size / 3, flexShrink: 0,
      border: `1.5px solid ${on ? 'var(--accent)' : 'var(--ink-faint)'}`,
      background: on ? 'var(--accent)' : 'transparent',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {on && <Check size={size * 0.66} color="#fff" strokeWidth={3} />}
    </span>
  )

  function statusOf(file: string): { on: boolean; note?: string } {
    const pick = selected.get(file)
    if (!pick) return { on: false }
    if (pick === 'all') return { on: true }
    const total = sections[file]?.length
    return { on: true, note: `${pick.size}${total ? ` von ${total}` : ''} Abschnitte` }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 620, width: '100%', margin: '0 auto' }}>
      <div>
        <SubjectIntro subject={subject} height="clamp(56px, 9vw, 84px)" />
        <p className="t-caption" style={{ marginTop: 6 }}>
          Wähl die Themen, die die KI in diesem Chat kennen soll — sie liest sie sichtbar, bevor sie antwortet.
          Tippe auf den Pfeil, um nur einzelne Abschnitte eines Themas zu nehmen.
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
        <button className="btn btn-ghost btn-sm" onClick={() => setSelected(new Map())}>Keine</button>
      </div>

      <div style={{ position: 'relative' }}>
        <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-faint)' }} />
        <input
          className="field" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Thema oder Stichwort suchen…" style={{ paddingLeft: 38 }}
        />
      </div>

      {hits !== null ? (
        // ── Suchergebnisse: Volltext über alle Themendateien ──────────────────
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <p className="t-caption">
            {searching ? 'Sucht…' : hits.length === 0 ? 'Nichts gefunden.' : `${hits.length} Treffer — auch im Text der Themen gesucht.`}
          </p>
          {hits.map((h) => {
            const on = h.section
              ? (() => { const p = selected.get(h.slug.split('#')[0]); return p === 'all' || (p instanceof Set && p.has(h.section)) })()
              : selected.get(h.slug) !== undefined
            const file = h.slug.split('#')[0]
            return (
              <button
                key={h.slug}
                onClick={() => h.section
                  ? expand(file).then(() => toggleSection(file, h.section!, sections[file]?.length ?? h.section!))
                  : toggleTopic(file)}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 13px', textAlign: 'left',
                  borderRadius: 12, cursor: 'pointer', font: 'inherit',
                  border: `1px solid ${on ? 'var(--accent)' : 'var(--hairline)'}`,
                  background: on ? 'var(--accent-soft)' : 'var(--canvas)',
                }}
              >
                {box(on, 17)}
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'block', fontSize: 13.5, fontWeight: 500, textTransform: 'capitalize' }}>
                    {h.label}{h.sectionTitle && <span style={{ opacity: 0.75, fontWeight: 400 }}> › {h.sectionTitle}</span>}
                  </span>
                  {h.snippet && <span className="t-caption" style={{ display: 'block', marginTop: 2 }}>{h.snippet}</span>}
                  <span className="t-caption">{yearLabel(h.year)}</span>
                </span>
              </button>
            )
          })}
        </div>
      ) : (
        <>
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map((t) => {
              const { on, note } = statusOf(t.slug)
              const open = expanded === t.slug
              const list = sections[t.slug]
              const pick = selected.get(t.slug)
              return (
                <div key={t.slug} style={{
                  borderRadius: 12, overflow: 'hidden',
                  border: `1px solid ${on ? 'var(--accent)' : 'var(--hairline)'}`,
                  background: on ? 'var(--accent-soft)' : 'var(--canvas)',
                  transition: 'border-color 120ms ease, background 120ms ease',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <button
                      onClick={() => toggleTopic(t.slug)}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', flex: 1, minWidth: 0,
                        textAlign: 'left', cursor: 'pointer', font: 'inherit', background: 'none', border: 'none', color: 'inherit' }}
                    >
                      {box(on)}
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ display: 'block', fontSize: 13.5, fontWeight: 500, textTransform: 'capitalize' }}>{t.label}</span>
                        <span className="t-caption">{yearLabel(t.year)}{note ? ` · ${note}` : ''}</span>
                      </span>
                    </button>
                    <button
                      onClick={() => expand(t.slug)} aria-label="Abschnitte anzeigen"
                      style={{ padding: '11px 14px', cursor: 'pointer', background: 'none', border: 'none', color: 'var(--ink-faint)' }}
                    >
                      {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                  </div>

                  {open && (
                    <div style={{ padding: '2px 14px 12px 44px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {!list && <span className="t-caption">Lädt…</span>}
                      {list?.length === 0 && <span className="t-caption">Dieses Thema hat keine Abschnitte — es geht nur ganz.</span>}
                      {list?.map((title, i) => {
                        const n = i + 1
                        const sOn = pick === 'all' || (pick instanceof Set && pick.has(n))
                        return (
                          <button
                            key={n} onClick={() => toggleSection(t.slug, n, list.length)}
                            style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '6px 0', textAlign: 'left',
                              cursor: 'pointer', font: 'inherit', background: 'none', border: 'none', color: 'inherit' }}
                          >
                            {box(sOn, 15)}
                            <span style={{ fontSize: 12.5, opacity: sOn ? 1 : 0.75 }}>{title}</span>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
            {filtered.length === 0 && <p className="t-caption">Nichts gefunden.</p>}
          </div>
        </>
      )}

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 24 }}>
        {partial > 0 && <span className="t-caption" style={{ marginRight: 'auto' }}>{partial} davon nur teilweise</span>}
        {onCancel && <button className="btn btn-ghost" onClick={onCancel}>Abbrechen</button>}
        <button className="btn btn-primary" onClick={() => onConfirm(serialize(selected))}>
          Chat starten{count > 0 ? ` · ${count} ${count === 1 ? 'Thema' : 'Themen'}` : ''}
        </button>
      </div>
    </div>
  )
}
