# Stage 5: AI log

## Tools
- Claude (Anthropic), chat interface: reading the stage document, adapting the steps to my theme (GymLog), and rewriting `App.jsx`, `ExercitiuList.jsx`, `ExercitiuCard.jsx` and `App.css` for local state, the checkbox, the delete button and the light / dark theme button.

## Conversations
- [Stage 5: local state and events](https://claude.ai/share/5b6971c0-e5f1-40a4-9ccb-1e2d4ee8c5bf)

## Key requests
### 1. Steps of the stage adapted to my theme
- Asked: to start Stage 5 of GymLog, based on the stage document.
- Got: the three parts of the stage (list in `useState` with toggle and delete, header counter as a derived value, light / dark button) and the names from table 5.1 for my theme: `facut` as the toggled field, `handleToggleFacut`, the exercise name next to the checkbox, and "exerciții de făcut" (the ones with `facut: false`) as the header number.
- Changed or rejected: the first answer used `exercitii` / `setExercitii` as the state. After I sent my `App.jsx`, it turned out that the list in state is the journal (`jurnal` / `setJurnal`) and the array `exercitii` is the catalog, so the catalog stays a constant and the state, the counter and the handlers work on `jurnal`.

### 2. App.jsx: state, handlers, counter and theme button
- Asked: to complete `App.jsx` fully, from the file I sent.
- Got: the journal was already in `useState`, but four things were aligned with the stage: updates now use the function form `setJurnal((prev) => ...)` instead of `setJurnal(jurnal.map(...))`; the props `onComuta` / `onSterge` became `onToggle` / `onDelete`; the functions got the `handle` prefix (`handleAdauga`, `handleToggleFacut`, `handleDelete`); and the theme was added (`tema` state started from the system theme with `useState(temaInitiala)`, `handleTema` that writes `data-theme` on `<html>`, and the button with `aria-pressed` first in the header). The counter `deFacut = jurnal.filter((e) => !e.facut).length` is calculated before `return`, not kept in state.
- Changed or rejected: the catalog, the ticker, the two panels and the footer stayed as they were; `CatalogExercitii` still receives `onAdauga`, and `handleAdauga` does not add the same exercise twice.

### 3. ExercitiuList.jsx
- Asked: the complete list component.
- Got: only the props were renamed to `onToggle` and `onDelete` and passed to every card. The empty-list message, `key={exercitiu.id}` and the class `item-list` from Stage 4 stayed the same.
- Changed or rejected: nothing else. I was warned that the list, the card and `App.jsx` must be replaced together, otherwise the buttons stop working.

### 4. ExercitiuCard.jsx: checkbox and delete button
- Asked: the complete card component.
- Got: the "Făcut / De făcut" button was replaced by a controlled checkbox (`checked` + `onChange`) inside a `<label className="item-main">`, so the click works anywhere on the title; the delete button `✕` kept its `aria-label` with the exercise name.
- Changed or rejected: I used my classes (`item-card`, `item-main`, `.mini` for the delete button) instead of `task-card`, `task-main` and `.btn-danger` from the document, because `.btn-danger` uses a variable (`--mare`) that my CSS does not have. I kept the display-only case (no functions received, only the `.status` label), in case a place uses the card without buttons.

### 5. App.css: checkbox, dark theme and theme button
- Asked: the complete `App.css`, changed for Stage 5.
- Got: four changes: `.item-card > div` became `.item-card > .item-main`, so `.card-actions` is not stretched; the system dark block uses `:root:not([data-theme="light"])`; new `:root[data-theme="dark"]` with the same values (the dark values from Stage 1), the checkbox style (`.item-main`) and the `.theme-toggle` button in the corner of the header; on narrow screens the header has more top padding so the button does not overlap the text.
- Changed or rejected: the document's dark colours were replaced with mine, and the theme switch works only through CSS variables, without duplicate rules for each component. The theme button also hides the shine effect of the global `button` style (`.theme-toggle::after { display: none; }`).

### 6. What was left to check
- Asked: what to check before the commit.
- Got: toggle a card (title crossed out, counter goes down); delete all cards (empty-list message, counter 0); the theme button works both ways with the system on light and on dark (DevTools, Rendering, `prefers-color-scheme`); no console warnings; no `push`, `splice` or direct assignment on state. The README section, this log and the commits `Stage 5: local state and events` and `Stage 5: checklist` come after.
- Changed or rejected: it also asked whether `CatalogExercitii.jsx` renders its own cards with `ExercitiuCard`; if it does, that file must be aligned with the new card too.

## What I learned / what did not work
- The data stays in the parent (`App`) and the child only announces what the user did by calling a function received through props; the card never changes the list itself.
- When the new value depends on the old one, `setJurnal((prev) => ...)` is used; the updates stay immutable (`[...prev, nou]`, `map` with `{ ...e, facut: !e.facut }`, `filter`), with no `push`, `splice` or assignment on elements.
- The header counter is a derived value: it is calculated from `jurnal` at every render, so it cannot fall behind the data, and it needs no `useState` of its own.
- A controlled checkbox needs both `checked` and `onChange`; without `onChange` React prints a warning and the checkbox stops changing.
- It is `onClick={() => onDelete(id)}`, not `onClick={onDelete(id)}`; the second form calls the function at render and empties the list before any click.
- When a prop is renamed (`onComuta` to `onToggle`), the whole chain changes at the same time (`App`, list, card); otherwise the child receives `undefined` and the buttons do nothing.
- `useState(temaInitiala)` receives the function, without parentheses, so React calls it only once, at the first render.
- The theme is changed by writing `data-theme` on `<html>` inside the click handler, not in the body of the component; the CSS only redefines the variables for that attribute.
- Without `:not([data-theme="light"])` in the `@media` block, the page stays dark when the system is dark, even if the user chose the light theme from the button.
- The global style of `button` (shine, offset shadow) also applied to the theme button, so the button needed its own overrides.
- The journal and the chosen theme are not saved: the page forgets them at reload (a later stage can fix this).