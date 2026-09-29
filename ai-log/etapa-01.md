# Stage 1: AI log

## Tools
- Claude (Anthropic), chat interface: choosing the theme, step-by-step guidance for the stage, first drafts of README.md, index.html and style.css, explanations about Git/GitHub.

## Conversations
- <https://claude.ai/share/4b309555-54c9-4980-b368-9b4a77fc6f6e> (choosing the GymLog theme, README draft, HTML/CSS mockup, Git and GitHub steps)

## Key requests
### 1. Choosing the theme
- Asked: theme options that meet the five required fields (name, done flag, fixed tag, category, owner).
- Got: a list of 8 themes, each with its fields and three fixed values.
- Changed or rejected: I picked GymLog (workout log) myself and checked it against the five conditions from the stage document. I decided the fixed tag is the intensity (light, medium, intense) and the category is the muscle group.

### 2. First version of index.html and style.css
- Asked: to generate both files, then to give the design a modern gym-brand look.
- Got: a page with a video clip on every card, a clickable done/to-do checkbox and CSS transitions.
- Changed or rejected: I rejected those extras because Stage 1 is HTML and CSS only and must not go beyond the stage document. I asked for a new version that matches the document exactly (header, form with text + select, three cards, `.done` class, Grid, Flexbox, `@media`, CSS variables, focus outline, dark theme). I kept only the visual style (black header, orange accent).

### 3. README and publishing on GitHub
- Asked: a README draft in English following the template, and whether files can be uploaded from the browser instead of the terminal.
- Got: a README with the data model and sample data, and the explanation that uploading in the browser works but the commit messages must still follow `Stage N: ...`.
- Changed or rejected: I removed the video field from the data model, since videos are not part of this stage. I use the Git commands from the document.

## What I learned / what did not work
- Grid arranges the two columns of `main`, while Flexbox arranges things in one direction (form fields, list of cards, title vs. status inside a card).
- If every colour is a CSS variable, the dark theme only needs the variables redefined inside `@media (prefers-color-scheme: dark)`.
- The `@media (max-width: 700px)` rule must be at the end of the file, otherwise the earlier `.container` rule overrides it.
- What did not work: the first generated version did too much (videos, interactivity), so I had to ask for a simpler one that fits the stage.
