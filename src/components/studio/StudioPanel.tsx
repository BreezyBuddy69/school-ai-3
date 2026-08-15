'use client'

import { useRef, useState } from 'react'
import { ChevronDown, FileText, FolderInput, GitBranch, Headphones, HelpCircle, Layers, MoreHorizontal, Pencil, Pin, Trash2 } from 'lucide-react'
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
  onRenameProject, onMoveProject, onRenameFolder,
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
  onRenameProject: (p: Project, name: string) => void
  onMoveProject: (p: Project, folderId: string | null, folderName?: string) => void
  onRenameFolder: (folderId: string, name: string) => void
}) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  // Löschen braucht zwei Klicks auf denselben Button — ein Doppelklick aus
  // Versehen (z.B. schnelles Antippen) darf trotzdem nicht sofort löschen,
  // darum zählt der zweite Klick erst nach einer kurzen Sperrfrist. Ausserdem
  // läuft die Bestätigung nach ein paar Sekunden von selbst ab (auf Touch
  // gibt es kein onMouseLeave, das sie sonst zurücksetzen würde).
  const armedAt = useRef(0)
  const armTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())
  const [menuFor, setMenuFor] = useState<string | null>(null)

  function arm(id: string) {
    armedAt.current = Date.now()
    setConfirmDelete(id)
    if (armTimeout.current) clearTimeout(armTimeout.current)
    armTimeout.current = setTimeout(() => setConfirmDelete(null), 3000)
  }
  function disarm() {
    setConfirmDelete(null)
    if (armTimeout.current) clearTimeout(armTimeout.current)
  }

  const groups: { key: string; name: string | null; items: Project[] }[] = []
  for (const p of projects) {
    const key = p.folder_id ?? '__none__'
    let g = groups.find((g) => g.key === key)
    if (!g) { g = { key, name: p.folder_id ? (p.folder_name ?? 'Ordner') : null, items: [] }; groups.push(g) }
    g.items.push(p)
  }
  const folderOptions = groups.filter((g) => g.name).map((g) => ({ id: g.key, name: g.name! }))

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
    const menuOpen = menuFor === p.id
    return (
      <div
        style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 4, borderRadius: 11, transition: 'background 120ms ease' }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--parchment)')}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; if (confirmDelete === p.id) disarm() }}
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
          onClick={(e) => { e.stopPropagation(); setMenuFor(menuOpen ? null : p.id) }}
          className="iconbtn"
          style={{ width: 26, height: 26, color: menuOpen ? 'var(--accent)' : 'var(--ink-faint)' }}
          title="Umbenennen / verschieben"
        >
          <MoreHorizontal size={13} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            if (confirmDelete === p.id) {
              // Sperrfrist gegen versehentlichen Doppelklick — der zweite
              // Klick zählt erst, wenn der erste wirklich "gesehen" wurde.
              if (Date.now() - armedAt.current < 350) return
              onDeleteProject(p)
              disarm()
            } else arm(p.id)
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

        {menuOpen && (
          <div
            className="glass-strong"
            style={{
              position: 'absolute', top: '100%', right: 4, marginTop: 4, zIndex: 20,
              borderRadius: 12, boxShadow: 'var(--shadow-card)', minWidth: 180, padding: 5,
              display: 'flex', flexDirection: 'column', gap: 1,
            }}
            onMouseLeave={() => setMenuFor(null)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation()
                const name = window.prompt('Neuer Name', p.name)
                if (name && name.trim()) onRenameProject(p, name.trim())
                setMenuFor(null)
              }}
              className="menuitem"
            >
              <Pencil size={12} /> Umbenennen
            </button>
            {p.folder_id && (
              <button onClick={(e) => { e.stopPropagation(); onMoveProject(p, null); setMenuFor(null) }} className="menuitem">
                <FolderInput size={12} /> Aus Ordner nehmen
              </button>
            )}
            {folderOptions.filter((f) => f.id !== p.folder_id).map((f) => (
              <button key={f.id} onClick={(e) => { e.stopPropagation(); onMoveProject(p, f.id, f.name); setMenuFor(null) }} className="menuitem">
                <FolderInput size={12} /> In „{f.name}"
              </button>
            ))}
            <button
              onClick={(e) => {
                e.stopPropagation()
                const name = window.prompt('Name des neuen Ordners')
                if (name && name.trim()) onMoveProject(p, null, name.trim())
                setMenuFor(null)
              }}
              className="menuitem"
            >
              <FolderInput size={12} /> Neuer Ordner…
            </button>
          </div>
        )}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <button
                    onClick={() => setCollapsed((prev) => {
                      const next = new Set(prev)
                      if (next.has(g.key)) next.delete(g.key); else next.add(g.key)
                      return next
                    })}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 0, padding: '2px 4px 8px',
                      border: 'none', background: 'transparent', cursor: 'pointer', font: 'inherit', textAlign: 'left',
                    }}
                  >
                    <ChevronDown size={11} style={{ color: 'var(--ink-faint)', transform: isCollapsed ? 'rotate(-90deg)' : 'none', transition: 'transform 120ms ease' }} />
                    <span className="t-micro" style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.name}</span>
                    <span className="t-micro" style={{ opacity: 0.6 }}>{g.items.length}</span>
                  </button>
                  <button
                    onClick={() => {
                      const name = window.prompt('Ordner umbenennen', g.name ?? '')
                      if (name && name.trim()) onRenameFolder(g.key, name.trim())
                    }}
                    className="iconbtn"
                    style={{ width: 20, height: 20, marginBottom: 6, color: 'var(--ink-faint)' }}
                    title="Ordner umbenennen"
                  >
                    <Pencil size={10} />
                  </button>
                </div>
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
