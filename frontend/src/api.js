// Toate cererile HTTP stau aici; componentele nu apelează fetch direct.
export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

// Funcție comună: trimite JSON și aruncă eroare dacă răspunsul nu este 2xx
async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  if (!res.ok) {
    const err = new Error(`Eroare server: ${res.status}`);
    err.status = res.status; // interfața construiește mesajul în limba aleasă
    throw err;
  }
  // 204 No Content nu are corp
  return res.status === 204 ? null : res.json();
}

export function fetchExercitii() {
  return request("/exercitii");
}

// Etapa 8: un singur exercițiu, pentru pagina de detaliu
export function fetchExercitiu(id) {
  return request(`/exercitii/${id}`);
}

export function createExercitiu(exercitiu) {
  return request("/exercitii", {
    method: "POST",
    body: JSON.stringify(exercitiu),
  });
}

export function updateExercitiu(id, changes) {
  return request(`/exercitii/${id}`, {
    method: "PATCH",
    body: JSON.stringify(changes),
  });
}

export function deleteExercitiu(id) {
  return request(`/exercitii/${id}`, { method: "DELETE" });
}

// Istoricul: o intrare pentru fiecare exercițiu terminat, cu data.
// Din el se calculează statisticile și harta musculară.
export function fetchIstoric() {
  return request("/istoric");
}

export function createIstoric(intrare) {
  return request("/istoric", {
    method: "POST",
    body: JSON.stringify(intrare),
  });
}

// Când un exercițiu din jurnal devine „făcut”, se notează în istoric.
// O eroare aici nu oprește bifarea: istoricul este doar pentru statistici.
export async function noteazaInIstoric(exercitiu, serii = null) {
  try {
    await createIstoric({
      exercitiuId: exercitiu.id,
      catalogId: exercitiu.catalogId ?? null,
      exercitiu: exercitiu.exercitiu,
      grupa: exercitiu.grupa,
      serii,
      data: new Date().toISOString(),
    });
  } catch {
    // fără istoric, statisticile nu includ acest exercițiu
  }
}
