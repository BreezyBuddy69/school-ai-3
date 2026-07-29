# N8N-CONTRACT — LG KI 2.0 ↔ n8n

Alle KI-Aufrufe laufen **Server→Server** (Next.js-Route → n8n-Webhook). Der
Browser sieht keine Webhook-URLs mehr. Modellwahl und Provider-Keys leben
ausschliesslich in n8n.

**Basis:** `N8N_BASE` (z.B. `https://n8n.halovisionai.cloud/webhook`)
**Auth:** Jeder Request trägt den Header `X-LGKI-Secret: <N8N_SECRET>`.
→ In jedem Workflow direkt nach dem Webhook-Trigger ein IF-Node: Header
stimmt nicht → 403, Ende. Damit kann niemand die Webhooks direkt aufrufen.

Ohne `N8N_BASE` läuft die App im **Demo-Modus** (Mock-Antworten, klar
gekennzeichnet) — Entwicklung und Vorführung brauchen kein n8n.

## Bestehende v1-Workflows (werden weiterverwendet)

| Zweck | free-Route | pro-Route |
|---|---|---|
| Chat | `lgagentfree-42ae-8caf-4bf7db07019d` | `lgagent-42ae-8caf-4bf7db07019d` |
| Lernkarten | `lgagentkarteikartenfree-…` | `lgagentkarteikartenpro-…` |
| Zusammenfassung | `lgagentzusammenfassungfree-…` | `lgagentzusammenfassungpro-…` |
| Quiz | `lgagentquizfree-…` | `lgagentquizpro-…` |
| Mindmap | `lgagentmindmapfree-…` | `lgagentmindmappro-…` |

Die App wählt free/pro **serverseitig anhand des DB-Tiers** — `tier` wird
zusätzlich im Body mitgeschickt (für Logging/Feinrouting in n8n).

### Modell-Routing (Empfehlung)
- **free** → Gratis-Modelle via OpenRouter (z.B. `deepseek/deepseek-chat:free`) — Free-Nutzer kosten ~nichts.
- **pro** → Claude-Sonnet-Klasse.
- **premium** → bestes Modell, ggf. eigene Queue/Priorität (`tier`-Feld auswerten).

## Request-Formate (v1, unverändert)

### Chat
```json
{
  "message": "string",
  "history": [{ "role": "user|assistant", "content": "string" }],
  "profile": {
    "name": "Jayden", "class": "5Wa", "jahr": 5,
    "profile": "wirtschaft-recht", "school": "LG Vaduz",
    "personal": "lernt am besten mit Beispielen",
    "context": "Schüler:in am Liechtensteinischen Gymnasium… Profil «Wirtschaft und Recht»…"
  },
  "selectedSources": [{ "topic": "Mathematik/2/trigonometrie", "content": "<markdown>" }],
  "subject": "Mathematik",
  "tier": "free|pro|premium",
  "voice": false
}
```
`profile.context` ist neu (v2): fertiger Kontextsatz aus dem Curriculum —
einfach in den System-Prompt übernehmen. `voice: true` → Antwort kürzer und
vorlesbar formulieren (keine Tabellen, wenig Formeln).

**Antwort (alle Workflows):** `{ "output": "string" }` — die App toleriert
auch `text`/`answer`/rohen Text.

### Lernkarten → `output` = JSON-Array `[{ "front": "...", "back": "..." }]`
### Quiz → `[{ "frage": "...", "a": "...", "b": "...", "c": "...", "d": "...", "correct": "A" }]`
### Mindmap → `[{ "branch": "...", "children": ["...", "..."] }]`
(Markdown-Zäune um das JSON sind ok — die App parst tolerant.)

### Zusammenfassung
`content` enthält den fertig gebauten Auftrag inkl. Konfiguration
(Niveau/Länge/Stil/Extras als Klartext-Anweisungen). Erwartete Antwort:
**Markdown** mit `#`/`##`-Überschriften, `**fett**`, GFM-Tabellen,
Blockquotes mit Präfix `Merke:` oder `Achtung Prüfung:` (werden im
Word-Export zu Akzent-Callout-Boxen), LaTeX in `$…$`/`$$…$$`.
Je sauberer das Markdown, desto schöner das Word-Dokument.

## Neue Workflows (v2)

### `lgki-mail` — GEBAUT (2026-07-20, im Workflow „LG Agents")
Verschickt E-Mail-Bestätigung und Passwort-Reset über die bestehende
Gmail-Credential. Webhook → IF (Header `x-lgki-secret` == `N8N_SECRET`,
sonst 403) → Gmail-Node (`\n` wird zu `<br>` konvertiert) → Respond `{ok:true}`.

Input: `{ "to": "schueler@mail.li", "subject": "LG KI — …", "text": "…mit Link…" }`

**Login/Registrierung wurde im selben Zug gefixt** (2026-07-20): Registrierung
loggt nicht mehr automatisch ein — erst die Bestätigung erzeugt eine Session.
Vorher konnte man sich mit einer fremden, unbewiesenen E-Mail-Adresse sofort
einloggen und ein Passwort setzen. Reset über `/api/auth/reset` zählt
ebenfalls als Bestätigung (setzt `verified = 1`). Ohne Mail-Versand
(Demo-Modus, kein `N8N_BASE`) zeigt die App Link und Code weiterhin direkt
im UI — das ist bewusst nur für den Demo-Fall so, in Produktion nie.

