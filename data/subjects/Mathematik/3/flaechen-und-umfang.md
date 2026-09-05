> ✅ Aus deinen echten OneNote-Notizen (Jahr 3) übernommen und aufbereitet.

# Flächeninhalt & Umfang ebener Figuren

Behandelt im Kapitel **"02 Terme für Umfang und Fläche"** — eigene Notizen zeigen, wie Flächeninhalt $A$ und Umfang $u$ zusammengesetzter Rechtecksfiguren als **Terme mit Variablen** hergeleitet werden (Brücke zwischen Termumformung und Geometrie, siehe auch `data/subjects/Mathematik/1/gleichungen.md` für die Termumformungs-Grundlagen).

## Übersicht der Grundformeln
| Figur | Flächeninhalt $A$ | Umfang $U$ |
|---|---|---|
| Quadrat | $a^2$ | $4a$ |
| Rechteck | $a\cdot b$ | $2(a+b)$ |
| Dreieck | $\dfrac{g\cdot h}{2}$ | $a+b+c$ |
| Parallelogramm | $g\cdot h$ | $2(a+b)$ |
| Trapez | $\dfrac{(a+c)}{2}\cdot h$ | $a+b+c+d$ |

## Terme für zusammengesetzte Rechtecksfiguren herleiten (eigene Herleitung)
Eigenes Beispiel: ein Rechteck mit den Seiten $(2a+b)$ und $b$, zusammengesetzt aus zwei kleineren Rechtecken.
```
Flächeninhalt als Produktterm:
A = (2a+b)·b = 2ab + b²

Umfang:
u = (a+a+b+b)·2 = (2a+2b)·2 = 4a+4b
```

> Merke: **Produktterm** (Länge · Breite) und **Summenterm** (nach Ausmultiplizieren) beschreiben denselben Flächeninhalt — das systematische Ineinander-Umwandeln ist genau das, was in diesem Kapitel geübt wird, direkt als Vorbereitung auf die binomischen Formeln (eigenes Thema).

**Zweites eigenes Beispiel:** Rechteck mit Seiten $(b+a)$ und $a$ (aus zwei Streifen zusammengesetzt):
```
A = (b+a)·a = a·b + a·a
U = 2a + 2b·2 = 4a + 4b
```

## Dreieck
```
        /\
       /  \
    h /    \
     /______\
        g
```
$$A = \frac{g\cdot h}{2}$$
$g$ = Grundseite, $h$ = Höhe **senkrecht** zur Grundseite (nicht die schräge Seite!).

**Beispiel:** $g=8\text{ cm}$, $h=5\text{ cm}$
$$A = \frac{8\cdot5}{2} = 20\text{ cm}^2$$

## Parallelogramm
$$A = g\cdot h$$
Ein Parallelogramm lässt sich durch Verschieben eines Dreiecks in ein Rechteck umwandeln — daher **ohne** den Faktor $\tfrac12$.

## Trapez
Ein Trapez hat zwei parallele Seiten $a$ (länger) und $c$ (kürzer):
$$A = \frac{a+c}{2}\cdot h$$

**Herleitung:** Der Mittelwert der beiden parallelen Seiten $\tfrac{a+c}{2}$ entspricht der Grundseite eines flächengleichen Rechtecks mit derselben Höhe $h$.

**Beispiel:** $a=10\text{ cm}$, $c=6\text{ cm}$, $h=4\text{ cm}$
$$A = \frac{10+6}{2}\cdot4 = 8\cdot4 = 32\text{ cm}^2$$

> Achtung Prüfung: Bei zusammengesetzten Figuren immer zuerst in bekannte Grundfiguren **zerlegen** (oder ein grösseres Rechteck ergänzen und Teile abziehen), dann Teilflächen einzeln berechnen und addieren/subtrahieren.

> Merke: Diese Grundformeln sind die 2D-Basis für die Kreisberechnung (eigenes Thema) und die Körperberechnung (Prisma, Pyramide — eigenes Thema), wo Grund- und Mantelflächen aus genau diesen ebenen Figuren bestehen.
