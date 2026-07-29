> 🧪 **Beta** — nicht in deinen OneNote-Notizen/Zusammenfassungen von Jahr 3 gefunden. Aus dem offiziellen LG-Lehrplan + ergänzender Recherche erstellt. Ersetzen/ergänzen, sobald echte Notizen vorliegen.

# Potenzgesetze — Grundlagen

## Grundbegriff
Eine Potenz $a^n$ besteht aus **Basis** $a$ und **Exponent** $n$:
$$a^n = \underbrace{a \cdot a \cdot \dots \cdot a}_{n \text{ Faktoren}} \qquad (n \in \mathbb{N})$$

**Beispiel:** $2^4 = 2\cdot2\cdot2\cdot2 = 16$

## Die Potenzgesetze
| Regel | Formel | Beispiel |
|---|---|---|
| Produkt gleicher Basis | $a^m \cdot a^n = a^{m+n}$ | $2^3\cdot 2^2 = 2^5 = 32$ |
| Quotient gleicher Basis | $a^m : a^n = a^{m-n}$ | $2^5:2^2 = 2^3 = 8$ |
| Potenz einer Potenz | $(a^m)^n = a^{m\cdot n}$ | $(2^2)^3 = 2^6 = 64$ |
| Produkt verschiedener Basen, gleicher Exponent | $a^n\cdot b^n = (a\cdot b)^n$ | $2^3\cdot3^3 = 6^3 = 216$ |
| Quotient verschiedener Basen, gleicher Exponent | $a^n:b^n = (a:b)^n$ | $6^2:3^2 = 2^2 = 4$ |

> Merke: Beim Multiplizieren/Dividieren **gleicher Basen** werden die Exponenten addiert/subtrahiert — die Basis bleibt unverändert stehen. Das gilt **nur**, wenn die Basis gleich ist!

## Sonderfälle
$$a^0 = 1 \quad (a \neq 0) \qquad\qquad a^1 = a$$

**Achtung:** $a^0 = 1$ gilt für **jede** Basis $\neq 0$ — auch für grosse Zahlen: $1000^0 = 1$.

## Negative Exponenten (Kehrwert)
$$a^{-n} = \frac{1}{a^n} \quad (a \neq 0)$$

**Beispiele:**
```
2⁻³ = 1/2³ = 1/8       (NICHT -8!)
5⁻¹ = 1/5
(1/2)⁻² = 2² = 4       (Kehrwert der Basis, dann positiv potenzieren)
```

> Achtung Prüfung: Ein negativer Exponent macht die Zahl **nicht negativ** — er bedeutet **Kehrwert**. Das ist der häufigste Fehler bei diesem Thema.

## Vorzeichenregeln bei Potenzen mit negativer Basis
| Exponent | Vorzeichen des Ergebnisses |
|---|---|
| gerade ($n$ gerade) | immer **positiv** |
| ungerade ($n$ ungerade) | Vorzeichen der Basis |

**Beispiele:**
```
(-2)² = 4      (gerader Exponent → positiv)
(-2)³ = -8     (ungerader Exponent → negativ)
-2²  = -4      (Achtung: ohne Klammer gilt das Minus NICHT als Teil der Basis!)
```

> Achtung Prüfung: $(-2)^2$ und $-2^2$ sind **nicht dasselbe**! Ohne Klammern potenziert man zuerst und wendet das Minus erst danach an: $-2^2 = -(2^2) = -4$.

## Rechnen mit Termen (mehrere Potenzen kombinieren)
Vorgehen: zuerst Klammern auflösen (Potenz einer Potenz), dann gleiche Basen zusammenfassen.

**Beispiel:**
```
(x²)³ · x⁻² = x⁶ · x⁻² = x^(6-2) = x⁴
```

**Beispiel mit Zahlen und Variablen gemischt:**
```
2a³ · 3a⁻⁵ = 6a^(3-5) = 6a⁻² = 6/a²
```

## Zusammenfassung
$$\boxed{a^m\cdot a^n = a^{m+n} \qquad a^m:a^n = a^{m-n} \qquad (a^m)^n = a^{m\cdot n} \qquad a^0=1 \qquad a^{-n}=\frac{1}{a^n}}$$

> Merke: Diese Grundgesetze sind die Basis für Jahr 5 (Potenzfunktionen, Wurzeln als gebrochene Exponenten, Exponentialfunktionen) — sie müssen absolut sicher sitzen.
