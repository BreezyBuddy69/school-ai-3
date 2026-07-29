> 🧪 **Beta** — nicht in deinen OneNote-Notizen/Zusammenfassungen von Jahr 3 gefunden. Aus dem offiziellen LG-Lehrplan + ergänzender Recherche erstellt. Ersetzen/ergänzen, sobald echte Notizen vorliegen.

# Kontrollstrukturen: Verzweigungen & Schleifen

Diese beiden Kontrollstrukturen kennst du bereits abstrakt aus Jahr 1 (**Verzweigung**, **Schleife**) — jetzt in echter Python-Syntax.

## Vergleichsoperatoren (Voraussetzung für Bedingungen)
| Operator | Bedeutung |
|---|---|
| `==` | gleich |
| `!=` | ungleich |
| `<` `>` | kleiner / grösser |
| `<=` `>=` | kleiner-gleich / grösser-gleich |

> Achtung Prüfung: `=` weist einen Wert zu, `==` **vergleicht** zwei Werte. Verwechslung ist einer der häufigsten Anfängerfehler.

## Logische Verknüpfungen
| Operator | Bedeutung |
|---|---|
| `and` | beide Bedingungen müssen wahr sein |
| `or` | mindestens eine Bedingung muss wahr sein |
| `not` | kehrt eine Bedingung um |

```python
alter = 16
if alter >= 12 and alter < 18:
    print("Jugendlich")
```

## Verzweigung: if / elif / else
```python
note = 4.5

if note >= 5.5:
    print("Sehr gut")
elif note >= 4.0:
    print("Genügend")
else:
    print("Ungenügend")
```

- **`if`**: prüft eine Bedingung
- **`elif`** ("else if"): weitere Bedingung, falls die erste falsch war
- **`else`**: wird ausgeführt, wenn keine Bedingung zutrifft

> Merke: Python prüft die Bedingungen **von oben nach unten** und führt nur den **ersten** zutreffenden Block aus — auch wenn eine spätere Bedingung ebenfalls wahr wäre.

### Verschachtelte Verzweigungen
```python
zahl = 12
if zahl > 0:
    if zahl % 2 == 0:
        print("Positiv und gerade")
    else:
        print("Positiv und ungerade")
else:
    print("Nicht positiv")
```

## Schleifen

### for-Schleife — feste Anzahl Wiederholungen
```python
for i in range(1, 6):
    print(i)
# Ausgabe: 1 2 3 4 5
```

`range(start, stop)` erzeugt Zahlen von `start` bis **ausschliesslich** `stop`.

```python
for i in range(0, 10, 2):   # Start, Stopp, Schrittweite
    print(i)
# Ausgabe: 0 2 4 6 8
```

### while-Schleife — solange eine Bedingung gilt
```python
x = 1
while x <= 5:
    print(x)
    x += 1   # Kurzschreibweise für x = x + 1
```

> Achtung Prüfung: Bei `while` **muss** sich innerhalb der Schleife etwas ändern, das die Bedingung irgendwann falsch macht — sonst entsteht eine **Endlosschleife**!

### for vs. while — wann was?
| Situation | Schleifentyp |
|---|---|
| Anzahl Wiederholungen von Anfang an bekannt | `for` |
| Wiederholung bis eine Bedingung erfüllt ist (unbekannt wie lange) | `while` |

## Beispiel: Zahlen zählen
```python
# Wie viele Zahlen von 1 bis 50 sind durch 3 teilbar?
anzahl = 0
for i in range(1, 51):
    if i % 3 == 0:
        anzahl += 1
print("Anzahl:", anzahl)
```

## Beispiel: Eingabe wiederholen bis gültig
```python
zahl = int(input("Gib eine Zahl zwischen 1 und 10 ein: "))
while zahl < 1 or zahl > 10:
    zahl = int(input("Ungültig! Nochmal: "))
print("Danke, du hast", zahl, "eingegeben.")
```

## Übungsaufgaben (mit Lösung)

**Gerade Zahlen von 1 bis 20 ausgeben:**
```python
for i in range(1, 21):
    if i % 2 == 0:
        print(i)
```

**Fakultät berechnen ($n!$):**
```python
n = 5
ergebnis = 1
for i in range(1, n + 1):
    ergebnis *= i
print(ergebnis)  # 120
```

> Merke: Verzweigungen und Schleifen kombiniert sind das Werkzeug für praktisch jeden Algorithmus, den du in Jahr 1 nur als Pseudocode kanntest (z. B. "grösste Zahl finden") — jetzt kannst du sie tatsächlich ausführen.
