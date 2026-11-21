// Toate cererile HTTP stau aici; componentele nu apelează fetch direct.
export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

// Funcție comună: trimite JSON și aruncă eroare dacă răspunsul nu este 2xx
async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  if (!res.ok) {
    throw new Error(`Eroare server: ${res.status}`);
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
