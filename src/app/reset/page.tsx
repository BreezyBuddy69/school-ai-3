'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Wordmark } from '@/components/ui/Logo'
import { refreshProfile } from '@/lib/store'
import { api } from '@/lib/utils'

function ResetForm() {
  const router = useRouter()
  const token = useSearchParams().get('token') ?? ''
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(api('/api/auth/reset'), {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Fehler'); return }
      await refreshProfile()
      router.push('/chat')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--parchment)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center' }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}><Wordmark size={34} /></Link>
        <div className="card anim-panel" style={{ width: '100%', padding: '28px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ textAlign: 'center' }}>
            <h1 className="t-title" style={{ fontSize: 22 }}>Neues Passwort</h1>
            <p className="t-caption" style={{ marginTop: 4 }}>Danach bist du direkt angemeldet.</p>
          </div>
          {token ? (
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div><label className="fieldlabel">Neues Passwort</label>
                <input className="field" type="password" required minLength={8} autoFocus value={password}
                  onChange={(e) => setPassword(e.target.value)} placeholder="Mindestens 8 Zeichen" /></div>
              {error && <p style={{ color: 'var(--err)', fontSize: 13 }}>{error}</p>}
              <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Moment…' : 'Passwort setzen'}</button>
            </form>
          ) : (
            <p className="t-caption" style={{ textAlign: 'center' }}>
              Kein Token im Link. Fordere auf der <Link href="/login" style={{ color: 'var(--accent)' }}>Anmeldeseite</Link> einen neuen Reset-Link an.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ResetPage() {
  return <Suspense><ResetForm /></Suspense>
}
