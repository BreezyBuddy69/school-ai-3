'use client'

import { useState } from 'react'
import { Wordmark } from '@/components/ui/Logo'
import { api } from '@/lib/utils'

// Jaydens Cockpit: Codes, Nutzer, Nutzung, Feedback, Audit. Bewusst schlicht —
// funktional, serverdaten-getrieben, Token-gated (ADMIN_TOKEN in .env).

interface AdminData {
  users: number
  byTier: { tier: string; n: number }[]
  messagesToday: number
  messages7d: number
  messagesByDay: { day: string; n: number }[]
  studio7d: { kind: string; n: number }[]
  codes: { tier: string; total: number; voll: number }[]
  codeList: { code: string; tier: string; redeemed_count: number; max_redemptions: number; revoked: number; created_at: string }[]
  redemptions: { code: string; redeemed_at: string; email: string }[]
  feedback: { id: number; email: string | null; text: string; created_at: string }[]
  audit: { ts: string; event: string; detail: string }[]
}

export default function AdminPage() {
  const [token, setToken] = useState('')
  const [data, setData] = useState<AdminData | null>(null)
  const [error, setError] = useState('')
  const [genCount, setGenCount] = useState(10)
  const [genTier, setGenTier] = useState<'pro' | 'premium'>('pro')
  const [genUses, setGenUses] = useState(0) // 0 = Standard (Pro 1×, Premium 4×)
  const [newCodes, setNewCodes] = useState<string[]>([])

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }

  async function load(t = token) {
    setError('')
    const res = await fetch(api('/api/admin'), { headers: { Authorization: `Bearer ${t}` } })
    if (!res.ok) { setError('Token falsch oder ADMIN_TOKEN nicht gesetzt.'); return }
    setData(await res.json())
  }

  async function generate() {
    const res = await fetch(api('/api/admin'), { method: 'POST', headers, body: JSON.stringify({ action: 'generate', tier: genTier, count: genCount, uses: genUses > 0 ? genUses : undefined }) })
    const d = await res.json()
    if (d.codes) { setNewCodes(d.codes); load() }
  }

  async function revoke(code: string) {
    await fetch(api('/api/admin'), { method: 'POST', headers, body: JSON.stringify({ action: 'revoke', code }) })
    load()
  }

  if (!data) {
    return (
      <div style={{ minHeight: '100dvh', background: 'var(--parchment)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div className="card" style={{ width: '100%', maxWidth: 380, padding: '28px 26px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Wordmark size={26} />
          <h1 className="t-title">Admin</h1>
          <input className="field" type="password" value={token} onChange={(e) => setToken(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && load()} placeholder="Admin-Token" />
          {error && <p style={{ color: 'var(--err)', fontSize: 13 }}>{error}</p>}
          <button className="btn btn-primary" onClick={() => load()}>Öffnen</button>
        </div>
      </div>
    )
  }

  const S = ({ label, value }: { label: string; value: string | number }) => (
    <div className="card" style={{ padding: '16px 18px', flex: 1, minWidth: 130 }}>
      <span className="t-display" style={{ fontSize: 28 }}>{value}</span>
      <span className="t-caption" style={{ display: 'block', marginTop: 2 }}>{label}</span>
    </div>
  )

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--parchment)', padding: '24px 18px 80px' }}>
      <div style={{ maxWidth: 920, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Wordmark size={26} />
          <span className="t-micro">Admin</span>
          <span style={{ flex: 1 }} />
          <button className="btn btn-quiet btn-sm" onClick={() => load()}>Aktualisieren</button>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <S label="Nutzer" value={data.users} />
          {data.byTier.map((t) => <S key={t.tier} label={t.tier} value={t.n} />)}
          <S label="Nachrichten heute" value={data.messagesToday} />
          <S label="Nachrichten 7 Tage" value={data.messages7d} />
        </div>

        <MessagesChart data={data.messagesByDay} />

        <div className="card" style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span className="t-title" style={{ fontSize: 16 }}>Codes generieren</span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <select className="field" style={{ width: 130 }} value={genTier} onChange={(e) => setGenTier(e.target.value as 'pro' | 'premium')}>
              <option value="pro">Pro</option><option value="premium">Premium</option>
            </select>
            <input className="field" type="number" min={1} max={100} style={{ width: 90 }} value={genCount} onChange={(e) => setGenCount(Number(e.target.value))} title="Anzahl Codes" />
            <label className="t-caption" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              Einlösungen/Code
              <input className="field" type="number" min={0} max={100} style={{ width: 80 }} value={genUses}
                onChange={(e) => setGenUses(Number(e.target.value))} placeholder="Std." title="0 = Standard (Pro 1×, Premium 4×). Für Klassen-Codes z.B. 20." />
            </label>
            <button className="btn btn-primary btn-sm" onClick={generate}>Generieren</button>
            <span className="t-caption">Druckbogen: <code>npm run codes</code> erzeugt data/codes-print.html</span>
          </div>
          {newCodes.length > 0 && (
            <pre style={{ background: 'var(--parchment)', borderRadius: 10, padding: 12, fontSize: 12, fontFamily: 'var(--font-mono)', maxHeight: 160, overflowY: 'auto' }}>
              {newCodes.join('\n')}
            </pre>
          )}
        </div>

        <div className="card" style={{ padding: '20px 22px' }}>
          <span className="t-title" style={{ fontSize: 16 }}>Codes ({data.codeList.length})</span>
          <div style={{ overflowX: 'auto', marginTop: 10 }}>
            <table style={{ width: '100%', fontSize: 12.5, borderCollapse: 'collapse' }}>
              <thead><tr>{['Code', 'Tier', 'Einlösungen', 'Status', ''].map((h) => <th key={h} style={{ textAlign: 'left', padding: '6px 8px', borderBottom: '1px solid var(--hairline)', fontSize: 11, color: 'var(--ink-muted)' }}>{h}</th>)}</tr></thead>
              <tbody>
                {data.codeList.map((c) => (
                  <tr key={c.code}>
                    <td style={{ padding: '6px 8px', fontFamily: 'var(--font-mono)' }}>{c.code}</td>
                    <td style={{ padding: '6px 8px' }}>{c.tier}</td>
                    <td style={{ padding: '6px 8px' }}>{c.redeemed_count}/{c.max_redemptions}</td>
                    <td style={{ padding: '6px 8px' }}>{c.revoked ? '🚫 gesperrt' : c.redeemed_count >= c.max_redemptions ? '✓ voll' : 'frei'}</td>
                    <td style={{ padding: '6px 8px' }}>
                      {!c.revoked && <button className="btn btn-ghost btn-sm" style={{ color: 'var(--err)', padding: '3px 10px' }} onClick={() => revoke(c.code)}>Sperren</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
          <div className="card" style={{ padding: '20px 22px' }}>
            <span className="t-title" style={{ fontSize: 16 }}>Letzte Einlösungen</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10, maxHeight: 260, overflowY: 'auto' }}>
              {data.redemptions.map((r, i) => (
                <span key={i} className="t-caption"><code style={{ fontFamily: 'var(--font-mono)' }}>{r.code}</code> → {r.email} · {r.redeemed_at}</span>
              ))}
              {data.redemptions.length === 0 && <span className="t-caption">Noch keine.</span>}
            </div>
          </div>
          <div className="card" style={{ padding: '20px 22px' }}>
            <span className="t-title" style={{ fontSize: 16 }}>Feedback</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10, maxHeight: 260, overflowY: 'auto' }}>
              {data.feedback.map((f) => (
                <div key={f.id} style={{ fontSize: 13 }}>
                  <span className="t-caption">{f.email ?? 'anonym'} · {f.created_at}</span>
                  <p>{f.text}</p>
                </div>
              ))}
              {data.feedback.length === 0 && <span className="t-caption">Noch keins.</span>}
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '20px 22px' }}>
          <span className="t-title" style={{ fontSize: 16 }}>Audit-Log</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 10, maxHeight: 300, overflowY: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11.5 }}>
            {data.audit.map((a, i) => <span key={i}>{a.ts} · {a.event} · {a.detail}</span>)}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Nachrichten der letzten 7 Tage — lückenlos aufgefüllt, damit auch
