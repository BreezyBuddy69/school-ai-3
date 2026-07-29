> ✅ Aus deinen echten OneNote-Notizen (Jahr 5) übernommen und aufbereitet.

# Wachstumsprozesse und Exponentialfunktion

## Lineares Wachstum

Bei linearem Wachstum ändert sich der Bestand $B$ in jedem gleich langen Zeitabschnitt um denselben **absoluten** Betrag $d$ (die **Wachstumsrate**).

$$B(t+1) = B(t) + d$$

Allgemein für $s$ gleich lange Zeitabschnitte:
$$B(s) = B(t) + (s-t)\cdot d$$

Speziell ab dem Startwert $B(0)$:
$$B(t) = B(0) + t\cdot d$$

| Wachstumsrate $d$ | Bedeutung |
|---|---|
| $d > 0$ | Wachstum (Zunahme) |
| $d < 0$ | negatives Wachstum (Abnahme) |
| $d = 0$ | kein Wachstum (konstant) |

**Beispiel (Gnus im Wildpark):** $B(0)=30\,000$, Wachstumsrate $d=3\,000$ pro Jahr.
$$B(1)=33\,000,\quad B(2)=36\,000,\quad B(3)=39\,000$$
$$B(4) = B(3)+d = 39\,000+3\,000 = 42\,000$$
$$B(10) = B(0)+10\cdot d = 30\,000+10\cdot3\,000 = 60\,000$$

> Merke: Bei linearem Wachstum liegen die Bestandswerte auf einer **Geraden** — der Zuwachs pro Zeitabschnitt ist immer exakt gleich gross (in absoluten Einheiten), unabhängig vom aktuellen Bestand.

## Exponentielles Wachstum

Bei exponentiellem Wachstum ändert sich der Bestand in jedem Zeitabschnitt um denselben **Faktor** $q$ (den **Wachstumsfaktor**), nicht um einen festen Betrag.

$$B(n+1) = B(n)\cdot q$$

Allgemein:
$$B(n) = B(0)\cdot q^n \qquad\qquad B(n) = B(s)\cdot q^{\,n-s}$$

**Beispiel (Gnus, exponentiell):** $B(0)=30\,000$, jährliches Wachstum um $10\%$ $\implies q = 1{,}1$ (denn $100\%+10\%=110\% = 1{,}1$).
$$B(1)=30\,000\cdot1{,}1=33\,000,\quad B(2)=36\,300,\quad B(3)=39\,930,\ \ldots$$

**Nach der Anzahl Zeitschritte $n$ auflösen:** Ist $q$ und $B(0)$ bekannt und der Zeitpunkt gesucht, an dem ein bestimmter Bestand erreicht wird, führt das Umformen auf eine Gleichung mit $n$ im Exponenten — diese wird durch **Logarithmieren** gelöst:

$$B(n)=50\,000,\ B(0)=30\,000,\ q=1{,}1$$
$$50\,000 = 30\,000\cdot1{,}1^n \implies \frac{5}{3} = 1{,}1^n$$
$$\log\!\left(\frac53\right) = n\cdot\log(1{,}1) \;\Big|:\log(1{,}1) \implies n = \frac{\log(5/3)}{\log(1{,}1)} \approx 5{,}35$$

> Merke: Steht die gesuchte Grösse **im Exponenten**, kann man die Gleichung nicht durch einfaches Umstellen lösen — beide Seiten müssen **logarithmiert** werden, damit der Exponent "herunterkommt" ($\log(q^n) = n\cdot\log(q)$).

## Definition und Eigenschaften der Exponentialfunktion

> **Definition:** Eine reelle Funktion $f$ der Form
> $$f(x) = b\cdot a^x \qquad (a>0,\ a\neq1,\ b\neq0)$$
> heisst **Exponentialfunktion zur Basis $a$**. $a$ heisst **Wachstumsfaktor**, $b$ heisst **Startwert** (Anfangswert): $b$ ist der Funktionswert an der Stelle $x=0$, also $f(0)=b$.

### Warum die Einschränkungen an $a$ und $b$?

| Bedingung | Begründung |
|---|---|
| $a>0$ | sonst wäre bei rationalen (gebrochenen) Exponenten die Basis nicht definiert (z. B. $\sqrt{a}$ für $a<0$) |
| $a\neq1$ | sonst wäre $f(x)=b\cdot1^x=b$ eine **konstante** Funktion, keine Exponentialfunktion |
| $b\neq0$ | sonst wäre $f(x)=0$ für alle $x$ |

### Fall $a>1$ (positives Wachstum)
Beispiele: $f(x)=1{,}5^x,\ g(x)=2^x,\ h(x)=10^x,\ i(x)=100^x$

