# Reelle Zahlen

> ✅ Aus deinen echten OneNote-Notizen (Jahr 4) übernommen und aufbereitet.

## Mengenlehre — Grundlagen

Eine **Menge** ist eine Zusammenfassung wohlunterschiedener Objekte (Elemente) zu einem Ganzen.

| Symbol | Bedeutung |
|---|---|
| $a \in M$ | $a$ ist Element von $M$ |
| $a \notin M$ | $a$ ist nicht Element von $M$ |
| $A \subseteq B$ | $A$ ist Teilmenge von $B$ |
| $A \cup B$ | Vereinigung |
| $A \cap B$ | Schnittmenge |
| $A \setminus B$ | Differenzmenge (A ohne B) |
| $\{\}$ oder $\emptyset$ | leere Menge |

## Zahlenmengen

$$\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q} \subset \mathbb{R}$$

| Menge | Beschreibung |
|---|---|
| $\mathbb{N}$ | natürliche Zahlen: $0, 1, 2, 3, \dots$ |
| $\mathbb{Z}$ | ganze Zahlen: $\dots, -2, -1, 0, 1, 2, \dots$ |
| $\mathbb{Q}$ | rationale Zahlen: als Bruch $\frac{p}{q}$ ($p \in \mathbb{Z}, q \in \mathbb{Z}\setminus\{0\}$) darstellbar |
| $\mathbb{R}$ | reelle Zahlen: $\mathbb{Q}$ zusammen mit den irrationalen Zahlen |

**Irrationale Zahlen** sind reelle Zahlen, die sich **nicht** als Bruch $\frac{p}{q}$ darstellen lassen — sie besitzen eine unendliche, nicht-periodische Dezimalzahlentwicklung. Beispiele: $\sqrt{2}$, $\pi$, $e$.

> Merke: Rationale Zahlen haben entweder eine endliche oder eine unendlich-**periodische** Dezimaldarstellung ($\frac13 = 0.\overline{3}$). Irrationale Zahlen sind unendlich **nicht-periodisch**.

## Beweis: $\sqrt{2}$ ist irrational (Widerspruchsbeweis)

Annahme: $\sqrt{2}$ sei rational, also $\sqrt{2} = \frac{p}{q}$ mit $p, q$ teilerfremd.

$$2 = \frac{p^2}{q^2} \;\Rightarrow\; p^2 = 2q^2$$

$p^2$ ist gerade $\Rightarrow$ $p$ ist gerade $\Rightarrow$ $p = 2k$. Eingesetzt:

$$4k^2 = 2q^2 \;\Rightarrow\; q^2 = 2k^2$$

Also ist auch $q$ gerade. Widerspruch: $p$ und $q$ waren als teilerfremd angenommen, sind aber beide durch 2 teilbar. $\Rightarrow$ $\sqrt{2}$ ist **irrational**.

## Quadratwurzel

$$\sqrt{a} \cdot \sqrt{a} = a, \quad a \ge 0$$

Rechenregeln:
$$\sqrt{a\cdot b} = \sqrt{a}\cdot\sqrt{b}, \qquad \sqrt{\frac{a}{b}} = \frac{\sqrt{a}}{\sqrt{b}}$$

> Merke: $\sqrt{a+b} \neq \sqrt{a}+\sqrt{b}$ — der häufigste Fehler bei Wurzeltermen!

## Näherungsweise Berechnung — Heron-Verfahren

Iteratives Verfahren zur Annäherung an $\sqrt{a}$:

$$x_{n+1} = \frac{1}{2}\left(x_n + \frac{a}{x_n}\right)$$

Mit jedem Schritt nähert sich $x_n$ dem exakten Wert von $\sqrt{a}$ an — ein einfacher, von Hand ausführbarer Algorithmus ohne Taschenrechner.

## Intervallschachtelung

Eine weitere Methode, um irrationale Zahlen beliebig genau einzugrenzen: man schachtelt die gesuchte Zahl zwischen zwei rationalen Schranken, die sich Schritt für Schritt annähern (z. B. $1.4 < \sqrt2 < 1.5$, dann $1.41 < \sqrt2 < 1.42$, usw.).

## Operationen im Bereich der reellen Zahlen

Die vier Grundrechenarten gelten wie in $\mathbb{Q}$, zusätzlich:
- Wurzelziehen (für $a \ge 0$)
- Potenzieren mit rationalen Exponenten: $a^{\frac{1}{n}} = \sqrt[n]{a}$

> Achtung Prüfung: Wurzelausdrücke immer so weit wie möglich vereinfachen (Quadratzahl-Faktor aus der Wurzel herausziehen), bevor gerundet wird.
