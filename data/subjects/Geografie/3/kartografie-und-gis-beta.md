# Kartografie und GIS

> 🧪 **Beta** — nicht in deinen OneNote-Notizen/Zusammenfassungen von Jahr 3 gefunden. Aus dem offiziellen LG-Lehrplan + ergänzender Recherche erstellt. Ersetzen/ergänzen, sobald echte Notizen vorliegen.

## Warum sind Karten immer Verzerrungen?
Eine Kugeloberfläche (Erde) lässt sich **niemals verzerrungsfrei** auf eine flache Ebene (Karte) übertragen — jede Kartenprojektion verzerrt entweder Flächen, Winkel, Distanzen oder Formen.

![Vergleich verschiedener Kartenprojektionen](https://upload.wikimedia.org/wikipedia/commons/3/3e/Different_map_projections.png)

## Wichtige Projektionsarten
| Projektion | Eigenschaft | Verzerrung | Beispiel-Nutzen |
|---|---|---|---|
| **Mercator** (zylindrisch) | winkeltreu | Flächen an den Polen stark vergrössert (Grönland wirkt riesig) | Seefahrt/Navigation |
| **Gall-Peters** | flächentreu | Formen verzerrt (gestreckt) | politisch korrekte Flächendarstellung |
| **Robinson** | kompromissartig | weder winkel- noch flächentreu, aber "gut aussehend" | Schulatlanten, Weltkarten |
| **Azimutal** | vom Zentrum aus richtungstreu | starke Randverzerrung | Polarkarten, Flugrouten |

> Merke: Auf der Mercator-Projektion wirkt Grönland fast so gross wie Afrika — real ist Afrika über **14-mal grösser**. Das prägt (unbewusst) unser Weltbild!

## Kartenelemente
- **Massstab**: Verhältnis Kartenlänge : Wirklichkeit (z.B. 1:25'000 → 1 cm auf der Karte = 250 m in der Realität)
- **Legende**: erklärt Signaturen/Farben
- **Gradnetz**: Längen- und Breitengrade zur Positionsbestimmung (Koordinaten)
- **Nordpfeil**: Orientierung

## Koordinatensystem
- **Breitengrade (Latitude)**: 0° am Äquator bis 90° an den Polen
- **Längengrade (Longitude)**: 0° am Nullmeridian (Greenwich) bis 180°
- Angabe z.B.: Vaduz liegt bei ca. 47.14° N, 9.52° O

## GIS — Geografische Informationssysteme
**Definition:** Software zur Erfassung, Verwaltung, Analyse und Visualisierung raumbezogener Daten in **Layern** (Ebenen).

### Beispiele für Layer
- Höhenmodell (Relief)
- Verkehrsnetz
- Bevölkerungsdichte
- Landnutzung

### Anwendungen von GIS
- Raumplanung und Naturgefahrenkarten
- Navigationssysteme (GPS-gestützt)
- Katastrophenmanagement (z.B. Hochwasserzonen)
- Standortanalysen für Unternehmen

> Achtung Prüfung: GIS verknüpft **Geodaten** (wo?) mit **Sachdaten** (was?) — genau das macht es mächtiger als eine einfache Karte.
