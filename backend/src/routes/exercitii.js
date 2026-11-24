import { Router } from "express";
import { parseId, valideazaExercitiu } from "../validation.js";

const router = Router();

// Etapa 9: datele stau în memorie și se pierd la repornire (Etapa 10 le mută în MariaDB).
// Pornim cu intrările care erau în frontend/db.json, legate de catalog prin catalogId.
let exercitii = [
  { id: 1, exercitiu: "Incline Bench Press", intensitate: "medie", grupa: "piept", facut: false, catalogId: "incline-bench-press" },
  { id: 2, exercitiu: "Lever Seated Fly", intensitate: "medie", grupa: "piept", facut: true, catalogId: "lever-seated-fly" },
  { id: 3, exercitiu: "Seated Shoulder Press", intensitate: "medie", grupa: "umeri", facut: true, catalogId: "seated-shoulder-press" },
  { id: 4, exercitiu: "Lateral Raise", intensitate: "medie", grupa: "umeri", facut: true, catalogId: "lateral-raise" },
  { id: 5, exercitiu: "Lever Seated Reverse Fly", intensitate: "medie", grupa: "umeri", facut: false, catalogId: "lever-seated-reverse-fly" },
  { id: 6, exercitiu: "Triceps Pushdown", intensitate: "medie", grupa: "triceps", facut: false, catalogId: "triceps-pushdown" },
  { id: 7, exercitiu: "Overhead Triceps Extension", intensitate: "medie", grupa: "triceps", facut: false, catalogId: "overhead-triceps-extension" },
];
let nextId = 8;

// Validează :id și găsește elementul, sau răspunde cu 400 / 404
function gasesteIndex(req, res) {
  const id = parseId(req.params.id);
  if (!id) {
    res.status(400).json({ error: "Id invalid" });
    return -1;
  }
  const index = exercitii.findIndex((e) => e.id === id);
  if (index === -1) {
    res.status(404).json({ error: "Exercițiul nu există" });
  }
  return index;
}

// GET /exercitii
router.get("/", (req, res) => {
  res.json(exercitii);
});

// GET /exercitii/:id
router.get("/:id", (req, res) => {
  const index = gasesteIndex(req, res);
  if (index === -1) return;
  res.json(exercitii[index]);
});

// POST /exercitii (id-ul îl dă serverul; un id trimis de client este ignorat)
router.post("/", (req, res) => {
  const { erori, date } = valideazaExercitiu(req.body ?? {});
  if (erori.length > 0) {
    return res.status(400).json({ error: erori.join("; ") });
  }
  const exercitiu = { id: nextId++, ...date };
  exercitii.push(exercitiu);
  res.status(201).json(exercitiu);
});

// PATCH /exercitii/:id (modificare parțială, de exemplu { facut: true })
router.patch("/:id", (req, res) => {
  const index = gasesteIndex(req, res);
  if (index === -1) return;
  const { erori, date } = valideazaExercitiu(req.body ?? {}, { partial: true });
  if (erori.length > 0) {
    return res.status(400).json({ error: erori.join("; ") });
  }
  exercitii[index] = { ...exercitii[index], ...date };
  res.json(exercitii[index]);
});

// DELETE /exercitii/:id
router.delete("/:id", (req, res) => {
  const index = gasesteIndex(req, res);
  if (index === -1) return;
  exercitii.splice(index, 1);
  res.status(204).end();
});

export default router;
