import { ECHIPAMENT, ETICHETE_GRUPE, traduce } from "../constants.js";
import styles from "./CatalogCard.module.css";

// Un exercițiu din catalog: poza, numele, grupa și butonul de adăugare.
// Click pe card deschide fereastra cu video și detalii.
export default function CatalogCard({ ex, adaugat, onDeschide, onAdauga }) {
  return (
    <li className={adaugat ? `${styles.card} ${styles.adaugat}` : styles.card}>
      <button
        type="button"
        className={styles.open}
        onClick={() => onDeschide(ex.id)}
        aria-label={`Deschide ${ex.nume}`}
      >
        <span className={styles.imgBox}>
          <img src={ex.imagine} alt="" loading="lazy" />
          <span className={styles.play} aria-hidden="true">▶</span>
        </span>
        <span className={styles.nume}>{ex.nume}</span>
        <span className={styles.meta}>
          {ETICHETE_GRUPE[ex.grupa]} · {traduce(ex.echipament, ECHIPAMENT)}
        </span>
      </button>

      <button
        type="button"
        className={`mini ${styles.add}`}
        disabled={adaugat}
        onClick={() => onAdauga(ex)}
        aria-label={adaugat ? `${ex.nume} este în jurnal` : `Adaugă ${ex.nume} în jurnal`}
      >
        {adaugat ? "✓ În jurnal" : "+ Adaugă"}
      </button>
    </li>
  );
}
