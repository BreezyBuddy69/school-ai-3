# Stereometrie: Prismen, Pyramiden, Zylinder, Kegel, Kugeln

> ✅ Aus deinen echten OneNote-Notizen (Jahr 4) übernommen und aufbereitet (Prismen und Pyramiden). Zylinder/Kegel/Kugel waren in deinem Notizbuch als leere Kapitel angelegt — deren Formeln stammen ergänzend aus dem offiziellen Lehrplan.

## Prismen

**Definition:** Ein Prisma ist ein geometrischer Körper, der sich aus einer Grundfläche, einer (kongruenten, parallelen) Deckfläche und einem Mantel aus Parallelogrammen zusammensetzt.

- **Gerades Prisma:** Mantellinien stehen senkrecht zu den Grundkanten → Seitenflächen sind Rechtecke.
- **Schiefes Prisma:** Mantellinien stehen nicht senkrecht zu den Grundkanten → Seitenflächen sind Parallelogramme.
- **Reguläres Prisma:** gerades Prisma, dessen Grundfläche ein regelmässiges Vieleck ist. Ein Würfel ist ein reguläres, vierseitiges Prisma mit quadratischer Grundfläche.
- $n$-seitiges Prisma: $2n$ Ecken, $3n$ Kanten, $n+2$ Flächen.

**Volumen:** $V_{Prisma} = G \cdot h$ ($G$ = Grundfläche, $h$ = Abstand zwischen Grund- und Deckfläche — **nicht** die Kantenlänge bei einem schiefen Prisma!)

**Oberfläche:** $O_{Prisma} = 2\cdot G + M$, wobei der Mantel $M = U_{Grundfläche}\cdot h$ (Umfang der Grundfläche mal Höhe).

## Pyramiden

Regelmässige Pyramide mit quadratischer/rechteckiger/vieleckiger Grundfläche: Spitze $S$, Höhenfusspunkt $F$ (Mittelpunkt der Grundfläche), Seitenkante $s$, Körperhöhe $h$, Höhe der Seitenfläche (Seitenhöhe) $h_a$.

**Volumen:** $$V_{Pyramide} = \frac{G\cdot h}{3}$$

**Oberfläche:** $$O = G + M$$ ($M$ = Summe der Mantel-Seitenflächen)

**Seitenkante $s$ (via Pythagoras im Dreieck Spitze–Höhenfusspunkt–Eckpunkt):**
$$s^2 = h^2 + \left(\frac{\text{Diagonale der Grundfläche}}{2}\right)^2$$

**Seitenhöhe $h_a$ (via Pythagoras im Dreieck Spitze–Höhenfusspunkt–Kantenmittelpunkt):**
$$h_a^2 = h^2+\left(\frac{a}{2}\right)^2$$

> Merke: Bei quadratischer Grundfläche mit Seite $a$ ist die Grundflächendiagonale $a\sqrt2$ — daraus über Pythagoras die Seitenkante $s$ berechnen.

**Beispiel-Vorgehen** (rechteckige Pyramide, Grundkanten $a,b$, Höhe $h$ bekannt):
1. $h_a^2 = h^2+\left(\frac{b}{2}\right)^2$ und $h_b^2 = h^2+\left(\frac{a}{2}\right)^2$ (Seitenhöhen zu beiden Grundkanten)
2. $O = a\cdot b + a\cdot h_a + b\cdot h_b$
3. $V = \frac{a\cdot b\cdot h}{3}$
4. Seitenkante $s$ über ein weiteres Pythagoras-Dreieck aus $h$ und der halben Grundflächendiagonale.

## Satz von Cavalieri
Zwei Körper gleicher Höhe haben gleiches Volumen, wenn alle Querschnittsflächen auf gleicher Höhe flächengleich sind. Damit lässt sich z. B. $V_{Pyramide}=\frac13 G h$ auch für **schiefe** Pyramiden begründen.

## Zylinder, Kegel, Kugel — Formelsammlung

| Körper | Volumen $V$ | Oberfläche $O$ |
|---|---|---|
| Zylinder | $\pi r^2 h$ | $2\pi r^2+2\pi rh$ |
| Kegel | $\frac13 \pi r^2 h$ | $\pi r^2+\pi r s$ ($s$ = Mantellinie) |
| Kugel | $\frac{4}{3}\pi r^3$ | $4\pi r^2$ |

**Mantellinie beim Kegel** (Satz des Pythagoras im Achsenschnitt des Kegels):
$$s = \sqrt{r^2+h^2}$$

> Merke: Pyramide/Kegel = $\frac13$ des „passenden" Prismas/Zylinders mit gleicher Grundfläche und Höhe.

> Achtung Prüfung: Bei Pyramide/Kegel zwischen Körperhöhe $h$, Seitenhöhe $h_a$ und Seitenkante/Mantellinie $s$ unterscheiden — alle drei kommen in Prüfungen oft gemischt vor und werden je über ein anderes Pythagoras-Dreieck berechnet.
