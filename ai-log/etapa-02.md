# Stage 2: AI log

## Tools
- Claude (Anthropic), chat interface: reading the stage document, step-by-step guidance, first drafts of `exercitii.js` and of the Stage 2 part of README.md, explanations of the console output.

## Conversations
- [<https://claude.ai/share/ADAUGA-LINKUL-CONVERSATIEI> (Stage 2: data logic, 110 exercises, console tests, README)](https://claude.ai/share/fe1de4b5-2036-4ab7-b5c9-ac8729ddb5e0)

## Key requests
### 1. Steps of the stage and first version of the JavaScript file
- Asked: all the steps of Stage 2 and the code for them, based on the stage document.
- Got: a file with the array, the functions for list, count, search, add with validation, toggle and delete, and the console tests grouped by sections.
- Changed or rejected: the first version used field names that did not match my Stage 1 page. I sent my real `index.html`, so the fields became `exercitiu` and `intensitate` (light, medium, intense) and `index.html` only got the `<script src="exercitii.js">` line before `</body>`.

### 2. More exercises and the muscle group
- Asked: many gym exercises, at least 10 for each muscle group, inspired by the Lyfta app.
- Got: 110 exercises in 11 groups (chest, back, shoulders, biceps, triceps, forearms, abs, quadriceps, hamstrings, glutes, calves), each with an intensity.
- Changed or rejected: the muscle group became a new field `grupa`, so the search covers it and the validation checks it against `GRUPE`, as the stage document says for extra fields. The page in `index.html` stays with its three static cards.

### 3. README and checks
- Asked: the README updated for Stage 2, then without the demo page.
- Got: a Stage 2 section with the data model, a table of the functions (map, filter, reduce, spread) and the status list.
- Changed or rejected: I removed the mention of the demo page. I checked the console output myself (screenshot) against the stage checklist.

## What I learned / what did not work
- `map`, `filter` and `reduce` return something new and do not change the original array; `push` and direct assignment do.
- `nextId` uses `reduce` (maximum id plus one), because `lista.length + 1` creates duplicate ids after a delete.
- A function that returns a new list (`[...lista, nou]`, `{ ...e, facut: !e.facut }`) leaves the original unchanged; the console line "Originalul a rămas cu: 110 exerciții" shows this.
- The console only shows what the file prints when the page loads. The form in the page is not connected to the code in this stage, so adding an exercise there changes nothing.
