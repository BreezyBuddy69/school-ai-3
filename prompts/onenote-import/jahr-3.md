# MASTER PROMPT — OneNote-Import Jahr 3 (Unterstufe, LG Vaduz)

*Bevor du das hier an Claude Code schickst: lies `prompts/onenote-import/00-PLAN.md` einmal, falls noch nicht geschehen — dort steht die Gesamtstrategie. Dann PDFs exportieren (siehe unten), ablegen, und diese Datei komplett an Claude Code senden.*

## Kontext

Du bist ein Weltklasse-Team, das Jaydens komplette Schullaufbahn am
**Liechtensteinischen Gymnasium Vaduz** in die Lernplattform **LG KI 2.0**
überführt. Dieses Fach-Jahr: **Jahr 3, Unterstufe** (letztes Unterstufe-Jahr
vor der Profilwahl). Der Wert dieser App steht und fällt mit echten Notizen
aus echten LG-Stunden — kein generisches Internet-Allerlei, wo echtes
Material existiert.

### Dein Team für diese Session
- **Curriculum-Archivar** — kennt `data/curriculum/*.json` lückenlos, weiss exakt was laut LG-Lehrplan in Jahr 3 drankommt.
- **Fachdidaktiker:in** (pro Fach) — übersetzt Skizzen, Handschrift, Stichworte in klare, prüfungsreife Merkblätter im bestehenden Hausstil.
- **Wissens-Kurator** — dedupliziert gegen vorhandene `data/subjects/`-Dateien, sauberes Datei-/Slug-Schema, nichts geht verloren.
- **Qualitätsprüfer** — Vollständigkeits-Check gegen den Lehrplan, vergibt das Beta/Verified-Tag korrekt und ohne Ausnahme.

## Update 2026-09-03: kein manueller Export mehr nötig

Der ursprüngliche Plan unten (Jayden exportiert jedes Fach manuell als PDF) ist überholt.
Getestet und bestätigt an Jahr 4: OneNote-Desktop läuft auf Jaydens Rechner, und Claude Code
kann per **COM-Automatisierung live** jeden Abschnitt selbst als PDF ziehen und danach inkl.
Handschrift/Skizzen lesen — kein „Datei → Exportieren" mehr nötig. Vorgehen:

```powershell
$one = New-Object -ComObject OneNote.Application
$xml = ""
$one.GetHierarchy($notebookId, [Microsoft.Office.Interop.OneNote.HierarchyScope]::hsSections, [ref]$xml)
# $xml als XML parsen -> alle <one:Section>-Elemente (auch verschachtelt in SectionGroups)
$one.Publish($sectionId, $outPath, [Microsoft.Office.Interop.OneNote.PublishFormat]::pfPDF, "")
```

**Notizbücher Jahr 3 (Klasse "3E", Schuljahr mit Präfix `LG-22-`):**

| Fach-Code | Notizbuch | ID |
|---|---|---|
| GEO (Geografie) | LG-22-3E-GEO-Notizbuch | `{35FE9600-6935-4D57-A71B-F8AD53F2C3A5}{1}{B0}` |
| MA (Mathematik) | LG-22-3E-MA-Notizbuch | `{8E1FB596-CAEA-44FA-BFD9-A040BFDBF03F}{1}{B0}` |
| E (Englisch) | LG-22-3E-E-Notizbuch | `{A53A3AB6-5816-45F7-85F9-E7EAD772FBC3}{1}{B0}` |
| NT (Natur und Technik — vermutlich Biologie/Chemie/Physik kombiniert, in `faecher.json` prüfen und beim Verarbeiten auf die passenden Fach-Ordner aufteilen) | LG-22-3E-NT-Notizbuch | `{EF28118A-BDB8-49A1-8965-329E19AC4D7A}{1}{B0}` |
| GS (Geschichte) | LG-22-3E-GS-Notizbuch | `{D739606F-E7FF-4248-AB33-C823372128F3}{1}{B0}` |
| F (Französisch) | LG-22-3E-F-Notizbuch | `{0C051416-16E0-42F9-B59F-BFB7B8392266}{1}{B0}` |

