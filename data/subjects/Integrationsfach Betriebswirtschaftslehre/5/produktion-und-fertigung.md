# Produktion und Fertigung

**Fach:** Integrationsfach Betriebswirtschaftslehre (Profil Wirtschaft und Recht) | **Klasse:** 5Wa

> ✅ Aus deinen echten OneNote-Notizen (Jahr 5) übernommen und aufbereitet.

## 1. Käufer- und Verkäufermarkt

| Markt | Beschreibung |
|---|---|
| **Käufermarkt** | Käufer ist im Vorteil, kann leicht zu anderen Anbietern wechseln (Angebot > Nachfrage) |
| **Verkäufermarkt** | Verkäufer ist im Vorteil, z. B. bei einem Monopol (Nachfrage > Angebot) |

> Merke: In den letzten Jahren hat sich ein Wandel hin zum **Käufermarkt** vollzogen — früher stand die Auslastung der Betriebsmittel im Vordergrund, heute sind **Durchlaufzeiten und Termintreue** wichtiger geworden.

## 2. Fertigungstypen (nach Menge)

| Typ | Beschreibung | Beispiel |
|---|---|---|
| **Einzelfertigung** | einmalig, individuell | Brücke, Schiff |
| **Serienfertigung** | begrenzte Mengen, umstellbar | Möbel, Kleidung |
| **Massenfertigung** | kontinuierlich, grosse Mengen | Schrauben, Autos |

## 3. Fertigungsverfahren (nach räumlicher Anordnung)

| Verfahren | Prinzip | Flexibilität | Stückkosten |
|---|---|---|---|
| **Werkstattfertigung** | Maschinen gleicher Art zusammen, Werkstück wandert | hoch | hoch |
| **Fliessfertigung** | Stationen in fester Reihenfolge, Taktband | niedrig | niedrig |
| **Gruppenfertigung** | Fertigungsinsel mit verschiedenen Maschinen zusammen | mittel | mittel |
| **Baustellenfertigung** | Produkt steht still, Arbeiter kommen zum Produkt | mittel | sehr hoch |

**Mass Customization:** Massenproduktion + individuelle Kundenwünsche — Standardmodule werden personalisiert konfiguriert (z. B. Nike iD, Dell, Mymuesli — Kunde stellt sein Produkt online selbst zusammen).

**Industrie 4.0:** Digitalisierung + Automatisierung + Vernetzung der Produktion.
- *Chancen:* höhere Effizienz, neue Berufsbilder, flexiblere Arbeit (z. B. Wegfall von Schichtarbeit, Homeoffice), sinkende Fehlerquote bei monotonen Tätigkeiten
- *Risiken:* Jobverlust bei Routineaufgaben, Cyberangriffe, hohe Investitionskosten

> Merke: Die Automatisierung verdrängt vor allem **monotone/routinierte** Tätigkeiten (Fertigung, klassische Büroberufe, Verkehr), während Berufe mit hohem menschlichem/sozialem Anteil (Kinderbetreuung, Pflege) sowie hochqualifizierte technische Berufe deutlich weniger gefährdet sind. Wichtig ist Weiterbildung, um Mitarbeitenden neue Aufgabenbereiche zu erschliessen.

## 4. Produktionsplanung und -steuerung (PPS)

```
Produktionsplanung:
  Primärbedarfsplanung
    → Sekundärbedarfsplanung
        → Terminplanung  |  Kapazitätsplanung
Produktionssteuerung:
  Auftragsfreigabe
    → Maschinenbelegungsplan
        → Rückmeldung (Betriebsdatenerfassung)
```

### Bedarfsarten (Exkurs Sekundärbedarfsplanung)
| Begriff | Definition |
|---|---|
| **Primärbedarf** | Bedarf an verkaufsfähigen Enderzeugnissen |
| **Sekundärbedarf** | Bedarf an Rohstoffen, Teilen und Baugruppen zur Fertigung des Primärbedarfs |
| **Tertiärbedarf** | Hilfs- und Betriebsstoffe |

**Ermittlung des Sekundärbedarfs:**

$$\text{Sekundärbedarf} = \text{Primärbedarf} \times \text{Menge Stücklistenbestandteile}$$
$$\text{Bruttobedarf} = \text{Sekundärbedarf} + \text{Zusatzbedarf (Wartung, Ausschuss, Mindernachlieferung)}$$
$$\text{Nettobedarf} = \text{Bruttobedarf} - \text{Lagerbestand} - \text{Bestellbestand} + \text{Vormerkbestand}$$

> Achtung Prüfung: **Bestellbestände** (bereits bestellte, aber noch nicht gelieferte Ware) erhöhen nach Lieferung den Lagerbestand — **Vormerkbestände** (bereits für andere Zwecke reservierte Ware, z. B. für die Fertigung) stehen zur Deckung des Nettobedarfs **nicht** mehr zur Verfügung, deshalb werden sie beim Nettobedarf wieder **addiert**.

### Zielsystem der Produktionsplanung und -steuerung

Zielkonflikt zwischen Kundenzielen und Betriebszielen:

| Kundenziele | Betriebsziel |
|---|---|
| kurze Durchlaufzeit, hohe Liefertreue | hohe Auslastung, niedrige Bestände |
| **gemeinsames Ziel: hohe Wirtschaftlichkeit** | |

