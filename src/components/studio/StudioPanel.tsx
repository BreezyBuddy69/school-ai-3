'use client'

import { useState } from 'react'
import { ChevronDown, FileText, GitBranch, Headphones, HelpCircle, Layers, Pin, Trash2 } from 'lucide-react'
import { timeAgo } from '@/lib/utils'

export interface Project {
  id: string; subject: string; type: string; name: string; content: string; pinned: number; created_at: string
  folder_id?: string | null; folder_name?: string | null
  /** Optimistische Platzhalter-Karte, während die Generierung noch läuft (siehe chat/page.tsx generateTool). */
  pending?: boolean
}

export const TOOLS = [
  { id: 'lernkarten', title: 'Lernkarten', desc: 'Leitner-System, täglich fällig', Icon: Layers, premium: false },
  { id: 'zusammenfassung', title: 'Zusammenfassung', desc: 'Niveau wählbar · Word-Export', Icon: FileText, premium: false },
  { id: 'quiz', title: 'Quiz', desc: 'Üben oder Prüfungssimulation', Icon: HelpCircle, premium: false },
  { id: 'mindmap', title: 'Mindmap', desc: 'Zusammenhänge sehen', Icon: GitBranch, premium: false },
  { id: 'podcast', title: 'Podcast', desc: 'Gesprochene Zusammenfassung', Icon: Headphones, premium: true },
] as const

export type ToolId = (typeof TOOLS)[number]['id']

const TYPE_ICON: Record<string, typeof Layers> = {
  lernkarten: Layers, zusammenfassung: FileText, quiz: HelpCircle, mindmap: GitBranch, podcast: Headphones,
}

// Rechte Spalte: Werkzeuge + gespeicherte Projekte des Fachs. Jedes Artefakt
// ist persistent (SQLite) — nichts verschwindet beim Gerätewechsel. Projekte,
// die aus derselben Themenauswahl entstanden sind (z.B. eine Prüfung über
// mehrere Themen), werden automatisch in einem gemeinsamen Ordner gruppiert.

