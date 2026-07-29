> ✅ Aus deinen echten OneNote-Notizen (Jahr 5) übernommen und aufbereitet.

# Winkelfunktionen im allgemeinen Dreieck

Erweiterung der Trigonometrie auf **beliebige** (nicht notwendigerweise rechtwinklige) Dreiecke. Bezeichnungen wie gewohnt: Seiten $a,b,c$ liegen den Winkeln $\alpha,\beta,\gamma$ jeweils gegenüber.

## Sinussatz

$$\frac{a}{\sin(\alpha)} = \frac{b}{\sin(\beta)} = \frac{c}{\sin(\gamma)}$$

**Anwendbar, wenn bekannt:**
- zwei Winkel und eine Seite (WSW/SWW), oder
- zwei Seiten und der Winkel gegenüber einer davon (SSW)

**Beispiel:** geg. $\alpha=40°$, $\beta=65°$, $a=12\text{ cm}$; ges. $b$
$$\frac{a}{\sin(\alpha)} = \frac{b}{\sin(\beta)} \implies b = \frac{a\cdot\sin(\beta)}{\sin(\alpha)} = \frac{12\cdot\sin(65°)}{\sin(40°)} \approx 16{,}92\text{ cm}$$

> Achtung Prüfung: Beim **SSW-Fall** (zwei Seiten + Gegenwinkel einer Seite) kann es **zwei** mögliche Dreiecke geben (Ambiguous Case) — nach $\sin^{-1}$ immer auch die Ergänzung $180°-\alpha_1$ als zweite mögliche Lösung prüfen und schauen, ob die Winkelsumme $180°$ dann noch aufgeht.

## Trigonometrische Flächenformel

Die Fläche eines beliebigen Dreiecks lässt sich aus zwei Seiten und dem eingeschlossenen Winkel berechnen (ohne die Höhe explizit zu kennen):
$$A = \frac12\cdot a\cdot b\cdot\sin(\gamma) = \frac12\cdot b\cdot c\cdot\sin(\alpha) = \frac12\cdot a\cdot c\cdot\sin(\beta)$$

> Merke: Der Winkel in der Formel muss immer der **von den beiden verwendeten Seiten eingeschlossene** Winkel sein.

## Cosinussatz

$$c^2 = a^2+b^2-2ab\cdot\cos(\gamma)$$
(analog für $a^2$ bzw. $b^2$ mit zyklischer Vertauschung)

Nach dem Winkel aufgelöst:
$$\cos(\gamma) = \frac{a^2+b^2-c^2}{2ab}$$

**Anwendbar, wenn bekannt:**
- alle drei Seiten (SSS) → alle Winkel berechenbar über die umgestellte Form
- zwei Seiten und der eingeschlossene Winkel (SWS) → dritte Seite berechenbar über die erste Form

**Beispiel (SWS):** geg. $a=8\text{ cm}$, $b=10\text{ cm}$, $\gamma=55°$; ges. $c$
$$c^2 = 8^2+10^2-2\cdot8\cdot10\cdot\cos(55°) \approx 164-91{,}75 \approx 72{,}25 \implies c\approx8{,}5\text{ cm}$$

**Beispiel (Parallelogramm-Diagonale):** In einem Parallelogramm mit Seiten $a,b$ und Winkel $\varepsilon$ liegen sich zwei Winkel gegenüber, die anderen beiden sind supplementär ($180°-\varepsilon$). Für die **kurze** Diagonale $e$ wird der Winkel $\varepsilon$ direkt verwendet, für die **lange** Diagonale $f$ der Winkel $180°-\varepsilon$:
$$e^2 = a^2+b^2-2ab\cos(\varepsilon) \qquad\qquad f^2 = a^2+b^2-2ab\cos(180°-\varepsilon)$$

> Achtung Prüfung: Beim Parallelogramm unbedingt darauf achten, **welcher** der beiden Winkel (der gegebene oder sein Supplement $180°-\varepsilon$) zur gesuchten Diagonale gehört — sonst vertauscht man kurze und lange Diagonale.

