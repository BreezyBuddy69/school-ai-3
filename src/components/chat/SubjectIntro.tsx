'use client'

import { subjectGlyph } from '@/lib/utils'
import { subjectWords } from '@/lib/subjectWords'
import { ParticleTitle } from '@/components/ui/ParticleTitle'
import { Typewriter } from '@/components/ui/Typewriter'

// Fach-Kopf: reaktiver Partikel-Titel + tippende Fach-Wörter — überall, wo
// ein Fachname als Headline steht (Fach-Startseite, leerer Chat nach der
// Themenwahl, TopicPicker) statt an einer Stelle statischem Text.
export function SubjectIntro({ subject, height = 'clamp(70px, 13vw, 120px)' }: { subject: string; height?: string }) {
  return (
    <>
      <span style={{ fontSize: 40 }}>{subjectGlyph(subject)}</span>
      <h1 className="sr-only">{subject}</h1>
      <ParticleTitle lines={[subject]} height={height} />
      <p className="t-caption anim-in" aria-hidden="true" style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
        <Typewriter words={subjectWords(subject)} />
      </p>
    </>
  )
}
