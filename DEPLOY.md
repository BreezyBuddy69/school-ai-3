# DEPLOY — LG KI 2.0 auf dem Hostinger-VPS

Ziel: Docker-Container hinter dem bestehenden Traefik auf
`halovisionai.cloud`. **Port 8100** (belegt sind dort: 80, 8080, 8081,
8082, 8091 — 8100 kollidiert mit nichts).

## 1. DNS (einmalig)

A-Record `lgki.halovisionai.cloud` → `76.13.148.102` (Hostinger-Panel).
Subdomain, Next.js läuft ohne basePath (docker-compose.yml ist bereits
darauf eingestellt).

## 2. Image (GitHub Action baut, VPS zieht nur)

Jeder Push auf `master` baut via `.github/workflows/docker-publish.yml`
das Image `ghcr.io/breezybuddy69/school-ai-3:master`. Es ist öffentlich
ziehbar (geprüft 2026-08-04, wie hydron-one/halo4) — falls `docker compose
pull` je `unauthorized` sagt: GitHub → Packages → school-ai-3 → Package
settings → Visibility **public**.

Der VPS braucht nur `docker-compose.yml` + `.env`:

```bash
mkdir -p /opt/lgki && cd /opt/lgki
git clone https://github.com/BreezyBuddy69/school-ai-3.git .   # oder nur die 2 Dateien kopieren
```

## 3. Konfigurieren

```bash
cd /opt/lgki
cp .env.example .env && nano .env
```

Pflicht für den Echtbetrieb:

```env
N8N_BASE=https://n8n.halovisionai.cloud/webhook
N8N_SECRET=<langer zufallswert — denselben in n8n prüfen, siehe N8N-CONTRACT.md>
SESSION_SECRET=<openssl rand -hex 32>
ADMIN_TOKEN=<openssl rand -hex 24>
NEXT_PUBLIC_APP_URL=https://lgki.halovisionai.cloud
```

`NEXT_PUBLIC_APP_URL` steht zusätzlich als Build-Arg in der Action — Next
backt `NEXT_PUBLIC_*` beim Build ein, die `.env` allein reicht dafür nicht.
Bei Domainwechsel also **beide** Stellen ändern.

Ohne `.env` startet der Container im Demo-Modus — gut zum Testen, nicht
zum Verkaufen.

## 4. Ziehen & starten

```bash
docker compose pull                                # grüne CI ≠ live!
docker compose up -d
docker compose ps                                  # healthy?
docker compose exec lgki node -e "fetch('http://127.0.0.1:8100/api/healthz').then(r=>r.text()).then(console.log)"
curl -s https://lgki.halovisionai.cloud/api/healthz
```

Port 8100 ist bewusst **nicht** auf den Host gemappt — die VPS-Firewall
lässt eh nur 22/80/443 durch, alles läuft über Traefik im `traefik-proxy`-Netz.

## 5. Codes fürs Verkaufen

```bash
docker compose exec lgki node scripts/generate-codes.mjs 20 5
docker compose cp lgki:/data/codes-print.html ./codes-print.html
# → lokal öffnen, drucken, ausschneiden. Karten haben QR zur Redeem-Seite.
```

(Alternativ im Admin-Cockpit generieren: `https://…/admin` + ADMIN_TOKEN.)

## 6. Betrieb

| Was | Wie |
|---|---|
| Logs | `docker compose logs -f` |
| Update | Push auf `master` → Action abwarten → auf dem VPS `docker compose pull && docker compose up -d` |
| Backup | `docker compose exec lgki node scripts/backup-db.mjs` dann `docker compose cp lgki:/data/backups ./backups` |
| Healthcheck | `GET /api/healthz` (auch im Compose/Dockerfile verdrahtet) |

**Das Volume `lgki_data` ist heilig** — es enthält Nutzer, Tiers, Codes,
Einlösungen, Chats. Nie löschen, regelmässig sichern.

## Checkliste vor dem ersten Verkauf

1. `.env` komplett (v.a. `N8N_SECRET` gesetzt UND in n8n geprüft).
2. n8n-Workflows antworten (Chat im UI testen — Free- und Pro-Route).
3. Mit DevTools versucht, Pro zu erschleichen (Tier im localStorage ändern) → muss wirkungslos sein.
4. Zwei Browser, derselbe Code gleichzeitig → genau einer gewinnt.
5. Word-Export einer Matura-Zusammenfassung in Word geöffnet — Deckblatt, Callouts, Tabellen ok.
6. `docker compose restart` → Nutzer bleiben angemeldet, Daten da.
