// Fach-Vokabeln für den Typewriter auf der Neuer-Chat-Seite — dieselben
// Fach-Keys wie SUBJECT_GLYPHS in utils.ts (fs.readdirSync(data/subjects)).
export const SUBJECT_WORDS: Record<string, string[]> = {
  Mathematik: ['Parabeln', 'Gleichungen', 'Wurzeln', 'Ableitungen', 'Vektoren', 'Wahrscheinlichkeit', 'Integrale'],
  Biologie: ['Zellteilung', 'Photosynthese', 'Enzyme', 'Ökosysteme', 'Genetik', 'Evolution', 'Neuronen'],
  Geschichte: ['Revolutionen', 'Weltkriege', 'Kalter Krieg', 'Reformation', 'Kolonialismus', 'Absolutismus'],
  Deutsch: ['Metaphern', 'Interpretation', 'Rhetorik', 'Novellen', 'Argumentation', 'Stilmittel'],
  Englisch: ['Vocabulary', 'Grammar', 'Essays', 'Idioms', 'Literature', 'Debate'],
  Franzoesisch: ['Grammaire', 'Vokabeln', 'Konjugation', 'Dialoge', 'Aussprache'],
  Physik: ['Elektrizität', 'Mechanik', 'Optik', 'Thermodynamik', 'Kräfte', 'Wellen'],
  Chemie: ['Moleküle', 'Reaktionen', 'Säuren', 'Bindungen', 'Periodensystem', 'Katalysatoren'],
  Informatik: ['Algorithmen', 'Rekursion', 'Datenbanken', 'Bubblesort', 'Netzwerke', 'Schleifen'],
  Philosophie: ['Ethik', 'Erkenntnistheorie', 'Logik', 'Existenzialismus', 'Gerechtigkeit'],
  Statistik: ['Varianz', 'Median', 'Regression', 'Verteilung', 'Stichproben', 'Korrelation'],
  Geografie: ['Tektonik', 'Klimazonen', 'Erosion', 'Urbanisierung', 'Kontinente'],
  'Wirtschaft und Recht': ['Angebot', 'Nachfrage', 'Verträge', 'Inflation', 'Bilanzen', 'Grundrechte'],
  Kunsterziehung: ['Perspektive', 'Farblehre', 'Komposition', 'Schattierung', 'Collage'],
  Musikerziehung: ['Harmonie', 'Rhythmus', 'Notenlehre', 'Intervalle', 'Tonleitern'],
  'Religion und Kultur': ['Weltbilder', 'Ethik', 'Rituale', 'Symbole', 'Traditionen'],
}

export const FALLBACK_WORDS = ['Verstehen', 'Wiederholen', 'Üben', 'Merken', 'Anwenden', 'Durchblick']

export function subjectWords(subject: string): string[] {
  return SUBJECT_WORDS[subject] ?? FALLBACK_WORDS
}
