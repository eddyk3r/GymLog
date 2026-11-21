import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import CatalogCard from "../components/CatalogCard.jsx";
import ExercitiuModal from "../components/ExercitiuModal.jsx";
import GrupeBar from "../components/GrupeBar.jsx";
import { ETICHETE_GRUPE } from "../constants.js";
import { CATALOG, NUMAR_PE_GRUPA, gasesteInCatalog } from "../data/catalog.js";
import { createExercitiu, fetchExercitii } from "../api.js";
import styles from "./CatalogPage.module.css";

// Pagina Exerciții: tot catalogul, cu filtrare pe grupe și căutare.
// Filtrele și exercițiul deschis stau în adresă (?grupa=piept&q=press&ex=bench-press),
// deci butoanele Înapoi / Înainte și un link trimis cuiva păstrează ce se vede.
export default function CatalogPage() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const grupa = params.get("grupa") ?? "";
  const q = params.get("q") ?? "";
  const deschis = gasesteInCatalog(params.get("ex") ?? "");

  // Jurnalul de pe server: ca să știm ce e deja adăugat
  const [jurnal, setJurnal] = useState([]);
  const [eroare, setEroare] = useState(null);
  const [mesaj, setMesaj] = useState("");

  useEffect(() => {
    let ignore = false;
    fetchExercitii()
      .then((data) => {
        if (!ignore) setJurnal(data);
      })
      .catch((err) => {
        if (!ignore) setEroare(err.message);
      });
    return () => {
      ignore = true;
    };
  }, []);

  // Mesajul „Adăugat” dispare singur după câteva secunde
  useEffect(() => {
    if (!mesaj) return undefined;
    const t = setTimeout(() => setMesaj(""), 2600);
    return () => clearTimeout(t);
  }, [mesaj]);

  // catalogId -> id-ul din jurnal
  const inJurnal = new Map(
    jurnal.filter((e) => e.catalogId).map((e) => [e.catalogId, e.id])
  );

  const cautare = q.trim().toLowerCase();
  const rezultate = CATALOG.filter(
    (e) =>
      (grupa === "" || e.grupa === grupa) &&
      (cautare === "" || e.nume.toLowerCase().includes(cautare))
  );

  // Schimbă un parametru din adresă și îi păstrează pe ceilalți
  function schimba(cheie, valoare, optiuni) {
    const noi = new URLSearchParams(params);
    if (valoare) noi.set(cheie, valoare);
    else noi.delete(cheie);
    setParams(noi, optiuni);
  }

  function handleGrupa(g) {
    schimba("grupa", g === grupa ? "" : g); // al doilea click pe aceeași grupă o deselectează
  }

  function handleDeschide(id) {
    schimba("ex", id, { state: { dinLista: true } });
  }

  function handleInchide() {
    // deschis din listă: Înapoi; deschis direct dintr-un link: scoatem ?ex
    if (location.state?.dinLista) navigate(-1);
    else schimba("ex", "", { replace: true });
  }

  // Întâi serverul, apoi state-ul (ca în pagina Jurnal)
  async function handleAdauga(ex, intensitate = "medie") {
    const creat = await createExercitiu({
      exercitiu: ex.nume,
      intensitate,
      grupa: ex.grupa,
      facut: false,
      catalogId: ex.id,
    });
    setJurnal((prev) => [...prev, creat]);
    setEroare(null);
    setMesaj(`${ex.nume} a fost adăugat în jurnal.`);
  }

  // Pentru butonul de pe card: eroarea se afișează sus, în pagină
  async function handleAdaugaRapid(ex) {
    try {
      await handleAdauga(ex);
    } catch (err) {
      setEroare(err.message);
    }
  }

  const titlu = grupa ? ETICHETE_GRUPE[grupa] : "Toate exercițiile";

  return (
    <div className="wrap">
      <section className={styles.top}>
        <label className={styles.search}>
          <span className={styles.lupa} aria-hidden="true">⌕</span>
          <input
            type="search"
            placeholder={grupa ? `Caută în ${titlu}...` : "Caută un exercițiu..."}
            value={q}
            onChange={(e) => schimba("q", e.target.value, { replace: true })}
            aria-label="Caută un exercițiu"
          />
        </label>
        <GrupeBar activa={grupa} numar={NUMAR_PE_GRUPA} onAlege={handleGrupa} />
      </section>

      <div className={styles.head}>
        <h1 className={styles.titlu}>
          {titlu} <span>{rezultate.length}</span>
        </h1>
        <p className="info">Apasă pe un exercițiu pentru video și detalii.</p>
      </div>

      {eroare && (
        <p className="error">
          Jurnalul nu poate fi accesat ({eroare}). Rulează <code>npm run api</code>?
        </p>
      )}

      {rezultate.length === 0 ? (
        <p className="empty">Niciun exercițiu găsit.</p>
      ) : (
        <ul className={styles.grid}>
          {rezultate.map((ex) => (
            <CatalogCard
              key={ex.id}
              ex={ex}
              adaugat={inJurnal.has(ex.id)}
              onDeschide={handleDeschide}
              onAdauga={handleAdaugaRapid}
            />
          ))}
        </ul>
      )}

      {deschis && (
        <ExercitiuModal
          key={deschis.id}
          ex={deschis}
          idInJurnal={inJurnal.get(deschis.id)}
          onInchide={handleInchide}
          onAdauga={handleAdauga}
        />
      )}

      {mesaj && (
        <p className={styles.toast} role="status">
          ✓ {mesaj}
        </p>
      )}
    </div>
  );
}
