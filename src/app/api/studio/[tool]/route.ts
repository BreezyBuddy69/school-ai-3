import { NextRequest, NextResponse, after } from 'next/server'
import { currentUser } from '@/lib/auth'
import { gateStudio, gatePodcast } from '@/lib/tiers'
import { allow } from '@/lib/rate-limit'
import { createStudioJob, runStudioJob, STUDIO_TOOLS, type StudioTool } from '@/lib/studio-job'

// Ein Endpunkt für alle Studio-Werkzeuge. Er prüft nur (Anmeldung, Tier-Gate,
// Rate-Limit), legt den Auftrag an und antwortet sofort — die eigentliche
// Arbeit läuft in after() weiter und überlebt damit jeden Browser-Wechsel.
// Ablauf und Begründung: src/lib/studio-job.ts.

export type { SummaryConfig } from '@/lib/summary'

export async function POST(req: NextRequest, { params }: { params: Promise<{ tool: string }> }) {
  const { tool } = await params
  if (!STUDIO_TOOLS.includes(tool as StudioTool)) return NextResponse.json({ error: 'Unbekanntes Werkzeug' }, { status: 404 })
  const user = await currentUser()
  if (!user) return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 })

  const gate = tool === 'podcast' ? gatePodcast(user.tier, user.id) : gateStudio(user.tier, user.id, tool)
  if (!gate.ok) return NextResponse.json({ error: gate.reason, upgrade: gate.upgrade }, { status: 402 })
  if (!allow(`studio:${user.id}`, 10, 60_000)) {
    return NextResponse.json({ error: 'Kurz durchatmen — zu viele Generierungen auf einmal.' }, { status: 429 })
  }

  const body = await req.json().catch(() => ({}))
  const subject = String(body.subject ?? '').slice(0, 80)
  const prompt = String(body.prompt ?? '').trim().slice(0, 2000)
  const sources: string[] = Array.isArray(body.sources) ? body.sources.slice(0, 12) : []
  if (!subject || !prompt) return NextResponse.json({ error: 'Fach oder Thema fehlt' }, { status: 400 })

  const jobParams = { tool: tool as StudioTool, subject, prompt, sources, config: body.config }
  const project = createStudioJob(user, jobParams)
  after(() => runStudioJob(user, project.id, jobParams))

  return NextResponse.json(project, { status: 202 })
}
