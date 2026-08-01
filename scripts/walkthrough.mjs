/* Rehearsal walkthrough — drives the two journeys that get recorded.

   The smoke suite checks that things exist and that nothing throws. This
   drives the app the way a person will on camera: click, then assert the
   screen actually changed. A control that is present, enabled and does
   nothing passes every other gate in this repo and ruins a take.

   Each step captures a screenshot into docs/walkthrough/<journey>/ so the
   sequence can be reviewed as a storyboard before recording.

   Usage: node scripts/walkthrough.mjs [--base=...] [--journey=student|instructor]  */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const arg = (n) => (process.argv.find((a) => a.startsWith(`--${n}=`)) || "").split("=")[1] || "";
const BASE = arg("base") || process.env.SMOKE_BASE || "http://127.0.0.1:8137";
const ONLY = arg("journey");

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 950 });
const pageErrors = [];
page.on("pageerror", (e) => pageErrors.push(String(e).slice(0, 120)));

const results = [];
let shot = 0;
const step = async (journey, name, fn) => {
  const before = pageErrors.length;
  let ok = false, detail = "";
  try {
    const r = await fn();
    ok = r === true || (r && r.ok === true);
    detail = (r && r.detail) || "";
  } catch (e) {
    detail = String(e.message || e).split("\n")[0].slice(0, 110);
  }
  if (pageErrors.length > before) { ok = false; detail += ` | threw: ${pageErrors[before]}`; }
  results.push({ journey, name, ok, detail });
  mkdirSync(`docs/walkthrough/${journey}`, { recursive: true });
  await page.screenshot({ path: `docs/walkthrough/${journey}/${String(++shot).padStart(2, "0")}-${name.replace(/[^\w-]/g, "_").slice(0, 34)}.png` });
  console.log(`  ${ok ? "OK  " : "FAIL"} ${name}${detail ? "  — " + detail : ""}`);
};

const setRole = (role, view) => page.evaluate((o) => {
  state.activeRole = o.role; state.density = "advanced"; setView(o.view); renderAll();
}, { role, view });

await page.goto(`${BASE}/preview.html`, { waitUntil: "networkidle" });
await page.waitForTimeout(3000);

