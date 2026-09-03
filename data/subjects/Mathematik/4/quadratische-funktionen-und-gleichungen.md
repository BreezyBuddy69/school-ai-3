# Quadratische Funktionen und Gleichungen

> ✅ Aus deinen echten OneNote-Notizen (Jahr 4) übernommen und aufbereitet.

## Allgemeine Form und Normalparabel

$$f(x) = y = ax^2+bx+c, \quad a\neq 0$$

$a$ heisst **Leitkoeffizient**, $b$ heisst **linearer** Koeffizient, $c$ heisst **absoluter** Koeffizient (liefert $S_y(0|c)$). Der Graph heisst **Parabel**.

Im einfachsten Fall $f(x)=x^2$ ($a=1, b=c=0$) spricht man von der **Normalparabel**.

### Eigenschaften der Normalparabel
- Definitionsmenge $D = \mathbb{R}$, Wertemenge $W = \mathbb{R}_0^+$
- **Achsensymmetrisch** bezüglich der $y$-Achse: $f(x) = f(-x)$
- Ändert nur **einmal** ihr Steigungsverhalten (fällt für $x<0$, steigt für $x>0$)
- Der Punkt, in dem sich das Steigungsverhalten ändert, heisst **Scheitelpunkt** $S$ (hier: Tiefpunkt/Minimum)
- Die Normalparabel ist **nach oben** gekrümmt

## Parabeln der Form $f(x) = ax^2$ (Streckung/Stauchung/Spiegelung)
- $|a| > 1$: Parabel ist **steiler/enger** als die Normalparabel → **gestreckt**
- $0 < |a| < 1$: Parabel ist **flacher/weiter** → **gestaucht**
- $a > 0$: nach oben geöffnet, $S$ ist **Tiefpunkt**
- $a < 0$: nach unten geöffnet, $S$ ist **Hochpunkt** (Multiplikation mit negativem Leitkoeffizienten = Spiegelung an der $x$-Achse)

## Parabeln der Form $f(x) = x^2 + e$
Der Summand $e$ bewirkt eine **Verschiebung** der Normalparabel entlang der $y$-Achse. Scheitel verschiebt sich in $S(0|e)$: nach oben wenn $e>0$, nach unten wenn $e<0$.

## Parabeln der Form $f(x) = (x-d)^2$ und $f(x) = (x-d)^2+e$ — Scheitelform
$$f(x) = a(x-d)^2+e \qquad \text{Scheitelpunkt } S(d\mid e)$$

Der Summand $d$ (in der Klammer, mit umgekehrtem Vorzeichen!) bewirkt eine Verschiebung entlang der $x$-Achse: negativ $d$ → Verschiebung nach links, positiv $d$ → nach rechts.

> Merke: In $(x-d)^2$ steht $d$ mit **umgekehrtem** Vorzeichen im Scheitelpunkt — Verwechslungsgefahr!

## Ergänzung zum Quadrat (allgemeine Form → Scheitelform)

$$x^2+bx = \left(x+\frac{b}{2}\right)^2 - \left(\frac{b}{2}\right)^2$$

**Beispiel:** $f(x) = -\frac{1}{16}x^2+x+2$
$$= -\frac{1}{16}(x^2-16x-32) = -\frac{1}{16}\left[(x-8)^2 - 64 - 32\right] = -\frac{1}{16}(x-8)^2 + 6 \;\Rightarrow\; S(8\mid 6)$$

## Quadratische Gleichungen lösen

**Definition:** $a\cdot x^2+b\cdot x+c=0$ mit $a,b,c\in\mathbb{R}$, $a\neq 0$.

Man unterscheidet drei (bzw. vier) Fälle:

| Fall | Form | Lösungsweg |
|---|---|---|
| **Fall 1** ($b=0$) | $ax^2+c=0$ | nach $x^2$ auflösen, Wurzel ziehen: $x=\pm\sqrt{-\frac{c}{a}}$ |
| **Fall 2** ($c=0$) | $ax^2+bx=0$ | ausklammern: $x(ax+b)=0$ → **Produkt-Null-Satz**: $x_1=0$, $x_2=-\frac{b}{a}$ |
| **Fall 3a** | $ax^2+bx+c=0$ ($a\neq1$) | mit **grosser Lösungsformel** |
| **Fall 3b** | $x^2+px+q=0$ (normiert, $a=1$) | mit **kleiner Lösungsformel** (pq-Formel) |

