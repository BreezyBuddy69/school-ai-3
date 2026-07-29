> 🧪 **Beta** — nicht in deinen OneNote-Notizen/Zusammenfassungen von Jahr 3 gefunden. Aus dem offiziellen LG-Lehrplan + ergänzender Recherche erstellt. Ersetzen/ergänzen, sobald echte Notizen vorliegen.

# Zahlensysteme: Dezimal, Binär, Hexadezimal

## Warum braucht es das?
Computer speichern und verarbeiten Daten **elektronisch** — als Zustand "Strom fliesst" (1) oder "kein Strom" (0). Deshalb rechnet Hardware intern im **Binärsystem** (Basis 2), auch wenn wir gewohnt sind, im **Dezimalsystem** (Basis 10) zu denken.

## Stellenwertsysteme allgemein
Jede Ziffer einer Zahl hat einen Wert, der von ihrer **Position** abhängt (Stellenwert = Basis hoch Position):

$$\text{Zahl} = \sum_i \text{Ziffer}_i \cdot \text{Basis}^i$$

## Dezimalsystem (Basis 10)
Ziffern 0–9. Beispiel: $375$

```
     3    7    5
   10²  10¹  10⁰
   
375 = 3·100 + 7·10 + 5·1
```

## Binärsystem (Basis 2)
Ziffern nur 0 und 1. Jede Stelle ist eine Zweierpotenz.

| Position | 2⁷ | 2⁶ | 2⁵ | 2⁴ | 2³ | 2² | 2¹ | 2⁰ |
|---|---|---|---|---|---|---|---|---|
| Wert | 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |

**Beispiel — Binär → Dezimal:** $1011_2$
```
1011 = 1·2³ + 0·2² + 1·2¹ + 1·2⁰
     = 8 + 0 + 2 + 1
     = 11 (dezimal)
```

**Beispiel — Dezimal → Binär** (Divisionsmethode, Rest notieren): $13$ in Binär
```
13 : 2 = 6  Rest 1
 6 : 2 = 3  Rest 0
 3 : 2 = 1  Rest 1
 1 : 2 = 0  Rest 1

Ergebnis von unten nach oben lesen: 1101₂
```

> Merke: Beim Umrechnen Dezimal → Binär immer fortlaufend durch 2 teilen und die Reste notieren — das Ergebnis ergibt sich, indem man die Reste **von unten nach oben** liest.

## Bit und Byte
| Begriff | Bedeutung |
|---|---|
| **Bit** | eine einzelne Binärstelle (0 oder 1) |
| **Byte** | 8 Bit zusammen |
| Werte pro Byte | $2^8 = 256$ mögliche Kombinationen (0–255) |

> Achtung Prüfung: Mit $n$ Bit lassen sich genau $2^n$ verschiedene Zustände darstellen — mit 1 Byte (8 Bit) also $2^8=256$ verschiedene Werte, nicht 8!

## Hexadezimalsystem (Basis 16)
16 "Ziffern": 0–9, dann A=10, B=11, C=12, D=13, E=14, F=15. Wird oft verwendet, weil sich **ein Byte** (8 Bit) exakt durch **2 Hex-Ziffern** darstellen lässt (je 4 Bit = 1 Hex-Ziffer).

| Dezimal | Binär | Hex |
|---|---|---|
| 10 | 1010 | A |
| 11 | 1011 | B |
| 15 | 1111 | F |
| 16 | 10000 | 10 |
| 255 | 11111111 | FF |

**Beispiel — Hex → Dezimal:** $2F_{16}$
```
2F = 2·16 + 15 = 32 + 15 = 47
```

**Beispiel — Binär ↔ Hex (4er-Gruppen bilden):** $10110101_2$
```
1011 0101
  B    5
→ B5 (hex)
```

> Merke: Hexadezimal ist praktisch, weil man nur die 8 Bit eines Bytes in zwei 4er-Häppchen aufteilen und jedes einzeln nachschlagen muss — deutlich kompakter als lange Binärzahlen (z. B. Farbcodes in Webseiten wie `#FF5733`).

## Umrechnungstabelle (kompakt)
| Dezimal | Binär | Hex |
|---|---|---|
| 0 | 0000 | 0 |
| 5 | 0101 | 5 |
| 9 | 1001 | 9 |
| 12 | 1100 | C |
| 15 | 1111 | F |

## Anwendungsbeispiel in Python
```python
zahl = 13
print(bin(zahl))   # '0b1101'  → Binärdarstellung
print(hex(zahl))    # '0xd'     → Hexadezimaldarstellung
print(int("1101", 2))  # 13     → Binär-String zurück zu Dezimal
```

> Merke: Zahlensysteme sind die Grundlage dafür, wie Daten überhaupt im Computer **gespeichert** werden — direkte Vorbereitung auf Datenstrukturen (Jahr 5), wo du lernst, wie diese Bytes zu Listen und komplexeren Strukturen organisiert werden.
