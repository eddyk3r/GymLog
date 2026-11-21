import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ExercitiuList from "../components/ExercitiuList.jsx";
import ExercitiuForm from "../components/ExercitiuForm.jsx";
import GrupeBar from "../components/GrupeBar.jsx";
import { NUMAR_PE_GRUPA } from "../data/catalog.js";
import {
  createExercitiu,
  deleteExercitiu,
  fetchExercitii,
  updateExercitiu,
} from "../api.js";
import styles from "./ExercitiiPage.module.css";

// Linkul unei grupe din bară: duce în pagina Exerciții, filtrată pe grupă
function linkGrupa(grupa) {
  return grupa ? `/catalog?grupa=${grupa}` : "/catalog";
}

// Pagina principală: jurnalul (lista de pe server), adăugarea manuală
// și scurtăturile către catalog, pe grupe musculare.
export default function ExercitiiPage() {
  const [exercitii, setExercitii] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    const creat = await createExercitiu(exercitiu);
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

  // Valori derivate: se recalculează la fiecare randare
  const deFacut = exercitii.filter((e) => !e.facut).length;
  const procent = exercitii.length
    ? Math.round(((exercitii.length - deFacut) / exercitii.length) * 100)
    : 0;

  return (
    <>
      <section className={styles.hero}>
        <span className={styles.kicker} aria-hidden="true">
          Train · Log · Repeat
        </span>
        <h1>
          Gym<span>Log</span>
        </h1>
        <p>Jurnalul tău de antrenamente, organizat pe exerciții și intensitate.</p>
        <Link to="/catalog" className={`btn ${styles.cta}`}>
          Alege din catalog →
        </Link>
      </section>

      <div className="wrap">
        <section className={styles.grupe}>
          <h2 className={styles.titluGrupe}>Alege grupa musculară</h2>
          <GrupeBar numar={NUMAR_PE_GRUPA} linkTo={linkGrupa} />
        </section>

        <div className={styles.grid}>
          <section className="panel">
            <h2>Adaugă manual</h2>
            <p className={styles.hint}>
              Nu găsești exercițiul în catalog? Scrie-l aici.
            </p>
            <ExercitiuForm onAdd={handleAdd} />
          </section>

          <section className="panel">
            <h2>Exercițiile mele</h2>
            <div className={styles.summary}>
              <span>
                {exercitii.length} exerciții, dintre care {deFacut} de făcut
              </span>
              <span
                className={styles.progress}
                role="progressbar"
                aria-label="Exerciții făcute"
                aria-valuenow={procent}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <span style={{ width: `${procent}%` }} />
              </span>
            </div>
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
            {!loading && !error && exercitii.length === 0 && (
              <p className={styles.hint}>
                Începe din <Link to="/catalog">catalogul de exerciții</Link>.
              </p>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
