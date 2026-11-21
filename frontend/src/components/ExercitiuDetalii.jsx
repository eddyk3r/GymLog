import {
  ECHIPAMENT,
  ETICHETE_GRUPE,
  PARTI_CORP,
  iconGrupa,
  traduce,
} from "../constants.js";
import styles from "./ExercitiuDetalii.module.css";

// Video-ul tutorial și detaliile unui exercițiu din catalog.
// Folosit în fereastra din pagina Exerciții și în pagina de detaliu.
export default function ExercitiuDetalii({ ex }) {
  return (
    <div className={styles.detalii}>
      <div className={styles.media}>
        {/* key: la alt exercițiu, playerul pornește de la zero */}
        <video
          key={ex.videoUrl}
          className={styles.video}
          src={ex.videoUrl}
          poster={ex.poster}
          controls
          autoPlay
          muted
          loop
          playsInline
        >
          Browserul tău nu poate reda video-ul.
        </video>
      </div>

      <div className={styles.info}>
        <figure className={styles.harta}>
          <img src={iconGrupa(ex.grupa)} alt={`Grupa ${ETICHETE_GRUPE[ex.grupa]}`} />
          <figcaption>{ETICHETE_GRUPE[ex.grupa]}</figcaption>
        </figure>

        <div>
          <h3 className={styles.subtitlu}>Detalii exercițiu</h3>
          <dl className={styles.fields}>
            <dt>Parte a corpului</dt>
            <dd>{traduce(ex.partiCorp, PARTI_CORP)}</dd>
            <dt>Echipament</dt>
            <dd>{traduce(ex.echipament, ECHIPAMENT)}</dd>
            <dt>Mușchi principali</dt>
            <dd>{ex.principali || "—"}</dd>
            <dt>Mușchi secundari</dt>
            <dd>{ex.secundari || "—"}</dd>
          </dl>
        </div>
      </div>

      {ex.pasi.length > 0 && (
        <div className={styles.pasi}>
          <h3 className={styles.subtitlu}>Cum se execută</h3>
          <ol lang="en">
            {ex.pasi.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
