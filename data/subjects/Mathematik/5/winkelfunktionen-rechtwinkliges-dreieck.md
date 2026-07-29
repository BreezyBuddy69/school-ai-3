> ✅ Aus deinen echten OneNote-Notizen (Jahr 5) übernommen und aufbereitet.

# Winkelfunktionen im rechtwinkligen Dreieck

## Wiederholung: Sätze im rechtwinkligen Dreieck
Höhe $h_c$ vom rechten Winkel auf die Hypotenuse $c$ teilt diese in die **Hypotenusenabschnitte** $p$ und $q$.

| Satz | Formel |
|---|---|
| Satz von Pythagoras | $a^2+b^2=c^2$ |
| Höhensatz | $h_c^2 = p \cdot q$ |
| Kathetensatz (a) | $a^2 = c \cdot q$ |
| Kathetensatz (b) | $b^2 = c \cdot p$ |
| Winkelsumme | $\alpha+\beta+\gamma = 180°$ |
| Umfang | $U = a+b+c$ |
| Fläche | $A = \dfrac{c \cdot h_c}{2} = \dfrac{a\cdot b}{2}$ |

## Winkelmasse: Grad, Neugrad (Gon), Bogenmass
Drei verschiedene Einheiten für denselben Winkel — Vollkreis entspricht:
- **Gradmass:** $360°$
- **Neugrad/Gon:** $400^g$
- **Bogenmass (Radiant):** $2\pi \approx 6{,}2832 \text{ rad}$

### Umrechnungsformeln
$$\alpha° : \alpha^g = 360 : 400 \qquad \alpha° : \alpha^{\text{rad}} = 360 : 2\pi \qquad \alpha^g : \alpha^{\text{rad}} = 400 : 2\pi$$

Direkt umgeformt:
$$\alpha^{\text{rad}} = \frac{\alpha° \cdot \pi}{180} \qquad\qquad \alpha° = \frac{\alpha^{\text{rad}} \cdot 180}{\pi}$$

**Beispiel:** $\beta = 210°48'7''$ (Grad, Minuten, Sekunden) als Dezimalgrad:
$$\beta = 210° + \frac{48}{60}° + \frac{7}{3600}° \approx 210{,}802°$$

Umrechnung in Bogenmass: $\beta^{\text{rad}} = \dfrac{210{,}802 \cdot \pi}{180} \approx 3{,}679 \text{ rad}$

> Merke: Grad-Minuten-Sekunden funktionieren wie Uhrzeit: $60' = 1°$, $60'' = 1'$.

## Definition der Winkelfunktionen
Im rechtwinkligen Dreieck, bezogen auf einen der beiden nicht-rechten Winkel $\alpha$:
- **H** = Hypotenuse (liegt dem rechten Winkel gegenüber)
- **GK** = Gegenkathete (liegt $\alpha$ gegenüber)
- **AK** = Ankathete (liegt an $\alpha$ an)

$$\sin(\alpha) = \frac{GK}{H} \qquad \cos(\alpha) = \frac{AK}{H} \qquad \tan(\alpha) = \frac{GK}{AK}$$

### Umkehrfunktionen (Winkel aus Seitenverhältnis berechnen)
$$\alpha = \sin^{-1}\left(\frac{GK}{H}\right) = \arcsin(\cdots) \qquad \alpha = \cos^{-1}(\cdots) = \arccos(\cdots) \qquad \alpha = \tan^{-1}(\cdots) = \arctan(\cdots)$$

> Achtung Prüfung: $\sin^{-1}$ bedeutet **nicht** $\frac{1}{\sin}$, sondern die **Umkehrfunktion** (Arkusfunktion)!

## Besondere Winkel herleiten (30°, 45°, 60°)
**45°:** Gleichschenklig-rechtwinkliges Dreieck (Katheten $a=a$) halbieren → Hypotenuse $c = a\sqrt2$.
**30°/60°:** Gleichseitiges Dreieck (Seite $a$) durch die Höhe halbieren → entsteht ein 30-60-90-Dreieck mit Hypotenuse $a$, kurzer Kathete $\frac{a}{2}$, langer Kathete $\frac{a}{2}\sqrt3$.

