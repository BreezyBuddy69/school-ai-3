import Link from 'next/link'
import { Wordmark } from '@/components/ui/Logo'

export const metadata = { title: 'Datenschutz — LG KI' }

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <h2 className="t-title" style={{ fontSize: 17 }}>{title}</h2>
      <div style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--ink-muted)', display: 'flex', flexDirection: 'column', gap: 8 }}>{children}</div>
    </section>
  )
}

export default function DatenschutzPage() {
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--canvas)' }}>
      <nav style={{ padding: '14px 20px', display: 'flex', justifyContent: 'center' }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}><Wordmark size={28} /></Link>
      </nav>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '20px 20px 100px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div>
          <span className="t-micro" style={{ color: 'var(--accent)' }}>Rechtliches</span>
          <h1 className="t-display" style={{ marginTop: 6, fontSize: 32 }}>Datenschutz</h1>
          <p className="t-caption" style={{ marginTop: 8 }}>
            Kurz und ehrlich, ohne Juristendeutsch — geschrieben von der Person, die den Server auch
            selbst betreibt.
          </p>
        </div>

        <Section title="Was gespeichert wird">
          <p>Bei der Registrierung: deine E-Mail-Adresse und ein Passwort-Hash (nie das Passwort selbst — scrypt-gehasht, nicht rückrechenbar).</p>
          <p>Im Onboarding und in den Einstellungen, optional: Vorname, Klasse, Schuljahr, Profil und ein freiwilliger Hinweis, wie du am besten lernst.</p>
          <p>Deine Chats und alles, was du im Studio erstellst (Lernkarten, Quiz, Zusammenfassungen, Mindmaps), damit sie geräteübergreifend verfügbar bleiben.</p>
          <p>Feedback, das du über das Feedback-Feld schickst — mit deiner E-Mail, wenn du eingeloggt bist, sonst anonym.</p>
        </Section>

        <Section title="Wo es liegt">
          <p>
            Alles liegt in einer SQLite-Datenbank auf einem einzelnen, selbst gemieteten Server —
            keine Cloud-Analytics, kein Werbenetzwerk, kein Weiterverkauf an Dritte. Backups bleiben
            auf demselben Server.
          </p>
        </Section>

        <Section title="Die KI-Antworten">
          <p>
            Um deine Frage zu beantworten, schickt der Server den Text deiner Nachricht (plus die
            Lehrplan-Themen, die du ausgewählt hast) an ein KI-Backend zur Verarbeitung. Es gehen nur
            Text-Inhalte raus, keine Kontodaten wie Passwort oder Zahlungsinformationen — die gibt es
            hier ohnehin nicht, es wird bar bezahlt.
          </p>
          <p>
            Der Sprachmodus läuft technisch anders: Spracherkennung passiert direkt im Browser (Web
            Speech API) — rohe Audiodaten verlassen dein Gerät nie. Nur der bereits erkannte Text
            geht (wie eine normale Nachricht) zur Verarbeitung raus.
          </p>
        </Section>

        <Section title="Cookies & Logins">
          <p>
            Ein einziges httpOnly-Session-Cookie hält dich eingeloggt — kein Tracking-Cookie, kein
            Drittanbieter-Cookie. In der Datenbank steht dazu nur ein SHA-256-Hash des Tokens, nie
            das Cookie selbst.
          </p>
        </Section>

        <Section title="Sicherheits-Logs">
          <p>
            Bei der Code-Einlösung wird zur Missbrauchs-Erkennung ein kurzes Audit-Log geführt. IP-
            Adressen werden darin nie im Klartext gespeichert, sondern nur als täglich neu gesalzener
            Hash — am nächsten Tag lässt sich der Eintrag nicht mehr auf dieselbe IP zurückführen.
          </p>
        </Section>

        <Section title="Deine Rechte">
          <p>
            Du kannst jederzeit Auskunft über deine gespeicherten Daten verlangen oder dein Konto
            komplett löschen lassen — schreib es einfach ins Feedback-Feld oder sag es Jayden
            persönlich (Raum 406). Löschung passiert manuell, aber zuverlässig, meist innerhalb
            weniger Tage.
          </p>
        </Section>

        <p className="t-caption">Siehe auch: <Link href="/impressum" style={{ color: 'var(--accent)' }}>Impressum</Link></p>
      </div>
    </div>
  )
}
