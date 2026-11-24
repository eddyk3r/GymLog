# AI log: Stage 9 (own backend with Node.js and Express)

## Conversations
- [Stage 9: own backend](LINK_CONVERSATIE) <!-- de înlocuit cu linkul de share al conversației -->

## Tool used
Claude (Anthropic), with access to my project folder.

## What I asked
1. To do Stage 9 for GymLog after the stage guide (`TW_Etapa9_Ghid_VC_1.pdf`): replace json-server with my own Express API, with all five REST routes, server side validation, correct HTTP codes and CORS.
2. To keep the whole app working as before (journal, catalog, workout mode, stats, body map, progress with kg and reps), so the history used by the stats also needed routes on the new server.
3. To update the README (Stage 9 section, how to run, status, checklist table) and to write this log.

## What the AI gave me
- `backend/` with `package.json` (`"type": "module"`, Express 5, `cors`, `npm start` / `npm run dev`), `.gitignore`, `.env.example` and `package-lock.json` (needed for `npm ci`).
- `src/app.js` (CORS from `CORS_ORIGIN`, `express.json()`, `/health`, the routers, the 404 route and the central error handler) and `src/server.js` (only `app.listen`), kept apart as in the guide.
- `src/routes/exercitii.js`: the five routes for the journal, with `gasesteIndex` for the 400 / 404 checks; the data starts with the 7 entries from the old `db.json`.
- `src/routes/istoric.js`: `GET` and `POST /istoric`, because the stats, the body map and the progress chart read and write the history.
- `src/validation.js`: `valideazaExercitiu` (also with `partial` for PATCH), `valideazaIstoric` and `parseId`; the fixed values (`GRUPE`, `INTENSITATI`) are copied from `constants.js`, and only known fields are kept.
- In the frontend: `request` in `api.js` reads `{ error }`, `mesajEroare` shows the server message, the hints that said "npm run api" now point to the backend, the about page lists Node.js and Express; `db.json`, the `api` script and `json-server` were removed and `npm install` updated the lock file.
- The README Stage 9 section with the curl commands, the "How to run" section, the status list, the checklist table and this log.

## What was checked
- Started the backend and called every route with curl: list 200, POST 201 (the server gives id 8 and ignores the `id` and `user_id` sent by the client), GET 200, PATCH 200, DELETE 204, GET on the deleted id 404 with `{ "error": "Exercițiul nu există" }`.
- Invalid data: an empty object, an empty name, a request without a body, broken JSON, an unknown intensity and the id `abc` all return 400 with a clear message; an unknown address returns 404 "Ruta nu există".
- The POST built like the automatic checker does it (`exercitiu`, `facut: false` and the `sample` from `tw.json`) passes validation.
- `POST /istoric` with sets (kg and reps) is accepted, a wrong muscle group is rejected.
- The answer has `Access-Control-Allow-Origin: http://localhost:5173`, and the preflight for PATCH allows the method.
- `npm ci` on a clean copy of `backend/` works; in `frontend/` the lint passes and `vite build` with `VITE_API_URL=http://localhost:3001` builds.
- `json-server` no longer appears in `frontend/package.json` or `package-lock.json`.

## Problems and how they were solved
- **The history had no server:** with json-server, `/istoric` existed for free because it was a key in `db.json`. The new server would have answered 404 and the stats would have stayed empty, so `routes/istoric.js` and `valideazaIstoric` were added.
- **Undo after delete used the same id:** the frontend sent the old object back with its `id`; the allow list now ignores it and the server gives a new id, which is the correct behaviour for a POST.
- **The error message was not visible:** `mesajEroare` only built "Eroare server: 404" from the status; it now prefers the message sent by the server.
- **Windows line endings:** git in the Linux environment saw files as changed (CRLF); the git commands were run with `core.autocrlf=true`.

## What I learned
- json-server was doing a lot by itself: ids, codes, CORS and any resource found in `db.json`. With my own server every route, code and header has to be written.
- Express decides by order: middleware first, then routes, then the 404 route, then the function with four parameters for errors.
- Validation in the form is not enough: anyone can call the API with curl, so the server checks everything and keeps only the fields it knows.
- CORS is enforced by the browser and fixed on the server; `localhost` and `127.0.0.1` are different origins.
- Keeping `fetch` only in `api.js` (stage 6) meant the frontend barely changed when the server was replaced.
