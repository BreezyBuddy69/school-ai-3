# Plan: OneNote → LG KI, alle 7 Schuljahre

Ziel: Jaydens komplette Schullaufbahn am LG Vaduz (7 Jahre, alle Fächer) aus
OneNote (+ Word-Zusammenfassungen) in `data/subjects/<Fach>/<Jahr>/<thema>.md`
überführen — im bestehenden Hausstil, vollständig gegen den offiziellen
Lehrplan abgeglichen. Ergebnis: der Content-Graben, den README.md schon als
Ziel nennt ("echte Notizen aus echten LG-Stunden, kein Internet-Allerlei").

Umsetzung: **7 einzelne Master-Prompts**, einer pro Schuljahr, in diesem
Ordner (`jahr-1.md` … `jahr-7.md`). Du bearbeitest sie nacheinander — pro
Jahr: OneNote-Fächer exportieren, PDFs ablegen, Prompt in Claude Code laufen
lassen, nächstes Jahr.

## Warum PDF-Export (nicht HTML/docx, nicht Microsoft-Graph-API)

Du hast drei Optionen abgewogen — hier die Entscheidung:

| Option | Text | Handschrift/Skizzen | Aufwand | Verdikt |
|---|---|---|---|---|
| **PDF-Export** (Datei → Exportieren) | ✅ | ✅ (als Bild, Claude liest Seiten multimodal) | 1 Klick pro Abschnitt | **Gewinner** |
| HTML-Export | ✅ | ❌ meist verloren/kaputt | mittel | verwirft genau das, was den Wert ausmacht |
| Graph API (`import-onenote.mjs`-Plan) | ✅ | ⚠️ nur als rohes Bild ohne Layout-Kontext | OAuth-Setup, n8n-Workflow bauen | überdimensioniert für einen einmaligen Bulk-Import |

PDF gewinnt, weil Claude Code PDFs **seitenweise als Bild** lesen kann —
handgezeichnete Diagramme, Formelblätter, Skizzen bleiben sichtbar, nicht nur
der Text. Das war dein eigener Verdacht im Auftrag, und er stimmt.

**Das ersetzt den in `N8N-CONTRACT.md` skizzierten Workflow
`lgki-onenote-summarize`.** Den musst du für diesen Bulk-Import nicht bauen —
Claude Code macht die Zusammenfassung direkt in der Session, mit vollem
Zugriff auf den Lehrplan zum Abgleich (besser als ein einzelner, blinder
n8n-LLM-Call). `scripts/import-onenote.mjs` (das Phase-2-Gerüst) bleibt
unangetastet liegen, falls du später doch einen laufenden Live-Import direkt
aus OneNote willst — für dieses Projekt hier ist es nicht der Weg.

## Wie du pro Fach exportierst

1. OneNote öffnen → Abschnitt für das Fach/Jahr auswählen (ganzer Abschnitt,
   nicht einzelne Seiten — sonst geht Reihenfolge/Kontext verloren).
2. Datei → Exportieren → Format **PDF** → ganzer Abschnitt.
3. Speichern unter: `data/onenote-inbox/Jahr-<N>/<Fach>.pdf`
   (Ordner sind bereits angelegt, `<Fach>` = exakt wie in `data/subjects/`,
   siehe Liste im jeweiligen Jahres-Prompt).
4. Gibt es zu einem Fach zusätzlich Word-Zusammenfassungen (nicht OneNote)?
   Einfach als `.docx` oder als PDF in denselben Fach-Ordner legen — der
   Prompt liest alles, was dort liegt.
5. Kein Material zu einem Fach in diesem Jahr? Ordner leer lassen — der
   Prompt erkennt das automatisch (siehe Beta-Modus unten).

## Das Beta/Verified-Tagging (dein Zusatzwunsch)

Zwei sichtbare Signale pro Thema — sowohl im Dateinamen (taucht 1:1 in der
Themen-Auswahl der App auf, da Labels direkt aus Dateinamen kommen,
`src/lib/subjects.ts:29`) als auch im Text selbst:

