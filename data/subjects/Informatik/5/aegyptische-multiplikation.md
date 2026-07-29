# Ägyptische Multiplikation
**Fach:** Informatik | **Klasse:** 5Wa

> ✅ Aus deinen echten OneNote-Notizen (Jahr 5) übernommen und aufbereitet.

## Idee

Ein Algorithmus zur Multiplikation zweier natürlicher Zahlen **ohne** die Zahlen direkt zu multiplizieren — nur durch Verdoppeln und Addieren. Historisches Verfahren aus dem alten Ägypten.

## Algorithmus `egypt_multiply(zahl1, zahl2)`

**Eingabe:** zwei natürliche Zahlen
**Ausgabe:** das Produkt der beiden Zahlen

1. Die kleinere der beiden Zahlen wird `a` genannt, die grössere `b`
2. Zwei leere Listen `dopp` und `summe` anlegen
3. Zählvariable `i = 1`
4. **Solange** `i <= a`:
   - `i` an die Liste `dopp` anhängen
   - `b` an die Liste `summe` anhängen
   - `i` verdoppeln, `b` verdoppeln
5. `ergebnis = 0`, Zählvariable `j` = höchster Index von `dopp`
6. **Solange** `a > 0`:
   - Wenn `a >= dopp[j]`: `ergebnis += summe[j]`, `a -= dopp[j]`
   - `j` um 1 verringern
7. `ergebnis` zurückgeben

## Warum das funktioniert

Jede Zahl lässt sich als Summe von Zweierpotenzen darstellen (Binärdarstellung). Die Liste `dopp` enthält verdoppelte Werte von 1 an (1, 2, 4, 8, …) — das sind genau die Zweierpotenzen. `summe` enthält die entsprechend oft verdoppelten Werte von `b`. Durch Rückwärtsgehen durch `dopp` und Abziehen von `a` wird `a` in Zweierpotenzen zerlegt, und die passenden verdoppelten `b`-Werte werden aufsummiert — das Ergebnis ist `a · b`.

> Merke: Das Prinzip ist eng mit der **binären Darstellung von Zahlen** verwandt — jede Zahl als Summe von Zweierpotenzen.
