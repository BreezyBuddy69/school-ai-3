> ✅ Aus deinen echten OneNote-Notizen (Jahr 3) übernommen und aufbereitet.

# Satz des Pythagoras

Behandelt im Kapitel **"12 Pythagoras: Musik – Harmonie – Zahl"** (Notizbuch `Mikus Jayden LG` / Inhaltsbibliothek) sowie in der Hausübung **"ÜZ – Satz des Pythagoras"** mit vollständigen Lösungen.

## Der Satz
In jedem **rechtwinkligen** Dreieck gilt: Die Summe der Kathetenquadrate ist gleich dem Quadrat der Hypotenuse.

$$c^2 = a^2 + b^2$$

wobei $c$ die **Hypotenuse** (die Seite gegenüber dem rechten Winkel, die längste Seite) ist, und $a, b$ die **Katheten** (die beiden Seiten am rechten Winkel).

```
        |\
        | \
     b  |  \  c (Hypotenuse)
        |   \
        |____\
          a
```

## Bildlicher Beweis (aus dem Merkheft)
Zeichnet man über jeder Dreiecksseite ein Quadrat, zeigt der Flächenvergleich: Fläche des grossen Quadrats ($c^2$) = Summe der Flächen der beiden kleinen Quadrate ($a^2+b^2$).

$$a^2 + b^2 = c^2$$

## Nach der gesuchten Seite umstellen
| Gesucht | Formel |
|---|---|
| Hypotenuse $c$ | $c = \sqrt{a^2+b^2}$ |
| Kathete $a$ | $a = \sqrt{c^2-b^2}$ |
| Kathete $b$ | $b = \sqrt{c^2-a^2}$ |

> Achtung Prüfung: Beim Auflösen nach einer Kathete wird **subtrahiert**, nicht addiert! Verwechslung von $c^2-b^2$ mit $c^2+b^2$ ist der häufigste Fehler.

## Rechenbeispiele aus der Hausübung
**Hypotenuse gesucht:** $a=3\text{ cm}$, $b=4\text{ cm}$
```
c = √(3² + 4²) = √(9+16) = √25 = 5 cm
```

**Kathete gesucht:** $c=13\text{ cm}$, $a=5\text{ cm}$
```
b = √(c² - a²) = √(169 - 25) = √144 = 12 cm
```

## Anwendung: Dachfläche einer Pyramide
Eine typische Prüfungsaufgabe aus deiner ÜZ verlangt, mit Pythagoras zuerst die **Seitenhöhe** eines Pyramidendachs zu berechnen (Höhe der Dreiecksseitenfläche), bevor man die Dachfläche (Mantelfläche) bestimmen kann — Pythagoras ist hier ein **Zwischenschritt**, nicht das Endergebnis.

## Die Umkehrung: Ist ein Dreieck rechtwinklig?
Gilt in einem Dreieck mit Seiten $a\leq b\leq c$ die Beziehung $a^2+b^2=c^2$, dann ist das Dreieck **rechtwinklig** (mit rechtem Winkel gegenüber $c$).

**Beispiel:** Dreieck mit Seiten 6, 8, 10:
$$6^2+8^2 = 36+64 = 100 = 10^2 \implies \text{rechtwinklig!}$$

> Merke: **Pythagoreische Zahlentripel** wie $(3,4,5)$, $(6,8,10)$, $(5,12,13)$ lohnt sich auswendig zu kennen — sie tauchen ständig in Prüfungsaufgaben auf.

## Anwendungen (auch in eigenen Hausübungen geübt: Steigung, Raumdiagonale)
- **Diagonale im Rechteck:** $d = \sqrt{a^2+b^2}$
- **Höhe im gleichseitigen Dreieck** mit Seite $a$: $h = \sqrt{a^2-\left(\tfrac{a}{2}\right)^2} = \frac{a}{2}\sqrt{3}$
- **Raumdiagonale im Quader** (zweimal anwenden): $d = \sqrt{a^2+b^2+c^2}$
- **Steigung/Neigungswinkel:** wird die Höhendifferenz und die horizontale Distanz gegeben, liefert Pythagoras die tatsächliche (schräge) Streckenlänge

**Beispiel Raumdiagonale Quader** $a=3, b=4, c=12$:
```
Schritt 1 (Grundfläche-Diagonale): e = √(3²+4²) = √25 = 5
Schritt 2 (Raumdiagonale): d = √(e²+c²) = √(25+144) = √169 = 13
```

> Merke: Bei 3D-Anwendungen wendet man den Satz des Pythagoras oft **zweimal hintereinander** an — zuerst in der Grundfläche, dann für die räumliche Diagonale. Das ist die direkte Vorbereitung auf die Stereometrie in Jahr 5 (z. B. Mantellinie des Kegels).
