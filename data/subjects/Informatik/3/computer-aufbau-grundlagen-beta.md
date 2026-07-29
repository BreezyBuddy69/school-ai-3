> 🧪 **Beta** — nicht in deinen OneNote-Notizen/Zusammenfassungen von Jahr 3 gefunden. Aus dem offiziellen LG-Lehrplan + ergänzender Recherche erstellt. Ersetzen/ergänzen, sobald echte Notizen vorliegen.

# Aufbau eines Computers — Grundlagen

## Das EVA-Prinzip
Jede Datenverarbeitung folgt demselben Grundmuster:

$$\text{Eingabe (E)} \;\longrightarrow\; \text{Verarbeitung (V)} \;\longrightarrow\; \text{Ausgabe (A)}$$

| Phase | Beschreibung | Beispiele |
|---|---|---|
| **E**ingabe | Daten gelangen ins System | Tastatur, Maus, Mikrofon, Sensor |
| **V**erarbeitung | Daten werden verändert/berechnet | CPU führt Programm aus |
| **A**usgabe | Ergebnis wird ausgegeben | Bildschirm, Lautsprecher, Drucker |

> Merke: Das EVA-Prinzip ist unabhängig vom konkreten Gerät — es gilt für einen Taschenrechner genauso wie für einen Supercomputer.

## Die Von-Neumann-Architektur

![Von-Neumann-Architektur: CPU (mit Steuerwerk und Rechenwerk), Arbeitsspeicher sowie Ein-/Ausgabegeräte sind über einen gemeinsamen Bus miteinander verbunden](https://upload.wikimedia.org/wikipedia/commons/d/db/Von-Neumann_Architektur.svg)

Fast alle heutigen Computer sind nach diesem Bauplan organisiert:

| Komponente | Aufgabe |
|---|---|
| **CPU** (Prozessor) | führt Befehle aus — besteht aus **Steuerwerk** (steuert Ablauf) und **Rechenwerk/ALU** (führt Berechnungen aus) |
| **Arbeitsspeicher (RAM)** | speichert Programme **und** Daten gemeinsam, solange der Computer läuft — flüchtig (Inhalt geht beim Ausschalten verloren) |
| **Ein-/Ausgabewerk** | verbindet den Computer mit der Aussenwelt (Tastatur, Bildschirm, Festplatte, Netzwerk) |
| **Bus** | die "Datenautobahn", über die alle Komponenten miteinander kommunizieren |

> Merke: Das Kernprinzip von Von Neumann ist, dass **Programm und Daten im selben Speicher** liegen und über denselben Bus transportiert werden — das unterscheidet diese Architektur von älteren Spezialrechnern mit getrenntem Programm- und Datenspeicher.

## CPU im Detail
- **Steuerwerk (Control Unit):** liest Befehle aus dem Speicher, entschlüsselt sie, steuert die Ausführung
- **Rechenwerk (ALU — Arithmetic Logic Unit):** führt die eigentlichen Rechen- und Vergleichsoperationen aus (+, -, ==, <, ...)
- **Register:** winzige, extrem schnelle Speicherzellen direkt in der CPU für Zwischenwerte

## Speicherhierarchie
| Speicherart | Geschwindigkeit | Grösse | Flüchtig? |
|---|---|---|---|
| Register (in der CPU) | am schnellsten | winzig | ja |
| Cache | sehr schnell | klein | ja |
| Arbeitsspeicher (RAM) | schnell | mittel | ja |
| Festplatte / SSD | langsamer | gross | **nein** |

> Achtung Prüfung: RAM ist **flüchtig** (volatile) — beim Ausschalten gehen alle nicht gespeicherten Daten verloren. Nur Festplatte/SSD speichern dauerhaft.

## Software: Betriebssystem und Anwendungen
- **Betriebssystem (OS):** verwaltet Hardware-Ressourcen (CPU-Zeit, Speicher, Geräte) und stellt eine Schnittstelle für andere Programme bereit (z. B. Windows, macOS, Linux)
- **Anwendungssoftware:** Programme, die auf dem Betriebssystem laufen (Browser, Textverarbeitung, Spiele)

## Vom Quellcode zum ausführbaren Programm
```
Quellcode (von dir geschrieben, z. B. Python)
        │
        ▼  Übersetzung (Compiler/Interpreter)
        │
Maschinencode (Nullen und Einsen, für die CPU verständlich)
```

- **Compiler:** übersetzt den **gesamten** Quellcode vorab in Maschinencode (z. B. C++)
- **Interpreter:** übersetzt und führt den Code **Zeile für Zeile** direkt aus (z. B. Python)

> Merke: Dass Python ein Interpreter ist, erklärt, warum du Python-Code direkt ausführen kannst, ohne ihn vorher wie bei C++ separat zu "kompilieren".

## Zusammenfassung
$$\text{Eingabegeräte} \to \text{CPU (Steuerwerk + Rechenwerk)} \leftrightarrow \text{Arbeitsspeicher} \to \text{Ausgabegeräte}$$

> Merke: Dieses Grundverständnis des Rechneraufbaus erklärt auch, **warum** Effizienz eine Rolle spielt (Jahr 1: Aufwand/Grössenordnung, Jahr 5: Aufwandsberechnung bei Listenoperationen) — jede Operation kostet CPU-Zeit und Speicherzugriffe.
