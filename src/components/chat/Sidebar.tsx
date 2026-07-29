'use client'

import { useState } from 'react'
import { ChevronLeft, Flame, MessageSquare, Plus, Settings, Trash2 } from 'lucide-react'
import { Wordmark } from '@/components/ui/Logo'
import { subjectGlyph, timeAgo } from '@/lib/utils'
import type { Profile } from '@/lib/store'

export interface ChatListItem { id: string; subject: string; title: string | null; last_message_at: string; message_count: number }

// Linke Spalte: Fächerliste ODER Chats des gewählten Fachs. Liquid Glass,
// eine Ebene Tiefe — keine verschachtelten Menüs.

export function Sidebar({
  subjects, mySubjects, selectedSubject, chats, activeChatId, profile,
  onSelectSubject, onBack, onOpenChat, onNewChat, onDeleteChat, onSettings,
}: {
  subjects: string[]
  mySubjects: string[] | null
  selectedSubject: string | null
  chats: ChatListItem[]
  activeChatId: string | null
  profile: Profile | null
  onSelectSubject: (s: string) => void
  onBack: () => void
  onOpenChat: (id: string) => void
  onNewChat: () => void
  onDeleteChat: (id: string) => void
  onSettings: () => void
}) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const ordered = mySubjects
    ? [...subjects].sort((a, b) => Number(mySubjects.includes(b)) - Number(mySubjects.includes(a)) || a.localeCompare(b))
    : subjects

  return (
    <aside
      className="glass-strong"
      data-tour="sidebar"
      style={{ width: 288, height: '100%', flexShrink: 0, display: 'flex', flexDirection: 'column', borderRadius: 22, overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}
    >
      <div className="hairline-b" style={{ padding: '18px 20px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
        {selectedSubject ? (
          <>
            <button className="iconbtn" onClick={onBack} aria-label="Zurück zu den Fächern" style={{ width: 30, height: 30 }}>
              <ChevronLeft size={16} />
            </button>
            <span className="t-title" style={{ flex: 1, fontSize: 16, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedSubject}</span>
            <button className="iconbtn" onClick={onNewChat} title="Neuer Chat" style={{ width: 30, height: 30 }}><Plus size={16} /></button>
          </>
        ) : (
          <span style={{ flex: 1 }}><Wordmark size={26} /></span>
        )}
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 14 }}>
        {!selectedSubject ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span className="t-micro" style={{ padding: '6px 10px 8px' }}>Fächer</span>
            {ordered.map((s) => {
              const mine = mySubjects?.includes(s)
              return (
                <button
                  key={s} onClick={() => onSelectSubject(s)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 11, padding: '11px 14px', borderRadius: 12,
                    border: 'none', background: 'transparent', cursor: 'pointer', font: 'inherit', textAlign: 'left',
                    color: 'var(--ink)', transition: 'background 120ms ease',
                    opacity: mySubjects && !mine ? 0.5 : 1,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent-soft)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <span style={{
                    width: 30, height: 30, borderRadius: 9, background: 'var(--parchment)', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, color: 'var(--ink-muted)',
                  }}>{subjectGlyph(s)}</span>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{s}</span>
                </button>
              )
            })}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span className="t-micro" style={{ padding: '6px 10px 8px' }}>Chats</span>
            {chats.length === 0 && <p className="t-caption" style={{ padding: '4px 10px' }}>Noch keine Chats — starte oben rechts einen neuen.</p>}
            {chats.map((c) => (
              <div key={c.id} style={{ position: 'relative' }}
                onMouseLeave={() => confirmDelete === c.id && setConfirmDelete(null)}>
                <button
                  onClick={() => onOpenChat(c.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 9, width: '100%', padding: '11px 14px', borderRadius: 12,
                    border: 'none', cursor: 'pointer', font: 'inherit', textAlign: 'left', color: 'var(--ink)',
                    background: activeChatId === c.id ? 'var(--accent-soft)' : 'transparent',
                    transition: 'background 120ms ease',
                  }}
                  onMouseEnter={(e) => { if (activeChatId !== c.id) e.currentTarget.style.background = 'var(--parchment)' }}
                  onMouseLeave={(e) => { if (activeChatId !== c.id) e.currentTarget.style.background = 'transparent' }}
                >
                  <MessageSquare size={14} style={{ flexShrink: 0, color: 'var(--ink-faint)' }} />
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'block', fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.title ?? 'Neuer Chat'}
                    </span>
                    <span className="t-caption" style={{ fontSize: 11 }}>{timeAgo(c.last_message_at)}</span>
                  </span>
                  <span
                    role="button" tabIndex={0} aria-label="Chat löschen"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (confirmDelete === c.id) { onDeleteChat(c.id); setConfirmDelete(null) }
                      else setConfirmDelete(c.id)
                    }}
                    style={{
                      display: 'inline-flex', padding: 5, borderRadius: 7, flexShrink: 0,
                      color: confirmDelete === c.id ? 'var(--err)' : 'var(--ink-faint)',
                      background: confirmDelete === c.id ? 'rgba(208,52,44,0.1)' : 'transparent',
                    }}
                    title={confirmDelete === c.id ? 'Nochmal klicken zum Löschen' : 'Löschen'}
                  >
                    <Trash2 size={13} />
                  </span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="hairline-t" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
        {profile && (profile.streak ?? 0) > 0 && (
          <span className="streak-badge" title={`${profile.streak} Tage in Folge gelernt`}>
            <Flame size={12} /> {profile.streak}
          </span>
        )}
        <span style={{ flex: 1 }} />
        {profile && (
          <span className="t-caption" style={{
            padding: '3px 9px', borderRadius: 99, fontWeight: 600,
            background: profile.tier !== 'free' ? 'var(--accent)' : 'var(--parchment)',
            color: profile.tier !== 'free' ? '#fff' : 'var(--ink-muted)',
          }}>
            {profile.tier === 'free' ? 'Free' : profile.tier === 'pro' ? 'Pro' : 'Premium'}
          </span>
        )}
        <button className="iconbtn" data-tour="settings-btn" onClick={onSettings} aria-label="Einstellungen" style={{ width: 32, height: 32 }}>
          <Settings size={16} />
        </button>
      </div>
    </aside>
  )
}
