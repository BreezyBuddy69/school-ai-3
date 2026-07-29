# Kräfte auf der schiefen Ebene
**Fach:** Physik | **Klasse:** 5Wa

> ✅ Aus deinen echten OneNote-Notizen (Jahr 5) übernommen und aufbereitet.

## Grundidee

Liegt ein Körper auf einer geneigten Fläche (Winkel $\alpha$ zur Horizontalen), muss die Gewichtskraft $F_G$ in zwei zueinander senkrechte Komponenten zerlegt werden:

- **Hangabtriebskraft** $F_H$ — wirkt parallel zur schiefen Ebene, nach unten (Richtung Ebene hinunter)
- **Normalkraft** $F_N$ — wirkt senkrecht zur Ebene (drückt den Körper "in" die Ebene)

## Herleitung

Der Winkel zwischen der Gewichtskraft und der senkrechten Komponente der Gewichtskraft ist gleich dem Neigungswinkel $\alpha$ der schiefen Ebene (Wechselwinkel). Es gilt:

$$\sin(\alpha) = \frac{F_H}{F_G} \quad \Rightarrow \quad F_H = F_G \cdot \sin(\alpha)$$

$$\cos(\alpha) = \frac{F_N}{F_G} \quad \Rightarrow \quad F_N = F_G \cdot \cos(\alpha)$$

Da $F_G = m \cdot g$, folgt für die Beschleunigung entlang der Ebene (bei vernachlässigter Reibung):

$$m \cdot a = m \cdot g \cdot \sin(\alpha) \quad \Rightarrow \quad a = g \cdot \sin(\alpha)$$

> Merke: Die Beschleunigung auf der schiefen Ebene ist **unabhängig von der Masse** des Körpers, hängt aber vom **Neigungswinkel** ab. Bei $\alpha = 90°$ ist $a = g$ (freier Fall); bei $\alpha = 0°$ ist $a = 0$ (keine Bewegung entlang der horizontalen Fläche).

## Mit Reibung

Wird die Reibung nicht vernachlässigt, wirkt zusätzlich die Reibungskraft $F_R = \mu \cdot F_N$ der Hangabtriebskraft entgegen (bergauf, wenn der Körper bergab rutscht):

$$F_{\text{res}} = F_H - F_R = F_G \sin(\alpha) - \mu \cdot F_G \cos(\alpha)$$

Daraus folgt für die Beschleunigung:
$$a = g \cdot (\sin(\alpha) - \mu \cdot \cos(\alpha))$$

**Grenzfall (Körper bleibt gerade noch liegen, keine Bewegung):** Wenn Hangabtriebskraft und maximale Haftreibungskraft sich gerade aufheben, gilt $\tan(\alpha) = \mu_{HR}$ — daraus lässt sich der **Grenzwinkel** (Rutschwinkel) berechnen, ab dem ein Körper auf einer schiefen Ebene ins Rutschen kommt.

## Typischer Aufgabenablauf

1. Kräfte am Körper einzeichnen: Gewichtskraft $F_G$, Normalkraft $F_N$, Hangabtriebskraft $F_H$, ggf. Reibungskraft $F_R$
2. $F_G$ in Hangabtriebs- und Normalkomponente zerlegen
3. Kräftegleichgewicht/Newton II entlang der Ebene aufstellen
4. Nach $a$ (oder gesuchter Grösse) auflösen
