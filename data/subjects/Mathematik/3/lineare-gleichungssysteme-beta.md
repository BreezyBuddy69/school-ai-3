> 🧪 **Beta** — nicht in deinen OneNote-Notizen/Zusammenfassungen von Jahr 3 gefunden. Aus dem offiziellen LG-Lehrplan + ergänzender Recherche erstellt. Ersetzen/ergänzen, sobald echte Notizen vorliegen.

# Lineare Gleichungssysteme (LGS)

## Was ist ein LGS?
Zwei lineare Gleichungen mit zwei Unbekannten $x$ und $y$, die **gleichzeitig** erfüllt sein müssen:
$$\begin{cases} a_1x + b_1y = c_1 \\ a_2x + b_2y = c_2 \end{cases}$$

Geometrisch: zwei Geraden — die Lösung ist ihr **Schnittpunkt** (Fortsetzung von Jahr 1, wo Geraden gleichgesetzt wurden).

## Die drei Lösungsverfahren

### 1. Einsetzungsverfahren
Eine Gleichung nach einer Variable auflösen, dann in die andere einsetzen.

**Beispiel:**
```
(1) y = 2x + 1
(2) 3x + y = 11

Einsetzen von (1) in (2):
3x + (2x + 1) = 11
5x + 1 = 11
5x = 10
x = 2

Rückeinsetzen in (1): y = 2·2 + 1 = 5
Lösung: (x,y) = (2, 5)
```

### 2. Gleichsetzungsverfahren
Beide Gleichungen nach derselben Variable auflösen, dann gleichsetzen.

**Beispiel:**
```
(1) y = 3x - 2
(2) y = -x + 6

Gleichsetzen: 3x - 2 = -x + 6
4x = 8
x = 2

Einsetzen in (1): y = 3·2 - 2 = 4
Lösung: (x,y) = (2, 4)
```

### 3. Additionsverfahren (Eliminationsverfahren)
Gleichungen so mit Zahlen multiplizieren, dass beim Addieren/Subtrahieren eine Variable wegfällt.

**Beispiel:**
```
(1) 2x + 3y = 16
(2) 2x -  y = 4

(1) - (2):  4y = 12  →  y = 3
Einsetzen in (2): 2x - 3 = 4 → x = 3,5
Lösung: (x,y) = (3,5 | 3)
```

**Beispiel mit Erweitern (Koeffizienten passen nicht direkt):**
```
(1) 3x + 2y = 12   | ·2
(2) 2x + 5y = 14   | ·(-3)

(1'): 6x + 4y = 24
(2'): -6x - 15y = -42
Addieren: -11y = -18  →  y = 18/11 ≈ 1,64
```

> Merke: Beim Additionsverfahren so multiplizieren, dass die Koeffizienten einer Variable **betragsgleich** werden — dann verschwindet sie beim Addieren (gegensätzliches Vorzeichen) oder Subtrahieren (gleiches Vorzeichen).

## Die drei Lösungsfälle
| Fall | Geometrisch | Anzahl Lösungen |
|---|---|---|
| Geraden schneiden sich | ein Schnittpunkt | **genau eine** Lösung $(x,y)$ |
| Geraden sind parallel (verschieden) | kein Schnittpunkt | **keine** Lösung |
| Geraden sind identisch | unendlich viele gemeinsame Punkte | **unendlich viele** Lösungen |

> Achtung Prüfung: Fällt beim Lösen eine **wahre Aussage** ohne Variablen heraus (z. B. $0=0$), sind es unendlich viele Lösungen. Fällt eine **falsche Aussage** heraus (z. B. $0=5$), gibt es keine Lösung.

## Sachaufgaben mit LGS
**Vorgehen:**
1. Zwei Variablen benennen (was suche ich?)
2. Zwei unabhängige Bedingungen aus dem Text als Gleichungen aufstellen
3. LGS lösen (ein Verfahren wählen)
4. Ergebnis im Sachkontext auf Sinnhaftigkeit prüfen

**Beispiel:** Zwei Zahlen, deren Summe 40 und deren Differenz 8 ist.
```
(1) x + y = 40
(2) x - y = 8

(1)+(2): 2x = 48 → x = 24
Einsetzen: y = 40 - 24 = 16
```

> Merke: Ein LGS ist die konsequente Fortsetzung dessen, was du in Jahr 1 bei linearen Funktionen schon gemacht hast (Schnittpunkt zweier Geraden) — nur jetzt mit einem systematischen Rechenverfahren statt reinem Gleichsetzen der Funktionsterme.
