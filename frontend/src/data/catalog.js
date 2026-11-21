// Catalogul de exerciții preadăugate (imagini și video de pe lyfta.app).
// Este o listă fixă, de referință: nu se modifică din aplicație, deci nu stă pe server.
// Pe server (db.json) stă doar jurnalul utilizatorului; un element din jurnal
// adăugat din catalog păstrează legătura prin câmpul catalogId.
import date from "./catalog.json";

const IMAGINI = "https://lyfta.app/images/exercises/";
const VIDEO = "https://apilyfta.com/static/GymvisualMP4/";
const POSTERE = "https://www.lyfta.app/thumbnails/";

export const CATALOG = date.map((e) => ({
  ...e,
  imagine: `${IMAGINI}${e.img}.png`,
  videoUrl: `${VIDEO}${e.video}`,
  poster: `${POSTERE}${e.video.slice(0, 8)}.jpg`,
}));

const DUPA_ID = new Map(CATALOG.map((e) => [e.id, e]));
const DUPA_NUME = new Map(CATALOG.map((e) => [e.nume.toLowerCase(), e]));

// Câte exerciții are fiecare grupă: { piept: 18, spate: 17, ... }
export const NUMAR_PE_GRUPA = CATALOG.reduce((acc, e) => {
  acc[e.grupa] = (acc[e.grupa] ?? 0) + 1;
  return acc;
}, {});

export function gasesteInCatalog(id) {
  return DUPA_ID.get(id) ?? null;
}

// Pentru un element din jurnal: după catalogId sau, la cele scrise de mână,
// după nume (dacă cineva a scris exact „Bench Press”, primește și video-ul).
export function catalogPentru(exercitiu) {
  if (exercitiu.catalogId) return gasesteInCatalog(exercitiu.catalogId);
  return DUPA_NUME.get(exercitiu.exercitiu.trim().toLowerCase()) ?? null;
}