// tote Tage sichtbar sind (nicht nur die, an denen etwas passiert ist). ────
function MessagesChart({ data }: { data: { day: string; n: number }[] }) {
  const byDay = new Map(data.map((d) => [d.day, d.n]))
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const key = d.toISOString().slice(0, 10)
    return { key, label: d.toLocaleDateString('de-CH', { weekday: 'short' }), n: byDay.get(key) ?? 0 }
  })
  const max = Math.max(1, ...days.map((d) => d.n))

  return (
    <div className="card" style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <span className="t-title" style={{ fontSize: 16 }}>Nachrichten — letzte 7 Tage</span>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 120 }}>
        {days.map((d) => (
          <div key={d.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
            <span className="t-caption" style={{ fontSize: 11, fontWeight: 600 }}>{d.n}</span>
            <div
              title={`${d.n} Nachrichten`}
              style={{
                width: '100%', maxWidth: 34, borderRadius: '6px 6px 3px 3px',
                height: `${Math.max(4, (d.n / max) * 84)}px`,
                background: d.n > 0 ? 'var(--accent)' : 'var(--hairline)',
                transition: 'height 200ms var(--spring)',
              }}
            />
            <span className="t-caption" style={{ fontSize: 10.5, textTransform: 'capitalize' }}>{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
