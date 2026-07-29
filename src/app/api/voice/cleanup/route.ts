import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@/lib/auth'
import { callN8n } from '@/lib/n8n'
import { allow } from '@/lib/rate-limit'
import { hashIp } from '@/lib/db'

// Kurzer KI-Cleanup-Pass für diktierten Sprachmodus-Text (Wispr-Flow-Stil):
// Web Speech liefert den rohen Transkript-Text, hier wird er schnell mit
// einem günstigen/schnellen Modell bereinigt (Füllwörter, Interpunktion) —
// Bedeutung bleibt unverändert, Ergebnis landet im Composer-Textfeld.

const MAX_LEN = 4000

export async function POST(req: NextRequest) {
  const user = await currentUser()
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local'
  const key = user ? `voicecleanup:${user.id}` : `voicecleanup:${hashIp(ip)}`
  if (!allow(key, 20, 60_000)) {
    return NextResponse.json({ error: 'Kurz durchatmen — zu viele Diktate auf einmal.' }, { status: 429 })
  }

  const body = await req.json().catch(() => ({}))
  const text = String(body.text ?? '').trim().slice(0, MAX_LEN)
  if (!text) return NextResponse.json({ error: 'Kein Text' }, { status: 400 })

  const tier = user?.tier ?? 'free'
  try {
    const cleaned = await callN8n('voiceCleanup', tier, { text })
    return NextResponse.json({ text: cleaned.trim() || text })
  } catch {
    // Cleanup ist ein Komfort-Feature — bei Fehler lieber den Rohtext
    // zurückgeben als den Diktier-Flow ganz scheitern zu lassen.
    return NextResponse.json({ text })
  }
}
