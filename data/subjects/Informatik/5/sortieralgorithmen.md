# Sortieralgorithmen: Bubblesort und Selectionsort
**Fach:** Informatik | **Klasse:** 5Wa

> ✅ Aus deinen echten OneNote-Notizen (Jahr 5) übernommen und aufbereitet.

## Bubblesort

Idee: Zwei nebeneinanderstehende Werte werden verglichen und vertauscht, wenn sie in falscher Reihenfolge stehen (grösserer Wert links). Das grösste Element „blubbert" so bei jedem Durchgang ans Ende.

```python
def bubblesort(liste):
    end = len(liste) - 1
    while end > 0:
        i = 0
        while i < end:
            if liste[i] > liste[i + 1]:
                temp = liste[i]
                liste[i] = liste[i + 1]
                liste[i + 1] = temp
            i += 1
        end -= 1
    return liste
```

### Aufwand von Bubblesort

- Um das grösste von n Elementen ganz nach hinten zu bringen: n−1 Vergleiche, im schlechtesten Fall je 4 Operationen (3 für den Tausch + 1 Vergleich)
- Für die restlichen Durchgänge sinkt die Anzahl Vergleiche jeweils um 1
- Anzahl Vergleiche insgesamt: $\frac{(n-1) \cdot n}{2}$

$$\text{Gesamtaufwand} = \frac{(n-1) \cdot n}{2} \cdot 4 = 2n^2 - 2n$$

> Merke: Bubblesort hat **quadratischen** Aufwand (n² wächst viel schneller als n) — für grosse Listen ineffizient.

## Selectionsort

Idee: In jedem Durchgang wird das kleinste Element der noch unsortierten Restliste gesucht und an den Anfang dieser Restliste getauscht.

```
1. start_index = 0
2. SOLANGE start_index < letzter Index der Liste:
   a. min_index = start_index
   b. Durchlaufe die Liste ab start_index + 1:
      - Wenn Element an Index i < Element an min_index: min_index = i
   c. Tausche Element an start_index mit Element an min_index
   d. start_index += 1
3. Gib die Liste zurück
```

> Achtung Prüfung: Der Unterschied zu Bubblesort — bei Selectionsort wird pro Durchgang nur **einmal getauscht** (am Ende, wenn das Minimum gefunden ist), bei Bubblesort potenziell mehrfach pro Durchgang.

## Mergesort

Im Unterricht als drittes Sortierverfahren genannt (Lernziel: Strategie erklären können — Code-Details ausdrücklich **nicht** prüfungsrelevant laut Lernzielkatalog).

> 🧪 **Beta** — die genaue Funktionsweise von Mergesort (Teile-und-herrsche-Prinzip) wurde in deinen Notizen nur erwähnt, nicht im Detail ausgeführt. Aus dem allgemeinen Lehrplan ergänzt: Mergesort teilt die Liste rekursiv in Hälften, sortiert diese einzeln und führt sie dann sortiert wieder zusammen ("merge"). Aufwand: $O(n \log n)$ — deutlich effizienter als Bubblesort/Selectionsort bei grossen Listen. Ersetzen/ergänzen, sobald echte Notizen vorliegen.
