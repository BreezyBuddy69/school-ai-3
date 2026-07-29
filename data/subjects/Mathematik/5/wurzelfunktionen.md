> ✅ Aus deinen echten OneNote-Notizen (Jahr 5) übernommen und aufbereitet.

# Wurzelfunktionen

## Exkurs: Umkehrfunktion einer linearen Funktion (Einstieg)
Es gibt drei Möglichkeiten, eine Umkehrfunktion zu bestimmen:
1. **Wertetabelle:** $x$ und $y$ vertauschen
2. **Graph:** an der 1. Mediane ($y=x$) spiegeln
3. **Funktionsgleichung:** $x$ und $y$ vertauschen, dann nach dem neuen $y$ freistellen

**Beispiel:** $f(x) = y = 3x-4$
$$y = 3x-4 \;\xrightarrow{x \leftrightarrow y}\; x = 3y-4 \;\big|+4 \implies x+4 = 3y \;\big|:3 \implies f^{-1}(x) = y = \tfrac13 x+\tfrac43$$

> Merke: Sind zwei Funktionen Umkehrfunktionen voneinander, liegen ihre Graphen **symmetrisch bezüglich der 1. Mediane** ($y=x$).

## Wurzelfunktion als Umkehrfunktion einer Potenzfunktion
Wurzelfunktionen sind die Umkehrfunktionen von Potenzfunktionen $y=x^n$. Ob eine Umkehrfunktion existiert, hängt davon ab, ob $y=x^n$ streng monoton ist.

### Gerader Wurzelexponent (z. B. $n=2$)
$y=x^2$ ist **nicht** auf ganz $\mathbb{R}$ umkehrbar (fallend für $x\leq0$, steigend für $x\geq0$). Man schränkt daher auf $x\geq0$ ein:

$$f: y=x^2 \;(x\geq0) \quad\big|\sqrt{\ } \implies \sqrt{y}=\sqrt{x^2}=|x|=x \;(\text{da } x\geq0) \implies x=\sqrt{y}$$
$$x,y \text{ vertauschen:} \quad f^{-1}: y = \sqrt{x}$$

| | $D$ | $W$ |
|---|---|---|
| $f(x)=x^2\ (x\geq0)$ | $\mathbb{R}_0^+$ | $\mathbb{R}_0^+$ |
| $f^{-1}(x)=\sqrt{x}$ | $\mathbb{R}_0^+$ | $\mathbb{R}_0^+$ |

### Ungerader Wurzelexponent (z. B. $n=3$)
$y=x^3$ ist auf **ganz** $\mathbb{R}$ streng monoton steigend — keine Einschränkung nötig:
$$f: y=x^3 \;\big|\sqrt[3]{\ } \implies \sqrt[3]{y}=x \implies f^{-1}: y=\sqrt[3]{x}, \qquad D=\mathbb{R},\ W=\mathbb{R}$$

### Zusammenfassung
| | $n$ gerade | $n$ ungerade |
|---|---|---|
| $f(x)=x^n$ | $D=\mathbb{R}_0^+,\ W=\mathbb{R}_0^+$ | $D=\mathbb{R},\ W=\mathbb{R}$ |
| $f^{-1}(x)=\sqrt[n]{x}$ | $D=\mathbb{R}_0^+,\ W=\mathbb{R}_0^+$ | $D=\mathbb{R},\ W=\mathbb{R}$ |

> Merke: Die Umkehrfunktionen der auf $x\geq0$ beschränkten Potenzfunktionen $y=x^n$ ($n\in\mathbb{N}\setminus\{1\}$) heissen **Wurzelfunktionen** und lassen sich als $y=\sqrt[n]{x}$ ($D=\mathbb{R}_0^+$) darstellen.

## Eigenschaften der Grundfunktion $f(x)=\sqrt{x}$
| Eigenschaft | Wert |
|---|---|
| Definitionsmenge $D$ | $\mathbb{R}_0^+$ |
| Wertemenge $W$ | $\mathbb{R}_0^+$ |
| Monotonie | streng monoton steigend |
| Krümmung | konkav ("nach rechts geöffnet"/abflachend) |
| gemeinsame Punkte mit $y=x^n$ | $P_0(0\vert 0)$, $P_1(1\vert 1)$ |
| Nullstelle | $x=0$ |

## Transformationen von $f(x)=\sqrt{x}$
| Funktion | Wirkung |
|---|---|
| $-\sqrt{x}$ | Spiegelung an der x-Achse |
| $\tfrac12\sqrt{x}$ | Graph wird **flacher** (weniger steigend) |
| $2\sqrt{x}$ | Graph wird **steiler** (stärker steigend) |
| $\sqrt{x}+1$ | Verschiebung entlang der y-Achse um $+1$ nach **oben** |
| $\sqrt{x}-1$ | Verschiebung entlang der y-Achse um $-1$ nach **unten** |
| $\sqrt{x+1}$ | Verschiebung entlang der x-Achse um $1$ nach **links** |
| $\sqrt{x-1}$ | Verschiebung entlang der x-Achse um $1$ nach **rechts** |
| $\sqrt{x+1}-1$ | Verschiebung nach **links und unten** kombiniert |

