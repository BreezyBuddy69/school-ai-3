'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Check, Moon, Sun } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { FeedbackWidget } from '@/components/FeedbackWidget'
import { useAppStore, refreshProfile, type Profile } from '@/lib/store'
import { api } from '@/lib/utils'

const PROFILES = [
  { id: 'lingua', name: 'Lingua' },
  { id: 'neue-sprachen', name: 'Neue Sprachen' },
  { id: 'kunst-musik-paedagogik', name: 'Kunst, Musik & Pädagogik' },
  { id: 'wirtschaft-recht', name: 'Wirtschaft & Recht' },
  { id: 'wirtschaft-recht-sport', name: 'W&R — Sportklasse' },
  { id: 'mathe-natur', name: 'Mathe & Naturwissenschaften' },
]

export function SettingsSheet({ profile, onClose }: { profile: Profile; onClose: () => void }) {
  const router = useRouter()
  const { theme, setTheme } = useAppStore()
  const [form, setForm] = useState({
    name: profile.name ?? '', klasse: profile.klasse ?? '',
    jahr: profile.jahr ?? 0, profil: profile.profil ?? '', personal: profile.personal ?? '',
    autoActions: profile.autoActions ?? false,
  })
  const [saved, setSaved] = useState(false)

  async function save() {
    await fetch(api('/api/auth/me'), {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, jahr: form.jahr || undefined }),
    })
    await refreshProfile()
    setSaved(true)
    setTimeout(() => setSaved(false), 1600)
  }

  async function logout() {
    await fetch(api('/api/auth/logout'), { method: 'POST' })
    useAppStore.getState().setProfile(null)
    router.push('/')
  }

  const isPaid = profile.tier !== 'free'

  return (
    <Modal title="Einstellungen" onClose={onClose}
      footer={
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost btn-sm" onClick={logout}>Abmelden</button>
          <span style={{ flex: 1 }} />
          <button className="btn btn-primary" onClick={save}>
            {saved ? <><Check size={15} /> Gespeichert</> : 'Speichern'}
          </button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="t-caption" style={{ flex: 1 }}>{profile.email}</span>
          <span className="t-caption" style={{
            padding: '3px 10px', borderRadius: 99, fontWeight: 600,
            background: isPaid ? 'var(--accent)' : 'var(--parchment)',
            color: isPaid ? '#fff' : 'var(--ink-muted)',
          }}>
            {profile.tier === 'free' ? 'Free' : profile.tier === 'pro' ? 'Pro' : 'Premium'}
          </span>
        </div>

        {!isPaid && (
          <Link href="pricing" className="btn btn-primary" style={{ textAlign: 'center' }}>
            Pro holen — ab CHF 25 fürs Schuljahr
          </Link>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div><label className="fieldlabel">Name</label><input className="field" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Vorname" /></div>
          <div><label className="fieldlabel">Klasse</label><input className="field" value={form.klasse} onChange={(e) => setForm((f) => ({ ...f, klasse: e.target.value }))} placeholder="z.B. 5Wa" /></div>
        </div>
        <div>
          <label className="fieldlabel">Schuljahr</label>
          <div style={{ display: 'flex', gap: 6 }}>
            {[1, 2, 3, 4, 5, 6, 7].map((j) => (
              <button key={j} onClick={() => setForm((f) => ({ ...f, jahr: j }))}
                className="btn btn-sm" style={{
                  flex: 1, background: form.jahr === j ? 'var(--accent)' : 'var(--parchment)',
                  color: form.jahr === j ? '#fff' : 'var(--ink-muted)', padding: '8px 0',
                }}>{j}</button>
            ))}
          </div>
        </div>
        {form.jahr >= 4 && (
          <div>
            <label className="fieldlabel">Profil (Oberstufe)</label>
            <select className="field" value={form.profil} onChange={(e) => setForm((f) => ({ ...f, profil: e.target.value }))}>
              <option value="">— wählen —</option>
              {PROFILES.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        )}
        <div>
          <label className="fieldlabel">Über dich (hilft der KI, passend zu erklären)</label>
          <textarea className="field" rows={2} value={form.personal} onChange={(e) => setForm((f) => ({ ...f, personal: e.target.value }))} placeholder="z.B. Ich lerne am besten mit Beispielen aus dem Sport." />
        </div>

        {isPaid && (
          <div>
            <label className="fieldlabel">Agentische Aktionen</label>
            <button className="btn btn-sm" onClick={() => setForm((f) => ({ ...f, autoActions: !f.autoActions }))}
              style={{
                width: '100%', justifyContent: 'space-between', display: 'flex',
                background: form.autoActions ? 'var(--accent)' : 'var(--parchment)',
                color: form.autoActions ? '#fff' : 'var(--ink-muted)',
              }}>
              <span>Aktionen automatisch ausführen (ohne Nachfrage)</span>
              <span style={{ fontWeight: 700 }}>{form.autoActions ? 'An' : 'Aus'}</span>
            </button>
            <p className="t-caption" style={{ marginTop: 6 }}>
              Erkennt die KI z.B. „mach mir eine Zusammenfassung", legt sie direkt los, statt erst zu fragen.
            </p>
          </div>
        )}

        <div>
          <label className="fieldlabel">Aussehen</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-sm" onClick={() => setTheme('light')}
              style={{ flex: 1, background: theme === 'light' ? 'var(--accent)' : 'var(--parchment)', color: theme === 'light' ? '#fff' : 'var(--ink-muted)' }}>
              <Sun size={14} /> Hell
            </button>
            <button className="btn btn-sm" onClick={() => setTheme('dark')}
              style={{ flex: 1, background: theme === 'dark' ? 'var(--accent)' : 'var(--parchment)', color: theme === 'dark' ? '#fff' : 'var(--ink-muted)' }}>
              <Moon size={14} /> Dunkel
            </button>
          </div>
        </div>

        <div>
          <label className="fieldlabel">Etwas stimmt nicht, oder eine Idee?</label>
          <FeedbackWidget variant="row" />
        </div>
      </div>
    </Modal>
  )
}
