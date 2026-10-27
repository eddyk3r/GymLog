import { ETICHETE_GRUPE, ETICHETE_INTENSITATE } from "../etichete.js";

export default function ExercitiuCard({ exercitiu, onToggle, onDelete }) {
  const detalii = (
    <div>
      <h3>{exercitiu.exercitiu}</h3>
      <span className="grupa">{ETICHETE_GRUPE[exercitiu.grupa]}</span>
      <span className={`badge badge-${exercitiu.intensitate}`}>
        Intensitate {ETICHETE_INTENSITATE[exercitiu.intensitate]}
      </span>
    </div>
  );

  // Fără funcții primite, cardul doar afișează exercițiul
  if (!onToggle) {
    return (
      <li className={exercitiu.facut ? "item-card done" : "item-card"}>
        <div className="item-main">{detalii}</div>
        <span className="status">{exercitiu.facut ? "Făcut" : "De făcut"}</span>
      </li>
    );
  }

  return (
    <li className={exercitiu.facut ? "item-card done" : "item-card"}>
      <label className="item-main">
        <input
          type="checkbox"
          checked={exercitiu.facut}
          onChange={() => onToggle(exercitiu.id)}
        />
        {detalii}
      </label>

      <div className="card-actions">
        <button
          type="button"
          className="mini"
          aria-label={`Șterge ${exercitiu.exercitiu}`}
          onClick={() => onDelete(exercitiu.id)}
        >
          ✕
        </button>
      </div>
    </li>
  );
}