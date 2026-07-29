# Kinematik: Bewegungsgleichungen
**Fach:** Physik | **Klasse:** 5Wa

> ✅ Aus deinen echten OneNote-Notizen (Jahr 5) übernommen und aufbereitet.

## Grundgrössen

| Grösse | Symbol | Einheit |
|---|---|---|
| Weg / Strecke | $s$ | m |
| Geschwindigkeit | $v$ | m/s |
| Beschleunigung | $a$ | m/s² |
| Zeit | $t$ | s |

## Gleichförmige Bewegung (konstante Geschwindigkeit)

$$v = \frac{s}{t} \quad \Rightarrow \quad s = v \cdot t, \quad t = \frac{s}{v}$$

## Gleichmässig beschleunigte Bewegung (konstante Beschleunigung)

$$v = a \cdot t + v_0$$
$$s = \frac{1}{2} a t^2 + v_0 t$$
$$v^2 = v_0^2 + 2as$$

Bei $v_0 = 0$ (Start aus der Ruhe) vereinfacht sich das zu:
$$v = a \cdot t \qquad s = \frac{1}{2}at^2 \qquad v^2 = 2as$$

## Mittlere (durchschnittliche) Beschleunigung

Ist die Beschleunigung nicht konstant, berechnet man die **mittlere Beschleunigung** zwischen zwei Zeitpunkten:

$$\bar{a} = \frac{\Delta v}{\Delta t} = \frac{v_2 - v_1}{t_2 - t_1}$$

**Einheit herleiten:**
$$[a] = \frac{[v]}{[t]} = \frac{\text{m/s}}{\text{s}} = \frac{\text{m}}{\text{s}^2}$$

## Freier Fall

Ein Sonderfall der gleichmässig beschleunigten Bewegung mit $a = g \approx 9{,}81\ \text{m/s}^2$ und $v_0 = 0$:

$$v = g \cdot t \qquad s = \frac{1}{2} g t^2 \qquad t = \sqrt{\frac{2s}{g}}$$

## Anhalteweg (Reaktionsweg + Bremsweg)

Der gesamte Anhalteweg eines Fahrzeugs setzt sich zusammen aus:

$$s_{\text{Anhalte}} = s_{\text{Reaktion}} + s_{\text{Brems}}$$

- **Reaktionsweg:** zurückgelegter Weg während der Reaktionszeit (bevor gebremst wird), berechnet mit gleichförmiger Bewegung: $s_{\text{Reaktion}} = v \cdot t_{\text{Reaktion}}$
- **Bremsweg:** zurückgelegter Weg während der Verzögerung (negative Beschleunigung), berechnet mit den Formeln der gleichmässig beschleunigten Bewegung

> Merke: Bei einer negativen Beschleunigung (Verzögerung/Bremsen) sind $a$ und die ursprüngliche Bewegungsrichtung von $v$ **entgegengesetzt** — deshalb wird $a$ in den Formeln mit negativem Vorzeichen eingesetzt.

## Musterrechnung (Beispiel Bremsvorgang)

Gesucht: Bremsweg bei Endgeschwindigkeit $v_a$, Anfangsgeschwindigkeit $v$, Verzögerung $a$ (negativ):

$$s = \frac{v^2 - v_a^2}{2a}$$

> Achtung Prüfung: Beim Umformen der Formel $v^2 = v_0^2 + 2as$ nach $s$ unbedingt auf die Vorzeichen von $a$ (negativ beim Bremsen) achten — ein Vorzeichenfehler kippt sofort das ganze Ergebnis.
