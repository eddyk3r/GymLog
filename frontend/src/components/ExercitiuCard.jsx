// Un singur exercițiu din listă, primit prin props.
const ETICHETE_INTENSITATE = { usoara: "ușoară", medie: "medie", intensa: "intensă" };
const ETICHETE_GRUPE = {
  piept: "Piept",
  spate: "Spate",
  umeri: "Umeri",
  biceps: "Biceps",
  triceps: "Triceps",
  antebrate: "Antebrațe",
  abdomen: "Abdomen",
  cvadricepsi: "Cvadricepși",
  ischiogambieri: "Ischiogambieri",
  fesieri: "Fesieri",
  gambe: "Gambe",
};

export default function ExercitiuCard({ exercitiu }) {
  return (
    <li className={exercitiu.facut ? "item-card done" : "item-card"}>
      <div>
        <h3>{exercitiu.exercitiu}</h3>
        <span className="grupa">{ETICHETE_GRUPE[exercitiu.grupa]}</span>
        <span className={`badge badge-${exercitiu.intensitate}`}>
          Intensitate {ETICHETE_INTENSITATE[exercitiu.intensitate]}
        </span>
      </div>
      <span className="status">{exercitiu.facut ? "Făcut" : "De făcut"}</span>
    </li>
  );
}