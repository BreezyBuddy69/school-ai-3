import Link from 'next/link'
import { Wordmark } from '@/components/ui/Logo'

export const metadata = { title: 'Impressum — LG KI' }

export default function ImpressumPage() {
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--canvas)' }}>
      <nav style={{ padding: '14px 20px', display: 'flex', justifyContent: 'center' }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}><Wordmark size={28} /></Link>
      </nav>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '20px 20px 100px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div>
          <span className="t-micro" style={{ color: 'var(--accent)' }}>Rechtliches</span>
          <h1 className="t-display" style={{ marginTop: 6, fontSize: 32 }}>Impressum</h1>
        </div>

        <section style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <h2 className="t-title" style={{ fontSize: 17 }}>Betreiber</h2>
          <p style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--ink-muted)' }}>
            LG KI ist ein privates Schülerprojekt, kein Unternehmen. Verantwortlich für Inhalt und
            Betrieb:
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.65 }}>
            Jayden Mikus<br />
            Schüler, 5Wa, Liechtensteinisches Gymnasium Vaduz<br />
            Erreichbar über das <Link href="/" style={{ color: 'var(--accent)' }}>Feedback-Feld in der App</Link> oder persönlich in der Schule, Raum 406 (grauer Block).
          </p>
        </section>

        <section style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <h2 className="t-title" style={{ fontSize: 17 }}>Hosting</h2>
          <p style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--ink-muted)' }}>
            Die App läuft als eigenständiger Docker-Container auf einem gemieteten VPS
            (halovisionai.cloud). Es gibt keine Werbung, kein Tracking durch Dritte und keinen
            Weiterverkauf von Daten — das Projekt finanziert sich ausschliesslich über die
            Pro-Codes, die in der Schule verkauft werden.
          </p>
        </section>

        <section style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <h2 className="t-title" style={{ fontSize: 17 }}>Haftungshinweis</h2>
          <p style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--ink-muted)' }}>
            LG KI ist ein Lernwerkzeug, keine offizielle Quelle des Liechtensteinischen Gymnasiums.
            KI-Antworten können Fehler enthalten — bei Unsicherheit gilt immer der Unterricht bzw.
            das, was die Lehrperson sagt. Für die Richtigkeit der von der KI generierten Inhalte
            wird keine Gewähr übernommen.
          </p>
        </section>

        <p className="t-caption">Siehe auch: <Link href="/datenschutz" style={{ color: 'var(--accent)' }}>Datenschutz</Link></p>
      </div>
    </div>
  )
}
