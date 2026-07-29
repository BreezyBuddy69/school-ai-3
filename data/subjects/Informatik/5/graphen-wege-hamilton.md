# Graphen, Wege und Hamilton'sche Wege
**Fach:** Informatik | **Klasse:** 5Wa

> ✅ Aus deinen echten OneNote-Notizen (Jahr 5) übernommen und aufbereitet.

## Von der Realität zum Graphen (Abstraktion)

Wenn man z. B. alle Wege durch einen Park auflisten will, vereinfacht man zuerst die Realität: Alle Verzweigungs-/Kreuzungsstellen erhalten einen Namen bzw. ein Symbol. Diesen Vorgang nennt man **Abstraktion**.

Das Ergebnis ist ein **Graph**:
- **Knoten:** die wichtigen Stellen (z. B. Brücke, Eiche, See, …)
- **Kanten:** die Linien, die zwei Knoten direkt verbinden

Eine Kante wird als Paar von Knoten notiert, z. B. `[E, S]` für den direkten Weg zwischen Eiche und See.

## Wege beschreiben

Ein **Weg** ist eine Folge von Knoten, wobei zwischen je zwei aufeinanderfolgenden Knoten eine Kante existieren muss. Wege lassen sich als Wörter über dem Alphabet der Knotensymbole schreiben, z. B. `BESTA`.

- **Kreis:** ein Weg, dessen Endknoten gleich sind (er endet dort, wo er begann)
- **Einfacher Weg:** ein Weg ohne Kreise — kein Knoten kommt zweimal vor
- **Länge eines Weges:** Anzahl der Kanten = Anzahl der Knoten − 1

## Alle einfachen Wege systematisch auflisten (Suchbaum)

Um sicherzugehen, keinen Weg zu vergessen, verwendet man ein **Baumdiagramm (Suchbaum)**:
- Die Wurzel ist der Startknoten
- Jeder Ast verzweigt sich zu allen direkt erreichbaren, noch nicht besuchten Knoten
- Äste, die zu bereits besuchten Knoten zurückführen würden, werden nicht fortgesetzt (sonst kein einfacher Weg mehr)

> Merke: Ein Suchbaum ist ein Baumdiagramm, das gezielt nach Wegen mit bestimmten Eigenschaften sucht.

## Hamilton'sche Wege

Ein **Hamilton'scher Weg** ist ein einfacher Weg, der **alle Knoten** des Graphen genau einmal beinhaltet. Seine Länge entspricht immer der Anzahl der Knoten minus 1.

**Strategien, um den Suchbaum kleiner zu halten:**
1. Vermeide es, in den Zielknoten überzugehen, solange noch nicht alle anderen Knoten besucht wurden
2. Suche den Hamilton'schen Weg wahlweise in umgekehrter Richtung — bei einem Hamilton'schen Weg ist die Richtung egal, da jede Kante in beide Richtungen begehbar ist

> Achtung Prüfung: Nicht jeder Graph besitzt zwischen zwei gegebenen Knoten einen Hamilton'schen Weg — das muss im Suchbaum explizit überprüft werden (Sackgassen sind möglich).

## Binäre Darstellung von Graphen (Nachbarschaftsmatrix)

Um Graphen computertauglich (binär) darzustellen, verwendet man die **Nachbarschaftsmatrix**:

- Tabelle mit so vielen Zeilen wie Spalten wie es Knoten gibt
- Zeilen und Spalten sind mit den Knotennamen beschriftet
- Feld = 1, wenn zwischen dem Zeilen- und dem Spaltenknoten eine direkte Kante besteht, sonst 0

**Beispiel** (Knoten R, S, H, K, Z, W, A):

| | R | S | H | K | Z | W | A |
|---|---|---|---|---|---|---|---|
| **R** | 0 | 1 | 1 | 1 | 0 | 0 | 0 |
| **S** | 1 | 0 | 1 | 0 | 1 | 0 | 0 |
| **H** | 1 | 1 | 0 | 1 | 1 | 0 | 0 |
| **K** | 1 | 0 | 1 | 0 | 0 | 1 | 0 |
| **Z** | 0 | 1 | 1 | 0 | 0 | 1 | 0 |
| **W** | 0 | 0 | 0 | 1 | 1 | 0 | 1 |
| **A** | 0 | 0 | 0 | 0 | 0 | 1 | 0 |

Schreibt man die Zeilen hintereinander als ein einziges Wort über {0,1}, erhält man die **binäre Codierung** des Graphen. Die Wortlänge ist immer eine Quadratzahl (Anzahl Knoten²), da Zeilen- und Spaltenzahl gleich sind — aus der Länge lässt sich also die Knotenzahl zurückrechnen (aber **nicht** die Knotennamen — die müssen separat festgelegt werden).

## Wege in der Nachbarschaftsmatrix suchen (ohne Graph zu zeichnen)

Man kann Suchbäume auch direkt aus der Matrix aufbauen: Ausgehend von einem Startknoten liest man in dessen **Zeile** ab, zu welchen Knoten eine direkte Kante (Eintrag 1) besteht, und verzweigt den Suchbaum entsprechend — Schritt für Schritt, ohne den Graphen zeichnen zu müssen.
