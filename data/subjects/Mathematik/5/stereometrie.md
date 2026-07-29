> ✅ Aus deinen echten OneNote-Notizen (Jahr 5) übernommen und aufbereitet.

# Stereometrie: Zylinder, Kegel, Kugel

Stereometrie = Raumgeometrie: Berechnung von Volumen $V$ und Oberfläche $O$ räumlicher Körper.

## Zylinder

Ein Zylinder besteht aus zwei kongruenten, parallelen Kreisflächen (Grund- und Deckfläche $D$) und einer Mantelfläche $M$.

$$V = r^2\pi\cdot h \qquad\qquad M = h\cdot U = h\cdot 2r\pi \qquad\qquad O = M + D = 2r\pi h + 2r^2\pi$$

Je nachdem, was gegeben ist, werden die Formeln nach der gesuchten Grösse umgestellt, z. B.:
$$h = \frac{V}{r^2\pi} \qquad\qquad r = \sqrt{\frac{V}{h\pi}}$$

**Beispiel:** Ein Zylinder mit Volumen $V\approx84{,}97\ \text{L}$ hat $h=15{,}8\text{ cm}$. Gesucht: $r$.
$$r = \sqrt{\frac{V}{h\cdot\pi}}$$
(Formel wie oben einsetzen und nach $r$ auflösen — Vorgehen unabhängig von den konkreten Zahlen immer gleich: zuerst nach $r^2$ auflösen, dann Wurzel ziehen.)

> Merke: Bei Zylinder-Aufgaben zuerst notieren, welche 2 der 3 Grössen $V, r, h$ (bzw. $O, U, M, D$) gegeben sind — daraus ergibt sich, welche Formel umgestellt werden muss.

## Kegel

Ein Kegel hat eine Kreis-Grundfläche und läuft spitz zu. Die **Mantellinie** $s$ (Distanz von der Spitze zum Rand der Grundfläche) hängt über den Satz von Pythagoras mit Radius $r$ und Höhe $h$ zusammen:

$$s^2 = r^2+h^2 \qquad\Longrightarrow\qquad s = \sqrt{r^2+h^2}$$

$$\boxed{M = \pi\cdot r\cdot s \qquad\qquad V = \frac{h\cdot\pi\cdot r^2}{3} \qquad\qquad O = M+G = \pi rs+\pi r^2}$$

Rollt man den Mantel eines Kegels ab, entsteht ein Kreissektor mit Radius $s$. Der **Sektorwinkel** (Öffnungswinkel des abgerollten Mantels) berechnet sich aus dem Verhältnis von Grundkreis-Umfang zu Vollkreis-Umfang mit Radius $s$:

$$\alpha = \frac{360°\cdot r}{s}$$

**Beispiel:** geg. $r=4{,}2\text{ cm}$, $s=10\text{ cm}$ (Mantellinie) $\implies \alpha = \dfrac{360°\cdot4{,}2}{10} = 151{,}2°$

> Merke: $V=\dfrac{h\cdot\pi\cdot r^2}{3}$ ist ein Spezialfall der allgemeinen Formel für **jeden** spitz zulaufenden Körper (Pyramide, Kegel): $V = \dfrac{G\cdot h}{3}$ (Grundfläche mal Höhe, geteilt durch 3). Beim Kegel ist $G=r^2\pi$.

## Kugel

$$V = \frac{4}{3}\pi r^3 \qquad\qquad O = 4\pi r^2$$

**Beispiel 1 (Radius gegeben):** $r=7{,}5\text{ cm}$
$$O = 4\pi\cdot7{,}5^2 = 706{,}86\text{ cm}^2 \qquad\qquad V = \frac43\pi\cdot7{,}5^3 = 1767{,}15\text{ cm}^3$$

**Beispiel 2 (Volumen gegeben, Radius gesucht):** $V=1500\text{ cm}^3$
$$V=\frac43\pi r^3 \;\Big|\cdot\frac{3}{4\pi} \implies r^3 = \frac{3V}{4\pi} \implies r = \sqrt[3]{\frac{3V}{4\pi}} \approx 7{,}10\text{ cm} \implies d=2r\approx14{,}2\text{ cm}$$

**Beispiel 3 (Oberfläche gegeben, Radius gesucht):**
$$O = 4\pi r^2 \;\Big|:4\pi \implies r^2=\frac{O}{4\pi} \implies r = \sqrt{\frac{O}{4\pi}}$$

