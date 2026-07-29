'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Wordmark } from '@/components/ui/Logo'
import { refreshProfile } from '@/lib/store'
import { api } from '@/lib/utils'

// Onboarding: 3 leichte Schritte — Jahr, Profil (ab Jahr 4), Feinschliff.
// Danach filtert die ganze App auf genau deine Fächer und dein Niveau.

const PROFILES = [
  { id: 'lingua', name: 'Lingua', hint: 'Latein · Italienisch' },
  { id: 'neue-sprachen', name: 'Neue Sprachen', hint: 'Latein · Spanisch' },
  { id: 'kunst-musik-paedagogik', name: 'Kunst, Musik & Pädagogik', hint: 'Musik · BG · Pädagogik' },
  { id: 'wirtschaft-recht', name: 'Wirtschaft & Recht', hint: 'BWL · Recht · VWL' },
  { id: 'wirtschaft-recht-sport', name: 'W&R — Sportklasse', hint: 'Wie W&R, mit Sportfokus' },
  { id: 'mathe-natur', name: 'Mathe & Naturwissenschaften', hint: 'Mathe · Physik · Bio · Chemie' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [jahr, setJahr] = useState(0)
  const [profil, setProfil] = useState('')
  const [klasse, setKlasse] = useState('')
  const [personal, setPersonal] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => { refreshProfile().then((p) => { if (!p) router.replace('/login') }) }, [router])

  const needsProfile = jahr >= 4
  const steps = needsProfile ? 3 : 2

  async function finish() {
    setSaving(true)
    await fetch(api('/api/auth/me'), {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jahr, profil: needsProfile ? profil : '', klasse, personal }),
    })
    await refreshProfile()
    router.push('/chat')
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--parchment)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 520, display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center' }}>
        <Wordmark size={32} />
        <div style={{ display: 'flex', gap: 6 }}>
          {Array.from({ length: steps }, (_, i) => (
            <div key={i} style={{ width: i === step ? 22 : 7, height: 7, borderRadius: 99, background: i <= step ? 'var(--accent)' : 'var(--hairline)', transition: 'all 250ms var(--spring)' }} />
          ))}
        </div>

        <div className="card anim-panel" key={step} style={{ width: '100%', padding: '30px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {step === 0 && (
            <>
              <div><h1 className="t-title" style={{ fontSize: 22 }}>In welchem Schuljahr bist du?</h1>
                <p className="t-caption" style={{ marginTop: 4 }}>1–3 ist Unterstufe, 4–7 Oberstufe mit Profil.</p></div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 7 }}>
                {[1, 2, 3, 4, 5, 6, 7].map((j) => (
                  <button key={j} onClick={() => setJahr(j)}
                    style={{
                      aspectRatio: '1', borderRadius: 14, cursor: 'pointer', font: 'inherit', fontSize: 17, fontWeight: 600,
                      border: `1px solid ${jahr === j ? 'var(--accent)' : 'var(--hairline)'}`,
                      background: jahr === j ? 'var(--accent)' : 'var(--canvas)',
                      color: jahr === j ? '#fff' : 'var(--ink)',
                      transition: 'all 120ms ease',
                    }}>{j}</button>
                ))}
              </div>
              <button className="btn btn-primary" disabled={!jahr} onClick={() => setStep(1)}>Weiter</button>
            </>
          )}

          {step === 1 && needsProfile && (
            <>
              <div><h1 className="t-title" style={{ fontSize: 22 }}>Welches Profil hast du?</h1>
                <p className="t-caption" style={{ marginTop: 4 }}>Damit LG KI deine Profilfächer kennt.</p></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {PROFILES.map((p) => (
                  <button key={p.id} onClick={() => setProfil(p.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', borderRadius: 13,
                      cursor: 'pointer', font: 'inherit', textAlign: 'left',
                      border: `1px solid ${profil === p.id ? 'var(--accent)' : 'var(--hairline)'}`,
                      background: profil === p.id ? 'var(--accent-soft)' : 'var(--canvas)',
                      transition: 'all 120ms ease',
                    }}>
                    <span style={{ flex: 1 }}>
                      <span style={{ display: 'block', fontWeight: 600, fontSize: 14.5 }}>{p.name}</span>
                      <span className="t-caption">{p.hint}</span>
                    </span>
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-ghost" onClick={() => setStep(0)}>Zurück</button>
                <button className="btn btn-primary" style={{ flex: 1 }} disabled={!profil} onClick={() => setStep(2)}>Weiter</button>
              </div>
            </>
          )}

          {step === steps - 1 && (
            <>
              <div><h1 className="t-title" style={{ fontSize: 22 }}>Fast fertig.</h1>
                <p className="t-caption" style={{ marginTop: 4 }}>Beides optional — hilft aber, Antworten auf dich zuzuschneiden.</p></div>
              <div><label className="fieldlabel">Klasse</label>
                <input className="field" value={klasse} onChange={(e) => setKlasse(e.target.value)} placeholder="z.B. 5Wa" /></div>
              <div><label className="fieldlabel">Wie lernst du am besten?</label>
                <textarea className="field" rows={2} value={personal} onChange={(e) => setPersonal(e.target.value)} placeholder="z.B. Mit Beispielen aus Fussball und Gaming." /></div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-ghost" onClick={() => setStep(needsProfile ? 1 : 0)}>Zurück</button>
                <button className="btn btn-primary" style={{ flex: 1 }} disabled={saving} onClick={finish}>
                  {saving ? 'Moment…' : 'Los geht’s'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
