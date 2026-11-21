import { useLimba } from "../i18n/limba.js";
import styles from "./CatalogCard.module.css";

// Un exercițiu din catalog: poza, numele, grupa și butonul de adăugare.
// Click pe card deschide fereastra cu video și detalii.
export default function CatalogCard({ ex, adaugat, onDeschide, onAdauga }) {
  const { t, numeGrupa, numeEx, echipament } = useLimba();
  const nume = numeEx(ex);

  return (
    <li className={adaugat ? `${styles.card} ${styles.adaugat}` : styles.card}>
      <button
        type="button"
        className={styles.open}
        onClick={() => onDeschide(ex.id)}
        aria-label={t("cardC.deschide", nume)}
      >
        <span className={styles.imgBox}>
          <img src={ex.imagine} alt="" loading="lazy" />
          <span className={styles.play} aria-hidden="true">▶</span>
        </span>
        <span className={styles.nume}>{nume}</span>
        <span className={styles.meta}>
          {numeGrupa(ex.grupa)} · {echipament(ex.echipament)}
        </span>
      </button>

      <button
        type="button"
        className={`mini ${styles.add}`}
        disabled={adaugat}
        onClick={() => onAdauga(ex)}
        aria-label={adaugat ? t("cardC.ariaInJurnal", nume) : t("cardC.ariaAdauga", nume)}
      >
        {adaugat ? t("cardC.inJurnal") : t("cardC.adauga")}
      </button>
    </li>
  );
}
