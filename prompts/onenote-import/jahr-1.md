# MASTER PROMPT — OneNote-Import Jahr 1 (Unterstufe, LG Vaduz)

*Bevor du das hier an Claude Code schickst: lies `prompts/onenote-import/00-PLAN.md` einmal, falls noch nicht geschehen — dort steht die Gesamtstrategie. Dann PDFs exportieren (siehe unten), ablegen, und diese Datei komplett an Claude Code senden.*

## Kontext

Du bist ein Weltklasse-Team, das Jaydens komplette Schullaufbahn am
**Liechtensteinischen Gymnasium Vaduz** in die Lernplattform **LG KI 2.0**
überführt. Dieses Fach-Jahr: **Jahr 1, Unterstufe**. Der Wert dieser App
steht und fällt mit echten Notizen aus echten LG-Stunden — kein
generisches Internet-Allerlei, wo echtes Material existiert.

⚠️ **Vor dem Start klären (Stand 2026-07-21, noch nicht verifiziert):**
Jayden war für Jahr 1 (evtl. auch weitere frühe Jahre) mutmasslich an der
**Realschule**, nicht am LG Vaduz. Falls das zutrifft, ist der
LiLe-Lehrplan (`https://lile.li/`, Quelle laut `curriculum.json` für die
Unterstufe) für dieses Jahr **nicht 1:1 anwendbar** — Fächerliste,
Stundendotation und Stoffprogramm können abweichen. Vor dem eigentlichen
Lauf mit Jayden klären: (a) welche Schule/welcher Lehrplan für Jahr 1
tatsächlich galt, (b) ob die Fächerliste unten überhaupt passt. Wenn ja:
alle Beta-Dateien für dieses Jahr entsprechend mit einem Hinweis auf die
abweichende Schule versehen statt stillschweigend LG-Lehrplan-Inhalte zu
unterstellen.

### Dein Team für diese Session
- **Curriculum-Archivar** — kennt `data/curriculum/*.json` lückenlos, weiss exakt was laut LG-Lehrplan in Jahr 1 drankommt.
- **Fachdidaktiker:in** (pro Fach) — übersetzt Skizzen, Handschrift, Stichworte in klare, prüfungsreife Merkblätter im bestehenden Hausstil.
- **Wissens-Kurator** — dedupliziert gegen vorhandene `data/subjects/`-Dateien, sauberes Datei-/Slug-Schema, nichts geht verloren.
- **Qualitätsprüfer** — Vollständigkeits-Check gegen den Lehrplan, vergibt das Beta/Verified-Tag korrekt und ohne Ausnahme.

## Was DU (Jayden) vor dem Start erledigst

1. Für jedes Fach unten: OneNote-Abschnitt für Jahr 1 als **PDF** exportieren (Datei → Exportieren → PDF, **ganzer Abschnitt**, nicht einzelne Seiten).
2. Ablegen unter: `data/onenote-inbox/Jahr-1/<Fach>.pdf` — `<Fach>` exakt wie in der Fächerliste unten.
3. Word-Zusammenfassungen zu einem Fach (kein OneNote)? Zusätzlich als `.docx` oder PDF in denselben Fach-Ordner.
4. Kein Material zu einem Fach? Ordner einfach leer lassen — wird unten automatisch zu Beta-Inhalt.
5. Diese ganze Datei an Claude Code im Projektordner senden.

## Fächerliste Jahr 1 (Unterstufe — alle Grundlagenfächer)

Deutsch, Englisch, Französisch, Mathematik, Biologie, Chemie, Physik,
Geografie, Geschichte, Informatik, Statistik, Wirtschaft und Recht,
Bewegung und Sport, Kunsterziehung, Musikerziehung, Philosophie und Ethik,
Religion und Kultur.

(Falls laut Lehrplan ein Fach in Jahr 1 real noch nicht unterrichtet wird —
z. B. weil es erst später einsetzt — dieses Fach überspringen, keine
künstlichen Beta-Dateien erzeugen. Das prüfst du unten in Schritt 1 anhand
von `faecher.json`.)

---

## AUFGABE FÜR DIE KI

### Schritt 1 — Kontext laden
- Lies `data/curriculum/curriculum.json`, `data/curriculum/faecher.json`, `data/curriculum/lektionentafeln.json`.
- Bestätige die Fächerliste für Jahr 1 gegen `grundlagenfaecher` in `curriculum.json`.
- Lies pro betroffenem Fach den zugehörigen Eintrag in `faecher.json` (Beschreibung, Richtziele, Stoffprogramm) — das ist deine Checkliste, welche Themen in diesem Jahr vorkommen müssen.
- Scanne `data/subjects/<Fach>/1/*.md` für bereits bestehende Themen (aktuell u. a. Deutsch, Biologie, Geschichte teilweise befüllt) — nicht duplizieren, nur ergänzen/verbessern.
- Nutze `fachSlugMap` aus `curriculum.json`, falls der Ordnername vom Fachnamen abweicht (z. B. Französisch → `Franzoesisch`).

### Schritt 2 — Inbox verarbeiten (pro Fach mit Material)
Für jedes Fach mit Dateien in `data/onenote-inbox/Jahr-1/<Fach>.*`:
- PDF vollständig lesen (Read-Tool; bei langen Heften seitenweise in Blöcken — **keine Seite überspringen**, auch nicht scheinbar "nur Zeichnungen").
- Seiten mit Handschrift/Skizzen/Diagrammen visuell auswerten — Inhalt in Worte, Tabellen, LaTeX oder ASCII-Diagramme übersetzen, nichts verlieren.
- Seiteninhalte zu echten Lehrplan-Themen clustern (nicht 1 Seite = 1 Thema) — Vorbild: `data/subjects/Mathematik/1/gleichungen.md`.
- Jedes gefundene Thema gegen die Checkliste aus Schritt 1 abgleichen.

### Schritt 3 — Themen-Dateien schreiben

**Thema aus echten Notizen belegt** → `data/subjects/<Fach>/1/<thema-slug>.md`, **ohne** `-beta`-Suffix. Erste Zeile nach dem Titel:
```
> ✅ Aus deinen echten OneNote-Notizen (Jahr 1) übernommen und aufbereitet.
```

**Thema steht laut Checkliste an, aber in KEINER Quelle vorhanden** (auch: ganzes Fach ohne Inbox-Material) → recherchiere strikt anhand des `faecher.json`-Eintrags + seriöser Quellen, **nur** im Rahmen dessen, was der Lehrplan für dieses Fach/Jahr vorschreibt, nichts darüber hinaus erfinden. Datei: `data/subjects/<Fach>/1/<thema-slug>-beta.md`. Erste Zeile:
```
> 🧪 **Beta** — nicht in deinen OneNote-Notizen/Zusammenfassungen von Jahr 1 gefunden. Aus dem offiziellen LG-Lehrplan + ergänzender Recherche erstellt. Ersetzen/ergänzen, sobald echte Notizen vorliegen.
```

**Vokabular-Fächer** (Englisch, Französisch): zusätzlich neue Vokabeln in `data/subjects/<Fach>/vokabeln/<n>.md` als Tabelle ergänzen — bestehende Dateien zuerst lesen, fortlaufend nummerieren, nicht überschreiben.

### Schritt 4 — Bericht
Schreibe `data/onenote-inbox/Jahr-1/SCRAPE-REPORT.md`:
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
