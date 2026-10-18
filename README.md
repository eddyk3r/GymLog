# GymLog

A workout log built step by step for the Tehnologii Web course (Politehnica București, 2026-2027).
Each exercise has a name, a muscle group, an intensity (light, medium, intense) and a done / to do state.

## Stage 1: static mockup
Plain HTML and CSS page (`mockup/index.html`, `mockup/style.css`) showing the header, the add form
and the list of exercises. No JavaScript.

## Stage 2: data logic
Plain JavaScript, no DOM. `mockup/exercitii.js` holds the array and the functions
that read and change it. Results are printed in the browser console (F12).

Data: 110 exercises, 10 for each muscle group. Data model:
`{ id, exercitiu, grupa, intensitate, facut }`, where
`grupa` is one of `piept, spate, umeri, biceps, triceps, antebrate, abdomen, cvadricepsi, ischiogambieri, fesieri, gambe`
and `intensitate` is one of `usoara, medie, intensa`.

| Operation | Function | Method used |
|-----------|----------|-------------|
| Read: list exercises | `listeazaExercitii(lista)` | `map` |
| Read: count to do | `numaraDeFacut(lista)` | `filter` |
| Read: search by name or muscle group | `cautaExercitii(lista, text)` | `filter`, `includes` |
| Create (with validation) | `adaugaExercitiu(lista, exercitiu, grupa, intensitate)` | spread, `nextId` (`reduce`) |
| Update: toggle done | `comutaFacut(lista, id)` | `map`, spread |
| Delete | `stergeExercitiu(lista, id)` | `filter` |

No function changes the array it receives; each one returns a new list.
Adding rejects an empty name, an unknown muscle group and an unknown intensity, with a message in the console.

How to run (stage 2): open `mockup/index.html` in a browser, press F12 and read the Console tab.

## Stage 3: Vite and React project
The app now lives in `frontend/`, built with Vite. The data from stage 2
moved into the main component; the list is still printed raw.
The header shows the app name and a counter computed from the data
(total exercises, and how many are still to do). The stage 1 styles are reused in `frontend/src/App.css`.
The stage 1 and 2 files were moved to `mockup/`.

## How to run
cd frontend
npm install
npm run dev
Then open the address printed in the terminal (http://localhost:5173).

## AI usage
AI was used as a learning and coding assistant. See `ai-log/` for the log of each stage.

## Status
- [x] Stage 1: static mockup
- [x] Stage 2: data logic in JavaScript
- [x] Stage 3: Vite and React project