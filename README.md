# GymLog

A workout log built step by step for the Tehnologii Web course (Politehnica București, 2026-2027).
Each exercise has a name, an intensity (light, medium, intense) and a done / to do state.

## Stage 1: static mockup
Plain HTML and CSS page (`index.html`, `style.css`) showing the header, the add form
and the list of exercises. No JavaScript.

## Stage 2: data logic
Plain JavaScript, no DOM. `exercitii.js` holds the array and the functions
that read and change it. Results are printed in the browser console (F12).

Data model: `{ id, exercitiu, facut, intensitate }`, where `intensitate` is one of
`usoara, medie, intensa`.

| Operation | Function | Method used |
|-----------|----------|-------------|
| Read: list exercises | `listeazaExercitii(lista)` | `map` |
| Read: count to do | `numaraDeFacut(lista)` | `filter` |
| Read: search by name | `cautaDupaNume(lista, text)` | `filter`, `includes` |
| Create (with validation) | `adaugaExercitiu(lista, exercitiu, intensitate)` | spread, `nextId` (`reduce`) |
| Update: toggle done | `comutaFacut(lista, id)` | `map`, spread |
| Delete | `stergeExercitiu(lista, id)` | `filter` |

No function changes the array it receives; each one returns a new list.
Adding rejects an empty name and an unknown intensity, with a message in the console.

How to run: open `index.html` in a browser, press F12 and read the Console tab.

## AI usage
AI was used as a learning and coding assistant. See `ai-log/` for the log of each stage.

## Status
- [x] Stage 1: static mockup
- [x] Stage 2: data logic in JavaScript
- [ ] Stage 3: Vite and React project
