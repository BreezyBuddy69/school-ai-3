> ✅ Aus deinen echten OneNote-Notizen (Jahr 5) übernommen und aufbereitet.

# Potenzen

## Grundbegriffe
Eine Potenz $a^n$ besteht aus:
- **Basis** $a$
- **Exponent** $n$

## 1. Potenzen mit natürlichen Zahlen als Exponenten (Wiederholung)
$$a^n = \underbrace{a \cdot a \cdot \dots \cdot a}_{n \text{ Faktoren}}$$

### Potenzgesetze
| Regel | Formel |
|---|---|
| Produkt gleicher Basis | $a^m \cdot a^n = a^{m+n}$ |
| Quotient gleicher Basis | $a^m : a^n = a^{m-n}$ |
| Potenz einer Potenz | $(a^m)^n = a^{m \cdot n}$ |
| Produkt verschiedener Basen, gleicher Exponent | $a^n \cdot b^n = (a \cdot b)^n$ |
| Quotient verschiedener Basen, gleicher Exponent | $a^n : b^n = (a:b)^n$ |

> Merke: Beim Multiplizieren/Dividieren gleicher Basen werden die Exponenten **addiert/subtrahiert** — die Basis bleibt stehen!

## 2. Potenzen mit ganzen Zahlen als Exponenten
Erweiterung auf negative und Null-Exponenten:

$$a^0 = 1 \quad (a \neq 0)$$
$$a^{-n} = \frac{1}{a^n} \quad (a \neq 0)$$

### Vorgehen bei gemischten Ausdrücken
Alle Potenzgesetze von oben gelten unverändert auch für negative/ganzzahlige Exponenten. Wichtig: zuerst Klammern auflösen (Potenz einer Potenz), dann gleiche Basen zusammenfassen.

**Beispiel:**
$$(x^2)^3 \cdot x^{-5} = x^6 \cdot x^{-5} = x^{6+(-5)} = x^1 = x$$

**Beispiel mit mehreren Faktoren:**
$$a \cdot (a^{-4}) \cdot a = a^{1-4+1} = a^{-2} = \frac{1}{a^2}$$

**Beispiel (nur negative Exponenten):**
$$b^{-4} \cdot b^{-8} \cdot b^6 = b^{-4-8+6} = b^{-6} = \frac{1}{b^6}$$

**Beispiel mit mehreren Variablen und Brüchen:**
$$2a^2 \cdot \frac{a^{14}b^{-16}}{c^{-6}} \cdot 2c^5 = \frac{4a^{16}c^{11}}{b^{16}}$$

> Achtung Prüfung: Negative Exponenten bedeuten **nicht** eine negative Zahl, sondern den **Kehrwert**! $2^{-3} = \frac{1}{8}$, nicht $-8$.

## 3. Potenzen mit rationalen Zahlen als Exponenten (Wurzeln)
Ein gebrochener Exponent entspricht einer Wurzel:

$$a^{\frac{1}{n}} = \sqrt[n]{a}$$
$$a^{\frac{m}{n}} = \sqrt[n]{a^m} = \left(\sqrt[n]{a}\right)^m$$

Damit gelten **alle Potenzgesetze auch für Wurzeln** — man rechnet einfach mit den Exponenten als Brüchen weiter.

**Beispiel — Exponenten addieren:**
$$x^{-\frac{3}{6}} \cdot x^{\frac{5}{6}} = x^{\frac{2}{6}} = x^{\frac{1}{3}} = \sqrt[3]{x}$$

**Beispiel — Division mit gebrochenen Exponenten:**
$$\frac{x^{\frac{2}{3}}}{x^{-\frac{5}{3}}} = x^{\frac{2}{3}-\left(-\frac{5}{3}\right)} = x^{\frac{7}{3}}$$

### Wurzeln vereinfachen (Faktoren herausziehen)
Perfekte Potenzen unter der Wurzel können herausgezogen werden:
$$\sqrt{2 \cdot a \cdot a^5 \cdot a^4 \cdot b \cdot b} = 2a^5b\sqrt{2b}$$

### Wurzeln mit verschiedenem Wurzelexponenten kombinieren
Um Wurzeln unterschiedlicher Ordnung (z. B. $\sqrt{\ }$ und $\sqrt[3]{\ }$) zu multiplizieren/dividieren, braucht man einen **gemeinsamen Wurzelexponenten** — analog zum gemeinsamen Nenner bei Brüchen: das kgV der Wurzelexponenten bestimmen und die Exponenten unter der Wurzel entsprechend erweitern.

**Beispiel (Umwandlung Bruchexponent ↔ Wurzel):**
$$x^{\frac{2}{6}+\frac{5}{6}} = x^{\frac{7}{6}} \quad\Longleftrightarrow\quad \sqrt[6]{x^7}$$

### Umrechnungstabelle Bruchexponent ↔ Wurzel
| Potenzschreibweise | Wurzelschreibweise |
|---|---|
| $x^{\frac{1}{2}}$ | $\sqrt{x}$ |
| $x^{\frac{1}{3}}$ | $\sqrt[3]{x}$ |
| $x^{-\frac{2}{3}}$ | $\dfrac{1}{\sqrt[3]{x^2}}$ |
| $r^{-\frac{4}{6}} = r^{-\frac{2}{3}}$ | $\dfrac{1}{\sqrt[3]{r^2}}$ |

> Merke: Kürze den Bruchexponenten zuerst so weit wie möglich, bevor du in die Wurzelschreibweise umwandelst — das ergibt den kleinstmöglichen Wurzelexponenten.

## Zusammenfassung: Alle Potenzgesetze auf einen Blick
$$a^m \cdot a^n = a^{m+n} \qquad a^m : a^n = a^{m-n} \qquad (a^m)^n = a^{m\cdot n}$$
$$a^0 = 1 \qquad a^{-n} = \frac{1}{a^n} \qquad a^{\frac{m}{n}} = \sqrt[n]{a^m}$$