### Tabelle der besonderen Winkel
| Winkel | $\sin$ | $\cos$ | $\tan$ |
|---|---|---|---|
| $30°$ | $\dfrac{1}{2}$ | $\dfrac{\sqrt3}{2}$ | $\dfrac{\sqrt3}{3}$ |
| $45°$ | $\dfrac{\sqrt2}{2}$ | $\dfrac{\sqrt2}{2}$ | $1$ |
| $60°$ | $\dfrac{\sqrt3}{2}$ | $\dfrac{1}{2}$ | $\sqrt3$ |

## Rechtwinklige Dreiecke lösen (geg./ges.-Schema)
**Vorgehen:**
1. Skizze anfertigen, gegebene und gesuchte Grössen beschriften (geg./ges.)
2. Für jede gesuchte Grösse die passende Winkelfunktion wählen (welche Seiten/Winkel sind bekannt?)
3. Nach der gesuchten Grösse auflösen
4. Fehlenden Winkel über die Winkelsumme $180°$ (bzw. $90°$ im rechtwinkligen Dreieck: $\alpha+\beta=90°$) berechnen

**Beispiel:** geg. $a = 2{,}5\text{ dm}$, $\beta = 56°$ ; ges. $b, c, \alpha$
$$\cos(\beta) = \frac{AK}{H} = \frac{a}{c} \implies c = \frac{a}{\cos(\beta)} \approx 4{,}47 \text{ dm}$$
$$\tan(\gamma)=\ldots \quad\text{bzw. weitere Seite/Winkel analog berechnen, } \alpha = 90° - \beta = 34°$$

## Anwendung: Berechnungen an Figuren
Zusammengesetzte Figuren (gleichschenklige Dreiecke, Parallelogramme, Trapeze) werden über die **Höhe** in rechtwinklige Teildreiecke zerlegt, dann Winkelfunktionen anwenden.

**Beispiel (gleichschenkliges Dreieck):** geg. Schenkel $a$, Winkel $\alpha$ an der Basis
$$\gamma = 180° - 2\alpha \qquad \sin\left(\frac{\gamma}{2}\right) = \frac{\frac{c}{2}}{a} \implies \frac{c}{2} = a\sin\left(\frac{\gamma}{2}\right)$$
$$h_c = \sqrt{a^2-\left(\tfrac{c}{2}\right)^2} \qquad A = \frac{c \cdot h_c}{2} \qquad U = 2a+c$$

**Beispiel (Parallelogramm):** geg. Seiten $a,b$, Winkel $\alpha$
$$\sin(\alpha) = \frac{h_a}{b} \implies h_a = b\sin(\alpha) \qquad A = a \cdot h_a$$

## Anwendung: Höhen-/Tiefenwinkel mit zwei gekoppelten Dreiecken
Wenn ein Objekt (z. B. Turm) von zwei verschiedenen Punkten aus unter unterschiedlichem Winkel angepeilt wird, entstehen **zwei rechtwinklige Dreiecke mit gemeinsamer Höhe** → System mit 2 Gleichungen, 2 Unbekannten (meist $x$ = Distanz und $h$ = Höhe).

**Beispiel:** geg. $\alpha = 69°$ (näherer Standpunkt $G$), $\gamma = 38°$ (weiterer Standpunkt $C$), Distanz zwischen den Standpunkten $s = 1300\text{ m}$; ges. Höhe $h$

$$\Delta GAH:\quad \tan(\alpha) = \frac{h}{x} \implies h = x\cdot\tan(\alpha)$$
$$\Delta GCH:\quad \tan(\gamma) = \frac{h}{x+s} \implies h = \tan(\gamma)\cdot(x+s)$$

Beide Terme für $h$ gleichsetzen und nach $x$ auflösen:
$$x\cdot\tan(\alpha) = \tan(\gamma)\cdot(x+s)$$
$$x\cdot\tan(\alpha) - x\cdot\tan(\gamma) = \tan(\gamma)\cdot s$$
$$x = \frac{\tan(\gamma)\cdot s}{\tan(\alpha)-\tan(\gamma)} \approx 431{,}68$$
$$\implies h = x\cdot\tan(\alpha) \approx 1124{,}57 \text{ m}$$

> Merke: Bei Aufgaben mit **Höhenwinkel** (von unten nach oben gemessen) oder **Tiefenwinkel** (von oben nach unten gemessen) zuerst eine saubere Skizze mit beiden Teildreiecken zeichnen — meist teilen sie eine gemeinsame Seite (Höhe oder Grundlinie), was die Gleichsetzung ermöglicht.
