// Leitner-System, 5 Boxen. Richtig → Box +1, falsch → zurück in Box 1.
// Intervalle bewusst schul-tauglich (Prüfung in 2 Wochen, nicht in 6 Monaten).

export const BOX_INTERVALS_DAYS = [0, 1, 2, 4, 7, 14] // Index = Box (1–5)

export function nextDue(box: number, correct: boolean): { box: number; dueAt: string } {
  const newBox = correct ? Math.min(box + 1, 5) : 1
  const days = BOX_INTERVALS_DAYS[newBox]
  const due = new Date(Date.now() + days * 86400000)
  // Fällig ab Tagesbeginn, damit "heute fällig" stabil bleibt
  due.setHours(4, 0, 0, 0)
  return { box: newBox, dueAt: due.toISOString() }
}
