const exercitii = [
  // piept
  { id: 1, exercitiu: "Bench press", grupa: "piept", intensitate: "medie", facut: false },
  { id: 2, exercitiu: "Incline bench press", grupa: "piept", intensitate: "intensa", facut: false },
  { id: 3, exercitiu: "Decline bench press", grupa: "piept", intensitate: "medie", facut: false },
  { id: 4, exercitiu: "Dumbbell bench press", grupa: "piept", intensitate: "medie", facut: false },
  { id: 5, exercitiu: "Incline dumbbell press", grupa: "piept", intensitate: "medie", facut: false },
  { id: 6, exercitiu: "Dumbbell fly", grupa: "piept", intensitate: "usoara", facut: false },
  { id: 7, exercitiu: "Cable crossover", grupa: "piept", intensitate: "usoara", facut: false },
  { id: 8, exercitiu: "Push-ups", grupa: "piept", intensitate: "usoara", facut: false },
  { id: 9, exercitiu: "Chest dips", grupa: "piept", intensitate: "intensa", facut: false },
  { id: 10, exercitiu: "Pec deck fly", grupa: "piept", intensitate: "usoara", facut: false },

  // spate
  { id: 11, exercitiu: "Pull-ups", grupa: "spate", intensitate: "intensa", facut: true },
  { id: 12, exercitiu: "Lat pulldown", grupa: "spate", intensitate: "medie", facut: false },
  { id: 13, exercitiu: "Barbell row", grupa: "spate", intensitate: "intensa", facut: false },
  { id: 14, exercitiu: "Dumbbell row", grupa: "spate", intensitate: "medie", facut: false },
  { id: 15, exercitiu: "Seated cable row", grupa: "spate", intensitate: "medie", facut: false },
  { id: 16, exercitiu: "T-bar row", grupa: "spate", intensitate: "intensa", facut: false },
  { id: 17, exercitiu: "Deadlift", grupa: "spate", intensitate: "intensa", facut: false },
  { id: 18, exercitiu: "Chin-ups", grupa: "spate", intensitate: "intensa", facut: false },
  { id: 19, exercitiu: "Straight-arm pulldown", grupa: "spate", intensitate: "usoara", facut: false },
  { id: 20, exercitiu: "Hyperextensions", grupa: "spate", intensitate: "usoara", facut: false },

  // umeri
  { id: 21, exercitiu: "Overhead press", grupa: "umeri", intensitate: "intensa", facut: false },
  { id: 22, exercitiu: "Dumbbell shoulder press", grupa: "umeri", intensitate: "medie", facut: false },
  { id: 23, exercitiu: "Arnold press", grupa: "umeri", intensitate: "medie", facut: false },
  { id: 24, exercitiu: "Lateral raise", grupa: "umeri", intensitate: "usoara", facut: false },
  { id: 25, exercitiu: "Front raise", grupa: "umeri", intensitate: "usoara", facut: false },
  { id: 26, exercitiu: "Rear delt fly", grupa: "umeri", intensitate: "usoara", facut: false },
  { id: 27, exercitiu: "Face pull", grupa: "umeri", intensitate: "usoara", facut: false },
  { id: 28, exercitiu: "Upright row", grupa: "umeri", intensitate: "medie", facut: false },
  { id: 29, exercitiu: "Machine shoulder press", grupa: "umeri", intensitate: "usoara", facut: false },
  { id: 30, exercitiu: "Barbell shrug", grupa: "umeri", intensitate: "medie", facut: false },

  // biceps
  { id: 31, exercitiu: "Barbell curl", grupa: "biceps", intensitate: "medie", facut: false },
  { id: 32, exercitiu: "Dumbbell curl", grupa: "biceps", intensitate: "usoara", facut: false },
  { id: 33, exercitiu: "Hammer curl", grupa: "biceps", intensitate: "usoara", facut: false },
  { id: 34, exercitiu: "Preacher curl", grupa: "biceps", intensitate: "medie", facut: false },
  { id: 35, exercitiu: "Concentration curl", grupa: "biceps", intensitate: "usoara", facut: false },
  { id: 36, exercitiu: "Incline dumbbell curl", grupa: "biceps", intensitate: "medie", facut: false },
  { id: 37, exercitiu: "Cable curl", grupa: "biceps", intensitate: "usoara", facut: false },
  { id: 38, exercitiu: "EZ-bar curl", grupa: "biceps", intensitate: "medie", facut: false },
  { id: 39, exercitiu: "Spider curl", grupa: "biceps", intensitate: "usoara", facut: false },
  { id: 40, exercitiu: "Reverse curl", grupa: "biceps", intensitate: "usoara", facut: false },

  // triceps
  { id: 41, exercitiu: "Close-grip bench press", grupa: "triceps", intensitate: "intensa", facut: false },
  { id: 42, exercitiu: "Triceps pushdown", grupa: "triceps", intensitate: "usoara", facut: false },
  { id: 43, exercitiu: "Skull crushers", grupa: "triceps", intensitate: "medie", facut: false },
  { id: 44, exercitiu: "Overhead triceps extension", grupa: "triceps", intensitate: "medie", facut: false },
  { id: 45, exercitiu: "Triceps dips", grupa: "triceps", intensitate: "intensa", facut: false },
  { id: 46, exercitiu: "Bench dips", grupa: "triceps", intensitate: "usoara", facut: false },
  { id: 47, exercitiu: "Triceps kickback", grupa: "triceps", intensitate: "usoara", facut: false },
  { id: 48, exercitiu: "Diamond push-ups", grupa: "triceps", intensitate: "medie", facut: false },
  { id: 49, exercitiu: "Rope pushdown", grupa: "triceps", intensitate: "usoara", facut: false },
  { id: 50, exercitiu: "Cable overhead extension", grupa: "triceps", intensitate: "medie", facut: false },

  // antebrate
  { id: 51, exercitiu: "Wrist curl", grupa: "antebrate", intensitate: "usoara", facut: false },
  { id: 52, exercitiu: "Reverse wrist curl", grupa: "antebrate", intensitate: "usoara", facut: false },
  { id: 53, exercitiu: "Farmer's walk", grupa: "antebrate", intensitate: "medie", facut: false },
  { id: 54, exercitiu: "Dead hang", grupa: "antebrate", intensitate: "medie", facut: false },
  { id: 55, exercitiu: "Plate pinch", grupa: "antebrate", intensitate: "medie", facut: false },
  { id: 56, exercitiu: "Zottman curl", grupa: "antebrate", intensitate: "medie", facut: false },
  { id: 57, exercitiu: "Wrist roller", grupa: "antebrate", intensitate: "medie", facut: false },
  { id: 58, exercitiu: "Towel pull-ups", grupa: "antebrate", intensitate: "intensa", facut: false },
  { id: 59, exercitiu: "Behind-the-back wrist curl", grupa: "antebrate", intensitate: "usoara", facut: false },
  { id: 60, exercitiu: "Gripper squeeze", grupa: "antebrate", intensitate: "usoara", facut: false },

  // abdomen
  { id: 61, exercitiu: "Crunches", grupa: "abdomen", intensitate: "usoara", facut: false },
  { id: 62, exercitiu: "Plank", grupa: "abdomen", intensitate: "medie", facut: false },
  { id: 63, exercitiu: "Hanging leg raise", grupa: "abdomen", intensitate: "intensa", facut: false },
  { id: 64, exercitiu: "Russian twist", grupa: "abdomen", intensitate: "medie", facut: false },
  { id: 65, exercitiu: "Bicycle crunch", grupa: "abdomen", intensitate: "usoara", facut: false },
  { id: 66, exercitiu: "Cable crunch", grupa: "abdomen", intensitate: "medie", facut: false },
  { id: 67, exercitiu: "Ab wheel rollout", grupa: "abdomen", intensitate: "intensa", facut: false },
  { id: 68, exercitiu: "Mountain climbers", grupa: "abdomen", intensitate: "medie", facut: false },
  { id: 69, exercitiu: "Leg raises", grupa: "abdomen", intensitate: "medie", facut: false },
  { id: 70, exercitiu: "Side plank", grupa: "abdomen", intensitate: "medie", facut: false },

  // cvadricepsi
  { id: 71, exercitiu: "Squats", grupa: "cvadricepsi", intensitate: "usoara", facut: false },
  { id: 72, exercitiu: "Front squat", grupa: "cvadricepsi", intensitate: "intensa", facut: false },
  { id: 73, exercitiu: "Leg press", grupa: "cvadricepsi", intensitate: "medie", facut: false },
  { id: 74, exercitiu: "Leg extension", grupa: "cvadricepsi", intensitate: "usoara", facut: false },
  { id: 75, exercitiu: "Lunges", grupa: "cvadricepsi", intensitate: "medie", facut: false },
  { id: 76, exercitiu: "Bulgarian split squat", grupa: "cvadricepsi", intensitate: "intensa", facut: false },
  { id: 77, exercitiu: "Hack squat", grupa: "cvadricepsi", intensitate: "intensa", facut: false },
  { id: 78, exercitiu: "Goblet squat", grupa: "cvadricepsi", intensitate: "usoara", facut: false },
  { id: 79, exercitiu: "Step-ups", grupa: "cvadricepsi", intensitate: "medie", facut: false },
  { id: 80, exercitiu: "Sissy squat", grupa: "cvadricepsi", intensitate: "medie", facut: false },

  // ischiogambieri
  { id: 81, exercitiu: "Romanian deadlift", grupa: "ischiogambieri", intensitate: "intensa", facut: false },
  { id: 82, exercitiu: "Lying leg curl", grupa: "ischiogambieri", intensitate: "usoara", facut: false },
  { id: 83, exercitiu: "Seated leg curl", grupa: "ischiogambieri", intensitate: "usoara", facut: false },
  { id: 84, exercitiu: "Good morning", grupa: "ischiogambieri", intensitate: "intensa", facut: false },
  { id: 85, exercitiu: "Stiff-leg deadlift", grupa: "ischiogambieri", intensitate: "intensa", facut: false },
  { id: 86, exercitiu: "Nordic hamstring curl", grupa: "ischiogambieri", intensitate: "intensa", facut: false },
  { id: 87, exercitiu: "Single-leg Romanian deadlift", grupa: "ischiogambieri", intensitate: "medie", facut: false },
  { id: 88, exercitiu: "Cable pull-through", grupa: "ischiogambieri", intensitate: "medie", facut: false },
  { id: 89, exercitiu: "Glute-ham raise", grupa: "ischiogambieri", intensitate: "intensa", facut: false },
  { id: 90, exercitiu: "Dumbbell Romanian deadlift", grupa: "ischiogambieri", intensitate: "medie", facut: false },

  // fesieri
  { id: 91, exercitiu: "Hip thrust", grupa: "fesieri", intensitate: "intensa", facut: false },
  { id: 92, exercitiu: "Glute bridge", grupa: "fesieri", intensitate: "usoara", facut: false },
  { id: 93, exercitiu: "Cable kickback", grupa: "fesieri", intensitate: "usoara", facut: false },
  { id: 94, exercitiu: "Sumo deadlift", grupa: "fesieri", intensitate: "intensa", facut: false },
  { id: 95, exercitiu: "Walking lunges", grupa: "fesieri", intensitate: "medie", facut: false },
  { id: 96, exercitiu: "Reverse lunge", grupa: "fesieri", intensitate: "medie", facut: false },
  { id: 97, exercitiu: "Frog pumps", grupa: "fesieri", intensitate: "usoara", facut: false },
  { id: 98, exercitiu: "Donkey kicks", grupa: "fesieri", intensitate: "usoara", facut: false },
  { id: 99, exercitiu: "Hip abduction machine", grupa: "fesieri", intensitate: "usoara", facut: false },
  { id: 100, exercitiu: "Curtsy lunge", grupa: "fesieri", intensitate: "medie", facut: false },

  // gambe
  { id: 101, exercitiu: "Standing calf raise", grupa: "gambe", intensitate: "medie", facut: false },
  { id: 102, exercitiu: "Seated calf raise", grupa: "gambe", intensitate: "usoara", facut: false },
  { id: 103, exercitiu: "Donkey calf raise", grupa: "gambe", intensitate: "medie", facut: false },
  { id: 104, exercitiu: "Leg press calf raise", grupa: "gambe", intensitate: "medie", facut: false },
  { id: 105, exercitiu: "Single-leg calf raise", grupa: "gambe", intensitate: "usoara", facut: false },
  { id: 106, exercitiu: "Smith machine calf raise", grupa: "gambe", intensitate: "medie", facut: false },
  { id: 107, exercitiu: "Jump rope", grupa: "gambe", intensitate: "usoara", facut: false },
  { id: 108, exercitiu: "Tibialis raise", grupa: "gambe", intensitate: "usoara", facut: false },
  { id: 109, exercitiu: "Calf press machine", grupa: "gambe", intensitate: "medie", facut: false },
  { id: 110, exercitiu: "Farmer's walk on toes", grupa: "gambe", intensitate: "medie", facut: false },
];

