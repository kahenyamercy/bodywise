# BodyWise — your personal human physiology tutor

A free, mobile-first learning app for human physiology. It teaches how each body system works, why it works that way, and how the systems depend on each other, with lessons, original diagrams, quizzes, flashcards, a body explorer, the Body Connection Map with scenarios, and a teaching tutor.

**Cost to run: KES 0.** No account, no paid API, no build step. Plain HTML, CSS and JavaScript.

---

## Run it locally

You need any modern browser. Pick one:

1. **Easiest, no install:** open `dist/bodywise.html` by double-clicking it. Everything is in that one file. (Read-aloud works; voice input usually needs option 2 because browsers restrict the microphone on `file://` pages.)
2. **Full version with offline support:** from the `bodywise` folder run a static server, then open the address it prints.
   ```bash
   python3 -m http.server 8765          # or: npx serve .
   # open http://localhost:8765
   ```

Requirements for development tools only: Node 18+ (tests, build script, optional backend) and Python 3 with Playwright (browser tests).

## Deploy for free

All three options below are genuinely free for a static site of this size. Each gives you an `https://` address, which voice input and offline mode need.

- **GitHub Pages:** push the `bodywise` folder to a public GitHub repository → Settings → Pages → Deploy from branch → `main` / root. Your app is at `https://<username>.github.io/<repo>/`.
- **Cloudflare Pages:** create a project, connect the repository (or drag-and-drop the folder), no build command, output directory `/`.
- **Netlify:** drag the `bodywise` folder onto app.netlify.com/drop.

After changing any file, bump `VERSION` in `sw.js` so returning learners get the update.

## Project structure

```
bodywise/
├── index.html                 App shell
├── manifest.webmanifest       Install as an app (PWA)
├── sw.js                      Offline cache
├── icons/icon.svg
├── css/styles.css             Design tokens, light/dark themes, components, diagram styles
├── js/
│   ├── data/references.js     Verified source list (links checked 28 Oct 2026)
│   ├── data/systems.js        9 systems, 27 relationships, 4 learning paths, facts, jokes
│   ├── data/curriculum.js     13 modules, 92 lessons (titles + outlines)
│   ├── data/lessons-1..3.js   17 fully written lessons (18-part template)
│   ├── data/extras.js         Body mysteries, jokes with science, memory tricks, pathway caveats, cardiac stages
│   ├── data/connections.js    Two-way detail for 27 relationships, 7 scenarios, analogy limits
│   ├── data/audit.js          The KES 0 audit shown on the Sources page
│   ├── diagrams.js            17 original SVG diagrams (labelable for quizzes)
│   ├── interactive.js         Term pop-ups, cardiac-cycle stepper, pathway strips, generated checks, diagram zoom
│   ├── store.js               Progress, revision, Leitner flashcards, backup codes
│   ├── quiz.js                MCQ, true/false, short answer, label-the-diagram, scenarios
│   ├── voice.js               Read-aloud + speech input via browser APIs
│   ├── tutor.js               Teaching engine (6 modes, checks, re-explanation) + optional backend client
│   └── app.js                 Router and all views
├── server/tutor-proxy.mjs     Optional live tutor backend (Ollama free / Anthropic paid)
├── tools/build-single.mjs     Builds dist/bodywise.html (one self-contained file)
├── tests/logic.test.mjs       37 logic and content-integrity tests (Node)
├── tests/e2e.py               17 browser checks × desktop and phone (Playwright)
└── docs/ARCHITECTURE.md       Architecture and design decisions
```

To add a lesson: write it in a `lessons-*.js` file using the same fields as an existing lesson (the tests check every field), add any new source to `references.js`, then run the tests.

## Tests

```bash
node tests/logic.test.mjs                        # content integrity, grading, storage, tutor
python3 -m http.server 8765 &                    # then:
python3 tests/e2e.py http://localhost:8765/index.html
```

Latest run: **37/37 logic tests, 34/34 browser checks** (desktop 1280 px and phone 390 px), covering all 15 acceptance tests in the brief.

## What is implemented

