# Kraft als Vektor, Vektoraddition, Kräfteaddition
**Fach:** Physik | **Klasse:** 5Wa

> ✅ Aus deinen echten OneNote-Notizen (Jahr 5) übernommen und aufbereitet.

## Kraft als Vektor

Kräfte sind wie Verschiebungen mit einer Richtung verbunden. Um sie eindeutig zu beschreiben, reicht ein Zahlenwert (Betrag) allein nicht — Kräfte werden deshalb als **Vektoren** dargestellt.

Eine Kraft ist eindeutig bestimmt durch:
- **Betrag** (Stärke, in N)
- **Richtung**
- **Angriffspunkt** (wo die Kraft am Körper angreift)

Eine Kraft wird als Pfeil dargestellt: Die **Länge** entspricht dem Betrag, die **Pfeilspitze** zeigt die Richtung, der **Startpunkt** ist der Angriffspunkt. Die Gerade, auf der der Pfeil liegt, heisst **Wirkungslinie**.

### Wann sind zwei Kräfte gleich?
Zwei gleich grosse Kräfte, die in dieselbe Richtung zeigen, aber an unterschiedlichen Punkten desselben Körpers angreifen, führen zu **derselben Wirkung**, solange Betrag, Richtung und Wirkungslinie übereinstimmen — der genaue Angriffspunkt entlang der Wirkungslinie ist für die Wirkung der Kraft egal.

## Vektoren: Definition und Rechnen

Ein Vektor $\vec{v} = \begin{pmatrix} v_1 \\ v_2 \end{pmatrix}$ wird durch seine Komponenten beschrieben.

**Betrag (Länge) eines Vektors:**
$$|\vec{v}| = \sqrt{v_1^2 + v_2^2}$$

**Vektoraddition** (komponentenweise):
$$\vec{v} + \vec{w} = \begin{pmatrix} v_1 \\ v_2 \end{pmatrix} + \begin{pmatrix} w_1 \\ w_2 \end{pmatrix} = \begin{pmatrix} v_1 + w_1 \\ v_2 + w_2 \end{pmatrix}$$

Geometrisch: Der zweite Vektor wird an die Pfeilspitze des ersten angehängt (Aneinanderreihen). Die Summe ist der Vektor vom Startpunkt des ersten zur Pfeilspitze des zweiten.

**Vektorsubtraktion:**
$$\vec{v} - \vec{w} = \vec{v} + (-\vec{w})$$

**Skalarmultiplikation:** Multipliziert man einen Vektor mit einer Zahl $c \in \mathbb{R}$, ändert sich seine Länge um den Faktor $|c|$; bei $c < 0$ dreht sich zusätzlich die Richtung um.

## Mehrere Kräfte addieren (resultierende Kraft)

Wirken mehrere Kräfte gleichzeitig auf einen Körper, lässt sich ihre gemeinsame Wirkung durch eine einzige **resultierende Kraft** $\vec{F}_{res}$ ersetzen:

$$\vec{F}_{res} = \vec{F}_1 + \vec{F}_2 + \vec{F}_3 + \dots$$

**Beispiel Hundeschlitten:** Mehrere Hunde ziehen gemeinsam an einem Schlitten — die Gesamtzugkraft ist die Vektorsumme aller Einzelkräfte der Hunde.

**Beispiel Lokomotive:** Mehrere Waggons hintereinander — die Kräfte addieren sich entlang derselben Wirkungslinie.

### Kräfte mit gleicher Wirkungslinie
- **Gleiche Richtung:** Beträge addieren sich: $F_{res} = F_1 + F_2$
- **Entgegengesetzte Richtung:** Beträge subtrahieren sich: $F_{res} = F_1 - F_2$ (die grössere Kraft "gewinnt")

### Kräfte mit unterschiedlicher Wirkungslinie
Müssen **vektoriell** (grafisch mit dem **Kräfteparallelogramm** oder rechnerisch komponentenweise) addiert werden — einfaches Addieren der Beträge ist hier **falsch**.

**Kräfteparallelogramm:** Man zeichnet beide Kraftvektoren vom selben Angriffspunkt aus, ergänzt sie zu einem Parallelogramm — die Diagonale durch den gemeinsamen Angriffspunkt ist die resultierende Kraft $\vec{F}_{res}$.

> Merke: Zwei Kräfte mit gleichem Betrag und gleichem Angriffspunkt an einem Körper haben dieselbe Wirkung, solange sie dieselbe Wirkungslinie **und** Richtung haben. Ändert sich die Wirkungslinie oder Richtung, ändert sich auch die Wirkung — deshalb braucht es die vektorielle Addition.

## Übungsaufgabe (Musterbeispiel)

Zwei Kräfte $F_1$ und $F_2$ ziehen an einem Körper mit unterschiedlichen Wirkungslinien. Gesucht: Betrag und Richtung der resultierenden Kraft $F_{res}$.

**Vorgehen:**
1. Kräfte in Komponenten zerlegen (x- und y-Richtung)
2. Komponenten addieren
3. Betrag der Resultierenden über $|\vec{F}_{res}| = \sqrt{F_{res,x}^2 + F_{res,y}^2}$
4. Richtungswinkel über $\tan(\alpha) = \dfrac{F_{res,y}}{F_{res,x}}$
