import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ExercitiuList from "../components/ExercitiuList.jsx";
import ExercitiuForm from "../components/ExercitiuForm.jsx";
import GrupeBar from "../components/GrupeBar.jsx";
import { NUMAR_PE_GRUPA, catalogPentru } from "../data/catalog.js";
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
  const { t, numeEx, mesajEroare } = useLimba();
  const [exercitii, setExercitii] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // obiectul Error; mesajul se scrie în limba curentă
  const [sters, setSters] = useState(null); // { ex, index }: ultimul exercițiu șters, pentru „Anulează”

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

  // Ștergerea se face imediat pe server; 6 secunde poți apăsa „Anulează”
  async function handleDelete(id) {
    const index = exercitii.findIndex((e) => e.id === id);
    const ex = exercitii[index];
    try {
      await deleteExercitiu(id);
      setExercitii((prev) => prev.filter((e) => e.id !== id));
      setSters({ ex, index });
    } catch (err) {
      setError(err);
    }
  }

  // „Anulează”: exercițiul se recreează pe server cu aceleași date (și același id)
  async function handleAnuleaza() {
    const { ex, index } = sters;
    setSters(null);
    try {
      const refacut = await createExercitiu(ex);
      setExercitii((prev) => [...prev.slice(0, index), refacut, ...prev.slice(index)]);
    } catch (err) {
      setError(err);
    }
  }

  // Mesajul cu „Anulează” dispare singur după 6 secunde
  useEffect(() => {
    if (!sters) return undefined;
    const timer = setTimeout(() => setSters(null), 6000);
    return () => clearTimeout(timer);
  }, [sters]);

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

      {sters && (
        <div className={styles.toast} role="status" key={sters.ex.id}>
          <span>
            {t(
              "undo.sters",
              catalogPentru(sters.ex) ? numeEx(catalogPentru(sters.ex)) : sters.ex.exercitiu
            )}
          </span>
          <button type="button" className="mini" onClick={handleAnuleaza}>
            ↶ {t("undo.anuleaza")}
          </button>
          <button
            type="button"
            className={styles.toastX}
            onClick={() => setSters(null)}
            aria-label={t("modal.inchide")}
          >
            ✕
          </button>
          <span className={styles.toastTimp} aria-hidden="true" />
        </div>
      )}
    </>
  );
}
