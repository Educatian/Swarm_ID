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
// Selecting a row now opens the collaborative-annotation drawer in simple mode.
// Close it before returning to the map so the mode toggle is actionable.
await page.evaluate(() => closeMapDrawers());
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

// 9. Learner sees only the approved reflection coach.
await page.click("#agent-coach-trigger");
await page.waitForTimeout(250);
const learnerCoach =
  (await page.locator("#agent-coach-drawer:not([hidden])").count()) === 1 &&
  (await page.locator("#agent-coach-title").textContent())?.includes("성찰 코치") &&
  (await page.locator(".agent-control-strip").textContent())?.includes("질문만");
check("learner receives approved questions-only coach", Boolean(learnerCoach));
await page.click('[data-agent-action="close"]');

// 10. Professor gets evidence, limitations, and approval controls.
await page.evaluate(() => {
  state.activeRole = "admin";
  renderAll();
});
await page.click("#agent-coach-trigger");
await page.click('[data-agent-action="evidence"]');
const professorCoach =
  (await page.locator("#agent-coach-title").textContent())?.includes("AI 활동 코치") &&
  (await page.locator(".agent-evidence-detail").count()) === 1 &&
  (await page.locator(".agent-privacy-note").textContent())?.includes("자동 채점 없음");
check("professor coach exposes evidence and human-control guardrails", Boolean(professorCoach));
await page.click('[data-agent-action="facilitator-mode"][data-agent-mode="mediator"]');
await page.click('[data-agent-action="mediator-generate"]');
await page.waitForFunction(() => document.querySelector(".agent-alternative")?.textContent?.length > 12, null, { timeout: 5000 }).catch(() => {});
const mediatorMove =
  (await page.locator("#agent-prompt-draft").count()) === 1 &&
  (await page.locator(".agent-alternative").textContent())?.includes("대안");
check("professor can refresh an evidence-based mediator move", Boolean(mediatorMove));
await page.click('[data-agent-action="facilitator-mode"][data-agent-mode="topic"]');
await page.fill("#agent-topic-brief-input", "교수자 부담과 학습자 설명 책임을 비교하게 하고 싶어요.");
await page.click('[data-agent-action="facilitator-mode"][data-agent-mode="mediator"]');
await page.click('[data-agent-action="facilitator-mode"][data-agent-mode="topic"]');
const briefPersists = (await page.inputValue("#agent-topic-brief-input")) === "교수자 부담과 학습자 설명 책임을 비교하게 하고 싶어요.";
check("topic brief survives facilitator tab switches", briefPersists);
await page.click('[data-agent-action="topic-generate"]');
await page.waitForFunction(() => document.querySelectorAll(".agent-topic-card").length === 3, null, { timeout: 5000 }).catch(() => {});
const topicGenerator =
  (await page.locator(".agent-topic-results").count()) === 1 &&
  (await page.locator(".agent-topic-card").count()) === 3 &&
  (await page.locator(".agent-facilitator-tabs [data-agent-mode=topic]").getAttribute("aria-selected")) === "true";
check("professor can generate and choose discussion topics", topicGenerator);
await page.click('[data-agent-action="facilitator-mode"][data-agent-mode="after"]');
const openQuestions =
  (await page.locator("#agent-coach-title").textContent())?.includes("Open Questions") &&
  (await page.locator(".agent-topic-card").count()) === 3;
check("discussion closes into next open questions", Boolean(openQuestions));
await page.click('[data-agent-action="close"]');

// 11. Instructor control center covers roster, course invite, topic, and mediation actions.
await page.evaluate(() => {
  state.activeRole = "admin";
  setView("manage");
  renderAll();
});
await page.waitForTimeout(400);
const consoleReady =
  (await page.locator("#instructor-system-console").count()) === 1 &&
  (await page.locator('[data-console-form="student-invite"]').count()) === 1 &&
  (await page.locator('[data-console-action="open-topic-coach"]').count()) === 1;
check("instructor console renders authorized workflow", consoleReady);
await page.fill('[data-console-form="student-invite"] input[name="studentName"]', "테스트 학생");
await page.fill('[data-console-form="student-invite"] input[name="studentEmail"]', "test.student@example.edu");
await page.click('[data-console-form="student-invite"] button[type="submit"]');
await page.waitForTimeout(250);
const inviteReady = await page.locator(".instructor-console-roster-row").count();
check("instructor can prepare a student invite", inviteReady > 0, `rows=${inviteReady}`);
await page.click('[data-console-tab="live"]');
await page.fill("[data-console-topic-brief]", "학습자 설명 책임과 자동화 평가의 공정성을 비교하게 하고 싶어요.");
await page.click('[data-console-action="open-topic-coach"]');
const topicCoachOpened =
  (await page.locator("#agent-coach-drawer:not([hidden])").count()) === 1 &&
  (await page.locator('[data-agent-mode="topic"]').getAttribute("aria-selected")) === "true";
check("instructor console opens topic studio", topicCoachOpened);
await page.click('[data-agent-action="close"]');

// 12. The coach remains reachable in the learner's compact mobile layout.
await page.setViewportSize({ width: 390, height: 844 });
await page.evaluate(() => {
  state.activeRole = "user";
  state.density = "simple";
  renderAll();
});
const mobileTriggerVisible = await page.locator("#agent-coach-trigger").isVisible();
check("reflection coach remains reachable on mobile", mobileTriggerVisible);

// 12b. Accessibility and cross-view handoff guards.
await page.click("#agent-coach-trigger");
const dialogA11y =
  (await page.locator("#agent-coach-drawer[role=dialog][aria-modal=true]").count()) === 1 &&
  (await page.locator("#agent-coach-drawer [role=tab]").count()) === 0;
check("reflection coach exposes a modal accessibility contract", dialogA11y);
await page.click('[data-agent-action="close"]');
await page.evaluate(() => {
  state.activeRole = "user";
  state.activeMapLayer = "compare";
  state.selectedGraphNodeId = "";
  setView("visualizer");
  renderAll();
});
check("comparison annotation waits for a selected difference", await page.locator("[data-compare-annotate][disabled]").count() === 1);
await page.evaluate(() => {
  state.activeView = "report";
  renderAll();
});
check("reflection report carries case tensions into an empty learner run", await page.locator("#report-tensions .memo-item").count() > 0);

// 13. Console errors (ignore expected offline/demo noise)
const realErrors = consoleErrors.filter(
  (e) => !/supabase|gemini|favicon|fonts|net::|Failed to load resource/i.test(e)
);
check("no unexpected console errors", realErrors.length === 0, realErrors.slice(0, 3).join(" | "));

await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed.`);
process.exit(failed.length ? 1 : 0);
