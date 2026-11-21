import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import CatalogCard from "../components/CatalogCard.jsx";
import ExercitiuModal from "../components/ExercitiuModal.jsx";
import GrupeBar from "../components/GrupeBar.jsx";
import { CATALOG, NUMAR_PE_GRUPA, gasesteInCatalog } from "../data/catalog.js";
import { useLimba } from "../i18n/limba.js";
import { createExercitiu, fetchExercitii } from "../api.js";
import styles from "./CatalogPage.module.css";

// Pagina Exerciții: tot catalogul, cu filtrare pe grupe și căutare.
// Filtrele și exercițiul deschis stau în adresă (?grupa=piept&q=press&ex=bench-press),
// deci butoanele Înapoi / Înainte și un link trimis cuiva păstrează ce se vede.
export default function CatalogPage() {
  const { t, numeGrupa, numeEx, mesajEroare } = useLimba();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const grupa = params.get("grupa") ?? "";
  const q = params.get("q") ?? "";
  const deschis = gasesteInCatalog(params.get("ex") ?? "");

  // Jurnalul de pe server: ca să știm ce e deja adăugat
  const [jurnal, setJurnal] = useState([]);
  const [eroare, setEroare] = useState(null);
  const [adaugat, setAdaugat] = useState(null); // exercițiul pentru mesajul „Adăugat”

  useEffect(() => {
    let ignore = false;
    fetchExercitii()
      .then((data) => {
        if (!ignore) setJurnal(data);
      })
      .catch((err) => {
        if (!ignore) setEroare(err);
      });
    return () => {
      ignore = true;
    };
  }, []);

  // Mesajul „Adăugat” dispare singur după câteva secunde
  useEffect(() => {
    if (!adaugat) return undefined;
    const timer = setTimeout(() => setAdaugat(null), 2600);
    return () => clearTimeout(timer);
  }, [adaugat]);

  // catalogId -> id-ul din jurnal
  const inJurnal = new Map(
    jurnal.filter((e) => e.catalogId).map((e) => [e.catalogId, e.id])
  );

  // căutarea găsește exercițiul după numele în engleză sau în română
  const cautare = q.trim().toLowerCase();
  const rezultate = CATALOG.filter(
    (e) =>
      (grupa === "" || e.grupa === grupa) &&
      (cautare === "" ||
        e.nume.toLowerCase().includes(cautare) ||
        e.numeRo.toLowerCase().includes(cautare))
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

  // Întâi serverul, apoi state-ul (ca în pagina Jurnal).
  // În db.json se salvează numele în engleză; afișarea îl traduce prin catalogId.
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
    setAdaugat(ex);
  }

  // Pentru butonul de pe card: eroarea se afișează sus, în pagină
  async function handleAdaugaRapid(ex) {
    try {
      await handleAdauga(ex);
    } catch (err) {
      setEroare(err);
    }
  }

  const titlu = grupa ? numeGrupa(grupa) : t("cat.toate");

  return (
    <div className="wrap">
      <section className={styles.top}>
        <label className={styles.search}>
          <span className={styles.lupa} aria-hidden="true">⌕</span>
          <input
            type="search"
            placeholder={grupa ? t("cat.cautaIn", titlu) : t("cat.cauta")}
            value={q}
            onChange={(e) => schimba("q", e.target.value, { replace: true })}
            aria-label={t("cat.cauta")}
          />
        </label>
        <GrupeBar activa={grupa} numar={NUMAR_PE_GRUPA} onAlege={handleGrupa} />
      </section>

      <div className={styles.head}>
        <h1 className={styles.titlu}>
          {titlu} <span>{rezultate.length}</span>
        </h1>
        <p className="info">{t("cat.hint")}</p>
      </div>

      {eroare && <p className="error">{t("cat.eroareJurnal", mesajEroare(eroare))}</p>}

      {rezultate.length === 0 ? (
        <p className="empty">{t("cat.niciunul")}</p>
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

      {adaugat && (
        <p className={styles.toast} role="status">
          ✓ {t("cat.adaugat", numeEx(adaugat))}
        </p>
      )}
    </div>
  );
}
