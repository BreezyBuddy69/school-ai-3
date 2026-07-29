'use client'

import { useState } from 'react'
import { Download, Printer } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Markdown } from '@/components/Markdown'
import { downloadWordExport } from '@/lib/utils'
import { printAsPdf } from '@/lib/print'

// Das Flaggschiff: Konfigurator (Niveau/Länge/Stil/Extras) VOR der
// Generierung, danach Web-Ansicht + Word-Export (Pro) + Druck/PDF (Premium).

export interface SummaryConfigState {
  niveau: 'grundlagen' | 'solide' | 'matura'
  laenge: 'kompakt' | 'standard' | 'ausfuehrlich'
  stil: 'fliesstext' | 'stichpunkte' | 'lernskript'
  extras: string[]
}

const NIVEAUS = [
  { id: 'grundlagen', label: 'Grundlagen', desc: 'Erklärt von Null an' },
  { id: 'solide', label: 'Solide', desc: 'Zusammenhänge & Prüfungsfragen' },
  { id: 'matura', label: 'Matura', desc: 'Fachsprache & Transfer' },
] as const
const LAENGEN = [
  { id: 'kompakt', label: 'Kompakt', desc: '1–2 Seiten' },
  { id: 'standard', label: 'Standard', desc: '3–5 Seiten' },
  { id: 'ausfuehrlich', label: 'Ausführlich', desc: '6+ Seiten' },
] as const
const STILE = [
  { id: 'fliesstext', label: 'Fliesstext', desc: 'Zusammenhängender Text' },
  { id: 'stichpunkte', label: 'Stichpunkte', desc: 'Listen & Merkpunkte' },
  { id: 'lernskript', label: 'Lernskript', desc: 'Merksätze + Übungsfragen' },
] as const
const EXTRAS = ['Beispielaufgaben mit Lösungen', 'Begriffstabelle', 'Formelsammlung', 'Zeitstrahl', 'Eselsbrücken']

function OptionRow<T extends string>({ options, value, onChange }: {
  options: readonly { id: T; label: string; desc: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${options.length}, 1fr)`, gap: 8 }}>
      {options.map((o) => (
        <button
          key={o.id} onClick={() => onChange(o.id)}
          style={{
            padding: '11px 10px', borderRadius: 12, cursor: 'pointer', font: 'inherit', textAlign: 'center',
            border: `1px solid ${value === o.id ? 'var(--accent)' : 'var(--hairline)'}`,
            background: value === o.id ? 'var(--accent-soft)' : 'var(--canvas)',
            transition: 'all 120ms ease',
          }}
        >
          <span style={{ display: 'block', fontSize: 13, fontWeight: 600 }}>{o.label}</span>
          <span className="t-caption" style={{ fontSize: 10.5 }}>{o.desc}</span>
        </button>
      ))}
    </div>
  )
}

export function SummaryConfigModal({ topic, busy, onGenerate, onClose }: {
  topic: string
  busy: boolean
  onGenerate: (prompt: string, config: SummaryConfigState) => void
  onClose: () => void
}) {
  const [prompt, setPrompt] = useState(topic)
  const [niveau, setNiveau] = useState<SummaryConfigState['niveau']>('solide')
  const [laenge, setLaenge] = useState<SummaryConfigState['laenge']>('standard')
  const [stil, setStil] = useState<SummaryConfigState['stil']>('lernskript')
  const [extras, setExtras] = useState<string[]>([])

  return (
    <Modal title="Zusammenfassung erstellen" onClose={onClose}
      footer={
        <button className="btn btn-primary" style={{ width: '100%' }} disabled={busy || !prompt.trim()}
          onClick={() => onGenerate(prompt.trim(), { niveau, laenge, stil, extras })}>
          {busy ? 'Wird erstellt…' : 'Zusammenfassung erstellen'}
        </button>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div>
          <label className="fieldlabel">Thema</label>
          <input className="field" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="z.B. Trigonometrie — Sinus & Cosinus" />
        </div>
        <div>
          <label className="fieldlabel">Wie gut bist du in dem Thema?</label>
          <OptionRow options={NIVEAUS} value={niveau} onChange={setNiveau} />
        </div>
        <div>
          <label className="fieldlabel">Länge</label>
          <OptionRow options={LAENGEN} value={laenge} onChange={setLaenge} />
        </div>
        <div>
          <label className="fieldlabel">Stil</label>
          <OptionRow options={STILE} value={stil} onChange={setStil} />
        </div>
        <div>
          <label className="fieldlabel">Extras</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {EXTRAS.map((x) => {
              const on = extras.includes(x)
              return (
                <button key={x} onClick={() => setExtras((e) => on ? e.filter((v) => v !== x) : [...e, x])}
                  className="btn btn-sm"
                  style={{ background: on ? 'var(--accent)' : 'var(--parchment)', color: on ? '#fff' : 'var(--ink-muted)' }}>
                  {x}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </Modal>
  )
}

export function SummaryViewModal({ projectId, name, markdown, tier, onClose, onUpgrade }: {
  projectId: string
  name: string
  markdown: string
  tier: 'free' | 'pro' | 'premium'
  onClose: () => void
  onUpgrade: () => void
}) {
  const [downloading, setDownloading] = useState(false)
  const canWord = tier === 'pro' || tier === 'premium'

  async function downloadWord() {
    setDownloading(true)
    await downloadWordExport(projectId, name.replace(/^Zusammenfassung:\s*/i, ''))
    setDownloading(false)
  }

  function printPdf() {
    printAsPdf(name, document.getElementById(`summary-body-${projectId}`)?.innerHTML ?? '')
  }

  return (
    <Modal title={name.replace(/^Zusammenfassung:\s*/i, '')} onClose={onClose} wide
      footer={
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span className="t-caption" style={{ flex: 1 }}>
            {canWord ? 'Als schön formatiertes Word-Dokument speichern.' : 'Word-Export gibt es mit Pro.'}
          </span>
          <button className="btn btn-quiet btn-sm" onClick={printPdf}><Printer size={14} /> PDF</button>
          {canWord ? (
            <button className="btn btn-primary btn-sm" onClick={downloadWord} disabled={downloading}>
              <Download size={14} /> {downloading ? 'Erstellt…' : 'Word (.docx)'}
            </button>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={onUpgrade}><Download size={14} /> Pro holen</button>
          )}
        </div>
      }
    >
      <div id={`summary-body-${projectId}`}>
        <Markdown>{markdown}</Markdown>
      </div>
    </Modal>
  )
}
