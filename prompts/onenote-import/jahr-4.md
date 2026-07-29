# MASTER PROMPT — OneNote-Import Jahr 4 (Oberstufe, LG Vaduz)

*Bevor du das hier an Claude Code schickst: lies `prompts/onenote-import/00-PLAN.md` einmal, falls noch nicht geschehen — dort steht die Gesamtstrategie. Dann PDFs exportieren (siehe unten), ablegen, und diese Datei komplett an Claude Code senden.*

```
PROFIL = "wirtschaft-recht"
```
↑ Angenommen aus Klasse „5Wa" (`kurz: W`). War dein Profil in Jahr 4 ein
anderes? Ändere die Zeile auf einen der `profile[].id`-Werte aus
`data/curriculum/curriculum.json` (`lingua`, `neue-sprachen`,
`kunst-musik-paedagogik`, `wirtschaft-recht`, `wirtschaft-recht-sport`,
`mathe-natur`), **bevor** du diesen Prompt an Claude Code sendest.

## Kontext

Du bist ein Weltklasse-Team, das Jaydens komplette Schullaufbahn am
**Liechtensteinischen Gymnasium Vaduz** in die Lernplattform **LG KI 2.0**
überführt. Dieses Fach-Jahr: **Jahr 4, Oberstufe** — erstes Jahr mit
Profilwahl. Der Wert dieser App steht und fällt mit echten Notizen aus
echten LG-Stunden — kein generisches Internet-Allerlei, wo echtes Material
existiert.

### Dein Team für diese Session
- **Curriculum-Archivar** — kennt `data/curriculum/*.json` lückenlos, weiss exakt was laut LG-Lehrplan in Jahr 4 (Grundlagen + Profil `PROFIL`) drankommt.
- **Fachdidaktiker:in** (pro Fach) — übersetzt Skizzen, Handschrift, Stichworte in klare, prüfungsreife Merkblätter im bestehenden Hausstil.
- **Wissens-Kurator** — dedupliziert gegen vorhandene `data/subjects/`-Dateien, sauberes Datei-/Slug-Schema, nichts geht verloren.
- **Qualitätsprüfer** — Vollständigkeits-Check gegen den Lehrplan, vergibt das Beta/Verified-Tag korrekt und ohne Ausnahme.

## Was DU (Jayden) vor dem Start erledigst

1. Für jedes Fach unten: OneNote-Abschnitt für Jahr 4 als **PDF** exportieren (Datei → Exportieren → PDF, **ganzer Abschnitt**, nicht einzelne Seiten).
2. Ablegen unter: `data/onenote-inbox/Jahr-4/<Fach>.pdf` — `<Fach>` exakt wie in der Fächerliste unten.
3. Word-Zusammenfassungen zu einem Fach (kein OneNote)? Zusätzlich als `.docx` oder PDF in denselben Fach-Ordner.
4. Kein Material zu einem Fach? Ordner einfach leer lassen — wird unten automatisch zu Beta-Inhalt.
5. Diese ganze Datei an Claude Code im Projektordner senden.

## Fächerliste Jahr 4 (Oberstufe — Grundlagen + Profil)

**Grundlagenfächer, laut `faecher.json`-Lektionendotation tatsächlich in
Jahr 4 unterrichtet (Stufe-4-Spalte > 0):** Deutsch, Englisch, Französisch,
Mathematik, Biologie, Geografie, Geschichte, Informatik, Bewegung und Sport,
Kunsterziehung, Musikerziehung.

⚠️ **Korrigiert 2026-07-23:** Chemie, Physik, Statistik, Wirtschaft und Recht
(Grundlagenfach), Philosophie und Ethik sowie Religion und Kultur laufen in
Jahr 4 laut Lektionendotation **nicht** (0 Lektionen in Stufe 4 — Chemie/
Physik/Philosophie und Ethik erst ab Stufe 5, Statistik/Wirtschaft und Recht/
Religion und Kultur erst ab Stufe 7). Für diese sechs Fächer **keine**
Beta-Dateien für Jahr 4 anlegen.

**+ Profilfächer von `PROFIL`** (bei `wirtschaft-recht`, Stufe 4:
**Integrationsfach Betriebswirtschaftslehre** — 4 Lektionen, deckt in
Stufe 4 laut Lehrplan-Fussnote auch die Einführung in Rechtskunde/
Gesellschafts-/Obligationenrecht mit ab — und **Finanzbuchhaltung** — 2
Lektionen, nur in Stufe 4).
⚠️ **Korrigiert 2026-07-21:** Die früher hier gelistete Fächerbenennung
„Wirtschaft und Recht (vertieft)" + „Finanz- und Rechnungswesen" war
**falsch** — diese Namen existieren im echten LG-Profil so nicht (siehe
`profilfaecherHinweis` beim `wirtschaft-recht`-Eintrag in
`curriculum.json`, Quelle: `lg-vaduz.li/fach/wirtschaft-und-recht-profilfach`).
„Rechtskunde" als eigenständiges Fach und „Volkswirtschaftslehre" laufen
in Stufe 4 **nicht** — dafür keine Dateien/Ordner anlegen. Falls `PROFIL`
oben geändert wurde: die passenden `profilfaecher` direkt aus
`curriculum.json` lesen, nicht diese Liste hier verwenden.

