import { useEffect, useState } from "react";
import { LIMBI, LimbaContext } from "./limba.js";

const CHEIE = "gymlog-limba";

// Limba salvată în browser; altfel română
function limbaInitiala() {
  try {
    const salvata = localStorage.getItem(CHEIE);
    return LIMBI.includes(salvata) ? salvata : "ro";
  } catch {
    return "ro";
  }
}

// Ține limba în state și o dă tuturor componentelor prin context
export default function LimbaProvider({ children }) {
  const [limba, setLimba] = useState(limbaInitiala);

  // Sincronizare cu ce e în afara React-ului: <html lang> și localStorage
  useEffect(() => {
    document.documentElement.lang = limba;
    try {
      localStorage.setItem(CHEIE, limba);
    } catch {
      // fără localStorage, limba se pierde doar la reîncărcare
    }
  }, [limba]);

  return (
    <LimbaContext.Provider value={{ limba, setLimba }}>
      {children}
    </LimbaContext.Provider>
  );
}
