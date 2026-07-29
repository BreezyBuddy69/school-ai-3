# LG KI 2.0 — Lab

Der KI-Lernassistent für Schüler:innen des Liechtensteinischen Gymnasiums
Vaduz — Apple-Grade-Rebuild von `school-ai/`. Alle 7 Schuljahre, alle
6 Profile, verkauft per Cash-Codes in der Schule.

Dies ist eine isolierte Kopie von `school-ai-2/` für Tests und
Weiterentwicklung: eigener Port (**8101** statt 8100), Demo-Modus (keine
Produktions-Secrets, keine echten Nutzerdaten), eigenständige `data/`.
Fertige Verbesserungen von hier zurück nach `school-ai-2/` übernehmen, wenn
sie sich bewährt haben.

## Was drin ist

- **Agentic Chat** — die KI liest sichtbar deine Schulthemen (Tool-Bubbles
  mit Status-Punkt, „Gedacht für Ns", Gooey-Denk-Loader), streamt die
  Antwort, rendert Markdown + LaTeX (KaTeX). Chats liegen serverseitig
  (SQLite) und syncen über Geräte.
- **Studio** — Lernkarten (Leitner-Boxen 1–5 mit täglicher Fälligkeits-
  Queue), Quiz (Üben + Prüfungssimulation mit Timer und Liechtensteiner
  Note), Mindmaps, Zusammenfassungen.
- **Word-Export (Pro)** — Zusammenfassung mit Konfigurator (Niveau / Länge /
  Stil / Extras) → formatiertes .docx: Deckblatt, Akzent-Callouts
  („Merke", „Achtung Prüfung"), Tabellen, Seitenzahlen. Premium: + Druck/PDF.
- **Sprachmodus (alle Tiers)** — Sable2-Hologramm-Bubble (Moving-Border-Ring,
  Kern pulsiert mit dem Mic-Pegel), Web Speech STT (de-CH) + TTS mit Barge-in.
  Läuft komplett im Browser → null Tokenkosten, darum auch in Free enthalten.
- **Tiers & Codes** — free/pro/premium, serverseitig erzwungen. Codes
  `LGKI-PRO-XXXX-XXXX` mit atomarer Einlösung (eine SQLite-Transaktion,
  Doppel-Einlösung strukturell unmöglich), Rate-Limit, Audit-Log.
  Premium-Codes gelten für 4 Accounts. Ablauf: Schuljahresende (15.8.).
- **Landing mit Live-Demo** — 3 anonyme Fragen ohne Konto, dann Signup-Gate.
- **Admin-Cockpit** (`/admin`, `ADMIN_TOKEN`) — Codes generieren/sperren,
  Nutzung, Feedback, Audit.
- **PWA** — installierbar auf dem Homescreen.

## Stack

Next.js 16 (App Router, standalone) · React 19 · Tailwind v4 ·
`node:sqlite` (null native Deps) · `docx` · KaTeX · Zustand.
KI läuft über n8n-Webhooks (Server→Server, Secret-Header) — Vertrag in
[N8N-CONTRACT.md](N8N-CONTRACT.md). Ohne `N8N_BASE`: **Demo-Modus**
(Mock-KI, Demo-Codes `LGKI-PRO-DEMO-0001` / `LGKI-PREM-DEMO-0001`).

## Los geht's (lokal)

```bash
npm install
npm run dev        # → http://localhost:8101  (Demo-Modus ohne N8N_BASE)
```

Node ≥ 22.13 (node:sqlite). Port ist in dieser Kopie **8101** (school-ai-2 bleibt auf 8100).

## Befehle

| Befehl | Zweck |
|---|---|
| `npm run dev` / `build` / `start` | Next.js (Port 8101) |
| `npm run codes [pro] [premium]` | Codes in DB + Druckbogen `data/codes-print.html` |
| `npm run scrape` | lg-vaduz.li-Curriculum → `data/curriculum/faecher.json` |
| `npm run backup` | SQLite-Backup nach `data/backups/` |
| `npm run smoke-test` | Automatisierter End-to-End-Check (Registrierung → Chat → Studio → Redeem → Admin), siehe `scripts/smoke-test.mjs` |
| `node scripts/import-onenote.mjs` | OneNote-Import (Gerüst, Phase 2) |

## Inhalte pflegen

Ein Thema = eine Markdown-Datei: `data/subjects/<Fach>/<Jahr|Kategorie>/<thema>.md`.
Datei reinlegen → nach ≤30 s überall verfügbar (Chat, Studio, Export).

## Deployment

Siehe [DEPLOY.md](DEPLOY.md) — Docker + Traefik auf halovisionai.cloud,
Port 8100, Volume `lgki_data` (heilig: enthält Nutzer, Codes, Chats).

## Design

[DESIGN.md](DESIGN.md) ist Gesetz: eine Akzentfarbe (#0071e3 / dark #2997ff),
Ink auf Weiss/Parchment, SF-Pro-Rampe mit negativem Letter-Spacing,
Pill-CTAs. App-Chrome: Liquid Glass (blur 28px, saturate 180%), Spring-Easing
`cubic-bezier(0.34, 1.4, 0.4, 1)`, animiert wird nur transform/opacity.
Hell + Dunkel, sonst nichts.

## Sicherheit (Kurzfassung)

- Tier-Checks **nur** serverseitig (`src/lib/tiers.ts`); der Client bekommt Ergebnisse, nie Regeln.
- n8n-URLs und Secrets existieren nur auf dem Server (`src/lib/n8n.ts`).
- Sessions: httpOnly-Cookie, Token nur als SHA-256-Hash in der DB; Passwörter scrypt.
- Code-Einlösung atomar + rate-limited (8/10min/IP) + zufällige Fehlversuch-Verzögerung + Audit mit tagesgesalzenen IP-Hashes.

---
Kontakt: Jayden Mikus · 5Wa · Raum 406 (grauer Block)
