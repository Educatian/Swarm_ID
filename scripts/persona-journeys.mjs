/* Persona journey harness: drives five persona journeys through the no-login
   preview (synthetic data only) and records screenshots plus layout metrics a
   reviewer can reason about. A failed step is recorded as a finding, not a
   crash, so one broken control doesn't hide the rest of the journey.
   Usage: node scripts/persona-journeys.mjs R1   (needs a server on PERSONA_BASE) */
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROUND = process.argv[2] || "R0";
const BASE = process.env.PERSONA_BASE || "http://127.0.0.1:8138";
const OUT = path.resolve("output/persona-rounds", ROUND);
mkdirSync(OUT, { recursive: true });

const personas = [
  { id: "p1-minji", name: "민지 — 1학년, 처음 사용, 노트북", lang: "ko", viewport: { width: 1366, height: 768 }, journey: "novice" },
  { id: "p2-seojun", name: "서준 — 아이패드로 수업 참여", lang: "ko", viewport: { width: 1024, height: 768 }, touch: true, journey: "tablet" },
  { id: "p3-jia", name: "지아 — 스마트폰으로 이동 중 확인", lang: "ko", viewport: { width: 390, height: 844 }, touch: true, journey: "phone" },
  { id: "p4-prof", name: "장 교수 — 토론 진행 준비하는 교수자", lang: "ko", viewport: { width: 1440, height: 900 }, role: "admin", journey: "instructor" },
  { id: "p5-alex", name: "Alex — exchange student, keyboard user", lang: "en", viewport: { width: 1280, height: 800 }, journey: "keyboard" },
];

// Runs in the page: what a reviewer needs to judge the current screen.
function measure() {
  const vw = innerWidth, vh = innerHeight;
  const stage = document.getElementById("network-stage");
  const r = stage && stage.offsetParent ? stage.getBoundingClientRect() : null;
  const visH = r ? Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0)) : 0;
  const visW = r ? Math.max(0, Math.min(r.right, vw) - Math.max(r.left, 0)) : 0;
  const overlays = [...document.querySelectorAll("#map-lens-bar, #map-dock, .map-insights-panel, .map-insights-toggle, .map-fit-btn, .compare-summary, .network-stage > .dts-context-help")]
    .filter((e) => e.offsetParent).map((e) => e.getBoundingClientRect());
  const majors = [...document.querySelectorAll(".network-node:not([data-type=satellite])")];
  let clipped = 0, covered = 0;
  const labels = [];
  majors.forEach((g) => {
    const b = g.querySelector(".node-body")?.getBoundingClientRect();
    if (!b || !r) return;
    const cx = b.left + b.width / 2, cy = b.top + b.height / 2;
    if (cx < r.left || cx > r.right || cy < r.top || cy > r.bottom) clipped += 1;
    else if (overlays.some((o) => cx > o.left && cx < o.right && cy > o.top && cy < o.bottom)) covered += 1;
    // Count the sub-label too; R1's panel saw collisions this metric missed.
    [".node-label", ".node-meta"].forEach((sel) => {
      const el = g.querySelector(sel);
      // Only labels a person can see: decluttered ones are opacity 0.
      if (!el || getComputedStyle(el).opacity === "0" || getComputedStyle(el).display === "none") return;
      const l = el.getBoundingClientRect();
      if (l && l.width) labels.push({ l, g });
    });
  });
  let labelOverlaps = 0;
  for (let i = 0; i < labels.length; i++) for (let j = i + 1; j < labels.length; j++) {
    if (labels[i].g === labels[j].g) continue;
    const a = labels[i].l, b = labels[j].l;
    // 3px gap: labels touching on a baseline read as one phrase (R11).
    if (a.left < b.right + 3 && b.left < a.right + 3 && a.top < b.bottom + 1 && b.top < a.bottom + 1) labelOverlaps += 1;
  }
  // R9: a label lying on another node's circle was visible but uncounted.
  const bodies = majors.map((g) => ({ g, b: g.querySelector(".node-body")?.getBoundingClientRect() })).filter((x) => x.b && x.b.width);
  let labelOnNode = 0;
  labels.forEach(({ l, g }) => { if (bodies.some((x) => x.g !== g && l.left < x.b.right && x.b.left < l.right && l.top < x.b.bottom && x.b.top < l.bottom)) labelOnNode += 1; });
  const text = document.body.innerText;
  const lang = document.documentElement.lang || "";
  const hangul = (text.match(/[가-힣]+/g) || []).length;
  const ae = document.activeElement;
  const cs = ae && ae !== document.body ? getComputedStyle(ae) : null;
  return {
    view: document.getElementById("app-shell")?.getAttribute("data-active-view") || null,
    mapVisibleShare: +((visW * visH) / (vw * vh)).toFixed(2),
    mapTopPx: r ? Math.round(r.top) : null,
    mapBottomPx: r ? Math.round(r.bottom) : null,
    stageStyleH: stage?.style.height || null,
    majorNodes: majors.length, nodesOutsideStage: clipped, nodesUnderControls: covered, labelOverlaps, labelOnNode,
    horizontalOverflow: document.documentElement.scrollWidth > vw + 1,
    hangulWordsOnScreen: lang.startsWith("en") ? hangul : undefined,
    focused: ae && ae !== document.body ? {
      tag: ae.tagName, label: (ae.getAttribute("aria-label") || ae.textContent || "").trim().slice(0, 40),
      ring: cs.outlineStyle !== "none" && cs.outlineWidth !== "0px" || cs.boxShadow !== "none",
    } : null,
  };
}

