import { Link } from "react-router-dom";
import styles from "./NotFoundPage.module.css";

// Orice adresă care nu se potrivește cu rutele de deasupra ajunge aici
export default function NotFoundPage() {
  return (
    <div className="wrap">
      <section className={`panel ${styles.box}`} data-testid="not-found">
        <p className={styles.cod} aria-hidden="true">404</p>
        <h2>Pagina nu există</h2>
        <p className="info">Adresa cerută nu duce nicăieri. Poate ai sărit o repetare?</p>
        <Link to="/" className="back">
          Înapoi la jurnal
        </Link>
      </section>
    </div>
  );
}