(Falls laut Lehrplan ein Fach in Jahr 4 real noch nicht/nicht mehr
unterrichtet wird, dieses Fach überspringen, keine künstlichen
Beta-Dateien erzeugen. Das prüfst du unten in Schritt 1 anhand von
`faecher.json`.)

---

## AUFGABE FÜR DIE KI

### Schritt 1 — Kontext laden
- Lies `data/curriculum/curriculum.json`, `data/curriculum/faecher.json`, `data/curriculum/lektionentafeln.json`.
- Berechne die exakte Fächerliste für Jahr 4: `grundlagenfaecher` + `profile.find(p => p.id === PROFIL).profilfaecher` (Duplikate raus) — analog zur Logik in `src/lib/curriculum.ts::subjectsFor`. **Achtung:** `profilfaecher` liefert nur Namen, keine Stufen-Zuordnung — `subjectsFor()` gibt sie für jedes Oberstufenjahr zurück, obwohl sie es real nicht sind. Prüfe darum für JEDES Profilfach-Kandidat zusätzlich in `faecher.json` unter „1. Lektionendotation", ob die Stufe-4-Spalte > 0 ist, bevor du eine Datei dafür anlegst.
- Lies pro betroffenem Fach den zugehörigen Eintrag in `faecher.json` (Beschreibung, Richtziele, Stoffprogramm) — bei Profilfächern besonders genau, da hier mehr Tiefe erwartet wird. Das ist deine Checkliste, welche Themen in diesem Jahr vorkommen müssen.
- Scanne `data/subjects/<Fach>/4/*.md` für bereits bestehende Themen (aktuell noch keine Datei für Jahr 4 vorhanden — reiner Neuaufbau) — trotzdem zuerst prüfen, nicht blind überschreiben, falls sich das inzwischen geändert hat.
- Nutze `fachSlugMap` aus `curriculum.json`, falls der Ordnername vom Fachnamen abweicht (z. B. Französisch → `Franzoesisch`). Für neue Profilfächer ohne bisherigen Ordner (z. B. "Finanz- und Rechnungswesen") den Ordner beim Schreiben der ersten Datei einfach neu anlegen.

### Schritt 2 — Inbox verarbeiten (pro Fach mit Material)
Für jedes Fach mit Dateien in `data/onenote-inbox/Jahr-4/<Fach>.*`:
- PDF vollständig lesen (Read-Tool; bei langen Heften seitenweise in Blöcken — **keine Seite überspringen**, auch nicht scheinbar "nur Zeichnungen").
- Seiten mit Handschrift/Skizzen/Diagrammen visuell auswerten — Inhalt in Worte, Tabellen, LaTeX oder ASCII-Diagramme übersetzen, nichts verlieren.
- Seiteninhalte zu echten Lehrplan-Themen clustern (nicht 1 Seite = 1 Thema) — Vorbild: `data/subjects/Mathematik/1/gleichungen.md`.
- Jedes gefundene Thema gegen die Checkliste aus Schritt 1 abgleichen.

### Schritt 3 — Themen-Dateien schreiben

**Thema aus echten Notizen belegt** → `data/subjects/<Fach>/4/<thema-slug>.md`, **ohne** `-beta`-Suffix. Erste Zeile nach dem Titel:
```
> ✅ Aus deinen echten OneNote-Notizen (Jahr 4) übernommen und aufbereitet.
```

**Thema steht laut Checkliste an, aber in KEINER Quelle vorhanden** (auch: ganzes Fach ohne Inbox-Material) → recherchiere strikt anhand des `faecher.json`-Eintrags + seriöser Quellen, **nur** im Rahmen dessen, was der Lehrplan für dieses Fach/Jahr vorschreibt, nichts darüber hinaus erfinden. Datei: `data/subjects/<Fach>/4/<thema-slug>-beta.md`. Erste Zeile:
```
> 🧪 **Beta** — nicht in deinen OneNote-Notizen/Zusammenfassungen von Jahr 4 gefunden. Aus dem offiziellen LG-Lehrplan + ergänzender Recherche erstellt. Ersetzen/ergänzen, sobald echte Notizen vorliegen.
```

**Vokabular-Fächer** (Englisch, Französisch, ggf. weitere Sprachen laut `PROFIL`): zusätzlich neue Vokabeln in `data/subjects/<Fach>/vokabeln/<n>.md` als Tabelle ergänzen — bestehende Dateien zuerst lesen, fortlaufend nummerieren, nicht überschreiben.

### Schritt 4 — Bericht
Schreibe `data/onenote-inbox/Jahr-4/SCRAPE-REPORT.md`:
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
