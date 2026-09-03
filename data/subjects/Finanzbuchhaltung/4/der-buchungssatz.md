# Der Buchungssatz, Bilanzveränderungen, Eröffnung und Abschluss

**Fach:** Finanzbuchhaltung (Profil Wirtschaft und Recht) | **Klasse:** 4Wa

> ✅ Aus deinen echten OneNote-Notizen (Jahr 4) übernommen und aufbereitet.

## Vom Geschäftsfall zum Buchungssatz

Jeder Geschäftsfall wird in einen **Buchungssatz** übersetzt: Soll-Konto **an** Haben-Konto, Betrag.

**Merksatz:** *"Soll an Haben"* — das Wort **"an"** trennt Soll- und Haben-Konto.

## Das Grundprinzip: Doppelte Buchhaltung

Jeder Geschäftsfall wird **zweimal** erfasst — einmal im Soll, einmal im Haben, immer mit dem gleichen Betrag.

$$\sum \text{Soll} = \sum \text{Haben}$$

```
Das System der doppelten Buchhaltung:

Bilanzkonten                              Erfolgskonten
Aktivkonten | Passivkonten                Aufwandkonten | Ertragskonten
   ↑              ↑                              ↑              ↑
   Hauptbuch (einzelne Konten je Bilanz-/Erfolgsposition)
   ↓              ↓
Schlussbilanz 31.12.        |        Erfolgsrechnung 1.1.–31.12.
Saldo Aktivkonten | Saldo Passivkonten   Saldo Aufwandkonten | Saldo Ertragskonten
```
> Merke: Bei den Erfolgskonten gibt es **keinen Anfangsbestand**, da die Erfassung von Aufwand und Ertrag jährlich bei null beginnt!

## Vorgehen beim Bilden eines Buchungssatzes

1. Geschäftsfall verstehen: Was ist wirtschaftlich passiert?
2. Betroffene Konten bestimmen.
3. Kontoart bestimmen: Aktiv-, Passiv-, Aufwand- oder Ertragskonto?
4. Zu-/Abnahme bestimmen.
5. Soll/Haben-Seite ableiten (siehe `kontenrahmen-und-kontenarten.md`).
6. Buchungssatz formulieren: Soll-Konto / Haben-Konto, Betrag.

## Beispiele echter Buchungssätze aus dem Unterricht

```
Kauf von Büroeinrichtungen gegen Rechnung, 3'600
Buchungssatz: Mobiliar / Verbindlichkeiten   3'600

Zahlung von Lieferantenschulden über die Bank, 3'600
Buchungssatz: Verbindlichkeiten / Bank   3'600

Kauf von Wertschriften über die Bank, 8'258
Buchungssatz: Wertschriften UV / Bank   8'258

Kunden zahlen fällige Rechnungen auf unser Bankkonto, 3'654
Buchungssatz: Bank / Forderungen   3'654

Wir beteiligen uns an einem Unternehmen und überweisen den Betrag per Bank, 26'000
Buchungssatz: Beteiligungen / Bank   26'000
```

## Bilanzveränderung und Buchungsregeln für Erfolgskonten

Gleichzeitig mit dem Aufwandkonto wird in der Regel auch ein Bilanzkonto verändert. Diese Veränderung ist gemäss den für Bilanzkonten geltenden Buchungsregeln zu verbuchen.

```
Beispiel: Kauf von Rohmaterial gegen Rechnung, CHF 10'000
Aufwandkonto Materialaufwand: Zunahme des Aufwands = Sollbuchung
Passivkonto Verbindlichkeiten: Zunahme der Passiven = Habenbuchung
Buchungssatz: Materialaufwand / Verbindlichkeiten   10'000

Beispiel: Verkauf fertiger Erzeugnisse gegen Rechnung, CHF 20'000
Ertragskonto Produktionsertrag: Zunahme des Ertrags = Habenbuchung
Aktivkonto Forderungen: Zunahme der Aktiven = Sollbuchung
Buchungssatz: Forderungen / Produktionsertrag   20'000
```

> Achtung Prüfung: Bei zusammengesetzten Buchungssätzen muss die Summe aller Soll-Beträge immer der Summe aller Haben-Beträge entsprechen — sonst ist der Buchungssatz falsch.

## Die vier Bilanzveränderungsarten

| Bilanzveränderung | Beispiel |
|---|---|
| **Aktivtausch** | Bareinzahlung aufs Bankkonto |
| **Passivtausch** | Kreditorenschuld → Bankdarlehen |
| **Bilanzverlängerung** | Wareneinkauf auf Kredit |
| **Bilanzverkürzung** | Kreditor wird per Bank bezahlt |

Details und T-Konto-Beispiele: siehe `bilanz-aktiva-und-passiva.md`.

## Der Abschluss (Ende Geschäftsjahr)

Am Ende des Jahres werden die einzelnen Bilanzkonten abgeschlossen und in die **Schlussbilanz** übertragen. Auch dieser Vorgang muss verbucht werden.

```
        Kassa (Aktivkonto)                Verbindlichkeiten (Passivkonto)
Soll  Anfangsbestand |  Saldo (–)  Haben     Soll   Saldo (–) | Anfangsbestand  Haben
      Zunahme (+)    |             (Schlussbestand)          | Zunahme (+)
                ↓                                    ↓
        Schlussbilanz per 31.12.
Aktiven: Kasse ...   |   Passiven: Verbindlichkeiten ...
```

**Die Abschlussbuchungen lauten:**
```
Schlussbilanz  an  Aktivkonto     (für jedes Aktivkonto)
Passivkonto    an  Schlussbilanz  (für jedes Passivkonto)
```

**Abgekürztes Verfahren für den Abschluss (Sammelbuchung):**
$$\textbf{Passiven an Aktiven}$$

## Die Eröffnung (Beginn neues Geschäftsjahr)

Sobald ein neues Geschäftsjahr eröffnet wird, müssen von der **Eröffnungsbilanz** aus die einzelnen Konten des Hauptbuches eröffnet werden — im Prinzip ein "umgekehrter Abschluss".

**Die Eröffnungsbuchungen lauten:**
```
Aktivkonto        an  Eröffnungsbilanz  (für jedes Aktivkonto)
Eröffnungsbilanz   an  Passivkonto       (für jedes Passivkonto)
```

**Abgekürztes Verfahren für die Eröffnung (Sammelbuchung):**
$$\textbf{Aktiven an Passiven}$$

> Merke: **Abschluss = Passiven an Aktiven**, **Eröffnung = Aktiven an Passiven** — die beiden Merksätze sind spiegelbildlich zueinander, verwechsle sie nicht in der Prüfung!

## Verbuchung des Erfolgs (Gewinn/Verlust)

Am Jahresende werden auch die Erfolgskonten abgeschlossen (siehe `erfolgsrechnung.md`) und der ermittelte Gewinn/Verlust dem Eigenkapital zugeschlagen:

```
Bei Gewinn:  Erfolgsrechnung / Eigenkapital
Bei Verlust: Eigenkapital / Erfolgsrechnung
```

## Häufige Fehlerquellen

- Soll und Haben vertauscht (v. a. bei Aufwand-/Ertragskonten)
- falsche Kontoart angenommen (z. B. Debitoren als Passivkonto statt Aktivkonto)
- Beträge im Soll und Haben stimmen nicht überein
- Abschluss/Eröffnung-Merksätze verwechselt