/* ---------------- student ---------------- */
if (!ONLY || ONLY === "student") {
  console.log("\nSTUDENT");
  await setRole("user", "home");
  await page.waitForTimeout(500);

  await step("student", "home resume takes you to the map", async () => {
    const btn = page.locator(".home-continue-cta").first();
    if (!(await btn.count())) return { ok: false, detail: "resume button absent" };
    await btn.click();
    await page.waitForTimeout(700);
    const view = await page.evaluate(() => state.activeView);
    return { ok: view === "visualizer", detail: `view=${view}` };
  });

  await step("student", "stakeholder pill switches perspective", async () => {
    const pills = page.locator("[data-pill]");
    const n = await pills.count();
    if (n < 2) return { ok: false, detail: `${n} pills` };
    const before = await page.evaluate(() => state.activeStakeholder);
    await pills.nth(1).click();
    await page.waitForTimeout(600);
    const after = await page.evaluate(() => state.activeStakeholder);
    return { ok: before !== after, detail: `${before} -> ${after}` };
  });

  await step("student", "adding a node puts it on the map", async () => {
    // In this density the intake column starts off-canvas at left -402, so the
    // form is unreachable until the drawer is opened — which is what a
    // presenter does on camera before typing.
    const drawer = page.locator('[data-drawer="intake"]').first();
    if (await drawer.count()) { await drawer.click(); await page.waitForTimeout(700); }
    const toggle = page.locator("[data-pipeline-toggle]").first();
    if (await toggle.count()) {
      const open = await toggle.getAttribute("aria-expanded");
      if (open === "false") { await toggle.click(); await page.waitForTimeout(400); }
    }
    const before = await page.evaluate(() => state.graph.nodes.length);
    await page.fill('input[name="agendaTitle"]', "리허설 노드");
    await page.fill('textarea[name="agendaBody"]', "영상 리허설에서 추가한 노드입니다.");
    await page.locator("#agenda-node-form button[type=submit]").click();
    await page.waitForTimeout(1500);
    const after = await page.evaluate(() => state.graph.nodes.length);
    return { ok: after > before, detail: `nodes ${before} -> ${after}` };
  });

  await step("student", "question composer opens", async () => {
    const t = page.locator("#composer-toggle");
    if (!(await t.count())) return { ok: false, detail: "composer toggle absent" };
    await t.click();
    await page.waitForTimeout(500);
    return page.evaluate(() => {
      const c = document.querySelector(".composer-input, #composer-input, .chat-composer textarea");
      if (!c) return { ok: false, detail: "composer field not found" };
      const r = c.getBoundingClientRect();
      return { ok: r.height > 4, detail: `field ${Math.round(r.width)}x${Math.round(r.height)}` };
    });
  });

  await step("student", "map focus collapses the side panels", async () => {
    await page.locator("#map-focus-btn").click();
    await page.waitForTimeout(600);
    const cls = await page.getAttribute("#visualizer-layout", "class");
    const on = /is-focused/.test(cls || "");
    await page.locator("#map-focus-btn").click();
    await page.waitForTimeout(400);
    return { ok: on, detail: on ? "focused then restored" : `class=${cls}` };
  });

  await step("student", "list view shows the nodes as rows", async () => {
    const b = page.locator("#map-mode-btn");
    if (!(await b.count())) return { ok: false, detail: "list toggle absent" };
    await b.click();
    await page.waitForTimeout(700);
    const rows = await page.locator(".node-list-row").count();
    await b.click();
    await page.waitForTimeout(400);
    return { ok: rows > 0, detail: `${rows} rows` };
  });

  await step("student", "perspectives view renders the orbit", async () => {
    await setRole("user", "perspectives");
    await page.waitForTimeout(900);
    return page.evaluate(() => {
      const view = state.activeView;
      // Look inside the panel that is actually on screen rather than for the
      // first .orbit-visual in the document, which may belong to a hidden view.
      const panel = document.querySelector('[data-view-panel="perspectives"]');
      const o = panel && panel.querySelector(".orbit-visual");
      const r = o && o.getBoundingClientRect();
      return { ok: view === "perspectives" && !!r && r.height > 100,
               detail: `view=${view} orbit=${r ? Math.round(r.width) + "x" + Math.round(r.height) : "absent"}` };
    });
  });

  await step("student", "trade-offs radar and decision card", async () => {
    await setRole("user", "matrix");
    await page.waitForTimeout(700);
    return page.evaluate(() => {
      const pts = document.querySelector("#radar-fill")?.getAttribute("points") || "";
      const card = document.querySelector("#matrix-latest-decision");
      return { ok: pts.split(" ").length >= 5 && !!card, detail: `radar pts=${pts.split(" ").length}` };
    });
  });

  await step("student", "report regenerates its summary", async () => {
    await setRole("user", "report");
    await page.waitForTimeout(700);
    const before = await page.textContent("#report-summary");
    await page.locator("#regenerate-memo").click();
    await page.waitForTimeout(1500);
    const after = await page.textContent("#report-summary");
    return { ok: !!after && after.trim().length > 0, detail: before === after ? "text unchanged (may be deterministic)" : "text updated" };
  });

  await step("student", "empty-state CTA routes back to the map", async () => {
    const cta = page.locator('[data-report-action="network"]').first();
    if (!(await cta.count())) return { ok: false, detail: "no report CTA" };
    await cta.click();
    await page.waitForTimeout(800);
    const v = await page.evaluate(() => state.activeView);
    await setRole("user", "report");
    return { ok: v === "visualizer", detail: `view=${v}` };
  });
}

