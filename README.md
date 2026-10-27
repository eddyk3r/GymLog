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
The list is rendered from the data, through components:
- `ExercitiuList` receives an array and renders one card per item (`map`, `key={exercitiu.id}`)
- `ExercitiuCard` receives a single item through props and displays it
- `CatalogExercitii` shows the muscle group buttons, a search field and the list of exercises to pick from

The list shows a message when there are no exercises, and each card changes
its look when the exercise is done (`facut`). The labels shown on screen
(`ETICHETE_GRUPE`, `ETICHETE_INTENSITATE`) are kept in `src/etichete.js`,
separate from the values in the data.

### Personalization
- **Pick by muscle group:** pressing a group lists its 10 exercises in a scrolling list. A search field filters them by name, inside the chosen group, or in all 110 exercises when no group is chosen.
- **Workout journal:** `+ Add` puts an exercise in "My exercises", which starts empty. An exercise that is already in the journal shows a disabled "Added" button.
- **In the journal** each card has a done / to do button and a delete button. The counter in the header is computed from the journal (total exercises and how many are still to do).
- **Gym look:** scrolling ticker with the muscle groups, animated header, hazard stripes, numbered cards, intensity badges and a counter that pulses.

The journal is kept in the state of `App` (`useState`) and is emptied when the page is reloaded.

## Stage 5: local state and events
The journal ("My exercises") lives in React state, in `App`. Checking and deleting work from the page,
and the counter in the header follows automatically. A button in the header switches between light and dark mode.
Changes are lost on refresh, which is what stage 6 and stage 10 fix.

- **State in the parent:** `App` holds the journal with `useState` and changes it only through `handleAdauga`, `handleToggleFacut` and `handleDelete`. Every update uses the function form (`setJurnal((prev) => ...)`) and builds a new array (spread, `map`, `filter`); nothing is changed in place.
- **Events through props:** `ExercitiuList` and `ExercitiuCard` receive `onToggle` and `onDelete` and call them with the exercise `id`; they never change the list themselves.
- **Controlled checkbox:** each card in the journal has a checkbox (`checked` + `onChange`) inside a `<label>`, so a click anywhere on the title ticks it, and a delete button with an `aria-label` that includes the exercise name.
- **Derived counter:** the number of exercises still to do is computed from the journal at every render (`jurnal.filter((e) => !e.facut).length`); it is not kept in state.
- **Light / dark theme:** the theme is a state (`tema`), started from the system theme. The button writes `data-theme` on `<html>`, and `App.css` redefines the colour variables for `:root[data-theme="dark"]`. The system dark block uses `:root:not([data-theme="light"])`, so the button works in both directions, whatever the system theme is.

The journal and the chosen theme are not saved: the page goes back to the system theme and an empty journal at reload.

## AI usage
AI was used as a learning and coding assistant. See `ai-log/` for the log of each stage.

## Status
- [x] Stage 1: static mockup
- [x] Stage 2: data logic in JavaScript
- [x] Stage 3: Vite and React project
- [x] Stage 4: components rendered from data
- [x] Stage 5: local state and events
- [ ] Stage 6: loading data from a mock API

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
| S4-R2 | card receives data through props | [ExercitiuCard.jsx#L3-L33](https://github.com/eddyk3r/GymLog/blob/main/frontend/src/components/ExercitiuCard.jsx#L3-L33) | read |
| S4-R3 | map + key={id}, no console warnings | [ExercitiuList.jsx#L10-L17](https://github.com/eddyk3r/GymLog/blob/main/frontend/src/components/ExercitiuList.jsx#L10-L17) | F12, Console |
| S4-R4 | message for empty list | [ExercitiuList.jsx#L4-L6](https://github.com/eddyk3r/GymLog/blob/main/frontend/src/components/ExercitiuList.jsx#L4-L6) | the journal starts empty (or set the array to []) |
| S4-R5 | state changes the card look | [ExercitiuCard.jsx#L5](https://github.com/eddyk3r/GymLog/blob/main/frontend/src/components/ExercitiuCard.jsx#L5) | press the To do / Done button on a card in "My exercises" |
| S4-R6 | README Stage 4 section + AI log | [README.md](https://github.com/eddyk3r/GymLog/blob/main/README.md), [ai-log/etapa-04.md](https://github.com/eddyk3r/GymLog/blob/main/ai-log/etapa-04.md) | read |
| S4-R7 | commit "Stage 4" pushed | [commit](https://github.com/eddyk3r/GymLog/commit/0c0993ab26c7046ac11a7ca07938dfba3a2c3671) | commit history |
| S4-P1 | personalization: muscle group picker, search and journal | [CatalogExercitii.jsx](https://github.com/eddyk3r/GymLog/blob/main/frontend/src/components/CatalogExercitii.jsx), [App.jsx](https://github.com/eddyk3r/GymLog/blob/main/frontend/src/App.jsx) | press a group, search, press + Add |

## Stage 5 checklist

| ID | Requirement | Where (permalink) | How to check |
|----|-------------|-------------------|--------------|
| S5-R1 | list kept in useState, in App | [App.jsx#L147](https://github.com/eddyk3r/GymLog/blob/main/frontend/src/App.jsx#L147) | read |
| S5-R2 | toggling changes state and card look | [App.jsx#L160-L164](https://github.com/eddyk3r/GymLog/blob/main/frontend/src/App.jsx#L160-L164), [ExercitiuCard.jsx#L25-L33](https://github.com/eddyk3r/GymLog/blob/main/frontend/src/components/ExercitiuCard.jsx#L25-L33) | click a checkbox in "My exercises" |
| S5-R3 | delete removes the item | [App.jsx#L166-L168](https://github.com/eddyk3r/GymLog/blob/main/frontend/src/App.jsx#L166-L168), [ExercitiuCard.jsx#L36-L43](https://github.com/eddyk3r/GymLog/blob/main/frontend/src/components/ExercitiuCard.jsx#L36-L43) | click ✕ on a card; after the last one the empty-list message appears |
| S5-R4 | header counter derived, not in state | [App.jsx#L178](https://github.com/eddyk3r/GymLog/blob/main/frontend/src/App.jsx#L178) | toggle, watch header |
| S5-R5 | immutable updates (no push, splice, assignment) | [App.jsx#L151-L168](https://github.com/eddyk3r/GymLog/blob/main/frontend/src/App.jsx#L151-L168) | read |
| S5-R6 | light / dark toggle: state + data-theme on html | [App.jsx#L170-L175](https://github.com/eddyk3r/GymLog/blob/main/frontend/src/App.jsx#L170-L175), [App.jsx#L190-L196](https://github.com/eddyk3r/GymLog/blob/main/frontend/src/App.jsx#L190-L196), [App.css#L530-L560](https://github.com/eddyk3r/GymLog/blob/main/frontend/src/App.css#L530-L560) | click the button, both system themes |
| S5-R7 | no console warnings; README + AI log | [README.md](https://github.com/eddyk3r/GymLog/blob/main/README.md), [ai-log/etapa-05.md](https://github.com/eddyk3r/GymLog/blob/main/ai-log/etapa-05.md) | F12, Console |
| S5-R8 | commit "Stage 5" pushed | [commits](https://github.com/eddyk3r/GymLog/commits/main) | commit history |