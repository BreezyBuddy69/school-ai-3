# Bedingte Wahrscheinlichkeit und Baumdiagramme

> 🧪 **Beta** — nicht in deinen OneNote-Notizen/Zusammenfassungen von Jahr 3 gefunden. Aus dem offiziellen LG-Lehrplan + ergänzender Recherche erstellt. Ersetzen/ergänzen, sobald echte Notizen vorliegen.

## Mehrstufige Zufallsexperimente
Wenn ein Experiment aus mehreren Teilschritten besteht (z.B. zweimal würfeln, zweimal ziehen ohne Zurücklegen), hilft ein **Baumdiagramm** zur Übersicht.

### Aufbau eines Baumdiagramms
```
                     P(A)=0.6           P(B)=0.4
                    ┌────── A ──────┬────────── B ──────┐
Start ──────────────┤                                    │
                    │  P(A2|A)=0.7   P(B2|A)=0.3   ...   │
                    ├────── A2 ──┴────── B2 ──┘          │
```
- Jeder **Pfad** von der Wurzel zu einem Endpunkt entspricht einer möglichen Ergebniskombination
- An jeder Verzweigung stehen die (bedingten) Wahrscheinlichkeiten der nächsten Stufe

## Pfadregeln
1. **Produktregel (Pfadmultiplikationsregel):** Die Wahrscheinlichkeit eines Pfades ist das Produkt der Wahrscheinlichkeiten entlang des Pfades.
2. **Summenregel (Pfadadditionsregel):** Die Wahrscheinlichkeit eines Ereignisses ist die Summe der Wahrscheinlichkeiten aller zu diesem Ereignis gehörenden Pfade.

## Bedingte Wahrscheinlichkeit
**Definition:** Die Wahrscheinlichkeit von B, **gegeben dass** A bereits eingetreten ist:
$$P(B|A) = \frac{P(A \cap B)}{P(A)}, \quad P(A) > 0$$

Umgestellt ergibt sich der **Multiplikationssatz**:
$$P(A \cap B) = P(A) \cdot P(B|A)$$

**Beispiel:** Urne mit 5 roten und 3 blauen Kugeln, zwei Kugeln werden **ohne Zurücklegen** gezogen.
- P(1. Kugel rot) = 5/8
- P(2. Kugel rot | 1. Kugel war rot) = 4/7 (eine rote Kugel weniger in der Urne!)
- P(beide rot) = 5/8 · 4/7 = 20/56 = 5/14

> Achtung Prüfung: **"Ohne Zurücklegen"** verändert die Wahrscheinlichkeiten der nächsten Stufe (Abhängigkeit!) — **"mit Zurücklegen"** bleiben sie gleich (Unabhängigkeit).

## Unabhängigkeit (Wiederholung/Vertiefung)
A und B sind unabhängig, wenn gilt:
$$P(B|A) = P(B)$$
— das Eintreten von A verändert die Wahrscheinlichkeit von B also **nicht**.

## Der Satz von Bayes (Grundidee)
Manchmal kennt man P(B|A), sucht aber P(A|B) (die "umgekehrte" bedingte Wahrscheinlichkeit) — z.B. bei medizinischen Tests: man kennt P(positiver Test | krank), sucht aber P(krank | positiver Test).

$$P(A|B) = \frac{P(B|A) \cdot P(A)}{P(B)}$$

**Anwendungsbeispiel (vereinfacht):** Ein Test erkennt eine seltene Krankheit (1% der Bevölkerung) mit 99% Trefferquote. Trotzdem ist bei einem positiven Testergebnis die Wahrscheinlichkeit, wirklich krank zu sein, **deutlich unter 99%** — weil es unter den 99% Gesunden auch einige falsch-positive Tests gibt, die bei so einer seltenen Krankheit zahlenmässig ins Gewicht fallen.

> Merke: Dieses "Bayes-Paradoxon" zeigt, wie wichtig die **Grundwahrscheinlichkeit (Prävalenz)** eines Ereignisses für die richtige Interpretation von bedingten Wahrscheinlichkeiten ist.
