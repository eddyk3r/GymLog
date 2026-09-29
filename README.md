# GymLog

A simple workout log for people who train regularly. It lists exercises, tags their intensity and lets you mark them as done.

## Data model
| Field     | Type         | Notes                                |
| --------- | ------------ | ------------------------------------ |
| name      | text         | required, max 100 chars              |
| done      | boolean      | toggled from the list, default false |
| intensity | fixed values | light, medium, intense               |
| category  | relation     | Strength, Cardio, Mobility           |
| user      | relation     | the owner of the item (from week 11) |

Sample data used across all stages:
1. Squats, to do, medium
2. 5 km run, done, intense
3. Stretching, to do, light

## How to run
Open `index.html` in a browser. No build step, no server.

## AI usage
| Tool | Used for |
| ---- | -------- |
| Claude | choosing the theme, guidance on the stage steps |
Details per stage: see the ai-log/ folder.

## Status
- [x] Stage 1: static mockup
- [ ] Stage 2: data logic in JavaScript
