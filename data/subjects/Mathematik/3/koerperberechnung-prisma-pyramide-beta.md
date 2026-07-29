> 🧪 **Beta** — nicht in deinen OneNote-Notizen/Zusammenfassungen von Jahr 3 gefunden. Aus dem offiziellen LG-Lehrplan + ergänzender Recherche erstellt. Ersetzen/ergänzen, sobald echte Notizen vorliegen.

# Körperberechnung: Würfel, Quader, Prisma, Pyramide

Stereometrie = Raumgeometrie: Berechnung von Volumen $V$ und Oberfläche $O$ räumlicher Körper. Hier die geradlinig begrenzten Grundkörper — Zylinder, Kegel und Kugel folgen in Jahr 5.

## Würfel und Quader
```
      ______
     /     /|
    /_____/ |
    |     | |
  h |     | /  b
    |_____|/
       a
```
| Körper | Volumen $V$ | Oberfläche $O$ |
|---|---|---|
| Würfel (Kante $a$) | $a^3$ | $6a^2$ |
| Quader (Kanten $a,b,c$) | $a\cdot b\cdot c$ | $2(ab+ac+bc)$ |

**Beispiel Quader:** $a=5\text{ cm}$, $b=3\text{ cm}$, $c=4\text{ cm}$
```
V = 5·3·4 = 60 cm³
O = 2(5·3 + 5·4 + 3·4) = 2(15+20+12) = 94 cm²
```

## Prisma (allgemein)
Ein Prisma hat zwei kongruente, parallele Grund-/Deckflächen (beliebiges Vieleck) und Rechtecke als Mantelflächen.

$$\boxed{V = G\cdot h \qquad\qquad O = 2G + M}$$

$G$ = Flächeninhalt der Grundfläche, $h$ = Höhe (senkrechter Abstand Grund-/Deckfläche), $M$ = Mantelfläche (Summe aller Seitenrechtecke).

**Beispiel — Dreiecksprisma:** Grundfläche ist ein Dreieck mit $g=6\text{ cm}$, $h_{\text{Dreieck}}=4\text{ cm}$; Prismenhöhe $h=10\text{ cm}$.
```
G = (6·4)/2 = 12 cm²
V = G·h = 12·10 = 120 cm³
```

> Merke: Ein Quader ist nur ein **Spezialfall** des Prismas mit rechteckiger Grundfläche — dieselbe Formel $V=G\cdot h$ funktioniert für **jedes** Prisma, egal welche Form die Grundfläche hat.

## Pyramide
Eine Pyramide hat eine Grundfläche (beliebiges Vieleck) und läuft spitz zu einer Spitze zusammen.

$$\boxed{V = \frac{G\cdot h}{3}}$$

**Warum durch 3?** Drei kongruente Pyramiden mit derselben Grundfläche und Höhe füllen zusammen genau ein Prisma — deshalb ist das Pyramidenvolumen exakt ein Drittel des entsprechenden Prismas.

**Beispiel — quadratische Pyramide:** Grundkante $a=6\text{ cm}$, Höhe $h=8\text{ cm}$
```
G = a² = 36 cm²
V = (36·8)/3 = 96 cm³
```

### Oberfläche der Pyramide
$$O = G + M$$
Die Mantelfläche $M$ setzt sich aus den (meist gleichschenkligen) Dreiecken der Seitenflächen zusammen — jede Seitenfläche einzeln mit $A=\tfrac{g\cdot h_{\text{Seitenfläche}}}{2}$ berechnen und addieren.

> Achtung Prüfung: Die Höhe $h$ des Volumens ist immer die **senkrechte** Höhe von der Spitze zur Grundfläche — nicht zu verwechseln mit der Höhe einer Seitenfläche (die für die Mantelfläche gebraucht wird) oder der Mantellinie.

## Vorbereitung auf Jahr 5 (Stereometrie)
Zylinder, Kegel und Kugel folgen denselben Grundprinzipien:
- **Zylinder** = "Prisma mit Kreis als Grundfläche" → $V=G\cdot h = r^2\pi\cdot h$
- **Kegel** = "Pyramide mit Kreis als Grundfläche" → $V=\dfrac{G\cdot h}{3} = \dfrac{r^2\pi\cdot h}{3}$

> Merke: Die beiden zentralen Formeln $V=G\cdot h$ (gerade Körper) und $V=\dfrac{G\cdot h}{3}$ (spitz zulaufende Körper) gelten für **jeden** Grundflächentyp — Vieleck oder Kreis. Genau darauf baut Jahr 5 auf.

## Formelübersicht
| Körper | Volumen $V$ | Oberfläche $O$ |
|---|---|---|
| Würfel | $a^3$ | $6a^2$ |
| Quader | $a\cdot b\cdot c$ | $2(ab+ac+bc)$ |
| Prisma | $G\cdot h$ | $2G+M$ |
| Pyramide | $\dfrac{G\cdot h}{3}$ | $G+M$ |
