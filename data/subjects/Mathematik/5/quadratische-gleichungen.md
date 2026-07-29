> ✅ Aus deinen echten OneNote-Notizen (Jahr 5) übernommen und aufbereitet.

# Quadratische Gleichungen — Vertiefung

Grundlagen (pq-Formel, Diskriminante, Satz von Vieta) siehe `gleichungen.md` (Jahr 1). Hier: Sonderformen und Gleichungen, die sich auf eine quadratische Gleichung **zurückführen** lassen.

## Reinquadratische Gleichungen
Form ohne $bx$-Term: $ax^2 + c = 0$

**Vorgehen:** nach $x^2$ auflösen, dann Wurzel ziehen (± beachten!):
$$ax^2 + c = 0 \implies x^2 = -\frac{c}{a} \implies x_{1,2} = \pm\sqrt{-\frac{c}{a}}$$

| Vorzeichen von $-\frac{c}{a}$ | Lösungen |
|---|---|
| $> 0$ | zwei Lösungen $\pm\sqrt{\cdots}$ |
| $= 0$ | eine Lösung $x=0$ |
| $< 0$ | keine reelle Lösung |

## Ausklammern (Nullprodukt-Satz)
Form ohne konstanten Term: $ax^2 + bx = 0$

**Vorgehen:** $x$ ausklammern, dann Nullprodukt-Satz (ein Produkt ist null, wenn mindestens ein Faktor null ist):
$$x(ax+b) = 0 \implies x_1 = 0 \quad \text{oder} \quad x_2 = -\frac{b}{a}$$

> Achtung Prüfung: Bei dieser Form **nie** durch $x$ kürzen — dabei geht die Lösung $x=0$ verloren!

## Kubische Gleichungen (ohne konstanten Term)
Form $ax^3+bx^2+cx = 0$ — auch hier zuerst **ausklammern**, dann bleibt eine quadratische Gleichung übrig:

**Beispiel:** $x^3-6x^2+10x=0$
$$x(x^2-6x+10) = 0 \implies x_1 = 0 \quad \text{oder} \quad x^2-6x+10=0$$

pq-Formel für den zweiten Faktor ($p=-6,q=10$):
$$x_{2,3} = 3 \pm \sqrt{9-10} = 3 \pm \sqrt{-1}$$

Da die Diskriminante negativ ist ($D<0$), gibt es hier keine weitere reelle Lösung.
$$\implies L = \{0\}$$

## Bruchgleichungen, die auf quadratische Gleichungen führen
**Vorgehen:**
1. **Definitionsmenge** bestimmen: alle Nenner $\neq 0$ setzen und die verbotenen $x$-Werte ausschliessen
2. Jeden Nenner in Primfaktoren zerlegen (**PFZ**), daraus den **Hauptnenner** (kgV aller Nenner) bilden
3. **Erweiterungsfaktor (EF)** pro Bruch bestimmen = Hauptnenner ÷ ursprünglicher Nenner
4. Alle Brüche auf den Hauptnenner bringen, Gleichung mit Hauptnenner multiplizieren → Nenner verschwinden
5. Resultierende (meist quadratische) Gleichung lösen (pq-Formel, Ausklammern, o. Ä.)
6. **Probe / Definitionsmenge-Check:** Lösungen, die in der Definitionsmenge ausgeschlossen wurden, sind **keine** gültigen Lösungen der Bruchgleichung!

**Hilfstabelle (so wie im Heft):**
| Term | PFZ (Nenner zerlegt) | EF (Erweiterungsfaktor) |
|---|---|---|
| $\frac{1}{x}$ | $x$ | Hauptnenner$/x$ |
| $\frac{1}{x-3}$ | $x-3$ | Hauptnenner$/(x-3)$ |

**Beispiel:** $\dfrac{x+2}{x-3} - \dfrac{1}{x} = 1$, Definitionsmenge: $x \neq 0,\ x \neq 3$

