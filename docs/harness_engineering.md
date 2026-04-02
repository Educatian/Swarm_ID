# Harness Engineering

This project now includes a lightweight local harness for the highest-value domain logic.

## What is covered

- `structuredCaseFromDocument`
- `generateAgendaExpansions`
- `buildCohortIssueEntries`
- `buildGraphSnapshot`

These live in:

- `C:\Users\jewoo\Desktop\Swarm_ID\harness\engine.js`

The harness runner lives in:

- `C:\Users\jewoo\Desktop\Swarm_ID\harness\run.js`

Fixtures live in:

- `C:\Users\jewoo\Desktop\Swarm_ID\harness\fixtures\case-input.json`
- `C:\Users\jewoo\Desktop\Swarm_ID\harness\fixtures\cohort-course.json`

## Run locally

```powershell
node .\harness\run.js
```

## Why this matters

The app UI still depends on a large shared browser state in `app.js`, but the harness gives you a testable path for the parts most likely to regress:

- document to case structuring
- learner agenda to AI expansion
- private learner work to cohort synthesis
- case data to graph snapshot

## Next extraction targets

To make the whole product easier to test, the next modules to split out are:

1. `joinCourseWithCode`
2. `addAgendaNode`
3. `addNodeAnnotation`
4. `updateBoardSettings`
5. `renderable graph layout helpers`

After that, browser-level smoke tests can replay:

1. instructor creates board
2. student joins with code
3. student adds agenda node
4. student annotates node
5. class view shows clustered issues
