import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { INTENSITATI } from "../constants.js";
import ExercitiuDetalii from "./ExercitiuDetalii.jsx";
import styles from "./ExercitiuModal.module.css";

// Fereastra (pop-up) cu video-ul și detaliile unui exercițiu din catalog.
// <dialog> cu showModal(): Esc închide fereastra, iar focusul rămâne în ea.
export default function ExercitiuModal({ ex, idInJurnal, onInchide, onAdauga }) {
  const ref = useRef(null);
  const [intensitate, setIntensitate] = useState("medie");
  const [trimite, setTrimite] = useState(false);
  const [eroare, setEroare] = useState("");

  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);

  async function handleAdauga() {
    setTrimite(true);
    setEroare("");
    try {
      await onAdauga(ex, intensitate);
    } catch (err) {
      setEroare(`Nu s-a putut adăuga: ${err.message}`);
    } finally {
      setTrimite(false);
    }
  }

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-labelledby="modal-titlu"
      // Esc: închiderea o face pagina (scoate ?ex din adresă), nu browserul
      onCancel={(e) => {
        e.preventDefault();
        onInchide();
      }}
      // click pe fundalul întunecat (în afara ferestrei) închide
      onClick={(e) => e.target === ref.current && onInchide()}
    >
      <div className={styles.box}>
        <header className={styles.head}>
          <button
            type="button"
            className={styles.close}
            onClick={onInchide}
            aria-label="Închide"
          >
            ←
          </button>
          <h2 id="modal-titlu">{ex.nume}</h2>
        </header>

        <ExercitiuDetalii ex={ex} />

        <footer className={styles.foot}>
          {idInJurnal ? (
            <>
              <span className={styles.ok}>✓ Este în jurnalul tău</span>
              <Link to={`/exercitii/${idInJurnal}`} className="btn">
                Vezi în jurnal
              </Link>
            </>
          ) : (
            <>
              <label className={styles.intensitate}>
                Intensitate
                <select
                  value={intensitate}
                  onChange={(e) => setIntensitate(e.target.value)}
                >
                  {INTENSITATI.map((i) => (
                    <option key={i.value} value={i.value}>
                      {i.label}
                    </option>
                  ))}
                </select>
              </label>
              <button type="button" onClick={handleAdauga} disabled={trimite}>
                {trimite ? "Se adaugă..." : "+ Adaugă în jurnal"}
              </button>
            </>
          )}
        </footer>
        {eroare && <p className="error">{eroare}</p>}
      </div>
    </dialog>
  );
}
