# Abschreibungen

**Fach:** Finanzbuchhaltung (Profil Wirtschaft und Recht) | **Klasse:** 4Wa

> 🧪 **Beta** — nicht in deinen OneNote-Notizen/Zusammenfassungen von Jahr 4 gefunden. Aus dem offiziellen LG-Lehrplan + ergänzender Recherche erstellt. Ersetzen/ergänzen, sobald echte Notizen vorliegen.

## Warum wird abgeschrieben?

Anlagevermögen (z. B. Maschinen, Fahrzeuge, Mobiliar) verliert über die Zeit an Wert — durch Abnutzung, technischen Fortschritt oder Zeitablauf. Dieser Wertverlust wird als **Abschreibung** erfasst und als **Aufwand** verbucht — nach dem Prinzip der **periodengerechten Erfolgsermittlung**: Die Kosten der Anschaffung werden über die **gesamte Nutzungsdauer** verteilt, nicht auf einen Schlag im Kaufjahr.

> Merke: Ein Kauf (Ausgabe) und ein Aufwand sind nicht dasselbe: Beim Kauf einer Maschine für 50'000 CHF entsteht **keine** sofortige Aufwandbuchung in dieser Höhe — die 50'000 CHF wandern zunächst als **Aktivtausch** ins Anlagevermögen und werden erst über die Nutzungsdauer als Abschreibung zu Aufwand.

## Die lineare Abschreibungsmethode

Gleichbleibender Abschreibungsbetrag über die ganze Nutzungsdauer.

$$\text{jährliche Abschreibung} = \frac{\text{Anschaffungswert} - \text{Restwert}}{\text{Nutzungsdauer}}$$

```
Beispiel: Maschine, Anschaffungswert 60'000 CHF, Restwert 0, Nutzungsdauer 5 Jahre
Jährliche Abschreibung = 60'000 / 5 = 12'000 CHF pro Jahr

Jahr | Buchwert Jahresanfang | Abschreibung | Buchwert Jahresende
1    | 60'000                | 12'000       | 48'000
2    | 48'000                | 12'000       | 36'000
3    | 36'000                | 12'000       | 24'000
4    | 24'000                | 12'000       | 12'000
5    | 12'000                | 12'000       | 0
```

## Die degressive Abschreibungsmethode

Fixer Prozentsatz wird jedes Jahr auf den **aktuellen (sinkenden) Buchwert** angewendet — dadurch sind die Abschreibungsbeträge anfangs hoch und werden von Jahr zu Jahr kleiner.

$$\text{jährliche Abschreibung} = \text{Buchwert Jahresanfang} \times \text{Abschreibungssatz}$$

```
Beispiel: Maschine, Anschaffungswert 60'000 CHF, Abschreibungssatz 30%

Jahr | Buchwert Jahresanfang | Abschreibung (30%) | Buchwert Jahresende
1    | 60'000                | 18'000              | 42'000
2    | 42'000                | 12'600              | 29'400
3    | 29'400                |  8'820              | 20'580
```

| | Linear | Degressiv |
|---|---|---|
| Abschreibungsbetrag | konstant | anfangs hoch, dann sinkend |
| Bezugsgrösse | ursprünglicher Anschaffungswert | jeweils aktueller Buchwert |
| Buchwert erreicht 0? | ja, am Ende der Nutzungsdauer | rechnerisch nie ganz (nähert sich nur an) |

> Achtung Prüfung: Bei der degressiven Methode wird der Prozentsatz **immer auf den aktuellen Restbuchwert**, nicht auf den ursprünglichen Anschaffungswert angewendet — sonst rechnest du linear statt degressiv.

## Verbuchung der Abschreibung

```
Buchungssatz: Abschreibungsaufwand / Anlagevermögen (z. B. Maschinen)
```

Die Abschreibung mindert direkt den Buchwert des Anlagekontos (Aktivkonto) und wird gleichzeitig als Aufwand in der Erfolgsrechnung erfasst.

> Merke: Abschreibungen sind eine der wichtigsten **Wertberichtigungen** neben denen auf Forderungen (siehe `forderungsverluste-und-delkredere-beta.md`) — beide dienen dazu, das Vermögen in der Bilanz **realistisch** (nicht überbewertet) darzustellen.
