# Wahrscheinlichkeitsrechnung — Grundlagen

> 🧪 **Beta** — nicht in deinen OneNote-Notizen/Zusammenfassungen von Jahr 3 gefunden. Aus dem offiziellen LG-Lehrplan + ergänzender Recherche erstellt. Ersetzen/ergänzen, sobald echte Notizen vorliegen.

*Fortsetzung von "Lagemasse und Streuung" (Jahr 1) — von der beschreibenden Statistik zur Wahrscheinlichkeitsrechnung.*

## Grundbegriffe
- **Zufallsexperiment**: Vorgang mit ungewissem Ausgang, der (gedanklich) beliebig oft wiederholbar ist (z.B. Würfeln, Münzwurf)
- **Ergebnis**: ein möglicher Ausgang des Experiments
- **Ergebnismenge Ω (Omega)**: Menge aller möglichen Ergebnisse (z.B. beim Würfel: Ω = {1,2,3,4,5,6})
- **Ereignis**: Teilmenge der Ergebnismenge (z.B. "gerade Zahl würfeln" = {2,4,6})

## Wahrscheinlichkeitsbegriffe

### Klassische (Laplace-)Wahrscheinlichkeit
Gilt, wenn alle Ergebnisse **gleich wahrscheinlich** sind:
$$P(A) = \frac{\text{Anzahl günstiger Ergebnisse}}{\text{Anzahl möglicher Ergebnisse}}$$

**Beispiel:** P(gerade Zahl beim Würfel) = 3/6 = 0.5 = 50%

### Relative Häufigkeit (empirische Wahrscheinlichkeit)
$$h(A) = \frac{\text{Anzahl der Versuche mit Ereignis A}}{\text{Gesamtzahl der Versuche}}$$

Bei sehr vielen Wiederholungen nähert sich die relative Häufigkeit der theoretischen Wahrscheinlichkeit an — **Gesetz der grossen Zahlen**.

## Rechenregeln
| Regel | Formel | Bedeutung |
|---|---|---|
| Wertebereich | $0 \le P(A) \le 1$ | Wahrscheinlichkeiten liegen immer zwischen 0 und 1 |
| Sicheres Ereignis | $P(\Omega) = 1$ | Ω tritt immer ein |
| Unmögliches Ereignis | $P(\emptyset) = 0$ | Leere Menge tritt nie ein |
| Gegenereignis | $P(\bar{A}) = 1 - P(A)$ | Wahrscheinlichkeit, dass A **nicht** eintritt |
| Additionssatz (allgemein) | $P(A \cup B) = P(A) + P(B) - P(A \cap B)$ | für sich überschneidende Ereignisse |
| Additionssatz (disjunkt) | $P(A \cup B) = P(A) + P(B)$ | wenn A und B sich gegenseitig ausschliessen |

> Merke: Das **Gegenereignis** ist oft der schnellste Lösungsweg — z.B. "mindestens einmal Kopf bei 3 Würfen" leichter über "kein einziges Mal Kopf" (Gegenereignis) berechnen.

## Beispielaufgabe
**Frage:** Wie hoch ist die Wahrscheinlichkeit, beim einmaligen Würfeln eine 1 **oder** eine gerade Zahl zu würfeln?

- A = {1}, B = {2,4,6} → A und B sind disjunkt (keine Überschneidung)
- P(A ∪ B) = P(A) + P(B) = 1/6 + 3/6 = 4/6 = 2/3

## Unabhängigkeit von Ereignissen
Zwei Ereignisse A und B sind **unabhängig**, wenn das Eintreten von A die Wahrscheinlichkeit von B nicht beeinflusst:
$$P(A \cap B) = P(A) \cdot P(B)$$

**Beispiel:** Zweimaliges Würfeln — die beiden Würfe beeinflussen sich nicht gegenseitig.

> Achtung Prüfung: "Unabhängig" (stochastisch) ist nicht dasselbe wie "disjunkt" — disjunkte Ereignisse mit P(A), P(B) > 0 sind sogar **maximal abhängig** (schliessen sich gegenseitig aus)!
