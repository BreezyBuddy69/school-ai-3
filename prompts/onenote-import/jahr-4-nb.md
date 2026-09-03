# MASTER PROMPT — OneNote-Import Jahr 4, zweiter Versuch (Klasse "4Nb", Profil Neue Sprachen)

## Hintergrund

Jayden hat die 4. Klasse **zweimal** gemacht: zuerst als **"4Nb"** (Profil `neue-sprachen`,
kurz `N` — Profilfächer Latein und Spanisch), dann wiederholt als **"4Wa"** (Profil
`wirtschaft-recht`). Der 4Wa-Durchgang ist bereits vollständig verarbeitet
(`prompts/onenote-import/jahr-4.md`, 63/89 Themen ✅, Stand 2026-09-03). Dieser Prompt holt
zusätzliches Material aus dem **ersten** Durchgang (4Nb) nach — für Grundlagenfächer (Deutsch,
Englisch, Französisch, Mathematik, Biologie, Geografie, Geschichte, Informatik, Sport, Kunst,
Musik) kann das noch offene 🧪-Beta-Themen in Jahr 4 mit echtem Stoff füllen. Für die
Profilfächer Latein/Spanisch (nur im 4Nb-Jahr relevant, nicht im aktuellen Profil `wirtschaft-recht`)
gilt eine Sonderregel — siehe unten.

## Schritt 0 — Notizbücher erst finden (noch nicht erledigt, Stand 2026-09-03)

Ein Live-Scan aller aktuell in OneNote-Desktop geöffneten Notizbücher (per COM,
`GetHierarchy(..., hsNotebooks, ...)`) zeigt **kein** Notizbuch mit "4Nb" im Namen. Die anderen
Jahre folgen dem Muster `LG-<Schuljahr-Präfix>-<Klasse>-<Fach-Code>-Notizbuch`:

| Klasse | Schuljahr-Präfix | Bereits gefunden |
|---|---|---|
| 3E | `LG-22-` | ✅ (GEO, MA, E, NT, GS, F) |
| **4Nb** | vermutlich `LG-23-` (zeitlich zwischen 3E und 4Wa) — **nicht bestätigt** | ❌ fehlt komplett |
| 4Wa | `LG-24-` | ✅ (E, INF, MA, WR, GEO, GS, BIO, F) |
| 5Wa | `LG-25-` | ✅ |
| 6Wa | `LG-26-` | ✅ (bisher nur Englisch) |

Erwarteter Name z.B. `LG-23-4Nb-MA-Notizbuch` — aber **das ist eine Vermutung, keine
Bestätigung**. Bevor irgendwas exportiert werden kann, muss Jayden diese Notizbücher erst in der
OneNote-Desktop-App sichtbar/geöffnet haben:

1. OneNote öffnen → **Datei → Notizbuch öffnen** → nach "4Nb" oder dem SharePoint-Site-Namen
   `Section_LG-23-4Nb-...` suchen (Muster wie bei den anderen Jahren, z.B.
   `https://schulenfl.sharepoint.com/sites/Section_LG-23-4Nb-MA/`).
2. Falls dort nichts auftaucht: in OneDrive/SharePoint direkt nach "4Nb" suchen, oder unter
   "Zuletzt verwendet"/"Andere Notizbücher" in OneNote nachsehen — je nachdem, ob die Klasse beim
   Wechsel zu 4Wa noch Zugriff behalten hat.
3. Falls auch das nichts findet: evtl. wurde der Zugriff nach dem Klassenwechsel entzogen — dann
   bei der Schule (IT/damaliger Fachlehrer) nachfragen, ob sich der Site-Link noch reaktivieren
   lässt.
4. Sobald mindestens ein 4Nb-Notizbuch in OneNote-Desktop geöffnet ist: eine neue Claude-Code-
   Session starten und **Schritt 1 unten** (live per COM-Hierarchie-Scan) ausführen, um die
   tatsächlichen Notizbuch-IDs und die komplette Fächerliste zu bekommen — nicht raten.

## Schritt 1 — Kontext + Notizbücher live abfragen

