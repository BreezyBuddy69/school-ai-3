# Erste Schritte im Programmieren (Scratch)

> 🧪 **Beta** — nicht in deinen OneNote-Notizen/Zusammenfassungen von Jahr 2 gefunden. Aus dem offiziellen LG-Lehrplan + ergänzender Recherche erstellt. Ersetzen/ergänzen, sobald echte Notizen vorliegen.

![Scratch-3.0-Editor mit Blockprogrammierung](https://upload.wikimedia.org/wikipedia/commons/0/0d/Scratch_3.0_editor.png)

## Was ist Scratch?
**Scratch** ist eine blockbasierte Programmiersprache (entwickelt vom MIT). Statt Code zu tippen, werden **Programmierblöcke** wie Puzzleteile zusammengesteckt — ideal, um die Grundideen des Programmierens zu lernen, bevor man Zeile für Zeile in einer Textsprache (siehe Jahr 3: Programmieren-Einführung) schreibt.

## Aufbau der Arbeitsfläche
| Bereich | Funktion |
|---|---|
| **Blockpalette** | Kategorien von Blöcken (Bewegung, Aussehen, Klang, Ereignisse, Kontrolle, Fühlen, Operatoren, Variablen) |
| **Skriptbereich** | hier werden Blöcke zu Programmen zusammengesteckt |
| **Bühne** | zeigt die **Figuren (Sprites)** und das Ergebnis des Programms |
| **Figurenliste** | alle Sprites der aktuellen Projektdatei |

## Grundlegende Blockarten
| Blocktyp | Farbe (Scratch) | Beispiel |
|---|---|---|
| **Ereignis** | gelb | „Wenn grüne Flagge angeklickt" — startet ein Skript |
| **Bewegung** | blau | „Gehe 10er Schritte", „Drehe dich um 15 Grad" |
| **Kontrolle** | orange | „Wiederhole 10 mal", „Falls … dann …" |
| **Fühlen** | hellblau | „Berührt Mauszeiger?", „Taste gedrückt?" |
| **Operatoren** | grün | Rechnen, Vergleiche (`>`, `<`, `=`) |
| **Variablen** | orange-rot | eigene Speicherplätze für Werte (z.B. Punktestand) |

## Die drei Grundbausteine (wie in „Algorithmen — Grundlagen", Jahr 1)
1. **Sequenz** — Blöcke werden der Reihe nach abgearbeitet
2. **Verzweigung** — „Falls … dann …, sonst …" — das Programm entscheidet sich für einen von zwei Wegen
3. **Schleife** — „Wiederhole …" oder „Wiederhole fortlaufend" — Blöcke werden mehrfach ausgeführt

> Merke: Jedes noch so komplexe Programm besteht letztlich nur aus diesen drei Bausteinen, kombiniert und verschachtelt.

## Einfaches Beispielprogramm
Eine Katze soll sich bewegen und bei Tastendruck die Richtung wechseln:
```
Wenn grüne Flagge angeklickt
  wiederhole fortlaufend:
    gehe 5er Schritte
    falls „Rand berührt?" dann:
      drehe dich um 180 Grad
```

## Variablen und Punktestand
Eine **Variable** speichert einen Wert, der sich während des Programms ändern kann (z.B. `Punkte = 0`). Typische Verwendung: `Punkte um 1 erhöhen`, wenn ein Ereignis eintritt (z.B. Ball trifft Ziel).

> Achtung Prüfung: Der Unterschied zwischen „Wiederhole 10 mal" (feste Anzahl Durchläufe) und „Wiederhole fortlaufend" (läuft ohne Ende, bis das Programm gestoppt wird) wird gerne verwechselt — genau hinschauen, welcher Block verwendet wird!

## Fehler finden (Debugging)
- Schritt für Schritt einzelne Blöcke anklicken und testen
- Werte von Variablen während des Laufs auf der Bühne anzeigen lassen (Kontrollkästchen)
- Kleine Teilprobleme einzeln testen, statt das ganze Programm auf einmal zu prüfen
