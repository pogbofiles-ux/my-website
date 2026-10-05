# The Gym Rat Bible

Interactive visual gym guide: Upper / Lower / Core → muscle → exercises with animated stick figures, a proper-form guide, step-by-step instructions, form tips and common mistakes.

## Run it

- **Windows:** double-click `START.bat` (opens http://localhost:8080).
- **Manual:** run `python -m http.server 8080` inside this folder and open http://localhost:8080.

Plain HTML + CSS + JavaScript — nothing to install. To put it online, upload this folder to any static host (GitHub Pages, Netlify, Vercel…).

## Structure

| File | What it does |
|---|---|
| `index.html` | Main page |
| `css/styles.css` | Black / neon red / white styling |
| `js/data.js` | Muscles, zones (heads) and every exercise: proper form, steps, tips and mistakes |
| `js/patterns.js` | The animations: start (A) and end (B) pose of each movement |
| `js/figure.js` | Engine that draws and animates the SVG stick figures |
| `js/app.js` | Navigation, body map, filters, search, "My gym" and the exercise sheet |
| `js/i18n.js` + `js/i18n/*.js` | Language engine (English base) + Spanish, French, German, Italian, Portuguese and Arabic packs |
| `js/routines.js` | "My routines": days, sets, reps, weight (kg) and rest — saved in the browser (no database) |
| `js/coach.js` | AI coach chat that builds a personalized routine from goal, level, age, weight, height, days, time and equipment |

## Add an exercise

In `js/data.js`, copy an `X(...)` line and change the data. You can reuse any animation from `js/patterns.js`
(e.g. `'curl'`, `'squat'`, `'pushdown'`) and set the weight type (`'barbell'`, `'dumbbell'`, `'ez'`…).
