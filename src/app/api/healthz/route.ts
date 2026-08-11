import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { isDemoMode } from '@/lib/n8n'

export async function GET() {
  try {
    db().prepare('SELECT 1').get()
    return NextResponse.json({
      ok: true,
      version: '2.0.0',
      mode: isDemoMode() ? 'demo' : 'live',
      // Nur Ja/Nein, nie Werte. Für den Betrieb muss hier nichts true sein —
      // seit dem Wegfall der Secret-Prüfung am Mail-Knoten läuft die App ohne
      // jede Umgebungsvariable. Bleibt als Diagnose, falls doch mal eine gesetzt
      // wird und die Frage aufkommt, ob der Container sie sieht.
      env: {
        secret: !!process.env.N8N_SECRET,
        base: !!process.env.N8N_BASE,
        admin: !!process.env.ADMIN_TOKEN,
        demo: process.env.LGKI_DEMO === '1',
      },
      time: new Date().toISOString(),
    })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 503 })
  }
}
