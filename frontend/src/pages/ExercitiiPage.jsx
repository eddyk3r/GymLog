import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ExercitiuList from "../components/ExercitiuList.jsx";
import ExercitiuForm from "../components/ExercitiuForm.jsx";
import GrupeBar from "../components/GrupeBar.jsx";
import { NUMAR_PE_GRUPA } from "../data/catalog.js";
import { useLimba } from "../i18n/limba.js";
import {
  createExercitiu,
  deleteExercitiu,
  fetchExercitii,
  noteazaInIstoric,
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
  const { t, mesajEroare } = useLimba();
  const [exercitii, setExercitii] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // obiectul Error; mesajul se scrie în limba curentă

  // Rulează o singură dată, după prima randare
  useEffect(() => {
    let ignore = false; // nu se setează state dacă pagina s-a închis între timp

    async function load() {
      try {
        const data = await fetchExercitii();
        if (!ignore) setExercitii(data);
      } catch (err) {
        if (!ignore) setError(err);
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
      if (actualizat.facut) noteazaInIstoric(actualizat); // pentru statistici
    } catch (err) {
      setError(err);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteExercitiu(id);
      setExercitii((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      setError(err);
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
        <p>{t("hero.tagline")}</p>
        <Link to="/catalog" className={`btn ${styles.cta}`}>
          {t("hero.cta")}
        </Link>
      </section>

      <div className="wrap">
        <section className={styles.grupe}>
          <h2 className={styles.titluGrupe}>{t("grupe.titlu")}</h2>
          <GrupeBar numar={NUMAR_PE_GRUPA} linkTo={linkGrupa} />
        </section>

        <div className={styles.grid}>
          <section className="panel">
            <h2>{t("manual.titlu")}</h2>
            <p className={styles.hint}>{t("manual.hint")}</p>
            <ExercitiuForm onAdd={handleAdd} />
          </section>

          <section className="panel">
            <h2>{t("lista.titlu")}</h2>
            <div className={styles.summary}>
              <span>{t("lista.sumar", exercitii.length, deFacut)}</span>
              <span
                className={styles.progress}
                role="progressbar"
                aria-label={t("lista.progres")}
                aria-valuenow={procent}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <span style={{ width: `${procent}%` }} />
              </span>
            </div>
            {loading && (
              <p className="info" data-testid="loading">
                {t("lista.loading")}
              </p>
            )}
            {error && (
              <p className="error" data-testid="error">
                {mesajEroare(error)}
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
                {t("lista.incepe")} <Link to="/catalog">{t("lista.incepeLink")}</Link>.
              </p>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
