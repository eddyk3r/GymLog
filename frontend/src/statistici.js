// Calcule pe istoric (funcții pure: primesc date, întorc rezultate).
// Folosite de pagina Statistici și de harta musculară.

const ZI_MS = 24 * 60 * 60 * 1000;

// Data locală ca text "AAAA-LL-ZZ" (nu UTC, ca o zi să nu treacă la miezul nopții UTC)
export function cheieZi(data) {
  const d = new Date(data);
  const luna = String(d.getMonth() + 1).padStart(2, "0");
  const zi = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${luna}-${zi}`;
}

function inceputulZilei(data) {
  const d = new Date(data);
  d.setHours(0, 0, 0, 0);
  return d;
}

// { "2026-11-20": 4, ... } câte exerciții s-au terminat în fiecare zi
export function numarPeZi(istoric) {
  return istoric.reduce((acc, i) => {
    const k = cheieZi(i.data);
    acc[k] = (acc[k] ?? 0) + 1;
    return acc;
  }, {});
}

// Seria curentă: zile consecutive cu antrenament, până azi.
// Dacă azi încă nu ai făcut nimic, seria de până ieri încă este valabilă.
export function serieCurenta(peZi, azi) {
  let d = inceputulZilei(azi);
  if (!peZi[cheieZi(d)]) d = new Date(d.getTime() - ZI_MS);
  let serie = 0;
  while (peZi[cheieZi(d)]) {
    serie += 1;
    d = new Date(d.getTime() - ZI_MS);
  }
  return serie;
}

// Cea mai lungă serie din tot istoricul
export function serieMaxima(peZi) {
  const zile = Object.keys(peZi).sort();
  let max = 0;
  let curenta = 0;
  let anterioara = null;
  for (const k of zile) {
    const t = new Date(`${k}T00:00:00`).getTime();
    curenta = anterioara !== null && Math.round((t - anterioara) / ZI_MS) === 1 ? curenta + 1 : 1;
    max = Math.max(max, curenta);
    anterioara = t;
  }
  return max;
}

// Grila calendarului: `saptamani` coloane, de luni până duminică, ultima coloană conține ziua de azi
export function grilaCalendar(peZi, azi, saptamani = 18) {
  const ziua = inceputulZilei(azi);
  const deLaLuni = (ziua.getDay() + 6) % 7; // luni = 0
  const start = new Date(ziua.getTime() - (deLaLuni + (saptamani - 1) * 7) * ZI_MS);
  const coloane = [];
  for (let s = 0; s < saptamani; s++) {
    const zile = [];
    for (let z = 0; z < 7; z++) {
      const d = new Date(start.getTime() + (s * 7 + z) * ZI_MS);
      const k = cheieZi(d);
      zile.push({ cheie: k, data: d, numar: peZi[k] ?? 0, viitor: d > ziua });
    }
    coloane.push(zile);
  }
  return coloane;
}

// { piept: 12, spate: 5, ... } în ultimele `zile` zile (sau tot istoricul, cu zile = null)
export function numarPeGrupa(istoric, azi, zile = 30) {
  const limita = zile ? inceputulZilei(azi).getTime() - (zile - 1) * ZI_MS : -Infinity;
  return istoric.reduce((acc, i) => {
    if (new Date(i.data).getTime() >= limita) {
      acc[i.grupa] = (acc[i.grupa] ?? 0) + 1;
    }
    return acc;
  }, {});
}