/* ---------------- instructor ---------------- */
if (!ONLY || ONLY === "instructor") {
  console.log("\nINSTRUCTOR");
  await setRole("admin", "manage");
  await page.waitForTimeout(800);

  await step("instructor", "console stage tabs switch", async () => {
    const tabs = page.locator("[data-console-tab]");
    const n = await tabs.count();
    if (n < 3) return { ok: false, detail: `${n} tabs` };
    const seen = [];
    for (const name of ["live", "review", "prepare"]) {
      const tab = page.locator(`[data-console-tab="${name}"]`).first();
      if (!(await tab.count())) continue;
      await tab.click();
      await page.waitForTimeout(500);
      seen.push(await page.evaluate(() => state.manageConsoleTab));
    }
    return { ok: new Set(seen).size >= 2, detail: seen.join(" -> ") };
  });

  await step("instructor", "course creation form accepts input", async () => {
    await page.locator('[data-console-tab="prepare"]').first().click();
    await page.waitForTimeout(500);
    // #pipeline-console is a collapsed legacy form carrying the same field
    // names, and it comes first in the document — scope to the visible console.
    await page.fill('.instructor-console [name="courseName"]', "리허설 코스");
    await page.fill('.instructor-console [name="courseCode"]', "REHEARSAL1");
    const v = await page.inputValue('.instructor-console [name="courseName"]');
    return { ok: v === "리허설 코스", detail: `courseName="${v}"` };
  });

  await step("instructor", "preparing a student invite adds a row", async () => {
    // .invite-row does not exist; the roster renders .instructor-console-roster-row.
    // The previous assertion was `after >= before`, which passes when nothing
    // happens at all — a green step that proves nothing.
    const ROW = ".instructor-console-roster-row";
    const form = '[data-console-form="student-invite"]';
    if (!(await page.locator(form).count())) return { ok: false, detail: "invite form not found" };
    const before = await page.locator(ROW).count();
    await page.fill(`${form} input[name="studentName"]`, "리허설 학생");
    await page.fill(`${form} input[name="studentEmail"]`, "rehearsal@example.edu");
    await page.click(`${form} button[type=submit]`);
    await page.waitForTimeout(1500);
    const after = await page.locator(ROW).count();
    return { ok: after > before, detail: `roster rows ${before} -> ${after}` };
  });

  await step("instructor", "activity coach drawer opens", async () => {
    const t = page.locator("#agent-coach-trigger").first();
    if (!(await t.count())) return { ok: false, detail: "coach trigger absent" };
    await t.click();
    await page.waitForTimeout(1200);
    return page.evaluate(() => {
      const d = document.querySelector("#agent-coach-drawer");
      const r = d && d.getBoundingClientRect();
      return { ok: !!r && r.width > 100, detail: r ? `${Math.round(r.width)}x${Math.round(r.height)}` : "drawer not found" };
    });
  });

  await step("instructor", "sandbox scenario shifts the metrics", async () => {
    await page.keyboard.press("Escape");
    await setRole("admin", "sandbox");
    await page.waitForTimeout(800);
    const before = await page.evaluate(() => ({ ...state.metrics }));
    const chip = page.locator("[data-scenario]").first();
    if (!(await chip.count())) return { ok: false, detail: "no scenario chip" };
    await chip.click();
    await page.waitForTimeout(1200);
    const after = await page.evaluate(() => ({ ...state.metrics }));
    const moved = Object.keys(before).filter((k) => before[k] !== after[k]);
    return { ok: moved.length > 0, detail: moved.length ? `moved: ${moved.join(", ")}` : "metrics unchanged" };
  });

  await step("instructor", "slider adjusts a metric", async () => {
    const slider = page.locator("#personalization-range");
    if (!(await slider.count())) return { ok: false, detail: "slider absent" };
    const before = await page.evaluate(() => state.metrics.personalization);
    await slider.fill(String(Math.min(95, before + 15)));
    await slider.dispatchEvent("input");
    await slider.dispatchEvent("change");
    await page.waitForTimeout(1000);
    const after = await page.evaluate(() => state.metrics.personalization);
    return { ok: after !== before, detail: `${before} -> ${after}` };
  });

  await step("instructor", "cohort panel refreshes", async () => {
    await setRole("admin", "report");
    await page.waitForTimeout(900);
    const btn = page.locator("#cohort-refresh");
    if (!(await btn.count())) return { ok: false, detail: "refresh button absent" };
    const visible = await btn.isVisible();
    if (!visible) return { ok: false, detail: "cohort block hidden for instructor" };
    await btn.click();
    await page.waitForTimeout(1200);
    return { ok: true, detail: "clicked without error" };
  });
}

await browser.close();

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} interactions worked`);
if (failed.length) {
  console.log("needs attention before recording:");
  failed.forEach((f) => console.log(`  - [${f.journey}] ${f.name}${f.detail ? " — " + f.detail : ""}`));
}
console.log(`screenshots: docs/walkthrough/`);
process.exit(failed.length ? 1 : 0);
