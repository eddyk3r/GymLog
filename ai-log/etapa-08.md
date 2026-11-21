# AI log: Stage 8 (routing and detail page)

## Conversations
- [Stage 8: routing and detail page](https://claude.ai/share/162a5c5f-43bc-464f-b948-93ae35a36e73)

## Tool used
Claude (Anthropic), with access to my project folder.

## What I asked
1. To do Stage 8 for GymLog after the stage guide (`TW_Etapa8_Ghid.pdf`): React Router, a detail page, an about page, a 404 page and CSS Modules.
2. To restructure the site: the exercises should not be added to the list directly; instead, buttons for every muscle group that lead to the exercise list, where each exercise has an Add button.
3. To keep adding exercises by hand.
4. Many preset exercises, each with a tutorial video and "exercise details" (body part, equipment, primary and secondary muscles), like on lyfta.app, with their pictures and videos.
5. An exercise page with all the exercises and pictures, the muscle groups on top (a click keeps only that group), and a pop-up with the details when an exercise is clicked.
6. To keep the design roughly the same, with improvements if they fit.

## What the AI gave me
- The route map in `App.jsx` (`/`, `/exercitii/:id` from `tw.json`, `/catalog`, `/despre`, `*`) and `Layout.jsx` with the ticker, the header with `NavLink`, the theme button and `<Outlet />`.
- `ExercitiuDetaliuPage.jsx`: `useParams`, `fetchExercitiu(id)`, effect on `[id]`, loading / error / detail states, a button to mark the exercise done, and the video and details for exercises from the catalog.
- A catalog of 192 exercises in 13 muscle groups, taken from the public exercise pages of lyfta.app (name, picture, video, body part, equipment, muscles, first steps), saved in `src/data/catalog.json`, plus the muscle group icons in `public/muscles/`.
- `CatalogPage.jsx` with the search box, the muscle group bar (`GrupeBar`), the grid of cards (`CatalogCard`) and the pop-up (`ExercitiuModal`, a `<dialog>`) with `ExercitiuDetalii`; the filters and the open exercise are kept in the address with `useSearchParams`.
- The journal page (`ExercitiiPage.jsx`) with the hero, the muscle group links, the manual form and the list with a progress bar; `ExercitiuCard` with the title as a link (`item-link`) and the exercise picture.
- `index.css` with only the shared styles and one `.module.css` for every component and page; `constants.js` instead of `etichete.js`.
- A new `db.json` with 8 entries, linked to the catalog through `catalogId`.
- The README Stage 8 section, the checklist table and this log.

## What I checked and changed myself
- (de completat: ce ai verificat tu în browser, ce ai schimbat)
- Ran `npm install`, `npm run api` and `npm run dev` in `frontend/`.
- Clicked a title in the list and checked that the address became `/exercitii/1`, then pressed Back.
- Refreshed `/exercitii/1`, opened `/exercitii/999` and `/ceva`.
- In the Network tab: no HTML document request when moving between pages, only fetch requests to the API.
- Ran in the console: `document.querySelectorAll("[data-testid=nav] a").length` and, on the detail page, `document.querySelector("[data-testid=detail-title]").textContent`.

## Problems and how they were solved
- **Module styles lost against global ones:** with `import App` before `import "./index.css"`, the global rules (for example `button:hover`) came after the module rules in the final CSS and won at the same specificity. Solved by importing `index.css` first in `main.jsx`.
- **The pop-up closed itself in development:** with `onClose` on the `<dialog>`, the `close()` from the effect cleanup (StrictMode mounts twice) fired the close event later. Solved by handling Esc with `onCancel` and closing from the page.
- **Keyframes in CSS Modules:** animation names are made local per module, so every module that animates defines its own `@keyframes`.
- **Muscle group bar too wide on the phone:** in a flex column with `align-items: center` the list took its content width; `width: 100%` makes it scroll horizontally instead.
- **Windows line endings:** git in the Linux environment saw every file as changed (CRLF); the commands were run with `core.autocrlf=true`.

## What I learned
- In an SPA, `<Link>` changes only the address and React draws the matching page; `<a href>` would reload everything and lose the state.
- `NavLink` marks the current page by itself; `end` on the `/` link is needed, otherwise it is active on every page.
- `useParams` returns text; the effect of the detail page depends on `[id]`, so it reloads when the address changes.
- The `*` route catches every address that did not match, and the detail page must also handle an id that does not exist on the server.
- CSS Modules give unique class names at build time; only the shared styles stay global.
- State can live in the address (`useSearchParams`): filters and the open pop-up survive Back / Forward and can be sent as a link.
