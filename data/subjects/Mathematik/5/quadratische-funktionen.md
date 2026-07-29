> ✅ Aus deinen echten OneNote-Notizen (Jahr 5) übernommen und aufbereitet.

# Quadratische Funktionen

## Allgemeine Form
$$f(x) = y = ax^2 + bx + c \qquad (a \neq 0)$$
- $a$ = Leitkoeffizient (höchste vorkommende Hochzahl bestimmt: quadratisch)
- $S_y(0\vert c)$ = Schnittpunkt mit der y-Achse

## Die Normalparabel $f(x) = x^2$
| Eigenschaft | Wert |
|---|---|
| Definitionsmenge $D$ | $\mathbb{R}$ |
| Wertemenge $W$ | $\mathbb{R}_0^+$ (also $y \geq 0$) |
| Symmetrie | y-achsensymmetrisch: $f(x) = f(-x)$ |
| Scheitelpunkt | $S(0\vert 0)$, hier ein **Tiefpunkt** (Minimum) |
| Monotonie | $]-\infty; 0[$ streng monoton fallend, $]0; \infty[$ streng monoton steigend |
| Grenzwert | $\lim_{x\to\infty} f(x) = \infty$, $\lim_{x\to-\infty} f(x) = \infty$ |

**Wertetabelle (Symmetrie erkennbar):**
| x | -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|---|---|---|---|
| y | 16 | 9 | 4 | 1 | 0 | 1 | 4 | 9 | 16 |

## Scheitelpunktform
$$f(x) = y = a(x-d)^2 + e \qquad \text{mit Scheitelpunkt } S(d\vert e)$$

> Achtung Prüfung: Das Vorzeichen von $d$ dreht sich um! Bei $(x-2)^2$ ist $d=2$ (Scheitel bei $x=2$), bei $(x+3)^2 = (x-(-3))^2$ ist $d=-3$.

**Beispiel:** $y = (x-2)^2 + 3 \implies S(2\vert 3)$
**Beispiel:** $y = (x+3)^2 - 4 = (x-(-3))^2 - 4 \implies S(-3\vert -4)$

### Wirkung der Parameter
| Parameter | Wirkung |
|---|---|
| $a > 0$ | Parabel nach oben geöffnet (Tiefpunkt), "fröhlich" $\smile$ |
| $a < 0$ | Parabel nach unten geöffnet (Hochpunkt), "traurig" $\frown$ — Spiegelung an der x-Achse |
| $\vert a\vert > 1$ | Parabel wird **steiler/enger** (gestreckt) |
| $-1 < a < 1$ ($a\neq 0$) | Parabel wird **flacher/weiter** (gestaucht) |
| $+e$ | Verschiebung um $e$ nach **oben** entlang der y-Achse |
| $-e$ | Verschiebung um $e$ nach **unten** entlang der y-Achse |
| $(x-d)$, $d>0$ | Verschiebung nach **rechts** |
| $(x+d)$, $d>0$ | Verschiebung nach **links** |

## Umwandlung: Allgemeine Form → Scheitelpunktform (Quadratische Ergänzung)
**Vorgehen:**
1. $a$ ausklammern (nur bei $x^2$ und $x$-Term)
2. Quadratische Ergänzung: $+\left(\frac{b}{2a}\right)^2 - \left(\frac{b}{2a}\right)^2$ einfügen
3. Binomische Formel rückwärts anwenden
4. Klammer auflösen und zusammenfassen

**Beispiel:** $f(x) = 2x^2 + 8x - 1$
$$f(x) = 2\left(x^2 + 4x - \tfrac{1}{2}\right) = 2\left[x^2 + 4x + 2^2 - 2^2 - \tfrac{1}{2}\right]$$
$$= 2\left[(x+2)^2 - \tfrac{9}{2}\right] = 2(x+2)^2 - 9 \implies S(-2\vert -9)$$

## Parabel-Gleichung aus Punkten bestimmen

### Fall A: Scheitelpunkt bekannt + 1 weiterer Punkt
Ansatz $f(x) = a(x-d)^2 + e$ mit bekanntem $S(d\vert e)$, Punkt $P(x_0\vert y_0)$ einsetzen und nach $a$ auflösen.

**Beispiel:** $S(2\vert 4)$, $P(-1\vert 7)$:
$$7 = a(-1-2)^2 + 4 = 9a + 4 \implies a = \tfrac{1}{3}$$
$$\implies f(x) = \tfrac{1}{3}(x-2)^2 + 4$$

### Fall B: Drei Punkte, allgemeine Form unbekannt (LGS)
Ansatz $f(x) = ax^2+bx+c$. Jeden Punkt einsetzen → 3 Gleichungen mit 3 Unbekannten $a, b, c$, dann per Additions-/Einsetzungsverfahren lösen.

**Beispiel:** $P(1\vert -1), Q(2\vert 4), R(4\vert 18)$
$$\text{I:} -1 = a+b+c \quad \text{II:} 4 = 4a+2b+c \quad \text{III:} 18 = 16a+4b+c$$
Durch Subtraktion (II−I, III−II) zwei Gleichungen mit $a,b$ gewinnen, lösen, dann $c$ zurück einsetzen.

### Fall C: Scheitelpunkt bekannt, nur $a$ unbekannt, kein $P$ nötig
Wenn zusätzlich noch die Öffnungsrichtung/Steilheit im Text vorgegeben ist (z. B. "$a\approx 3$"), direkt einsetzen.

## Nullstellen und faktorisierte Form
Ist die Parabel als Produkt gegeben: $f(x) = a(x-x_1)(x-x_2)$, dann sind $x_1, x_2$ direkt die Nullstellen (Nullprodukt-Satz: ein Produkt ist Null, wenn ein Faktor Null ist).

**Beispiel:** $f(x) = (x-3)(x-5) = 0 \implies x_1 = 3,\ x_2 = 5$

### Scheitelpunkt aus den Nullstellen berechnen
Da die Parabel symmetrisch ist, liegt der Scheitel genau in der Mitte zwischen den Nullstellen:
$$x_S = \frac{x_1+x_2}{2}, \qquad y_S = f(x_S)$$

**Beispiel:** $x_1=3, x_2=5 \implies x_S = 4 \implies S\left(4\Big\vert f(4)\right)$

## Anwendungsaufgaben (Modellieren mit Parabeln)
Typischer Aufgabentyp: Eine Wurfbahn (z. B. Fussball) wird durch $f(x) = -\tfrac{1}{16}x^2 + \lambda x + 2$ beschrieben.
- **y-Achsenabschnitt** $f(0)$ = Abwurfhöhe
- **Nullstellen** $f(x)=0$ = Auftreffpunkt(e) am Boden
- **Prüfen, ob ein Punkt auf der Bahn liegt:** Koordinaten einsetzen, prüfen ob linke = rechte Seite (w.A. = wahre Aussage)
- **Scheitelpunkt** = höchster Punkt der Flugbahn

> Merke: Bei Anwendungsaufgaben immer zuerst die **Bedeutung der Variablen im Sachkontext** festlegen (was ist x, was ist y), bevor man rechnet.
