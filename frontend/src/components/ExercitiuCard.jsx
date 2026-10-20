import { ETICHETE_GRUPE, ETICHETE_INTENSITATE } from "../etichete.js";

export default function ExercitiuCard({ exercitiu, onComuta, onSterge }) {
  return (
    <li className={exercitiu.facut ? "item-card done" : "item-card"}>
      <div>
        <h3>{exercitiu.exercitiu}</h3>
        <span className="grupa">{ETICHETE_GRUPE[exercitiu.grupa]}</span>
        <span className={`badge badge-${exercitiu.intensitate}`}>
          Intensitate {ETICHETE_INTENSITATE[exercitiu.intensitate]}
        </span>
      </div>

      {onComuta ? (
        <div className="card-actions">
          <button type="button" className="mini" onClick={() => onComuta(exercitiu.id)}>
            {exercitiu.facut ? "Făcut" : "De făcut"}
          </button>
          <button
            type="button"
            className="mini"
            aria-label={`Șterge ${exercitiu.exercitiu}`}
            onClick={() => onSterge(exercitiu.id)}
          >
            ✕
          </button>
        </div>
      ) : (
        <span className="status">{exercitiu.facut ? "Făcut" : "De făcut"}</span>
      )}
    </li>
  );
}