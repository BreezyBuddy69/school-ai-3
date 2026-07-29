import Link from 'next/link'
import { Wordmark } from '@/components/ui/Logo'

export default function NotFound() {
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--parchment)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center', textAlign: 'center' }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}><Wordmark size={34} /></Link>
        <div className="card anim-panel" style={{ width: '100%', padding: '36px 26px', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          <span className="t-display" style={{ fontSize: 56 }}>404</span>
          <h1 className="t-title" style={{ fontSize: 20 }}>Diese Seite gibt's nicht.</h1>
          <p className="t-caption">Vielleicht ein alter Link, vielleicht ein Tippfehler — das Thema, das du suchst, findest du am ehesten im Chat.</p>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <Link href="/" className="btn btn-ghost btn-sm">Zur Startseite</Link>
            <Link href="/chat" className="btn btn-primary btn-sm">Zum Chat</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
