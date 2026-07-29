# Investitionsrechnung: Dynamische Methoden (Kapitalwert & interner Zinsfuss)

**Fach:** Integrationsfach Betriebswirtschaftslehre (Profil Wirtschaft und Recht) | **Klasse:** 5Wa

> 🧪 **Beta** — nicht in deinen OneNote-Notizen/Zusammenfassungen von Jahr 5 gefunden. Aus dem offiziellen LG-Lehrplan + ergänzender Recherche erstellt. Ersetzen/ergänzen, sobald echte Notizen vorliegen. (Deine Notizen zu Kapitel D18 enthalten für diesen Teil nur Foliennamen wie „Dynamische Methoden" und „NPV, IRR — Theorie" ohne ausgeführte Inhalte.)

## Warum dynamische statt statische Methoden?

Die statischen Methoden (Kosten-, Gewinn-, Rentabilitätsvergleich) betrachten meist nur **eine** repräsentative Periode und ignorieren den **Zeitwert des Geldes**: ein Franken heute ist mehr wert als ein Franken in fünf Jahren, weil man ihn heute anlegen und verzinsen könnte. Dynamische Methoden zinsen alle zukünftigen Zahlungen auf den heutigen Zeitpunkt ab.

## 1. Die Kapitalwertmethode (Net Present Value, NPV)

Der **Kapitalwert** (Nettobarwert) einer Investition ist die Summe aller mit dem Kalkulationszinssatz abgezinsten zukünftigen Zahlungsüberschüsse, abzüglich der Anfangsinvestition:

$$C_0 = -I_0 + \sum_{t=1}^{n} \frac{E_t - A_t}{(1+i)^t} + \frac{L_n}{(1+i)^n}$$

| Symbol | Bedeutung |
|---|---|
| $I_0$ | Anfangsinvestition (Auszahlung zum Zeitpunkt 0) |
| $E_t - A_t$ | Nettozahlungsüberschuss (Einzahlungen minus Auszahlungen) der Periode $t$ |
| $i$ | Kalkulationszinssatz (geforderte Mindestverzinsung) |
| $n$ | Nutzungsdauer in Perioden |
| $L_n$ | Liquidationserlös am Ende der Nutzungsdauer |

**Entscheidungsregel:**
- $C_0 > 0$ → Investition ist vorteilhaft (sie erwirtschaftet mehr als die geforderte Mindestverzinsung)
- $C_0 = 0$ → Investition erwirtschaftet genau die geforderte Mindestverzinsung
- $C_0 < 0$ → Investition ist unvorteilhaft
- Bei mehreren Alternativen: diejenige mit dem **höchsten** Kapitalwert wählen

> Merke: Der Kapitalwert beantwortet die Frage: *"Wie viel ist diese Investition heute wert, wenn ich alle zukünftigen Zahlungen mit dem geforderten Zinssatz auf heute abzinse?"*

## 2. Die interne Zinsfussmethode (Internal Rate of Return, IRR)

Der **interne Zinsfuss** ist derjenige Kalkulationszinssatz $i^*$, bei dem der Kapitalwert **genau null** wird:

$$C_0(i^*) = 0$$

Er zeigt die tatsächliche, durchschnittliche jährliche Verzinsung des in der Investition gebundenen Kapitals.

**Entscheidungsregel:** Die Investition ist vorteilhaft, wenn der interne Zinsfuss **höher** ist als der vom Unternehmen geforderte Mindestzinssatz (Kapitalkostensatz). Bei mehreren Alternativen wird diejenige mit dem **höchsten** internen Zinsfuss bevorzugt.

> Achtung Prüfung: Der interne Zinsfuss lässt sich meist nicht direkt nach $i$ auflösen — in der Praxis/Prüfung wird er oft durch **Interpolation** zwischen einem Kalkulationszinssatz mit positivem und einem mit negativem Kapitalwert angenähert:

$$i^* \approx i_1 + (i_2 - i_1) \cdot \frac{C_0(i_1)}{C_0(i_1) - C_0(i_2)}$$

## 3. Vergleich: Kapitalwertmethode vs. interne Zinsfussmethode

| | Kapitalwertmethode | Interne Zinsfussmethode |
|---|---|---|
| Ergebnis | absoluter Geldbetrag (CHF) | relativer Prozentsatz (Rendite) |
| Frage | "Wie viel Mehrwert schafft die Investition?" | "Welche Rendite wirft die Investition ab?" |
| Vorteil | direkt vergleichbar mit anderen Geldbeträgen, eindeutig bei unterschiedlich grossen Investitionen | gut verständlich, direkt mit Zinssätzen/Renditeerwartungen vergleichbar |
| Nachteil | abhängig von der Wahl des Kalkulationszinssatzes | kann bei unregelmässigen Zahlungsreihen mehrere Lösungen liefern |

## 4. Zusammenhang mit den statischen Methoden

Die dynamischen Methoden lösen ein zentrales Problem der statischen Methoden: Sie berücksichtigen, **wann** eine Zahlung anfällt, nicht nur **wie viel**. Eine Investition mit hohen Erträgen erst in fernen Jahren wird dadurch tendenziell schlechter bewertet als eine mit früheren, aber etwas kleineren Erträgen — was der wirtschaftlichen Realität (Zinsen, Inflation, Risiko) besser entspricht.

> Ergänze dieses Kapitel am besten mit den konkreten Zahlenbeispielen und Abzinsungstabellen aus deinem Schulbuch (Kapitel D18) bzw. dem Unterricht, sobald du sie zur Hand hast — insbesondere die im Unterricht behandelten Übungsserien zu „Prüfungsaufgaben" und „Maturaaufgaben".
