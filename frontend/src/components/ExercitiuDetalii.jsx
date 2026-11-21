import { iconGrupa } from "../constants.js";
import { useLimba } from "../i18n/limba.js";
import styles from "./ExercitiuDetalii.module.css";

// Video-ul tutorial și detaliile unui exercițiu din catalog.
// Folosit în fereastra din pagina Exerciții și în pagina de detaliu.
export default function ExercitiuDetalii({ ex }) {
  const { t, limba, numeGrupa, pasiEx, echipament, partiCorp, muschi } = useLimba();
  const pasi = pasiEx(ex);

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
          {t("det.faraVideo")}
        </video>
      </div>

      <div className={styles.info}>
        <figure className={styles.harta}>
          <img src={iconGrupa(ex.grupa)} alt={t("det.harta", numeGrupa(ex.grupa))} />
          <figcaption>{numeGrupa(ex.grupa)}</figcaption>
        </figure>

        <div>
          <h3 className={styles.subtitlu}>{t("det.titlu")}</h3>
          <dl className={styles.fields}>
            <dt>{t("det.parte")}</dt>
            <dd>{partiCorp(ex.partiCorp)}</dd>
            <dt>{t("det.echipament")}</dt>
            <dd>{echipament(ex.echipament)}</dd>
            <dt>{t("det.principali")}</dt>
            <dd>{ex.principali ? muschi(ex.principali) : "—"}</dd>
            <dt>{t("det.secundari")}</dt>
            <dd>{ex.secundari ? muschi(ex.secundari) : "—"}</dd>
          </dl>
        </div>
      </div>

      {pasi.length > 0 && (
        <div className={styles.pasi}>
          <h3 className={styles.subtitlu}>{t("det.cum")}</h3>
          <ol lang={limba}>
            {pasi.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
