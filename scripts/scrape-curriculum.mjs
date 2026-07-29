// Curriculum-Scraper für lg-vaduz.li — höflich (1 Request/Sekunde, Cache).
//   node scripts/scrape-curriculum.mjs
// Ergebnis: data/curriculum/faecher.json (31 Fach-Seiten: Titel + Textinhalt)
//           data/raw/*.html (Roh-Cache, .gitignored)
// Die Lektionentafeln sind PDFs — deren URLs werden gesammelt und gelistet,
// geparst wird manuell/spaeter (data/curriculum/lektionentafeln.json als TODO).

import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs'
import path from 'node:path'

const BASE = 'https://www.lg-vaduz.li'
const RAW_DIR = path.join(process.cwd(), 'data', 'raw')
const OUT_DIR = path.join(process.cwd(), 'data', 'curriculum')
mkdirSync(RAW_DIR, { recursive: true })
mkdirSync(OUT_DIR, { recursive: true })

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function fetchCached(url, name) {
  const file = path.join(RAW_DIR, `${name}.html`)
  if (existsSync(file)) return readFileSync(file, 'utf-8')
  console.log(`  ↓ ${url}`)
  const res = await fetch(url, { headers: { 'User-Agent': 'LG-KI-Curriculum-Bot (Schülerprojekt, kontakt via lg-vaduz.li Sekretariat)' } })
  if (!res.ok) throw new Error(`${res.status} für ${url}`)
  const html = await res.text()
  writeFileSync(file, html)
  await sleep(1000)
  return html
}

function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '\n')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&auml;/g, 'ä').replace(/&ouml;/g, 'ö').replace(/&uuml;/g, 'ü').replace(/&szlig;/g, 'ss')
    .split('\n').map((l) => l.trim()).filter(Boolean).join('\n')
}

async function main() {
  console.log('1/3 Fächer-Übersicht…')
  const index = await fetchCached(`${BASE}/fach`, 'fach-index')

  // Alle /fach/<slug>-Links einsammeln (Seite nutzt absolute URLs)
  const slugs = [...new Set([...index.matchAll(/href="(?:https?:\/\/www\.lg-vaduz\.li)?\/fach\/([^"#?]+)"/g)].map((m) => m[1]))]
  console.log(`   ${slugs.length} Fächer gefunden`)

  console.log('2/3 Fach-Seiten…')
  const faecher = []
  for (const slug of slugs) {
    try {
      const html = await fetchCached(`${BASE}/fach/${slug}`, `fach-${slug.replace(/[^\w-]/g, '_')}`)
      const title = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, '').trim() ?? slug
      const isProfil = /profilfach/i.test(slug)
      // PDF-Links (Lehrplan-Dokumente) auf der Seite
      const pdfs = [...html.matchAll(/href="([^"]+\.pdf[^"]*)"/gi)].map((m) => m[1].startsWith('http') ? m[1] : BASE + m[1])
      faecher.push({ slug, title, typ: isProfil ? 'profilfach' : 'grundlagenfach', text: stripTags(html).slice(0, 4000), pdfs: [...new Set(pdfs)] })
      console.log(`   ✓ ${title}`)
    } catch (e) {
      console.log(`   ✗ ${slug}: ${e.message}`)
    }
  }
  writeFileSync(path.join(OUT_DIR, 'faecher.json'), JSON.stringify(faecher, null, 2))

  console.log('3/3 Lektionentafel-PDFs von der Lehrplan-Seite…')
  const lehrplan = await fetchCached(`${BASE}/informationen/lehrplan`, 'lehrplan')
  const tafelPdfs = [...new Set([...lehrplan.matchAll(/href="([^"]+)"/g)]
    .map((m) => m[1])
    .filter((u) => /download|\.pdf/i.test(u))
    .map((u) => (u.startsWith('http') ? u : BASE + u)))]
  writeFileSync(path.join(OUT_DIR, 'lektionentafeln.json'), JSON.stringify({
    hinweis: 'PDF-URLs der Lektionentafeln pro Profil — Wochenstunden manuell oder per PDF-Parser übertragen (TODO).',
    quellen: tafelPdfs,
  }, null, 2))

  console.log(`\n✓ Fertig: ${faecher.length} Fächer → data/curriculum/faecher.json`)
  console.log(`  ${tafelPdfs.length} Dokument-Links → data/curriculum/lektionentafeln.json`)
}

main().catch((e) => { console.error(e); process.exit(1) })
