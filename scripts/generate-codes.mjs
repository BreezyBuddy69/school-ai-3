// Codes generieren + druckbarer Kartenbogen für den Cash-Verkauf.
//   node scripts/generate-codes.mjs [proAnzahl] [premiumAnzahl]
// Schreibt direkt in die SQLite-DB und erzeugt zwei Dateien — einmal im
// Projekt (data/) und identisch nochmal in ~/Downloads, damit man sie ohne
// Repo-Zugriff wiederfindet:
//   - codes-print-<datum>.html  visitenkartengrosse Karten mit QR, zum
//     Ausdrucken/Ausschneiden/Verkaufen
//   - codes-print-<datum>.csv   flache Liste (Excel/Sheets) zum Abhaken beim
//     Verkauf — Codes verschwinden nach Einlösung automatisch aus der DB
//     (siehe src/app/api/redeem/route.ts), diese CSV ist der Erstbestand.
// Beide Dateien sind sensibel (echte, einlösbare Codes) — bewusst NICHT
// versioniert, siehe .gitignore.

import { DatabaseSync } from 'node:sqlite'
import { randomBytes } from 'node:crypto'
import { mkdirSync, writeFileSync, copyFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data')
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:8100'
const PRO_COUNT = parseInt(process.argv[2] ?? '10', 10)
const PREM_COUNT = parseInt(process.argv[3] ?? '5', 10)

mkdirSync(DATA_DIR, { recursive: true })
const db = new DatabaseSync(path.join(DATA_DIR, 'lgki.db'))
db.exec(`CREATE TABLE IF NOT EXISTS codes (
  code TEXT PRIMARY KEY, tier TEXT NOT NULL, max_redemptions INTEGER NOT NULL DEFAULT 1,
  redeemed_count INTEGER NOT NULL DEFAULT 0, revoked INTEGER NOT NULL DEFAULT 0,
  expires_at TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now'))
)`)

const part = () => randomBytes(2).toString('hex').toUpperCase()
const ins = db.prepare('INSERT INTO codes (code, tier, max_redemptions) VALUES (?, ?, ?)')

const codes = []
for (let i = 0; i < PRO_COUNT; i++) { const c = `LGKI-PRO-${part()}-${part()}`; ins.run(c, 'pro', 1); codes.push({ code: c, tier: 'Pro', price: 'CHF 25' }) }
for (let i = 0; i < PREM_COUNT; i++) { const c = `LGKI-PREM-${part()}-${part()}`; ins.run(c, 'premium', 4); codes.push({ code: c, tier: 'Premium', price: 'CHF 45' }) }

const redeemUrl = `${APP_URL}/pricing`

// QR ohne Dependency: qrserver.com nur im Druckbogen (wird beim Drucken geladen);
// fällt das aus, steht die URL im Klartext auf der Karte.
const card = (c) => `
  <div class="cardx ${c.tier === 'Premium' ? 'prem' : ''}">
    <div class="head"><span class="brand">LG&thinsp;KI</span><span class="tier">${c.tier}</span></div>
    <div class="code">${c.code}</div>
    <div class="foot">
      <div>
        <div class="hint">Einlösen auf</div>
        <div class="url">${redeemUrl.replace(/^https?:\/\//, '')}</div>
        <div class="price">${c.price} · gültig 1 Schuljahr${c.tier === 'Premium' ? ' · 4 Accounts' : ''}</div>
      </div>
      <img src="https://api.qrserver.com/v1/create-qr-code/?size=96x96&data=${encodeURIComponent(redeemUrl)}" width="48" height="48" alt="QR" />
    </div>
  </div>`

const html = `<!doctype html><html lang="de"><head><meta charset="utf-8"><title>LG KI — Code-Karten</title><style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, "Segoe UI", sans-serif; padding: 20px; background: #f5f5f7; }
  .sheet { display: grid; grid-template-columns: repeat(2, 85mm); gap: 6mm; }
  .cardx { width: 85mm; height: 54mm; background: #fff; border: 1px solid #ddd; border-radius: 3mm; padding: 6mm; display: flex; flex-direction: column; justify-content: space-between; break-inside: avoid; }
  .cardx.prem { background: #1d1d1f; color: #f5f5f7; border-color: #1d1d1f; }
  .head { display: flex; justify-content: space-between; align-items: baseline; }
  .brand { font-weight: 700; font-size: 14pt; letter-spacing: -0.02em; }
  .tier { font-size: 8pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #0071e3; }
  .prem .tier { color: #2997ff; }
  .code { font-family: "Cascadia Code", Consolas, monospace; font-size: 13pt; font-weight: 600; letter-spacing: 0.06em; text-align: center; padding: 3mm 0; border: 1.5px dashed #0071e3; border-radius: 2mm; }
  .foot { display: flex; justify-content: space-between; align-items: flex-end; gap: 4mm; }
  .hint { font-size: 6.5pt; color: #888; text-transform: uppercase; letter-spacing: 0.08em; }
  .url { font-size: 8.5pt; font-weight: 600; }
  .price { font-size: 7.5pt; color: #888; margin-top: 1mm; }
  @media print { body { background: #fff; padding: 0; } }
</style></head><body><div class="sheet">${codes.map(card).join('')}</div></body></html>`

// Flache Liste fürs Abhaken beim Verkauf. Semikolon statt Komma, damit
// Excel/Sheets mit deutschen Regionaleinstellungen die Datei per Doppelklick
// korrekt in Spalten öffnet (Komma gilt dort als Dezimaltrenner).
const csvHeader = 'Nr;Code;Tier;Preis (CHF);Gueltigkeit;Verkauft;Kaeufer/Notiz'
const csvRows = codes.map((c, i) => `${i + 1};${c.code};${c.tier};${c.price.replace('CHF ', '')};1 Schuljahr ab Einloesung;;`)
const csv = [csvHeader, ...csvRows].join('\r\n') + '\r\n'

const today = new Date().toISOString().slice(0, 10)
const htmlOut = path.join(DATA_DIR, `codes-print-${today}.html`)
const csvOut = path.join(DATA_DIR, `codes-print-${today}.csv`)
writeFileSync(htmlOut, html)
writeFileSync(csvOut, csv, { encoding: 'utf8' })

// Zweite Kopie in ~/Downloads — auch ohne Repo-Zugriff sofort auffindbar.
let downloadsHtml, downloadsCsv
try {
  const downloads = path.join(os.homedir(), 'Downloads')
  mkdirSync(downloads, { recursive: true })
  downloadsHtml = path.join(downloads, `LGKI-Codes-${today}.html`)
  downloadsCsv = path.join(downloads, `LGKI-Codes-${today}.csv`)
  copyFileSync(htmlOut, downloadsHtml)
  copyFileSync(csvOut, downloadsCsv)
} catch (e) {
  console.warn(`⚠ Konnte Kopie nicht nach ~/Downloads schreiben: ${e.message}`)
}

console.log(`\n✓ ${PRO_COUNT} Pro- + ${PREM_COUNT} Premium-Codes in der DB\n`)
for (const c of codes) console.log(`  ${c.code}  (${c.tier})`)
console.log(`\nDruckbogen:  ${htmlOut}`)
console.log(`Codeliste:   ${csvOut}`)
if (downloadsHtml) console.log(`\nKopie in Downloads:\n  ${downloadsHtml}\n  ${downloadsCsv}`)
console.log(`\n→ HTML im Browser öffnen, drucken, ausschneiden, verkaufen.\n→ CSV in Excel/Sheets öffnen, um verkaufte Codes abzuhaken.\n`)
