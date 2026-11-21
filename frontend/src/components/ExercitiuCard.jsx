import { Link } from "react-router-dom";
import { iconGrupa } from "../constants.js";
import { catalogPentru } from "../data/catalog.js";
import { useLimba } from "../i18n/limba.js";
import styles from "./ExercitiuCard.module.css";

// Un exercițiu din jurnal: un click pe card îl bifează, titlul (link) deschide
// pagina lui, iar ✕ îl șterge.
export default function ExercitiuCard({ exercitiu, onToggle, onDelete }) {
  const { t, numeGrupa, numeEx } = useLimba();
  const dinCatalog = catalogPentru(exercitiu);
  // exercițiile din catalog au numele în limba aleasă; cele scrise de mână rămân cum au fost scrise
  const nume = dinCatalog ? numeEx(dinCatalog) : exercitiu.exercitiu;

  return (
    <li
      className={exercitiu.facut ? `${styles.card} ${styles.done}` : styles.card}
      data-testid="item"
      data-id={exercitiu.id}
    >
      {/* Căsuța rămâne un checkbox adevărat (tastatură, cititoare de ecran),
          dar e invizibilă și acoperă tot cardul: click oriunde pe card = bifare */}
      <input
        type="checkbox"
        className={styles.toggle}
        checked={exercitiu.facut}
        onChange={() => onToggle(exercitiu.id)}
        aria-label={t("card.marcheaza", nume)}
        data-testid="item-toggle"
      />
      <div className={styles.main}>
        <span className={styles.mark} aria-hidden="true">
          ✓
        </span>
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
            {nume}
          </Link>
          <span className={styles.grupa}>
            {numeGrupa(exercitiu.grupa)}
            {dinCatalog && <span className={styles.video}>▶ video</span>}
          </span>
          <span className={`badge badge-${exercitiu.intensitate}`}>
            {t(`badge.${exercitiu.intensitate}`)}
          </span>
        </div>
      </div>

      <button
        type="button"
        className={`mini ${styles.delete}`}
        aria-label={t("card.sterge", nume)}
        onClick={() => onDelete(exercitiu.id)}
        data-testid="item-delete"
      >
        ✕
      </button>
    </li>
  );
}
