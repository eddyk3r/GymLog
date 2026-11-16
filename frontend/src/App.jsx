import { useEffect, useState } from "react";
import ExercitiuList from "./components/ExercitiuList.jsx";
import ExercitiuForm from "./components/ExercitiuForm.jsx";
import {
  createExercitiu,
  deleteExercitiu,
  fetchExercitii,
  updateExercitiu,
} from "./api.js";

// Tema de pornire: cea a sistemului de operare
function temaInitiala() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export default function App() {
  const [exercitii, setExercitii] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tema, setTema] = useState(temaInitiala);

  // Rulează o singură dată, după prima randare
  useEffect(() => {
    let ignore = false; // nu se setează state dacă pagina s-a închis între timp

    async function load() {
      try {
        const data = await fetchExercitii();
        if (!ignore) setExercitii(data);
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  // Întâi serverul, apoi state-ul: pe ecran ajunge doar ce s-a salvat.
  // Fără try: eroarea ajunge înapoi în formular, care o afișează lângă câmpuri.
  async function handleAdd(exercitiu) {
    const creat = await createExercitiu(exercitiu); // serverul întoarce elementul cu id
    setExercitii((prev) => [...prev, creat]);
  }

  async function handleToggle(id) {
    const ex = exercitii.find((e) => e.id === id);
    try {
      const actualizat = await updateExercitiu(id, { facut: !ex.facut });
      setExercitii((prev) => prev.map((e) => (e.id === id ? actualizat : e)));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteExercitiu(id);
      setExercitii((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  // Comutarea temei: state-ul pentru buton, atributul data-theme pentru CSS
  function handleTema() {
    const noua = tema === "dark" ? "light" : "dark";
    setTema(noua);
    document.documentElement.dataset.theme = noua;
  }

  // Valoare derivată: se recalculează la fiecare randare
  const deFacut = exercitii.filter((e) => !e.facut).length;

  return (
    <>
      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          <span>Piept · Spate · Umeri · Biceps · Triceps · Antebrațe · Abdomen · Cvadricepși · Ischiogambieri · Fesieri · Gambe ·</span>
          <span>Piept · Spate · Umeri · Biceps · Triceps · Antebrațe · Abdomen · Cvadricepși · Ischiogambieri · Fesieri · Gambe ·</span>
        </div>
      </div>

      <header className="app-header">
        <button
          className="theme-toggle"
          onClick={handleTema}
          aria-pressed={tema === "dark"}
        >
          {tema === "dark" ? "Mod luminos" : "Mod întunecat"}
        </button>
        <span className="kicker" aria-hidden="true">Train · Log · Repeat</span>
        <h1>Gym<span>Log</span></h1>
        <p>Jurnalul tău de antrenamente, organizat pe exerciții și intensitate.</p>
        <p className="app-count">
          {exercitii.length} exerciții, dintre care {deFacut} de făcut
        </p>
      </header>

      <main className="container">
        <section className="panel">
          <h2>Adaugă exercițiu</h2>
          <ExercitiuForm onAdd={handleAdd} />
        </section>

        <section className="panel">
          <h2>Exercițiile mele</h2>
          {loading && (
            <p className="info" data-testid="loading">
              Se încarcă exercițiile...
            </p>
          )}
          {error && (
            <p className="error" data-testid="error">
              {error}
            </p>
          )}
          {!loading && (
            <ExercitiuList
              exercitii={exercitii}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          )}
        </section>
      </main>

      <footer className="app-footer">Proiect Tehnologii Web</footer>
    </>
  );
}