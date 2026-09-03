# Algorithmen und Programme

> ✅ Aus deinen echten OneNote-Notizen (Jahr 4) übernommen und aufbereitet.

## Grundstrukturen

Jeder Algorithmus besteht aus drei Bausteinen:

| Baustein | Bedeutung | In Python |
|---|---|---|
| **Sequenz** | Schritte nacheinander ausführen | Zeile für Zeile |
| **Selektion** | Verzweigung — abhängig von einer Bedingung anders reagieren | `if` / `if-else` / `if-elif-else` |
| **Iteration** | Wiederholung | `for i in range(...)` / `while` |

> Merke: In der Unterstufe kannten wir `repeat 4:` — das gibt es nur in TigerJython, nicht im echten Python. Ab jetzt **immer** `for i in range(4):` verwenden.

## Variablen

Eine Variable ist ein **Behälter/Schublade**, in dem genau ein Wert gespeichert wird. Die Beschriftung (Name) bleibt gleich, der Inhalt ist veränderbar.

```python
farbe = "blau"
zahl = 42
```

Links vom `=` steht **immer** der Variablenname, rechts der Wert (`=` ist Zuweisung, nicht „ist gleich" wie in der Mathematik).

**Namensregeln:**
1. Muss mit einem Buchstaben beginnen, danach Ziffern/Sonderzeichen erlaubt, **keine Umlaute**.
2. Ein zusammenhängender Ausdruck, keine Leerzeichen.
3. Empfohlen: keine Grossbuchstaben, sprechende Namen, mehrere Wörter mit `_` verbinden (**snake_case**), z. B. `lieblingsfarbe_von_lisa`.

> Achtung Prüfung: Wird einer Variable ein neuer Wert zugewiesen, geht der alte Wert **für immer** verloren.

## Datentypen

| Typ | Bedeutung | Beispiel |
|---|---|---|
| `int` | Ganze Zahl | `42` |
| `float` | Fliesskommazahl | `3.14` |
| `str` | Text (**immer** in Anführungszeichen) | `"blau"` |
| `bool` | Wahrheitswert — **ohne** Anführungszeichen | `True` / `False` |

## Operatoren

**Rechnen mit Zahlen:**

| Operator | Beispiel | Bedeutung |
|---|---|---|
| `+` `-` `*` | `3 + 4`, `4 - 3`, `4 * 3` | Grundrechenarten |
| `**` | `4 ** 3` → `64` | Potenzieren |
| `/` | `5 / 3` → `1.666...` | Dividieren (float) |
| `//` | `5 // 3` → `1` | Ganzzahlige Division — **immer abgerundet** |
| `%` | `5 % 3` → `2` | Modulo (Rest der ganzzahligen Division) |

$$\text{zahl} = (\text{zahl} \mathbin{//} \text{teiler}) \times \text{teiler} + (\text{zahl} \bmod \text{teiler})$$

**Rechnen mit Text (String-Operatoren):**

| Operator | Beispiel | Ergebnis |
|---|---|---|
| `+` | `"Ana" + "nas"` | `Ananas` (Konkatenation) |
| `*` | `"hop" * 3` | `hophophop` |
| `\n` | `"Hallo\nWelt"` | Zeilenumbruch (nur in Strings) |

**Vergleichsoperatoren** (Ergebnis ist immer `bool`):

| `==` | `!=` | `<` | `>` | `<=` | `>=` |
|---|---|---|---|---|---|
| gleich | ungleich | kleiner | grösser | kleiner/gleich | grösser/gleich |

> Achtung Prüfung: Strings werden nach **ASCII-Code** verglichen. Ziffern < Grossbuchstaben < Kleinbuchstaben, z. B. `"9" < "A"` und `"Z" < "a"`. Umlaute (ö, ä, ü) liegen ganz am Ende.

**Logische Operatoren** (verknüpfen mehrere Bedingungen):

| `and` (UND) | `or` (ODER) | `not` (NICHT) |
|---|---|---|
| wahr nur wenn **beide** Seiten wahr | wahr wenn **mindestens eine** Seite wahr | kehrt den Wahrheitswert um |

```python
x >= 10 and x < 100        # alle Zahlen von 10 bis 99
name != "Donald" and name != "Elon"
not x > 10                  # gleichbedeutend mit x <= 10
```

> Achtung Prüfung: Bei `and`/`or` muss auf **jeder** Seite eine vollständige Bedingung stehen. `x >= 10 and < 100` ist **falsch**, richtig ist `x >= 10 and x < 100`. Bei mehr als zwei verknüpften Bedingungen: Klammern setzen für Übersichtlichkeit, z. B. `(x > 10 and x < 20) or (x > 30 and x < 40)`.

**Zuweisungs-Kurzschreibweise:**

| Operator | Wirkung | Beispiel |
|---|---|---|
| `+=` | Wert addieren (bei `str`: konkatenieren) | `x += 3` |
| `-=` | Wert subtrahieren | `x -= 2` |
| `*=` | Wert multiplizieren | `x *= 4` |
| `/=` | Wert dividieren | `x /= 2` |

## Verzweigungen (Selektion)

```python
if x > 5:
    print("grösser als 5")
elif x == 5:
    print("genau 5")
else:
    print("kleiner als 5")
```

- **if**: Bedingung prüfen, bei `True` Block ausführen
- **else**: wird ausgeführt, wenn `if` falsch war
- **elif** (= „else if"): weitere Bedingung, mehrere Zweige möglich — es wird **genau ein** Zweig ausgeführt (der erste, der zutrifft)

## Schleifen (Iteration)

**for mit range:**

```python
for i in range(4):          # 0,1,2,3
for i in range(5, 11):      # 5..10
for i in range(20, 150, 2): # 20,22,24,...,148 (Startwert, Endwert exklusiv, Schrittweite)
for i in range(10, 0, -1):  # rückwärts: 10,9,...,1
```

**while** — läuft, solange die Bedingung wahr ist:

```python
i = 100
while i > 0:
    print(i)
    i -= 1
```

> Achtung Prüfung: Ändert sich der Wert in der Bedingung nie, entsteht eine **Endlosschleife** (das Programm „terminiert" nicht). Mit `break` kann eine Schleife sofort abgebrochen werden.

## Flussdiagramme

Bausteine zur Visualisierung von Programmen mit Verzweigungen:

```
  einfache Anweisung  -> Rechteck
  Bedingung (if/while) -> Raute
  Programmfluss        -> Pfeile
  Zusammenführung nach Verzweigung -> Punkt
```

## Ein- und Ausgabe

```python
print("Ergebnis:", 3 + 5)
name = input("Wie heisst du? ")           # input() liefert IMMER einen String
alter = int(input("Wie alt bist du? "))   # Umwandlung nötig für Zahlen
```

## Parameter und Funktionen

**Parameter** sind Variablen, die beim Aufruf eines Befehls in Klammern übergeben werden — dadurch kann ein Befehl für beliebige Werte statt nur einen festen Fall funktionieren:

```python
def quadrat(seite):
    for i in range(4):
        forward(seite)
        right(90)

quadrat(100)   # Quadrat mit Seitenlänge 100
quadrat(40)    # dasselbe Programm für Seitenlänge 40
```

Mehrere Parameter sind möglich:

```python
def vieleck(anzahl, seite):
    for i in range(anzahl):
        forward(seite)
        right(360 / anzahl)
```

**Funktion vs. Befehl:** Ein „einfacher" Befehl führt nur eine Tätigkeit aus. Eine **Funktion** gibt zusätzlich mit `return` einen Wert an das Programm zurück:

```python
def verdopple(zahl):
    return zahl * 2

zahl2 = verdopple(4) + 5   # zahl2 = 13

def flaeche_rechteck(a, b):
    return a * b
```

> Merke: `return` beendet die Funktion und liefert das Ergebnis an die Stelle zurück, wo die Funktion aufgerufen wurde — der Ausdruck kann direkt weiterverwendet werden, z. B. in `print(verdopple(19))` oder `16 - verdopple((19 + 8) % 12) / 3`.

**Wichtige Python-Funktionen aus der `math`-Bibliothek:**

| Mathe | Python |
|---|---|
| $\|x\|$ | `abs(x)` |
| $\sqrt{x}$ | `sqrt(x)` |
| $b^r$ | `pow(b, r)` |

## Modularer Programmentwurf

Grosse Aufgaben in kleine Bausteine zerlegen: kleine Befehle schreiben, diese zu grösseren Programmen kombinieren. Eigene Befehle können in einer eigenen Datei (Bibliothek) gespeichert und importiert werden:

```python
from meine_befehle import *
```

## Turtle-Grafik (Bibliothek `gturtle`)

```python
from gturtle import *
makeTurtle()
hideTurtle()          # Turtle ausblenden, Zeichnung erscheint sofort
```

| Befehl | Wirkung |
|---|---|
| `forward(n)` / `back(n)` | n Pixel vor/zurück |
| `left(winkel)` / `right(winkel)` | auf der Stelle drehen |
| `setPenColor(farbe)` / `setPenWidth(breite)` | Stiftfarbe/-breite |
| `penUp()` / `penDown()` | Stift heben/senken (bewegen ohne zeichnen) |
| `clear()` | Zeichnung löschen |
| `delay(ms)` | Millisekunden warten |

> Achtung Prüfung: In der Aufgabensammlung erlaubte Befehlsmenge (typische Prüfungsvorgabe): `print`, `for i in range(...)`, `from gturtle import *`, `makeTurtle()`, `hideTurtle()`, `forward()`, `back()`, `left()`, `right()`, `setPenColor()`, `setPenWidth()`, `penUp()`, `penDown()`, `def`, `return`, `input()`, `if`/`else`.

## Fehlersuche

- **Syntaxfehler**: Code lässt sich nicht ausführen.
- **Semantischer Fehler**: Code läuft, macht aber das Falsche.