// Valorile permise pentru etichetele fixe
const GRUPE = ["piept", "spate", "umeri", "biceps", "triceps", "antebrate", "abdomen", "cvadricepsi", "ischiogambieri", "fesieri", "gambe"];
const INTENSITATI = ["usoara", "medie", "intensa"];

// READ: listarea exercițiilor
function listeazaExercitii(lista) {
  return lista.map((e) => e.exercitiu);
}

// READ: numărarea exercițiilor de făcut
function numaraDeFacut(lista) {
  return lista.filter((e) => !e.facut).length;
}

// READ: căutarea după nume sau grupă (fără diferență între litere mari și mici)
function cautaExercitii(lista, text) {
  const t = text.toLowerCase();
  return lista.filter(
    (e) => e.exercitiu.toLowerCase().includes(t) || e.grupa.toLowerCase().includes(t)
  );
}

// Ajutor pentru CREATE: id nou = maximul existent + 1
function nextId(lista) {
  return lista.reduce((max, e) => Math.max(max, e.id), 0) + 1;
}

// CREATE: adăugarea cu validare
function adaugaExercitiu(lista, exercitiu, grupa = "piept", intensitate = "medie") {
  const numeCurat = exercitiu.trim();
  if (numeCurat === "") {
    console.log("Numele exercițiului nu poate fi gol.");
    return lista;
  }
  if (!GRUPE.includes(grupa)) {
    console.log("Grupă musculară invalidă:", grupa);
    return lista;
  }
  if (!INTENSITATI.includes(intensitate)) {
    console.log("Intensitate invalidă:", intensitate);
    return lista;
  }
  const nou = {
    id: nextId(lista),
    exercitiu: numeCurat,
    grupa: grupa,
    intensitate: intensitate,
    facut: false,
  };
  return [...lista, nou];
}