> ACHTUNG: Bei Fall 1 ist Wurzelziehen **keine** Äquivalenzumformung — beide Vorzeichen $\pm$ nicht vergessen, sonst geht eine Lösung verloren!

### Fall 2 im Detail — Produkt-Null-Satz
$$a\cdot x^2+b\cdot x=0 \iff x\cdot(ax+b)=0$$
Ein Produkt ist null, wenn mindestens ein Faktor null ist. Eine Gleichung dieser Form besitzt **immer zwei** reelle Lösungen: $x_1=0$ und $x_2=-\frac{b}{a}$.

### Grosse Lösungsformel (Fall 3a, allgemeine Form)
$$x_{1,2} = \frac{-b\pm\sqrt{b^2-4ac}}{2a}$$

### Kleine Lösungsformel / pq-Formel (Fall 3b, normierte Form $x^2+px+q=0$)
$$x_{1,2} = -\frac{p}{2} \pm \sqrt{\left(\frac{p}{2}\right)^2 - q}$$

Herleitung durch Ergänzung auf ein vollständiges Quadrat:
$$x^2+px+q=0 \;\Rightarrow\; x^2+px=-q \;\Rightarrow\; \left(x+\frac{p}{2}\right)^2 = \left(\frac{p}{2}\right)^2-q$$

**Umrechnung:** die normierte Form erhältst du aus der allgemeinen Form durch Division durch $a$: $p=\frac{b}{a}$, $q=\frac{c}{a}$.

### Diskriminante $D$
$$D = b^2-4ac \quad\text{(gross)} \qquad D = \left(\frac{p}{2}\right)^2 - q \quad\text{(klein)}$$

| $D$ | Anzahl Lösungen |
|---|---|
| $D > 0$ | 2 Lösungen |
| $D = 0$ | 1 Lösung (Doppellösung) |
| $D < 0$ | keine reelle Lösung |

**Logische Begründung:** Die Wurzel der Diskriminante wird einmal addiert, einmal subtrahiert. Bei $D<0$ ist die Wurzel im Reellen nicht definiert (keine Lösung). Bei $D=0$ ist $\sqrt{0}=0$, Addition/Subtraktion ändern nichts (eine Lösung). Bei $D>0$ ergeben Addition und Subtraktion zwei verschiedene Werte.

### Satz von Vieta
Für $x^2 + px + q = 0$ gilt:
$$x_1 + x_2 = -p, \qquad x_1 \cdot x_2 = q$$

### Quadratische Gleichungen grafisch/zeichnerisch lösen
Die Lösungen der Gleichung $ax^2+bx+c=0$ sind genau die **Nullstellen** (Schnittpunkte mit der $x$-Achse) der zugehörigen Parabel $f(x)=ax^2+bx+c$. Alternativ: eine Gleichung der Form $f(x)=g(x)$ lässt sich lösen, indem man beide Funktionen zeichnet und die Schnittpunkte ihrer Graphen abliest (z. B. Parabel und Gerade).

## Faktorisieren
$$ax^2+bx+c = a(x-x_1)(x-x_2)$$
mit $x_1, x_2$ = Nullstellen (aus Lösungsformel bestimmt).

## Parabel als geometrischer Ort (Konstruktion)
Eine Parabel lässt sich auch als Menge aller Punkte konstruieren, die von einer festen Geraden (**Leitlinie**) und einem festen Punkt (**Brennpunkt**) gleich weit entfernt sind — eine wichtige Verbindung zwischen der algebraischen und der geometrischen Definition der Parabel.

> Achtung Prüfung: Scheitelform und faktorisierte Form ineinander umrechnen können, Fall 1/2/3 bei quadratischen Gleichungen sicher unterscheiden — eine häufige Prüfungsaufgabe.
