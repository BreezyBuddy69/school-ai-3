'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Download, Pause, Play, RotateCcw, RotateCw } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Markdown } from '@/components/Markdown'
import { ExportBar } from '@/components/studio/ExportBar'
import { api } from '@/lib/utils'
import { escapeHtml, printAsPdf } from '@/lib/print'

function clock(sec: number): string {
  if (!isFinite(sec) || sec < 0) return '–:––'
  const m = Math.floor(sec / 60)
  return `${m}:${String(Math.floor(sec % 60)).padStart(2, '0')}`
}

/**
 * Eigener Player statt `<audio controls>`: der native Player zeigt je nach
 * Browser keine Gesamtdauer und keinen greifbaren Zeiger. Die Gesamtdauer
 * kommt bevorzugt aus der Generierung (exakt aus der PCM-Länge gerechnet,
 * siehe studio-job.ts) und erst ersatzweise aus dem Audio-Element.
 */
function Player({ src, knownDuration }: { src: string; knownDuration: number | null }) {
  const audio = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(knownDuration ?? 0)
  const [rate, setRate] = useState(1)

  useEffect(() => {
    const el = audio.current
    if (!el) return
    const onTime = () => setTime(el.currentTime)
    const onMeta = () => { if (isFinite(el.duration) && el.duration > 0) setDuration(el.duration) }
    const onEnd = () => setPlaying(false)
    el.addEventListener('timeupdate', onTime)
    el.addEventListener('loadedmetadata', onMeta)
    el.addEventListener('durationchange', onMeta)
    el.addEventListener('ended', onEnd)
    return () => {
      el.removeEventListener('timeupdate', onTime)
      el.removeEventListener('loadedmetadata', onMeta)
      el.removeEventListener('durationchange', onMeta)
      el.removeEventListener('ended', onEnd)
    }
  }, [])

  function toggle() {
    const el = audio.current
    if (!el) return
    if (el.paused) { el.play(); setPlaying(true) } else { el.pause(); setPlaying(false) }
  }

  function skip(sec: number) {
    const el = audio.current
    if (!el) return
    el.currentTime = Math.min(Math.max(el.currentTime + sec, 0), duration || el.duration || 0)
    setTime(el.currentTime)
  }

  function seekFromEvent(e: React.PointerEvent<HTMLDivElement>) {
    const el = audio.current
    if (!el || !duration) return
    const box = e.currentTarget.getBoundingClientRect()
    const ratio = Math.min(Math.max((e.clientX - box.left) / box.width, 0), 1)
    el.currentTime = ratio * duration
    setTime(el.currentTime)
  }

  function cycleRate() {
    const next = { 1: 1.25, 1.25: 1.5, 1.5: 0.75, 0.75: 1 }[rate] ?? 1
    setRate(next)
    if (audio.current) audio.current.playbackRate = next
  }

  const pct = duration ? (time / duration) * 100 : 0

  return (
    <div className="card" style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <audio ref={audio} src={src} preload="metadata" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button className="iconbtn" onClick={() => skip(-15)} title="15 Sekunden zurück"><RotateCcw size={16} /></button>
        <button
          onClick={toggle}
          className="btn btn-primary"
          style={{ width: 46, height: 46, padding: 0, borderRadius: '50%', flex: 'none' }}
          aria-label={playing ? 'Pause' : 'Abspielen'}
        >
          {playing ? <Pause size={19} fill="currentColor" /> : <Play size={19} fill="currentColor" style={{ marginLeft: 2 }} />}
        </button>
        <button className="iconbtn" onClick={() => skip(15)} title="15 Sekunden vor"><RotateCw size={16} /></button>
        <span className="player-time">{clock(time)}</span>
        <div
          className="player-track"
          onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); seekFromEvent(e) }}
          onPointerMove={(e) => e.currentTarget.hasPointerCapture(e.pointerId) && seekFromEvent(e)}
          role="slider" aria-label="Position im Podcast"
          aria-valuemin={0} aria-valuemax={Math.round(duration)} aria-valuenow={Math.round(time)}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') skip(5)
            if (e.key === 'ArrowLeft') skip(-5)
            if (e.key === ' ') { e.preventDefault(); toggle() }
          }}
        >
          <div className="player-rail" />
          <div className="player-fill" style={{ width: `${pct}%` }} />
          <div className="player-thumb" style={{ left: `${pct}%` }} />
        </div>
        <span className="player-time">{clock(duration)}</span>
        <button className="btn btn-quiet btn-sm" onClick={cycleRate} style={{ padding: '4px 10px', minWidth: 46 }} title="Geschwindigkeit">
          {rate}×
        </button>
      </div>
    </div>
  )
}

export function PodcastModal({ projectId, name, script, audioUrl, durationSec, onClose }: {
  projectId: string
  name: string
  script: string
  audioUrl: string | null
  durationSec: number | null
  onClose: () => void
}) {
  const [showScript, setShowScript] = useState(true)
  const title = name.replace(/^Podcast:\s*/i, '')

  function printPdf() {
    const body = script.split(/\n{2,}/).map((p) => `<p>${escapeHtml(p).replace(/\n/g, '<br/>')}</p>`).join('')
    printAsPdf(title, `<h1>${escapeHtml(title)}</h1>${body}`)
  }

  return (
    <Modal title={title} onClose={onClose} wide focusable
      footer={
        <ExportBar projectId={projectId} filename={title} onPrint={printPdf} excel={false}>
          {audioUrl && (
            <a className="btn btn-quiet btn-sm" href={api(`/api/audio/${projectId}`)} download={`${title}.wav`}>
              <Download size={14} /> Audio
            </a>
          )}
        </ExportBar>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {audioUrl ? (
          <Player src={audioUrl} knownDuration={durationSec} />
        ) : (
          <p className="t-caption">Kein Audio vorhanden — hier steht nur das Skript.</p>
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
