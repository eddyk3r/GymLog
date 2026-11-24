// Limba aplicației: contextul și hook-ul folosit de componente.
// Provider-ul (componenta care ține state-ul) este în LimbaProvider.jsx.
import { createContext, useContext } from "react";
import { ECHIPAMENT_RO, MUSCHI_RO, PARTI_CORP_RO, TEXTE } from "./texte.js";

export const LIMBI = ["ro", "en"];
export const LimbaContext = createContext({ limba: "ro", setLimba: () => {} });

// "Barbell, Dumbbell" -> "Bară, Gantere"; un termen necunoscut rămâne neschimbat
function traduceLista(text, dictionar) {
  return text
    .split(", ")
    .map((t) => dictionar[t] ?? t)
    .join(", ");
}

// Tot ce afișează o componentă trece prin acest hook:
//   const { t, numeGrupa, ... } = useLimba();
export function useLimba() {
  const { limba, setLimba } = useContext(LimbaContext);
  const ro = limba === "ro";

  // t("cheie") sau t("cheie", param1, param2)
  function t(cheie, ...param) {
    const v = TEXTE[limba][cheie] ?? TEXTE.ro[cheie] ?? cheie;
    return typeof v === "function" ? v(...param) : v;
  }

  return {
    limba,
    setLimba,
    t,
    numeGrupa: (g) => t(`grupa.${g}`),
    // exercițiu din catalog: numele și pașii în limba aleasă
    numeEx: (ex) => (ro ? ex.numeRo : ex.nume),
    pasiEx: (ex) => (ro ? ex.pasiRo : ex.pasi),
    echipament: (text) => (ro ? traduceLista(text, ECHIPAMENT_RO) : text),
    partiCorp: (text) => (ro ? traduceLista(text, PARTI_CORP_RO) : text),
    muschi: (text) => (ro ? traduceLista(text, MUSCHI_RO) : text),
    // mesajul unei erori aruncate de api.js
    // dacă serverul a trimis { error: "..." }, se afișează mesajul lui
    mesajEroare: (err) =>
      err.status ? err.serverMessage || t("err.server", err.status) : t("err.retea"),
  };
}