- **Look and feel:** calm light background with deep navy text, teal for learning actions, coral and amber for highlights, soft rounded cards, light and dark themes. Motion only where it explains something (heartbeat trace, blood flow in the cardiac cycle, signals travelling along pathways) and it switches off with reduced motion.
- **Interactive lessons:** clickable key terms with pop-up definitions, step-by-step process cards with a walk-through mode, “predict what happens next” questions, short checks between sections, memory tricks, clickable related-system cards, “where this fits” pathway strips with a simplified-pathway note and exceptions, a zoomable diagram viewer, and an interactive cardiac cycle (Lesson 3.4) showing which chambers contract, which valves are open and where blood moves.
- **Navigation:** sidebar on desktop, bottom tab bar + "More" sheet on phones, skip link, keyboard support, deep links for every page.
- **Home:** personalised greeting, an Ask BodyWise box, a heartbeat counter (clearly labelled as an estimate), a prominent continue-learning card with today’s suggestion, today’s body mystery with a reveal, a compact progress strip (lessons, streak, last quiz, topics to revise, cards due), a body map of the systems you have explored, a “systems connected” panel showing where finished lessons lead, a daily joke that opens into the real science, and a daily fact.
- **Curriculum:** all 13 modules and 92 lessons listed. **17 lessons are fully written**, at least one per module, each with all 18 template parts: why it matters, objectives, beginner intro, detailed and advanced explanations (expandable), step-through mechanism, labelled diagram, two analogies, memorable line, related-systems panel, worked example, misconceptions, knowledge check, summary, key terms, flashcards, references, next lesson, and personal notes.
- **Connections:** related-systems panel on every lesson, body explorer (9 systems, each with function, organs, processes, interactions, lessons, quick quiz and a "what happens if…" scenario), and 4 cross-system learning paths.
- **The Body Connection Map:** select any of the 9 systems to see what it does, which systems it interacts with, what it receives from each, what it contributes, the mechanism behind each link, relevant lessons and a generated connections quiz. Two-way regulatory feedback loops are drawn with arrows at both ends; supply or exchange links are dashed. Links such as `#connections-cv-re` open a specific relationship. Every link points to a real lesson.
- **Scenario mode:** 7 situations (starting to run, dehydration, a carbohydrate meal, rising temperature, standing up, sudden stress, recovery after exercise). Each shows a stage-by-stage flow with the systems involved, feedback loops drawn in both directions, a "simplified sequence" label, a check question, and clickable stages that link to lessons.
- **Quizzes:** 5 question types with an explanation after every answer, module quizzes, mixed quiz, revision quiz from weak topics, drills by question type, flashcards with a simple Leitner schedule (1, 3, 7, 14, 30 days).
- **Progress:** lessons, accuracy by topic, revision flags (< 70% over ≥ 2 recent answers), quiz history, flashcard boxes, study days. All from real activity; nothing is estimated.
- **Tutor room (teaching engine):** identifies the concept (lesson, scenario, relationship, term or system), chooses a level (Auto picks simple for new topics and fuller explanations for completed ones, and says so), gives a short answer, the mechanism, key terms, an analogy with where it stops being accurate, connections explained as cause and effect (including recovery and feedback where relevant), then a check question.
  - **Modes**, switchable mid-conversation: Simple, Detailed, Exam (formal terms and a typed answer marked for key ideas), Visual (diagram, process map, pathway strip), Step by step (one step at a time, predicting the next), Analogy (two analogies and their limits).
  - **After a wrong answer:** no shaming; it names the misconception when one matches, explains the missing step, offers a different analogy, asks a simpler question, then returns to the original question.
  - **Context:** uses the current lesson, completed lessons, recent wrong answers and your lesson notes saved in this browser, and says that is where it comes from. It does not claim any memory beyond that.
  - Honest "I don't know", a safety reply for personal medical questions, and every answer labelled as demo or live.
- **Voice:** read-aloud for lessons, summaries, scenarios, paths and tutor answers with pause/resume/stop; microphone input with a listening indicator and clear errors; support detected per browser, with typing always available.
- **Preferences:** name, default level, jokes on/off, theme, text size, motion, reading spacing, voice choice and speed, speech-input language, tutor backend, backup/restore code, reset with confirmation.
- **Sources page:** references, how content is written, what is local/demo/backend, privacy, limits, and the educational-only notice.

## KES 0 audit

Categories: **1** no external service · **2** browser capability · **3** third-party free service · **4** paid service · **5** demo.
The same table appears in the app on the Sources page.

