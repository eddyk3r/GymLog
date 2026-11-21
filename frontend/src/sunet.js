// Sunete scurte generate în browser (Web Audio API), fără fișiere audio.
// Browserul permite sunetul doar după o acțiune a utilizatorului,
// deci contextul audio se creează la apăsarea butonului „Începe”.

let context = null;

export function pornesteSunetul() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!context && Ctx) context = new Ctx();
    if (context?.state === "suspended") context.resume();
  } catch {
    context = null; // fără sunet, antrenamentul merge mai departe
  }
}

// Un „bip”: frecvența în Hz, durata în milisecunde
export function bip(frecventa = 880, durata = 150) {
  if (!context) return;
  const osc = context.createOscillator();
  const volum = context.createGain();
  osc.type = "square";
  osc.frequency.value = frecventa;
  volum.gain.setValueAtTime(0.08, context.currentTime);
  volum.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + durata / 1000);
  osc.connect(volum).connect(context.destination);
  osc.start();
  osc.stop(context.currentTime + durata / 1000);
}
