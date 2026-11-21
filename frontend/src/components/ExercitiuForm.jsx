import { useState } from "react";
import { GRUPE, INTENSITATI } from "../constants.js";
import styles from "./ExercitiuForm.module.css";

const EXERCITIU_MAX = 60;

// Formular controlat: state-ul React este sursa de adevăr pentru câmpuri.
// Etapa 8: adăugarea manuală rămâne, pentru exercițiile care nu sunt în catalog.
export default function ExercitiuForm({ onAdd }) {
  const [exercitiu, setExercitiu] = useState("");
  const [intensitate, setIntensitate] = useState("medie");
  const [grupa, setGrupa] = useState(GRUPE[0].value);
  const [eroare, setEroare] = useState("");
  const [trimite, setTrimite] = useState(false);

  function valideaza() {
    const t = exercitiu.trim();
    if (t === "") return "Exercițiul este obligatoriu.";
    if (t.length > EXERCITIU_MAX)
      return `Exercițiul are maximum ${EXERCITIU_MAX} de caractere.`;
    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault(); // oprește reîncărcarea paginii

    const mesaj = valideaza();
    if (mesaj) {
      setEroare(mesaj);
      return;
    }

    setEroare("");
    setTrimite(true);
    try {
      await onAdd({
        exercitiu: exercitiu.trim(),
        intensitate,
        grupa,
        facut: false,
      });
      // golim câmpurile doar dacă salvarea a reușit
      setExercitiu("");
      setIntensitate("medie");
      setGrupa(GRUPE[0].value);
    } catch (err) {
      setEroare(err.message);
    } finally {
      setTrimite(false);
    }
  }

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      noValidate
      data-testid="form"
    >
      <label>
        Exercițiu
        <input
          type="text"
          value={exercitiu}
          onChange={(e) => setExercitiu(e.target.value)}
          placeholder="Ex: Incline dumbbell press"
          maxLength={EXERCITIU_MAX}
          aria-invalid={Boolean(eroare)}
          data-testid="form-title"
        />
      </label>

      <label>
        Intensitate
        <select
          value={intensitate}
          onChange={(e) => setIntensitate(e.target.value)}
          data-testid="form-intensitate"
        >
          {INTENSITATI.map((i) => (
            <option key={i.value} value={i.value}>
              {i.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        Grupa musculară
        <select
          value={grupa}
          onChange={(e) => setGrupa(e.target.value)}
          data-testid="form-grupa"
        >
          {GRUPE.map((g) => (
            <option key={g.value} value={g.value}>
              {g.label}
            </option>
          ))}
        </select>
      </label>

      {eroare && (
        <p className="error" data-testid="form-error">
          {eroare}
        </p>
      )}

      <button type="submit" disabled={trimite} data-testid="form-submit">
        {trimite ? "Se salvează..." : "Adaugă exercițiul"}
      </button>
    </form>
  );
}
