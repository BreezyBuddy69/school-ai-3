# Endliche Automaten und Kara

> ✅ Aus deinen echten OneNote-Notizen (Jahr 4) übernommen und aufbereitet. Zusatzthema — im offiziellen Stoffprogramm nicht als eigener Punkt gelistet, aber als eigene, separat geprüfte Lerneinheit (Kapiteltests, Schulaufgabe 1) in deinen echten Notizen vorhanden.

## Alphabete

**Definition:** Ein Alphabet ist eine **endliche, nichtleere Menge von Symbolen**. Bezeichnung meist mit $\Sigma$ (Sigma).

**Beispiele:**
- $\Sigma = \{a, b, c\}$
- $\Sigma_{\text{Bool}} = \{0, 1\}$
- $\Sigma_{\text{lat}} = \{a, b, c, \dots, z\}$
- $\mathbb{N}$ ist **kein** Alphabet (unendliche Menge)
- $\emptyset = \{\}$ ist **kein** Alphabet (leere Menge)

> Achtung Prüfung: Bei „ist das ein Alphabet?" immer zwei Kriterien prüfen: **endlich** und **nichtleer**. Welche Symbole enthalten sind, spielt keine Rolle.

## Wörter

**Definition:** Ein Wort (Zeichenreihe, String) ist eine endliche Folge von Symbolen eines Alphabets. Man sagt „Wort **über** dem Alphabet $\Sigma$".

- `abc` ist ein Wort über $\Sigma_{\text{lat}}$
- `100111` ist ein Wort über $\{0, 1\}$
- $\Sigma_{\text{Tast}}$ = alle Symbole der Tastatur (inkl. Leerzeichen, Zeilenumbruch) → damit ist auch ein ganzer Satz oder Text ein „Wort"

**Leeres Wort:** Das Wort ohne Symbole, Zeichen $\varepsilon$ (Epsilon). Ist Wort über **jedem** Alphabet.

**Länge eines Wortes** $|w|$ = Anzahl der Symbole:
- $|abc| = 3$, $|100111| = 6$, $|\varepsilon| = 0$
- Leerzeichen zählen mit: $|\text{Informatik ist spannend}| = 23$

**Konkatenation (Verkettung):** $x \cdot y = xy$ — zwei Wörter aneinanderhängen. Beispiel: $x = 01001$, $y = 110$ → $xy = 01001110$.

**Teilwort (Infix):** $v$ ist Teilwort von $w$, wenn $w = xvy$ für irgendwelche Wörter $x, y$. Ein **echtes** Teilwort ist kürzer als $w$ selbst. $\varepsilon$ und $w$ selbst sind immer Teilwörter von $w$.

**Präfix / Suffix:** $v$ ist Präfix von $w$, wenn $w = vy$ gilt. $v$ ist Suffix von $w$, wenn $w = xv$ gilt. $\varepsilon$ und $w$ selbst sind immer Präfix **und** Suffix von $w$.

> Merke: Sprache = eine Teilmenge aller möglichen Wörter über einem Alphabet. Sprachen haben eine **Syntax** (korrekter Aufbau) und **Semantik** (Bedeutung).

## Endliche Automaten (Theorie)

Ein endlicher Automat entscheidet, ob eine Eingabe (ein Wort, Symbol für Symbol von einem Eingabeband gelesen) zu einer Sprache gehört — ob sie **akzeptiert** wird.

**Formale Definition** — ein (nichtdeterministischer) endlicher Automat ist ein Quintupel:

$$M = (Q, \Sigma, \delta, q_0, F)$$

| Symbol | Bedeutung |
|---|---|
| $Q$ | endliche, nichtleere Menge der Zustände |
| $\Sigma$ | Eingabealphabet |
| $\delta$ | alle Zustandsübergänge (Tabelle oder Graph) |
| $q_0$ | Startzustand ($q_0 \in Q$) |
| $F$ | Menge der akzeptierenden Zustände ($F \subseteq Q$) |

**Arbeitsweise:** Der Automat startet im Startzustand, liest das Wort Zeichen für Zeichen, wechselt bei jedem Zeichen den Zustand (oder verbleibt). Ist er nach dem letzten Zeichen in einem **akzeptierenden Zustand** (doppelter Kreis), wird das Wort akzeptiert — sonst zurückgewiesen.

**Beispiel:** Automat über $\Sigma = \{a, b\}$ mit Zuständen $q_1$ (Start) und $q_2$ (akzeptierend): bei `a` bleibt/wechselt er zu $q_1$, bei `b` bleibt/wechselt er zu $q_2$. Dieser Automat akzeptiert genau die Wörter, die mit `b` enden.

Übersichtliche Darstellung als Tabelle:

| Zustand | Eingabe `a` | Eingabe `b` |
|---|---|---|
| $q_1$ | $q_1$ | $q_2$ |
| $q_2$ | $q_1$ | $q_2$ |

> Achtung Prüfung: Solange nicht das ganze Wort gelesen ist, spielt es keine Rolle, in welchem Zustand sich der Automat gerade befindet — nur der **Endzustand** nach dem letzten Symbol entscheidet über Akzeptanz.

## Kara, der programmierbare Marienkäfer

Kara bewegt sich auf einer Wiese aus quadratischen Feldern mit Kleeblättern, Pilzen und Baumstrünken. Kara wird über **Sensoren** (Wahrnehmung) und **Befehle** (Handlung) gesteuert.

**Sensoren** (liefern `ja`/`nein`):

| Sensor | Frage |
|---|---|
| Baum vorne? | Steht Kara vor einem Baumstrunk? |
| Baum links? / Baum rechts? | Ist links/rechts von Kara ein Baumstrunk? |
| Pilz vorne? | Steht Kara vor einem Pilz? |
| Kleeblatt unten? | Steht Kara auf einem Kleeblatt? |

**Befehle:**

| Befehl | Wirkung |
|---|---|
| vorwärts | Kara hüpft aufs nächste Feld (blockiert durch Baum) |
| links drehen / rechts drehen | auf der Stelle drehen, kein Ortswechsel |
| Kleeblatt ablegen | nur wenn Feld leer ist |
| Kleeblatt aufnehmen | nur wenn ein Kleeblatt da liegt |

**Kara programmieren = endlicher Automat:** Der Automat ist „Karas Gehirn". Sensor-Antworten sind der **Input**, Befehle an Kara sind die **Aktionen** bei jedem Zustandsübergang. Ein typisches Muster: ein Arbeitszustand (z. B. „Blätter sammeln") plus ein **Stoppzustand**, in den gewechselt wird, sobald die Aufgabe erledigt ist.

**Beispiel-Automat** — „gehe geradeaus bis zum Baum, sammle unterwegs alle Blätter ein":

| Baum vorne? | Kleeblatt unten? | Karas Aktion | Nächster Zustand |
|---|---|---|---|
| nein | nein | vorwärts | Blätter sammeln |
| nein | ja | Kleeblatt aufnehmen, vorwärts | Blätter sammeln |
| ja | nein | — | Stopp |
| ja | ja | Kleeblatt aufnehmen | Stopp |

> Merke: Bevor du Kara am Computer programmierst, entwirf den Automaten **auf Papier**: 1) welche Zustände braucht es? 2) welche Sensoren? 3) was tut Kara in jeder Sensor-Kombination, und in welchen Zustand geht er dann über?

> Achtung Prüfung: Ein Programm, das nur für eine einzige Welt getestet wurde, ist gefährlich — immer an **mehreren** Welten testen, sonst funktioniert das Programm nur zufällig im Spezialfall.