Für Deutsch, Informatik, Statistik, Wirtschaft und Recht, Bewegung und Sport, Kunsterziehung,
Musikerziehung, Philosophie und Ethik, Religion und Kultur existiert **kein** Jahr-3-Notizbuch
in Jaydens OneNote-Konto (geprüft — durchgängiges Muster über alle bisherigen Jahre: diese Fächer
laufen bei ihm offenbar nicht über OneNote). Diese bleiben automatisch 🧪 Beta, ausser Jayden legt
Material manuell in `data/onenote-inbox/Jahr-3/<Fach>/` ab (Word/PDF/Fotos).

**Empfohlener Ablauf (wie bei Jahr 4 erprobt):** einen Agenten pro Notizbuch parallel im
Hintergrund starten (Agent-Tool, `run_in_background`), jeder mit obiger Notebook-ID, den Zielen
aus Schritt 1–4 unten und der `_Inhaltsbibliothek` (readOnly-Vorlage, kurz auf Zusatzstoff
prüfen) plus persönlicher Section-Group als primärer Quelle. NICHT alle Fächer sequenziell in
einer Session abarbeiten — das lässt sich parallelisieren und war beim letzten Mal deutlich
schneller.

## Ursprünglicher Plan (nur falls die OneNote-Notizbücher oben nicht mehr per COM erreichbar sind)

1. Für jedes Fach unten: OneNote-Abschnitt für Jahr 3 als **PDF** exportieren (Datei → Exportieren → PDF, **ganzer Abschnitt**, nicht einzelne Seiten).
2. Ablegen unter: `data/onenote-inbox/Jahr-3/<Fach>.pdf` — `<Fach>` exakt wie in der Fächerliste unten.
3. Word-Zusammenfassungen zu einem Fach (kein OneNote)? Zusätzlich als `.docx` oder PDF in denselben Fach-Ordner.
4. Kein Material zu einem Fach? Ordner einfach leer lassen — wird unten automatisch zu Beta-Inhalt.
5. Diese ganze Datei an Claude Code im Projektordner senden.

## Fächerliste Jahr 3 (Unterstufe — alle Grundlagenfächer)

Deutsch, Englisch, Französisch, Mathematik, Biologie, Chemie, Physik,
Geografie, Geschichte, Informatik, Statistik, Wirtschaft und Recht,
Bewegung und Sport, Kunsterziehung, Musikerziehung, Philosophie und Ethik,
Religion und Kultur.

(Falls laut Lehrplan ein Fach in Jahr 3 real noch nicht unterrichtet wird —
z. B. weil es erst später einsetzt — dieses Fach überspringen, keine
künstlichen Beta-Dateien erzeugen. Das prüfst du unten in Schritt 1 anhand
von `faecher.json`.)

---

## AUFGABE FÜR DIE KI

### Schritt 1 — Kontext laden
- Lies `data/curriculum/curriculum.json`, `data/curriculum/faecher.json`, `data/curriculum/lektionentafeln.json`.
- Bestätige die Fächerliste für Jahr 3 gegen `grundlagenfaecher` in `curriculum.json`.
- Lies pro betroffenem Fach den zugehörigen Eintrag in `faecher.json` (Beschreibung, Richtziele, Stoffprogramm) — das ist deine Checkliste, welche Themen in diesem Jahr vorkommen müssen.
- Scanne `data/subjects/<Fach>/3/*.md` für bereits bestehende Themen (aktuell noch keine Datei für Jahr 3 vorhanden — reiner Neuaufbau) — trotzdem zuerst prüfen, nicht blind überschreiben, falls sich das inzwischen geändert hat.
- Nutze `fachSlugMap` aus `curriculum.json`, falls der Ordnername vom Fachnamen abweicht (z. B. Französisch → `Franzoesisch`).

