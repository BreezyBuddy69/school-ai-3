> ✅ Aus deinen echten OneNote-Notizen (Jahr 5) übernommen und aufbereitet.

# Winkelfunktionen am Einheitskreis

Erweiterung der Winkelfunktionen (siehe `winkelfunktionen-rechtwinkliges-dreieck.md`) auf **beliebige Winkel** von $0°$ bis $360°$ — nicht mehr nur auf spitze Winkel im rechtwinkligen Dreieck beschränkt.

## Der Einheitskreis

Der **Einheitskreis** ist ein Kreis mit Radius $1$ um den Ursprung $O(0\vert 0)$.

Für einen Winkel $\alpha$ (gemessen ab der positiven x-Achse, im Gegenuhrzeigersinn) liegt der zugehörige Punkt auf dem Kreis bei
$$P(x\vert y) = P(\cos(\alpha) \vert \sin(\alpha))$$

Das folgt direkt aus der Definition im rechtwinkligen Dreieck mit Hypotenuse $H=1$:
$$x = \cos(\alpha) = \frac{AK}{H} = \frac{AK}{1} \qquad\qquad y = \sin(\alpha) = \frac{GK}{H} = \frac{GK}{1}$$

**Tangens am Einheitskreis:** Legt man im Punkt $(1\vert 0)$ eine Tangente parallel zur y-Achse an den Kreis, so ist $\tan(\alpha)$ die Länge des Stücks dieser Tangente zwischen der x-Achse und dem Schnittpunkt mit dem verlängerten Radius (Strahl durch $O$ und $P$).

> Merke: Am Einheitskreis gilt direkt $\cos(\alpha) = x$-Koordinate und $\sin(\alpha) = y$-Koordinate von $P$ — das funktioniert für **jeden** Winkel, nicht nur für spitze Winkel.

## Winkelfunktionen für Winkel über 90°

Wandert $P$ weiter um den Kreis (Quadrant II, III, IV), liefern $x$- und $y$-Koordinate weiterhin direkt $\cos(\alpha)$ und $\sin(\alpha)$ — auch wenn diese negativ werden.

### Vorzeichentabelle je Quadrant

| Quadrant | Winkelbereich | $\sin(\alpha)$ | $\cos(\alpha)$ | $\tan(\alpha)$ |
|---|---|---|---|---|
| I | $0°$–$90°$ | $+$ | $+$ | $+$ |
| II | $90°$–$180°$ | $+$ | $-$ | $-$ |
| III | $180°$–$270°$ | $-$ | $-$ | $+$ |
| IV | $270°$–$360°$ | $-$ | $+$ | $-$ |

### Bezugswinkel (Symmetrie zwischen den Quadranten)

Jeder Winkel $\alpha$ in Quadrant II, III oder IV hat einen **Bezugswinkel** (spitzer Winkel) im ersten Quadranten, über den sich seine Winkelfunktionswerte berechnen lassen:

| Quadrant | Zusammenhang mit Bezugswinkel $\alpha_B$ |
|---|---|
| II | $\alpha = 180° - \alpha_B$ |
| III | $\alpha = 180° + \alpha_B$ |
| IV | $\alpha = 360° - \alpha_B$ |

Daraus folgen die Symmetriebeziehungen, z. B.:
$$\sin(180°-\alpha) = \sin(\alpha) \qquad \cos(180°-\alpha) = -\cos(\alpha)$$

**Beispiel:** $\sin(30°) = \sin(150°) = 0{,}5$, aber $\cos(30°) = -\cos(150°)$.

## Rechnerische Ermittlung von Winkeln aus Winkelfunktionswerten

Da $\sin$, $\cos$ und $\tan$ im Bereich $0°$–$360°$ **nicht umkehrbar eindeutig** sind, liefert der Taschenrechner (arcsin/arccos/arctan) immer nur **eine** Lösung — die zweite muss über die Symmetrie ergänzt werden.

### Cosinus gegeben
$$\alpha_1 = \cos^{-1}(\text{Wert}) \qquad \alpha_2 = 360° - \alpha_1$$

**Beispiel:** $\cos(\alpha) = 0{,}4 \implies \alpha_1 \approx 66{,}42° ,\ \alpha_2 = 360°-66{,}42° \approx 293{,}58°$
**Beispiel:** $\cos(\alpha) = -0{,}60 \implies \alpha_1 \approx 126{,}87°,\ \alpha_2 = 360°-126{,}87° \approx 233{,}13°$

### Tangens gegeben
$$\alpha_1 = \tan^{-1}(\text{Wert}) \qquad \alpha_2 = 180° + \alpha_1$$
(Tangens hat Periode $180°$ — die zweite Lösung liegt im gegenüberliegenden Quadranten.)

