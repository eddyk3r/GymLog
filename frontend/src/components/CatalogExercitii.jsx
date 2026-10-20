import { useState } from "react";
import { ETICHETE_GRUPE, ETICHETE_INTENSITATE } from "../etichete.js";

const GRUPE = Object.keys(ETICHETE_GRUPE);

export default function CatalogExercitii({ exercitii, adaugate, onAdauga }) {
  const [grupa, setGrupa] = useState("");
  const [text, setText] = useState("");

  const cautare = text.trim().toLowerCase();
  const rezultate = exercitii.filter(
    (e) =>
      (grupa === "" || e.grupa === grupa) &&
      e.exercitiu.toLowerCase().includes(cautare)
  );
  const aleasa = grupa !== "" || cautare !== "";

  return (
    <>
      <div className="chip-list">
        {GRUPE.map((g) => (
          <button
            type="button"
            key={g}
            className={`chip${grupa === g ? " active" : ""}`}
            onClick={() => setGrupa(grupa === g ? "" : g)}
          >
            {ETICHETE_GRUPE[g]}
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder={
          grupa === ""
            ? "Caută un exercițiu..."
            : `Caută în ${ETICHETE_GRUPE[grupa]}...`
        }
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {!aleasa && (
        <p className="empty">Alege o grupă musculară sau scrie numele unui exercițiu.</p>
      )}
      {aleasa && rezultate.length === 0 && (
        <p className="empty">Niciun exercițiu găsit.</p>
      )}
      {aleasa && rezultate.length > 0 && (
        <ul className="item-list catalog-list">
          {rezultate.map((e) => (
            <li className="item-card" key={e.id}>
              <div>
                <h3>{e.exercitiu}</h3>
                {grupa === "" && (
                  <span className="grupa">{ETICHETE_GRUPE[e.grupa]}</span>
                )}
                <span className={`badge badge-${e.intensitate}`}>
                  Intensitate {ETICHETE_INTENSITATE[e.intensitate]}
                </span>
              </div>
              <button
                type="button"
                className="mini"
                disabled={adaugate.includes(e.id)}
                onClick={() => onAdauga(e)}
              >
                {adaugate.includes(e.id) ? "Adăugat" : "+ Adaugă"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}