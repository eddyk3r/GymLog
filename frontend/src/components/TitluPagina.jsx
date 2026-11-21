import styles from "./TitluPagina.module.css";

// Titlul mare al paginilor noi (Antrenament, Hartă, Statistici)
export default function TitluPagina({ kicker, titlu, sub, children }) {
  return (
    <header className={styles.head}>
      <span className={styles.kicker}>{kicker}</span>
      <h1 className={styles.titlu}>{titlu}</h1>
      {sub && <p className={styles.sub}>{sub}</p>}
      {children}
    </header>
  );
}
