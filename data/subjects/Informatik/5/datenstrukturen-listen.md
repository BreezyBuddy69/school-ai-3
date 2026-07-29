# Datenstrukturen: Listen
**Fach:** Informatik | **Klasse:** 5Wa

> ✅ Aus deinen echten OneNote-Notizen (Jahr 5) übernommen und aufbereitet.

## Wozu Datenstrukturen?

Variablen können nur je einen Wert speichern. Wenn viele zusammenhängende Daten verarbeitet werden müssen (z. B. 10'000 Messwerte), sind einzelne Variablen unpraktisch.

Die gebräuchlichsten Datenstrukturen:

| Struktur | Ordnung |
|---|---|
| **Liste** | keine Verzweigungen — Sonderfall eines Baums |
| **Baum** | hierarchische Ordnung — Sonderfall eines Graphen |
| **Graph** | keine innere Ordnung |

## Das Konzept der Listen

Eine Liste ist eine Datenstruktur, die eine Datensammlung unter einem Namen zusammenfasst. Auf einzelne Elemente wird über den **Index** zugegriffen (beginnend bei **0**).

```python
daten = [5, 0, -2, 3, 51, 8, 13, -100, -100, -1]
x = daten[4]       # x = 51
daten[8] = -10     # überschreibt das Element an Index 8
```

- `daten[i]` → Wert an Position i auslesen/verändern
- `len(daten)` → Anzahl Elemente
- `daten = [x] * n` → Liste mit n gleichen Werten erzeugen (z. B. `[0] * 10`)

## Wie Listen im Speicher funktionieren

### Array
Ein zusammenhängender Speicherbereich mit fester Grösse.

- **Vorteil:** direkter Zugriff auf jedes Element (**random access**)
- **Nachteil:** feste Grösse, kein nachträgliches Hinzufügen möglich

### Verkettete Liste
Jedes Element speichert zusätzlich einen „Zeiger" auf das nächste Element.

- **Vorteil:** Grösse beliebig veränderbar
- **Nachteil:** Zugriff auf ein bestimmtes Element erfordert Navigieren durch die ganze Liste

### Dynamisches Array
Kombiniert beide Vorteile: Ist das Array voll, wird automatisch ein neues, doppelt so langes Array erzeugt und alle Werte kopiert (**resize**-Operation). Python-Listen funktionieren so.

> Merke: Python-Listen sind **dynamische Datenstrukturen** — sie wachsen und schrumpfen automatisch, ganz ohne dass man sich um die Speichergrösse kümmern muss.

## Copy by Reference

```python
a = [1, 2, 3, 4, 5]
b = a
b[2] = -9
print(a)  # → [1, 2, -9, 4, 5]  — auch a hat sich verändert!
```

`b = a` kopiert **nicht** die Elemente, sondern erzeugt nur einen zweiten Namen für dieselbe Liste im Speicher. Um eine echte Kopie zu erstellen, muss jedes Element einzeln in eine neue Liste kopiert werden.

## Wichtige Listenoperationen (Python eingebaut)

| Operation | Bedeutung |
|---|---|
| `liste.append(elem)` | Element hinten hinzufügen |
| `liste.pop()` | Letztes Element entfernen |
| `liste.insert(elem, idx)` | Element an Position einfügen |
| `liste.remove(idx)` | Element an Position löschen |
| `len(liste)` | Länge der Liste |

## Eigene Listenoperationen programmieren

Da native Arrays fixe Grösse haben, müssen diese Operationen „von Hand" mit einer temporären, neuen Liste umgesetzt werden:

**Element hinzufügen (append):**
```python
def append(liste, elem):
    temp = [None] * (len(liste) + 1)
    for i in range(len(liste)):
        temp[i] = liste[i]
    temp[len(liste)] = elem
    return temp
```

**Element einfügen (insert):**
```python
def insert(liste, elem, idx):
    temp = [None] * (len(liste) + 1)
    for i in range(idx):
        temp[i] = liste[i]
    temp[idx] = elem
    for j in range(idx, len(liste)):
        temp[j + 1] = liste[j]
    return temp
```

**Element löschen (remove):**
```python
def remove(liste, idx):
    temp = [None] * (len(liste) - 1)
    for i in range(idx):
        temp[i] = liste[i]
    for j in range(idx + 1, len(liste)):
        temp[j - 1] = liste[j]
    return temp
```

**Letztes Element löschen (pop):**
```python
def pop(liste):
    temp = [None] * (len(liste) - 1)
    for i in range(len(liste) - 1):
        temp[i] = liste[i]
    return temp
```

## Hilfsfunktionen für Zahlenlisten

```python
def minimum(liste):
    min = liste[0]
    for i in range(1, len(liste)):
        if min > liste[i]:
            min = liste[i]
    return min

def min_index(liste):
    idx = 0
    min = liste[0]
    for i in range(1, len(liste)):
        if min > liste[i]:
            min = liste[i]
            idx = i
    return idx
```

## Listen durchlaufen mit for

```python
zahlen = [-3, 1, 7, 2, -6, 4, 8, 12, 0, 7]
minimum = zahlen[0]
for zahl in zahlen:
    if zahl < minimum:
        minimum = zahl
print("Der kleinste Wert der Liste ist", minimum)
```

Die `for`-Schleife erspart die manuelle Index-Verwaltung im Vergleich zur `while`-Schleife.

## Listen filtern und aufteilen

```python
zahlen = [2, 6, 7, 9, 12, 4, 5, 11]
gerade = []
ungerade = []
for zahl in zahlen:
    if zahl % 2 == 0:
        gerade.append(zahl)
    else:
        ungerade.append(zahl)
```

## Listenoperationen als eigene Algorithmen (mit Aufwandsberechnung)

Aus dem Unterricht — Berechnung des Aufwands in Abhängigkeit von n (Listenlänge):

| Operation | Aufwand |
|---|---|
| `minimum(liste)` | 2n − 1 |
| `append(liste, elem)` | n + 4 |
| `mittelwert(liste)` | n + 2 |
| `min_index(liste)` | 3n − 1 |
| `pop(liste)` | n + 2 |
| `insert(liste, elem, idx)` | 2n + 4 |
| `remove(liste, idx)` | 2n + 1 |

> Merke: Bei Operationen, die die restlichen Elemente verschieben müssen (insert, remove), hängt der genaue Aufwand zusätzlich davon ab, **an welcher Stelle** eingefügt/gelöscht wird — im schlechtesten Fall (Anfang der Liste) müssen alle folgenden Elemente verschoben werden.
