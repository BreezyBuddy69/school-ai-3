'use client'

import { useState } from 'react'
import { FileSpreadsheet, FileText, Printer } from 'lucide-react'
import { downloadExport } from '@/lib/utils'

// Eine Leiste für alle Viewer: PDF (drucken), Word, Excel. Vorher hatte jedes
// Modal seinen eigenen halben Satz Knöpfe — hier steht er einmal.

export function ExportBar({ projectId, filename, onPrint, excel = true, word = true, children }: {
  projectId: string
  filename: string
  onPrint?: () => void
  /** Excel gibt es nur für Werkzeuge mit Zeilen/Spalten (nicht Podcast). */
  excel?: boolean
  word?: boolean
  children?: React.ReactNode
}) {
  const [busy, setBusy] = useState<'word' | 'excel' | null>(null)

  async function go(format: 'word' | 'excel') {
    setBusy(format)
    const ok = await downloadExport(projectId, filename, format)
    setBusy(null)
    if (!ok) alert('Der Export hat nicht geklappt — probier es nochmal.')
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      {children}
      <div style={{ flex: 1 }} />
      {onPrint && <button className="btn btn-quiet btn-sm" onClick={onPrint}><Printer size={14} /> PDF</button>}
      {word && (
        <button className="btn btn-quiet btn-sm" onClick={() => go('word')} disabled={busy !== null}>
          <FileText size={14} /> {busy === 'word' ? 'Erstellt…' : 'Word'}
        </button>
      )}
      {excel && (
        <button className="btn btn-quiet btn-sm" onClick={() => go('excel')} disabled={busy !== null}>
          <FileSpreadsheet size={14} /> {busy === 'excel' ? 'Erstellt…' : 'Excel'}
        </button>
      )}
    </div>
  )
}
