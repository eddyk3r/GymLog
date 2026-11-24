import { Router } from "express";
import { valideazaIstoric } from "../validation.js";

const router = Router();

// Istoricul exercițiilor terminate (pentru statistici, harta musculară și progres).
// Pornește gol: se numără doar ce adaugă utilizatorul. Tot în memorie până la Etapa 10.
const istoric = [];
let nextId = 1;

// GET /istoric
router.get("/", (req, res) => {
  res.json(istoric);
});

// POST /istoric
router.post("/", (req, res) => {
  const { erori, date } = valideazaIstoric(req.body ?? {});
  if (erori.length > 0) {
    return res.status(400).json({ error: erori.join("; ") });
  }
  const intrare = { id: nextId++, ...date };
  istoric.push(intrare);
  res.status(201).json(intrare);
});

export default router;
