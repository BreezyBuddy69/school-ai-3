> 🧪 **Beta** — nicht in deinen OneNote-Notizen/Zusammenfassungen von Jahr 3 gefunden. Aus dem offiziellen LG-Lehrplan + ergänzender Recherche erstellt. Ersetzen/ergänzen, sobald echte Notizen vorliegen.

# Programmieren: Erste Schritte (Python)

## Von Pseudocode zu echtem Code
In Jahr 1 hast du Algorithmen als **Pseudocode** notiert (sprachnah, ohne feste Syntax). Jetzt schreibst du dieselben Ideen in einer echten, ausführbaren Programmiersprache: **Python**.

## Variablen
Eine Variable ist ein benannter Speicherplatz für einen Wert.

```python
alter = 15
name = "Jayden"
pi = 3.14159
ist_schueler = True
```

- Variablennamen: keine Leerzeichen, keine Sonderzeichen, nicht mit Ziffer beginnen
- `=` ist die **Zuweisung**, nicht "ist gleich" wie in der Mathematik!

> Achtung Prüfung: `x = x + 1` ist in der Mathematik falsch (keine Zahl ist gleich sich selbst plus 1), aber in der Programmierung völlig korrekt: es bedeutet "nimm den aktuellen Wert von x, addiere 1 dazu, speichere das Ergebnis wieder in x".

## Datentypen
| Typ | Bedeutung | Beispiel |
|---|---|---|
| `int` | Ganzzahl | `15` |
| `float` | Kommazahl | `3.14` |
| `str` | Zeichenkette (Text) | `"Hallo"` |
| `bool` | Wahrheitswert | `True` / `False` |

```python
print(type(15))      # <class 'int'>
print(type(3.14))     # <class 'float'>
print(type("Hallo"))  # <class 'str'>
```

## Ein- und Ausgabe

**Ausgabe** mit `print()`:
```python
print("Hallo Welt")
print("Ergebnis:", 3 + 5)
```

**Eingabe** mit `input()` — liefert **immer** einen Text (`str`), auch bei Zahlen:
```python
name = input("Wie heisst du? ")
print("Hallo,", name)

alter = int(input("Wie alt bist du? "))  # Umwandlung in int nötig!
print("In 10 Jahren bist du", alter + 10, "Jahre alt.")
```

> Achtung Prüfung: `input()` gibt immer einen **String** zurück. Ohne `int(...)` bzw. `float(...)` davor würde `alter + 10` einen Fehler verursachen oder den Text einfach aneinanderhängen statt zu rechnen.

## Rechenoperatoren
| Operator | Bedeutung | Beispiel |
|---|---|---|
| `+` `-` `*` `/` | Grundrechenarten | `7 / 2` → `3.5` |
| `//` | Ganzzahldivision | `7 // 2` → `3` |
| `%` | Rest (Modulo) | `7 % 2` → `1` |
| `**` | Potenz | `2 ** 3` → `8` |

```python
zahl = 17
print(zahl // 5)   # 3  (wie oft passt 5 in 17)
print(zahl % 5)    # 2  (was bleibt übrig)
```

> Merke: `//` und `%` gehören zusammen — jede Zahl lässt sich schreiben als `zahl = (zahl // teiler) * teiler + (zahl % teiler)`. Wichtig für spätere Themen wie Zahlensysteme und Hashing.

## Kommentare
```python
# Das ist ein Kommentar — wird vom Computer ignoriert
alter = 15  # Alter in Jahren
```

## Zusammenfassung
| Konzept | Syntax |
|---|---|
| Variable zuweisen | `name = wert` |
| Ausgabe | `print(...)` |
| Eingabe | `input("Frage: ")` |
| Typumwandlung | `int(...)`, `float(...)`, `str(...)` |
| Kommentar | `# Text` |

> Merke: Diese Grundlagen (Variablen, Ein-/Ausgabe, Datentypen) sind die Basis für alles Weitere — Verzweigungen, Schleifen und Funktionen bauen direkt darauf auf.
