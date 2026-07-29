# Algorithmen — Grundlagen

## Was ist ein Algorithmus?
Eine eindeutige, endliche Abfolge von Schritten, die ein Problem löst. Eigenschaften: **eindeutig**, **endlich**, **ausführbar**, **allgemeingültig** (für eine Klasse von Eingaben).

## Grundbausteine (Kontrollstrukturen)
- **Sequenz**: Schritte nacheinander
- **Verzweigung** (if/else): abhängig von Bedingung anderer Pfad
- **Schleife** (for/while): wiederholte Ausführung solange Bedingung gilt

## Darstellung
- **Pseudocode**: sprachnahe Notation ohne konkrete Syntax
- **Flussdiagramm**: grafisch mit Symbolen (Raute = Entscheidung, Rechteck = Verarbeitung)

## Beispiel: größte Zahl finden
```
max = liste[0]
für jede zahl in liste:
    wenn zahl > max:
        max = zahl
gib max zurück
```

## Effizienz — Grössenordnung
Wie stark wächst die Laufzeit mit der Eingabegrösse n?
| Notation | Bedeutung | Beispiel |
|---|---|---|
| O(1) | konstant | Zugriff auf Array-Index |
| O(n) | linear | einmal durch die Liste laufen |
| O(n²) | quadratisch | verschachtelte Schleife (z.B. Bubble Sort) |
| O(log n) | logarithmisch | binäre Suche in sortierter Liste |

## Binäre Suche (Prinzip)
Voraussetzung: sortierte Liste. Vergleiche mit der Mitte, halbiere den Suchbereich je nach Ergebnis — deutlich schneller als lineares Durchsuchen bei grossen Listen.
