import { Link } from "react-router-dom";
import { useLimba } from "../i18n/limba.js";
import styles from "./NotFoundPage.module.css";

// Orice adresă care nu se potrivește cu rutele de deasupra ajunge aici
export default function NotFoundPage() {
  const { t } = useLimba();

  return (
    <div className="wrap">
      <section className={`panel ${styles.box}`} data-testid="not-found">
        <p className={styles.cod} aria-hidden="true">404</p>
        <h2>{t("nf.titlu")}</h2>
        <p className="info">{t("nf.text")}</p>
        <Link to="/" className="back">
          {t("dp.inapoi")}
        </Link>
      </section>
    </div>
  );
}