// UPDATE: comutarea stării (map + copie a obiectului)
function comutaFacut(lista, id) {
  return lista.map((e) => (e.id === id ? { ...e, facut: !e.facut } : e));
}

// DELETE: ștergerea (filter)
function stergeExercitiu(lista, id) {
  return lista.filter((e) => e.id !== id);
}

// Testele din consolă
console.log("--- Citire ---");
console.log("Total exerciții:", listeazaExercitii(exercitii).length);
console.log("De făcut:", numaraDeFacut(exercitii));
console.log("Căutare 'bench':", listeazaExercitii(cautaExercitii(exercitii, "bench")).join(", "));
console.log("Căutare 'biceps':", listeazaExercitii(cautaExercitii(exercitii, "biceps")).join(", "));

console.log("--- Adăugare ---");
let lista = adaugaExercitiu(exercitii, "Cable fly", "piept", "usoara");
console.log("Lista nouă:", lista.length, "exerciții");
console.log("Originalul a rămas cu:", exercitii.length, "exerciții");

console.log("--- Modificare și ștergere ---");
lista = comutaFacut(lista, 1);
console.log("După bifarea id 1, de făcut:", numaraDeFacut(lista));
lista = stergeExercitiu(lista, 3);
console.log("După ștergerea id 3, total:", lista.length, "exerciții");

console.log("--- Validare ---");
adaugaExercitiu(lista, "   ");
adaugaExercitiu(lista, "Ceva", "cap");
adaugaExercitiu(lista, "Ceva", "piept", "urgenta");