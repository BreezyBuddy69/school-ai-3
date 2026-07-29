> ✅ Aus deinen echten OneNote-Notizen (Jahr 5) übernommen und aufbereitet.

# Potenzfunktionen

## Definition
Eine Potenzfunktion hat die Form
$$f(x) = x^n \quad (n \in \mathbb{Z}), \qquad \text{allgemeiner: } f(x) = a \cdot x^n$$

Je nachdem ob $n$ **gerade/ungerade** und **positiv/negativ** ist, verhält sich der Graph komplett unterschiedlich — es gibt vier Grundtypen.

## Die vier Grundtypen

### Typ 1 — gerade positive Exponenten ("Parabeln", z. B. $x^2, x^4, x^6$)
| Eigenschaft | Wert |
|---|---|
| Definitionsmenge | $\mathbb{R}$ |
| Wertemenge | $y \geq 0$ |
| Symmetrie | y-Achse (achsensymmetrisch) |
| Nullstellen | $x = 0$ |
| Extrempunkt | Tiefpunkt bei $(0\vert 0)$ |
| Monotonie | fallend für $x<0$, steigend für $x>0$ |
| Verhalten $\vert x\vert \to \infty$ | $y \to \infty$ |

### Typ 2 — ungerade positive Exponenten ("Parabeln", z. B. $x^1, x^3, x^5$)
| Eigenschaft | Wert |
|---|---|
| Definitionsmenge | $\mathbb{R}$ |
| Wertemenge | $\mathbb{R}$ |
| Symmetrie | Ursprung (punktsymmetrisch) |
| Nullstellen | $x = 0$ |
| Monotonie | streng monoton steigend |
| Verhalten $x \to \infty$ | $y \to \infty$ |
| Verhalten $x \to -\infty$ | $y \to -\infty$ |

### Typ 3 — gerade negative Exponenten ("Hyperbeln", z. B. $x^{-2}, x^{-4}, x^{-6}$)
| Eigenschaft | Wert |
|---|---|
| Definitionsmenge | $\mathbb{R} \setminus \{0\}$ |
| Wertemenge | $y > 0$ |
| Symmetrie | y-Achse |
| Nullstellen | keine |
| Asymptoten | x-Achse (waagrecht), y-Achse (senkrecht) |
| Verhalten $x \to 0$ | $y \to \infty$ |
| Verhalten $\vert x\vert \to \infty$ | $y \to 0$ |

### Typ 4 — ungerade negative Exponenten ("Hyperbeln", z. B. $x^{-1}, x^{-3}, x^{-5}$)
| Eigenschaft | Wert |
|---|---|
| Definitionsmenge | $\mathbb{R} \setminus \{0\}$ |
| Wertemenge | $\mathbb{R} \setminus \{0\}$ |
| Symmetrie | Ursprung |
| Nullstellen | keine |
| Asymptoten | x-Achse, y-Achse |
| Verhalten $x \to 0^+$ | $y \to \infty$ |
| Verhalten $x \to 0^-$ | $y \to -\infty$ |
| Verhalten $\vert x\vert \to \infty$ | $y \to 0$ |

> Merke: **Gerader Exponent → Symmetrie zur y-Achse. Ungerader Exponent → Symmetrie zum Ursprung.** Positiver Exponent → "Parabel"-artig (Definitionslücke nur bei negativem Exponenten). Negativer Exponent → "Hyperbel"-artig mit Definitionslücke bei $x=0$ und Asymptoten.

## Transformationen von $g(x) = a \cdot x^n + c$ bzw. $a \cdot (x-d)^n$
| Parameter | Wirkung |
|---|---|
| $a < 0$ | Spiegelung an der x-Achse |
| $\vert a\vert > 1$ | Graph wird **steiler** (Streckung entlang y-Achse) |
| $0 < \vert a\vert < 1$ | Graph wird **flacher** (Stauchung entlang y-Achse) |
| $+c$ | Verschiebung um $c$ entlang der y-Achse nach oben |
| $-c$ | Verschiebung um $c$ entlang der y-Achse nach unten |
| $(x-d)$ | Verschiebung um $d$ entlang der x-Achse nach **rechts** |
| $(x+d)$ | Verschiebung um $d$ entlang der x-Achse nach **links** |

## Potenzfunktion aus Punkten bestimmen
Ansatz: $f(x) = a \cdot x^n$ (bzw. $a \cdot x^{-n} = \frac{a}{x^n}$ für Hyperbel-Typen).

### Vorgehen bei zwei unbekannten Parametern ($a$ und $n$)
1. Beide Punkte in $f(x) = a \cdot x^n$ einsetzen → zwei Gleichungen (I und II)
2. Gleichung I in II einsetzen bzw. beide Gleichungen dividieren, damit $a$ herausfällt
3. Aus dem Potenzvergleich (gleiche Basis) $n$ bestimmen
4. $n$ in eine der beiden Gleichungen zurück einsetzen → $a$ berechnen

**Beispiel:** $A(1\vert 4)$, $B\left(\tfrac{1}{2}\Big\vert 16\right)$ liegen auf $f(x) = a \cdot x^{-n}$.
$$\text{I:} \quad 4 = a \cdot 1^{-n} \implies a = 4$$
$$\text{II:} \quad 16 = a \cdot \left(\tfrac{1}{2}\right)^{-n} = 4 \cdot 2^{n}$$
$$\implies 2^n = 4 \implies n = 2$$
$$\implies f(x) = 4 \cdot x^{-2} = \frac{4}{x^2}$$

### Vorgehen bei bekanntem $n$, gesuchtem $a$
Punkt $P(x_0\vert y_0)$ einsetzen und nach $a$ auflösen:
$$a = \frac{y_0}{x_0^{\,n}}$$

### Verschobene Potenzfunktion (Hyperbel mit horizontaler Verschiebung)
Wenn ein Punkt $P$ auf $f(x) = (x-d)^{-n}$ liegt, wird nach $d$ aufgelöst (Wurzel ziehen, dann nach $d$ isolieren).

**Beispiel:** $P \in f(x)$: $8 = (4-d)^{-3}$
$$8 = \frac{1}{(4-d)^3} \;\Big|\cdot (4-d)^3$$
$$8 \cdot (4-d)^3 = 1 \;\Big|:8$$
$$(4-d)^3 = \frac{1}{8} \implies 4-d = \sqrt[3]{\tfrac{1}{8}} = \tfrac{1}{2}$$
$$\implies d = 3{,}5 \implies f(x) = (x-3{,}5)^{-3}$$

### Nullstellen und Funktionswerte bei verschobenen Potenzfunktionen
Bei $f(x) = x^{-1} - 2$ die Nullstelle finden:
$$0 = x^{-1} - 2 \;\big|+2 \implies 2 = x^{-1} \implies x = \frac{1}{2}$$

> Achtung Prüfung: Bei Hyperbel-Typen ($n<0$) immer die **Definitionslücke** (meist $x=0$ bzw. bei Verschiebung $x=d$) angeben — dort ist die Funktion nicht definiert!