## 5. Netzplantechnik (Critical Path Method)

**Wozu:** hilft zu bestimmen, in welcher Reihenfolge Aufgaben laufen müssen, wie lange ein Projekt mindestens dauert, und welche Aufgaben auf keinen Fall verzögert werden dürfen.

**Das Netzplan-Kästchen:**
```
┌────────────┬────────┬────────────┐
│    FAZ     │ Dauer  │    FEZ     │
├────────────┼────────┼────────────┤
│    SAZ     │  Nr.   │    SEZ     │
└────────────┴────────┴────────────┘
```

| Abkürzung | Bedeutung | Erklärung |
|---|---|---|
| **FAZ** | Frühester Anfangszeitpunkt | so früh wie möglich kann der Vorgang starten |
| **FEZ** | Frühester Endzeitpunkt | FAZ + Dauer |
| **SAZ** | Spätester Anfangszeitpunkt | so spät darf er starten, ohne das Projekt zu verzögern |
| **SEZ** | Spätester Endzeitpunkt | SAZ + Dauer |
| **Puffer** | Zeitreserve | SAZ − FAZ = wie viel Zeit verschwendet werden darf |

**Schritt-für-Schritt-Berechnung:**
1. **Vorwärtsrechnung** (FAZ/FEZ), von links nach rechts: Start FAZ = 0; FEZ = FAZ + Dauer; bei mehreren Vorgängern → **höchsten** FEZ als eigenen FAZ übernehmen
2. **Rückwärtsrechnung** (SAZ/SEZ), von rechts nach links: beim letzten Vorgang SEZ = FEZ (kein Spielraum); SAZ = SEZ − Dauer; bei mehreren Nachfolgern → **kleinsten** SAZ der Nachfolger als eigenen SEZ übernehmen
3. **Puffer berechnen:** Puffer = SAZ − FAZ (= SEZ − FEZ, gleiches Ergebnis)

**Der kritische Pfad** = alle Vorgänge mit **Puffer = 0** — diese Aufgaben dürfen keinesfalls verzögert werden, sonst verzögert sich das gesamte Projekt. Im Netzplan meist farbig markiert.

> Merke: **Vorwärts** = so früh wie möglich → immer das **Maximum** der Vorgänger nehmen. **Rückwärts** = so spät wie erlaubt → immer das **Minimum** der Nachfolger nehmen. Puffer = 0 → kritisch (kein Spielraum); Puffer > 0 → der Vorgang kann um genau so viele Tage verschoben werden.

## 6. Kosten und Wirtschaftlichkeitsvergleich in der Produktion (Break-Even zweier Maschinen)

Bei einem Vergleich zweier Maschinen/Fertigungsvarianten wird der **kritische Punkt** (xkrit) gesucht, ab dem sich Eigenfertigung gegenüber Fremdbezug (oder Maschine A gegenüber Maschine B) lohnt:

$$x_{krit} = \frac{|Fixkosten_1 - Fixkosten_2|}{|Stückkosten_1 - Stückkosten_2|}$$

*Beispiel:* Ab dem 200'001. Stück ist Eigenfertigung günstiger als Fremdbezug — bei der Entscheidung spielen neben den Kosten auch **Qualität, Lieferzeit und Termintreue** eine Rolle.

**Deckungsbeitrag je Fertigungsstunde:** Bei Kapazitätsengpässen (z. B. begrenzte Maschinenstunden) sollte sich die Produktion auf die Produktgruppe mit dem **höchsten Deckungsbeitrag pro Engpassstunde** konzentrieren, nicht zwingend auf die mit dem höchsten absoluten Deckungsbeitrag.

## 7. Lineare Optimierung (Produktionsprogrammplanung)

Bei mehreren Restriktionen (z. B. begrenzte Maschinenzeit, Mindest-/Höchstmengen an Rohstoffen) wird die optimale Produktionsmenge zweier Produkte grafisch bestimmt:

1. **Definitionen:** Variablen für die Mengen der beiden Produkte festlegen
2. **Bedingungen und Zielfunktion:** jede Restriktion als Ungleichung formulieren, dazu die Zielfunktion (z. B. maximaler Gewinn oder minimale Kosten)
3. **Grafische Darstellung:** alle Bedingungen als Geraden einzeichnen, der zulässige Bereich ist die Schnittmenge aller Bedingungen; das Optimum liegt an einem Eckpunkt dieses Bereichs

*Beispiel (Nahrungsmittelkonzern, Minimalkostenproblem):* Zwei Komponenten mit unterschiedlichen Nährstoffgehalten (Protein, Kohlenhydrate, Fett, Ballaststoffe) müssen kombiniert werden, um Mindestwerte zu erreichen — gesucht ist die kostengünstigste Mischung unter Einhaltung aller Nährwert-Mindestanforderungen.

## 8. Mass Customization — Chancen und Risiken

| | Kunde | Unternehmen |
|---|---|---|
| **Vorteile** | bekommt genau das, was er will; individuell | besseres Image, grössere Zielgruppen erreichbar, stärkere Kundenbindung |
| **Nachteile** | "Overkill" durch zu viel Auswahl, teurer | höhere Kosten, weniger produktiv, weniger Fokussierung möglich — aber höherer Gewinn pro Stück |
