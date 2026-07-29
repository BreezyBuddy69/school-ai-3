'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, PanelRight, Share2 } from 'lucide-react'
import { useAppStore, refreshProfile } from '@/lib/store'
import { api, subjectGlyph } from '@/lib/utils'
import { Sidebar, type ChatListItem } from '@/components/chat/Sidebar'
import { Transcript } from '@/components/chat/Transcript'
import { Composer } from '@/components/chat/Composer'
import { TopicPicker, type PickerTopic } from '@/components/chat/TopicPicker'
import { useChatStream } from '@/components/chat/useChatStream'
import { StudioPanel, TOOLS, type Project, type ToolId } from '@/components/studio/StudioPanel'
import { FlashcardsModal, ReviewModal, type DueCard } from '@/components/studio/FlashcardsModal'
import { QuizModal, type QuizQuestion } from '@/components/studio/QuizModal'
import { MindmapModal, type MindmapNode } from '@/components/studio/MindmapModal'
import { SummaryConfigModal, SummaryViewModal, type SummaryConfigState } from '@/components/studio/SummarySheet'
import { PodcastModal } from '@/components/studio/PodcastModal'
import { SettingsSheet } from '@/components/SettingsSheet'
import { Modal } from '@/components/ui/Modal'
import { ParticleTitle } from '@/components/ui/ParticleTitle'
import { TourOverlay, type TourStep } from '@/components/ui/TourOverlay'
type SubjectTree = Record<string, Record<string, Record<string, string>>>
type MainView = 'home' | 'picker' | 'chat'

const TOOL_TITLE = Object.fromEntries(TOOLS.map((t) => [t.id, t.title])) as Record<ToolId, string>

// Kurze, überspringbare Tour für neue Nutzer — läuft einmal pro Konto direkt
// nach dem Onboarding auf der leeren Startseite (noch kein Fach gewählt).
const TOUR_STEPS: TourStep[] = [
  { target: 'sidebar', side: true, title: 'Deine Fächer & Chats', text: 'Links siehst du alle Fächer. Wähl eins aus, um deine bisherigen Chats zu sehen oder einen neuen zu starten.' },
  { target: 'subject-grid', title: 'Fach wählen', text: 'Oder klick direkt hier auf ein Fach — die KI kennt danach genau deinen Lehrplan dazu.' },
  { target: 'studio-panel', side: true, title: 'Dein Studio', text: 'Sobald du ein Fach gewählt hast, erscheint hier rechts dein Studio: Mit einem Klick erstellst du Lernkarten, ein Quiz, eine Mindmap oder eine Zusammenfassung aus euren Themen.' },
  { target: 'settings-btn', title: 'Profil & Einstellungen', text: 'Hier änderst du dein Profil, das Design und kannst einen Pro-Code einlösen.' },
  { target: null, title: 'Einfach drauflos chatten', text: 'Die KI im Chat kann das alles auch direkt: Schreib z. B. „Mach mir Lernkarten zu Photosynthese“ — sie erstellt sie sofort für dich, ganz ohne Klicks im Studio.' },
]

