import { Link } from "react-router-dom";
import { ETICHETE_GRUPE, ETICHETE_INTENSITATE, iconGrupa } from "../constants.js";
import { catalogPentru } from "../data/catalog.js";
import styles from "./ExercitiuCard.module.css";

// Un exercițiu din jurnal: poate fi bifat, deschis (titlul e link) și șters
export default function ExercitiuCard({ exercitiu, onToggle, onDelete }) {
  const dinCatalog = catalogPentru(exercitiu);

  return (
    <li
      className={exercitiu.facut ? `${styles.card} ${styles.done}` : styles.card}
      data-testid="item"
      data-id={exercitiu.id}
    >
      <div className={styles.main}>
        <input
          type="checkbox"
          checked={exercitiu.facut}
          onChange={() => onToggle(exercitiu.id)}
          aria-label={`Marchează ${exercitiu.exercitiu}`}
          data-testid="item-toggle"
        />
        <img
          className={dinCatalog ? styles.thumb : `${styles.thumb} ${styles.thumbIcon}`}
          src={dinCatalog ? dinCatalog.imagine : iconGrupa(exercitiu.grupa)}
          alt=""
          loading="lazy"
        />
        <div>
          <Link
            to={`/exercitii/${exercitiu.id}`}
            className={styles.title}
            data-testid="item-link"
          >
            {exercitiu.exercitiu}
          </Link>
          <span className={styles.grupa}>
            {ETICHETE_GRUPE[exercitiu.grupa] ?? exercitiu.grupa}
            {dinCatalog && <span className={styles.video}>▶ video</span>}
          </span>
          <span className={`badge badge-${exercitiu.intensitate}`}>
            Intensitate {ETICHETE_INTENSITATE[exercitiu.intensitate]}
          </span>
        </div>
      </div>

      <button
        type="button"
        className="mini"
        aria-label={`Șterge ${exercitiu.exercitiu}`}
        onClick={() => onDelete(exercitiu.id)}
        data-testid="item-delete"
      >
        ✕
      </button>
    </li>
  );
}
