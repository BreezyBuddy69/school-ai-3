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
      time: new Date().toISOString(),
    })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 503 })
  }
}
