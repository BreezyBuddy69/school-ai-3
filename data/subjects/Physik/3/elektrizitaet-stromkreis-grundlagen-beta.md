# Elektrizität: Stromkreis — Grundlagen

> 🧪 **Beta** — nicht in deinen OneNote-Notizen/Zusammenfassungen von Jahr 3 gefunden. Aus dem offiziellen LG-Lehrplan + ergänzender Recherche erstellt. Ersetzen/ergänzen, sobald echte Notizen vorliegen.

## Der einfache Stromkreis

Damit elektrischer Strom fliesst, braucht es einen **geschlossenen Kreislauf** aus:
1. **Spannungsquelle** (z. B. Batterie) — treibt den Strom an
2. **Leitung** (Kabel) — leitet den Strom
3. **Verbraucher** (z. B. Lampe, Motor) — wandelt elektrische Energie um
4. **Schalter** (optional) — öffnet/schliesst den Kreis

## Grundgrössen der Elektrizität

| Grösse | Formelzeichen | Einheit | Bedeutung |
|---|---|---|---|
| **Stromstärke** | $I$ | Ampere (A) | Menge der pro Zeit fliessenden Ladung |
| **Spannung** | $U$ | Volt (V) | "elektrischer Antrieb", treibt Ladungen durch den Kreis |
| **Widerstand** | $R$ | Ohm (Ω) | Mass dafür, wie stark ein Bauteil den Stromfluss behindert |

## Das Ohmsche Gesetz

$$U = R \cdot I \qquad \text{bzw.} \qquad I = \frac{U}{R} \qquad \text{bzw.} \qquad R = \frac{U}{I}$$

> Merke: Bei konstantem Widerstand gilt: Je **höher** die Spannung, desto **höher** die Stromstärke (proportional).

**Beispielrechnung:** Eine Lampe mit Widerstand $R = 60\ \Omega$ liegt an $U = 12\ \text{V}$. Welche Stromstärke fliesst?
$$I = \frac{U}{R} = \frac{12\,\text{V}}{60\,\Omega} = 0{,}2\,\text{A}$$

## Reihenschaltung und Parallelschaltung

![Reihenschaltung und Parallelschaltung mit zwei Widerständen](https://upload.wikimedia.org/wikipedia/commons/b/b7/Series_and_parallel_circuits.svg)

| | Reihenschaltung | Parallelschaltung |
|---|---|---|
| **Anordnung** | Verbraucher hintereinander, ein einziger Strompfad | Verbraucher nebeneinander, mehrere Strompfade |
| **Stromstärke** | überall im Kreis **gleich**: $I = I_1 = I_2$ | teilt sich auf: $I = I_1 + I_2$ |
| **Spannung** | teilt sich auf die Verbraucher auf: $U = U_1 + U_2$ | an jedem Verbraucher **gleich**: $U = U_1 = U_2$ |
| **Gesamtwiderstand** | $R_{\text{ges}} = R_1 + R_2$ | $\dfrac{1}{R_{\text{ges}}} = \dfrac{1}{R_1} + \dfrac{1}{R_2}$ |
| **Ausfall einer Lampe** | ganzer Kreis unterbrochen (alle Lampen erlöschen) | andere Verbraucher leuchten weiter |

> Achtung Prüfung: In der **Reihenschaltung** ist die Stromstärke überall gleich, in der **Parallelschaltung** ist die Spannung überall gleich — diese beiden Regeln werden in Prüfungen häufig vertauscht.

> Merke: Weihnachtslichterketten in **Reihenschaltung** haben den Nachteil, dass eine kaputte Lampe die ganze Kette erlöschen lässt — Hausinstallationen sind deshalb als **Parallelschaltung** verdrahtet.

## Leiter und Isolatoren

| Leiter | Isolator |
|---|---|
| Metalle (Kupfer, Aluminium) | Kunststoff, Gummi, Glas, Holz (trocken) |
| Graphit | Luft (bei normaler Spannung) |
| Salzwasser | destilliertes Wasser |

> Ein **Leiter** hat frei bewegliche Elektronen (bei Metallen: Elektronengas, siehe Chemie: Atombau und Periodensystem), ein **Isolator** hat keine oder kaum frei beweglichen Ladungsträger.

## Sicherheit im Umgang mit Strom

- Nie mit nassen Händen elektrische Geräte bedienen (Wasser leitet Strom)
- Beschädigte Kabel nicht berühren
- Sicherungen/FI-Schutzschalter schützen vor gefährlichen Stromstärken im Haushalt
