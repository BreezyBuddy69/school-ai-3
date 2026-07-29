# Algorithmen und Programme

> 🧪 **Beta** — nicht in deinen OneNote-Notizen/Zusammenfassungen von Jahr 4 gefunden. Aus dem offiziellen LG-Lehrplan + ergänzender Recherche erstellt. Ersetzen/ergänzen, sobald echte Notizen vorliegen.

## Grundstrukturen
- **Sequenz**: Schritte nacheinander ausführen.
- **Selektion**: Verzweigung (if/else) — abhängig von einer Bedingung anders reagieren.
- **Iteration**: Wiederholung (Schleife: while/for).

## Entwurfstechniken

| Verfahren | Idee |
|---|---|
| Teile und herrsche | Problem in kleinere Teilprobleme zerlegen |
| Modularisierung | Code in wiederverwendbare Funktionen/Module aufteilen |
| Abstraktion | Details ausblenden, nur relevante Schnittstelle zeigen |
| Schrittweises Verfeinern | von grober Idee zu immer konkreterem Algorithmus |

## Beschreibung von Algorithmen

**Pseudocode:**
```
WENN temperatur > 25 DANN
  ausgabe("warm")
SONST
  ausgabe("kalt")
ENDE WENN
```

**Flussdiagramm-Symbole:**
```
  (Start/Ende)      -> Oval
  [Verarbeitung]     -> Rechteck
  <Entscheidung>     -> Raute
```

**Struktogramm (Nassi-Shneiderman)** — Alternative zum Flussdiagramm ohne Pfeile, Verschachtelung durch Kästen:
```
+---------------------------------------+
| WENN temperatur > 25                  |
+-------------------+-------------------+
| ausgabe("warm")    | ausgabe("kalt")   |
+-------------------+-------------------+
```

## Parameter und Variablen
- **Variable**: benannter Speicherplatz für einen veränderlichen Wert.
- **Parameter**: Wert, der einer Funktion/Prozedur beim Aufruf übergeben wird.

## Prozedurale Programmierung
Programm als Folge von Prozeduren/Funktionen, die Daten über Parameter und Rückgabewerte austauschen.

> Merke: Guter Code ist lesbar — sprechende Variablennamen, Kommentare, konsistente Einrückung.

> Achtung Prüfung: Bei der Fehlersuche unterscheiden: **Syntaxfehler** (Code lässt sich nicht ausführen) vs. **semantischer Fehler** (Code läuft, macht aber das Falsche).