async function runPersona(browser, p) {
  const dir = path.join(OUT, p.id);
  mkdirSync(dir, { recursive: true });
  const context = await browser.newContext({ viewport: p.viewport, hasTouch: !!p.touch, isMobile: !!p.touch && p.viewport.width < 700, reducedMotion: "reduce", locale: p.lang === "ko" ? "ko-KR" : "en-US" });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const steps = [];
  let n = 0;
  const step = async (label, fn, { shot = true } = {}) => {
    n += 1;
    const rec = { n, label, ok: true };
    try { await fn(); await page.waitForTimeout(700); }
    catch (e) { rec.ok = false; rec.error = String(e.message).split("\n")[0].slice(0, 200); }
    try { rec.metrics = await page.evaluate(measure); } catch (_) {}
    if (shot) {
      rec.screenshot = `${String(n).padStart(2, "0")}-${label.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.png`;
      await page.screenshot({ path: path.join(dir, rec.screenshot) }).catch(() => {});
    }
    steps.push(rec);
  };
  const tap = (sel) => (p.touch ? page.locator(sel).first().tap({ timeout: 4000 }) : page.locator(sel).first().click({ timeout: 4000 }));
  const q = new URLSearchParams({ lang: p.lang });
  if (p.role) q.set("role", p.role);

  if (p.journey === "novice") {
    await step("landing", async () => { await page.goto(`${BASE}/index.html?lang=ko`); await page.locator(".ux-demo-link").waitFor({ timeout: 8000 }); });
    await step("open sample", async () => { await page.locator(".ux-demo-link").click(); await page.locator(".ux-home").waitFor(); });
    await step("home primary cta", async () => { await page.locator(".home-continue-cta").click(); await page.waitForTimeout(1800); });
    await step("click an issue node", () => tap('.network-node[data-type="signal"] .node-body'));
    await step("switch lens to student", async () => {
      await tap('#stakeholder-pills button:nth-child(2)');
      // Check the outcome, not just the click (R9: a lost click passed).
      if (await page.evaluate(() => state.activeStakeholder) !== "student") throw new Error("lens did not change to student");
    });
    await step("ask a question", async () => {
      if (await page.locator("#composer-toggle").isVisible()) await page.locator("#composer-toggle").click();
      await page.locator("#visualizer-input").fill("학생 기기 접근 격차는 누가 책임져야 하나요?");
      await page.locator("#visualizer-form button[type=submit]").click();
      await page.waitForTimeout(1200);
    });
    await step("open discussion cues", () => tap("#map-insights-toggle"));
    await step("ask from a cue", async () => {
      await tap("[data-insight-ask]");
      const v = await page.locator("#visualizer-input").inputValue();
      if (!v) throw new Error("cue did not prefill the question box");
    });
    await step("go to reflection", () => tap('.workspace-primary-nav [data-view="report"]'));
  } else if (p.journey === "tablet") {
    await step("open preview", async () => { await page.goto(`${BASE}/preview.html?${q}`); await page.locator(".ux-home").waitFor(); });
    await step("open map", async () => { await tap(".home-continue-cta"); await page.waitForTimeout(1800); });
    await step("tap issue node", () => tap('.network-node[data-type="signal"] .node-body'));
    await step("open perspectives drawer", async () => {
      // The dock button toggles; only press it if the drawer is not open yet,
      // then check the outcome (R10: a press that closed it passed silently).
      if (!(await page.locator(".insight-panel.is-open").count())) await tap('.map-dock-btn[data-drawer="insight"]');
      if (!(await page.locator(".insight-panel.is-open").count())) throw new Error("perspectives drawer is not open");
    });
    await step("switch to list view", async () => { await page.keyboard.press("Escape"); await tap("#map-mode-btn"); });
    await step("back to map, class layer", async () => { await tap("#map-mode-btn"); await page.selectOption("#map-layer-select", "cohort"); await page.waitForTimeout(1500); });
  } else if (p.journey === "phone") {
    await step("open preview", async () => { await page.goto(`${BASE}/preview.html?${q}`); await page.locator(".ux-home").waitFor(); });
    await step("open map", async () => { await tap(".home-continue-cta"); await page.waitForTimeout(1800); });
    await step("tap issue node", () => tap('.network-node[data-type="signal"] .node-body'));
    await step("switch lens to IT", async () => {
      await tap('#stakeholder-pills button:nth-child(3)');
      if (await page.evaluate(() => state.activeStakeholder) !== "it") throw new Error("lens did not change to IT");
    });
    await step("go to reflection", () => tap('.workspace-primary-nav [data-view="report"]'));
  } else if (p.journey === "instructor") {
    await step("open instructor preview", async () => { await page.goto(`${BASE}/preview.html?${q}`); await page.waitForTimeout(2500); });
    await step("open map", async () => {
      const nav = page.locator('.workspace-primary-nav [data-view="visualizer"]');
      if (await nav.count()) await nav.first().click(); else await page.evaluate(() => setView && setView("visualizer"));
      await page.waitForTimeout(1800);
    });
    await step("class layer", async () => { await page.selectOption("#map-layer-select", "cohort"); await page.waitForTimeout(1800); });
    await step("look for discussion cues", async () => {
      if (!(await page.locator(".map-insights-panel").isVisible())) throw new Error("no discussion-orchestration cue visible on the map");
    });
    await step("focus a cue on the map", async () => {
      await page.locator("[data-insight-key]").nth(1).click({ timeout: 4000 });
      if (!(await page.locator(".network-node.is-insight-focus").count())) throw new Error("cue did not highlight any node");
    });
  } else if (p.journey === "keyboard") {
    await step("open preview", async () => { await page.goto(`${BASE}/preview.html?${q}`); await page.locator(".ux-home").waitFor(); });
    for (let i = 1; i <= 3; i++) await step(`tab x${i * 4}`, async () => { for (let k = 0; k < 4; k++) await page.keyboard.press("Tab"); });
    await step("open map", async () => { await page.locator(".home-continue-cta").click(); await page.waitForTimeout(1800); });
    await step("tab into map tools", async () => { for (let k = 0; k < 6; k++) await page.keyboard.press("Tab"); });
    await step("compare layer", async () => { await page.selectOption("#map-layer-select", "compare"); await page.waitForTimeout(1500); });
  }

  await context.close();
  const out = { round: ROUND, persona: p, steps, errors };
  writeFileSync(path.join(dir, "journey.json"), JSON.stringify(out, null, 2));
  return out;
}

const browser = await chromium.launch();
const results = [];
for (const p of personas) results.push(await runPersona(browser, p));
await browser.close();
const summary = results.map((r) => ({
  persona: r.persona.id,
  failedSteps: r.steps.filter((s) => !s.ok).map((s) => `${s.n} ${s.label}: ${s.error}`),
  errors: r.errors,
  worstMapShare: Math.min(...r.steps.filter((s) => s.metrics?.mapTopPx != null).map((s) => s.metrics.mapVisibleShare)),
}));
writeFileSync(path.join(OUT, "summary.json"), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 1));
