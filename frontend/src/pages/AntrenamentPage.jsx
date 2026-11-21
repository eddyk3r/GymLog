import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import CercTimer from "../components/CercTimer.jsx";
import TitluPagina from "../components/TitluPagina.jsx";
import { iconGrupa } from "../constants.js";
import { catalogPentru } from "../data/catalog.js";
import { useLimba } from "../i18n/limba.js";
import { fetchExercitii, noteazaInIstoric, updateExercitiu } from "../api.js";
import { bip, pornesteSunetul } from "../sunet.js";
import styles from "./AntrenamentPage.module.css";

const PAUZE = [30, 60, 90, 120];
const PAUZA_MIN = 5;
const PAUZA_MAX = 600; // 10 minute

// 01:05 din milisecunde
function formatTimp(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

// Bucățelele de confetti de pe ecranul final: poziții fixe, calculate din index
const CONFETTI = Array.from({ length: 28 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  delay: `${(i % 7) * 0.18}s`,
  durata: `${2.4 + (i % 5) * 0.35}s`,
  culoare: i % 3,
}));

// Modul antrenament: alegi exercițiile, apoi aplicația te ghidează serie cu serie,
// cu video, cronometru de pauză și sunet. Fazele: setup -> lucru <-> pauza -> final.
export default function AntrenamentPage() {
  const { t, numeGrupa, numeEx, mesajEroare } = useLimba();

  // jurnalul și alegerea exercițiilor
  const [jurnal, setJurnal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alese, setAlese] = useState([]); // id-urile bifate pentru antrenament
  const [serii, setSerii] = useState(3);
  const [pauza, setPauza] = useState(60);
  const [custom, setCustom] = useState(false); // pauză aleasă de utilizator, în secunde
  const [textCustom, setTextCustom] = useState("45");

  // desfășurarea antrenamentului
  const [faza, setFaza] = useState("setup");
  const [lista, setLista] = useState([]);
  const [idx, setIdx] = useState(0);
  const [seria, setSeria] = useState(1);
  const [start, setStart] = useState(0);
  const [sfarsit, setSfarsit] = useState(0);
  const [acum, setAcum] = useState(0);
  const [pauzaPana, setPauzaPana] = useState(0);
  const [pauzaTotal, setPauzaTotal] = useState(0);
  const [terminate, setTerminate] = useState([]); // { ex, serii }
  const [eroareSalvare, setEroareSalvare] = useState(null);
  const ultimulBip = useRef(null);

  useEffect(() => {
    let ignore = false;
    fetchExercitii()
      .then((data) => {
        if (ignore) return;
        setJurnal(data);
        setAlese(data.filter((e) => !e.facut).map((e) => e.id)); // implicit: ce e de făcut
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

  // Ceasul antrenamentului: bate de 4 ori pe secundă cât timp antrenamentul rulează
  useEffect(() => {
    if (faza !== "lucru" && faza !== "pauza") return undefined;
    const timer = setInterval(() => {
      const now = Date.now();
      setAcum(now);
      if (faza !== "pauza") return;
      const ramas = Math.ceil((pauzaPana - now) / 1000);
      if (ramas <= 0) {
        bip(1320, 450); // gata pauza
        setFaza("lucru");
      } else if (ramas <= 3 && ultimulBip.current !== ramas) {
        ultimulBip.current = ramas;
        bip(880, 120); // 3, 2, 1
      }
    }, 250);
    return () => clearInterval(timer);
  }, [faza, pauzaPana]);

  function numeAfisat(ex) {
    const c = catalogPentru(ex);
    return c ? numeEx(c) : ex.exercitiu;
  }

  // Câmpul „Personalizat”: textul rămâne cum îl scrii, pauza primește doar valori valide
  function handleCustom(text) {
    setTextCustom(text);
    const n = Number(text);
    if (Number.isInteger(n) && n >= PAUZA_MIN && n <= PAUZA_MAX) setPauza(n);
  }

  function alegeCustom() {
    setCustom(true);
    handleCustom(textCustom);
  }

  // La ieșirea din câmp, o valoare în afara limitelor este adusă în interval
  function corecteazaCustom() {
    const n = Math.round(Number(textCustom));
    const corect = Number.isFinite(n) ? Math.min(PAUZA_MAX, Math.max(PAUZA_MIN, n)) : pauza;
    setTextCustom(String(corect));
    setPauza(corect);
  }

  const customInvalid =
    custom &&
    !(Number.isInteger(Number(textCustom)) &&
      Number(textCustom) >= PAUZA_MIN &&
      Number(textCustom) <= PAUZA_MAX);

  function comuta(id) {
    setAlese((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function handleStart() {
    pornesteSunetul();
    const now = Date.now();
    setLista(jurnal.filter((e) => alese.includes(e.id)));
    setIdx(0);
    setSeria(1);
    setTerminate([]);
    setEroareSalvare(null);
    setStart(now);
    setAcum(now);
    setFaza("lucru");
  }

  function intraInPauza() {
    const now = Date.now();
    ultimulBip.current = null;
    setPauzaPana(now + pauza * 1000);
    setPauzaTotal(pauza);
    setAcum(now);
    setFaza("pauza");
  }

  function termina() {
    setSfarsit(Date.now());
    setFaza("final");
  }

  // Trece la exercițiul următor (cu pauză înainte, dacă cel curent a fost terminat)
  function urmatorul(cuPauza) {
    if (idx + 1 < lista.length) {
      setIdx(idx + 1);
      setSeria(1);
      if (cuPauza) intraInPauza();
    } else {
      termina();
    }
  }

  // Salvează pe server: exercițiul devine „făcut” și se notează în istoric
  async function salveaza(ex) {
    try {
      if (!ex.facut) await updateExercitiu(ex.id, { facut: true });
      await noteazaInIstoric(ex, serii);
    } catch (err) {
      setEroareSalvare(err);
    }
  }

  function handleSerieGata() {
    bip(660, 100);
    if (seria < serii) {
      setSeria(seria + 1);
      intraInPauza();
      return;
    }
    const ex = lista[idx];
    setTerminate((prev) => [...prev, { ex, serii }]);
    salveaza(ex);
    urmatorul(true);
  }

  // ---------- Ecranul de pornire ----------
  if (faza === "setup") {
    return (
      <div className="wrap">
        <TitluPagina kicker="Train · Log · Repeat" titlu={t("ant.titlu")} sub={t("ant.sub")} />

        {loading && <p className="info">{t("lista.loading")}</p>}
        {error && <p className="error">{mesajEroare(error)}</p>}

        {!loading && !error && (
          <div className={styles.setup}>
            <section className="panel">
              <h2>{t("ant.alege")}</h2>
              {jurnal.length === 0 ? (
                <p className="empty">
                  {t("ant.gol")} <Link to="/catalog">{t("ant.golLink")}</Link>
                </p>
              ) : (
                <ul className={styles.alegeri}>
                  {jurnal.map((ex) => {
                    const c = catalogPentru(ex);
                    const ales = alese.includes(ex.id);
                    return (
                      <li key={ex.id}>
                        <label className={ales ? `${styles.alegere} ${styles.ales}` : styles.alegere}>
                          <input type="checkbox" checked={ales} onChange={() => comuta(ex.id)} />
                          <img src={c ? c.imagine : iconGrupa(ex.grupa)} alt="" loading="lazy" />
                          <span className={styles.alegereText}>
                            <strong>{numeAfisat(ex)}</strong>
                            <small>
                              {numeGrupa(ex.grupa)}
                              {ex.facut && <em> · {t("ant.facut")}</em>}
                            </small>
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>

            <section className="panel">
              <h2>{t("ant.setari")}</h2>
              <p className={styles.eticheta}>{t("ant.serii")}</p>
              <div className={styles.stepper}>
                <button
                  type="button"
                  className="mini"
                  onClick={() => setSerii(Math.max(1, serii - 1))}
                  aria-label={t("ant.minus")}
                >
                  −
                </button>
                <span className={styles.valoare}>{serii}</span>
                <button
                  type="button"
                  className="mini"
                  onClick={() => setSerii(Math.min(8, serii + 1))}
                  aria-label={t("ant.plus")}
                >
                  +
                </button>
              </div>

              <p className={styles.eticheta}>{t("ant.pauza")}</p>
              <div className={styles.chips}>
                {PAUZE.map((p) => {
                  const activ = !custom && p === pauza;
                  return (
                    <button
                      key={p}
                      type="button"
                      className={activ ? `${styles.chip} ${styles.chipActiv}` : styles.chip}
                      aria-pressed={activ}
                      onClick={() => {
                        setCustom(false);
                        setPauza(p);
                      }}
                    >
                      {t("ant.sec", p)}
                    </button>
                  );
                })}
                <button
                  type="button"
                  className={custom ? `${styles.chip} ${styles.chipActiv}` : styles.chip}
                  aria-pressed={custom}
                  onClick={alegeCustom}
                >
                  {t("ant.custom")}
                </button>
              </div>

              {custom && (
                <label className={styles.custom}>
                  <span>{t("ant.customLabel")}</span>
                  <span className={styles.customRand}>
                    <input
                      type="number"
                      min={PAUZA_MIN}
                      max={PAUZA_MAX}
                      step={5}
                      value={textCustom}
                      onChange={(e) => handleCustom(e.target.value)}
                      onBlur={corecteazaCustom}
                      aria-invalid={customInvalid}
                      autoFocus
                    />
                    <span>{t("ant.secunde")}</span>
                  </span>
                  <small className={customInvalid ? styles.customEroare : undefined}>
                    {t("ant.customHint", PAUZA_MIN, PAUZA_MAX)}
                  </small>
                </label>
              )}

              <button
                type="button"
                className={styles.start}
                disabled={alese.length === 0 || customInvalid}
                onClick={handleStart}
              >
                {t("ant.start", alese.length)}
              </button>
            </section>
          </div>
        )}
      </div>
    );
  }

  // ---------- Ecranul final ----------
  if (faza === "final") {
    const totalSerii = terminate.reduce((s, x) => s + x.serii, 0);
    return (
      <div className="wrap">
        <section className={`panel ${styles.final}`}>
          <div className={styles.confetti} aria-hidden="true">
            {CONFETTI.map((c, i) => (
              <span
                key={i}
                className={styles[`c${c.culoare}`]}
                style={{ left: c.left, animationDelay: c.delay, animationDuration: c.durata }}
              />
            ))}
          </div>
          <p className={styles.trofeu} aria-hidden="true">🏆</p>
          <h1 className={styles.finalTitlu}>{t("ant.finalTitlu")}</h1>
          <p className="info">{t("ant.finalSub")}</p>

          <div className={styles.rezumat}>
            <div>
              <strong>{formatTimp(sfarsit - start)}</strong>
              <span>{t("ant.durata")}</span>
            </div>
            <div>
              <strong>{terminate.length}</strong>
              <span>{t("ant.exercitii")}</span>
            </div>
            <div>
              <strong>{totalSerii}</strong>
              <span>{t("ant.seriiTotal")}</span>
            </div>
          </div>

          {terminate.length > 0 && (
            <ul className={styles.terminate}>
              {terminate.map(({ ex, serii: s }) => (
                <li key={ex.id}>
                  ✓ {numeAfisat(ex)} <small>· {t("stat.serii", s)}</small>
                </li>
              ))}
            </ul>
          )}
          {eroareSalvare && <p className="error">{mesajEroare(eroareSalvare)}</p>}

          <div className={styles.actiuni}>
            <Link to="/statistici" className="btn">
              {t("ant.veziStat")}
            </Link>
            <Link to="/" className={`btn ${styles.secundar}`}>
              {t("ant.inapoi")}
            </Link>
          </div>
        </section>
      </div>
    );
  }

  // ---------- În timpul antrenamentului (lucru sau pauză) ----------
  const ex = lista[idx];
  const c = catalogPentru(ex);
  const progres = ((idx + (seria - 1) / serii) / lista.length) * 100;
  const ramas = Math.max(0, (pauzaPana - acum) / 1000);

  return (
    <div className="wrap">
      <div className={styles.bara}>
        <span>{t("ant.progres", idx + 1, lista.length)}</span>
        <span className={styles.progres}>
          <span style={{ width: `${progres}%` }} />
        </span>
        <span className={styles.ceas}>
          {t("ant.timp")} {formatTimp(acum - start)}
        </span>
      </div>

      {faza === "pauza" ? (
        <section className={`panel ${styles.pauza}`}>
          <h2 className={styles.pauzaTitlu}>{t("ant.pauzaTitlu")}</h2>
          <CercTimer ramas={ramas} total={pauzaTotal} />
          <p className={styles.urmeaza}>
            {t("ant.urmeaza")}: <strong>{numeAfisat(ex)}</strong> · {t("ant.seria", seria, serii)}
          </p>
          <div className={styles.actiuni}>
            <button
              type="button"
              className={styles.secundar}
              onClick={() => {
                setPauzaPana(pauzaPana + 15000);
                setPauzaTotal(pauzaTotal + 15);
              }}
            >
              {t("ant.adauga")}
            </button>
            <button type="button" onClick={() => setFaza("lucru")} autoFocus>
              {t("ant.sariPauza")}
            </button>
          </div>
        </section>
      ) : (
        <section className={`panel ${styles.lucru}`}>
          <div className={styles.media}>
            {c ? (
              <video
                key={c.videoUrl}
                src={c.videoUrl}
                poster={c.poster}
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <div className={styles.faraVideo}>
                <img src={iconGrupa(ex.grupa)} alt="" />
                <span>{t("ant.fara")}</span>
              </div>
            )}
          </div>

          <div className={styles.panouLucru}>
            <span className={styles.grupa}>{numeGrupa(ex.grupa)}</span>
            <h1 className={styles.exNume}>{numeAfisat(ex)}</h1>

            <div className={styles.serii} aria-label={t("ant.seria", seria, serii)}>
              {Array.from({ length: serii }, (_, i) => (
                <span
                  key={i}
                  className={
                    i + 1 < seria ? styles.serieGata : i + 1 === seria ? styles.serieAcum : undefined
                  }
                />
              ))}
            </div>
            <p className={styles.seriaText}>{t("ant.seria", seria, serii)}</p>

            <button type="button" className={styles.gata} onClick={handleSerieGata} autoFocus>
              {seria < serii ? t("ant.gataSeria") : t("ant.gataEx")}
            </button>

            <div className={styles.mici}>
              <button type="button" className="mini" onClick={() => urmatorul(false)}>
                {t("ant.sari")}
              </button>
              <button type="button" className="mini" onClick={termina}>
                {t("ant.opreste")}
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
