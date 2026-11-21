import { Link } from "react-router-dom";
import { CATALOG } from "../data/catalog.js";
import styles from "./DesprePage.module.css";

// Pagina de prezentare a aplicației
export default function DesprePage() {
  return (
    <div className="wrap">
      <section className={`panel ${styles.despre}`}>
        <h2>Despre GymLog</h2>
        <p>
          GymLog este un jurnal de antrenamente construit pas cu pas, pe parcursul
          semestrului, în cadrul proiectului de Tehnologii Web (UNSTPB, FIIR).
        </p>
        <ul className={styles.lista}>
          <li>
            <Link to="/catalog">Catalogul</Link> are {CATALOG.length} de exerciții,
            pe grupe musculare, fiecare cu video tutorial și detalii.
          </li>
          <li>
            Din catalog, un exercițiu se adaugă în <Link to="/">jurnal</Link> cu un click;
            exercițiile care lipsesc se pot scrie de mână.
          </li>
          <li>Fiecare exercițiu din jurnal are pagina lui, cu toate detaliile.</li>
        </ul>
        <p className={styles.stack}>
          Stack: React, Vite, React Router, CSS Modules, json-server.
        </p>
        <p className="info">
          Imaginile și video-urile exercițiilor sunt preluate de pe lyfta.app, doar în
          scop didactic.
        </p>
      </section>
    </div>
  );
}
