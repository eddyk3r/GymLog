import styles from "./CercTimer.module.css";

const R = 88;
const CIRCUMFERINTA = 2 * Math.PI * R;

// Cronometrul de pauză: un cerc care se golește pe măsură ce trece timpul
export default function CercTimer({ ramas, total }) {
  const fractie = total > 0 ? Math.max(0, Math.min(1, ramas / total)) : 0;
  const secunde = Math.ceil(ramas);
  const min = Math.floor(secunde / 60);
  const sec = String(secunde % 60).padStart(2, "0");

  return (
    <div className={secunde <= 3 ? `${styles.cerc} ${styles.final}` : styles.cerc}>
      <svg viewBox="0 0 200 200" aria-hidden="true">
        <circle className={styles.fundal} cx="100" cy="100" r={R} />
        <circle
          className={styles.progres}
          cx="100"
          cy="100"
          r={R}
          strokeDasharray={CIRCUMFERINTA}
          strokeDashoffset={CIRCUMFERINTA * (1 - fractie)}
        />
      </svg>
      <span className={styles.timp} role="timer" aria-live="off">
        {min}:{sec}
      </span>
    </div>
  );
}
