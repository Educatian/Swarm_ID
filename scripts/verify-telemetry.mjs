/* Check that the ECD envelope says what it claims about each event.

   The envelope's whole value is discrimination: choosing a lens is evidence of
   perspective taking, having the lens follow a map click is not; a prediction
   is evidence of calibration, a skipped one is not. Those distinctions live in
   a lookup table, and a lookup table is exactly the kind of thing that keeps
   compiling after someone edits an event name. So each distinction is asserted
   here in the real renderer, including the negative half — a check that only
   confirms the positive cases would still pass if every event were marked
   positive, which is the failure it is meant to catch.

   Also asserts the two things the browser pane could not show, because it never
   composites frames: a viewport with real numbers, and a visible-time clock
   that actually advances.

   Needs a static server on --base (default http://127.0.0.1:8137).
   Usage: node scripts/verify-telemetry.mjs [--base=...]                     */
import { chromium } from "playwright";

const arg = (n) => (process.argv.find((a) => a.startsWith(`--${n}=`)) || "").split("=")[1] || "";
const BASE = arg("base") || process.env.SMOKE_BASE || "http://127.0.0.1:8137";

// [label, eventType, payload, expected construct, expected role]
const CASES = [
  ["lens chosen by the learner", "perspective_switched", { source: "pill" }, "lens_shift", "positive"],
  ["lens dragged along by a map click", "perspective_switched", { source: "node_select" }, "lens_shift", "none"],
  ["lens switch with no provenance", "perspective_switched", {}, "lens_shift", "none"],
  ["lens.change, kept but not evidence", "lens.change", {}, null, "none"],
  ["a real prediction", "jol.predict", { prediction: "split" }, "metacognition", "positive"],
  ["a skipped prediction", "jol.predict", { prediction: "skip" }, "metacognition", "none"],
  ["an outcome with no verdict", "jol.outcome", { correct: null }, "metacognition", "none"],
  ["an outcome with a verdict", "jol.outcome", { correct: false }, "metacognition", "positive"],
  ["peer activity arriving", "peer.exposure", {}, "collab", "exposure"],
  ["a scaffold being opened", "annotation.scaffold_opened", {}, "justification", "support_use"],
  ["an annotation written", "annotation.created", {}, "justification", "positive"],
  ["a theme toggle", "theme.change", {}, null, "none"],
  ["an event nobody registered", "some.unmapped.event", {}, null, "none"],
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const problems = [];

await page.goto(`${BASE}/index.html`, { waitUntil: "networkidle" });

const present = await page.evaluate(() => ["analyticsEvidence", "analyticsTaskFeatures", "analyticsContext", "visibleMsSoFar"]
  .filter((n) => typeof window[n] !== "function"));
if (present.length) {
  console.error("FAIL telemetry envelope");
  console.error("  - missing on the page: " + present.join(", "));
  await browser.close();
  process.exit(1);
}

for (const [label, type, payload, construct, role] of CASES) {
  const got = await page.evaluate(([t, p]) => window.analyticsEvidence(t, p), [type, payload]);
  if (got.construct !== construct || got.evidence_role !== role) {
    problems.push(`${label}: expected ${construct}/${role}, got ${got.construct}/${got.evidence_role}`);
  }
}

// Task features must be real values, not a shape full of nulls that reads like
// data. node_count is allowed to be 0 — no run exists on a cold load — but the
// keys have to be there or an analysis silently loses its controls.
const task = await page.evaluate(() => window.analyticsTaskFeatures());
for (const key of ["stakeholder_set", "active_stakeholder", "map_layer", "node_count", "annotation_count", "scaffold"]) {
  if (!(key in task)) problems.push(`task features missing ${key}`);
}
if (!Array.isArray(task.stakeholder_set) || task.stakeholder_set.length === 0) {
  problems.push("task.stakeholder_set is empty — the lens denominator would be zero");
}

// Telemetry must not author the data it observes. getActiveLearnerRun() creates
// a run and persists platform state, so reading task features must not change
// how many runs exist.
const runsBefore = await page.evaluate(() => (getActiveCourse()?.learnerRuns || []).length);
await page.evaluate(() => { for (let i = 0; i < 20; i++) window.analyticsTaskFeatures(); });
const runsAfter = await page.evaluate(() => (getActiveCourse()?.learnerRuns || []).length);
if (runsAfter !== runsBefore) {
  problems.push(`reading task features created ${runsAfter - runsBefore} learner run(s) — telemetry is writing state`);
}

const ctx = await page.evaluate(() => window.analyticsContext());
if (!Array.isArray(ctx.viewport) || ctx.viewport[0] < 1 || ctx.viewport[1] < 1) {
  problems.push(`context.viewport is ${JSON.stringify(ctx.viewport)} — no usable dimensions`);
}
for (const key of ["view", "density", "theme", "locale", "visibility"]) {
  if (ctx[key] == null) problems.push(`context.${key} is null`);
}

// The visible-time clock is the denominator for every rate in the schema. If it
// never advances, time on task is uniformly zero and nothing normalises.
const t0 = await page.evaluate(() => window.visibleMsSoFar());
await page.waitForTimeout(1200);
const t1 = await page.evaluate(() => window.visibleMsSoFar());
if (!(t1 > t0)) problems.push(`visible_ms did not advance over 1.2s (${t0} -> ${t1})`);
if (t1 - t0 > 5000) problems.push(`visible_ms advanced ${t1 - t0}ms over 1.2s — the clock is double counting`);

await browser.close();

if (problems.length) {
  console.error("FAIL telemetry envelope");
  problems.forEach((p) => console.error("  - " + p));
  process.exit(1);
}
console.log(`PASS telemetry envelope — ${CASES.length} evidence rulings correct, task features and visible clock live`);
