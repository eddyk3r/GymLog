import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { GRUPE } from "../constants.js";
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

const TEXT_TICKER = GRUPE.map((g) => g.label).join(" · ") + " ·";

// Antetul, navigația și subsolul, scrise o singură dată pentru toate paginile
export default function Layout() {
  const [tema, setTema] = useState(temaInitiala);

  // Comutarea temei: state-ul pentru buton, atributul data-theme pentru CSS
  function handleTema() {
    const noua = tema === "dark" ? "light" : "dark";
    setTema(noua);
    document.documentElement.dataset.theme = noua;
  }

  return (
    <>
      <div className={styles.ticker} aria-hidden="true">
        <div className={styles.track}>
          <span>{TEXT_TICKER}</span>
          <span>{TEXT_TICKER}</span>
        </div>
      </div>

      <header className={styles.header}>
        <div className={styles.inner}>
          <Link to="/" className={styles.logo}>
            Gym<span>Log</span>
          </Link>
          <nav className={styles.nav} data-testid="nav">
            <NavLink to="/" end className={navClass}>
              Jurnal
            </NavLink>
            <NavLink to="/catalog" className={navClass}>
              Exerciții
            </NavLink>
            <NavLink to="/despre" className={navClass}>
              Despre
            </NavLink>
          </nav>
          <button
            type="button"
            className={styles.themeToggle}
            onClick={handleTema}
            aria-pressed={tema === "dark"}
          >
            {tema === "dark" ? "Mod luminos" : "Mod întunecat"}
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>Proiect Tehnologii Web</footer>
    </>
  );
}
