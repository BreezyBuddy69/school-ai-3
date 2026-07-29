> 🧪 **Beta** — nicht in deinen OneNote-Notizen/Zusammenfassungen von Jahr 3 gefunden. Aus dem offiziellen LG-Lehrplan + ergänzender Recherche erstellt. Ersetzen/ergänzen, sobald echte Notizen vorliegen.

# Quadratwurzeln — Grundlagen

## Definition
Die Quadratwurzel $\sqrt{a}$ ist diejenige **nicht-negative** Zahl, die mit sich selbst multipliziert $a$ ergibt:
$$\sqrt{a} = b \iff b^2 = a \quad \text{und} \quad b \geq 0 \qquad (a \geq 0)$$

**Beispiel:** $\sqrt{25} = 5$, weil $5^2 = 25$.

> Achtung Prüfung: $\sqrt{a}$ ist per Definition **immer positiv (oder 0)** — auch wenn $x^2=25$ zwei Lösungen hat ($x=5$ und $x=-5$), gilt $\sqrt{25} = 5$, nicht $\pm5$.

## Quadratzahlen kennen (Basis für Kopfrechnen)
| $n$ | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| $n^2$ | 1 | 4 | 9 | 16 | 25 | 36 | 49 | 64 | 81 | 100 | 121 | 144 |

## Rationale und irrationale Zahlen
Nicht jede Quadratwurzel ergibt eine "glatte" Zahl:
- $\sqrt{16} = 4$ → **rational** (Quadratzahl)
- $\sqrt{2} = 1{,}41421356\ldots$ → **irrational** (unendlicher, nicht periodischer Dezimalbruch)

## Spirale des Theodorus (Wurzelschnecke)

![Spirale des Theodorus: rechtwinklige Dreiecke zeigen geometrisch die Längen √2, √3, √4, ... als Hypotenusen aufeinanderfolgender Dreiecke](https://upload.wikimedia.org/wikipedia/commons/9/9f/Spiral_of_Theodorus.svg)

Diese Konstruktion macht sichtbar, dass Wurzeln reale, konstruierbare **Streckenlängen** sind: Jedes rechtwinklige Dreieck hat Katheten der Länge 1 und $\sqrt{n}$, die Hypotenuse ist dann $\sqrt{n+1}$ (nach Pythagoras). So entstehen nacheinander $\sqrt{2}, \sqrt{3}, \sqrt{4}=2, \sqrt{5}, \ldots$

## Wurzelgesetze
| Regel | Formel |
|---|---|
| Produkt | $\sqrt{a}\cdot\sqrt{b} = \sqrt{a\cdot b}$ |
| Quotient | $\sqrt{a}:\sqrt{b} = \sqrt{a:b}$ |
| Quadrat der Wurzel | $\left(\sqrt{a}\right)^2 = a$ |

> Achtung Prüfung: Es gibt **kein** Additionsgesetz für Wurzeln! $\sqrt{a}+\sqrt{b} \neq \sqrt{a+b}$ — das ist einer der häufigsten Fehler.

**Gegenbeispiel:** $\sqrt{9}+\sqrt{16} = 3+4 = 7$, aber $\sqrt{9+16}=\sqrt{25}=5$. Also $7 \neq 5$.

## Wurzeln vereinfachen (teilweises Radizieren)
Perfekte Quadratfaktoren aus dem Radikanden herausziehen:
```
√50  = √(25·2) = √25 · √2 = 5√2
√72  = √(36·2) = 6√2
√12  = √(4·3)  = 2√3
```

**Vorgehen:** grössten Quadratfaktor im Radikanden finden → Produktgesetz anwenden → Wurzel des Quadratfaktors ziehen.

## Rechnen mit Wurzeltermen
Nur **gleichartige** Wurzeln (gleicher Radikand) können addiert/subtrahiert werden — wie bei Termen mit gleicher Variable:
```
3√2 + 5√2 = 8√2
7√3 - 2√3 = 5√3
√8 + √18 = 2√2 + 3√2 = 5√2   (zuerst vereinfachen, dann addieren!)
```

## Wurzeln aus Brüchen
$$\sqrt{\frac{a}{b}} = \frac{\sqrt{a}}{\sqrt{b}}$$

**Rationalmachen des Nenners** (Nenner darf keine Wurzel enthalten):
$$\frac{1}{\sqrt{2}} = \frac{1}{\sqrt{2}}\cdot\frac{\sqrt{2}}{\sqrt{2}} = \frac{\sqrt{2}}{2}$$

> Merke: Erweitere mit der Wurzel selbst, um sie im Nenner "verschwinden" zu lassen ($\sqrt{2}\cdot\sqrt{2}=2$).

## Zusammenfassung
$$\boxed{\sqrt{a}\cdot\sqrt{b}=\sqrt{ab} \qquad \sqrt{a}:\sqrt{b}=\sqrt{a:b} \qquad \left(\sqrt a\right)^2=a \qquad \sqrt a + \sqrt b \neq \sqrt{a+b}}$$

> Merke: Diese Grundlagen brauchst du direkt weiter bei der pq-Formel (Jahr 1), beim Satz des Pythagoras (siehe eigenes Thema) und in Jahr 5 bei den Potenzen mit rationalen Exponenten und den Wurzelfunktionen.