- `prompts/onenote-import/00-PLAN.md` und `prompts/onenote-import/jahr-4.md` lesen (Tagging-
  Regeln, Format-Vorbild, allgemeine Vorgehensweise identisch).
- `data/curriculum/curriculum.json` → Profil `neue-sprachen` (`kurz: "N"`, Profilfächer: Latein,
  Spanisch). Für Stufe-4-Lektionendotation der Profilfächer **unbedingt** `faecher.json` prüfen
  (nicht `subjectsFor()` blind vertrauen — bei `wirtschaft-recht` lief 2026-07-21/23 genau das
  schief, siehe `profilfaecherHinweis` im curriculum.json-Eintrag).
- Live-Scan: `$one.GetHierarchy("", hsNotebooks, [ref]$xml)` → alle "4Nb"-Notizbücher finden,
  IDs notieren. Pro Notizbuch: `GetHierarchy($notebookId, hsSections, [ref]$xml)` für die
  Section-Liste (analog zum PowerShell-Snippet in `jahr-3.md`/`jahr-4.md`).

## Schritt 2 — Grundlagenfächer: nur Lücken füllen, nichts überschreiben

Für Deutsch, Englisch, Französisch, Mathematik, Biologie, Geografie, Geschichte, Informatik,
Bewegung und Sport, Kunsterziehung, Musikerziehung:

- **Zuerst** `data/subjects/<Fach>/4/*.md` lesen — welche Themen sind schon ✅ (aus dem 4Wa-Lauf)?
  Diese NICHT anfassen, auch wenn das 4Nb-Material eine andere/zusätzliche Perspektive hätte.
- Nur für Themen, die noch `-beta.md` sind (oder für Fächer, die komplett fehlen — z.B. Deutsch,
  Kunst, Musik, Sport, für die es im 4Wa-Notizbuch gar keine OneNote-Quelle gab): prüfen, ob das
  4Nb-Notizbuch dazu echtes Material hat. Falls ja: `-beta.md` löschen, echte `✅`-Version
  schreiben — Callout-Zeile leicht anpassen, damit die Jahres-Herkunft klar bleibt:
  `> ✅ Aus deinen echten OneNote-Notizen (Jahr 4, erster Durchgang "4Nb") übernommen und aufbereitet.`
- Sonst wie in `jahr-4.md` beschrieben verfahren (PDF live exportieren, vollständig lesen inkl.
  Handschrift, zu Themen clustern, Format wie `data/subjects/Mathematik/1/gleichungen.md`).

## Schritt 3 — Profilfächer Latein/Spanisch: Jayden fragen, nicht automatisch anlegen

Latein und Spanisch sind NUR im 4Nb-Profil relevant. Da Jaydens aktuelles/finales Profil
`wirtschaft-recht` ist, tauchen diese Fächer in der App-Themenauswahl (`subjectsFor()`) für
Jahr 4 gar nicht auf — Dateien dafür wären in der App aktuell unsichtbar/unerreichbar. **Bevor
hier Dateien angelegt werden: kurz nachfragen, ob Jayden das trotzdem als Archiv will** (z.B.
unter `data/subjects/Latein/4/` und `data/subjects/Spanisch/4/`, mit einem Hinweis-Callout, dass
das Fach ausserhalb des aktuellen Profils liegt) — oder ob das Material einfach übersprungen
werden soll, weil es für die Prüfungsvorbereitung im aktuellen Profil ohnehin nicht relevant ist.

## Schritt 4 — Bericht

`data/onenote-inbox/Jahr-4-Nb/SCRAPE-REPORT.md`: welche Notizbücher gefunden/exportiert wurden,
welche Grundlagenfach-Lücken aus Jahr 4 dadurch geschlossen wurden, was mit Latein/Spanisch
passiert ist (archiviert oder übersprungen, je nach Jaydens Antwort).

## Qualitätsstandards

Identisch zu `jahr-4.md`: prüfungsreif, kein Fliesstext, Format wie
`data/subjects/Mathematik/1/gleichungen.md`, Deutschschweizer/liechtensteinische Fachbegriffe
beibehalten, bestehende Dateien nur ergänzen, nie kommentarlos überschreiben.
