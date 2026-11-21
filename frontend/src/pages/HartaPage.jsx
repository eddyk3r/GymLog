import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BodyMap from "../components/BodyMap.jsx";
import TitluPagina from "../components/TitluPagina.jsx";
import { GRUPE, iconGrupa } from "../constants.js";
import { CATALOG } from "../data/catalog.js";
import { useLimba } from "../i18n/limba.js";
import { fetchExercitii, fetchIstoric } from "../api.js";
import { numarPeGrupa } from "../statistici.js";
import styles from "./HartaPage.module.css";

const MUSCHI = GRUPE.filter((g) => g !== "cardio");

// Harta musculară: corpul colorat după cât a fost lucrată fiecare grupă
export default function HartaPage() {
  const { t, numeGrupa, numeEx, mesajEroare } = useLimba();
  const navigate = useNavigate();
  const [azi] = useState(() => new Date());
  const [jurnal, setJurnal] = useState([]);
  const [istoric, setIstoric] = useState([]);
  const [error, setError] = useState(null);
  const [mod, setMod] = useState("istoric"); // "istoric" (30 de zile) sau "jurnal"
  const [activ, setActiv] = useState(null);

  useEffect(() => {
    let ignore = false;
    Promise.all([fetchExercitii(), fetchIstoric()])
      .then(([j, i]) => {
        if (ignore) return;
        setJurnal(j);
        setIstoric(i);
      })
      .catch((err) => {
        if (!ignore) setError(err);
      });
    return () => {
      ignore = true;
    };
  }, []);

  // Câte exerciții are fiecare grupă, după modul ales
  const valori =
    mod === "istoric"
      ? numarPeGrupa(istoric, azi, 30)
      : jurnal.reduce((acc, e) => {
          acc[e.grupa] = (acc[e.grupa] ?? 0) + 1;
          return acc;
        }, {});

  const neglijata = [...MUSCHI].sort((a, b) => (valori[a] ?? 0) - (valori[b] ?? 0))[0];
  const grupa = activ ?? neglijata;
  const populare = CATALOG.filter((e) => e.grupa === grupa).slice(0, 4);

  function alege(g) {
    navigate(`/catalog?grupa=${g}`);
  }

  return (
    <div className="wrap">
      <TitluPagina kicker="Body map" titlu={t("harta.titlu")} sub={t("harta.sub")}>
        <div className={styles.moduri} role="group">
          {["istoric", "jurnal"].map((m) => (
            <button
              key={m}
              type="button"
              className={m === mod ? `${styles.mod} ${styles.modActiv}` : styles.mod}
              aria-pressed={m === mod}
              onClick={() => setMod(m)}
            >
              {m === "istoric" ? t("harta.modIstoric") : t("harta.modJurnal")}
            </button>
          ))}
        </div>
      </TitluPagina>

      {error && <p className="error">{mesajEroare(error)}</p>}

      <div className={styles.grid}>
        <section className={`panel ${styles.hartaPanel}`}>
          <BodyMap valori={valori} activ={activ} onActiv={setActiv} onAlege={alege} />
          <div className={styles.legenda}>
            <span>{t("harta.legenda")}</span>
            <span className={styles.gradient} />
          </div>
          <button type="button" className={styles.cardio} onClick={() => alege("cardio")}>
            <img src={iconGrupa("cardio")} alt="" />
            {t("harta.cardio")} <strong>{t("harta.ori", valori.cardio ?? 0)}</strong>
          </button>
        </section>

        <aside className={`panel ${styles.info}`} aria-live="polite">
          {!activ && <p className={styles.eticheta}>{t("harta.neglijat")}</p>}
          <div className={styles.grupaTitlu}>
            <img src={iconGrupa(grupa)} alt="" />
            <div>
              <h2>{numeGrupa(grupa)}</h2>
              <p className={styles.numar}>
                {valori[grupa] ? t("harta.ori", valori[grupa]) : t("harta.nimic")}
              </p>
            </div>
          </div>

          <p className={styles.eticheta}>{t("harta.populare")}</p>
          <ul className={styles.populare}>
            {populare.map((ex) => (
              <li key={ex.id}>
                <Link to={`/catalog?grupa=${grupa}&ex=${ex.id}`}>
                  <img src={ex.imagine} alt="" loading="lazy" />
                  <span>{numeEx(ex)}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link to={`/catalog?grupa=${grupa}`} className={`btn ${styles.toate}`}>
            {t("harta.vezi", numeGrupa(grupa))}
          </Link>
          {!activ && <p className={`info ${styles.hint}`}>{t("harta.alege")}</p>}
        </aside>
      </div>
    </div>
  );
}