export default function ChatPage() {
  const router = useRouter()
  const { profile } = useAppStore()

  // ── Daten ──────────────────────────────────────────────────────────────────
  const [tree, setTree] = useState<SubjectTree>({})
  const [chats, setChats] = useState<ChatListItem[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [dueCards, setDueCards] = useState<DueCard[]>([])

  // ── Navigation ─────────────────────────────────────────────────────────────
  const [subject, setSubject] = useState<string | null>(null)
  const [view, setView] = useState<MainView>('home')
  const [activeSources, setActiveSources] = useState<string[]>([])
  const [mobileNav, setMobileNav] = useState(false)
  const [mobileStudio, setMobileStudio] = useState(false)

  // ── Modals ─────────────────────────────────────────────────────────────────
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [toolPrompt, setToolPrompt] = useState<ToolId | null>(null)
  const [summaryTopic, setSummaryTopic] = useState('')
  const [toolBusy, setToolBusy] = useState(false)
  const [viewer, setViewer] = useState<Project | null>(null)
  const [reviewOpen, setReviewOpen] = useState(false)
  const [shareState, setShareState] = useState<'idle' | 'copied'>('idle')
  const [tourOpen, setTourOpen] = useState(false)

  const stream = useChatStream()

  // ── Laden ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    refreshProfile().then((p) => {
      if (!p) { router.replace('/login'); return }
      if (!p.onboarded) router.replace('/onboarding')
    })
    fetch(api('/api/subjects')).then((r) => r.json()).then(setTree).catch(() => {})
    refreshDue()
  }, [router])

  // Einmalige Tour pro Konto — startet auf der leeren Startseite (kein Fach
  // gewählt), z.B. direkt nach dem Onboarding. Merker liegt in localStorage,
  // damit sie bei jedem weiteren Login nicht erneut aufploppt.
  useEffect(() => {
    if (!profile?.id || !profile.onboarded || subject) return
    const key = `lgki-tour-${profile.id}`
    if (localStorage.getItem(key)) return
    const t = setTimeout(() => setTourOpen(true), 600)
    return () => clearTimeout(t)
  }, [profile?.id, profile?.onboarded, subject])

  function finishTour() {
    if (profile?.id) localStorage.setItem(`lgki-tour-${profile.id}`, '1')
    setTourOpen(false)
  }

  const refreshChats = useCallback((subj: string) => {
    fetch(api(`/api/chats?subject=${encodeURIComponent(subj)}`)).then((r) => r.json())
      .then((rows) => Array.isArray(rows) && setChats(rows)).catch(() => {})
  }, [])
  const refreshProjects = useCallback((subj: string) => {
    fetch(api(`/api/projects?subject=${encodeURIComponent(subj)}`)).then((r) => r.json())
      .then((rows) => Array.isArray(rows) && setProjects(rows)).catch(() => {})
  }, [])
  function refreshDue() {
    fetch(api('/api/srs')).then((r) => r.json()).then((d) => d.due && setDueCards(d.due)).catch(() => {})
  }

  // ── Fach / Chats ───────────────────────────────────────────────────────────
  const topics: PickerTopic[] = useMemo(() => {
    if (!subject) return []
    return Object.entries(tree[subject] ?? {}).flatMap(([year, ts]) =>
      Object.entries(ts).map(([label, slug]) => ({ slug, label, year })))
  }, [subject, tree])

  async function selectSubject(s: string) {
    setSubject(s)
    stream.reset()
    setMobileNav(false)
    setActiveSources([])
    refreshProjects(s)
    // Neu im Fach (noch keine Chats)? Dann direkt in die Themenwahl.
    const rows = await fetch(api(`/api/chats?subject=${encodeURIComponent(s)}`)).then((r) => r.json()).catch(() => [])
    const list = Array.isArray(rows) ? rows : []
    setChats(list)
    setView(list.length > 0 ? 'home' : 'picker')
  }

  function startNewChat() {
    const lastSources = chats[0] ? activeSources : []
    setActiveSources(lastSources)
    setView('picker')
  }

  async function confirmPicker(slugs: string[]) {
    if (!subject) return
    setActiveSources(slugs)
    const res = await fetch(api('/api/chats'), {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, sources: slugs }),
    })
    const { id } = await res.json()
    stream.reset()
    stream.setChatId(id)
    setView('chat')
    refreshChats(subject)
  }

  async function openChat(id: string) {
    const res = await fetch(api(`/api/chats/${id}`))
    if (!res.ok) return
    const chat = await res.json()
    stream.reset(chat.messages.map((m: { role: 'user' | 'assistant'; content: string }) => ({ kind: m.role, text: m.content })))
    stream.setChatId(id)
    stream.setTitle(chat.title)
    setActiveSources(chat.sources)
    setView('chat')
    setMobileNav(false)
  }

  async function deleteChat(id: string) {
    await fetch(api(`/api/chats/${id}`), { method: 'DELETE' })
    if (subject) refreshChats(subject)
    if (stream.chatId === id) { stream.reset(); setView('home') }
  }

  function sendMessage(text: string) {
    if (!subject) return
    if (view !== 'chat') setView('chat')
    stream.send(text, { chatId: stream.chatId, subject, sources: activeSources })
    setTimeout(() => subject && refreshChats(subject), 1500)
  }

  // ── Aktionskarte (Server hat einen Studio-Werkzeug-Wunsch erkannt) ────────
  // Zusammenfassung braucht ohne Auto-Ausführen noch Niveau/Länge/Stil — dort
  // öffnet sich das Konfig-Modal. Alle anderen Werkzeuge generieren direkt,
  // das "Ja, erstellen" auf der Karte ist die einzige nötige Bestätigung.
  const onActionAccept = useCallback((tool: ToolId, topic: string, auto: boolean, original: string) => {
    if (tool === 'zusammenfassung' && !auto) {
      setSummaryTopic(topic)
      setToolPrompt('zusammenfassung')
      return
    }
    const cleanTopic = topic || subject || 'ausgewählte Themen'
    // Die Original-Chatformulierung geht als kurzer Kontext mit an den
    // Studio-Endpunkt — die eine KI "erklärt" der anderen kurz, was gemeint war.
    const prompt = original.trim() && original.trim() !== cleanTopic.trim()
      ? `${cleanTopic}\n\n(So wurde es im Chat gefragt: "${original.trim()}")`
      : cleanTopic
    generateTool(tool, prompt, undefined, { chatFeedback: true, label: cleanTopic })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject, activeSources])

  const onActionDecline = useCallback((original: string) => {
    if (!subject || !original) return
    stream.send(original, { chatId: stream.chatId, subject, sources: activeSources, skipAction: true, silent: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject, activeSources, stream.chatId, stream.send])

  async function shareChat() {
    if (!stream.chatId) return
    const res = await fetch(api('/api/share'), {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId: stream.chatId }),
    })
    const { id } = await res.json()
    const url = `${window.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/share/${id}`
    await navigator.clipboard.writeText(url).catch(() => {})
    setShareState('copied')
    setTimeout(() => setShareState('idle'), 1800)
  }

  // ── Studio ─────────────────────────────────────────────────────────────────
  // Schliesst das Konfig-Modal sofort (statt blockierend offen zu bleiben) und
  // zeigt den Fortschritt stattdessen als Platzhalter-Karte rechts im Studio
  // (rotierender Ring) — bei chatFeedback zusätzlich als Plan-Blase im Chat.
  async function generateTool(
    tool: ToolId, prompt: string, config?: SummaryConfigState,
    opts?: { chatFeedback?: boolean; label?: string },
  ) {
    if (!subject) return
    setToolPrompt(null)
    setSummaryTopic('')
    setToolBusy(true)

    const title = TOOL_TITLE[tool]
    const label = (opts?.label ?? prompt).slice(0, 60)
    const tempId = `pending-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    setProjects((prev) => [
      { id: tempId, subject, type: tool, name: `${title}: ${label}`, content: '', pinned: 0, created_at: new Date().toISOString(), pending: true },
      ...prev,
    ])
    const planId = tempId
    if (opts?.chatFeedback) {
      stream.setItems((prev) => [...prev, { kind: 'plan', id: planId, steps: [{ id: 's1', label: `Erstelle ${title} zu „${label}"…`, status: 'active' }] }])
    }
    const finishPlan = (status: 'done' | 'err') => {
      if (!opts?.chatFeedback) return
      stream.setItems((prev) => prev.map((it) => (it.kind === 'plan' && it.id === planId
        ? { ...it, steps: it.steps.map((s) => ({ ...s, status })) }
        : it)))
    }

    try {
      const res = await fetch(api(`/api/studio/${tool}`), {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, prompt, sources: activeSources, config }),
      })
      const data = await res.json()
      setProjects((prev) => prev.filter((p) => p.id !== tempId))
      if (!res.ok) { finishPlan('err'); alert(data.error ?? 'Fehler'); return }
      finishPlan('done')
      refreshProjects(subject)
      refreshDue()
      setViewer(data as Project)
    } catch {
      setProjects((prev) => prev.filter((p) => p.id !== tempId))
      finishPlan('err')
    } finally {
      setToolBusy(false)
    }
  }

  async function togglePin(p: Project) {
    await fetch(api(`/api/projects/${p.id}`), {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pinned: !p.pinned }),
    })
    if (subject) refreshProjects(subject)
  }

  async function deleteProject(p: Project) {
    await fetch(api(`/api/projects/${p.id}`), { method: 'DELETE' })
    if (subject) refreshProjects(subject)
  }

  // ── Viewer-Inhalte parsen (diskriminierte Union für sauberes Narrowing) ───
  type ViewerContent =
    | { kind: 'cards'; cards: { front: string; back: string }[] }
    | { kind: 'questions'; questions: QuizQuestion[] }
    | { kind: 'tree'; tree: MindmapNode }
    | { kind: 'markdown'; markdown: string }
    | { kind: 'podcast'; script: string; audioUrl: string | null }
  const viewerContent = useMemo((): ViewerContent | null => {
    if (!viewer) return null
    try {
      if (viewer.type === 'lernkarten') return { kind: 'cards', cards: JSON.parse(viewer.content) }
      if (viewer.type === 'quiz') return { kind: 'questions', questions: JSON.parse(viewer.content) }
      if (viewer.type === 'mindmap') return { kind: 'tree', tree: JSON.parse(viewer.content) }
      if (viewer.type === 'zusammenfassung') {
        try { const p = JSON.parse(viewer.content); return { kind: 'markdown', markdown: String(p.markdown ?? viewer.content) } }
        catch { return { kind: 'markdown', markdown: viewer.content } }
      }
      if (viewer.type === 'podcast') {
        const p = JSON.parse(viewer.content) as { script: string; audioPath: string | null }
        return { kind: 'podcast', script: p.script, audioUrl: p.audioPath ? api(`/api/audio/${viewer.id}`) : null }
      }
    } catch { return null }
    return null
  }, [viewer])

  const greeting = profile?.name ? `Hey ${profile.name.split(' ')[0]}` : 'Hey'

  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div style={{ height: '100dvh', display: 'flex', gap: 18, padding: 20, background: 'var(--parchment)', overflow: 'hidden' }}>
      <div className={mobileNav ? 'mobile-overlay' : 'desktop-only'} onClick={(e) => e.target === e.currentTarget && setMobileNav(false)}>
        <Sidebar
          subjects={Object.keys(tree)}
          mySubjects={null}
          selectedSubject={subject}
          chats={chats}
          activeChatId={stream.chatId}
          profile={profile}
          onSelectSubject={selectSubject}
          onBack={() => { setSubject(null); setView('home'); stream.reset() }}
          onOpenChat={openChat}
          onNewChat={startNewChat}
          onDeleteChat={deleteChat}
          onSettings={() => setSettingsOpen(true)}
        />
      </div>

      {/* ── Hauptfläche ── */}
      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Mobile Top-Bar */}
        <div className="mobile-only" style={{ gap: 8 }}>
          <button className="iconbtn glass" onClick={() => setMobileNav(true)} aria-label="Menü"><Menu size={17} /></button>
          <span style={{ flex: 1, alignSelf: 'center', fontWeight: 600, fontSize: 15, textAlign: 'center' }}>{subject ?? 'LG KI'}</span>
          <button className="iconbtn glass" onClick={() => setMobileStudio(true)} aria-label="Studio" disabled={!subject}><PanelRight size={17} /></button>
        </div>

        {profile && profile.verified === false && <VerifyBanner />}

        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ width: '100%', maxWidth: 760, margin: '0 auto', padding: '0 4px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            {view === 'picker' && subject && (
              <TopicPicker
                subject={subject} topics={topics} initial={activeSources}
                onConfirm={confirmPicker}
                onCancel={chats.length > 0 ? () => setView('home') : undefined}
              />
            )}

            {view === 'chat' && (
              <>
                {stream.title && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 0 0' }}>
                    <span className="t-caption" style={{ flex: 1, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{stream.title}</span>
                    <button className="btn btn-ghost btn-sm" onClick={shareChat}>
                      <Share2 size={13} /> {shareState === 'copied' ? 'Link kopiert!' : 'Teilen'}
                    </button>
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <Transcript items={stream.items} onActionAccept={onActionAccept} onActionDecline={onActionDecline} />
                </div>
              </>
            )}

            {view === 'home' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 18, padding: '40px 0' }}>
                {subject ? (
                  <>
                    <span style={{ fontSize: 40 }}>{subjectGlyph(subject)}</span>
                    <h1 className="t-display">{subject}</h1>
                    <p className="t-lead" style={{ maxWidth: 480 }}>
                      Stell eine Frage — ich lese zuerst deine gewählten Themen und antworte dann. Oder starte im Studio direkt Lernkarten, ein Quiz oder eine Zusammenfassung.
                    </p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <button className="btn btn-quiet btn-sm" onClick={startNewChat}>Neuer Chat mit Themenwahl</button>
                      <button className="btn btn-quiet btn-sm" onClick={() => setToolPrompt('zusammenfassung')}>Zusammenfassung erstellen</button>
                      {dueCards.length > 0 && <button className="btn btn-primary btn-sm" onClick={() => setReviewOpen(true)}>{dueCards.length} Karten wiederholen</button>}
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', textAlign: 'center' }}>
                      <h1 className="sr-only">{greeting} 👋</h1>
                      <ParticleTitle lines={[`${greeting} 👋`]} height="clamp(90px, 16vw, 150px)" />
                      <p className="t-lead" style={{ maxWidth: 460 }}>
                        {chats.length === 0 ? 'Womit fangen wir an? Wähl dein Fach — danach suchst du die Themen aus, die die KI kennen soll.' : 'Wähl dein Fach und leg los.'}
                        {dueCards.length > 0 ? ` Übrigens: ${dueCards.length} Lernkarten sind heute fällig.` : ''}
                      </p>
                      {dueCards.length > 0 && (
                        <button className="btn btn-primary" onClick={() => setReviewOpen(true)}>
                          Jetzt wiederholen
                        </button>
                      )}
                    </div>
                    {/* Fach-Grid im Hauptbereich — funktioniert auch mobil, wo die Sidebar zu ist */}
                    <div data-tour="subject-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
                      {Object.keys(tree).map((s) => (
                        <button
                          key={s} onClick={() => selectSubject(s)}
                          className="card"
                          style={{
                            padding: '16px 14px', cursor: 'pointer', font: 'inherit', textAlign: 'left',
                            display: 'flex', flexDirection: 'column', gap: 8,
                            transition: 'transform 150ms var(--spring), border-color 150ms ease',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'var(--accent)' }}
                          onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'var(--hairline)' }}
                        >
                          <span style={{
                            width: 34, height: 34, borderRadius: 10, background: 'var(--parchment)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 14, fontWeight: 600, color: 'var(--accent)',
                          }}>{subjectGlyph(s)}</span>
                          <span style={{ fontSize: 14, fontWeight: 600 }}>{s}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {subject && view !== 'picker' && (
          <div style={{ width: '100%', maxWidth: 760, margin: '0 auto', paddingBottom: 4 }}>
            <Composer
              onSend={sendMessage} busy={stream.busy}
              placeholder={`Frag mich etwas zu ${subject}…`}
            />
          </div>
        )}
      </main>

      <div className={mobileStudio ? 'mobile-overlay mobile-overlay-right' : 'desktop-only'} onClick={(e) => e.target === e.currentTarget && setMobileStudio(false)}>
        {subject ? (
          <StudioPanel
            projects={projects} dueCards={dueCards.length} tier={profile?.tier ?? 'free'}
            onLaunch={(t) => { setToolPrompt(t); setMobileStudio(false) }}
            onOpenProject={(p) => { setViewer(p); setMobileStudio(false) }}
            onReview={() => setReviewOpen(true)}
            onTogglePin={togglePin}
            onDeleteProject={deleteProject}
            onUpgrade={() => router.push('/pricing')}
          />
        ) : <div data-tour="studio-panel" style={{ width: 316 }} className="desktop-only" />}
      </div>

      {/* ── Modals ── */}
      {settingsOpen && profile && <SettingsSheet profile={profile} onClose={() => setSettingsOpen(false)} />}

      {toolPrompt === 'zusammenfassung' && (
        <SummaryConfigModal topic={summaryTopic} busy={toolBusy} onClose={() => { setToolPrompt(null); setSummaryTopic('') }}
          onGenerate={(p, cfg) => generateTool('zusammenfassung', p, cfg)} />
      )}
      {toolPrompt && toolPrompt !== 'zusammenfassung' && (
        <ToolPromptModal tool={toolPrompt} busy={toolBusy} hasContext={activeSources.length > 0} onClose={() => setToolPrompt(null)}
          onGenerate={(p) => generateTool(toolPrompt, p || subject || 'ausgewählte Themen')} />
      )}

      {viewer && viewerContent?.kind === 'cards' && (
        <FlashcardsModal projectId={viewer.id} name={viewer.name} cards={viewerContent.cards} tier={profile?.tier ?? 'free'} onClose={() => setViewer(null)} />
      )}
      {viewer && viewerContent?.kind === 'questions' && (
        <QuizModal projectId={viewer.id} name={viewer.name} questions={viewerContent.questions} tier={profile?.tier ?? 'free'} onClose={() => setViewer(null)} />
      )}
      {viewer && viewerContent?.kind === 'tree' && (
        <MindmapModal name={viewer.name} tree={viewerContent.tree} onClose={() => setViewer(null)} />
      )}
      {viewer && viewerContent?.kind === 'markdown' && (
        <SummaryViewModal projectId={viewer.id} name={viewer.name} markdown={viewerContent.markdown}
          tier={profile?.tier ?? 'free'} onClose={() => setViewer(null)} onUpgrade={() => router.push('/pricing')} />
      )}
      {viewer && viewerContent?.kind === 'podcast' && (
        <PodcastModal projectId={viewer.id} name={viewer.name} script={viewerContent.script} audioUrl={viewerContent.audioUrl} onClose={() => setViewer(null)} />
      )}

      {reviewOpen && <ReviewModal due={dueCards} onClose={() => setReviewOpen(false)} onFinished={refreshDue} />}

      {tourOpen && <TourOverlay steps={TOUR_STEPS} onDone={finishTour} />}
    </div>
  )
}

// ── E-Mail-Bestätigungs-Banner ────────────────────────────────────────────────
function VerifyBanner() {
  const [state, setState] = useState<'idle' | 'busy' | 'sent'>('idle')
  const [link, setLink] = useState<string | null>(null)

  async function resend() {
    setState('busy')
    const res = await fetch(api('/api/auth/resend'), { method: 'POST' })
    const data = await res.json().catch(() => ({}))
    if (data.verifyLink) setLink(data.verifyLink)
    setState('sent')
  }

  return (
    <div className="glass anim-in" style={{
      borderRadius: 14, padding: '10px 16px', display: 'flex', alignItems: 'center',
      gap: 12, flexWrap: 'wrap', fontSize: 13, boxShadow: 'var(--shadow-card)',
    }}>
      <span style={{ flex: 1, minWidth: 200 }}>
        {state === 'sent'
          ? (link
            ? <>Mail-Versand ist noch nicht eingerichtet — bestätige direkt hier: <a href={link} style={{ color: 'var(--accent)', fontWeight: 600 }}>E-Mail jetzt bestätigen</a></>
            : 'Bestätigungs-Mail ist unterwegs — schau in dein Postfach (auch Spam).')
          : '✉️ Bestätige noch deine E-Mail-Adresse, damit dein Konto (und dein Pro-Code) sicher an dich gebunden ist.'}
      </span>
      {state !== 'sent' && (
        <button className="btn btn-primary btn-sm" onClick={resend} disabled={state === 'busy'}>
          {state === 'busy' ? '…' : 'Mail senden'}
        </button>
      )}
    </div>
  )
}

// ── Kleines Prompt-Modal für Lernkarten/Quiz/Mindmap ──────────────────────────
function ToolPromptModal({ tool, busy, hasContext, onGenerate, onClose }: {
  tool: ToolId; busy: boolean; hasContext: boolean; onGenerate: (prompt: string) => void; onClose: () => void
}) {
  const [prompt, setPrompt] = useState('')
  const labels: Record<ToolId, { title: string; placeholder: string }> = {
    lernkarten: { title: 'Lernkarten erstellen', placeholder: 'z.B. Photosynthese — Licht- & Dunkelreaktion' },
    quiz: { title: 'Quiz erstellen', placeholder: 'z.B. Der Kalte Krieg 1947–1962' },
    mindmap: { title: 'Mindmap erstellen', placeholder: 'z.B. Die Zelle' },
    podcast: { title: 'Podcast erstellen', placeholder: 'z.B. Die Französische Revolution' },
    zusammenfassung: { title: '', placeholder: '' },
  }
  // Wenn schon Themen im Chat ausgewählt sind, weiss die KI, worum es geht —
  // dann ist das Feld nur noch für einen optionalen Zusatz-Wunsch da (Fokus, Schwierigkeit, Anzahl).
  const canSubmit = !busy && (prompt.trim() || hasContext)
  return (
    <Modal title={labels[tool].title} onClose={onClose}
      footer={
        <button className="btn btn-primary" style={{ width: '100%' }} disabled={!canSubmit} onClick={() => onGenerate(prompt.trim())}>
          {busy ? 'Wird erstellt…' : 'Erstellen'}
        </button>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <label className="fieldlabel">{hasContext ? 'Zusatz-Wunsch (optional)' : 'Thema'}</label>
        <input className="field" autoFocus value={prompt} onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && canSubmit && onGenerate(prompt.trim())}
          placeholder={hasContext ? 'z.B. Schwierigkeit, Fokus, Anzahl — sonst einfach leer lassen' : labels[tool].placeholder} />
        <p className="t-caption">
          {hasContext
            ? 'Die KI nutzt automatisch die Themen, die du im Chat ausgewählt hast — du musst hier nichts eintragen.'
            : 'Die KI nutzt zusätzlich die Themen, die du im Chat ausgewählt hast.'}
        </p>
        {tool === 'podcast' && (
          <p className="t-caption">Skript + Sprachausgabe brauchen echte Zeit — rechne mit rund 2 Minuten.</p>
        )}
      </div>
    </Modal>
  )
}
