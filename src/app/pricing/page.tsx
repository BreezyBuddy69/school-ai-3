'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, Ticket } from 'lucide-react'
import { Wordmark } from '@/components/ui/Logo'
import { useAppStore, refreshProfile } from '@/lib/store'
import { api } from '@/lib/utils'

// „Code einlösen" ist die primäre CTA — so kommen Kunden wirklich an
// (Code-Karte in der Hand, cash bezahlt). Danach erst die drei Karten.

const FREE = ['50 Nachrichten pro Tag', 'Alle Fächer & Themen', 'Sprachmodus — sprich mit deinem Tutor', 'Word-Export für Zusammenfassungen', '1 Studio-Generierung pro Tool/Tag', 'Lernkarten-Wiederholung (Leitner)']
const PRO = ['Unbegrenzte Nachrichten', 'Stärkere KI-Modelle', 'Unbegrenztes Studio', 'Podcast — gesprochene Zusammenfassung (3×/Tag)', 'Datei-Upload', 'Prüfungssimulator']

// Klassen-Deal: Pro für die ganze Klasse, Preis pro Person sinkt mit der Anzahl.
const CLASS_TIERS = [
  { min: 15, price: 15 },
  { min: 10, price: 18 },
  { min: 5, price: 20 },
  { min: 1, price: 25 },
]
function classPrice(n: number): number {
  return CLASS_TIERS.find((t) => n >= t.min)!.price
}

export default function PricingPage() {
  const { profile } = useAppStore()
  const [code, setCode] = useState('')
  const [state, setState] = useState<{ kind: 'idle' | 'busy' } | { kind: 'ok'; tier: string; bis: string } | { kind: 'err'; msg: string }>({ kind: 'idle' })

  async function redeem() {
    if (!code.trim()) return
    setState({ kind: 'busy' })
    const res = await fetch(api('/api/redeem'), {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: code.trim() }),
    })
    const data = await res.json()
    if (!res.ok) { setState({ kind: 'err', msg: data.error ?? 'Fehler' }); return }
    await refreshProfile()
    setState({ kind: 'ok', tier: data.tier, bis: data.bis })
  }

  function Card({ name, price, note, features, highlight }: { name: string; price: string; note: string; features: string[]; highlight?: boolean }) {
    return (
      <div className="card" style={{
        padding: '26px 24px', display: 'flex', flexDirection: 'column', gap: 16, position: 'relative',
        borderColor: highlight ? 'var(--accent)' : undefined,
        boxShadow: highlight ? '0 12px 40px rgba(201,100,66,0.22)' : undefined,
      }}>
        {highlight && (
          <span style={{ position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)', background: 'var(--accent)', color: '#fff', fontSize: 11, fontWeight: 600, padding: '3px 12px', borderRadius: 99 }}>
            Beliebt
          </span>
        )}
        <div>
          <span style={{ fontWeight: 600, fontSize: 15 }}>{name}</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 6 }}>
            <span className="t-display" style={{ fontSize: 34 }}>{price}</span>
            <span className="t-caption">{note}</span>
          </div>
        </div>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9, flex: 1 }}>
          {features.map((f) => (
            <li key={f} style={{ display: 'flex', gap: 9, fontSize: 13.5, alignItems: 'flex-start' }}>
              <Check size={15} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }} /> {f}
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--canvas)' }}>
      <nav style={{ padding: '14px 20px', display: 'flex', justifyContent: 'center' }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}><Wordmark size={28} /></Link>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '36px 20px 80px', display: 'flex', flexDirection: 'column', gap: 48 }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
          <h1 className="t-hero" style={{ fontSize: 'clamp(32px, 6vw, 52px)' }}>Lern smarter.</h1>
          <p className="t-lead" style={{ maxWidth: 460 }}>Kostenlos starten. Wenn du mehr willst: Codes gibt es in bar bei Jayden — Raum 406, grauer Block.</p>
        </div>

        {/* ── Code einlösen: die eigentliche Haupt-CTA ── */}
        <div className="card anim-panel" style={{ maxWidth: 520, width: '100%', margin: '0 auto', padding: '24px 24px', display: 'flex', flexDirection: 'column', gap: 12, borderColor: 'var(--accent)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Ticket size={18} style={{ color: 'var(--accent)' }} />
            <span style={{ fontWeight: 600, fontSize: 15 }}>Code einlösen</span>
          </div>
          {state.kind === 'ok' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <p style={{ fontSize: 14 }}>
                🎉 Aktiviert! Du bist jetzt <strong>{state.tier === 'premium' ? 'Premium' : 'Pro'}</strong> — gültig bis {new Date(state.bis).toLocaleDateString('de-CH')}.
              </p>
              <Link href="chat" className="btn btn-primary">Loslegen</Link>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', gap: 8 }}>
                <input className="field" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && redeem()}
                  placeholder="LGKI-PRO-XXXX-XXXX" style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }} />
                <button className="btn btn-primary" onClick={redeem} disabled={state.kind === 'busy' || !code.trim()}>
                  {state.kind === 'busy' ? '…' : 'Einlösen'}
                </button>
              </div>
              {state.kind === 'err' && <p style={{ color: 'var(--err)', fontSize: 13 }}>{state.msg}</p>}
              {!profile && <p className="t-caption">Du brauchst ein (kostenloses) Konto, um einen Code einzulösen — <Link href="login?register=1" style={{ color: 'var(--accent)' }}>hier erstellen</Link>.</p>}
            </>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, maxWidth: 620, margin: '0 auto', width: '100%' }}>
          <Card name="Free" price="CHF 0" note="für immer" features={FREE} />
          <Card name="Pro" price="CHF 25" note="pro Schuljahr" features={PRO} highlight />
        </div>

        <ClassDeal />

        <p className="t-caption" style={{ textAlign: 'center' }}>
          Kein Abo, keine Kreditkarte, keine versteckten Kosten. Ein Code gilt bis zum Ende des Schuljahres (15. August).
        </p>
      </div>
    </div>
  )
}