export function StudioPanel({
  projects, dueCards, tier, onLaunch, onOpenProject, onReview, onTogglePin, onDeleteProject, onUpgrade,
}: {
  projects: Project[]
  dueCards: number
  tier: 'free' | 'pro' | 'premium'
  onLaunch: (tool: ToolId) => void
  onOpenProject: (p: Project) => void
  onReview: () => void
  onTogglePin: (p: Project) => void
  onDeleteProject: (p: Project) => void
  onUpgrade: () => void
}) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())

  const groups: { key: string; name: string | null; items: Project[] }[] = []
  for (const p of projects) {
    const key = p.folder_id ?? '__none__'
    let g = groups.find((g) => g.key === key)
    if (!g) { g = { key, name: p.folder_id ? (p.folder_name ?? 'Ordner') : null, items: [] }; groups.push(g) }
    g.items.push(p)
  }

  function ProjectRow({ p }: { p: Project }) {
    const Icon = TYPE_ICON[p.type] ?? FileText
    if (p.pending) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 6px 9px 12px' }}>
          <span className="spinner-ring" aria-hidden />
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--ink-muted)' }}>{p.name}</span>
            <span className="t-caption" style={{ fontSize: 10.5 }}>Wird erstellt…</span>
          </span>
        </div>
      )
    }
    return (
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 4, borderRadius: 11, transition: 'background 120ms ease' }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--parchment)')}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; if (confirmDelete === p.id) setConfirmDelete(null) }}
      >
        <button
          onClick={() => onOpenProject(p)}
          style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 9, padding: '9px 6px 9px 12px', border: 'none', background: 'transparent', cursor: 'pointer', font: 'inherit', textAlign: 'left', color: 'var(--ink)' }}
        >
          <Icon size={13} style={{ flexShrink: 0, color: 'var(--ink-faint)' }} />
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
            <span className="t-caption" style={{ fontSize: 10.5 }}>{timeAgo(p.created_at)}</span>
          </span>
        </button>
        <button
          onClick={() => onTogglePin(p)}
          className="iconbtn"
          style={{ width: 26, height: 26, color: p.pinned ? 'var(--accent)' : 'var(--ink-faint)' }}
          title={p.pinned ? 'Losheften' : 'Anheften'}
        >
          <Pin size={12} fill={p.pinned ? 'currentColor' : 'none'} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            if (confirmDelete === p.id) { onDeleteProject(p); setConfirmDelete(null) }
            else setConfirmDelete(p.id)
          }}
          className="iconbtn"
          style={{
            width: 26, height: 26, marginRight: 4,
            color: confirmDelete === p.id ? 'var(--err)' : 'var(--ink-faint)',
            background: confirmDelete === p.id ? 'rgba(208,52,44,0.1)' : 'transparent',
          }}
          title={confirmDelete === p.id ? 'Nochmal klicken zum Löschen' : 'Löschen'}
        >
          <Trash2 size={12} />
        </button>
      </div>
    )
  }

  return (
    <aside
      className="glass-strong"
      style={{ width: 316, height: '100%', flexShrink: 0, display: 'flex', flexDirection: 'column', borderRadius: 22, overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}
    >
      <div className="hairline-b" style={{ padding: '18px 22px 14px' }}>
        <span className="t-title" style={{ fontSize: 16 }}>Studio</span>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {dueCards > 0 && (
          <button
            onClick={onReview}
            className="anim-in"
            style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 14,
              border: 'none', cursor: 'pointer', font: 'inherit', textAlign: 'left',
              background: 'var(--accent)', color: '#fff',
            }}
          >
            <Layers size={16} />
            <span style={{ flex: 1 }}>
              <span style={{ display: 'block', fontSize: 13.5, fontWeight: 600 }}>{dueCards} Karten fällig</span>
              <span style={{ fontSize: 11.5, opacity: 0.85 }}>Jetzt wiederholen — 2 Minuten</span>
            </span>
          </button>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {TOOLS.map(({ id, title, desc, Icon, premium }) => {
            const locked = premium && tier === 'free'
            return (
              <button
                key={id} onClick={() => (locked ? onUpgrade() : onLaunch(id))}
                className="card"
                style={{
                  padding: '14px 14px', cursor: 'pointer', font: 'inherit', textAlign: 'left',
                  display: 'flex', flexDirection: 'column', gap: 7, position: 'relative',
                  opacity: locked ? 0.6 : 1,
                  transition: 'transform 150ms var(--spring), border-color 150ms ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'var(--accent)' }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'var(--hairline)' }}
              >
                {locked && (
                  <span className="t-micro" style={{
                    position: 'absolute', top: 8, right: 8, padding: '2px 7px', borderRadius: 99,
                    background: 'var(--accent)', color: '#fff', fontWeight: 600,
                  }}>Pro</span>
                )}
                <Icon size={17} style={{ color: 'var(--accent)' }} />
                <span>
                  <span style={{ display: 'block', fontSize: 13, fontWeight: 600 }}>{title}</span>
                  <span className="t-caption" style={{ fontSize: 10.5, lineHeight: 1.35, display: 'block', marginTop: 2 }}>{desc}</span>
                </span>
              </button>
            )
          })}
        </div>

        {groups.map((g) => {
          const isCollapsed = collapsed.has(g.key)
          return (
            <div key={g.key}>
              {g.name ? (
                <button
                  onClick={() => setCollapsed((prev) => {
                    const next = new Set(prev)
                    if (next.has(g.key)) next.delete(g.key); else next.add(g.key)
                    return next
                  })}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6, width: '100%', padding: '2px 4px 8px',
                    border: 'none', background: 'transparent', cursor: 'pointer', font: 'inherit', textAlign: 'left',
                  }}
                >
                  <ChevronDown size={11} style={{ color: 'var(--ink-faint)', transform: isCollapsed ? 'rotate(-90deg)' : 'none', transition: 'transform 120ms ease' }} />
                  <span className="t-micro" style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.name}</span>
                  <span className="t-micro" style={{ opacity: 0.6 }}>{g.items.length}</span>
                </button>
              ) : (
                <span className="t-micro" style={{ display: 'block', padding: '2px 4px 8px' }}>Gespeichert</span>
              )}
              {!isCollapsed && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {g.items.map((p) => <ProjectRow key={p.id} p={p} />)}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </aside>
  )
}
