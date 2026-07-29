> 🧪 **Beta** — nicht in deinen OneNote-Notizen/Zusammenfassungen von Jahr 3 gefunden. Aus dem offiziellen LG-Lehrplan + ergänzender Recherche erstellt. Ersetzen/ergänzen, sobald echte Notizen vorliegen.

# Prozent- und Zinsrechnung

## Grundbegriffe der Prozentrechnung
$$p\% = \frac{p}{100}$$

| Begriff | Bedeutung | Formel |
|---|---|---|
| Grundwert $G$ | das Ganze (100 %) | — |
| Prozentsatz $p\%$ | der Anteil in Prozent | — |
| Prozentwert $W$ | der Anteil als Zahl | $W = \dfrac{G\cdot p}{100}$ |

## Die drei Grundaufgaben
| Gesucht | Formel |
|---|---|
| Prozentwert $W$ | $W = \dfrac{G\cdot p}{100}$ |
| Grundwert $G$ | $G = \dfrac{W\cdot100}{p}$ |
| Prozentsatz $p$ | $p = \dfrac{W\cdot100}{G}$ |

**Beispiel (Prozentwert gesucht):** 8 % von 250 CHF
```
W = (250·8)/100 = 20 CHF
```

**Beispiel (Grundwert gesucht):** 15 CHF sind 6 % von wieviel?
```
G = (15·100)/6 = 250 CHF
```

**Beispiel (Prozentsatz gesucht):** 30 CHF von 200 CHF sind wieviel Prozent?
```
p = (30·100)/200 = 15 %
```

> Achtung Prüfung: Immer zuerst festlegen, was der **Grundwert (100 %)** in der Aufgabe ist — die häufigste Fehlerquelle ist, den falschen Wert als Grundwert zu nehmen.

## Prozentuale Zu- und Abnahme
$$\text{neuer Wert} = G\cdot\left(1 \pm \frac{p}{100}\right)$$

**Beispiel Zunahme:** Ein Artikel kostet 80 CHF, Preis steigt um 15 %.
```
neuer Preis = 80·(1 + 0,15) = 80·1,15 = 92 CHF
```

**Beispiel Abnahme:** Ein Artikel kostet 92 CHF, Preis sinkt um 15 %.
```
neuer Preis = 92·(1 - 0,15) = 92·0,85 = 78,20 CHF
```

> Merke: 15 % Rabatt auf 92 CHF ergibt **nicht** wieder 80 CHF wie oben — Zu- und Abnahme um denselben Prozentsatz sind **nicht symmetrisch**, weil sich der Grundwert ändert!

## Zinsrechnung (einfache Zinsen)
$$Z = \frac{K\cdot p\cdot t}{100}$$

$K$ = Kapital, $p$ = Zinssatz in %, $t$ = Zeit in Jahren, $Z$ = Zinsertrag.

**Beispiel:** $K=2000\text{ CHF}$, $p=3\%$, $t=4$ Jahre
```
Z = (2000·3·4)/100 = 240 CHF
```

Bei Monaten statt Jahren: $t = \dfrac{\text{Monate}}{12}$.

## Zinseszins (Kapital wächst exponentiell)
Werden die Zinsen jedes Jahr **zum Kapital dazugeschlagen** und im Folgejahr mitverzinst, wächst das Kapital **exponentiell**:

$$K_n = K_0\cdot\left(1+\frac{p}{100}\right)^n$$

$K_0$ = Anfangskapital, $n$ = Anzahl Jahre, $K_n$ = Kapital nach $n$ Jahren.

**Beispiel:** $K_0 = 1000\text{ CHF}$, $p=4\%$, $n=3$ Jahre
```
K₃ = 1000·(1,04)³ = 1000·1,124864 ≈ 1124,86 CHF
```

Vergleich mit einfachen Zinsen über 3 Jahre: $1000 + 3\cdot40 = 1120\text{ CHF}$ — **weniger** als mit Zinseszins, weil dort die Zinsen selbst keine weiteren Zinsen abwerfen.

> Merke: Die Formel $K_n = K_0\cdot(1+\tfrac{p}{100})^n$ hat **exakt** die Form der Exponentialfunktion $f(x)=b\cdot a^x$, die du in Jahr 5 systematisch untersuchst. Zinseszins ist das wichtigste Alltagsbeispiel für exponentielles Wachstum.

## Rückwärtsrechnen: Anfangskapital oder Laufzeit gesucht
**Anfangskapital gesucht** (Endkapital bekannt):
$$K_0 = \frac{K_n}{\left(1+\frac{p}{100}\right)^n}$$

**Beispiel:** Wie viel muss ich heute anlegen, um in 5 Jahren bei 3 % genau 5000 CHF zu haben?
```
K₀ = 5000 / (1,03)⁵ ≈ 5000 / 1,159274 ≈ 4313,26 CHF
```

> Achtung Prüfung: Ist die Laufzeit $n$ gesucht, muss die Gleichung $K_n=K_0\cdot(1+\tfrac{p}{100})^n$ nach dem **Exponenten** aufgelöst werden — das geht erst mit dem Logarithmus, den du in Jahr 5 (Logarithmusfunktion) lernst.
