# BodyWise — architecture and implementation plan

## Goals that shaped the design

- **KES 0 to run.** No build step, no paid API, no account. Plain HTML, CSS and JavaScript that runs from any static host or straight from the file system.
- **Honest.** Nothing pretends to be live AI. Progress, streaks and scores come only from what the learner actually did on this device.
- **Connected learning.** Every lesson, system and quiz question carries tags that link it to body systems, so the app can draw relationships instead of isolated chapters.

## Stack

| Layer | Choice | Why |
|---|---|---|
| UI | Vanilla JavaScript, small render helpers, hash routing | Zero dependencies, easy to read, works offline |
| Styling | One CSS file with design tokens, light/dark themes | Consistent visual system, accessible contrast |
| Diagrams | Original inline SVG generated from code | Free, scalable, themeable, labelable for quizzes |
| Storage | `localStorage` behind a safe wrapper | Persistence without a backend; falls back to memory |
| Voice | Web Speech API (`speechSynthesis`, `SpeechRecognition`) | Browser-native, free; feature-detected |
| Tutor | Offline demo engine over lesson content + optional pluggable backend | Works at zero cost; can be connected to a free local model (Ollama) or a paid API later |
| PWA | Web manifest + service worker (registered only when served over http/https) | Installable, offline after first visit |

## Folder structure

```
bodywise/
├── index.html                 App shell (sidebar, bottom nav, view container)
├── manifest.webmanifest       PWA manifest
├── sw.js                      Offline cache (static files only)
├── icons/icon.svg
├── css/styles.css             Tokens, themes, layout, components
├── js/
│   ├── data/
│   │   ├── systems.js         9 body systems, relationships, cross-system paths, facts, jokes
│   │   ├── references.js      Verified source list
│   │   ├── curriculum.js      13 modules, all lesson titles and outlines
│   │   └── lessons-*.js       Full lessons (template sections 1–18)
│   ├── diagrams.js            SVG diagram library (labelable)
│   ├── store.js               Persistent state, progress, Leitner scheduling, analytics
│   ├── quiz.js                Question rendering and grading (MCQ, T/F, short answer, label, scenario)
│   ├── tutor.js               Demo tutor engine + optional backend adapter
│   ├── voice.js               Read-aloud and speech input with fallbacks
│   └── app.js                 Router and views
├── server/tutor-proxy.mjs     Optional backend (Ollama by default; keys stay server-side)
├── tools/build-single.mjs     Inlines everything into one HTML file
└── tests/                     Logic tests (Node) and browser flows (Playwright)
```

## Data model (content)

- **Module** `{ id, n, title, summary, systems[], lessons[] }`
- **Lesson** (full) follows the mandatory 18-part template:
  `why, objectives, intro, detail[], steps[], diagram, analogy, altAnalogy, joke, connections[{sys, text, lesson?}], scenario, misconceptions[], check[], summary, terms[], flashcards[], refs[], next`
- **Lesson** (outline) `{ id, title, blurb, status:'outline' }` — shown honestly as "being written".
- **Question** `{ id, type: mcq|tf|short|label|scenario, prompt, options?, answer, explain, why? }`
- **Relationship** `{ a, b, text, lesson }` between two systems.

## State model (learner, stored per device)

```
lessons   { id: { started, completed } }
attempts  [ { qid, lesson, module, correct, ts } ]   capped at 600
quizzes   [ { label, score, total, ts } ]
cards     { cardId: { box 1–5, due } }               simple Leitner schedule
saved     { lessons[], terms[] }
notes     { lesson notes by id, free notes[] }
prefs     level, theme, text size, motion, voice, tutor backend URL…
activity  [ 'YYYY-MM-DD' ]                           real study days → streak
tutor     { history[], lastTopic }
```

## Build stages

1. Shell, routing, design tokens, storage wrapper.
2. Curriculum data and lesson renderer with progressive disclosure.
3. Quiz engine with explanations, attempt tracking and per-topic accuracy.
4. Systems map, cross-system paths and body explorer.
5. Demo tutor, voice features.
6. Dashboard, progress, notes, preferences, sources.
7. Tests (logic in Node, flows in headless Chromium at phone and desktop widths).


