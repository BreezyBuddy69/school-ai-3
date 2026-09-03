import { NextRequest, NextResponse } from 'next/server'
import { extractText, getDocumentProxy } from 'unpdf'
import { currentUser } from '@/lib/auth'
import { gateUpload } from '@/lib/tiers'
import { listUploads, saveUpload } from '@/lib/uploads'

// Eigene Dateien als Chat-Quelle: Pro-Feature (gateUpload), PDF/TXT/MD server-
// seitig zu Text extrahiert und in der DB gespeichert (siehe uploads.ts) —
// dieselbe Slug-Idee wie Curriculum-Themen ("upload:<id>" statt "Fach/Jahr/thema").

const MAX_BYTES = 15 * 1024 * 1024

export async function GET(req: NextRequest) {
  const user = await currentUser()
  if (!user) return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 })
  const subject = req.nextUrl.searchParams.get('subject') ?? ''
  return NextResponse.json(listUploads(user.id, subject))
}

export async function POST(req: NextRequest) {
  const user = await currentUser()
  if (!user) return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 })
  const gate = gateUpload(user.tier)
  if (!gate.ok) return NextResponse.json({ error: gate.reason, upgrade: gate.upgrade }, { status: 402 })

  const form = await req.formData().catch(() => null)
  const file = form?.get('file')
  const subject = String(form?.get('subject') ?? '').slice(0, 80)
  if (!(file instanceof File) || !subject) return NextResponse.json({ error: 'Datei oder Fach fehlt.' }, { status: 400 })
  if (file.size > MAX_BYTES) return NextResponse.json({ error: 'Datei zu gross (max. 15 MB).' }, { status: 400 })

  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
  let text: string
  try {
    const buf = new Uint8Array(await file.arrayBuffer())
    if (isPdf) {
      const pdf = await getDocumentProxy(buf)
      text = (await extractText(pdf, { mergePages: true })).text
    } else {
      text = Buffer.from(buf).toString('utf-8')
    }
  } catch {
    return NextResponse.json({ error: 'Datei konnte nicht gelesen werden.' }, { status: 400 })
  }
  text = text.trim()
  if (!text) return NextResponse.json({ error: 'Kein Text in der Datei gefunden.' }, { status: 400 })

  const row = saveUpload(user.id, subject, file.name.slice(0, 120), text)
  return NextResponse.json(row, { status: 201 })
}
