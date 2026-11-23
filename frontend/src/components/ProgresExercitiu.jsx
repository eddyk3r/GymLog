import { useEffect, useState } from "react";
import { createIstoric, fetchIstoric, intrareIstoric } from "../api.js";
import { useLimba } from "../i18n/limba.js";
import {
  celMaiBunSet,
  cheieExercitiu,
  sesiuniExercitiu,
  textSet,
  ultimulSet,
  unuRM,
  volum,
} from "../statistici.js";
import GraficProgres from "./GraficProgres.jsx";
import styles from "./ProgresExercitiu.module.css";

const SET_GOL = { kg: "", rep: "" };

// Seturile unui exercițiu din jurnal: formularul „Notează un antrenament”,
// recordurile, graficul „cel mai bun set în timp” și lista sesiunilor.
export default function ProgresExercitiu({ exercitiu, onNotat }) {
  const { t, limba, mesajEroare } = useLimba();
  const cheie = cheieExercitiu(exercitiu);
  const [istoric, setIstoric] = useState([]);
  const [error, setError] = useState(null);
  const [seturi, setSeturi] = useState([{ ...SET_GOL }]);
  const [eroareForm, setEroareForm] = useState("");
  const [trimite, setTrimite] = useState(false);
  const [metrica, setMetrica] = useState("rm"); // "rm" (1RM estimat) sau "kg" (greutate maximă)

  useEffect(() => {
    let ignore = false;
    fetchIstoric()
      .then((data) => {
        if (ignore) return;
        setIstoric(data);
        // formularul pornește de la ultimul set notat, ca să nu scrii totul de la zero
        const ultim = ultimulSet(data, cheie);
        if (ultim) setSeturi([{ kg: ultim.kg ? String(ultim.kg) : "", rep: String(ultim.rep) }]);
      })
      .catch((err) => {
        if (!ignore) setError(err);
      });
    return () => {
      ignore = true;
    };
  }, [cheie]);

  const sesiuni = sesiuniExercitiu(istoric, cheie);
  const toate = sesiuni.flatMap((s) => s.seturi);
  const record = celMaiBunSet(toate);
  const cuGreutate = toate.some((s) => s.kg > 0);

  // un punct pe sesiune: cel mai bun set al zilei
  const puncte = sesiuni.map((s) => {
    const best = celMaiBunSet(s.seturi);
    let valoare = best.rep;
    if (cuGreutate) {
      valoare = metrica === "rm" ? unuRM(best.kg, best.rep) : Math.max(...s.seturi.map((x) => x.kg || 0));
    }
    return { data: new Date(s.data), valoare, eticheta: textSet(best) };
  });
  const unitate = cuGreutate ? "kg" : t("prog.rep");

  const fmt = new Intl.DateTimeFormat(limba === "ro" ? "ro-RO" : "en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  function schimbaSet(i, camp, valoare) {
    setSeturi((prev) => prev.map((s, k) => (k === i ? { ...s, [camp]: valoare } : s)));
  }

  // seria nouă pornește cu aceleași valori ca precedenta
  function adaugaSet() {
    setSeturi((prev) => [...prev, { ...prev[prev.length - 1] }]);
  }

  function stergeSet(i) {
    setSeturi((prev) => (prev.length > 1 ? prev.filter((_, k) => k !== i) : prev));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const curate = seturi
      .map((s) => ({
        kg: Math.max(0, Number(String(s.kg).replace(",", ".")) || 0),
        rep: Math.max(0, Math.round(Number(s.rep) || 0)),
      }))
      .filter((s) => s.rep > 0);
    if (curate.length === 0) {
      setEroareForm(t("prog.errRep"));
      return;
    }
    setEroareForm("");
    setTrimite(true);
    try {
      const intrare = await createIstoric(intrareIstoric(exercitiu, { seturi: curate }));
      setIstoric((prev) => [...prev, intrare]);
      onNotat?.(); // pagina marchează exercițiul ca făcut
    } catch (err) {
      setEroareForm(mesajEroare(err));
    } finally {
      setTrimite(false);
    }
  }

  const ultima = sesiuni[sesiuni.length - 1];

  return (
    <section className={styles.progres}>
      <h3 className={styles.titlu}>{t("prog.titlu")}</h3>

      {/* Formularul: seturile de azi */}
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <p className={styles.formTitlu}>{t("prog.noteaza")}</p>
        <ol className={styles.seturi}>
          {seturi.map((s, i) => (
            <li key={i}>
              <span className={styles.nr}>{i + 1}</span>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                step="0.5"
                value={s.kg}
                onChange={(e) => schimbaSet(i, "kg", e.target.value)}
                placeholder="0"
                aria-label={t("prog.kgSet", i + 1)}
              />
              <span className={styles.unit}>kg ×</span>
              <input
                type="number"
                inputMode="numeric"
                min="0"
                step="1"
                value={s.rep}
                onChange={(e) => schimbaSet(i, "rep", e.target.value)}
                placeholder="0"
                aria-label={t("prog.repSet", i + 1)}
              />
              <span className={styles.unit}>{t("prog.rep")}</span>
              <button
                type="button"
                className={`mini ${styles.sterge}`}
                onClick={() => stergeSet(i)}
                disabled={seturi.length === 1}
                aria-label={t("prog.stergeSet", i + 1)}
              >
                ✕
              </button>
            </li>
          ))}
        </ol>
        {eroareForm && <p className="error">{eroareForm}</p>}
        <div className={styles.butoane}>
          <button type="button" className={`mini ${styles.secundar}`} onClick={adaugaSet}>
            {t("prog.adaugaSet")}
          </button>
          <button type="submit" disabled={trimite}>
            {trimite ? t("form.saving") : t("prog.salveaza")}
          </button>
        </div>
      </form>

      {error && <p className="error">{mesajEroare(error)}</p>}

      {sesiuni.length === 0 ? (
        <p className={styles.gol}>{t("prog.gol")}</p>
      ) : (
        <>
          {/* Cifrele importante */}
          <div className={styles.cifre}>
            <div>
              <span>🏆 {t("prog.record")}</span>
              <strong>{textSet(record)}</strong>
            </div>
            {cuGreutate && (
              <div>
                <span>{t("prog.unuRM")}</span>
                <strong>≈ {Math.round(unuRM(record.kg, record.rep))} kg</strong>
              </div>
            )}
            <div>
              <span>{t("prog.ultima")}</span>
              <strong>{textSet(celMaiBunSet(ultima.seturi))}</strong>
            </div>
            <div>
              <span>{t("prog.sesiuni")}</span>
              <strong>{sesiuni.length}</strong>
            </div>
          </div>

          {/* Graficul */}
          <div className={styles.graficHead}>
            <p className={styles.formTitlu}>{t("prog.grafic")}</p>
            {cuGreutate && (
              <div className={styles.metrici} role="group">
                {["rm", "kg"].map((m) => (
                  <button
                    key={m}
                    type="button"
                    className={m === metrica ? `${styles.metrica} ${styles.metricaActiva}` : styles.metrica}
                    aria-pressed={m === metrica}
                    onClick={() => setMetrica(m)}
                  >
                    {m === "rm" ? t("prog.unuRM") : t("prog.kgMax")}
                  </button>
                ))}
              </div>
            )}
          </div>
          <GraficProgres puncte={puncte} unitate={unitate} titlu={t("prog.grafic")} />

          {/* Sesiunile, de la cea mai nouă (și „tabelul” graficului) */}
          <p className={styles.formTitlu}>{t("prog.istoric")}</p>
          <ul className={styles.sesiuni}>
            {[...sesiuni].reverse().map((s) => (
              <li key={s.id}>
                <span className={styles.data}>{fmt.format(new Date(s.data))}</span>
                <span className={styles.chips}>
                  {s.seturi.map((x, i) => (
                    <span key={i}>{textSet(x)}</span>
                  ))}
                </span>
                {cuGreutate && (
                  <span className={styles.volum}>{t("prog.volum", Math.round(volum(s.seturi)))}</span>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
