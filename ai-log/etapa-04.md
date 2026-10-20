# Stage 4: AI log

## Tools
- Claude (Anthropic), chat interface: reading the stage document, step-by-step guidance, adapting the steps to my theme (GymLog), first drafts of the components, of the personalization (muscle group picker with search and journal), of the extra CSS and of the Stage 4 part of README.md.

## Conversations
- [Stage 4: components rendered from data](https://claude.ai/share/d6b408ad-7f27-4553-ab28-c5e40321f88a)

## Key requests
### 1. Steps of the stage adapted to my theme
- Asked: all the steps of Stage 4, based on the stage document.
- Got: the names from table 4.1 for my theme (`ExercitiuCard`, `ExercitiuList`, prop `exercitii`, labels for intensity and muscle group, the empty-list message) and the steps in order.
- Changed or rejected: the document uses `task-card` and `task-list`; my CSS from Stage 1 uses `item-card` and `item-list`, so I used those. I also show the muscle group (`grupa`) under the title, as the document says for extra fields of the theme.

### 2. The two components
- Asked: the code for `ExercitiuCard.jsx` and `ExercitiuList.jsx`.
- Got: the card receives one exercise through props, picks the class `done` from `facut` and builds the badge class from the intensity; the list returns the empty-list message first and then renders one card per item with `map` and `key={exercitiu.id}`.
- Changed or rejected: I added a small CSS rule for the `.grupa` line, because the group label had no style in Stage 1.

### 3. Where the list goes in App.jsx
- Asked: which panel and which lines to replace in `App.jsx`.
- Got: in the "Exercițiile mele" section I replaced the temporary comment and the `<pre>{JSON.stringify(...)}</pre>` with `<ExercitiuList exercitii={exercitii} />`, and I added the import at the top of the file.
- Changed or rejected: at this point nothing else in `App.jsx` was changed; the personalization in request 5 changed it later.

### 4. Tests and README
- Asked: how to test the special cases and what to write in the README.
- Got: the three tests (missing `key`, empty array, changed `facut`) and the Stage 4 section with the status list.
- Changed or rejected: I did the tests myself in the browser (F12, Console) and put the data back afterwards.

### 5. Personalization: muscle group picker, search and journal
- Asked: a version where I press a muscle group, see its exercises in a list, pick the ones I want and add them to my journal, with a search bar in that list to find an exercise faster.
- Got: a new component `CatalogExercitii.jsx` (group buttons, search field, scrolling list with `+ Add`), the labels moved to `src/etichete.js`, optional done / delete buttons in `ExercitiuCard` and `ExercitiuList` (passed as props), the journal kept in `App.jsx` with `useState`, two columns in the layout and extra CSS (`.chip`, `.mini`, `.catalog-list`).
- Changed or rejected: the journal starts empty, so the empty-list message from Stage 4 is the first thing the page shows; the whole `exercitii` array stays in `App.jsx` as the catalog. I kept `ExercitiuCard` and `ExercitiuList` as the base of the Stage 4 requirements (props, `map` with `key={id}`, empty message, `done` look) and tested adding, marking, deleting and searching myself. I also kept my own header, ticker and footer from Stage 1.

### 6. CSS bug: cards cut in the scrolling list
- Asked: why some exercises in the picker showed only the intensity and others only the name.
- Got: the cards were squeezed vertically, because the list has a maximum height and its children are flex items; as `.item-card` has `overflow: hidden`, the part that did not fit was cut off. Fix: `flex-shrink: 0` on the cards, `white-space: nowrap` on the badge, and an orange scrollbar.
- Changed or rejected: I applied the fix in `App.css` and checked in the browser that every card shows the number, the name, the intensity and the `+ Add` button.

## What I learned / what did not work
- Props are read-only; the card receives the data and does not read the array directly.
- `key` goes on the component returned directly from `map` and uses the `id`, not the position; without it React prints a warning in the console.
- The empty-list check is an early `return`, so the component stops before `map`.
- In `map` I use round brackets (`=> ( ... )`) so the JSX is returned; with curly braces it needs `return`.
- The prop name on the left (`exercitii=`) must be identical to the destructured name in the child, otherwise the child receives `undefined`.
- The labels (`ușoară`, `Piept`) are separate from the values in the data (`usoara`, `piept`); in the personalization I moved them to one file used by several components.
- A component can also receive functions as props (`onComuta`, `onSterge`, `onAdauga`): the child calls them, and the parent (`App`) is the one that changes the data. The cards do not change the array themselves.
- The journal is a copy of the exercise with `facut: false`; marking or deleting changes the journal and never the catalog. Each update creates a new array (`[...jurnal, nou]`, `map`, `filter`), as in Stage 2.
- A scrolling list inside a flex column squeezes its children unless they have `flex-shrink: 0`; with `overflow: hidden` the squeezed content disappears instead of overflowing.
- The journal is not saved: the page forgets it at reload (a later stage can fix this).