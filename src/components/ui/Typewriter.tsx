'use client'

import { useEffect, useState, type CSSProperties } from 'react'

// Tippt Wörter aus einer Liste Zeichen für Zeichen, löscht sie wieder (wie
// am Keyboard getippt) und geht zum nächsten über — für Fach-Wörter auf der
// Neuer-Chat-Seite und den Claude-Code-Loader-Status wiederverwendet.
export function Typewriter({ words, typeMs = 60, deleteMs = 32, holdMs = 1300, className, style }: {
  words: string[]
  typeMs?: number
  deleteMs?: number
  holdMs?: number
  className?: string
  style?: CSSProperties
}) {
  const [i, setI] = useState(0)
  const [len, setLen] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => setReduced(matchMedia('(prefers-reduced-motion: reduce)').matches), [])

  useEffect(() => {
    if (reduced || words.length === 0) return
    const word = words[i % words.length]
    if (!deleting && len === word.length) {
      const t = setTimeout(() => setDeleting(true), holdMs)
      return () => clearTimeout(t)
    }
    if (deleting && len === 0) {
      setDeleting(false)
      setI((n) => n + 1)
      return
    }
    const t = setTimeout(() => setLen((n) => n + (deleting ? -1 : 1)), deleting ? deleteMs : typeMs)
    return () => clearTimeout(t)
  }, [len, deleting, i, words, typeMs, deleteMs, holdMs, reduced])

  if (words.length === 0) return null
  const word = words[i % words.length]
  const shown = reduced ? word : word.slice(0, len)
  return (
    <span className={className} style={style}>
      {shown}
      {!reduced && <span className="tw-cursor" aria-hidden="true" />}
    </span>
  )
}
