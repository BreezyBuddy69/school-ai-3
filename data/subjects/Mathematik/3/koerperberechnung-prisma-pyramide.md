> ✅ Aus deinen echten OneNote-Notizen (Jahr 3) übernommen und aufbereitet.

# Körperberechnung: Prisma, Zylinder, Pyramide

Behandelt im Kapitel **"19 Grundfläche · Höhe"** — eigene Lösungen zeigen ein Dreiecksprisma und einen Zylinder direkt nebeneinander, um zu zeigen, dass dieselbe Grundidee ($V=G\cdot h$) für **beide** Körpertypen gilt.

## Prisma (allgemein)
Ein Prisma hat zwei kongruente, parallele Grund-/Deckflächen (beliebiges Vieleck) und Rechtecke als Mantelflächen.

$$\boxed{V = G\cdot h}$$

$G$ = Flächeninhalt der Grundfläche, $h$ = Höhe (senkrechter Abstand Grund-/Deckfläche).

**Eigenes Beispiel — Dreiecksprisma:** Grundfläche ist ein rechtwinkliges Dreieck mit den Katheten $5\text{ cm}$ und $5\text{ cm}$, Prismenhöhe $h=10\text{ cm}$.
```
G = (5·5)/2 = 12,5 cm²
V = G·h = 12,5·10 = 125 cm³
```

## Zylinder ("Prisma mit Kreis als Grundfläche")
$$V = G\cdot h = r^2\pi\cdot h$$

**Eigenes Beispiel:** Radius $r=2{,}5\text{ cm}$, Höhe $h=5\text{ cm}$
```
G = r²·π = 2,5²·π ≈ 19,63 cm²
V = (5/2)²·π·5 = 5·5·π·5 / (2·2) = 125π/4 ≈ 98 cm³
```

> Merke: Ein Würfel/Quader ist nur ein **Spezialfall** des Prismas mit rechteckiger Grundfläche — dieselbe Formel $V=G\cdot h$ funktioniert für **jedes** Prisma und für den Zylinder, egal welche Form die Grundfläche hat.

## Würfel und Quader (Spezialfälle des Prismas)
| Körper | Volumen $V$ | Oberfläche $O$ |
|---|---|---|
| Würfel (Kante $a$) | $a^3$ | $6a^2$ |
| Quader (Kanten $a,b,c$) | $a\cdot b\cdot c$ | $2(ab+ac+bc)$ |

## Pyramide
Eine Pyramide hat eine Grundfläche (beliebiges Vieleck) und läuft spitz zu einer Spitze zusammen.

$$\boxed{V = \frac{G\cdot h}{3}}$$

**Warum durch 3?** Drei kongruente Pyramiden mit derselben Grundfläche und Höhe füllen zusammen genau ein Prisma — deshalb ist das Pyramidenvolumen exakt ein Drittel des entsprechenden Prismas.

**Beispiel — quadratische Pyramide:** Grundkante $a=6\text{ cm}$, Höhe $h=8\text{ cm}$
```
G = a² = 36 cm²
V = (36·8)/3 = 96 cm³
```

> Achtung Prüfung: Die Höhe $h$ des Volumens ist immer die **senkrechte** Höhe von der Spitze zur Grundfläche — nicht zu verwechseln mit der Höhe einer Seitenfläche (für die Mantelfläche/Dachfläche gebraucht, oft über den Satz des Pythagoras berechnet, siehe eigenes Thema).

## Oberfläche
$$O_{\text{Prisma}} = 2G + M \qquad\qquad O_{\text{Pyramide}} = G + M$$

$M$ = Mantelfläche (Summe aller Seitenflächen). Bei der Pyramide setzt sich $M$ aus den (meist gleichschenkligen) Dreiecken der Seitenflächen zusammen.

## Formelübersicht
| Körper | Volumen $V$ | Oberfläche $O$ |
|---|---|---|
| Würfel | $a^3$ | $6a^2$ |
| Quader | $a\cdot b\cdot c$ | $2(ab+ac+bc)$ |
| Prisma | $G\cdot h$ | $2G+M$ |
| Zylinder | $r^2\pi\cdot h$ | $2r^2\pi + 2r\pi h$ |
| Pyramide | $\dfrac{G\cdot h}{3}$ | $G+M$ |

> Merke: Die beiden zentralen Formeln $V=G\cdot h$ (gerade Körper) und $V=\dfrac{G\cdot h}{3}$ (spitz zulaufende Körper) gelten für **jeden** Grundflächentyp — Vieleck oder Kreis. Genau darauf baut die Stereometrie in Jahr 5 auf (dort kommen Kegel und Kugel dazu).
