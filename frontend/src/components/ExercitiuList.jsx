import ExercitiuCard from "./ExercitiuCard.jsx";

export default function ExercitiuList({ exercitii }) {
  if (exercitii.length === 0) {
    return <p className="empty">Nu există niciun exercițiu.</p>;
  }

  return (
    <ul className="item-list">
      {exercitii.map((exercitiu) => (
        <ExercitiuCard key={exercitiu.id} exercitiu={exercitiu} />
      ))}
    </ul>
  );
}