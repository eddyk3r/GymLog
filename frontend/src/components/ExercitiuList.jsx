import ExercitiuCard from "./ExercitiuCard.jsx";
import { useLimba } from "../i18n/limba.js";
import styles from "./ExercitiuList.module.css";

// Primește lista și funcțiile și le transmite fiecărui card.
export default function ExercitiuList({ exercitii, onToggle, onDelete }) {
  const { t } = useLimba();

  if (exercitii.length === 0) {
    return (
      <p className="empty" data-testid="empty">
        {t("lista.goala")}
      </p>
    );
  }

  return (
    <ul className={styles.list}>
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
