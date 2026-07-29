# Suchalgorithmen und Hashing
**Fach:** Informatik | **Klasse:** 5Wa

> ✅ Aus deinen echten OneNote-Notizen (Jahr 5) übernommen und aufbereitet.

## Einfache Suche (simple_search)

Geht die Liste linear durch, bis das gesuchte Element gefunden ist.

```python
def simple_search(liste, e):
    for i in range(len(liste)):
        if e == liste[i]:
            return i
    return -1
```
Aufwand: **2n** (linear).

## Binäre Suche (binary_search)

Voraussetzung: Die Liste muss **sortiert** sein. Der effizienteste und bekannteste Suchalgorithmus.

Idee: Vergleiche den gesuchten Wert `e` mit dem mittleren Element. Je nachdem, ob `e` grösser oder kleiner ist, wird nur noch in der linken bzw. rechten Hälfte weitergesucht — der Suchraum halbiert sich bei jedem Schritt.

```python
def binary_search(liste, e):
    low = 0
    high = len(liste) - 1
    mid = (low + high) // 2
    while low <= high:
        if liste[mid] == e:
            return mid
        elif liste[mid] < e:
            low = mid + 1
        else:
            high = mid - 1
        mid = (low + high) // 2
    return -1
```

> Merke: Weil sich der Suchraum bei jedem Vergleich **halbiert**, braucht binäre Suche nur $\log_2(n)$ Schritte statt n Schritte bei linearer Suche. Bei n = 8 Elementen z. B. $\log_2(8) = 3$ Schritte.

## Hashing

Mit binärer Suche kann man schnell suchen — noch schneller geht es mit **Hashing**, wenn man die Speicheradresse direkt aus dem Dateinamen/Wert berechnen kann.

### Konzept
- **Hashfunktion:** berechnet aus einem Wert direkt die Speicheradresse
- **Hashwert:** die berechnete Adresse

**Beispiel:** 1000 Artikel, Speicher in 1000 Einheiten (0–999) aufgeteilt. Jedem Artikel wird die Speichereinheit zugeordnet, deren Nummer den letzten 3 Ziffern seines EAN-Codes entspricht. EAN `4030538657465` → Speichereinheit **465**.

### Warum nicht die Werte direkt als Adresse nehmen?
Bei sehr vielen möglichen Werten (z. B. 10¹³ EAN-Codes) bräuchte man riesige Mengen an Speichereinheiten, obwohl nur wenige tatsächlich genutzt werden — **Speicherverschwendung**. Deshalb wird der riesige Wertebereich mit einer Hashfunktion auf einen kleineren, praktikablen Adressbereich abgebildet.

### Gute Hashfunktionen
- Vermeiden es, nur ein paar Ziffern direkt aus dem Namen zu übernehmen (kann zu ungleichmässiger Verteilung führen, z. B. Hashing nach Geburtsjahr in einer Klasse)
- Mischen die Ziffern durch Berechnungen (z. B. Summe der Buchstaben-Positionen im Alphabet, geteilt durch eine Zahl, Rest als Hashwert)

**Beispiel (Vornamen hashen):** Buchstabenposition im Alphabet summieren, durch 23 teilen, Rest = Hashwert. Für „ANNA": 1+14+14+1 = 30, 30 : 23 = 1 Rest **7** → Hashwert 7.

### Vor- und Nachteile
- **Vorteil:** Idealfall = 1 Schritt, um ein Element zu finden. Neue Elemente werden ohne Neuberechnung anderer Adressen eingefügt — ideal für sich ständig verändernde Daten
- **Herausforderung:** Eine gute Verteilung auf die Speichereinheiten sicherstellen (Visualisierung mit Säulendiagrammen); der Aufwand einer Suche entspricht der maximalen Anzahl Elemente, die derselben Adresse zugeordnet sind

## Übungsressource
Weitere interaktive Übungen zu Suche und Ordnung: einfachinformatik.inf.ethz.ch/application/searchAndOrder
