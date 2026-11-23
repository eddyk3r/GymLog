import { useState } from "react";
import { useLimba } from "../i18n/limba.js";
import styles from "./GraficProgres.module.css";

// Dimensiunile desenului (SVG-ul se scalează la lățimea panoului)
const L = 640;
const H = 260;
const M = { sus: 24, dreapta: 24, jos: 34, stanga: 48 };

// Valori „rotunde” pentru axa Y: 4–5 linii de grilă
function pasRotund(interval) {
  const brut = interval / 4;
  const putere = 10 ** Math.floor(Math.log10(brut || 1));
  const norm = brut / putere;
  const pas = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10;
  return pas * putere;
}

// Graficul „cel mai bun set în timp”: o linie, un punct pe sesiune.
// puncte: [{ data: Date, valoare: number, eticheta: "70 kg × 6" }], în ordine cronologică.
export default function GraficProgres({ puncte, unitate, titlu }) {
  const { t, limba } = useLimba();
  const [activ, setActiv] = useState(null); // indexul punctului de sub mouse / tastatură

  const fmtZi = new Intl.DateTimeFormat(limba === "ro" ? "ro-RO" : "en-GB", {
    day: "numeric",
    month: "short",
  });

  const valori = puncte.map((p) => p.valoare);
  const minV = Math.min(...valori);
  const maxV = Math.max(...valori);
  const pas = pasRotund(Math.max(maxV - minV, maxV * 0.2, 1));
  const y0 = Math.max(0, Math.floor((minV - pas / 2) / pas) * pas);
  const y1 = Math.ceil((maxV + pas / 4) / pas) * pas;
  const linii = [];
  for (let v = y0; v <= y1 + 1e-9; v += pas) linii.push(Number(v.toFixed(2)));

  const t0 = puncte[0].data.getTime();
  const t1 = puncte[puncte.length - 1].data.getTime();
  const latime = L - M.stanga - M.dreapta;
  const inaltime = H - M.sus - M.jos;
  const x = (d) =>
    t1 === t0 ? M.stanga + latime / 2 : M.stanga + ((d.getTime() - t0) / (t1 - t0)) * latime;
  const y = (v) => M.sus + inaltime - ((v - y0) / (y1 - y0 || 1)) * inaltime;

  const coords = puncte.map((p) => ({ ...p, cx: x(p.data), cy: y(p.valoare) }));
  const traseu = coords.map((c, i) => `${i ? "L" : "M"}${c.cx},${c.cy}`).join(" ");
  const iRecord = valori.indexOf(maxV);
  const iUltim = coords.length - 1;

  // Mouse-ul găsește data cea mai apropiată, nu trebuie să nimerească linia
  function handleMove(e) {
    const r = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * L;
    let best = 0;
    coords.forEach((c, i) => {
      if (Math.abs(c.cx - px) < Math.abs(coords[best].cx - px)) best = i;
    });
    setActiv(best);
  }

  function handleKey(e) {
    if (e.key === "ArrowRight") setActiv((i) => Math.min(iUltim, (i ?? -1) + 1));
    else if (e.key === "ArrowLeft") setActiv((i) => Math.max(0, (i ?? iUltim + 1) - 1));
    else return;
    e.preventDefault();
  }

  const a = activ !== null ? coords[activ] : null;

  // eticheta nu iese din desen: la margini se aliniază spre interior
  function ancora(cx) {
    if (coords.length === 1) return "middle";
    if (cx > L - M.dreapta - 60) return "end";
    if (cx < M.stanga + 60) return "start";
    return "middle";
  }

  return (
    <figure className={styles.grafic}>
      <div
        className={styles.zona}
        tabIndex={0}
        role="img"
        aria-label={`${titlu}: ${puncte.map((p) => `${fmtZi.format(p.data)} ${p.eticheta}`).join(", ")}`}
        onPointerMove={handleMove}
        onPointerLeave={() => setActiv(null)}
        onKeyDown={handleKey}
        onBlur={() => setActiv(null)}
      >
        <svg viewBox={`0 0 ${L} ${H}`} aria-hidden="true">
          {/* grila și axa Y, discrete */}
          {linii.map((v) => (
            <g key={v}>
              <line className={styles.grila} x1={M.stanga} x2={L - M.dreapta} y1={y(v)} y2={y(v)} />
              <text className={styles.axa} x={M.stanga - 8} y={y(v)} textAnchor="end" dominantBaseline="middle">
                {v}
              </text>
            </g>
          ))}
          <text className={styles.axa} x={M.stanga - 8} y={M.sus - 12} textAnchor="end">
            {unitate}
          </text>

          {/* datele de pe axa X: prima, ultima și, dacă încap, cea din mijloc */}
          {[0, Math.floor(iUltim / 2), iUltim]
            .filter((i, k, arr) => arr.indexOf(i) === k)
            .map((i) => (
              <text
                key={i}
                className={styles.axa}
                x={coords[i].cx}
                y={H - 10}
                textAnchor={coords.length === 1 ? "middle" : i === 0 ? "start" : i === iUltim ? "end" : "middle"}
              >
                {fmtZi.format(coords[i].data)}
              </text>
            ))}

          {/* aria de sub linie și linia */}
          {coords.length > 1 && (
            <path
              className={styles.arie}
              d={`${traseu} L${coords[iUltim].cx},${M.sus + inaltime} L${coords[0].cx},${M.sus + inaltime} Z`}
            />
          )}
          <path className={styles.linie} d={traseu} />

          {/* linia verticală care urmărește mouse-ul */}
          {a && <line className={styles.cursor} x1={a.cx} x2={a.cx} y1={M.sus} y2={M.sus + inaltime} />}

          {coords.map((c, i) => (
            <circle
              key={i}
              className={i === activ ? `${styles.punct} ${styles.punctActiv}` : styles.punct}
              cx={c.cx}
              cy={c.cy}
              r={i === activ ? 7 : i === iRecord ? 6 : 4.5}
            />
          ))}

          {/* etichete directe doar pentru record și ultima sesiune */}
          <text
            className={styles.eticheta}
            x={coords[iRecord].cx}
            y={coords[iRecord].cy - 14}
            textAnchor={ancora(coords[iRecord].cx)}
          >
            🏆 {coords[iRecord].eticheta}
          </text>
          {iUltim !== iRecord && (
            <text className={styles.etichetaMica} x={coords[iUltim].cx} y={coords[iUltim].cy + 20} textAnchor="end">
              {coords[iUltim].eticheta}
            </text>
          )}
        </svg>

        {a && (
          <div
            className={styles.tooltip}
            style={{
              left: `${(a.cx / L) * 100}%`,
              top: `${(a.cy / H) * 100}%`,
            }}
          >
            <strong>{a.eticheta}</strong>
            <span>
              {Math.round(a.valoare * 10) / 10} {unitate}
            </span>
            <small>{fmtZi.format(a.data)}</small>
          </div>
        )}
      </div>
      {puncte.length === 1 && <figcaption className={styles.nota}>{t("prog.unaSesiune")}</figcaption>}
    </figure>
  );
}
