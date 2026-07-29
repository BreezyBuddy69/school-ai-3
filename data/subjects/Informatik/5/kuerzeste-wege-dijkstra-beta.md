# Kürzeste Wege: Dijkstra-Algorithmus und A*
**Fach:** Informatik | **Klasse:** 5Wa

> 🧪 **Beta** — nicht in deinen OneNote-Notizen/Zusammenfassungen von Jahr 5 gefunden (nur als Lernziel-Stichworte vermerkt, ohne ausformulierten Inhalt). Aus dem offiziellen LG-Lehrplan + ergänzender Recherche erstellt. Ersetzen/ergänzen, sobald echte Notizen vorliegen.

## Eulerwege

Ein **Eulerweg** ist ein Weg in einem Graphen, der **jede Kante genau einmal** benutzt (im Unterschied zum Hamilton'schen Weg, der jeden *Knoten* genau einmal besucht). Ein Graph besitzt genau dann einen Eulerweg, wenn er zusammenhängend ist und höchstens zwei Knoten mit ungeradem Grad (ungerade Anzahl anliegender Kanten) besitzt.

## Der Dijkstra-Algorithmus

Findet den **kürzesten Weg** von einem Startknoten zu allen anderen Knoten in einem gewichteten Graphen (Kanten haben Längen/Kosten).

**Grundidee:**
1. Jedem Knoten wird eine vorläufige Distanz zugewiesen: 0 für den Startknoten, ∞ für alle anderen
2. Der Startknoten wird als „besucht" markiert
3. Für alle Nachbarn des aktuellen Knotens wird geprüft, ob der Weg über den aktuellen Knoten kürzer ist als die bisher bekannte Distanz — falls ja, wird die Distanz aktualisiert
4. Von den noch unbesuchten Knoten wird derjenige mit der kleinsten Distanz zum nächsten aktuellen Knoten
5. Wiederholen, bis alle Knoten besucht sind (oder der Zielknoten erreicht ist)

**Aufwand:** In der einfachen Variante ohne besondere Datenstruktur ungefähr $O(n^2)$, wobei n die Anzahl Knoten ist — deutlich effizienter als Brute-Force (Ausprobieren aller möglichen Wege).

## Der A*-Algorithmus

Eine Erweiterung von Dijkstra: Zusätzlich zur bisher zurückgelegten Distanz wird eine **Schätzung (Heuristik)** der noch verbleibenden Distanz zum Ziel einbezogen (z. B. die Luftlinie bei einer Landkarte). Dadurch werden vielversprechende Richtungen zuerst untersucht, was A* in der Praxis meist schneller macht als Dijkstra — vorausgesetzt, die Heuristik unterschätzt die tatsächliche Distanz nie ("zulässige Heuristik").

| | Dijkstra | A* |
|---|---|---|
| Nutzt Heuristik? | Nein | Ja |
| Findet garantiert kürzesten Weg? | Ja | Ja (bei zulässiger Heuristik) |
| Typische Geschwindigkeit | langsamer | schneller (weniger Knoten untersucht) |
