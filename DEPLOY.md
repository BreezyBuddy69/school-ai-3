# DEPLOY — LG KI 2.0 auf dem Hostinger-VPS

Ziel: Docker-Container hinter dem bestehenden Traefik auf
`halovisionai.cloud`. **Port 8100** (belegt sind dort: 80, 8080, 8081,
8082, 8091 — 8100 kollidiert mit nichts).

## 1. DNS (einmalig)

A-Record `gymi.halovisionai.cloud` → VPS-IP (Hostinger-Panel). Subdomain,
Next.js läuft ohne basePath (docker-compose.yml ist bereits darauf
eingestellt).

## 2. Code aufs VPS

```bash
# lokal (node_modules/.next werden nicht gebraucht — Docker baut selbst):
scp -r school-ai-3 user@vps:/opt/lgki
# oder git clone, wenn das Repo online liegt
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
NEXT_PUBLIC_APP_URL=https://gymi.halovisionai.cloud
```

Ohne `.env` startet der Container im Demo-Modus — gut zum Testen, nicht
zum Verkaufen.

## 4. Bauen & starten

```bash
docker compose up -d --build
docker compose ps                                  # healthy?
curl -s http://127.0.0.1:8100/api/healthz          # {"ok":true,...}
curl -s https://gymi.halovisionai.cloud/api/healthz
```

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
| Update | `git pull && docker compose up -d --build` |
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
