// Valorile fixe, într-un singur loc. Valorile trebuie să fie exact cele din db.json.
// Etichetele lor (în română și engleză) sunt în i18n/texte.js.

// Grupele musculare, în ordinea din bara de categorii
export const GRUPE = [
  "piept",
  "spate",
  "umeri",
  "biceps",
  "triceps",
  "antebrate",
  "abdomen",
  "cvadricepsi",
  "ischiogambieri",
  "fesieri",
  "gambe",
  "gat",
  "cardio",
];

export const INTENSITATI = ["usoara", "medie", "intensa"];

// Iconița grupei (fișiere SVG din public/muscles)
export function iconGrupa(grupa) {
  return `/muscles/${grupa}.svg`;
}
