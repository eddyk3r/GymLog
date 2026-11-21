import { Link } from "react-router-dom";
import { GRUPE, iconGrupa } from "../constants.js";
import styles from "./GrupeBar.module.css";

// Iconița pentru „Toate”: patru pătrate
function IconToate() {
  return (
    <svg viewBox="0 0 48 48" className={styles.icon} aria-hidden="true">
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <rect x="27" y="9" width="12" height="12" rx="2" />
      <rect x="9" y="27" width="12" height="12" rx="2" />
      <rect x="27" y="27" width="12" height="12" rx="2" />
    </svg>
  );
}

// Bara cu grupele musculare. Două moduri:
//  - cu linkTo: fiecare grupă este un link (pagina Jurnal -> pagina Exerciții)
//  - cu onAlege: fiecare grupă este un buton de filtrare (pagina Exerciții)
export default function GrupeBar({ activa = "", numar = {}, linkTo, onAlege }) {
  const elemente = [{ value: "", label: "Toate" }, ...GRUPE];
  const total = Object.values(numar).reduce((s, n) => s + n, 0);

  return (
    <ul className={styles.bar}>
      {elemente.map((g) => {
        // în modul cu linkuri nu există o grupă aleasă
        const aleasa = !linkTo && g.value === activa;
        const clasa = aleasa ? `${styles.grupa} ${styles.active}` : styles.grupa;
        const continut = (
          <>
            {g.value === "" ? (
              <IconToate />
            ) : (
              <img src={iconGrupa(g.value)} alt="" className={styles.icon} />
            )}
            <span className={styles.label}>{g.label}</span>
            {total > 0 && (
              <span className={styles.count}>
                {g.value === "" ? total : numar[g.value] ?? 0}
              </span>
            )}
          </>
        );

        return (
          <li key={g.value || "toate"}>
            {linkTo ? (
              <Link to={linkTo(g.value)} className={clasa}>
                {continut}
              </Link>
            ) : (
              <button
                type="button"
                className={clasa}
                aria-pressed={aleasa}
                onClick={() => onAlege(g.value)}
              >
                {continut}
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}
