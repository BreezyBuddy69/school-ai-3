// Automatisierter Rauchtest — deckt die manuelle "Checkliste vor dem ersten
// Verkauf" aus DEPLOY.md ab: Landing lädt, Registrierung → Verify → Onboarding
// → Chat → jedes Studio-Tool → Code-Einlösung → Admin. Läuft am schnellsten im
// Demo-Modus (kein N8N_BASE) gegen einen bereits laufenden `npm run dev`.
//
// Aufruf:  BASE_URL=http://localhost:8101 ADMIN_TOKEN=... node scripts/smoke-test.mjs
// Exit-Code 0 = alles grün, 1 = mindestens ein Check fehlgeschlagen (Details in stdout).

import { chromium } from 'playwright'

const BASE = process.env.BASE_URL ?? 'http://localhost:8101'
const ADMIN_TOKEN = process.env.ADMIN_TOKEN ?? ''

let failed = 0
function check(label, ok, detail = '') {
  console.log(`${ok ? '✓' : '✗'} ${label}${detail ? ` — ${detail}` : ''}`)
  if (!ok) failed++
}

async function main() {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  const consoleErrors = []
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()) })

  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' })
  check('Landing lädt', await page.locator('text=Kostenlos starten').count() > 0)

  const email = `smoke-${Date.now()}@example.com`
  await page.goto(`${BASE}/login?register=1`, { waitUntil: 'networkidle' })
  await page.fill('input[placeholder="Jayden"]', 'Smoke Test')
  await page.fill('input[type="email"]', email)
  await page.fill('input[type="password"]', 'testpassword123')
  await page.click('button[type="submit"]')
  await page.waitForTimeout(700)
  const codeMatch = (await page.textContent('body'))?.match(/Code\s+(\d{6})/)
  check('Registrierung sendet Verify-Code (Demo-Modus)', !!codeMatch)
  if (codeMatch) {
    await page.fill('input[inputmode="numeric"]', codeMatch[1])
    await page.click('button[type="submit"]')
    await page.waitForTimeout(800)
  }
  check('Nach Verify auf /onboarding', page.url().includes('/onboarding'))

  await page.locator('button:has-text("5")').first().click().catch(() => {})
  await page.locator('button.btn-primary:has-text("Weiter")').click().catch(() => {})
  await page.waitForTimeout(300)
  await page.locator('button:has-text("Mathe & Naturwissenschaften")').click().catch(() => {})
  await page.locator('button.btn-primary:has-text("Weiter")').click().catch(() => {})
  await page.waitForTimeout(300)
  await page.locator('button.btn-primary:has-text("Los")').click().catch(() => {})
  await page.waitForTimeout(800)
  check('Onboarding abgeschlossen, auf /chat', page.url().includes('/chat'))

  await page.locator('button:has-text("Überspringen")').first().click().catch(() => {})
  await page.waitForTimeout(200)
  const subjectBtn = page.locator('[data-tour="subject-grid"] button, main button.card').first()
  await subjectBtn.click().catch(() => {})
  await page.waitForTimeout(400)
  await page.locator('button:has-text("Ganzes Fach")').click().catch(() => {})
  await page.locator('button:has-text("Chat starten")').click().catch(() => {})
  await page.waitForTimeout(500)

  const composer = page.locator('textarea.composer-ta').first()
  await composer.fill('Test.').catch(() => {})
  await page.keyboard.press('Enter')
  await page.waitForTimeout(2500)
  check('Chat-Nachricht bekommt eine Antwort', await page.locator('.msg.assistant').count() > 0)

  for (const [tool, label] of [['lernkarten', 'Lernkarten'], ['quiz', 'Quiz'], ['mindmap', 'Mindmap']]) {
    await page.locator(`aside >> text=${label}`).first().click()
    await page.waitForTimeout(300)
    await page.locator('.card input.field, [role="dialog"] input.field').first().fill('Test').catch(() => {})
    await page.locator('button:has-text("Erstellen")').first().click()
    await page.waitForTimeout(2200)
    check(`Studio-Tool "${label}" generiert ein Ergebnis`, await page.locator('.card, [role="dialog"]').count() > 0)
    await page.keyboard.press('Escape').catch(() => {})
    await page.waitForTimeout(200)
  }

  await page.goto(`${BASE}/pricing`, { waitUntil: 'networkidle' })
  await page.fill('input.field[placeholder*="LGKI"]', 'LGKI-PRO-DEMO-0001')
  await page.click('button:has-text("Einlösen")')
  await page.waitForTimeout(800)
  check('Demo-Code-Einlösung schaltet Pro frei', (await page.textContent('body'))?.includes('Aktiviert') ?? false)

  if (ADMIN_TOKEN) {
    const res = await page.request.get(`${BASE}/api/admin`, { headers: { Authorization: `Bearer ${ADMIN_TOKEN}` } })
    check('Admin-API antwortet mit gültigem Token', res.ok())
  } else {
    console.log('… Admin-Check übersprungen (kein ADMIN_TOKEN gesetzt)')
  }

  check('Keine Browser-Konsolenfehler während des ganzen Laufs', consoleErrors.length === 0, consoleErrors.slice(0, 3).join(' | '))

  await browser.close()
  console.log(`\n${failed === 0 ? '✓ Alle Checks grün.' : `✗ ${failed} Check(s) fehlgeschlagen.`}`)
  process.exit(failed === 0 ? 0 : 1)
}

main().catch((e) => { console.error(e); process.exit(1) })
