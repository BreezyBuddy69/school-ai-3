> 🧪 **Beta** — nicht in deinen OneNote-Notizen/Zusammenfassungen von Jahr 5 gefunden. Aus dem offiziellen LG-Lehrplan + ergänzender Recherche erstellt. Ersetzen/ergänzen, sobald echte Notizen vorliegen.

# Logarithmusfunktion

Deine Notizen zu `5_6 Exponential- und Logarithmusfunktion` decken nur den ersten Teil ab (lineares/exponentielles Wachstum und die Exponentialfunktion selbst, siehe `exponentialfunktion.md`). Der Logarithmus-Teil fehlt in den Notizen komplett — dieses Kapitel schliesst die Lücke.

## Definition des Logarithmus

Der Logarithmus beantwortet die Frage: "Mit welchem Exponenten muss ich die Basis $a$ potenzieren, um $x$ zu erhalten?"

$$\log_a(x) = y \quad\Longleftrightarrow\quad a^y = x \qquad (a>0,\ a\neq1,\ x>0)$$

Der Logarithmus ist also die **Umkehroperation** des Potenzierens (bezüglich des Exponenten).

### Wichtige Basen
| Bezeichnung | Basis | Schreibweise |
|---|---|---|
| Dekadischer Logarithmus | $10$ | $\log(x)$ oder $\lg(x)$ |
| Natürlicher Logarithmus | $e\approx2{,}71828$ | $\ln(x)$ |
| Logarithmus zur Basis $a$ | $a$ | $\log_a(x)$ |

> Merke: $\log_a(x)$ ist nur für $x>0$ definiert — der Logarithmus von $0$ oder einer negativen Zahl existiert nicht (reell).

### Spezialwerte
$$\log_a(1) = 0 \qquad\qquad \log_a(a) = 1 \qquad\qquad \log_a(a^n) = n$$

## Logarithmengesetze (Rechenregeln)

| Regel | Formel |
|---|---|
| Logarithmus eines Produkts | $\log_a(u\cdot v) = \log_a(u) + \log_a(v)$ |
| Logarithmus eines Quotienten | $\log_a\!\left(\dfrac{u}{v}\right) = \log_a(u) - \log_a(v)$ |
| Logarithmus einer Potenz | $\log_a(u^r) = r\cdot\log_a(u)$ |
| Basiswechselsatz | $\log_a(x) = \dfrac{\log_b(x)}{\log_b(a)}$ (beliebige neue Basis $b$) |

> Achtung Prüfung: $\log_a(u+v) \neq \log_a(u)+\log_a(v)$ — die Logarithmusgesetze gelten nur für **Produkte/Quotienten/Potenzen**, nicht für Summen! Das ist der häufigste Fehler.

## Logarithmusfunktion als Umkehrfunktion der Exponentialfunktion

Die Logarithmusfunktion $f(x) = \log_a(x)$ ist die Umkehrfunktion der Exponentialfunktion $g(x) = a^x$ (siehe `exponentialfunktion.md`). Da $D$ und $W$ bei Umkehrfunktionen vertauscht werden:

| Eigenschaft | $g(x)=a^x$ | $f(x)=\log_a(x)$ |
|---|---|---|
| Definitionsmenge $D$ | $\mathbb{R}$ | $\mathbb{R}^+$ |
| Wertemenge $W$ | $\mathbb{R}^+$ | $\mathbb{R}$ |
| gemeinsame Punkte | $(0\vert1),\ (1\vert a)$ | $(1\vert0),\ (a\vert1)$ |
| Monotonie ($a>1$) | streng monoton steigend | streng monoton steigend |
| Monotonie ($0<a<1$) | streng monoton fallend | streng monoton fallend |
| Asymptote | x-Achse ($y=0$), waagrecht | y-Achse ($x=0$), **senkrecht** |

Die Graphen von $f(x)=\log_a(x)$ und $g(x)=a^x$ liegen **spiegelsymmetrisch zur 1. Mediane** ($y=x$) — wie bei jedem Funktions-/Umkehrfunktions-Paar.

> Merke: Die Logarithmusfunktion hat als Asymptote die **y-Achse** (senkrecht), im Gegensatz zur Exponentialfunktion, deren Asymptote die x-Achse (waagrecht) ist — logisch, da bei der Umkehrfunktion x- und y-Rollen vertauscht sind.

## Exponentialgleichungen mit dem Logarithmus lösen

Steht die gesuchte Variable im Exponenten, wird die Gleichung logarithmiert, um den Exponenten "herunterzuholen":

**Vorgehen:**
1. Exponentialterm möglichst allein auf einer Seite isolieren
2. Beide Seiten logarithmieren (mit beliebiger fester Basis, z. B. $\lg$ oder $\ln$)
3. Logarithmusgesetz $\log(a^x)=x\cdot\log(a)$ anwenden, um $x$ aus dem Exponenten zu holen
4. Nach $x$ auflösen

**Beispiel:** $5\cdot3^x = 135$
$$3^x = 27 \;\big|\lg \implies \lg(3^x) = \lg(27) \implies x\cdot\lg(3) = \lg(27) \implies x = \frac{\lg(27)}{\lg(3)} = 3$$

**Beispiel (nicht "glatt" lösbar):** $2^x = 10$
$$\lg(2^x) = \lg(10) \implies x\cdot\lg(2) = 1 \implies x = \frac{1}{\lg(2)} \approx 3{,}32$$

> Achtung Prüfung: Der Logarithmus einer Gleichung darf mit **jeder** gültigen Basis gebildet werden ($\lg$, $\ln$, $\log_2$, …) — das Ergebnis für $x$ ist immer dasselbe, nur der Rechenweg unterscheidet sich. Am gebräuchlichsten sind $\lg$ (Taschenrechner-Taste `log`) oder $\ln$.

## Die natürliche Exponential- und Logarithmusfunktion

Die **Eulersche Zahl** $e\approx2{,}71828\ldots$ ist die Basis der natürlichen Exponentialfunktion $f(x)=e^x$ und ihrer Umkehrfunktion, dem natürlichen Logarithmus $\ln(x) = \log_e(x)$. Sie spielt in der höheren Mathematik (Ableitungen, Wachstumsmodelle mit stetiger Verzinsung) eine zentrale Rolle und wird in der Regel im weiteren Verlauf der Analysis vertieft.

$$e^{\ln(x)} = x \qquad\qquad \ln(e^x) = x$$
