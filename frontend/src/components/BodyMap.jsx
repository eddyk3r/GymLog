import { useLimba } from "../i18n/limba.js";
import styles from "./BodyMap.module.css";

// Corpul desenat din poligoane, în stil „low-poly”, pe o grilă de 200 x 345.
// Pentru mușchii pereche se dă doar partea stângă; cea dreaptă se obține prin oglindire.
const FATA = [
  { g: "gat", p: "92,48 108,48 110,62 90,62", centru: true },
  { g: "umeri", p: "64,68 88,64 84,90 60,98" },
  { g: "piept", p: "88,66 99,68 99,104 84,106 82,92" },
  { g: "biceps", p: "60,100 80,96 76,134 60,138" },
  { g: "antebrate", p: "59,142 76,138 70,182 56,180" },
  { g: "abdomen", p: "86,108 114,108 112,162 88,162", centru: true },
  { g: "abdomen", p: "80,108 85,108 87,162 81,154" },
  { g: "cvadricepsi", p: "80,160 93,182 97,192 95,254 81,254 76,206" },
  { g: "gambe", p: "81,272 95,272 93,326 84,326" },
];

const SPATE = [
  { g: "gat", p: "92,48 108,48 110,58 90,58", centru: true },
  { g: "spate", p: "90,58 110,58 124,70 100,100 76,70", centru: true },
  { g: "umeri", p: "60,72 77,70 75,96 58,100" },
  { g: "spate", p: "80,76 98,104 98,140 86,148 78,112" },
  { g: "triceps", p: "58,102 76,98 74,136 58,138" },
  { g: "antebrate", p: "59,142 76,138 70,182 56,180" },
  { g: "spate", p: "87,150 113,150 112,166 88,166", centru: true },
  { g: "fesieri", p: "80,168 99,170 99,202 83,204 78,188" },
  { g: "ischiogambieri", p: "80,208 98,208 96,256 82,256" },
  { g: "gambe", p: "79,266 97,266 95,300 92,324 84,324 80,300" },
];

// Părțile care nu sunt mușchi (cap, mâini, genunchi, labe)
function Baza() {
  return (
    <g className={styles.baza}>
      <circle cx="100" cy="29" r="18" />
      <ellipse cx="61" cy="192" rx="6" ry="10" />
      <ellipse cx="139" cy="192" rx="6" ry="10" />
      <polygon points="86,164 114,164 106,184 94,184" />
      <ellipse cx="88" cy="263" rx="8" ry="6" />
      <ellipse cx="112" cy="263" rx="8" ry="6" />
      <polygon points="79,330 95,330 95,338 74,338" />
      <polygon points="121,330 105,330 105,338 126,338" />
    </g>
  );
}

function oglindeste(puncte) {
  return puncte
    .split(" ")
    .map((pereche) => {
      const [x, y] = pereche.split(",").map(Number);
      return `${200 - x},${y}`;
    })
    .join(" ");
}

// Toate poligoanele unei figuri, cu oglinda celor pereche
function poligoane(lista) {
  return lista.flatMap((m) => (m.centru ? [m] : [m, { ...m, p: oglindeste(m.p) }]));
}

// valori: { piept: 4, ... }; culoarea fiecărui mușchi vine din valoare / max
export default function BodyMap({ valori, activ, onActiv, onAlege }) {
  const { t, numeGrupa } = useLimba();
  const max = Math.max(1, ...Object.values(valori));

  function culoare(grupa) {
    const n = valori[grupa] ?? 0;
    if (n === 0) return "var(--card)";
    const procent = Math.round(18 + (n / max) * 82);
    return `color-mix(in srgb, var(--accent) ${procent}%, var(--card))`;
  }

  function figura(lista, titlu) {
    return (
      <figure className={styles.figura}>
        <svg viewBox="0 0 200 345" role="group" aria-label={titlu}>
          <Baza />
          {poligoane(lista).map((m, i) => (
            <polygon
              key={i}
              points={m.p}
              className={m.g === activ ? `${styles.muschi} ${styles.activ}` : styles.muschi}
              style={{ fill: culoare(m.g) }}
              tabIndex={0}
              role="button"
              aria-label={`${numeGrupa(m.g)}: ${t("harta.ori", valori[m.g] ?? 0)}`}
              onMouseEnter={() => onActiv(m.g)}
              onFocus={() => onActiv(m.g)}
              onClick={() => onAlege(m.g)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onAlege(m.g);
                }
              }}
            />
          ))}
        </svg>
        <figcaption>{titlu}</figcaption>
      </figure>
    );
  }

  return (
    <div className={styles.corp}>
      {figura(FATA, t("harta.fata"))}
      {figura(SPATE, t("harta.spate"))}
    </div>
  );
}