### Schritt 2 — Inbox verarbeiten (pro Fach mit Material)
Für jedes Fach mit Dateien in `data/onenote-inbox/Jahr-3/<Fach>.*`:
- PDF vollständig lesen (Read-Tool; bei langen Heften seitenweise in Blöcken — **keine Seite überspringen**, auch nicht scheinbar "nur Zeichnungen").
- Seiten mit Handschrift/Skizzen/Diagrammen visuell auswerten — Inhalt in Worte, Tabellen, LaTeX oder ASCII-Diagramme übersetzen, nichts verlieren.
- Seiteninhalte zu echten Lehrplan-Themen clustern (nicht 1 Seite = 1 Thema) — Vorbild: `data/subjects/Mathematik/1/gleichungen.md`.
- Jedes gefundene Thema gegen die Checkliste aus Schritt 1 abgleichen.

### Schritt 3 — Themen-Dateien schreiben

**Thema aus echten Notizen belegt** → `data/subjects/<Fach>/3/<thema-slug>.md`, **ohne** `-beta`-Suffix. Erste Zeile nach dem Titel:
```
> ✅ Aus deinen echten OneNote-Notizen (Jahr 3) übernommen und aufbereitet.
```

**Thema steht laut Checkliste an, aber in KEINER Quelle vorhanden** (auch: ganzes Fach ohne Inbox-Material) → recherchiere strikt anhand des `faecher.json`-Eintrags + seriöser Quellen, **nur** im Rahmen dessen, was der Lehrplan für dieses Fach/Jahr vorschreibt, nichts darüber hinaus erfinden. Datei: `data/subjects/<Fach>/3/<thema-slug>-beta.md`. Erste Zeile:
```
> 🧪 **Beta** — nicht in deinen OneNote-Notizen/Zusammenfassungen von Jahr 3 gefunden. Aus dem offiziellen LG-Lehrplan + ergänzender Recherche erstellt. Ersetzen/ergänzen, sobald echte Notizen vorliegen.
```

**Vokabular-Fächer** (Englisch, Französisch): zusätzlich neue Vokabeln in `data/subjects/<Fach>/vokabeln/<n>.md` als Tabelle ergänzen — bestehende Dateien zuerst lesen, fortlaufend nummerieren, nicht überschreiben.

### Schritt 4 — Bericht
Schreibe `data/onenote-inbox/Jahr-3/SCRAPE-REPORT.md`:
- Tabelle: Fach | Themen gesamt | davon ✅ verifiziert | davon 🧪 beta | Lehrplan-Themen ohne belastbare Quelle (weder Notizen noch seriöse Internetquelle) — diese explizit offen lassen, nicht raten.
- Klare To-Do-Liste: welche Fächer/Themen du noch mit echten Notizen nachliefern solltest.

## Qualitätsstandards (nicht verhandelbar)
- Format 1:1 wie `data/subjects/Mathematik/1/gleichungen.md`: `# Titel`, `## Abschnitte`, `**fett**`, Tabellen, `$inline$`/`$$block$$`-LaTeX, `> Merke:`/`> Achtung Prüfung:`-Callouts wo passend.
- Prüfungsreif, keine Fliesstext-Abschrift — Definitionen, Formeln, Merksätze rausdestillieren, wie ein guter Schüler seine eigene Zusammenfassung schreiben würde.
- Kein Lehrplan-Thema darf stillschweigend fehlen — entweder als Datei vorhanden ODER explizit im Report gelistet.
- Bestehende Dateien nur ergänzen/verbessern, nie kommentarlos überschreiben.
- Deutschschweizer/liechtensteinische Fachbegriffe beibehalten, nicht eindeutschen.

## Nach dem Lauf
Kurze Zusammenfassung im Chat: X Fächer bearbeitet, Y Themen (davon Z beta),
Pfad zum Report. Führe Schritt 1–4 für **alle** Fächer mit Inbox-Inhalt in
einem Rutsch durch, ohne zwischendurch nachzufragen.
