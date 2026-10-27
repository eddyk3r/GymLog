import ExercitiuCard from "./ExercitiuCard.jsx";

// Primește lista și funcțiile și le transmite fiecărui card.
export default function ExercitiuList({ exercitii, onToggle, onDelete }) {
  if (exercitii.length === 0) {
    return <p className="empty">Nu există niciun exercițiu.</p>;
  }

  return (
    <ul className="item-list">
      {exercitii.map((exercitiu) => (
        <ExercitiuCard
          key={exercitiu.id}
          exercitiu={exercitiu}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}