# Kreislehre

> ✅ Aus deinen echten OneNote-Notizen (Jahr 4) übernommen und aufbereitet.

## Kreisteile

| Begriff | Beschreibung |
|---|---|
| Radius $r$ | Strecke Mittelpunkt–Rand |
| Durchmesser $d$ | $d = 2r$ |
| Sehne | Strecke, die innerhalb des Kreises verläuft, genau zwei Punkte mit dem Kreis gemeinsam |
| Kreisbogen | Teil der Kreislinie |
| Kreissektor | „Tortenstück" zwischen zwei Radien |
| Kreissegment | Fläche zwischen Sehne und Bogen |

## Gegenseitige Lage von Kreis und Gerade

| Gerade | Eigenschaft |
|---|---|
| **Passante** $p$ | passiert den Kreis, kein gemeinsamer Punkt ($M_p > r$) |
| **Tangente** $t$ | berührt den Kreis in genau einem Punkt $B$ (Berührungspunkt); steht **senkrecht** auf dem Radius $MB$ ($M_t = r$) |
| **Sekante** | schneidet den Kreis in genau zwei Punkten ($M_s < r$) |

Ein Kreis ist durch **3 Punkte eindeutig bestimmt** — der Mittelpunkt liegt auf dem Schnittpunkt der Mittelsenkrechten von je zwei Punkten.

## Definition und Näherung von π
$\pi \approx 3.14159...$ ist irrational und wird näherungsweise berechnet — z. B. über den Umfang von einbeschriebenen/umschriebenen Vielecken, die sich dem Kreis annähern.

## Umfang und Fläche

$$u = 2\pi r = \pi d \qquad A = \pi r^2$$

**Herleitung der Flächenformel:** Zerlegt man den Kreis in immer feinere Sektoren und legt sie abwechselnd um, entsteht näherungsweise ein Rechteck mit Länge $\frac{u}{2}$ (halber Umfang) und Breite $r$ — daraus folgt $A = \frac{u}{2}\cdot r = \pi r^2$.

## Bogenlänge und Sektorfläche

Bei Zentriwinkel $\alpha$ (in Grad):

$$b = \frac{\alpha}{360°}\cdot 2\pi r \qquad A_{Sektor} = \frac{\alpha}{360°}\cdot \pi r^2$$

Begründung: Bogenlänge und Sektorfläche sind proportional zum Zentriwinkel — der Bruchteil des vollen Kreises (Zentriwinkel geteilt durch 360°) mal Kreisumfang bzw. Kreisfläche.

> Achtung Prüfung: Winkel im Gradmass in die Formel einsetzen, nicht im Bogenmass (ausser explizit verlangt).

## Konstruktionen am Kreis (Tangenten, berührende Kreise)

**Grundkonstruktion 1 — Tangente durch einen Punkt der Kreislinie:** Lot auf $MB$ durch $B$ (nutzt: Tangente steht senkrecht auf dem Radius).

**Grundkonstruktion 2 — Tangenten durch einen Punkt $P$ ausserhalb des Kreises:** Thaleskreis über $MP$ schneidet $k$ in den Berührungspunkten $B_1, B_2$; $PB_1$ und $PB_2$ verbinden ergibt die beiden Tangenten $t_1, t_2$.

**Grundkonstruktion 3 — Kreise, die zwei sich schneidende Geraden berühren:** Der gesuchte Mittelpunkt hat von beiden Geraden gleichen Abstand → liegt auf der **Winkelhalbierenden**. Lot auf eine der Geraden durch den vorgegebenen Berührpunkt schneidet die Winkelhalbierende im Mittelpunkt.

**Grundkonstruktion 4 — Kreise, die zwei Geraden UND einen weiteren Kreis berühren:** kombiniert Winkelhalbierende (für die Geraden) mit der Bedingung, dass sich berührende Kreise gemeinsame Tangenten haben.

> Merke: Bei allen Tangentenkonstruktionen durch einen äusseren Punkt gilt: **Berührungspunkt, Kreismittelpunkt und äusserer Punkt bilden ein rechtwinkliges Dreieck** → Thaleskreis!
