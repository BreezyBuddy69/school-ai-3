# Algorithmen: Korrektheit und Effizienz
**Fach:** Informatik | **Klasse:** 5Wa

> ✅ Aus deinen echten OneNote-Notizen (Jahr 5) übernommen und aufbereitet.

## Grundbegriffe

- **Programm:** eine bestimmte Folge von Befehlen, die eine Maschine der Reihe nach ausführt. Diese Folge kann auch sinnlos sein.
- **Algorithmus:** ein konkret ausformulierter Weg, um ein Problem zu lösen — so detailliert, dass eine Maschine ihn ausführen kann.

## Bewertungskriterien für Algorithmen

| Kriterium | Bedeutung |
|---|---|
| **Korrektheit** | Der Algorithmus muss das gegebene Problem tatsächlich und sicher lösen |
| **Effizienz** | Der Algorithmus soll möglichst wenig Aufwand ("Arbeit") verursachen |

> Merke: Bei der Berechnung/Abschätzung des Aufwands wird immer vom **schlechtesten Fall** ausgegangen.

## Aufwand berechnen — Vorgehen

Für jede Operation (Zeile) im Algorithmus wird gezählt, wie oft sie ausgeführt wird, in Abhängigkeit von **n** (Grösse der Eingabe). Am Ende ergibt die Summe eine Formel in n.

### Beispiel: `summe(liste)`
```python
def summe(liste):
    ergebnis = 0
    for i in range(len(liste)):
        ergebnis += liste[i]
    return ergebnis
```
Aufwand: **1 + 1·n = n + 1**

### Beispiel: `minimum(liste)`
```python
def minimum(liste):
    min = liste[0]
    for i in range(1, len(liste)):
        if min > liste[i]:
            min = liste[i]
    return min
```
Aufwand: **1 + 2·(n−1) = 2n − 1**

### Beispiel: `append(liste, elem)`
Aufwand: **n + 4**

### Beispiel: `min_index(liste)`
Aufwand: **3n − 1**

### Beispiel: `insert(liste, elem, idx)`
Aufwand hängt zusätzlich vom Einfüge-Index `idx` ab: **2n − idx + 4**

### Beispiel: `remove(liste, idx)`
Aufwand: **2n − idx + 1**

## Grafische Darstellung

Der Aufwand wird oft als Funktion von n grafisch dargestellt (n auf der x-Achse, Anzahl Operationen auf der y-Achse). Lineare Aufwände (wie `n + 1`, `2n − 1`) ergeben Geraden mit unterschiedlicher Steigung — je grösser der Faktor vor n, desto steiler die Gerade und desto weniger effizient der Algorithmus bei grossen n.

> Achtung Prüfung: Beim Vergleichen zweier Algorithmen mit demselben Ziel (z. B. zwei Varianten von `minimum`) zählt für grosse n vor allem der **Faktor vor n** (die Steigung), nicht die additive Konstante.
