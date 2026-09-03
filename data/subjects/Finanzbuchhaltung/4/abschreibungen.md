# Abschreibungen

**Fach:** Finanzbuchhaltung (Profil Wirtschaft und Recht) | **Klasse:** 4Wa

> ✅ Aus deinen echten OneNote-Notizen (Jahr 4) übernommen und aufbereitet.

## Warum wird abgeschrieben?

Anlagevermögen (z. B. Maschinen, Fahrzeuge, Mobiliar) verliert über die Zeit an Wert — durch Abnutzung, technischen Fortschritt oder Zeitablauf. Dieser Wertverlust wird als **Abschreibung** erfasst und als **Aufwand** verbucht — nach dem Prinzip der periodengerechten Erfolgsermittlung: Die Kosten der Anschaffung werden über die gesamte Nutzungsdauer verteilt, nicht auf einen Schlag im Kaufjahr.

> Merke: Ein Kauf (Ausgabe) und ein Aufwand sind nicht dasselbe: Beim Kauf einer Maschine entsteht **keine** sofortige Aufwandbuchung in dieser Höhe — der Betrag wandert zunächst als **Aktivtausch** ins Anlagevermögen und wird erst über die Nutzungsdauer als Abschreibung zu Aufwand.

## Die lineare Abschreibungsmethode (vom Anschaffungswert)

Gleichbleibender Abschreibungsbetrag über die ganze Nutzungsdauer.

$$\text{jährliche Abschreibung} = \frac{\text{Anschaffungswert} - \text{Restwert}}{\text{Nutzungsdauer}}$$

```
Beispiel: Anschaffungswert 300'000, Nutzungsdauer 5 Jahre, linear
Jahr | Abschreibung | Buchwert
1    | 60'000       | 240'000
2    | 60'000       | 180'000
3    | 60'000       | 120'000
4    | 60'000       |  60'000
5    | 60'000       |       0
```

## Die degressive Abschreibungsmethode (vom Buchwert)

Fixer Prozentsatz wird jedes Jahr auf den **aktuellen (sinkenden) Buchwert** angewendet — dadurch sind die Abschreibungsbeträge anfangs hoch und werden von Jahr zu Jahr kleiner.

$$\text{jährliche Abschreibung} = \text{Buchwert Jahresanfang} \times \text{Abschreibungssatz}$$

```
Beispiel: Anschaffungswert 300'000, Abschreibungssatz gemäss Übung
Jahr | Buchwert Jahresanfang | Abschreibung | Buchwert Jahresende
1    | 300'000               | 120'000      | 180'000
2    | 180'000                | 72'000      | 108'000
3    | 108'000                | 43'200      |  64'800
```

| | Linear | Degressiv |
|---|---|---|
| Abschreibungsbetrag | konstant | anfangs hoch, dann sinkend |
| Bezugsgrösse | ursprünglicher Anschaffungswert | jeweils aktueller Buchwert |
| Buchwert erreicht 0? | ja, am Ende der Nutzungsdauer | rechnerisch nie ganz (nähert sich nur an) |

> Achtung Prüfung: Bei der degressiven Methode wird der Prozentsatz **immer auf den aktuellen Restbuchwert**, nicht auf den ursprünglichen Anschaffungswert angewendet.

## Direkte vs. indirekte Abschreibung

Aus dem Unterricht ausdrücklich als eigenständiges Themenpaar behandelt ("Abschreibungen direkt" / "Abschreibungen indirekt"):

| Methode | Buchungssatz | Wirkung im Anlagekonto |
|---|---|---|
| **Direkte Abschreibung** | Abschreibungsaufwand / Anlagekonto (z. B. Maschinen) | der Buchwert des Anlagekontos selbst sinkt direkt |
| **Indirekte Abschreibung** | Abschreibungsaufwand / **Wertberichtigung** Anlagekonto | das Anlagekonto zeigt weiterhin den ursprünglichen Anschaffungswert; die kumulierten Abschreibungen werden separat auf einem eigenen **Wertberichtigungskonto** (Gegenkonto, Passivkonto) gesammelt |

```
Buchwert bei indirekter Abschreibung = Anschaffungswert (Anlagekonto) − Saldo Wertberichtigungskonto
```

> Merke: Bei der **direkten** Abschreibung zeigt das Anlagekonto **immer den aktuellen Buchwert**. Bei der **indirekten** Abschreibung zeigt das Anlagekonto **immer den ursprünglichen Anschaffungswert** — der Buchwert ergibt sich erst aus der Differenz zum Wertberichtigungskonto. Das gleiche Prinzip (Wertberichtigungskonto als Gegenkonto) kennst du bereits vom **Delkredere** bei den Debitoren, siehe `forderungsverluste-und-delkredere.md`.

## Verkauf von Anlagevermögen

Wird eine abgeschriebene Anlage verkauft, muss zuerst der noch bestehende Buchwert ausgebucht und der Verkaufserlös verbucht werden — ein Gewinn oder Verlust aus dem Verkauf entsteht, wenn Verkaufserlös und Buchwert auseinanderfallen (Thema "Abschreibungen mit Verkauf").