| Feature | Category | Status | How it works | Costs money? | Limitations | Next step | How it was tested |
|---|---|---|---|---|---|---|---|
| Lessons, glossary pop-ups, diagrams, cardiac-cycle stepper | 1 | Working (17 of 92 lessons written) | Content and original SVG diagrams ship inside the app. | Free | 75 lessons are outlines. | Write the remaining lessons. | Automated browser tests on phone and desktop sizes |
| Body explorer, Connection Map (27 links), scenarios (7), learning paths (4) | 1 | Working | Generated from lesson and relationship data; every link opens a real lesson. | Free | Teaching summary, not every interaction in the body. | Add more scenarios as lessons are written. | Automated tests: selection, pair links, map quiz, stage navigation |
| Quizzes, predict-next and between-section checks | 1 | Working | Graded in the browser with an explanation after every answer. | Free | Short answers are checked for key ideas, so unusual wording can be marked wrong (you can override). | Add more questions per lesson. | Logic tests for grading; browser tests answering real questions |
| Progress, revision flags, flashcards, streak, notes, backup code | 1,2 | Working | Saved in this browser’s local storage; backup code moves it between devices. | Free | One browser, one device; clearing site data erases it. | Optional free sync would need an account system. | Persistence checked after page reload; backup round trip tested |
| Built-in tutor (6 modes, checks, re-explanation) | 1,5 | Working demo | A teaching engine that assembles answers from written lessons, connections and scenarios, checks understanding and adapts after wrong answers. | Free | Cannot answer beyond BodyWise content; does not reason or generate new text. Every answer is labelled as demo. | Connect a live model for open questions. | Logic tests for each mode and the wrong-answer cycle; browser test of a full conversation |
| Live AI tutor with a local open-source model (Ollama) | 1 | Ready to connect | Optional server in server/tutor-proxy.mjs talks to a model on your own computer. | Free (needs a computer able to run a small model, a download of a few gigabytes, no account or key) | Answer quality depends on the model; small models make mistakes. | Install Ollama, run the server, enter its address in Preferences. | Tested end to end through the included server using a stand-in model (prompt, mode and answer delivery), plus fallback to the demo tutor when the server is down. Not yet run with a real Ollama model. |
| Live AI tutor through the Anthropic API | 4 | Optional, not required | Same server with PROVIDER=anthropic; the API key stays on the server. | Paid per use; needs an Anthropic account and API key | Not part of the free learning workflow. | Only if you choose to pay for it. | Server code syntax-checked; not called |
| Read-aloud with pause, resume and stop | 2 | Working where supported | Browser speech synthesis (speechSynthesis). | Free | Voices and quality vary by device; some browsers have no voices. | None required. | Support detection and controls tested in Chromium |
| Voice input for questions | 2,3 | Working where supported | Browser speech recognition. | Free; Chrome sends audio to Google’s speech service (no account needed) | Not in Firefox by default; blocked on file:// pages and inside the Claude preview. | A fully offline option would need an open-source speech model. | Fallback message tested; live recognition needs a real microphone |
| Fonts | 3 | Working | Google Fonts. | Free, no account | Offline, system fonts are used instead. | Could be bundled locally (open licences). | Page renders with fallback fonts when offline |
| Offline install (PWA) | 2 | Working when hosted over http(s) | Service worker caches the app’s files after the first visit. | Free | Not active in the single-file version or the Claude preview. | None required. | Registration skipped correctly in the single-file build |
| Hosting | 1,3 | Ready | Open dist/bodywise.html directly, or host on GitHub Pages, Cloudflare Pages or Netlify. | Free (hosting services need a free account) | Free tiers have usage limits far above a personal learning app. | Pick a host if you want a web address. | Single-file build passes the same browser tests |
| References | 3 | Working | Links to OpenStax (CC BY 4.0), NIH, MedlinePlus, StatPearls and WHO pages. | Free to read | External sites can move; links were checked on 28 Oct 2026. | Re-check links periodically. | Each link opened and its title checked |

**Bottom line:** the complete learning workflow runs at zero cost with no account or API key. The only paid component is the optional Anthropic API backend. Fonts, Chrome's voice input and free hosting rely on third-party services that cost nothing.

### Connecting the live tutor (optional)

```bash
# Free, local: install Ollama from ollama.com, then
ollama pull llama3.2
ALLOW_ORIGIN=http://localhost:8765 node server/tutor-proxy.mjs
# Paid alternative:
PROVIDER=anthropic ANTHROPIC_API_KEY=sk-... node server/tutor-proxy.mjs
```

In BodyWise → Preferences → Tutor backend, enter `http://localhost:8787/ask`, press **Test connection**, then choose **Live backend** in the tutor room. If the backend fails, BodyWise falls back to the demo tutor and says so. A local model's quality depends on the model you choose; small models can make mistakes, which is why lesson content, not the live tutor, is the reference.

## Incomplete features and limitations

- **75 of 92 lessons are outlines.** They are listed and clearly labelled; the tutor will not invent content for them. Writing them is the main next step.
- **Progress is per browser and device.** Clearing site data deletes it. Use the backup code (Preferences) to save or move it. There are no accounts or sync.
- **The built-in tutor is not AI.** It cannot answer questions outside the written lessons.
- **Short answers are checked for key words**, so unusual phrasing can be marked wrong; learners can count their answer as correct after reading the model answer.
- **Spaced repetition is a fixed Leitner schedule**, not a personalised or research-optimised algorithm.
- **Voice input varies:** not available in Firefox by default; blocked on `file://` pages in most browsers and inside the Claude artifact preview. Kiswahili transcription depends on the browser.
- **Label-the-diagram uses dropdowns** rather than drag-and-drop, which keeps it accessible on phones and with keyboards.
- **Diagrams are schematic**, not anatomically scaled.
- **Fonts** load from Google Fonts when online; offline, the app falls back to system fonts.

## Content and safety

Lessons are original educational summaries of open sources (mainly OpenStax *Anatomy and Physiology 2e*, CC BY 4.0, plus NIH, MedlinePlus, StatPearls and WHO pages). Every link was opened and its title checked on 28 October 2026. BodyWise teaches normal physiology and is not medical advice.

## Data protection note

BodyWise collects no personal data. If you extend it to store learner data on a server (accounts, sync, analytics), or deploy it for programmes involving patients or health workers, review the data protection law of each country involved (Kenya, Ghana, Nigeria, Tanzania) and check with your data protection contact before launch.
