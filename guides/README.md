# Swarm_ID — Guides

Four walkthrough guides for classroom use plus the Playwright script
that captures all screenshots referenced in them.

## Files

| File | Audience | Language |
|---|---|---|
| [`instructor-en.md`](./instructor-en.md) | Instructor | English |
| [`instructor-ko.md`](./instructor-ko.md) | Instructor | 한국어 |
| [`student-en.md`](./student-en.md) | Student | English |
| [`student-ko.md`](./student-ko.md) | Student | 한국어 |
| [`capture.mjs`](./capture.mjs) | — | Playwright screenshot driver |
| [`screenshots/`](./screenshots/) | — | Output tree (auto-generated) |

Each guide references screenshots by step number under
`guides/screenshots/{role}-{locale}/NN-name.png`. The same
`capture.mjs` populates all four locales — just re-run it with
`LOCALE=ko` (or `en`).

---

## Capturing screenshots

### 1. One-time setup

From the repo root:

```bash
npm init -y                      # if package.json does not exist
npm i -D playwright
npx playwright install chromium  # downloads the headless browser
```

### 2. Provide credentials via environment variables

`capture.mjs` signs in with real accounts so you get authentic
screenshots. Export before running:

```bash
# The deployed app — usually production
export APP_URL="https://swarmid.vercel.app"

# Instructor account (has at least one Published case)
export INSTRUCTOR_EMAIL="instructor@example.edu"
export INSTRUCTOR_PASSWORD="..."

# Student account (enrolled in the same course)
export STUDENT_EMAIL="student@example.edu"
export STUDENT_PASSWORD="..."
export STUDENT_JOIN_CODE="..."   # only if your flow uses join codes
```

> On Windows PowerShell use `$env:APP_URL = "..."` instead.

### 3. Run it

```bash
# Both roles, English
LOCALE=en node guides/capture.mjs both

# Student only, Korean
LOCALE=ko node guides/capture.mjs student

# Instructor only, Korean
LOCALE=ko node guides/capture.mjs instructor
```

Output:

```
guides/screenshots/instructor-en/01-login.png ... 10-report.png
guides/screenshots/instructor-ko/01-login.png ... 10-report.png
guides/screenshots/student-en/01-login.png ... 11-export.png
guides/screenshots/student-ko/01-login.png ... 11-export.png
```

The script runs a full flow per role:

- **Instructor** — sign in, studio landing, case library, open a
  case, structure a new brief, settings, perspectives, trade-offs,
  sandbox, report (10 steps).
- **Student** — sign in, onboarding card, pick a case, case map,
  compose a question, swarm round of 5 answers, disagreement edges,
  challenge button, add an agenda node, report, export (11 steps).

Running the student flow with a live Gemini key will consume
~7 API calls per run (5 for the initial swarm + classifier
second pass). If you just want the login / landing shots, pass
`SKIP_SWARM=1 node guides/capture.mjs student` and the script
will stop before the expensive calls (coming soon — currently
the full flow runs).

---

## Editing the guides

The guides are plain Markdown. Recommended workflow:

1. Edit the `.md` file.
2. If the UI changed, re-run `capture.mjs` for the affected role +
   locale to refresh screenshots.
3. Commit the `.md` and `screenshots/` together so the guide always
   matches the shipped code.

### Step numbering

The step numbers in markdown, the screenshot filenames, and the
`shot(page, role, N, name)` calls inside `capture.mjs` **must
stay in sync**. If you add a new step, number everything in sequence
and re-run capture for all four locales.

### Translations

- EN ↔ KO guide pairs cover the same steps in the same order.
  Keep them parallel.
- Natural Korean is preferred over loanwords. For example, use
  `설명요약` instead of `브리프`, `도전` instead of `챌린지`.

---

## Troubleshooting the capture script

| Symptom | Likely cause | Fix |
|---|---|---|
| `Timeout waiting for selector 'input[type="email"]'` | Landing page changed | Update the selectors at the top of `loginAs()` |
| Screenshots show English UI despite `LOCALE=ko` | Locale toggle runs before `window.state` exists | The script already has a retry — if you still see it, increase the initial `wait(page, 1000)` to `2000` |
| "Open case" button not found | No Published case on the instructor account | Sign in as instructor, publish a case, retry |
| Swarm round screenshot is empty | Gemini key missing on the deployed app | Check `/api/gemini` logs in Vercel — the script waits 9 s which is usually enough |
| `Error: browserType.launch: Executable doesn't exist` | Chromium was not downloaded | Re-run `npx playwright install chromium` |

---

## Production checklist before a class

1. `capture.mjs` has been run with the same `APP_URL` the students
   will use, so screenshots match exactly what they will see.
2. All four guides built without missing images (grep for
   `./screenshots/` and verify every referenced PNG exists).
3. The instructor guide `Swarm activity` counter shows a non-zero
   `round` value — confirms the swarm actually runs on the live
   deployment.
4. Student guide screenshots show the disagreement edges (red
   dashed lines). If they do not, the classifier second pass is
   silently failing and you should investigate before class.
