/* Structural render checks — the shapes of failure this app actually produces.

   Each of these corresponds to a defect that shipped and was found by looking
   at a screenshot rather than by any automated check:

   1. workspace collapse. `.role-admin[data-active-view="manage"]` set a
      248px sidebar track with no media query and beat the single-column rule
      for simple density, which hides the sidebar — so the workspace was
      auto-placed into an empty 248px column and the whole instructor screen
      rendered one character per line at 1440px.
   2. icons rendering as their ligature name. A wrongly subset font turns every
      icon into visible English text. Width relative to font-size separates a
      glyph from a word; width relative to *name length* does not, and let a
      font with zero ligature rules pass as healthy.
   3. the hidden attribute being overridden. `hidden` only carries display:none
      from the UA sheet, so any component rule that sets display defeats it —
      instructor-only UI was rendering for learners while its property read
      true.
   4. console errors, which smoke already covers but are cheap to reassert.

   Usage: node scripts/verify-render.mjs [--base=...]   */
import { chromium } from "playwright";

const BASE = (process.argv.find((a) => a.startsWith("--base=")) || "").split("=")[1]
  || process.env.SMOKE_BASE || "http://127.0.0.1:8137";
const VIEWS = ["home", "visualizer", "lens", "matrix", "sandbox", "report", "manage"];

const browser = await chromium.launch();
const page = await browser.newPage();
const consoleErrors = [];
page.on("pageerror", (e) => consoleErrors.push(String(e).slice(0, 140)));
// gemini-config.js is an optional local-only file behind an isLocal gate with
// an onerror fallback; its 404 is by design and never happens in production.
const ignorable = (u) => /gemini-config\.js/.test(u || "");
page.on("requestfailed", (r) => { if (!ignorable(r.url())) consoleErrors.push("requestfailed " + r.url().slice(-60)); });
page.on("response", (r) => { if (r.status() >= 400 && !ignorable(r.url())) consoleErrors.push(r.status() + " " + r.url().slice(-60)); });
page.on("console", (m) => { if (m.type() === "error" && !/status of 404/.test(m.text()))
  consoleErrors.push(m.text().slice(0, 140)); });

await page.setViewportSize({ width: 1440, height: 1000 });
await page.goto(`${BASE}/preview.html`, { waitUntil: "networkidle" });
await page.waitForTimeout(2500);

const problems = [];

// 1. the workspace must fill the space the sidebar does not occupy
for (const width of [900, 1100, 1180, 1440]) {
  await page.setViewportSize({ width, height: 1000 });
  for (const density of ["simple", "advanced"]) {
    for (const view of ["manage", "visualizer", "report"]) {
      await page.evaluate((o) => { state.activeRole = "admin"; state.density = o.density; setView(o.view); renderAll(); },
        { density, view });
      await page.waitForTimeout(220);
      const r = await page.evaluate(() => {
        const ws = document.querySelector(".workspace");
        const sb = document.querySelector(".sidebar");
        if (!ws) return null;
        const sbVisible = sb && getComputedStyle(sb).display !== "none";
        return { ws: Math.round(ws.getBoundingClientRect().width),
                 sb: sbVisible ? Math.round(sb.getBoundingClientRect().width) : 0, vw: window.innerWidth };
      });
      if (!r) continue;
      const expected = r.vw - r.sb;
      if (r.ws < expected * 0.9) {
        problems.push(`workspace collapsed: ${width}px/${density}/${view} — ${r.ws}px where ${expected}px was available`);
      }
    }
  }
}
await page.setViewportSize({ width: 1440, height: 1000 });

// 2. icons must render as glyphs, not as their names.
//    Element boxes are a bad ruler here: a flex or grid child is sized by the
//    layout, not by the glyph, so filtering to unstretched boxes left this
//    gate measuring nothing at all — a gate that checks zero things reports
//    PASS and is worse than no gate. Measure the font's own advance width
//    instead, which layout cannot distort: a resolved ligature is about one em,
//    the unresolved word is several.
const iconNames = new Set();
for (const role of ["user", "admin"]) {
  for (const view of VIEWS) {
    await page.evaluate((o) => { state.activeRole = o.role; state.density = "advanced"; setView(o.view); renderAll(); },
      { role, view });
    await page.waitForTimeout(220);
    (await page.evaluate(() => {
      const out = [];
      document.querySelectorAll("*").forEach((el) => {
        if (el.children.length) return;
        if (!/Material Symbols/i.test(getComputedStyle(el).fontFamily || "")) return;
        const t = (el.textContent || "").trim();
        if (t && /^[a-z0-9_]{2,}$/.test(t)) out.push(t);
      });
      return out;
    })).forEach((n) => iconNames.add(n));
  }
}
const iconWidths = await page.evaluate(async (names) => {
  await document.fonts.ready;
  const c = document.createElement("canvas").getContext("2d");
  c.font = '100px "Material Symbols Outlined"';
  return names.map((n) => ({ glyph: n, em: +(c.measureText(n).width / 100).toFixed(2) }));
}, [...iconNames]);
iconWidths.filter((x) => x.em > 1.6)
  .forEach((x) => problems.push(`icon rendering as text: "${x.glyph}" advances ${x.em}em instead of ~1em`));
const iconRatios = new Map(iconWidths.map((x) => [x.glyph, x.em]));

// 3. the hidden attribute must actually hide
for (const role of ["user", "admin"]) {
  await page.evaluate((r) => { state.activeRole = r; setView("report"); renderAll(); }, role);
  await page.waitForTimeout(300);
  (await page.evaluate(() => {
    const bad = [];
    document.querySelectorAll("[hidden]").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (getComputedStyle(el).display !== "none" && r.width > 1 && r.height > 1) {
        bad.push((el.id || String(el.className).split(" ")[0] || el.tagName).slice(0, 40));
      }
    });
    return bad;
  })).forEach((id) => problems.push(`[hidden] still rendered (${role}): ${id}`));
}

console.log(`icons checked: ${iconRatios.size} | console errors: ${consoleErrors.length}`);
consoleErrors.slice(0, 5).forEach((e) => problems.push("console: " + e));

await browser.close();

if (problems.length) {
  console.error("FAIL render");
  [...new Set(problems)].forEach((p) => console.error("  - " + p));
  process.exit(1);
}
console.log("PASS render — no collapsed workspace, no icon fallback text, hidden honoured, no console errors");
