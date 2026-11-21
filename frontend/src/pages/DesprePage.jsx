import { Link } from "react-router-dom";
import TitluPagina from "../components/TitluPagina.jsx";
import { CATALOG } from "../data/catalog.js";
import { useLimba } from "../i18n/limba.js";
import styles from "./DesprePage.module.css";

// Ce poate face aplicația, cu link spre pagina fiecărei funcții
const FUNCTII = [
  { icon: "🎬", cheie: "catalog", to: "/catalog" },
  { icon: "⏱️", cheie: "antrenament", to: "/antrenament" },
  { icon: "🫀", cheie: "harta", to: "/harta" },
  { icon: "📈", cheie: "statistici", to: "/statistici" },
];

const VALORI = [
  { icon: "🔥", cheie: "consecventa" },
  { icon: "🎯", cheie: "claritate" },
  { icon: "💪", cheie: "progres" },
  { icon: "🧠", cheie: "tehnica" },
];

const STACK = ["React", "Vite", "React Router", "CSS Modules", "json-server"];

// Pagina de prezentare: povestea, misiunea și valorile aplicației
export default function DesprePage() {
  const { t } = useLimba();

  return (
    <div className="wrap">
      <TitluPagina kicker={t("despre.kicker")} titlu={t("despre.titlu")} sub={t("despre.intro")} />

      <div className={styles.pagina}>
        {/* Numele */}
        <section className={styles.nume}>
          <p className={styles.eticheta}>{t("despre.numeTitlu")}</p>
          <div className={styles.cuvinte}>
            <div className={styles.cuvant}>
              <strong>Gym</strong>
              <span>{t("despre.gym")}</span>
            </div>
            <div className={`${styles.cuvant} ${styles.cuvantAccent}`}>
              <strong>Log</strong>
              <span>{t("despre.log")}</span>
            </div>
          </div>
          <p className={styles.impreuna}>{t("despre.impreuna")}</p>
        </section>

        {/* Misiunea */}
        <section className="panel">
          <h2>{t("despre.misiuneTitlu")}</h2>
          <p>{t("despre.misiune1")}</p>
          <ul className={styles.lista}>
            {t("despre.misiuneLista").map((rand) => (
              <li key={rand}>{rand}</li>
            ))}
          </ul>
          <p>{t("despre.misiune2", CATALOG.length)}</p>
        </section>

        {/* Construit pentru viața reală */}
        <section className="panel">
          <h2>{t("despre.realTitlu")}</h2>
          <p>{t("despre.real")}</p>
          <div className={styles.functii}>
            {FUNCTII.map((f) => (
              <Link key={f.cheie} to={f.to} className={styles.functie}>
                <span className={styles.icon} aria-hidden="true">{f.icon}</span>
                <strong>{t(`despre.f.${f.cheie}`)}</strong>
                <span>{t(`despre.f.${f.cheie}.text`, CATALOG.length)}</span>
              </Link>
            ))}
          </div>
          <p className={styles.accent}>{t("despre.realFinal")}</p>
        </section>

        {/* Valorile */}
        <section>
          <h2 className={styles.titluSectiune}>{t("despre.valoriTitlu")}</h2>
          <div className={styles.valori}>
            {VALORI.map((v, i) => (
              <article key={v.cheie} className={styles.valoare} style={{ animationDelay: `${i * 0.08}s` }}>
                <span className={styles.icon} aria-hidden="true">{v.icon}</span>
                <h3>{t(`despre.v.${v.cheie}`)}</h3>
                <p>{t(`despre.v.${v.cheie}.text`)}</p>
              </article>
            ))}
          </div>
        </section>

        {/* În spatele proiectului */}
        <section className={`panel ${styles.autor}`}>
          <h2>{t("despre.autorTitlu")}</h2>
          <p>{t("despre.autor")}</p>
          <ul className={styles.stack}>
            {STACK.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <p className="info">{t("despre.sursa")}</p>
        </section>

        {/* Final */}
        <section className={styles.final}>
          <p>{t("despre.final1")}</p>
          <p className={styles.finalMare}>{t("despre.final2")}</p>
          <p className={styles.semnatura}>GymLog — Train. Log. Repeat.</p>
          <Link to="/antrenament" className="btn">
            {t("despre.cta")}
          </Link>
        </section>
      </div>
    </div>
  );
}
