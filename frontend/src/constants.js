// Valorile fixe și etichetele lor, într-un singur loc.
// Valorile (value) trebuie să fie exact cele din db.json.

// Grupele musculare, în ordinea din bara de categorii
export const GRUPE = [
  { value: "piept", label: "Piept" },
  { value: "spate", label: "Spate" },
  { value: "umeri", label: "Umeri" },
  { value: "biceps", label: "Biceps" },
  { value: "triceps", label: "Triceps" },
  { value: "antebrate", label: "Antebrațe" },
  { value: "abdomen", label: "Abdomen" },
  { value: "cvadricepsi", label: "Cvadricepși" },
  { value: "ischiogambieri", label: "Ischiogambieri" },
  { value: "fesieri", label: "Fesieri" },
  { value: "gambe", label: "Gambe" },
  { value: "gat", label: "Gât" },
  { value: "cardio", label: "Cardio" },
];

export const INTENSITATI = [
  { value: "usoara", label: "Ușoară" },
  { value: "medie", label: "Medie" },
  { value: "intensa", label: "Intensă" },
];

// { piept: "Piept", spate: "Spate", ... }
export const ETICHETE_GRUPE = Object.fromEntries(
  GRUPE.map((g) => [g.value, g.label])
);

// Etichetele apar după cuvântul „Intensitate”, deci cu literă mică
export const ETICHETE_INTENSITATE = {
  usoara: "ușoară",
  medie: "medie",
  intensa: "intensă",
};

// Iconița grupei (fișiere SVG din public/muscles)
export function iconGrupa(grupa) {
  return `/muscles/${grupa}.svg`;
}

// Traduceri pentru câmpurile din catalog (datele vin în engleză)
export const ECHIPAMENT = {
  Barbell: "Bară",
  Dumbbell: "Gantere",
  Cable: "Cablu",
  "Leverage machine": "Aparat cu pârghie",
  "Body weight": "Greutatea corpului",
  "Sled machine": "Aparat sanie",
  "Smith machine": "Aparat Smith",
  "EZ Barbell": "Bară EZ",
  Kettlebell: "Kettlebell",
  Band: "Bandă elastică",
  "Resistance Band": "Bandă elastică",
  "Stability ball": "Minge de fitness",
  Weighted: "Cu greutate",
  Rope: "Coardă",
  "Medicine Ball": "Minge medicinală",
  Assisted: "Asistat",
  "Trap bar": "Bară hexagonală",
  Suspension: "Benzi de suspensie",
  Roller: "Roller",
};

export const PARTI_CORP = {
  Chest: "Piept",
  Back: "Spate",
  Shoulders: "Umeri",
  Biceps: "Biceps",
  Triceps: "Triceps",
  "Upper Arms": "Brațe",
  Forearms: "Antebrațe",
  Waist: "Abdomen",
  Hips: "Fesieri",
  Quadriceps: "Cvadricepși",
  Hamstrings: "Ischiogambieri",
  Thighs: "Coapse",
  Calves: "Gambe",
  Neck: "Gât",
  Cardio: "Cardio",
};

// "Barbell, Dumbbell" -> "Bară, Gantere"; un termen necunoscut rămâne în engleză
export function traduce(text, dictionar) {
  return text
    .split(", ")
    .map((t) => dictionar[t] ?? t)
    .join(", ");
}
