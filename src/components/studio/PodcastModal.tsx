'use client'

import { useState } from 'react'
import { ChevronDown, Download, Printer } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Markdown } from '@/components/Markdown'
import { api } from '@/lib/utils'
import { escapeHtml, printAsPdf } from '@/lib/print'

export function PodcastModal({ projectId, name, script, audioUrl, onClose }: {
  projectId: string
  name: string
  script: string
  audioUrl: string | null
  onClose: () => void
}) {
  const [showScript, setShowScript] = useState(false)
  const title = name.replace(/^Podcast:\s*/i, '')

  function printPdf() {
    const body = script.split(/\n{2,}/).map((p) => `<p>${escapeHtml(p).replace(/\n/g, '<br/>')}</p>`).join('')
    printAsPdf(title, `<h1>${escapeHtml(title)}</h1>${body}`)
  }

  return (
    <Modal title={title} onClose={onClose} wide
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button className="btn btn-quiet btn-sm" onClick={printPdf}><Printer size={14} /> Skript als PDF</button>
          {audioUrl && (
            <a className="btn btn-quiet btn-sm" href={api(`/api/audio/${projectId}`)} download={`${title}.wav`}>
              <Download size={14} /> Audio herunterladen
            </a>
          )}
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {audioUrl ? (
          <audio controls style={{ width: '100%' }} src={audioUrl} />
        ) : (
          <p className="t-caption">Demo-Modus — kein echtes Audio generiert. Im Echtbetrieb liegt hier der Player.</p>
        )}
        <div>
          <button
            onClick={() => setShowScript((s) => !s)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, border: 'none', background: 'transparent',
              cursor: 'pointer', font: 'inherit', padding: '4px 0', color: 'var(--ink-muted)',
            }}
          >
            <ChevronDown size={13} style={{ transform: showScript ? 'none' : 'rotate(-90deg)', transition: 'transform 120ms ease' }} />
            <span className="t-caption" style={{ fontWeight: 600 }}>Skript {showScript ? 'ausblenden' : 'anzeigen'}</span>
          </button>
          {showScript && (
            <div style={{ marginTop: 8 }}>
              <Markdown>{script}</Markdown>
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
