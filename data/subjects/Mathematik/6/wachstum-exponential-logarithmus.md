# Wachstum, Exponential- und Logarithmusfunktion — Jahr 6 (SA 1)

**Fach:** Mathematik | **Klasse:** 6Wa

> ✅ Aus deinen echten OneNote-Notizen (Jahr 6) übernommen und aufbereitet.

## Linear oder exponentiell?

Linear: pro Schritt wird immer dasselbe **addiert**: $B(n) = B(0) + n\cdot d$. Differenzen gleich, Graph ist eine Gerade.

Exponentiell: pro Schritt wird immer mit demselben Faktor **multipliziert**: $B(n) = B(0)\cdot q^n$ (oder $N(t) = N_0\cdot b^t$). Quotienten gleich.

- Prozent zu Faktor: $q = 1 + p$. Zunahme 12 % gibt $q = 1{,}12$, Abnahme 18 % gibt $q = 0{,}82$.
- Mehrere Prozentschritte: Faktoren multiplizieren. $+20\,\%$ und dann $-17\,\%$: $1{,}2\cdot 0{,}83 = 0{,}996$, also insgesamt $-0{,}4\,\%$.

## Die vier Aufgabentypen

| Gesucht | Vorgehen |
|---|---|
| Endwert $B(n)$ | einsetzen |
| Faktor $q$ bzw. Rate $d$ | linear: Differenz; exponentiell: $q = \sqrt[n]{B(n)/B(0)}$ |
| Startwert $B(0)$ | $B(0) = B(n) : q^n$ |
| Zeit $n$ | linear: Gleichung lösen; exponentiell: Logarithmus |

## Die Exponentialfunktion

$f(x) = b\cdot a^x$ mit $a>0$, $a\ne 1$. $b = f(0)$ ist der Startwert (y-Achsenabschnitt), $a$ der Wachstumsfaktor.

- $D=\mathbb{R}$, für $b>0$ ist $W=\mathbb{R}^+$. Die x-Achse ist Asymptote.
- Punkte $(0\,|\,b)$ und $(1\,|\,ab)$.
- $a>1$: streng monoton steigend; $0<a<1$: streng monoton fallend.
- $a$ und $1/a$: Graphen spiegelbildlich zur y-Achse.
- $b<0$: Spiegelung an der x-Achse.
- $f(x)=b\cdot a^x + c$ verschiebt nach oben/unten, Asymptote $y=c$.
- $f(x+h) = f(x)\cdot a^h$.

## Funktionsgleichung aus zwei Punkten

1. $a^{\Delta x} = y_2 : y_1$, Wurzel ziehen ($a>0$).
2. Einen Punkt einsetzen, nach $b$ auflösen.

Beispiel: $A(1|6)$, $B(3|24)$: $a^2 = 4$, $a=2$, $b=3$, also $f(x)=3\cdot 2^x$.

Aus der Halbwertszeit $T$: $a = 0{,}5^{1/T}$. Cäsium ($T=33$ Jahre): $a\approx 0{,}979$.

Umschreiben: $b\cdot a^x = b\cdot e^{\lambda x}$ mit $\lambda = \ln a$. Potenzgesetze: $3\cdot 2^{x+2} = 12\cdot 2^x$.

## Logarithmus

$\log_a b = x$ bedeutet $a^x = b$. Frage: Mit welcher Hochzahl muss man $a$ potenzieren, um $b$ zu erhalten?

- $\log_2 8 = 3$, $\log_3 81 = 4$, $\log_9 27 = \tfrac32$, $\log_3 \tfrac19 = -2$.
- $\log_a 1 = 0$, $\log_a a = 1$, $\log_a a^r = r$. Für $0$ und negative Zahlen nicht definiert.
- $\lg$ = Basis 10, $\ln$ = Basis $e\approx 2{,}718$. Andere Basis: $\log_a b = \ln b : \ln a$.

## Rechenregeln für Logarithmen

- Produkt: $\log(u\cdot v) = \log u + \log v$
- Quotient: $\log(u/v) = \log u - \log v$
- Potenz: $\log(u^r) = r\cdot\log u$

Zerlegen: $\lg(100x^3) = 2 + 3\lg x$. Keine Regel für $\log(u+v)$.

## Exponentialgleichungen lösen

$a^x = b$ hat immer genau eine Lösung: $x = \lg b : \lg a$.

- $5^x = 13$: $x = \lg 13 : \lg 5 \approx 1{,}59$.
- $2\cdot 3^{x-1} = 54$: erst isolieren, $3^{x-1}=27$, $x=4$.
- Logarithmus so spät wie möglich anwenden, Basis nie mischen.

Wachstumsaufgaben mit $N(t)=N_0\cdot b^t$:

| Gesucht | Formel |
|---|---|
| Verdopplungszeit | $t = \ln 2 : \ln b$ |
| Halbwertszeit | $T = \ln 0{,}5 : \ln b$ |
| bis nur noch $p\,\%$ da sind | $t = \ln(p/100) : \ln b$ |
| bis Wert $N$ erreicht ist | $t = \ln(N/N_0) : \ln b$ |

## Die Logarithmusfunktion

$f(x)=\log_a x$ mit $a>0$, $a\ne1$.

- $D=\mathbb{R}^+$, $W=\mathbb{R}$. Alle Graphen gehen durch $(1|0)$, die y-Achse ist Asymptote.
- $a>1$ steigend, $0<a<1$ fallend.
- $\log_a x$ und $\log_{1/a} x$ liegen spiegelbildlich zur x-Achse.
- Umkehrfunktion von $a^x$ (Spiegelung an $y=x$).
- $\log_2(x-3)$: $D$: $x>3$, Asymptote $x=3$.
- Basis aus Punkt: $P(100|2)$ gibt $a=10$; $P(4|-2)$ gibt $a=\tfrac12$.
