import { useState } from "react";
import { GRUPE, INTENSITATI } from "../constants.js";
import { useLimba } from "../i18n/limba.js";
import styles from "./ExercitiuForm.module.css";

const EXERCITIU_MAX = 60;

// Formular controlat: state-ul React este sursa de adevăr pentru câmpuri.
// Etapa 8: adăugarea manuală rămâne, pentru exercițiile care nu sunt în catalog.
export default function ExercitiuForm({ onAdd }) {
  const { t, numeGrupa, mesajEroare } = useLimba();
  const [exercitiu, setExercitiu] = useState("");
  const [intensitate, setIntensitate] = useState("medie");
  const [grupa, setGrupa] = useState(GRUPE[0]);
  // "" | "gol" | "max" | o eroare de la server; textul se alege la afișare, în limba curentă
  const [eroare, setEroare] = useState("");
  const [trimite, setTrimite] = useState(false);

  function valideaza() {
    const text = exercitiu.trim();
    if (text === "") return "gol";
    if (text.length > EXERCITIU_MAX) return "max";
    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault(); // oprește reîncărcarea paginii

    const problema = valideaza();
    if (problema) {
      setEroare(problema);
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
      setGrupa(GRUPE[0]);
    } catch (err) {
      setEroare(err);
    } finally {
      setTrimite(false);
    }
  }

  let mesaj = "";
  if (eroare === "gol") mesaj = t("form.errGol");
  else if (eroare === "max") mesaj = t("form.errMax", EXERCITIU_MAX);
  else if (eroare) mesaj = mesajEroare(eroare);

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      noValidate
      data-testid="form"
    >
      <label>
        {t("form.exercitiu")}
        <input
          type="text"
          value={exercitiu}
          onChange={(e) => setExercitiu(e.target.value)}
          placeholder={t("form.placeholder")}
          maxLength={EXERCITIU_MAX}
          aria-invalid={Boolean(eroare)}
          data-testid="form-title"
        />
      </label>

      <label>
        {t("form.intensitate")}
        <select
          value={intensitate}
          onChange={(e) => setIntensitate(e.target.value)}
          data-testid="form-intensitate"
        >
          {INTENSITATI.map((i) => (
            <option key={i} value={i}>
              {t(`int.${i}`)}
            </option>
          ))}
        </select>
      </label>

      <label>
        {t("form.grupa")}
        <select
          value={grupa}
          onChange={(e) => setGrupa(e.target.value)}
          data-testid="form-grupa"
        >
          {GRUPE.map((g) => (
            <option key={g} value={g}>
              {numeGrupa(g)}
            </option>
          ))}
        </select>
      </label>

      {mesaj && (
        <p className="error" data-testid="form-error">
          {mesaj}
        </p>
      )}

      <button type="submit" disabled={trimite} data-testid="form-submit">
        {trimite ? t("form.saving") : t("form.submit")}
      </button>
    </form>
  );
}