- Für $x\to-\infty$: Kurve nähert sich der x-Achse — **je grösser die Basis $a$, desto näher/schneller** schmiegt sich die Kurve an die x-Achse an
- Für $x\to+\infty$: **je grösser die Basis, desto steiler** wächst die Kurve

### Fall $0<a<1$ (Abnahme/Zerfall)
Beispiele: $f(x)=\left(\tfrac{9}{10}\right)^x,\ g(x)=\left(\tfrac12\right)^x,\ h(x)=\left(\tfrac15\right)^x,\ i(x)=\left(\tfrac1{100}\right)^x$

- Für $x\to-\infty$: **je kleiner die Basis (näher an 0), desto steiler** steigt die Kurve
- Für $x\to+\infty$: **je kleiner die Basis, desto flacher/schneller** nähert sich die Kurve der x-Achse

### Symmetrie zwischen $a^x$ und $\left(\frac1a\right)^x$
Die Graphen von $f(x)=a^x$ und $g(x)=\left(\frac1a\right)^x$ liegen **spiegelsymmetrisch bezüglich der y-Achse**. Die Wachstumsfaktoren $a$ und $\frac1a$ sind dabei zueinander **Kehrwerte**.

Beispiel: $f(x)=2^x$ und $g(x)=0{,}5^x=\left(\tfrac12\right)^x$ sind Spiegelbilder an der y-Achse.

### Spezialfälle (Ausschlussgründe für $a$)
| $a$ | Verhalten |
|---|---|
| $a=1$ | $f(x)=1^x=1$ für alle $x$ — konstante Funktion, keine "echte" Exponentialfunktion |
| $a=0$ | $g(x)=0^x$ ist für $x\leq0$ nicht definiert |
| $a<0$ | $h(x)=(-1)^x$ ist für nicht-ganzzahlige $x$ nicht (reell) definiert und "springt" zwischen positiven/negativen Werten |

### Zusammenfassung der Eigenschaften (für $f(x)=a^x$, $a>0,\ a\neq1$)

| Eigenschaft | Wert |
|---|---|
| Definitionsmenge $D$ | $\mathbb{R}$ |
| Wertemenge $W$ | $\mathbb{R}^+$ (nur positive Werte — keine Nullstelle, kein Schnittpunkt mit der x-Achse) |
| gemeinsame Punkte aller Graphen $f(x)=a^x$ | $P_1(0\vert 1)$ und $P_2(1\vert a)$ |
| Monotonie für $a>1$ | streng monoton **steigend** |
| Monotonie für $0<a<1$ | streng monoton **fallend** |
| Asymptote für $a>1$, $x\to-\infty$ | x-Achse ($y=0$): $\lim_{x\to-\infty}f(x)=0$ |
| Asymptote für $0<a<1$, $x\to+\infty$ | x-Achse ($y=0$): $\lim_{x\to+\infty}f(x)=0$ |

### Wirkung des Startwerts $b$ in $f(x)=b\cdot a^x$
- $b$ bewirkt eine **Streckung/Stauchung in y-Richtung** mit Streckfaktor $b$ (verglichen mit der "Ausgangsfunktion" $a^x$)
- Die Graphen von $f(x)=b\cdot a^x$ verlaufen alle durch $P_1(0\vert b)$ und $P_2(1\vert a\cdot b)$
- Ist $b<0$ (also $f(x)=-b\cdot a^x$ mit $b>0$), entsteht der Graph durch **Spiegelung an der x-Achse**

**Beispiel:** $f_1(x)=\left(\tfrac32\right)^x$, $g_1(x)=2\cdot\left(\tfrac32\right)^x$ (gestreckt), $h_1(x)=-2\cdot\left(\tfrac32\right)^x$ (gestreckt und an der x-Achse gespiegelt).

### Vertikale Verschiebung: $f(x) = b\cdot a^x + c$
Ein zusätzlicher additiver Term $c$ verschiebt den ganzen Graphen um $c$ nach oben (bzw. unten) — die Asymptote liegt dann bei $y=c$ statt bei $y=0$.

**Beispiel-Funktionen (GeoGebra-Übung):** $f(x)=2^x$ (Asymptote $y=0$), $q(x)=2^x+1$ (Asymptote $y=1$), $r(x)=2^x-2$ (Asymptote $y=-2$), $s(x)=2\cdot2^x+3$ (Asymptote $y=3$).

> Achtung Prüfung: Die Asymptote einer Exponentialfunktion $f(x)=b\cdot a^x+c$ liegt bei $y=c$ — **nicht** automatisch bei $y=0$! Ohne additive Konstante ($c=0$) ist die x-Achse die Asymptote.

> Merke: Alle Graphen von $f(x)=a^x$ ($a>0,a\neq1$) laufen durch den Punkt $(0\vert1)$ — das ist der schnellste Check, ob eine Kurve tatsächlich eine reine Exponentialfunktion ohne Verschiebung ist.
