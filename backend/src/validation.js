// Validare pe server: datele de la client nu sunt niciodată de încredere.
// Valorile fixe trebuie să fie identice cu cele din frontend/src/constants.js.
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
const EXERCITIU_MAX = 60; // aceeași limită ca în ExercitiuForm.jsx
const CATALOG_ID_MAX = 100;

// Numele exercițiului: text nevid, cel mult EXERCITIU_MAX caractere
function verificaNume(valoare, erori, date) {
  if (typeof valoare !== "string" || valoare.trim() === "") {
    erori.push("exercitiu este obligatoriu");
  } else if (valoare.trim().length > EXERCITIU_MAX) {
    erori.push(`exercitiu are maximum ${EXERCITIU_MAX} de caractere`);
  } else {
    date.exercitiu = valoare.trim();
  }
}

function verificaGrupa(valoare, erori, date) {
  if (!GRUPE.includes(valoare)) {
    erori.push(`grupa trebuie să fie una din: ${GRUPE.join(", ")}`);
  } else {
    date.grupa = valoare;
  }
}

// catalogId leagă intrarea de catalogul din frontend; lipsește la exercițiile manuale
function verificaCatalogId(valoare, erori, date) {
  if (valoare === null) {
    date.catalogId = null;
  } else if (typeof valoare !== "string" || valoare.trim() === "" || valoare.length > CATALOG_ID_MAX) {
    erori.push("catalogId trebuie să fie text sau null");
  } else {
    date.catalogId = valoare.trim();
  }
}

// Exercițiu din jurnal: { exercitiu, intensitate, grupa, facut, catalogId? }
// partial = true pentru PATCH (se verifică doar câmpurile trimise)
export function valideazaExercitiu(body, { partial = false } = {}) {
  const erori = [];
  const date = {};

  if (!partial || body.exercitiu !== undefined) {
    verificaNume(body.exercitiu, erori, date);
  }

  if (!partial || body.intensitate !== undefined) {
    const i = body.intensitate ?? "medie";
    if (!INTENSITATI.includes(i)) {
      erori.push(`intensitate trebuie să fie una din: ${INTENSITATI.join(", ")}`);
    } else {
      date.intensitate = i;
    }
  }

  if (!partial || body.grupa !== undefined) {
    verificaGrupa(body.grupa, erori, date);
  }

  if (body.facut !== undefined) {
    if (typeof body.facut !== "boolean") {
      erori.push("facut trebuie să fie true sau false");
    } else {
      date.facut = body.facut;
    }
  } else if (!partial) {
    date.facut = false;
  }

  if (body.catalogId !== undefined) {
    verificaCatalogId(body.catalogId, erori, date);
  }

  return { erori, date };
}

// Intrare de istoric (un exercițiu terminat), trimisă de intrareIstoric() din api.js:
// { exercitiuId, catalogId, exercitiu, grupa, serii, seturi?, data }
export function valideazaIstoric(body) {
  const erori = [];
  const date = {};

  verificaNume(body.exercitiu, erori, date);
  verificaGrupa(body.grupa, erori, date);

  if (body.exercitiuId === undefined || body.exercitiuId === null) {
    date.exercitiuId = null;
  } else if (!Number.isInteger(body.exercitiuId) || body.exercitiuId <= 0) {
    erori.push("exercitiuId trebuie să fie un număr întreg pozitiv");
  } else {
    date.exercitiuId = body.exercitiuId;
  }

  verificaCatalogId(body.catalogId ?? null, erori, date);

  if (body.seturi !== undefined) {
    const bune =
      Array.isArray(body.seturi) &&
      body.seturi.length > 0 &&
      body.seturi.length <= 50 &&
      body.seturi.every(
        (s) =>
          s &&
          typeof s.kg === "number" &&
          Number.isFinite(s.kg) &&
          s.kg >= 0 &&
          s.kg <= 1000 &&
          Number.isInteger(s.rep) &&
          s.rep > 0 &&
          s.rep <= 1000,
      );
    if (!bune) {
      erori.push("seturi trebuie să fie o listă de { kg, rep }, cu kg >= 0 și rep întreg > 0");
    } else {
      date.seturi = body.seturi.map((s) => ({ kg: s.kg, rep: s.rep }));
    }
  }

  if (body.serii === undefined || body.serii === null) {
    date.serii = date.seturi ? date.seturi.length : null;
  } else if (!Number.isInteger(body.serii) || body.serii < 0 || body.serii > 50) {
    erori.push("serii trebuie să fie un număr întreg între 0 și 50");
  } else {
    date.serii = body.serii;
  }

  if (body.data === undefined) {
    date.data = new Date().toISOString();
  } else if (typeof body.data !== "string" || Number.isNaN(Date.parse(body.data))) {
    erori.push("data trebuie să fie o dată validă (ISO)");
  } else {
    date.data = new Date(body.data).toISOString();
  }

  return { erori, date };
}

// Id-urile din adresă vin ca text; se acceptă doar numere întregi pozitive
export function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}