> Achtung Prüfung: Je nach Vorzeichen des gegebenen Werts und der gefragten Winkelfunktion liegen die zwei Lösungen in unterschiedlichen Quadranten-Paaren (Cosinus: I & IV bzw. II & III; Tangens: I & III bzw. II & IV; Sinus: I & II bzw. III & IV). Immer mit der Vorzeichentabelle prüfen, ob beide Lösungen im geforderten Bereich $[0°;360°[$ überhaupt sinnvoll sind.

## Trigonometrische Grundbeziehungen

Über ähnliche Dreiecke am Einheitskreis (Vergleich mit der Tangente) und den Satz von Pythagoras ($x^2+y^2=1$ auf dem Einheitskreis) ergeben sich zwei fundamentale Identitäten, die **für jeden Winkel** gelten:

$$\sin^2(\alpha) + \cos^2(\alpha) = 1 \qquad\qquad \tan(\alpha) = \frac{\sin(\alpha)}{\cos(\alpha)}$$

Damit lässt sich aus einem bekannten Winkelfunktionswert (plus Angabe des Quadranten für das Vorzeichen) jeder andere Winkelfunktionswert berechnen.

**Beispiel:** Gegeben $\sin(\alpha) = 0{,}6$, $\alpha$ im 2. Quadranten. Gesucht $\cos(\alpha)$ und $\tan(\alpha)$.
$$\cos^2(\alpha) = 1-\sin^2(\alpha) = 1-0{,}36 = 0{,}64 \implies \cos(\alpha) = \pm0{,}8$$
Da $\alpha$ im 2. Quadranten liegt, ist $\cos(\alpha) < 0 \implies \cos(\alpha) = -0{,}8$.
$$\tan(\alpha) = \frac{\sin(\alpha)}{\cos(\alpha)} = \frac{0{,}6}{-0{,}8} = -0{,}75$$

> Achtung Prüfung: Ohne Angabe des Quadranten ist die Aufgabe **nicht eindeutig lösbar** — beim Wurzelziehen aus $\cos^2$ oder $\sin^2$ entstehen immer zwei mögliche Vorzeichen, das Vorzeichen muss über den Quadranten entschieden werden.

## Eigenschaften der Winkelfunktionen (im Bogenmass)

| Eigenschaft | $\sin(x)$ | $\cos(x)$ | $\tan(x)$ |
|---|---|---|---|
| Definitionsmenge $D$ | $\mathbb{R}$ | $\mathbb{R}$ | $\mathbb{R}\setminus\{\tfrac{\pi}{2}+k\pi\}$ |
| Wertemenge $W$ | $[-1;1]$ | $[-1;1]$ | $\mathbb{R}$ |
| Periode | $2\pi$ | $2\pi$ | $\pi$ |
| Nullstellen | $x=k\pi$ | $x=\tfrac{\pi}{2}+k\pi$ | $x=k\pi$ |
| Hochpunkte | $x=\tfrac{\pi}{2}+2k\pi$ | $x=2k\pi$ | keine |
| Tiefpunkte | $x=\tfrac{3\pi}{2}+2k\pi$ | $x=\pi+2k\pi$ | keine |
| Symmetrie | punktsymmetrisch (ungerade): $\sin(-x)=-\sin(x)$ | achsensymmetrisch (gerade): $\cos(-x)=\cos(x)$ | punktsymmetrisch: $\tan(-x)=-\tan(x)$ |
| Monotonie | abwechselnd steigend/fallend je Viertelperiode | abwechselnd fallend/steigend je Viertelperiode | auf jedem Definitionsintervall streng monoton steigend |

**Zusammenhang Sinus- und Cosinusfunktion** (Cosinus ist der um $\tfrac{\pi}{2}$ nach links verschobene Sinus):
$$\sin(x) = \cos\!\left(x-\frac{\pi}{2}\right) \qquad\qquad \cos(x) = \sin\!\left(x+\frac{\pi}{2}\right)$$

## Die allgemeine Sinusfunktion $f(x) = a\cdot\sin(b\cdot(x+c))+d$

| Parameter | Wirkung |
|---|---|
| $a$ | Streckung/Stauchung in y-Richtung um Faktor $\vert a\vert$; $a<0$ Spiegelung an der x-Achse (bzw. an der Linie $y=d$); ändert **nichts** an der Periode |
| $b$ | ändert die Periode: $p = \dfrac{2\pi}{\vert b\vert}$. $b>1$ → mehr Schwingungen, $0<b<1$ → weniger Schwingungen |
| $c$ | Verschiebung entlang der x-Achse: $c>0$ nach **links**, $c<0$ nach **rechts** |
| $d$ | Verschiebung entlang der y-Achse; die neue "Ruhelage" (Mittellinie) liegt bei $y=d$ |

### Schema zum Skizzieren
1. **$d$:** gestrichelte Mittellinie bei $y=d$ einzeichnen (Ruhelage)
2. **$c$:** Startpunkt (Nulldurchgang der Grundfunktion) um $c$ verschoben markieren
3. **$b$:** Periode $p=\tfrac{2\pi}{\vert b\vert}$ berechnen, weitere Nulldurchgänge im Abstand $p$ (bzw. $\tfrac p2$) markieren
4. **$a$:** zwischen den Nulldurchgängen verläuft der Graph ober-/unterhalb der Mittellinie, Extrempunkte genau in der Mitte mit Abstand $\vert a\vert$ von der Mittellinie

**Beispiel a:** $f(x) = 3\sin(2x)$ — $a=3$, $b=2 \implies p = \dfrac{2\pi}{2} = \pi$

**Beispiel b:** $f(x) = 0{,}5\sin\!\left(0{,}5\left(x+\tfrac{\pi}{2}\right)\right)$ — $a=0{,}5$, $b=0{,}5$, $c=\tfrac{\pi}{2} \implies p = \dfrac{2\pi}{0{,}5} = 4\pi$

**Beispiel c:** $f(x) = 2\sin(3(x-\tfrac{\pi}{3}))+2$ — $a=2$, $b=3$, $c=-\tfrac{\pi}{3}$, $d=2 \implies p = \dfrac{2\pi}{3}$

> Merke: Um aus einem Graphen die Parameter $a,b,c,d$ abzulesen, zuerst $d$ (Mittellinie), dann $a$ (Amplitude = Abstand Hoch-/Tiefpunkt zur Mittellinie), dann die Periode $p$ ablesen und daraus $b=\tfrac{2\pi}{p}$ berechnen, zuletzt die Verschiebung $c$ am Startpunkt bestimmen.
