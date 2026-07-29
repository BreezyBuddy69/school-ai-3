'use client'

import { useEffect, useState } from 'react'
import { Download, Printer } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { downloadWordExport } from '@/lib/utils'
import { escapeHtml, printAsPdf } from '@/lib/print'

// Zwei Modi: Üben (sofortiges Feedback) und Prüfungssimulation (Timer,
// Feedback erst am Ende, Liechtensteiner Note 1–6 in halben Noten).

export interface QuizQuestion { frage: string; a: string; b: string; c: string; d: string; correct: string }

function lgNote(score: number, max: number): string {
  const note = Math.round((5 * (score / max) + 1) * 2) / 2
  return note.toLocaleString('de-CH', { minimumFractionDigits: 1 })
}

export function QuizModal({ projectId, name, questions, tier, onClose }: {
  projectId: string; name: string; questions: QuizQuestion[]; tier: 'free' | 'pro' | 'premium'; onClose: () => void
}) {
  const [mode, setMode] = useState<'pick' | 'ueben' | 'pruefung'>('pick')
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [answers, setAnswers] = useState<(string | null)[]>([])
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [downloading, setDownloading] = useState(false)
  const canWord = tier === 'pro' || tier === 'premium'

  async function downloadWord() {
    setDownloading(true)
    await downloadWordExport(projectId, name)
    setDownloading(false)
  }

  const isExam = mode === 'pruefung'
  const q = questions[index]
  const opts: [string, string][] = q ? [['A', q.a], ['B', q.b], ['C', q.c], ['D', q.d]] : []

  useEffect(() => {
    if (!isExam || done) return
    const t = setInterval(() => setSecondsLeft((s) => {
      if (s <= 1) { setDone(true); return 0 }
      return s - 1
    }), 1000)
    return () => clearInterval(t)
  }, [isExam, done])

  function start(m: 'ueben' | 'pruefung') {
    setMode(m); setIndex(0); setSelected(null); setScore(0); setDone(false)
    setAnswers(Array(questions.length).fill(null))
    if (m === 'pruefung') setSecondsLeft(questions.length * 45)
  }

  function choose(key: string) {
    if (isExam) {
      setAnswers((a) => { const n = [...a]; n[index] = key; return n })
      if (index < questions.length - 1) setIndex((i) => i + 1)
      else setDone(true)
      return
    }
    if (selected) return
    setSelected(key)
    if (key === q.correct) setScore((s) => s + 1)
  }

  function next() {
    if (index < questions.length - 1) { setIndex((i) => i + 1); setSelected(null) }
    else setDone(true)
  }

  const examScore = answers.filter((a, i) => a === questions[i]?.correct).length
  const finalScore = isExam ? examScore : score
  const wrongIndices = questions.map((_, i) => i).filter((i) => (isExam ? answers[i] !== questions[i].correct : false))

  function printPdf() {
    const body = questions.map((q, i) => `
      <div style="margin-bottom:16px;">
        <p><strong>${i + 1}. ${escapeHtml(q.frage)}</strong></p>
        <p>A) ${escapeHtml(q.a)}<br/>B) ${escapeHtml(q.b)}<br/>C) ${escapeHtml(q.c)}<br/>D) ${escapeHtml(q.d)}</p>
        <p>Richtig: ${escapeHtml(q.correct)}</p>
      </div>`).join('')
    printAsPdf(name, `<h1>${escapeHtml(name)}</h1>${body}`)
  }

  if (mode === 'pick') {
    return (
      <Modal title={name} onClose={onClose}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button className="btn btn-quiet btn-sm" onClick={printPdf}><Printer size={14} /> PDF</button>
            {canWord && (
              <button className="btn btn-quiet btn-sm" onClick={downloadWord} disabled={downloading}>
                <Download size={14} /> {downloading ? 'Erstellt…' : 'Word'}
              </button>
            )}
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="card" onClick={() => start('ueben')} style={{ padding: '16px 18px', cursor: 'pointer', font: 'inherit', textAlign: 'left' }}>
            <span style={{ display: 'block', fontWeight: 600, fontSize: 15 }}>Üben</span>
            <span className="t-caption">Sofortiges Feedback nach jeder Frage — zum Lernen.</span>
          </button>
          <button className="card" onClick={() => start('pruefung')} style={{ padding: '16px 18px', cursor: 'pointer', font: 'inherit', textAlign: 'left', borderColor: 'var(--accent)' }}>
            <span style={{ display: 'block', fontWeight: 600, fontSize: 15 }}>Prüfungssimulation</span>
            <span className="t-caption">{questions.length} Fragen · {Math.round(questions.length * 45 / 60)} Min · Note am Ende — wie in echt.</span>
          </button>
        </div>
      </Modal>
    )
  }

  if (done) {
    return (
      <Modal title={isExam ? 'Prüfungsergebnis' : 'Ergebnis'} onClose={onClose}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 12, padding: '12px 0' }}>
          {isExam && (
            <div style={{
              alignSelf: 'center', width: 96, height: 96, borderRadius: '50%',
              background: examScore / questions.length >= 0.5 ? 'var(--accent)' : 'var(--err)',
              color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 30, fontWeight: 700, fontFamily: 'var(--font-display)' }}>{lgNote(examScore, questions.length)}</span>
              <span style={{ fontSize: 10, opacity: 0.8 }}>NOTE</span>
            </div>
          )}
          <span className="t-title">{finalScore} von {questions.length} richtig</span>
          <p className="t-caption">
            {finalScore === questions.length ? 'Perfekt — bereit für die Prüfung!' : finalScore >= questions.length / 2 ? 'Gut! Schau dir die Fehler nochmal an.' : 'Noch üben — wiederhol die Themen und probier es nochmal.'}
          </p>
          {isExam && wrongIndices.length > 0 && (
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 220, overflowY: 'auto' }}>
              <span className="t-micro">Deine Fehler</span>
              {wrongIndices.map((i) => (
                <div key={i} className="card" style={{ padding: '10px 14px' }}>
                  <span style={{ display: 'block', fontSize: 13, fontWeight: 600 }}>{questions[i].frage}</span>
                  <span className="t-caption">Richtig: {questions[i].correct} — {questions[i][questions[i].correct.toLowerCase() as 'a' | 'b' | 'c' | 'd']}</span>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 6 }}>
            <button className="btn btn-primary" onClick={() => setMode('pick')}>Nochmal</button>
            <button className="btn btn-quiet" onClick={onClose}>Schliessen</button>
          </div>
        </div>
      </Modal>
    )
  }

  return (
    <Modal title={name} onClose={onClose} wide
      footer={
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="t-caption">Frage {index + 1} / {questions.length}</span>
          <div style={{ flex: 1, height: 3, background: 'var(--hairline)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${((index + 1) / questions.length) * 100}%`, background: 'var(--accent)', borderRadius: 99, transition: 'width 200ms ease' }} />
          </div>
          {isExam && (
            <span className="t-caption" style={{ fontWeight: 600, color: secondsLeft < 60 ? 'var(--err)' : undefined }}>
              {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, '0')}
            </span>
          )}
          {!isExam && selected && (
            <button className="btn btn-primary btn-sm" onClick={next}>
              {index < questions.length - 1 ? 'Nächste Frage' : 'Ergebnis'}
            </button>
          )}
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <span style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.5, fontFamily: 'var(--font-display)' }}>{q.frage}</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {opts.map(([key, label]) => {
            const showState = !isExam && selected
            const isCorrect = key === q.correct
            const isChosen = key === selected
            return (
              <button
                key={key} onClick={() => choose(key)} disabled={!!(!isExam && selected)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '13px 15px', borderRadius: 13,
                  cursor: showState ? 'default' : 'pointer', font: 'inherit', textAlign: 'left',
                  border: `1px solid ${showState && isCorrect ? 'var(--ok)' : showState && isChosen ? 'var(--err)' : 'var(--hairline)'}`,
                  background: showState && isCorrect ? 'rgba(29,154,78,0.1)' : showState && isChosen ? 'rgba(208,52,44,0.08)' : 'var(--canvas)',
                  transition: 'all 150ms ease',
                }}
              >
                <span style={{
                  width: 26, height: 26, borderRadius: 8, flexShrink: 0, fontSize: 12, fontWeight: 700,
                  background: 'var(--parchment)', color: 'var(--ink-muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{key}</span>
                <span style={{ flex: 1, fontSize: 14 }}>{label}</span>
                {showState && isCorrect && <span style={{ color: 'var(--ok)' }}>✓</span>}
                {showState && isChosen && !isCorrect && <span style={{ color: 'var(--err)' }}>✗</span>}
              </button>
            )
          })}
        </div>
      </div>
    </Modal>
  )
}
