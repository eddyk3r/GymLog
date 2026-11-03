import { useEffect, useState } from "react";
import ExercitiuList from "./components/ExercitiuList.jsx";
import CatalogExercitii from "./components/CatalogExercitii.jsx";
import { fetchExercitii } from "./api.js";

// Tema de pornire: cea a sistemului de operare
function temaInitiala() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export default function App() {
  // Catalogul vine de la API (db.json), deci pornește gol
  const [exercitii, setExercitii] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [jurnal, setJurnal] = useState([]);
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

  // Adăugare imutabilă: listă nouă; nu se adaugă de două ori același exercițiu
  function handleAdauga(exercitiu) {
    setJurnal((prev) =>
      prev.some((e) => e.id === exercitiu.id)
        ? prev
        : [...prev, { ...exercitiu, facut: false }]
    );
  }

  // În Etapa 6 modificările rămân locale: se pierd la refresh (rezolvat în Etapa 7)
  function handleToggleFacut(id) {
    setJurnal((prev) =>
      prev.map((e) => (e.id === id ? { ...e, facut: !e.facut } : e))
    );
  }

  function handleDelete(id) {
    setJurnal((prev) => prev.filter((e) => e.id !== id));
  }

  // Comutarea temei: state-ul pentru buton, atributul data-theme pentru CSS
  function handleTema() {
    const noua = tema === "dark" ? "light" : "dark";
    setTema(noua);
    document.documentElement.dataset.theme = noua;
  }

  // Valoare derivată: se recalculează la fiecare randare
  const deFacut = jurnal.filter((e) => !e.facut).length;

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
          {jurnal.length} exerciții, dintre care {deFacut} de făcut
        </p>
      </header>

      <main className="container">
        <section className="panel">
          <h2>Adaugă exercițiu</h2>
          {loading && <p className="info">Se încarcă exercițiile...</p>}
          {error && (
            <p className="error">
              Nu am putut încărca datele: {error}. Rulează <code>npm run api</code>?
            </p>
          )}
          {!loading && !error && (
            <CatalogExercitii
              exercitii={exercitii}
              adaugate={jurnal.map((e) => e.id)}
              onAdauga={handleAdauga}
            />
          )}
        </section>

        <section className="panel">
          <h2>Exercițiile mele</h2>
          <ExercitiuList
            exercitii={jurnal}
            onToggle={handleToggleFacut}
            onDelete={handleDelete}
          />
        </section>
      </main>

      <footer className="app-footer">Proiect Tehnologii Web</footer>
    </>
  );
}
