// OneNote-Import (Phase 2 — Gerüst mit dokumentiertem Flow).
//
// Ziel: Jaydens echte Unterrichtsnotizen → data/subjects/<Fach>/<Jahr>/<thema>.md
// im selben Format wie handgeschriebene Inhalte. Das ist der Burggraben:
// echte Notizen aus echten LG-Stunden, kein Internet-Allerlei.
//
// Geplanter Flow:
//   1. Export: OneNote-Seiten als .docx oder .html exportieren
//      (Datei → Exportieren, oder Microsoft Graph API /me/onenote/pages)
//   2. Ablegen in data/onenote-inbox/<Fach>/<Jahr>/*.{docx,html}
//   3. Dieses Skript schickt jede Datei an den n8n-Workflow
//      `lgki-onenote-summarize` (siehe N8N-CONTRACT.md), der daraus sauberes
//      Themen-Markdown macht (# Titel, ## Abschnitte, > Merke:-Callouts).
//   4. Ergebnis wird als <thema>.md nach data/subjects/ geschrieben —
//      ab dann für Chat, Studio und Word-Export nutzbar wie alles andere.
//
//   node scripts/import-onenote.mjs        → zeigt, was in der Inbox liegt

import { existsSync, mkdirSync, readdirSync } from 'node:fs'
import path from 'node:path'

const INBOX = path.join(process.cwd(), 'data', 'onenote-inbox')
mkdirSync(INBOX, { recursive: true })

if (!existsSync(INBOX) || readdirSync(INBOX).length === 0) {
  console.log(`OneNote-Inbox ist leer: ${INBOX}`)
  console.log('Lege exportierte OneNote-Dateien so ab:  data/onenote-inbox/<Fach>/<Jahr>/mein-thema.html')
  console.log('Der Verarbeitungs-Workflow ist in N8N-CONTRACT.md spezifiziert (lgki-onenote-summarize).')
  process.exit(0)
}

for (const fach of readdirSync(INBOX)) {
  const fachDir = path.join(INBOX, fach)
  for (const jahr of readdirSync(fachDir)) {
    for (const file of readdirSync(path.join(fachDir, jahr))) {
      console.log(`gefunden: ${fach}/${jahr}/${file} — Verarbeitung folgt, sobald der n8n-Workflow steht.`)
    }
  }
}
