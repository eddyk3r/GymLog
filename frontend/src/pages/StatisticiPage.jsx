import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TitluPagina from "../components/TitluPagina.jsx";
import { iconGrupa } from "../constants.js";
import { catalogPentru } from "../data/catalog.js";
import { useLimba } from "../i18n/limba.js";
import { fetchIstoric } from "../api.js";
import {
  grilaCalendar,
  numarPeGrupa,
  numarPeZi,
  serieCurenta,
  serieMaxima,
} from "../statistici.js";
import styles from "./StatisticiPage.module.css";

const SAPTAMANI = 18;

// Nivelul de culoare al unei zile din calendar (0 = nimic, 4 = mult)
function nivel(n) {
  if (n === 0) return 0;
  if (n <= 2) return 1;
  if (n <= 4) return 2;
  if (n <= 6) return 3;
  return 4;
}

// Pagina de statistici: cifre, seria de zile, calendarul și grupele lucrate
export default function StatisticiPage() {
  const { t, limba, numeGrupa, numeEx, mesajEroare } = useLimba();
  const [azi] = useState(() => new Date());
  const [istoric, setIstoric] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    fetchIstoric()
      .then((data) => {
        if (!ignore) setIstoric(data);
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
  }, []);

  const peZi = numarPeZi(istoric);
  const zileAntrenament = Object.keys(peZi).length;
  const serie = serieCurenta(peZi, azi);
  const serieMax = serieMaxima(peZi);
  const calendar = grilaCalendar(peZi, azi, SAPTAMANI);
  const peGrupa = Object.entries(numarPeGrupa(istoric, azi, 30)).sort((a, b) => b[1] - a[1]);
  const maxGrupa = peGrupa.length ? peGrupa[0][1] : 1;
  const recente = [...istoric].sort((a, b) => b.data.localeCompare(a.data)).slice(0, 8);

  const formatZi = new Intl.DateTimeFormat(limba === "ro" ? "ro-RO" : "en-GB", {
    day: "numeric",
    month: "short",
  });
  const formatZiOra = new Intl.DateTimeFormat(limba === "ro" ? "ro-RO" : "en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  function numeIntrare(i) {
    const c = catalogPentru(i);
    return c ? numeEx(c) : i.exercitiu;
  }

  const carduri = [
    { val: zileAntrenament, label: t("stat.zile") },
    { val: istoric.length, label: t("stat.exercitii") },
    { val: serie, unit: t("stat.zileUnit", serie), label: t("stat.serie"), foc: serie > 0 },
    { val: serieMax, unit: t("stat.zileUnit", serieMax), label: t("stat.serieMax") },
  ];

  return (
    <div className="wrap">
      <TitluPagina kicker="Progress" titlu={t("stat.titlu")} sub={t("stat.sub")} />

      {loading && <p className="info">{t("lista.loading")}</p>}
      {error && <p className="error">{mesajEroare(error)}</p>}

      {!loading && !error && istoric.length === 0 && (
        <section className={`panel ${styles.gol}`}>
          <p>{t("stat.gol")}</p>
          <Link to="/antrenament" className="btn">
            {t("stat.pornire")}
          </Link>
        </section>
      )}

      {!loading && !error && istoric.length > 0 && (
        <>
          <div className={styles.carduri}>
            {carduri.map((c, i) => (
              <div
                key={c.label}
                className={c.foc ? `${styles.card} ${styles.foc}` : styles.card}
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <strong>
                  {c.foc && <span aria-hidden="true">🔥 </span>}
                  {c.val}
                  {c.unit && <small> {c.unit}</small>}
                </strong>
                <span>{c.label}</span>
                {c.foc && <em>{t("stat.foc")}</em>}
              </div>
            ))}
          </div>

          <section className={`panel ${styles.calendarPanel}`}>
            <h2>
              {t("stat.calendar")} <small className={styles.hint}>{t("stat.calendarHint", SAPTAMANI)}</small>
            </h2>
            <div className={styles.calendar}>
              <div className={styles.zileSapt} aria-hidden="true">
                {t("stat.zileSapt").map((z, i) => (
                  <span key={i}>{z}</span>
                ))}
              </div>
              <div className={styles.coloane}>
                {calendar.map((saptamana) => (
                  <div key={saptamana[0].cheie} className={styles.coloana}>
                    {saptamana.map((zi) => (
                      <span
                        key={zi.cheie}
                        className={`${styles.zi} ${styles[`n${nivel(zi.numar)}`]} ${zi.viitor ? styles.viitor : ""}`}
                        title={zi.viitor ? undefined : t("stat.celula", formatZi.format(zi.data), zi.numar)}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.legenda} aria-hidden="true">
              <span>0</span>
              {[0, 1, 2, 3, 4].map((n) => (
                <span key={n} className={`${styles.zi} ${styles[`n${n}`]}`} />
              ))}
              <span>7+</span>
            </div>
          </section>

          <div className={styles.doua}>
            <section className="panel">
              <h2>{t("stat.grupe")}</h2>
              <ul className={styles.bare}>
                {peGrupa.map(([g, n]) => (
                  <li key={g}>
                    <img src={iconGrupa(g)} alt="" />
                    <span className={styles.bareNume}>{numeGrupa(g)}</span>
                    <span className={styles.bara}>
                      <span style={{ width: `${(n / maxGrupa) * 100}%` }} />
                    </span>
                    <strong>{n}</strong>
                  </li>
                ))}
              </ul>
            </section>

            <section className="panel">
              <h2>{t("stat.recent")}</h2>
              <ul className={styles.recente}>
                {recente.map((i) => (
                  <li key={i.id}>
                    <img src={iconGrupa(i.grupa)} alt="" />
                    <span>
                      <strong>{numeIntrare(i)}</strong>
                      <small>
                        {formatZiOra.format(new Date(i.data))}
                        {i.serii ? ` · ${t("stat.serii", i.serii)}` : ""}
                      </small>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
