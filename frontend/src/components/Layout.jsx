import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { GRUPE } from "../constants.js";
import { LIMBI, useLimba } from "../i18n/limba.js";
import styles from "./Layout.module.css";

// Tema de pornire: cea a sistemului de operare
function temaInitiala() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

// NavLink marchează singur pagina curentă
function navClass({ isActive }) {
  return isActive ? `${styles.link} ${styles.active}` : styles.link;
}

// Anul pentru copyright (calculat o dată, la încărcarea aplicației)
const AN = new Date().getFullYear();

// Antetul, navigația și subsolul, scrise o singură dată pentru toate paginile
export default function Layout() {
  const [tema, setTema] = useState(temaInitiala);
  const { t, numeGrupa, limba, setLimba } = useLimba();

  // Comutarea temei: state-ul pentru buton, atributul data-theme pentru CSS
  function handleTema() {
    const noua = tema === "dark" ? "light" : "dark";
    setTema(noua);
    document.documentElement.dataset.theme = noua;
  }

  const textTicker = GRUPE.map(numeGrupa).join(" · ") + " ·";

  return (
    <>
      <div className={styles.ticker} aria-hidden="true">
        <div className={styles.track}>
          <span>{textTicker}</span>
          <span>{textTicker}</span>
        </div>
      </div>

      <header className={styles.header}>
        <div className={styles.inner}>
          <Link to="/" className={styles.logo}>
            Gym<span>Log</span>
          </Link>
          <nav className={styles.nav} data-testid="nav">
            <NavLink to="/" end className={navClass}>
              {t("nav.jurnal")}
            </NavLink>
            <NavLink to="/catalog" className={navClass}>
              {t("nav.exercitii")}
            </NavLink>
            <NavLink to="/antrenament" className={navClass}>
              {t("nav.antrenament")}
            </NavLink>
            <NavLink to="/harta" className={navClass}>
              {t("nav.harta")}
            </NavLink>
            <NavLink to="/statistici" className={navClass}>
              {t("nav.statistici")}
            </NavLink>
            <NavLink to="/despre" className={navClass}>
              {t("nav.despre")}
            </NavLink>
          </nav>

          {/* Comutatorul de limbă: RO | EN */}
          <div className={styles.limba} role="group" aria-label={t("limba.aria")}>
            {LIMBI.map((l) => (
              <button
                key={l}
                type="button"
                className={l === limba ? `${styles.lang} ${styles.langActive}` : styles.lang}
                aria-pressed={l === limba}
                onClick={() => setLimba(l)}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            type="button"
            className={styles.themeToggle}
            onClick={handleTema}
            aria-pressed={tema === "dark"}
          >
            {tema === "dark" ? t("tema.luminos") : t("tema.intunecat")}
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <p className={styles.copy}>
          © {AN} Birceanu Eduard-Valentin. {t("footer.drepturi")}
        </p>
        <p className={styles.proiect}>{t("footer")}</p>
      </footer>
    </>
  );
}