**Beispiel — Definitions- und Wertebereich bei Verschiebung:** $f(x) = \sqrt{2x}+1$
$$\text{Radikand} \geq 0: \quad 2x \geq 0 \implies x \geq 0 \implies D = [0;\infty[$$
Da $\sqrt{2x}\geq0$, ist $y=\sqrt{2x}+1\geq1 \implies W=[1;\infty[$

**Beispiel:** $f(x) = \sqrt{3-x}$
$$\text{Radikand} \geq 0: \quad 3-x\geq0 \implies x\leq3 \implies D = \,]-\infty;3]$$
$$W = [0;\infty[$$

> Achtung Prüfung: Bei Wurzelfunktionen **immer zuerst den Radikanden $\geq 0$ setzen**, um $D$ zu bestimmen — erst danach den Wertebereich über das Vorzeichen/die Verschiebung vor der Wurzel ableiten.

## Potenzgleichungen

### Definition
Eine **Potenzgleichung** besteht aus nur einer Potenz einer Variable und einer Konstanten:
$$x^n = a$$

Grundsätzlich löst man Potenzgleichungen durch **Wurzelziehen** — das ist aber im Allgemeinen **keine Äquivalenzumformung**! Um keine Lösungen zu verlieren, gilt:
$$n \text{ gerade:} \quad \sqrt[n]{x^n} = |x| \qquad\qquad n \text{ ungerade:} \quad \sqrt[n]{x^n} = x$$

> Merke: Bei geradem Wurzelexponenten führt das Wurzelziehen zu **Betragsstrichen** → das ergibt in der Regel **zwei Lösungen** ($\pm$). Vergisst man die Betragsstriche, geht eine Lösung verloren!

### Typ 1: $x^n = a$ ($n\in\mathbb{N}$)
| | $n$ gerade | $n$ ungerade |
|---|---|---|
| $a>0$ | $\mathbb{L}=\{-\sqrt[n]{a};+\sqrt[n]{a}\}$ | $\mathbb{L}=\{+\sqrt[n]{a}\}$ |
| $a=0$ | $\mathbb{L}=\{0\}$ | $\mathbb{L}=\{0\}$ |
| $a<0$ | $\mathbb{L}=\{\}$ (leer) | $\mathbb{L}=\{-\sqrt[n]{\vert a\vert}\}$ |

**Beispiel:** $x^2=4 \implies \sqrt{x^2}=\sqrt4 \implies |x|=2 \implies x=\pm2 \implies \mathbb{L}=\{-2;+2\}$

**Beispiel (negativ, gerader Exponent):** $x^2=-4$ → für jedes $x$ ist $x^2\geq0$, nie $-4$ → $\mathbb{L}=\{\}$

**Beispiel (ungerader Exponent, negatives $a$):** $x^3=-8$

Trick, falls man nicht direkt die ungerade Wurzel ziehen will: beide Seiten quadrieren, um das Vorzeichenproblem zu umgehen:
$$(x^3)^2=(-8)^2 \implies x^6=64 \;\big|\sqrt[6]{\ } \implies |x|=2 \implies x=\pm2$$
Quadrieren ist **keine Äquivalenzumformung** — es können **Scheinlösungen** entstehen (keine gehen verloren). Daher **Probe zwingend**:
$$x_1=-2:\ (-2)^3=-8 \quad\text{wahre Aussage ✓} \qquad x_2=2:\ 2^3=8\neq-8 \quad\text{falsche Aussage ✗ (Scheinlösung)}$$
$$\implies \mathbb{L}=\{-2\}$$
(Direkter und einfacher: $x=-\sqrt[3]{|-8|}=-\sqrt[3]{8}=-2$.)

### Typ 2: $x^{-n} = a$ ($n\in\mathbb{N}$)
Erst mit Potenzgesetz $x^{-n}=\frac{1}{x^n}$ umformen, dann auf Typ 1 zurückführen ($x^n = \frac1a$).
- $a=0$: keine Lösung, $\mathbb{L}=\{\}$
- $a\neq0$: äquivalent zu $x^n=\frac1a$

**Beispiel:** $x^{-2}=3 \implies \dfrac{1}{x^2}=3 \implies x^2=\dfrac13 \;\big|\sqrt{\ } \implies |x|=\sqrt{\tfrac13} \implies \mathbb{L}=\left\{-\sqrt{\tfrac13};+\sqrt{\tfrac13}\right\}$

### Typ 3: $x^{\frac{m}{n}} = a$ ($m\in\mathbb{Z}, n\in\mathbb{N}$)
Mit $n$ potenzieren. Ist der Exponent $\frac{m}{n}$ keine ganze Zahl, ist die Gleichung in $\mathbb{R}^-$ nicht definiert — in $\mathbb{R}_0^+$ sind $x^{\frac{m}{n}}=a$ und $\sqrt[n]{x^m}=a$ äquivalent.

**Beispiel:** $x^{\frac23}=4$
$$\big(x^{\frac23}\big)^3 = 4^3 \implies x^2=64 \;\big|\sqrt{\ } \implies |x|=8 \implies x=\pm8$$
$x_1=-8$ gehört nicht zur Definitionsmenge $\mathbb{R}_0^+$ → verworfen. $x_2=8$: Probe $8^{\frac23}=4$ → wahre Aussage ✓
$$\implies \mathbb{L}=\{8\}$$

> Achtung Prüfung: Potenzieren/Wurzelziehen ist **keine Äquivalenzumformung** — bei jeder Potenzgleichung am Schluss **Probe machen** und Lösungen gegen die Definitionsmenge prüfen!
