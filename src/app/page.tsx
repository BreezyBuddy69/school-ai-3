'use client'

import Link from 'next/link'
import { FileText, GitBranch, GraduationCap, HelpCircle, Layers, Mic, Sparkles } from 'lucide-react'
import { Wordmark } from '@/components/ui/Logo'
import { ParticleTitle } from '@/components/ui/ParticleTitle'
import { Composer } from '@/components/chat/Composer'
import { Transcript } from '@/components/chat/Transcript'
import { useChatStream } from '@/components/chat/useChatStream'
import { Markdown } from '@/components/Markdown'
import { FeedbackWidget } from '@/components/FeedbackWidget'

// Landing nach DESIGN.md: alternierende Voll-Tiles, eine Akzentfarbe,
// Wert in 3 Sekunden lesbar. Der „Probier es"-Block ist echt — 3 anonyme
// Fragen laufen über denselben /api/chat-Endpunkt wie die App (Trial zeigt
// das gute Pro-Modell, siehe route.ts). Statische Vorschau-Bubbles darüber
// kosten keine Tokens — sie zeigen die Qualität, bevor jemand selbst tippt.

const PREVIEW: { q: string; a: string } = {
  q: 'Erklär mir Photosynthese in 3 Sätzen.',
  a: 'Pflanzen wandeln mit Chlorophyll Lichtenergie in chemische Energie um: Aus CO₂ und Wasser entstehen dabei Glucose und Sauerstoff. Das passiert in den Chloroplasten, in Licht- und Dunkelreaktion. Merk dir die Faustformel: **Licht rein, Zucker + O₂ raus.**\n\nSoll ich dir kurz zeigen, wie das im Detail auf Zellebene abläuft?',
}