**Bestätigung per 6-stelligem Code (primär) statt nur Link** (2026-07-20,
Nachtrag): Der Link zeigt auf `NEXT_PUBLIC_APP_URL` — bei wechselndem
ngrok-Tunnel oder noch unentschiedener Domain funktioniert er nicht
zuverlässig. Die Mail enthält jetzt zusätzlich einen 6-stelligen Code
(30 Min. gültig, `users.verify_code_hash`/`verify_code_expires`,
einmal verwendbar), den man direkt auf derselben Login-Seite eingibt
(`POST /api/auth/verify-code`, neuer `mode: 'verify-code'` in
`src/app/login/page.tsx`). Rate-limitiert pro IP und pro Konto gegen
Brute-Force (nur 10⁶ Möglichkeiten). `POST /api/auth/resend-code`
(unauthentifiziert, enumeration-safe) schickt bei Bedarf einen neuen.

**Registrierungs-Log in Google Sheets:** Der bereits vorhandene, bisher
unbenutzte Webhook `lgagentdatenbank-42ae-8caf-4bf7db07019d` (Pfad war ohne
`httpMethod` fälschlich auf GET, jetzt POST) hängt jetzt hinter derselben
Secret-Prüfung und schreibt bei jeder Neuregistrierung eine Zeile (Name =
E-Mail, Abo = Tier, Datum) ins Sheet „LG KI db"
(`1I5i9BuU0OqZEmPV_tkHsm9s1IN_-fo6y12sMGeYuOik`). Aufruf aus `logRegistration()`
in `src/lib/n8n.ts`, best-effort/fire-and-forget — blockiert die Registrierung nie.

**Redemption-Log im selben Sheet, `event` unterscheidet die Zeile (2026-07-21):**
`logRegistration()` und die neue `logRedemption()` (`src/lib/n8n.ts`) rufen
denselben Webhook auf, jetzt mit einem zusätzlichen Feld `event: 'register'`
bzw. `event: 'redeem'` (+ `code` bei Redemptions). Grund: verkaufte Pro-Codes
werden nach Einlösung sofort aus der DB gelöscht (`code_redemptions` +
`codes`-Zeile, siehe `src/app/api/redeem/route.ts`) — dieses Sheet ist danach
die einzige dauerhafte Aufzeichnung, welcher Code an wen ging.

Payload jetzt:
```json
// Registrierung
{ "event": "register", "profile": { "email": "…" }, "tier": "free" }
// Einlösung
{ "event": "redeem", "profile": { "email": "…" }, "tier": "pro", "code": "LGKI-PRO-XXXX-XXXX" }
```

**n8n-seitig erledigt (2026-07-21):** Einfacher als gedacht — kein Switch nötig.
Das Sheet „LG KI db" hatte schon eine ungenutzte Spalte `Code (pro-abo)` im
Schema. `Append row in sheet` (Node im Workflow „LG Agents", hinter
`Webhook2` → `IF Secret OK (Log)`) mappt diese Spalte jetzt auf
`={{ $json.body.code || '' }}` — bei Registrierung bleibt sie leer, bei
Redemption steht der eingelöste Code drin. Kein zweiter Zweig, keine zweite
Sheets-Node, eine Zeile pro Ereignis reicht. Per n8n-mcp live geändert und
validiert (`n8n_validate_workflow`: 0 Fehler).

**Credential-Status (Stand 2026-07-20):** Beim ersten Live-Test warfen beide
Google-Credentials `invalid_grant` (Refresh-Token abgelaufen/widerrufen).
Gmail-Credential („Gmail account", `TtA1IUYPs7qNg43u` — auch von PAIDEIA
„Gmail Send Reset Code" benutzt) ist mittlerweile bestätigt wieder ok (Mail
kam live an). Google-Sheets-Credential (`989BAgGYmB9NCnTa`) war zu dem
Zeitpunkt noch nicht erneut getestet — falls das Sheet „LG KI db" bei
Registrierungen leer bleibt, dort in der n8n-UI unter Credentials neu mit
Google verbinden (Reconnect, braucht Login im Browser, geht nicht per API).
Die Mail-Node hat zusätzlich `onError: continueErrorOutput` bekommen, damit
ein toter Gmail-Credential künftig ehrlich als Fehler (502) statt als
stilles `{ok:true}` zurückkommt.

### `lgki-onenote-summarize` (für scripts/import-onenote.mjs)
Input: `{ "fach": "Mathematik", "jahr": "2", "filename": "…", "html": "<OneNote-Export>" }`
Output: `{ "output": "<Themen-Markdown im data/subjects-Format>" }`
(# Titel, ## Abschnitte, > Merke:-Callouts, Vokabel-Tabellen wo sinnvoll.)

### `lgki-essay-feedback` (Aufsatz-Feedback, Pro)
Input: `{ "text": "<Aufsatz>", "fach": "Deutsch|Englisch|Französisch", "profile": {…} }`
Output: Markdown-Feedback nach Rubrik (Struktur / Argumentation / Sprache /
Rechtschreibung), niemals ein umgeschriebener Aufsatz.

### Zielbild: echtes Streaming + Tool-Calls
v1 antwortet als Block; die App streamt die Anzeige clientseitig. Wenn n8n
(oder ein direkter Anthropic-Aufruf) echtes Streaming liefert, kann
`src/lib/n8n.ts` auf SSE-Passthrough umgestellt werden, ohne dass sich am
UI etwas ändert — das SSE-Protokoll (`tool`/`thought`/`delta`/`done`) steht.
Für echte Tool-Calls (Modell fordert `search_topics`/`read_topic` selbst an)
ist der Loop in `/api/chat` der Ansatzpunkt; die Tool-Events sind bereits
Teil des Protokolls.
