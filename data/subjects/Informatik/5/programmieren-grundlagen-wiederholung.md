# Programmieren: Grundlagen (Wiederholung 4. Klasse)
**Fach:** Informatik | **Klasse:** 5Wa

> ✅ Aus deinen echten OneNote-Notizen (Jahr 5) übernommen und aufbereitet.

## Verzweigungen

Ein Computer kann mit `if` Entscheidungen treffen:

```python
zahl = 10
if zahl > 5:
    print("Grösser als 5")
else:
    print("Kleiner oder gleich 5")
```

- **if**: überprüft eine Bedingung
- **else**: wird ausgeführt, wenn die Bedingung falsch ist
- **elif**: steht für „else if" (mehrere Bedingungen nacheinander)

```python
note = 5
if note == 6:
    print("Super!")
elif note == 4:
    print("Genügend")
else:
    print("Nicht genügend")
```

## Schleifen

**for-Schleife** — läuft eine bestimmte Anzahl Male:
```python
for i in range(1, 6):
    print(i)
# Ausgabe: 1, 2, 3, 4, 5
```

**while-Schleife** — läuft, solange die Bedingung wahr ist:
```python
x = 1
while x <= 5:
    print(x)
    x += 1
```

## Funktionen

Funktionen sind kleine Programme im Programm.

```python
def verdoppeln(zahl):
    return zahl * 2

print(verdoppeln(5))  # → 10
```

**Vorteile:** wiederverwendbar, übersichtlicherer Code. `return` gibt das Ergebnis zurück.

## Listen — Datensammlungen

```python
namen = ["Jayden", "Lea", "Ruben"]
print(namen[0])  # → Jayden

namen[1] = "Hannah"
print(namen)  # → ["Jayden", "Hannah", "Ruben"]
```

> Merke: Der Zugriff erfolgt über den **Index**, beginnend bei 0.

## Kurz-Zusammenfassung

| Konzept | Bedeutung |
|---|---|
| `if` / `if-else` / `if-elif-else` | Bedingte Ausführung |
| `while` | Wiederholt, solange Bedingung wahr ist |
| `def` | definiert eine Funktion |
| `return` | gibt einen Wert zurück |
| `zahlen[0]` | Zugriff über Index |
| `len(zahlen)` | Länge einer Liste |

## Übungsaufgaben (Auswahl mit Lösung)

**Alle Zahlen 1–10 ausgeben:**
```python
for i in range(1, 11):
    print(i)
```

**Prüfen, ob eine Zahl gerade ist:**
```python
def ist_gerade(zahl):
    return zahl % 2 == 0
```

**Durchschnitt von 3 Zahlen:**
```python
def durchschnitt(a, b, c):
    return (a + b + c) / 3
```

**Alle Teiler einer Zahl ausgeben:**
```python
def teiler_von(n):
    for i in range(1, n + 1):
        if n % i == 0:
            print(i)
```

> Achtung Prüfung: Weitere Wiederholungsaufgaben zum Aufwärmen für die 5. Klasse: Dreieck aus Sternen zeichnen, Passwortprüfung, Taschenrechner mit Auswahlmenü, kleinstes gemeinsames Vielfaches (kgV) — Struktur jeweils wie oben: Funktion/Befehl mit klarer Eingabe/Ausgabe.