function scrollToTryIt() {
  document.getElementById('try-it')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

export default function LandingPage() {
  const stream = useChatStream()

  return (
    <div style={{ background: 'var(--canvas)' }}>
      {/* ── Nav ── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, padding: '10px 16px' }}>
        <div className="glass" style={{ maxWidth: 980, margin: '0 auto', borderRadius: 999, padding: '9px 18px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: 'var(--shadow-card)' }}>
          <Wordmark size={26} />
          <span style={{ flex: 1 }} />
          <Link href="login" className="btn btn-ghost btn-sm">Anmelden</Link>
          <Link href="login?register=1" className="btn btn-primary btn-sm">Kostenlos starten</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="tile" style={{ textAlign: 'center', paddingTop: 72 }}>
        <div style={{ maxWidth: 780, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 22, alignItems: 'center' }}>
          <span className="t-micro" style={{ color: 'var(--accent)' }}>🇱🇮 Aus Vaduz, fürs LG Vaduz</span>
          <h1 className="sr-only">Bessere Noten. Weniger Stress.</h1>
          <ParticleTitle lines={['Bessere Noten.', 'Weniger Stress.']} />
          <p className="t-lead" style={{ maxWidth: 560 }}>
            LG KI kennt deine Fächer, deine Klasse und dein Profil — und erklärt dir alles so, wie du es brauchst. Gebaut von einem LG-Schüler, der genau weiss, was morgen im Test drankommt.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link href="login?register=1" className="btn btn-primary" style={{ padding: '13px 30px', fontSize: 16 }}>Kostenlos starten</Link>
            <Link href="pricing" className="btn btn-ghost" style={{ padding: '13px 24px', fontSize: 16 }}>Preise</Link>
          </div>
        </div>

        {/* Live ausprobieren — echte KI, 3 Fragen ohne Konto, gutes Modell zuerst */}
        <div id="try-it" style={{ maxWidth: 700, margin: '56px auto 0', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span className="t-micro" style={{ textAlign: 'center' }}>Probier es — direkt hier, ohne Konto</span>
          <div className="card" style={{ padding: '4px 20px', maxHeight: 420, overflowY: 'auto' }}>
            {stream.items.length > 0 ? (
              <Transcript items={stream.items} />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '20px 0 8px' }}>
                <span className="t-caption" style={{ alignSelf: 'center' }}>Beispiel — so klingt eine echte Antwort</span>
                <div className="msg user">{PREVIEW.q}</div>
                <div className="msg assistant"><Markdown>{PREVIEW.a}</Markdown></div>
              </div>
            )}
          </div>
          <Composer
            onSend={(t) => stream.send(t, { subject: 'Allgemein', sources: [] })}
            busy={stream.busy}
            placeholder="z.B. Erklär mir Photosynthese in 3 Sätzen…"
          />
        </div>
      </section>

      {/* ── Agentic: die KI zeigt ihre Arbeit ── */}
      <section className="tile tile-dark">
        <div style={{ maxWidth: 880, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 48, alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2 className="t-display">Sie behauptet nicht.<br />Sie zeigt es.</h2>
            <p className="t-lead">
              Bevor LG KI antwortet, liest sie sichtbar deine Schulthemen — du siehst jede Quelle, jeden Schritt, jede Denkpause. Kein Raten wie bei ChatGPT: deine Inhalte, dein Lehrplan.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }} aria-hidden>
            <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#34c759' }} />
              <span style={{ fontSize: 14 }}>📖</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Liest Thema</span>
              <span style={{ fontSize: 12, opacity: 0.6 }}>„Trigonometrie"</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#34c759' }} />
              <span style={{ fontSize: 14 }}>📖</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Liest Thema</span>
              <span style={{ fontSize: 12, opacity: 0.6 }}>„Gleichungen"</span>
            </div>
            <span style={{ fontSize: 11.5, fontStyle: 'italic', opacity: 0.55 }}>Gedacht für 3s</span>
            <div style={{ fontSize: 14, lineHeight: 1.6, opacity: 0.9 }}>
              Der Sinus beschreibt das Verhältnis von Gegenkathete zu Hypotenuse. In deiner 2.-Jahr-Einheit heisst das…
            </div>
          </div>
        </div>
      </section>

      {/* ── Studio ── */}
      <section className="tile tile-parchment">
        <div style={{ maxWidth: 880, margin: '0 auto', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 40 }}>
          <div>
            <h2 className="t-display">Ein Studio für alles, was vor der Prüfung kommt.</h2>
            <p className="t-lead" style={{ marginTop: 12 }}>Aus jedem Thema wird in Sekunden Lernmaterial.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, textAlign: 'left' }}>
            {[
              { Icon: Layers, t: 'Lernkarten', d: 'Mit Leitner-System — die App sagt dir, welche Karten heute fällig sind.' },
              { Icon: FileText, t: 'Zusammenfassungen', d: 'Du wählst Niveau, Länge und Stil — als schönes Word-Dokument exportierbar.' },
              { Icon: HelpCircle, t: 'Prüfungssimulator', d: 'Timer, keine Hilfe, Note am Ende. Wie in echt, nur ohne Konsequenzen.' },
              { Icon: GitBranch, t: 'Mindmaps', d: 'Zusammenhänge auf einen Blick — perfekt für visuelle Lerner.' },
            ].map(({ Icon, t, d }) => (
              <div key={t} className="card" style={{ padding: '22px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Icon size={20} style={{ color: 'var(--accent)' }} />
                <span style={{ fontWeight: 600, fontSize: 15 }}>{t}</span>
                <span className="t-caption" style={{ lineHeight: 1.5 }}>{d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Word-Export ── */}
      <section className="tile">
        <div style={{ maxWidth: 880, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 48, alignItems: 'center' }}>
          <div aria-hidden style={{ justifySelf: 'center', width: 260, aspectRatio: '210/297', background: '#fff', border: '1px solid var(--hairline)', borderRadius: 6, boxShadow: '0 24px 60px rgba(0,0,0,0.14)', padding: '36px 26px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ fontSize: 8, fontWeight: 700, color: '#c96442', letterSpacing: '0.1em' }}>MATHEMATIK</span>
            <span style={{ fontSize: 19, fontWeight: 700, color: '#1d1d1f', lineHeight: 1.2 }}>Trigonometrie</span>
            <span style={{ fontSize: 7.5, color: '#888' }}>Niveau: Matura · 5Wa · Liechtensteinisches Gymnasium</span>
            <div style={{ height: 5 }} />
            {[90, 100, 96, 70].map((w, i) => <div key={i} style={{ height: 4, width: `${w}%`, background: '#eee', borderRadius: 2 }} />)}
            <div style={{ borderLeft: '3px solid #c96442', background: '#f7e7de', borderRadius: '0 6px 6px 0', padding: '7px 9px', marginTop: 4 }}>
              <span style={{ fontSize: 6.5, fontWeight: 700, color: '#c96442' }}>MERKE</span>
              <div style={{ height: 3.5, width: '85%', background: '#ecc9b8', borderRadius: 2, marginTop: 4 }} />
            </div>
            {[100, 88].map((w, i) => <div key={i} style={{ height: 4, width: `${w}%`, background: '#eee', borderRadius: 2 }} />)}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2 className="t-display">Zusammenfassungen, die aussehen, als hättest du Stunden investiert.</h2>
            <p className="t-lead">
              Sag LG KI, wie gut du im Thema bist und wie ausführlich es sein soll — und lad ein fertig formatiertes Word-Dokument herunter: Deckblatt, Merkkästen, Tabellen, Seitenzahlen.
            </p>
            <span className="t-caption"><Sparkles size={13} style={{ verticalAlign: -2 }} /> Word-Export ist ein Pro-Feature</span>
          </div>
        </div>
      </section>

      {/* ── Sprachmodus ── */}
      <section className="tile tile-dark">
        <div style={{ maxWidth: 880, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 48, alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <span className="t-micro" style={{ color: '#d97757' }}>Für alle — kostenlos</span>
            <h2 className="t-display">Diktier deine Frage.</h2>
            <p className="t-lead">
              Kein Tippen auf dem Handy nötig: Mic antippen, drauflos reden, nochmal antippen — die KI räumt dein Gesprochenes automatisch auf (Füllwörter raus, Interpunktion rein), bevor du es abschickst.
            </p>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, opacity: 0.6 }}><Mic size={14} /> Läuft direkt im Textfeld, kein Extra-Fenster</span>
            <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }} onClick={scrollToTryIt}>
              <Mic size={16} /> Jetzt ausprobieren
            </button>
          </div>
          {/* .tile-dark ist immer dunkel (unabhängig vom Theme-Toggle) — die Pille
              bekommt deshalb feste dunkle Glas-Werte statt der Theme-Variablen. */}
          <div aria-hidden style={{ justifySelf: 'center', pointerEvents: 'none' }}>
            <div
              className="voice-pill"
              data-phase="listening"
              style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.14)' }}
            >
              <div className="voice-pill-bars">
                {[0, 1, 2, 3, 4].map((i) => <span key={i} className="voice-pill-bar" style={{ animationDelay: `${i * 0.08}s` }} />)}
              </div>
              <span className="voice-pill-label" style={{ color: 'rgba(255,255,255,0.7)' }}>Ich höre zu…</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Curriculum ── */}
      <section className="tile tile-parchment" style={{ textAlign: 'center' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
          <GraduationCap size={28} style={{ color: 'var(--accent)' }} />
          <h2 className="t-display">Alle 7 Jahre. Alle Profile. Dein Lehrplan.</h2>
          <p className="t-lead">
            Von der 1. Klasse bis zur Matura, von Lingua bis Mathe-Nawi: LG KI ist auf den Lehrplan des Liechtensteinischen Gymnasiums aufgebaut — nicht auf das Internet.
          </p>
          <span className="t-caption">Kuratiert von Jayden Mikus, 5Wa — echtem LG-Schüler, echte Unterrichtsnotizen.</span>
        </div>
      </section>

      {/* ── Persönliche Note: wer dahinter steckt ── */}
      <section className="tile tile-parchment">
        <div className="card" style={{ maxWidth: 680, margin: '0 auto', padding: '30px 30px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <span className="t-micro" style={{ color: 'var(--accent)' }}>Wer dahinter steckt</span>
          <h2 className="t-title" style={{ fontSize: 24 }}>Hoi, ich bin Jayden. 👋</h2>
          <p style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--ink-muted)' }}>
            Ich sitze in der 5Wa — wahrscheinlich ein paar Zimmer von dir entfernt. LG KI ist kein
            Startup aus dem Silicon Valley, sondern aus dem grauen Block: gebaut zwischen
            Hausaufgaben und Prüfungen, mit meinen echten Unterrichtsnotizen, für genau die Tests,
            die wir alle schreiben. Wenn etwas nicht stimmt oder ein Thema fehlt, sag es mir in
            der Pause — es ist am nächsten Tag drin.
          </p>
          <span className="t-caption">Jayden Mikus · 5Wa · LG Vaduz — du erreichst mich in der Schule oder über das Feedback-Feld in der App.</span>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="tile" style={{ textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center' }}>
          <h2 className="t-display">Kostenlos starten. Upgraden, wenn du mehr willst.</h2>
          <p className="t-lead">20 Nachrichten pro Tag gratis. Pro-Codes gibt es bei Jayden — Raum 406, grauer Block. Bar zahlen, Code eintippen, fertig.</p>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link href="login?register=1" className="btn btn-primary" style={{ padding: '13px 30px', fontSize: 16 }}>Konto erstellen</Link>
            <Link href="pricing" className="btn btn-ghost" style={{ padding: '13px 24px', fontSize: 16 }}>Code einlösen</Link>
          </div>
        </div>
      </section>

      <footer className="hairline-t" style={{ padding: '28px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
        <span className="t-caption">LG KI · von Schülern, für Schüler · Gebaut in Liechtenstein 🇱🇮 · Kontakt: Jayden Mikus, 5Wa, Raum 406</span>
        <span style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <FeedbackWidget />
          <span className="t-caption" style={{ opacity: 0.5 }}>·</span>
          <Link href="/impressum" className="t-caption">Impressum</Link>
          <span className="t-caption" style={{ opacity: 0.5 }}>·</span>
          <Link href="/datenschutz" className="t-caption">Datenschutz</Link>
        </span>
      </footer>
    </div>
  )
}
