# AI log: Stage 6 (data from a mock API)

## Conversations
- [Stage 6: data from a mock API](https://claude.ai/share/1b2553c0-9f84-4be1-a4b6-95465a68c8a3)

## Tool used
Claude (Anthropic), in the chat interface.

## What I asked
1. What has to be added to GymLog for Stage 6, given the stage guide (`TW_Etapa6_Ghid.pdf`).
2. To convert my `exercitii` array (110 exercises) into a `db.json` file for json-server.
3. What to do after creating `db.json`.
4. Why `npm run api` and `npm run dev` failed with `ENOENT` (`package.json` not found), and later with `Missing script: "api"`.
5. For the complete `App.jsx`, because I did not know where the code fragments from the steps go.
6. Where the `.info` and `.error` styles go in `App.css`.
7. For the Stage 6 section of the README and the Stage 6 checklist table.

## What the AI gave me
- The adaptation of the guide to my theme: resource `exercitii` (route `/exercitii`), function `fetchExercitii`, loading message "Se încarcă exercițiile...", and the field `facut` instead of `gata`.
- `db.json` with all 110 exercises, generated from my array (same ids, groups and intensities; only `Pull-ups` has `facut: true`).
- `src/api.js` with `API_URL` read from `VITE_API_URL` and `fetchExercitii` that checks `res.ok`, plus `.env.example`.
- A complete `App.jsx`: the array was replaced by `useState([])`, with the new states `loading` and `error`, a `useEffect` with `[]` and an `ignore` flag for cleanup, and the three states (loading, error, catalog) shown in the "Add exercise" panel.
- The CSS for `.info` and `.error`, and the variables `--error-bg` and `--error-border` for both themes.
- A README Stage 6 section, the updated status list and the checklist table with permalinks.

## What I checked and changed myself
- Installed `json-server@0.17.4` in `frontend/` (version fixed, as the guide requires; I did not run `npm audit fix --force`).
- Added the `"api": "json-server --watch db.json --port 3001"` script to `frontend/package.json`.
- Opened `http://localhost:3001/exercitii` in the browser to check that the route returns JSON before changing the React code.
- Ran the two terminals (`npm run api` and `npm run dev`, both in `frontend/`).
- Tested the three states: catalog loaded with the API running, error message with the API stopped, loading message with `--delay 4000`.
- Checked in the Network tab that there are two requests to `/exercitii` in development (React mounts the component twice) and that `fetch` appears only in `api.js`.
- Checked the line numbers in the checklist permalinks against my own files and replaced the commit hash.

## Problems and how they were solved
- **`npm error ENOENT ... package.json`:** I ran `npm run api` from `GymLog/` instead of `GymLog/frontend/`. Solved with `cd frontend`.
- **`Missing script: "api"`:** the script was not yet in `package.json`. I added it inside `scripts` (with a comma after the previous line) and saved the file.
- **Where the code fragments go:** the step-by-step fragments were not enough for me, so I asked for the full `App.jsx`. Only the catalog depends on the API; the journal ("My exercises"), the theme and the counter stay local.

## What I learned
- `fetch` does not throw on 404 or 500, only when the server cannot be reached, so `res.ok` must be checked.
- `useEffect` with `[]` runs once after the first render; the function passed to it cannot be `async`, so `load()` is defined inside it.
- Every load has three states (loading, success, error) and each one needs something on screen.
- Checking and deleting still change only the state, so they are lost on refresh; saving them on the server is stage 7.