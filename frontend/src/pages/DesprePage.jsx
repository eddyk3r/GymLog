import { Link } from "react-router-dom";
import { CATALOG } from "../data/catalog.js";
import { useLimba } from "../i18n/limba.js";
import styles from "./DesprePage.module.css";

// Pagina de prezentare a aplicației
export default function DesprePage() {
  const { t } = useLimba();

  return (
    <div className="wrap">
      <section className={`panel ${styles.despre}`}>
        <h2>{t("despre.titlu")}</h2>
        <p>{t("despre.p1")}</p>
        <ul className={styles.lista}>
          <li>
            <Link to="/catalog">{t("despre.l1a")}</Link>
            {t("despre.l1b", CATALOG.length)}
          </li>
          <li>
            {t("despre.l2a")}
            <Link to="/">{t("despre.l2link")}</Link>
            {t("despre.l2b")}
          </li>
          <li>{t("despre.l3")}</li>
        </ul>
        <p className={styles.stack}>{t("despre.stack")}</p>
        <p className="info">{t("despre.sursa")}</p>
      </section>
    </div>
  );
}