Hauptnenner $= x(x-3)$. Multipliziere die ganze Gleichung damit:
$$x(x+2) - (x-3) = x(x-3)$$
$$x^2+2x-x+3 = x^2-3x \implies x^2+x+3 = x^2-3x$$
$$4x = -3 \implies x = -\tfrac{3}{4}$$
Check: $-\tfrac34 \neq 0$ und $\neq 3$ → Lösung gültig. ✓

> Merke: Bruchgleichungen sind nicht "automatisch" quadratisch — nach dem Wegmultiplizieren des Hauptnenners kann sich je nach Aufgabe eine lineare **oder** quadratische Gleichung ergeben. Die Probe ist trotzdem in beiden Fällen Pflicht.

## Wurzelgleichungen
Die Variable steht unter einer Wurzel.

**Vorgehen:**
1. Wurzel(-term) auf einer Seite **isolieren**
2. Beide Seiten **quadrieren** (Wurzel verschwindet)
3. Falls danach noch eine Wurzel übrig ist: Schritt 1–2 wiederholen
4. Resultierende Gleichung lösen (linear oder quadratisch)
5. **Probe zwingend!** Quadrieren kann **Scheinlösungen** erzeugen, die die ursprüngliche Gleichung nicht erfüllen

**Beispiel:** $\sqrt{2x+3} = x - 3$

Definitionsbereich: $2x+3 \geq 0 \implies x \geq -\tfrac32$, und rechte Seite muss $\geq 0$ sein: $x \geq 3$.

Quadrieren:
$$2x+3 = (x-3)^2 = x^2 - 6x + 9$$
$$0 = x^2 - 8x + 6$$

pq-Formel ($p=-8, q=6$):
$$x_{1,2} = 4 \pm \sqrt{16-6} = 4 \pm \sqrt{10}$$

Probe: $x_2 = 4-\sqrt{10} \approx 0{,}84 < 3$ → verletzt $x\geq3$ → **Scheinlösung, verwerfen**. Nur $x_1 = 4+\sqrt{10}$ ist gültig.

> Achtung Prüfung: Wurzelgleichungen **immer** mit Definitionsbereich (Radikand $\geq 0$) UND Probe der Endlösungen bearbeiten — sonst verliert man Punkte für unentdeckte Scheinlösungen.

## Biquadratische Gleichungen
Form $ax^4 + bx^2 + c = 0$ — nur gerade Hochzahlen.

**Vorgehen (Substitution):**
1. Substituiere $z = x^2$ → wird zu $az^2+bz+c=0$
2. Löse die quadratische Gleichung in $z$ (pq-Formel)
3. Rücksubstitution: $x = \pm\sqrt{z}$ — **nur für $z \geq 0$**, negative $z$-Lösungen liefern keine reelle $x$-Lösung

**Beispiel:** $x^4 - 5x^2 + 4 = 0$
$$z=x^2:\quad z^2-5z+4=0 \implies z_{1,2} = \tfrac{5}{2}\pm\sqrt{\tfrac{25}{4}-4} = \tfrac52\pm\tfrac32$$
$$z_1 = 4,\ z_2 = 1$$
$$\implies x = \pm\sqrt{4}=\pm2 \quad \text{und} \quad x=\pm\sqrt{1}=\pm1$$
$$\implies x_{1,2,3,4} = 2,\,-2,\,1,\,-1$$

## Sachaufgaben (Textaufgaben)
Typischer Ablauf:
1. Variable definieren (was ist $x$?)
2. Sachverhalt als Gleichung modellieren (oft über Flächen-, Produkt- oder Bewegungsformeln)
3. Gleichung lösen (meist pq-Formel oder Ausklammern)
4. **Prüfen, ob beide Lösungen im Sachkontext sinnvoll sind** — negative Längen, Zeiten etc. werden verworfen!

> Merke: Bei Sachaufgaben liefert die Mathematik oft zwei Lösungen — aber meist ist nur eine davon im echten Kontext (z. B. eine positive Länge) sinnvoll.