// ── Klassen-Deal: Anzahl wählen, Rabattstaffel live sehen ─────────────────────
function ClassDeal() {
  const [count, setCount] = useState(4)
  const price = classPrice(count)
  const total = price * count
  const saved = 25 * count - total

  return (
    <div className="card anim-panel" style={{ padding: '26px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontWeight: 600, fontSize: 15 }}>🎓 Für 4+ Personen — oder custom</span>
        <p className="t-caption" style={{ maxWidth: 560 }}>
          Ab 4 Leuten (WG, Lerngruppe, ganze Klasse) lohnt sich das mehr als Einzel-Pro — sammelt zusammen, einer holt die Codes bei Jayden ab. Andere Grösse? Einfach melden, das lässt sich immer custom lösen.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {CLASS_TIERS.slice().reverse().map((t, i, arr) => {
          const next = arr[i + 1]
          const label = next ? `${t.min}–${next.min - 1}` : `ab ${t.min}`
          const active = count >= t.min && (!next || count < next.min)
          return (
            <div key={t.min} style={{
              flex: '1 1 110px', borderRadius: 12, padding: '10px 12px', textAlign: 'center',
              border: '1px solid', borderColor: active ? 'var(--accent)' : 'var(--hairline)',
              background: active ? 'var(--accent)' : 'transparent', color: active ? '#fff' : 'inherit',
              transition: 'all 150ms ease',
            }}>
              <div style={{ fontSize: 12, opacity: 0.8 }}>{label} Personen</div>
              <div style={{ fontWeight: 700, fontSize: 17 }}>CHF {t.price}</div>
              <div style={{ fontSize: 11, opacity: 0.8 }}>pro Person</div>
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <label className="fieldlabel" style={{ margin: 0 }}>Wie viele seid ihr?</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="btn btn-quiet btn-sm" onClick={() => setCount((c) => Math.max(4, c - 1))} aria-label="Weniger">−</button>
          <input type="range" min={4} max={30} value={count} onChange={(e) => setCount(Number(e.target.value))} style={{ width: 160, accentColor: 'var(--accent)' }} />
          <button className="btn btn-quiet btn-sm" onClick={() => setCount((c) => Math.min(30, c + 1))} aria-label="Mehr">+</button>
          <span style={{ fontWeight: 700, fontSize: 16, minWidth: 28, textAlign: 'center' }}>{count}</span>
        </div>
        <span style={{ flex: 1 }} />
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 700, fontSize: 18 }}>CHF {total} <span className="t-caption" style={{ fontWeight: 400 }}>gesamt · CHF {price}/Person</span></div>
          {saved > 0 && <div className="t-caption" style={{ color: 'var(--accent)', fontWeight: 600 }}>Ihr spart CHF {saved} gegenüber Einzelpreis</div>}
        </div>
      </div>

      <p className="t-caption">
        So läuft&apos;s: Anzahl bei Jayden melden (Raum 406, grauer Block), bar zahlen, ihr bekommt einen Klassen-Code, den jede:r selbst einlöst.
      </p>
    </div>
  )
}
