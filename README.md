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
moved into the main component; the list is still printed raw (replaced by cards in stage 4).
The header shows the app name and a counter computed from the data
(total exercises, and how many are still to do). The stage 1 styles are reused in `frontend/src/App.css`.
The stage 1 and 2 files were moved to `mockup/`.

### How to run
```
cd frontend
npm install
npm run dev
```
Then open the address printed in the terminal (http://localhost:5173).

## Stage 4: components
The list is rendered from the data, through two components:
- `ExercitiuList` receives the whole array and renders one card per item
- `ExercitiuCard` receives a single item through props and displays it

The list shows a message when there are no exercises, and each card changes
its look when the exercise is done (`facut`).

## AI usage
AI was used as a learning and coding assistant. See `ai-log/` for the log of each stage.

## Status
- [x] Stage 1: static mockup
- [x] Stage 2: data logic in JavaScript
- [x] Stage 3: Vite and React project
- [x] Stage 4: components rendered from data
- [ ] Stage 5: local state and events

## Stage 3 checklist

| ID | Requirement | Where (permalink) | How to check |
|----|-------------|-------------------|--------------|
| S3-R1 | npm run dev starts without errors | [frontend/package.json](https://github.com/eddyk3r/GymLog/blob/main/frontend/package.json) | npm install, npm run dev |
| S3-R2 | app name and counter computed from data | [frontend/src/App.jsx#L135-L154](https://github.com/eddyk3r/GymLog/blob/fe6289af2dd7aeca955c0c4f61854b5070bfec60/frontend/src/App.jsx#L135-L154) | edit data, save |
| S3-R3 | data from README, not from the example | [frontend/src/App.jsx#L1-L133](https://github.com/eddyk3r/GymLog/blob/fe6289af2dd7aeca955c0c4f61854b5070bfec60/frontend/src/App.jsx#L1-L133) | compare with README |
| S3-R4 | stage 1 styles reused | [frontend/src/App.css](https://github.com/eddyk3r/GymLog/blob/main/frontend/src/App.css) | look at the page |
| S3-R5 | node_modules ignored, build passes | [frontend/.gitignore](https://github.com/eddyk3r/GymLog/blob/main/frontend/.gitignore) | npm run build |
| S3-R6 | README Stage 3 section + AI log | [README.md](https://github.com/eddyk3r/GymLog/blob/main/README.md), [ai-log/etapa-03.md](https://github.com/eddyk3r/GymLog/blob/main/ai-log/etapa-03.md) | read |
| S3-R7 | commit "Stage 3" pushed | [commit](https://github.com/eddyk3r/GymLog/commit/fe6289af2dd7aeca955c0c4f61854b5070bfec60) | commit history |

## Stage 4 checklist

| ID | Requirement | Where (permalink) | How to check |
|----|-------------|-------------------|--------------|
| S4-R1 | 2+ components in src/components/ | [frontend/src/components/](https://github.com/eddyk3r/GymLog/tree/main/frontend/src/components) | open folder |
| S4-R2 | card receives data through props | [ExercitiuCard.jsx](https://github.com/eddyk3r/GymLog/blob/main/frontend/src/components/ExercitiuCard.jsx#L17-L30) | read |
| S4-R3 | map + key={id}, no console warnings | [ExercitiuList.jsx](https://github.com/eddyk3r/GymLog/blob/main/frontend/src/components/ExercitiuList.jsx#L8-L14) | F12, Console |
| S4-R4 | message for empty list | [ExercitiuList.jsx](https://github.com/eddyk3r/GymLog/blob/main/frontend/src/components/ExercitiuList.jsx#L4-L6) | set array to [] |
| S4-R5 | state changes the card look | [ExercitiuCard.jsx](https://github.com/eddyk3r/GymLog/blob/main/frontend/src/components/ExercitiuCard.jsx#L19) | toggle a done flag |
| S4-R6 | README Stage 4 section + AI log | [README.md](https://github.com/eddyk3r/GymLog/blob/main/README.md), [ai-log/etapa-04.md](https://github.com/eddyk3r/GymLog/blob/main/ai-log/etapa-04.md) | read |
| S4-R7 | commit "Stage 4" pushed | [commit](https://github.com/eddyk3r/GymLog/commit/0d52aa535e72088e84a88e68c06748a588c01214) | commit history |