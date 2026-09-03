'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { ExtraPills, OptionRow } from '@/components/studio/SummarySheet'
import { DEFAULT_PODCAST_CONFIG, DEFAULT_TABLE_CONFIG, PODCAST_MINUTES, type PodcastConfig, type TableConfig } from '@/lib/studio-config'

// Konfiguratoren für Podcast und Tabelle — gleicher Aufbau wie bei der
// Zusammenfassung (Optionen vor der Generierung), damit alle Werkzeuge sich
// gleich anfühlen. Die Optionen selbst leben in lib/studio-config.ts, weil der
// Server aus denselben Werten den Prompt baut.

const PODCAST_LAENGEN = [
  { id: 'kurz', label: 'Kurz', desc: `~${PODCAST_MINUTES.kurz} Min · schnell durch` },
  { id: 'standard', label: 'Standard', desc: `~${PODCAST_MINUTES.standard} Min · alles Wichtige` },
  { id: 'lang', label: 'Lang', desc: `~${PODCAST_MINUTES.lang} Min · Long Talk` },
] as const
const PODCAST_TIEFEN = [
  { id: 'ueberblick', label: 'Überblick', desc: 'Die grossen Linien' },
  { id: 'deep', label: 'Deep Talk', desc: 'Mechanismen & Details' },
  { id: 'pruefung', label: 'Prüfung', desc: 'Was drankommt' },
] as const
const PODCAST_TOENE = [
  { id: 'locker', label: 'Locker', desc: 'Wie Nachhilfe' },
  { id: 'sachlich', label: 'Sachlich', desc: 'Dicht & präzise' },
  { id: 'story', label: 'Story', desc: 'Als Erzählung' },
] as const
const PODCAST_EXTRAS = ['Alltagsbeispiele', 'Merksätze zum Mitschreiben', 'Häufige Fehler', 'Wiederholung am Schluss', 'Prüfungsfragen am Ende']

export function PodcastConfigModal({ topic, busy, hasContext, onGenerate, onClose }: {
  topic: string
  busy: boolean
  hasContext: boolean
  onGenerate: (prompt: string, config: PodcastConfig) => void
  onClose: () => void
}) {
  const [prompt, setPrompt] = useState(topic)
  const [cfg, setCfg] = useState<PodcastConfig>(DEFAULT_PODCAST_CONFIG)
  const canSubmit = !busy && (prompt.trim() || hasContext)

  return (
    <Modal title="Podcast erstellen" onClose={onClose}
      footer={
        <button className="btn btn-primary" style={{ width: '100%' }} disabled={!canSubmit}
          onClick={() => onGenerate(prompt.trim(), cfg)}>
          {busy ? 'Wird erstellt…' : 'Podcast erstellen'}
        </button>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div>
          <label className="fieldlabel">Thema</label>
          <input className="field" value={prompt} onChange={(e) => setPrompt(e.target.value)}
            placeholder={hasContext ? 'Leer lassen = eure gewählten Themen' : 'z.B. Die Französische Revolution'} />
        </div>
        <div>
          <label className="fieldlabel">Länge</label>
          <OptionRow options={PODCAST_LAENGEN} value={cfg.laenge} onChange={(laenge) => setCfg({ ...cfg, laenge })} />
        </div>
        <div>
          <label className="fieldlabel">Tiefe</label>
          <OptionRow options={PODCAST_TIEFEN} value={cfg.tiefe} onChange={(tiefe) => setCfg({ ...cfg, tiefe })} />
        </div>
        <div>
          <label className="fieldlabel">Ton</label>
          <OptionRow options={PODCAST_TOENE} value={cfg.ton} onChange={(ton) => setCfg({ ...cfg, ton })} />
        </div>
        <div>
          <label className="fieldlabel">Extras</label>
          <ExtraPills options={PODCAST_EXTRAS} value={cfg.extras} onChange={(extras) => setCfg({ ...cfg, extras })} />
        </div>
        <p className="t-caption">
          Skript und Stimme brauchen echte Zeit: rechne mit rund {cfg.laenge === 'lang' ? '4' : '2'} Minuten.
          Du kannst das Fenster zumachen, weiterlernen oder das Fach wechseln — der Podcast wird fertig gebaut
          und liegt danach im Studio.
        </p>
      </div>
    </Modal>
  )
}

const TABLE_ARTEN = [
  { id: 'vergleich', label: 'Vergleich', desc: 'Gegenüberstellung' },
  { id: 'begriffe', label: 'Begriffe', desc: 'Begriff · Definition' },
  { id: 'zeitstrahl', label: 'Zeittabelle', desc: 'Jahr · Ereignis' },
  { id: 'formeln', label: 'Formeln', desc: 'Formel · Anwendung' },
] as const
const TABLE_UMFAENGE = [
  { id: 'klein', label: 'Klein', desc: '6–8 Zeilen' },
  { id: 'mittel', label: 'Mittel', desc: '12–16 Zeilen' },
  { id: 'gross', label: 'Gross', desc: '20–30 Zeilen' },
] as const

export function TableConfigModal({ topic, busy, hasContext, onGenerate, onClose }: {
  topic: string
  busy: boolean
  hasContext: boolean
  onGenerate: (prompt: string, config: TableConfig) => void
  onClose: () => void
}) {
  const [prompt, setPrompt] = useState(topic)
  const [cfg, setCfg] = useState<TableConfig>(DEFAULT_TABLE_CONFIG)
  const canSubmit = !busy && (prompt.trim() || hasContext)

  return (
    <Modal title="Tabelle erstellen" onClose={onClose}
      footer={
        <button className="btn btn-primary" style={{ width: '100%' }} disabled={!canSubmit}
          onClick={() => onGenerate(prompt.trim(), cfg)}>
          {busy ? 'Wird erstellt…' : 'Tabelle erstellen'}
        </button>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div>
          <label className="fieldlabel">Thema</label>
          <input className="field" value={prompt} onChange={(e) => setPrompt(e.target.value)}
            placeholder={hasContext ? 'Leer lassen = eure gewählten Themen' : 'z.B. Die vier Bindungsarten'} />
        </div>
        <div>
          <label className="fieldlabel">Art</label>
          <OptionRow options={TABLE_ARTEN} value={cfg.art} onChange={(art) => setCfg({ ...cfg, art })} />
        </div>
        <div>
          <label className="fieldlabel">Umfang</label>
          <OptionRow options={TABLE_UMFAENGE} value={cfg.umfang} onChange={(umfang) => setCfg({ ...cfg, umfang })} />
        </div>
        <div>
          <label className="fieldlabel">Spalten (optional)</label>
          <input className="field" value={cfg.spalten} onChange={(e) => setCfg({ ...cfg, spalten: e.target.value })}
            placeholder="z.B. Bindungsart, Beteiligte Teilchen, Beispiel" />
          <p className="t-caption" style={{ marginTop: 6 }}>Leer lassen — dann wählt die KI passende Spalten.</p>
        </div>
      </div>
    </Modal>
  )
}
