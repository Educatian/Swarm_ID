/* Smoke test for the 2026-06 usability upgrade set:
   welcome slides, task banner, map focus, list view, inter-stakeholder edges,
   touch tooltip plumbing. Runs against preview.html (demo data, no login).

   Usage:  py -m http.server 8137  (repo root, separate shell)
           node scripts/smoke-usability-upgrade.mjs
*/
import { chromium } from "playwright";

const BASE = process.env.SMOKE_BASE || "http://127.0.0.1:8137";
const results = [];
const check = (name, ok, extra = "") => {
  results.push({ name, ok });
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${extra ? ` — ${extra}` : ""}`);
};

const browser = await chromium.launch();
const page = await browser.newPage();
const consoleErrors = [];
page.on("pageerror", (err) => consoleErrors.push(String(err)));
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text());
});

await page.goto(`${BASE}/preview.html`, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

// 1. App shell rendered with demo data
check("preview boots into studio", await page.locator("#app-shell:not(.is-hidden)").count() === 1);

// 2. Task banner visible for the student role with 5 steps
const bannerVisible = await page.locator("#task-banner:not([hidden])").count();
const stepCount = await page.locator("#task-banner .task-step").count();
check("task banner visible with 5 steps", bannerVisible === 1 && stepCount === 5, `steps=${stepCount}`);

// 3. Switch to the network view (preview lands on home)
await page.evaluate(() => {
  window.setView ? setView("visualizer") : null;
  renderAll();
});
await page.waitForTimeout(800);

// 4. Inter-stakeholder dashed edges present in the SVG
const interEdges = await page.locator('.network-link[data-kind="inter-stakeholder"]').count();
check("inter-stakeholder edges drawn", interEdges > 0, `count=${interEdges}`);

// 5. Map focus toggle collapses both panels
await page.click("#map-focus-btn");
await page.waitForTimeout(600);
const layoutClasses = await page.getAttribute("#visualizer-layout", "class");
check(
  "map focus collapses both panels",
  layoutClasses.includes("intake-collapsed") && layoutClasses.includes("insight-collapsed"),
  layoutClasses
);
await page.click("#map-focus-btn");
await page.waitForTimeout(400);

// 6. List view renders sortable rows; search filters
await page.click("#map-mode-btn");
await page.waitForTimeout(500);
const listVisible = await page.locator("#node-list-panel:not([hidden])").count();
const rowCount = await page.locator(".node-list-row").count();
check("list view shows rows", listVisible === 1 && rowCount > 0, `rows=${rowCount}`);
await page.fill("#node-list-search", "데이터");
await page.waitForTimeout(300);
const filteredCount = await page.locator(".node-list-row").count();
check("list search filters", filteredCount > 0 && filteredCount <= rowCount, `filtered=${filteredCount}`);
const firstRow = page.locator(".node-list-row").first();
await firstRow.click();
await page.waitForTimeout(400);
const selectedAfterClick = await page.evaluate(() => state.selectedGraphNodeId);
check("list row click selects node", Boolean(selectedAfterClick), selectedAfterClick || "");
await page.fill("#node-list-search", "");
await page.click("#map-mode-btn");
await page.waitForTimeout(400);

// 7. Welcome slides flow ends in the guided tour
await page.evaluate(() => showWelcome(true));
await page.waitForTimeout(300);
check("welcome overlay opens", await page.locator("#welcome-overlay:not(.is-hidden)").count() === 1);
for (let i = 0; i < 4; i += 1) {
  await page.click("#welcome-next");
  await page.waitForTimeout(250);
}
const tourActive = await page.locator("#tour-overlay:not(.is-hidden)").count();
check("welcome final slide launches tour", tourActive === 1);
await page.evaluate(() => endTutorial(false));

// 8. Pinned tooltip helper works (simulates the touch path)
const tooltipShown = await page.evaluate(() => {
  const node = state.graph.nodes.find((n) => n.kind === "signal");
  if (!node) return false;
  showNetworkTooltip({ clientX: 400, clientY: 300 }, node, { pinned: true });
  hideNetworkTooltip(); // pinned: should NOT hide
  const stillVisible = !document.getElementById("network-tooltip").hidden;
  hideNetworkTooltip(true); // forced: should hide
  const hiddenAfterForce = document.getElementById("network-tooltip").hidden;
  return stillVisible && hiddenAfterForce;
});
check("pinned tooltip survives soft hide, closes on force", tooltipShown);

// 9. Console errors (ignore expected offline/demo noise)
const realErrors = consoleErrors.filter(
  (e) => !/supabase|gemini|favicon|fonts|net::|Failed to load resource/i.test(e)
);
check("no unexpected console errors", realErrors.length === 0, realErrors.slice(0, 3).join(" | "));

await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed.`);
process.exit(failed.length ? 1 : 0);
