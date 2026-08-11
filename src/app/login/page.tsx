'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Wordmark } from '@/components/ui/Logo'
import { refreshProfile } from '@/lib/store'
import { api } from '@/lib/utils'

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'verify-code'>(params.get('register') ? 'register' : 'login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [pendingEmail, setPendingEmail] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState(params.get('verify') === 'expired' ? 'Der Bestätigungslink ist abgelaufen — melde dich an, dann bekommst du beim nächsten Login-Versuch automatisch einen neuen Code.' : '')
  const [loading, setLoading] = useState(false)

  function resetHints() {
    setError('')
    setNotice('')
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'forgot') {
        await fetch(api('/api/auth/forgot'), {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.email }),
        })
        setNotice('Wenn die E-Mail existiert, ist ein Reset-Link unterwegs — schau in dein Postfach (auch Spam).')
        setMode('login')
        return
      }
      const res = await fetch(api(`/api/auth/${mode}`), {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        // Konto existiert, Passwort stimmt, aber E-Mail noch nicht bestätigt:
        // direkt zur Code-Eingabe statt nur eine Fehlermeldung zu zeigen.
        if (mode === 'login' && res.status === 403 && data.reason === 'unverified') {
          setPendingEmail(form.email)
          setNotice(data.error ?? 'Bitte bestätige zuerst deine E-Mail — wir haben dir einen Code geschickt.')
          setMode('verify-code')
          return
        }
        setError(data.error ?? 'Fehler')
        return
      }
      if (mode === 'register') {
        // Kein Auto-Login — erst der eingegebene Code (oder Mail-Link) zählt.
        setPendingEmail(form.email)
        setNotice(`Fast geschafft! Wir haben dir einen Bestätigungscode an ${form.email} geschickt.`)
        setMode('verify-code')
        setForm((f) => ({ ...f, password: '' }))
        return
      }
      const p = await refreshProfile()
      router.push(!p?.onboarded ? '/onboarding' : '/chat')
    } finally {
      setLoading(false)
    }
  }

  async function submitCode(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(api('/api/auth/verify-code'), {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: pendingEmail, code }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Fehler'); return }
      const p = await refreshProfile()
      router.push(!p?.onboarded ? '/onboarding' : '/chat')
    } finally {
      setLoading(false)
    }
  }

  async function resendCode() {
    resetHints()
    setLoading(true)
    try {
      const res = await fetch(api('/api/auth/resend-code'), {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: pendingEmail }),
      })
      await res.json().catch(() => ({}))
      setNotice('Neuer Code ist unterwegs — schau in dein Postfach (auch Spam).')
    } finally {
      setLoading(false)
    }
  }

  const titles: Record<typeof mode, string> = {
    login: 'Willkommen zurück',
    register: 'Konto erstellen',
    forgot: 'Passwort vergessen',
    'verify-code': 'Code eingeben',
  }
  const subtitles: Record<typeof mode, string> = {
    login: 'Weiterlernen, wo du aufgehört hast.',
    register: 'Kostenlos — 50 Fragen pro Tag, alle Fächer.',
    forgot: 'Wir schicken dir einen Link zum Zurücksetzen.',
    'verify-code': `Wir haben ${pendingEmail || 'dir'} einen 6-stelligen Code geschickt.`,
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--parchment)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center' }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}><Wordmark size={34} /></Link>
        <div className="card anim-panel" style={{ width: '100%', padding: '28px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ textAlign: 'center' }}>
            <h1 className="t-title" style={{ fontSize: 22 }}>{titles[mode]}</h1>
            <p className="t-caption" style={{ marginTop: 4 }}>{subtitles[mode]}</p>
          </div>
          {notice && <p style={{ fontSize: 13, color: 'var(--accent)', textAlign: 'center' }}>{notice}</p>}

          {mode === 'verify-code' ? (
            <form onSubmit={submitCode} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label className="fieldlabel">Code</label>
                <input
                  className="field" inputMode="numeric" pattern="\d{6}" maxLength={6} required autoFocus
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  style={{ letterSpacing: 4, textAlign: 'center', fontSize: 20 }}
                />
              </div>
              {error && <p style={{ color: 'var(--err)', fontSize: 13 }}>{error}</p>}
              <button className="btn btn-primary" type="submit" disabled={loading || code.length !== 6} style={{ marginTop: 4 }}>
                {loading ? 'Moment…' : 'Bestätigen'}
              </button>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => { resetHints(); setMode('login') }}>
                  Zurück
                </button>
                <button type="button" className="btn btn-ghost btn-sm" onClick={resendCode} disabled={loading}>
                  Code erneut senden
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {mode === 'register' && (
                <div><label className="fieldlabel">Vorname</label>
                  <input className="field" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Jayden" /></div>
              )}
              <div><label className="fieldlabel">E-Mail</label>
                <input className="field" type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="du@example.com" /></div>
              {mode !== 'forgot' && (
                <div><label className="fieldlabel">Passwort</label>
                  <input className="field" type="password" required minLength={8} value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} placeholder={mode === 'register' ? 'Mindestens 8 Zeichen' : '••••••••'} /></div>
              )}
              {error && <p style={{ color: 'var(--err)', fontSize: 13 }}>{error}</p>}
              <button className="btn btn-primary" type="submit" disabled={loading} style={{ marginTop: 4 }}>
                {loading ? 'Moment…' : mode === 'login' ? 'Anmelden' : mode === 'register' ? 'Kostenlos registrieren' : 'Reset-Link anfordern'}
              </button>
            </form>
          )}

          {mode === 'login' && (
            <button className="btn btn-ghost btn-sm" style={{ alignSelf: 'center' }} onClick={() => { setMode('forgot'); resetHints() }}>
              Passwort vergessen?
            </button>
          )}
        </div>
        {mode !== 'verify-code' && (
          <button className="btn btn-ghost btn-sm" onClick={() => { setMode((m) => m === 'login' ? 'register' : 'login'); resetHints() }}>
            {mode === 'login' ? 'Neu hier? Konto erstellen' : 'Schon ein Konto? Anmelden'}
          </button>
        )}
      </div>
    </div>
  )
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>
}
