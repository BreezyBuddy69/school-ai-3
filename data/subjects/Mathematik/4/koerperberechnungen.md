# Körperberechnungen

> ✅ Aus deinen echten OneNote-Notizen (Jahr 4) übernommen und aufbereitet.

## Distanzberechnungen am Würfel und Quader (via Satz des Pythagoras)

### Würfel (Kantenlänge $a$)
**Flächendiagonale** $d_F$ (Diagonale einer Seitenfläche): im Dreieck $ABC$ gilt
$$d_F^2 = a^2+a^2 = 2a^2 \;\Rightarrow\; d_F = a\sqrt2$$

**Raumdiagonale** $d_R$ (Diagonale durch den ganzen Körper): im Dreieck $ACG$ (mit $AC=d_F$, $CG=a$) gilt
$$d_R^2 = d_F^2+a^2 = 2a^2+a^2 = 3a^2 \;\Rightarrow\; d_R = a\sqrt3$$

### Quader (Kanten $l, b, h$)
**Flächendiagonalen:**
$$d_1^2 = l^2+h^2 \quad (\text{Fläche } ABFE), \qquad d_2^2 = b^2+h^2 \quad (\text{Fläche } BCGF), \qquad d_3^2 = l^2+b^2 \quad (\text{Fläche } ABCD)$$

**Raumdiagonale:**
$$d_R^2 = (l^2+b^2)+h^2 = l^2+b^2+h^2 \;\Rightarrow\; d_R = \sqrt{l^2+b^2+h^2}$$

> Merke: Die Raumdiagonale ergibt sich immer durch **zweimaliges** Anwenden des Satzes des Pythagoras — zuerst in der Grundfläche, dann im „aufgestellten" Dreieck mit der Höhe.

## Oberfläche und Volumen — Grundformen

| Körper | Oberfläche $O$ | Volumen $V$ |
|---|---|---|
| Würfel (Kante $a$) | $6a^2$ | $a^3$ |
| Quader (Kanten $l,b,h$) | $2(lb+bh+lh)$ | $l\cdot b\cdot h$ |

## Dichte, Masse, Volumen
Bei Textaufgaben zu Materialien (Metall, Holz, Wasser …) wird häufig die Dichte $\rho$ verknüpft:
$$\rho = \frac{m}{V} \;\Leftrightarrow\; m = \rho\cdot V \;\Leftrightarrow\; V = \frac{m}{\rho}$$

**Beispiel:** Ein Würfel aus Eisen ($\rho = 7870\,\text{kg/m}^3$) hat $5\,\text{kg}$ Masse. Gesucht die Kantenlänge:
$$V = \frac{m}{\rho} \;\Rightarrow\; a = \sqrt[3]{V}$$

## Flächenverwandlung
Eine Fläche in eine flächengleiche andere Form umwandeln (z. B. Dreieck → flächengleiches Rechteck) — Grundlage für viele Konstruktionsaufgaben und für die Herleitung von Flächenformeln (siehe auch Kreislehre: Kreis → Rechteck).

> Achtung Prüfung: Einheiten konsequent umrechnen (cm ↔ m ↔ dm³) VOR dem Einsetzen in die Formel — sonst Zehnerpotenz-Fehler beim Volumen. $1\,\text{dm}^3 = 1\,\text{Liter}$.
