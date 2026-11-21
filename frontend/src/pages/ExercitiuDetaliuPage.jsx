import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchExercitiu, updateExercitiu } from "../api.js";
import { ETICHETE_GRUPE, ETICHETE_INTENSITATE } from "../constants.js";
import { catalogPentru } from "../data/catalog.js";
import ExercitiuDetalii from "../components/ExercitiuDetalii.jsx";
import styles from "./ExercitiuDetaliuPage.module.css";

// Pagina unui exercițiu din jurnal: /exercitii/3
export default function ExercitiuDetaliuPage() {
  const { id } = useParams(); // text din URL, de exemplu "3"
  const [exercitiu, setExercitiu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eroareBifare, setEroareBifare] = useState("");

  // Se reîncarcă dacă se schimbă id-ul din adresă
  useEffect(() => {
    let ignore = false;

    fetchExercitiu(id)
      .then((data) => {
        if (!ignore) {
          setExercitiu(data);
          setError(null); // o eroare de la un id anterior nu mai este valabilă
        }
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  async function handleToggle() {
    try {
      const actualizat = await updateExercitiu(exercitiu.id, {
        facut: !exercitiu.facut,
      });
      setExercitiu(actualizat);
      setEroareBifare("");
    } catch (err) {
      setEroareBifare(err.message);
    }
  }

  if (loading) {
    return (
      <div className="wrap">
        <p className={`info ${styles.loading}`} data-testid="loading">
          Se încarcă exercițiul...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wrap">
        <section className={`panel ${styles.detail}`}>
          <p className="error" data-testid="error">
            Exercițiul nu a putut fi încărcat: {error}
          </p>
          <Link to="/" className="back">
            Înapoi la jurnal
          </Link>
        </section>
      </div>
    );
  }

  const dinCatalog = catalogPentru(exercitiu);

  return (
    <div className="wrap">
      <section className={`panel ${styles.detail}`} data-testid="detail">
        <Link to="/" className="back">
          Înapoi la jurnal
        </Link>

        <div className={styles.titleRow}>
          <h2
            className={exercitiu.facut ? styles.done : undefined}
            data-testid="detail-title"
          >
            {exercitiu.exercitiu}
          </h2>
          <button type="button" className="mini" onClick={handleToggle}>
            {exercitiu.facut ? "↺ Marchează de făcut" : "✓ Marchează făcut"}
          </button>
        </div>
        {eroareBifare && <p className="error">{eroareBifare}</p>}

        <dl className={styles.fields}>
          <div>
            <dt>Grupa</dt>
            <dd>{ETICHETE_GRUPE[exercitiu.grupa] ?? exercitiu.grupa}</dd>
          </div>
          <div>
            <dt>Intensitate</dt>
            <dd>
              <span className={`badge badge-${exercitiu.intensitate}`}>
                {ETICHETE_INTENSITATE[exercitiu.intensitate]}
              </span>
            </dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{exercitiu.facut ? "Făcut" : "De făcut"}</dd>
          </div>
          <div>
            <dt>Sursă</dt>
            <dd>{exercitiu.catalogId ? "Catalog" : "Adăugat manual"}</dd>
          </div>
          <div>
            <dt>ID</dt>
            <dd>{exercitiu.id}</dd>
          </div>
        </dl>

        {dinCatalog ? (
          <ExercitiuDetalii ex={dinCatalog} />
        ) : (
          <p className={styles.fara}>
            Pentru acest exercițiu nu există video în catalog.{" "}
            <Link to={`/catalog?grupa=${exercitiu.grupa}`}>
              Vezi exercițiile pentru {ETICHETE_GRUPE[exercitiu.grupa] ?? "această grupă"}
            </Link>
          </p>
        )}
      </section>
    </div>
  );
}
