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
      // Nur Ja/Nein, nie Werte: zeigt in einem curl, ob der Container die
      // Umgebungsvariablen überhaupt sieht. Ohne das endet jede Fehlersuche
      // beim Raten, ob das Panel-Deployment die Variablen durchgereicht hat.
      env: {
        secret: !!process.env.N8N_SECRET,
        base: !!process.env.N8N_BASE,
        admin: !!process.env.ADMIN_TOKEN,
      },
      time: new Date().toISOString(),
    })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 503 })
  }
}