> Achtung Prüfung: Beim Auflösen nach $r$ immer zuerst isolieren ($r^2=\ldots$ bzw. $r^3=\ldots$), erst danach die (Kubik-)Wurzel ziehen — nicht mit den Koeffizienten $\tfrac43\pi$ bzw. $4\pi$ vermischen.

## Satz von Cavalieri: Schiefe Körper

> **Satz von Cavalieri:** Ein **schiefer** (schräger) Körper hat **dasselbe Volumen** wie der entsprechende **gerade** Körper mit gleicher Grundfläche $G$ und gleicher (senkrechter!) Höhe $h$:
> $$V = G\cdot h$$

Das gilt für schiefe Prismen/Zylinder ebenso wie für schiefe Pyramiden/Kegel (dort mit dem zusätzlichen Faktor $\tfrac13$).

**Beispiel a (schiefer Zylinder, Höhe direkt gegeben):** $r=15\text{ cm}$, $h=4{,}2\text{ cm}$
$$V = G\cdot h = \pi r^2\cdot h = \pi\cdot15^2\cdot4{,}2 \approx 2968{,}81\text{ cm}^3$$

**Beispiel b (schiefer Zylinder, nur Mantellinie/Schräge und Winkel gegeben):** $s=10\text{ cm}$ (Länge der schrägen Seitenkante), $\alpha=45°$ (Neigungswinkel zur Grundfläche), $r=4{,}2\text{ cm}$

Zuerst die **senkrechte** Höhe $h$ aus $s$ und $\alpha$ bestimmen (rechtwinkliges Hilfsdreieck):
$$\sin(\alpha) = \frac{h}{s} \implies h = s\cdot\sin(\alpha) = 10\cdot\sin(45°) \approx 7{,}09\text{ cm}$$
Danach wie gewohnt mit der **echten** Höhe $h$ rechnen:
$$V = \pi r^2\cdot h \approx \pi\cdot4{,}2^2\cdot7{,}09 \approx 393\text{ cm}^3$$

**Beispiel c (schiefer Quader):** $a=18\text{ cm}$, $b=15\text{ cm}$, $h=25\text{ cm}$
$$V = a\cdot b\cdot h = 18\cdot15\cdot25 = 6750\text{ cm}^3$$

> Achtung Prüfung: Bei schiefen Körpern ist für $V=G\cdot h$ **immer die senkrechte Höhe** zwischen den beiden Grundflächen gemeint — nicht die (längere) schräge Seitenkante! Ist nur die schräge Kante $s$ und ein Winkel gegeben, muss zuerst über die Winkelfunktion (meist $\sin$) auf die senkrechte Höhe umgerechnet werden.

## Zusammengesetzte Körper

Viele Anwendungsaufgaben kombinieren mehrere Grundkörper (z. B. ein Silo aus Zylinder + aufgesetzter Halbkugel). Das Gesamtvolumen ist dann die **Summe** (bzw. Differenz, falls ein Teil ausgehöhlt ist) der Einzelvolumen.

**Beispiel (Zylinder + Halbkugel):** Zylinder mit Radius $r$, Höhe $h$, oben abgeschlossen mit einer Halbkugel desselben Radius $r$:
$$V_{\text{Zylinder}} = \pi r^2 h \qquad\qquad V_{\text{Halbkugel}} = \frac12\cdot\frac43\pi r^3 = \frac23\pi r^3$$
$$V_{\text{gesamt}} = \pi r^2 h + \frac23\pi r^3 = \pi r^2\left(h+\frac23 r\right)$$

**Vorgehen bei zusammengesetzten Körpern:**
1. Körper gedanklich in bekannte Grundkörper (Zylinder, Kegel, Kugel/Halbkugel, Quader, …) zerlegen
2. Für jeden Teilkörper Volumen (bzw. Oberfläche) einzeln berechnen
3. Teilergebnisse addieren (bei Aneinanderfügen) oder subtrahieren (bei Aushöhlungen)
4. **Bei der Oberfläche** aufpassen: innere Berührflächen (z. B. die Kreisfläche, wo Zylinder und Halbkugel zusammenstossen) gehören **nicht** zur Aussenoberfläche und dürfen nicht doppelt gezählt werden!

## Formelübersicht

| Körper | Volumen $V$ | Oberfläche $O$ |
|---|---|---|
| Zylinder | $r^2\pi h$ | $2r\pi h + 2r^2\pi$ |
| Kegel | $\dfrac{r^2\pi h}{3}$ | $\pi rs+\pi r^2$ |
| Kugel | $\dfrac43\pi r^3$ | $4\pi r^2$ |
