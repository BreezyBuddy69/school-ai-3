# Kombinatorik

> 🧪 **Beta** — nicht in deinen OneNote-Notizen/Zusammenfassungen von Jahr 3 gefunden. Aus dem offiziellen LG-Lehrplan + ergänzender Recherche erstellt. Ersetzen/ergänzen, sobald echte Notizen vorliegen.

## Wozu Kombinatorik?
Sie beantwortet die Frage: **"Auf wie viele verschiedene Arten kann man etwas anordnen/auswählen?"** — die Grundlage, um bei der Laplace-Wahrscheinlichkeit "Anzahl günstiger/möglicher Ergebnisse" überhaupt zählen zu können.

## Fakultät
$$n! = n \cdot (n-1) \cdot (n-2) \cdots 2 \cdot 1, \quad 0! = 1$$

**Beispiel:** 5! = 5·4·3·2·1 = 120

## Permutationen (Anordnung aller Elemente)
**Ohne Wiederholung:** Anzahl Anordnungen von n verschiedenen Elementen:
$$P(n) = n!$$
**Beispiel:** 4 Bücher ins Regal stellen → 4! = 24 Möglichkeiten

**Mit Wiederholung** (manche Elemente identisch): bei n Elementen mit Gruppen der Grössen $k_1, k_2, ...$ identischer Elemente:
$$P(n; k_1, k_2, ...) = \frac{n!}{k_1! \cdot k_2! \cdots}$$
**Beispiel:** Wie viele Anordnungen des Wortes "MISSISSIPPI" (11 Buchstaben, davon 4×I, 4×S, 2×P)? → 11!/(4!·4!·2!)

## Variationen (Auswahl mit Reihenfolge wichtig)
**Ohne Wiederholung** (kein Element mehrfach wählbar):
$$V(n,k) = \frac{n!}{(n-k)!}$$
**Beispiel:** Wie viele Möglichkeiten für Gold/Silber/Bronze bei 8 Läufern? → V(8,3) = 8·7·6 = 336

**Mit Wiederholung** (Elemente mehrfach wählbar):
$$V_W(n,k) = n^k$$
**Beispiel:** 4-stelliger PIN-Code aus Ziffern 0–9 → $10^4$ = 10'000 Möglichkeiten

## Kombinationen (Auswahl, Reihenfolge egal)
**Ohne Wiederholung** — der **Binomialkoeffizient**:
$$\binom{n}{k} = \frac{n!}{k! \cdot (n-k)!}$$
**Beispiel:** Wie viele Möglichkeiten, aus 6 Personen ein 2er-Team zu bilden? → $\binom{6}{2} = \frac{6!}{2! \cdot 4!} = 15$

> Merke: Beim **Lotto "6 aus 45"** ist die Reihenfolge egal und keine Zahl wiederholbar → $\binom{45}{6}$ = 8'145'060 Möglichkeiten. Deshalb ist die Gewinnwahrscheinlichkeit so verschwindend klein!

## Übersichtstabelle
| | Reihenfolge wichtig | Reihenfolge egal |
|---|---|---|
| **ohne Wiederholung** | Variation $V(n,k) = \frac{n!}{(n-k)!}$ | Kombination $\binom{n}{k}$ |
| **mit Wiederholung** | Variation $V_W(n,k) = n^k$ | Kombination (selten geprüft) |

## Der Binomialkoeffizient und das Pascalsche Dreieck
Die Werte von $\binom{n}{k}$ lassen sich elegant im **Pascalschen Dreieck** ablesen — jede Zahl ist die Summe der beiden darüberliegenden.

![Pascalsches Dreieck, Zeilen 0 bis 16](https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Pascal%27s_Triangle_rows_0-16.svg/1280px-Pascal%27s_Triangle_rows_0-16.svg.png)

> Achtung Prüfung: Die häufigste Fehlerquelle ist, **Variation und Kombination zu verwechseln** — immer zuerst fragen: "Spielt die Reihenfolge eine Rolle?"
