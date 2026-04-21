# Swarm ID — Newbie User Tutorial

A step-by-step walkthrough for first-time users. This mirrors the in-app guided tour but reads as a standalone reference. It is structured so it can be re-laid out as a publisher-style tutorial document later (cover page, chapter breaks, callouts).

---

## Before you start

You will need:

- A modern browser (Chrome, Edge, or Safari).
- The URL to your deployment — for the reference deployment this is `https://swarmid.vercel.app`.
- An account created by your instructor, or the admin if you are an instructor.
- A course **join code** (for students who self-enroll).

On first sign-in the interface shows two role toggles at the top-left of the workspace:

- **Instructor** — can create courses and cases, publish them, and see cohort activity.
- **Student** — can join a course by code, open published cases, and build a personal map.

The tour auto-plays once per role. You can replay it any time with **Show Tutorial** in the top-right.

---

## Part 1 — Instructor path

### Step 1. Choose the course

The topbar has a **Course** dropdown. Verify you are in the right course before you touch anything else — every case you create gets attached to the course that is active here.

If you have not created a course yet, open the pipeline panel on the left and use **Add course** inside the intake card.

### Step 2. Pick or create the case

Next to the course dropdown is the **Case** selector. It lists both drafts and published cases. Cases you are still editing stay as drafts and are invisible to students.

### Step 3. Create a new case

Scroll down inside the intake panel to the **New case** card. The form has three fields:

1. **Case title** — short, descriptive (e.g., "Online Digital Literacy Module for 5th Graders").
2. **Instructional brief** — paste your design brief. For best results include:
   - Target audience
   - Learning objective
   - Constraints (time, bandwidth, tools, budget)
   - Available resources
3. **Visibility** — defaults to **Keep as draft**. Switch to **Publish to learners** only when students should see it.

Press **Create case**. The button shows live progress: *Parsing brief → Extracting stakeholders → Computing tensions → Saving case*. When it finishes, the network map appears.

### Step 4. Read the case map

The center panel is the **Network stage**. Each node represents a stakeholder, constraint, or evidence artifact. Edges represent tensions — the thicker the edge, the more unresolved friction.

Reading hints:

- **Node size** = influence on the design decision.
- **Edge weight** = strength of the tension.
- **Color cluster** = stakeholder group.
- The sidebar meter shows overall **Case tension**, on a 0–100 scale (higher means more friction across stakeholders).

Hover any node to inspect it. Click a stakeholder to shift the lens — the whole graph re-weights to that stakeholder's point of view.

### Step 5. Ask a question

Under the network is the **Ask a Question** composer. Type a plain-English question such as:

> "Which stakeholder has the strongest objection to always-on feedback?"

The answer is grounded in the current case's nodes and tensions. Your question is stored in the cohort graph and is visible to the instructor and other students.

### Step 6. Rename, re-edit, or publish

- Click the pencil icon next to the case title to rename a case.
- Switch to the **Report** view (left nav) to review the auto-generated summary and evidence list before publishing.
- Use the **Publish** button on a draft case card to make it visible to students. Flip it back to **Unpublish** to pull it from student view without deleting.

---

## Part 2 — Student path

### Step 1. Join the course

- If your instructor sent you a join code, open the landing page, choose **Student**, and paste the code.
- If your account was pre-provisioned, just sign in — your course membership is already attached.

### Step 2. Check the course

Open the **Course** dropdown in the topbar. Confirm you are in the course your instructor mentioned. You should not see other instructors' courses.

### Step 3. Choose a published case

The **Case** dropdown only shows cases your instructor has published. Pick one to load its map.

If you see "No published cases yet," your instructor has not released a case yet — check back after your next class session.

### Step 4. Read the case map

Same canvas as the instructor view, but weighted to your learner run.

- **Scan the big clusters first** — they mark the major stakeholder groups.
- **Hover** a node to inspect it.
- **Click** a stakeholder node to re-weight the map from that perspective.
- The sidebar meter shows your learner run's tension, on a 0–100 scale.

### Step 5. Add one node

In the intake panel, the **Add node** form lets you contribute one question, concern, or issue from your own perspective. This becomes part of your private **learner layer** — only you and your instructor see it, unless the instructor changes the sharing mode to class view.

Each student gets a per-case limit (set by the instructor, usually 3–5). Use it thoughtfully.

### Step 6. Ask from one perspective

Switch to the **Perspectives** view (second icon in the left nav). You will see a focused panel with a chat composer labeled *Ask about this perspective*.

Use it when you want a response in the voice of a specific stakeholder — e.g., a hesitant parent, a district IT lead, or a student with a learning disability.

The two quick-action buttons are shortcuts:

- **Suggest a fix** — asks for a mitigation from that stakeholder's viewpoint.
- **Find the main concern** — asks for the top tension that stakeholder would name.

### Step 7. Write your reflection

Switch to the **Report** view (last icon in the left nav). The **Reflection prompts** section seeds short-answer questions based on what you explored. Use them to turn the map exploration into a structured reflection.

Submit your reflection from here. Your instructor sees the submission with the case map state attached as evidence.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| "Invalid login credentials" | Check for typos in email. The reference deployment uses `.swarm.id`, not `.swarm.io`. |
| Case dropdown empty (student) | No published cases yet — your instructor needs to publish one. |
| Network canvas is blank | Pick a case from the Case dropdown. If still blank, refresh the page. |
| Tour got stuck on a step | Click **Skip** in the tour card. You can replay with **Show Tutorial**. |
| "You don't have permission" when adding a node | You may have hit the per-case node limit set by the instructor. |

---

## Glossary

- **Case** — one design scenario with a brief, a stakeholder map, and an evidence set.
- **Tension** — an edge between two nodes representing unresolved friction between their goals or constraints.
- **Learner run** — a student's personal working copy of a case. Isolated from classmates unless the instructor shares it.
- **Cohort graph** — the aggregate view of all learner runs in a course. Instructor-only.
- **Lens** — a stakeholder-weighted view of the case map. Click any stakeholder node to apply.
- **Evidence node** — a concrete artifact (chart, quote, observation) attached to a stakeholder or tension.

---

## Next steps

- Instructors: after the tutorial, spend 10 minutes with the **Board settings** card (visible after creating a case) to set the agenda prompt, sharing mode, and per-student node limit.
- Students: after your first case, try switching the lens (click a stakeholder node). The same network tells a different story from each point of view — that is the point of the tool.
