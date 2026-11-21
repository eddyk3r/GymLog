import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchExercitiu, noteazaInIstoric, updateExercitiu } from "../api.js";
import { catalogPentru } from "../data/catalog.js";
import { useLimba } from "../i18n/limba.js";
import ExercitiuDetalii from "../components/ExercitiuDetalii.jsx";
import styles from "./ExercitiuDetaliuPage.module.css";

// Pagina unui exercițiu din jurnal: /exercitii/3
export default function ExercitiuDetaliuPage() {
  const { t, numeGrupa, numeEx, mesajEroare } = useLimba();
  const { id } = useParams(); // text din URL, de exemplu "3"
  const [exercitiu, setExercitiu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eroareBifare, setEroareBifare] = useState(null);

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
        if (!ignore) setError(err);
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
      setEroareBifare(null);
      if (actualizat.facut) noteazaInIstoric(actualizat); // pentru statistici
    } catch (err) {
      setEroareBifare(err);
    }
  }

  if (loading) {
    return (
      <div className="wrap">
        <p className={`info ${styles.loading}`} data-testid="loading">
          {t("dp.loading")}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wrap">
        <section className={`panel ${styles.detail}`}>
          <p className="error" data-testid="error">
            {t("dp.eroare", mesajEroare(error))}
          </p>
          <Link to="/" className="back">
            {t("dp.inapoi")}
          </Link>
        </section>
      </div>
    );
  }

  const dinCatalog = catalogPentru(exercitiu);
  // același nume ca în cardul din listă
  const nume = dinCatalog ? numeEx(dinCatalog) : exercitiu.exercitiu;

  return (
    <div className="wrap">
      <section className={`panel ${styles.detail}`} data-testid="detail">
        <Link to="/" className="back">
          {t("dp.inapoi")}
        </Link>

        <div className={styles.titleRow}>
          <h2
            className={exercitiu.facut ? styles.done : undefined}
            data-testid="detail-title"
          >
            {nume}
          </h2>
          <button type="button" className="mini" onClick={handleToggle}>
            {exercitiu.facut ? t("dp.deFacutBtn") : t("dp.facutBtn")}
          </button>
        </div>
        {eroareBifare && <p className="error">{mesajEroare(eroareBifare)}</p>}

        <dl className={styles.fields}>
          <div>
            <dt>{t("dp.grupa")}</dt>
            <dd>{numeGrupa(exercitiu.grupa)}</dd>
          </div>
          <div>
            <dt>{t("dp.intensitate")}</dt>
            <dd>
              <span className={`badge badge-${exercitiu.intensitate}`}>
                {t(`int.${exercitiu.intensitate}`)}
              </span>
            </dd>
          </div>
          <div>
            <dt>{t("dp.status")}</dt>
            <dd>{exercitiu.facut ? t("dp.facut") : t("dp.deFacut")}</dd>
          </div>
          <div>
            <dt>{t("dp.sursa")}</dt>
            <dd>{exercitiu.catalogId ? t("dp.catalog") : t("dp.manual")}</dd>
          </div>
          <div>
            <dt>{t("dp.id")}</dt>
            <dd>{exercitiu.id}</dd>
          </div>
        </dl>

        {dinCatalog ? (
          <ExercitiuDetalii ex={dinCatalog} />
        ) : (
          <p className={styles.fara}>
            {t("dp.faraVideo")}{" "}
            <Link to={`/catalog?grupa=${exercitiu.grupa}`}>
              {t("dp.veziGrupa", numeGrupa(exercitiu.grupa))}
            </Link>
          </p>
        )}
      </section>
    </div>
  );
}