| Signal | Wann | Dateiname | Erste Zeile im Dokument |
|---|---|---|---|
| ✅ Verified | Thema kommt nachweislich aus deinen echten OneNote-Notizen/Word-Zusammenfassungen | `thema.md` (kein Suffix — wie alle bestehenden 65 Dateien) | `> ✅ Aus deinen echten OneNote-Notizen (Jahr N) übernommen und aufbereitet.` |
| 🧪 Beta | Thema steht laut Lehrplan-Checkliste an, kommt aber in KEINER deiner Quellen vor → aus Lehrplan + Internet-Recherche erstellt, strikt im Rahmen dessen, was der Lehrplan vorschreibt | `thema-beta.md` | `> 🧪 **Beta** — nicht in deinen Notizen gefunden. Aus Lehrplan + Recherche erstellt. Ersetzen, sobald echte Notizen vorliegen.` |

Fehlt einem ganzen Fach in einem Jahr jede Quelle (Inbox-Ordner leer), gilt
für **alle** Themen dieses Fachs automatisch der Beta-Pfad — keine
Extra-Logik nötig, folgt direkt aus derselben Regel.

Bewusst **kein YAML-Frontmatter** (`---\nstatus: beta\n---`): geprüft in
`src/lib/docx.ts` — `---` wird dort als horizontale Linie geparst, Frontmatter
würde als kaputter Absatz mitten im Word-Export auftauchen. Der
Dateinamen-Suffix + die Badge-Zeile sind die einzige Variante ohne
App-Code-Änderung, die trotzdem in der Themen-Auswahl sichtbar ist.

## Die 7 Jahre auf einen Blick

Quelle: `data/curriculum/curriculum.json` (bereits gescraped von lg-vaduz.li).

| Jahr | Stufe | Fächer | Profil |
|---|---|---|---|
| 1–3 | Unterstufe | alle 17 Grundlagenfächer | — |
| 4–7 | Oberstufe | 17 Grundlagenfächer + Profilfächer | **Wirtschaft und Recht** (angenommen aus Klasse „5Wa", `kurz: W`) |

Falls dein Profil in einem der Jahre 4–7 nicht „Wirtschaft und Recht" war:
ändere die Zeile `PROFIL = "wirtschaft-recht"` im jeweiligen `jahr-N.md`,
bevor du den Prompt startest (eine Zeile, siehe Liste der `profile[].id` in
`curriculum.json`: `lingua`, `neue-sprachen`, `kunst-musik-paedagogik`,
`wirtschaft-recht`, `wirtschaft-recht-sport`, `mathe-natur`).

Grundlagenfächer (alle 7 Jahre): Deutsch, Englisch, Französisch, Mathematik,
Biologie, Chemie, Physik, Geografie, Geschichte, Informatik, Statistik,
Wirtschaft und Recht, Bewegung und Sport, Kunsterziehung, Musikerziehung,
Philosophie und Ethik, Religion und Kultur. Profilfächer „Wirtschaft und
Recht": Wirtschaft und Recht (vertieft), Finanz- und Rechnungswesen,
Volkswirtschaftslehre.

Falls ein Fach in einem bestimmten Jahr laut Lehrplan gar nicht unterrichtet
wird (z. B. weil es erst später beginnt), überspringt der Prompt es —
erzeugt keine künstlichen Beta-Dateien für nicht existente Jahrgangsstufen.

## Ablauf pro Jahr

1. PDFs für alle Fächer dieses Jahres exportieren und ablegen (siehe oben).
2. Neue Claude-Code-Session im Projektordner öffnen.
3. Inhalt von `prompts/onenote-import/jahr-N.md` senden.
4. Claude verarbeitet alle Fächer mit Inbox-Material in einem Rutsch,
   erstellt Themen-Dateien + `data/onenote-inbox/Jahr-N/SCRAPE-REPORT.md`.
5. Report lesen → offene Lücken siehst du sofort (Beta-Dateien + explizite
   Lehrplan-Themen ohne jede Quelle).
6. Stichprobe in der App (`npm run dev` → Fach/Jahr auswählen) — passt der
   Ton, fehlt nichts Offensichtliches?
7. Nächstes Jahr.

Reihenfolge ist egal — die Prompts sind unabhängig voneinander, du kannst
auch mit deinem aktuellen Jahr (5) anfangen, wenn das Material am
griffbereitesten ist.