## Anwendung: Vermessungsaufgaben (2D)

Typische Aufgabe: Höhe eines Turms/Bergs bestimmen, wenn er von zwei Punkten mit unterschiedlichem Abstand zur Basis unter verschiedenem Höhenwinkel angepeilt wird. Löst man ein System mit zwei rechtwinkligen Teildreiecken (gemeinsame Höhe $h$), kombiniert man Tangens-Beziehungen mit einer Gleichsetzung (siehe auch `winkelfunktionen-rechtwinkliges-dreieck.md`). Sind die Teildreiecke **nicht** rechtwinklig, verwendet man stattdessen Sinus- und/oder Cosinussatz:

**Vorgehen:**
1. Fehlenden Winkel im Hilfsdreieck über die Winkelsumme $180°$ berechnen
2. Mit dem Sinussatz die noch unbekannte Seite (z. B. die "schräge" Distanz zum Objekt) berechnen
3. Mit dieser Seite und einem rechtwinkligen Teildreieck (Sinus/Cosinus/Tangens) die gesuchte Höhe oder Strecke bestimmen

## Anwendung: Vermessungsaufgaben im Raum (3D)

Bei räumlichen Vermessungsaufgaben (z. B. Höhe eines Objekts von zwei Standpunkten aus, die **nicht** auf einer Geraden mit dem Fusspunkt liegen) entsteht zusätzlich ein Dreieck in der Grundebene:

**Vorgehen:**
1. Grundriss-Dreieck (Standpunkte + Fusspunkt des Objekts) analysieren — meist über Cosinussatz oder Sinussatz lösbar, da die Winkel zwischen den Sichtlinien in der Ebene bekannt sind
2. Die so gewonnene(n) Strecke(n) in der Grundebene mit dem/den Höhenwinkel(n) über $\tan(\text{Höhenwinkel}) = \dfrac{h}{\text{Grundstrecke}}$ verknüpfen
3. Nach der gesuchten Höhe $h$ auflösen

> Merke: Räumliche Vermessungsaufgaben zerfallen fast immer in **zwei Teilprobleme**: ein Dreieck "am Boden" (meist mit Sinus-/Cosinussatz) und ein senkrechtes rechtwinkliges Dreieck (Höhenwinkel, Tangens) — die beiden Teile teilen sich eine gemeinsame Strecke in der Grundebene.

## Ehemalige Maturaaufgaben (kombinierte Anwendungen)

Komplexere Figuren (z. B. Vielecke, die nicht direkt eine Standardformel haben) werden in mehrere Dreiecke zerlegt. Für jedes Teildreieck wird situativ Sinussatz, Cosinussatz oder die trigonometrische Flächenformel angewendet, je nachdem welche Stücke (Seiten/Winkel) bereits bekannt sind — die Ergebnisse eines Teildreiecks (z. B. eine berechnete Seite oder Diagonale) dienen dann als gegebene Grösse für das nächste Teildreieck.

## Zusammenfassung: Welchen Satz wann verwenden?

| Bekannt (gegeben) | Zu verwenden |
|---|---|
| 2 Winkel + 1 Seite (WWS/WSW) | Sinussatz |
| 2 Seiten + Gegenwinkel einer Seite (SSW) | Sinussatz (Achtung: Ambiguous Case möglich) |
| 2 Seiten + eingeschlossener Winkel (SWS) | Cosinussatz (für dritte Seite) bzw. Flächenformel (für Fläche) |
| 3 Seiten (SSS) | Cosinussatz, umgestellt nach dem Winkel |
| 2 Seiten + eingeschlossener Winkel, nur Fläche gesucht | Trigonometrische Flächenformel |

> Merke: Sinussatz braucht immer ein Winkel-Seiten-**Gegenpaar** (Winkel und die ihm gegenüberliegende Seite). Cosinussatz braucht **keine** Gegenpaare — er funktioniert direkt mit SSS oder SWS.
