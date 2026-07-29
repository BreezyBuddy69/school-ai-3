# Lagemasse und Streuung

## Lagemasse (Mitte einer Verteilung)
- **Arithmetisches Mittel (Durchschnitt)**: Summe aller Werte / Anzahl — empfindlich gegen Ausreisser
- **Median**: mittlerer Wert einer sortierten Reihe (bei gerader Anzahl: Mittel der beiden mittleren Werte) — robust gegen Ausreisser
- **Modus**: häufigster Wert

## Beispiel
Werte: 2, 3, 3, 5, 100
- Mittelwert = (2+3+3+5+100)/5 = 22.6 (verzerrt durch Ausreisser 100!)
- Median = 3 (viel repräsentativer hier)
- Modus = 3

## Streuungsmasse (wie weit streuen die Werte?)
- **Spannweite** = Max − Min
- **Varianz** = mittlere quadratische Abweichung vom Mittelwert
- **Standardabweichung** = √Varianz — in derselben Einheit wie die Daten, daher am gebräuchlichsten

## Boxplot
Zeigt Median, Quartile (Q1, Q3) und Ausreisser auf einen Blick:
- Box = Bereich zwischen Q1 und Q3 (mittlere 50% der Daten)
- Linie in der Box = Median
- "Whiskers" = Rest der Daten ohne Ausreisser

## Wichtig für Interpretation
Zwei Datensätze können denselben Mittelwert haben, aber völlig unterschiedliche Streuung — deshalb nie nur den Mittelwert allein betrachten.
