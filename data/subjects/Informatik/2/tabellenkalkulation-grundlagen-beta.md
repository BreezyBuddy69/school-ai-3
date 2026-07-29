# Tabellenkalkulation — Grundlagen

> 🧪 **Beta** — nicht in deinen OneNote-Notizen/Zusammenfassungen von Jahr 2 gefunden. Aus dem offiziellen LG-Lehrplan + ergänzender Recherche erstellt. Ersetzen/ergänzen, sobald echte Notizen vorliegen.

![LibreOffice Calc mit Diagramm](https://upload.wikimedia.org/wikipedia/commons/8/85/LibreOffice_Calc_screenshot_showing_a_simple_chart.png)

## Aufbau eines Tabellenblatts
Ein **Tabellenkalkulationsprogramm** (z.B. Excel, LibreOffice Calc) organisiert Daten in einem Gitter aus **Zeilen** (Zahlen: 1, 2, 3, …) und **Spalten** (Buchstaben: A, B, C, …).

| Begriff | Bedeutung |
|---|---|
| **Zelle** | Schnittpunkt einer Zeile und Spalte, z.B. `B4` |
| **Zellbezug** | Adresse einer Zelle, wird in Formeln verwendet |
| **Arbeitsblatt (Sheet)** | eine Tabelle innerhalb der Datei |
| **Arbeitsmappe** | die ganze Datei mit ggf. mehreren Arbeitsblättern |

## Formeln
Jede Formel beginnt mit `=`.

```
=B2+B3        (Addition)
=B2-B3        (Subtraktion)
=B2*B3        (Multiplikation)
=B2/B3        (Division)
=SUMME(B2:B10)   (Summe eines Bereichs)
=MITTELWERT(B2:B10)  (Durchschnitt)
=MAX(B2:B10)  (grösster Wert)
=MIN(B2:B10)  (kleinster Wert)
```

> Merke: Der Doppelpunkt `:` in `B2:B10` bedeutet „von B2 bis B10" — ein ganzer Zellbereich.

### Zellbezüge kopieren — relativ vs. absolut
| Bezugsart | Schreibweise | Verhalten beim Kopieren |
|---|---|---|
| **Relativ** | `B2` | passt sich automatisch an die neue Position an |
| **Absolut** | `$B$2` | bleibt beim Kopieren immer gleich (Dollarzeichen „friert" Zeile/Spalte ein) |

> Achtung Prüfung: Wird eine Formel mit relativem Bezug in eine andere Zeile/Spalte kopiert, verschieben sich die Bezüge automatisch mit — genau das macht Tabellenkalkulation so mächtig, kann aber zu Fehlern führen, wenn man einen festen Wert (z.B. einen MwSt.-Satz) eigentlich unverändert lassen wollte. Dafür `$` verwenden!

## Diagramme aus Tabellendaten
Aus markierten Daten lässt sich mit wenigen Klicks ein Diagramm erzeugen (Balken-, Kreis-, Liniendiagramm — siehe Fach Statistik). Wichtig: **immer zuerst die Daten sauber strukturieren** (Titel in der ersten Zeile/Spalte), sonst entsteht ein falsches Diagramm.

## Sortieren und Filtern
- **Sortieren**: Zeilen nach einer Spalte auf-/absteigend ordnen
- **Filtern**: nur Zeilen anzeigen, die eine Bedingung erfüllen (z.B. „Note ≥ 5")

> Merke: Vor dem Sortieren immer den **ganzen Datenbereich** markieren — sonst werden nur einzelne Spalten sortiert und die Zeilen passen nicht mehr zusammen (Datensalat!).
