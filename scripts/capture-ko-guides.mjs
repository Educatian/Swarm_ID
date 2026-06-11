/* Capture fresh KO guide screenshots from the local preview (demo data, no login).
   Usage: py -m http.server 8137 (repo root), then: node scripts/capture-ko-guides.mjs */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = "http://127.0.0.1:8137";
const LOCALE = (process.env.GUIDE_LOCALE || "ko").toLowerCase() === "en" ? "en" : "ko";
mkdirSync(`guides/screenshots/student-${LOCALE}`, { recursive: true });
mkdirSync(`guides/screenshots/instructor-${LOCALE}`, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 });
await page.addInitScript(`try { localStorage.setItem("swarm-id-locale-v1", "${LOCALE}"); } catch (_) {}`);
const S = `guides/screenshots/student-${LOCALE}`;
const I = `guides/screenshots/instructor-${LOCALE}`;
const snap = (path) => page.screenshot({ path }).then(() => console.log("✓", path));

// ---- 01 landing (real app, no demo) ----
await page.goto(`${BASE}/index.html`, { waitUntil: "networkidle" });
await page.waitForTimeout(2500);
await snap(`${S}/01-landing.png`);

// ---- enter demo studio (student) ----
await page.goto(`${BASE}/preview.html`, { waitUntil: "networkidle" });
await page.waitForTimeout(2000);

// 02 welcome slides
await page.evaluate(() => showWelcome(true));
await page.waitForTimeout(400);
await snap(`${S}/02-welcome.png`);
await page.evaluate(() => finishWelcome(false));
await page.waitForTimeout(300);

// 03 home
await page.evaluate(() => { setView("home"); renderAll(); });
await page.waitForTimeout(600);
await snap(`${S}/03-home.png`);

// 04 map + task banner (simple)
await page.evaluate(() => {
  localStorage.setItem("task-banner-collapsed", "0");
  setDensity("simple"); setView("visualizer"); renderAll();
});
await page.waitForTimeout(1500);
await snap(`${S}/04-task-banner.png`);

// 05 map read: select a signal node + pin tooltip
await page.evaluate(() => {
  const node = state.graph.nodes.find((n) => n.kind === "signal");
  if (node) {
    state.selectedGraphNodeId = node.id;
    renderAll();
    setTimeout(() => showNetworkTooltip({ clientX: 640, clientY: 360 }, node, { pinned: true }), 600);
  }
});
await page.waitForTimeout(1400);
await snap(`${S}/05-map-read.png`);
await page.evaluate(() => hideNetworkTooltip(true));

// 06 lens bar switch
await page.evaluate(() => setStakeholder("student"));
await page.waitForTimeout(900);
const lensBar = page.locator("#map-lens-bar");
await lensBar.screenshot({ path: `${S}/06-lens-bar.png` }).then(() => console.log("✓ lens-bar"));

// 07 swarm round (detailed, shows 활동 내역)
await page.evaluate(async (en) => { setDensity("detailed"); renderAll(); await handleAsk(en ? "How can AI personalization avoid eroding teacher autonomy?" : "AI 개인화가 교사 자율성을 침해하지 않으려면?"); }, LOCALE === "en");
await page.waitForTimeout(2500);
await snap(`${S}/07-swarm-round.png`);

// 08 add-node drawer (simple)
await page.evaluate(() => { setDensity("simple"); renderAll(); });
await page.waitForTimeout(800);
await page.click('.map-dock-btn[data-drawer="intake"]');
await page.waitForTimeout(800);
await snap(`${S}/08-add-node.png`);
await page.keyboard.press("Escape").catch(() => {});

// 09 list view
await page.evaluate(() => { setMapViewMode("list"); });
await page.waitForTimeout(900);
await snap(`${S}/09-list-view.png`);
await page.evaluate(() => { setMapViewMode("map"); });

// 10 class view (cohort layer)
await page.evaluate(() => { state.activeMapLayer = "cohort"; lastGraphSignature = ""; renderAll(); });
await page.waitForTimeout(1500);
await snap(`${S}/10-class-view.png`);
await page.evaluate(() => { state.activeMapLayer = "personal"; lastGraphSignature = ""; renderAll(); });

// 11 report
await page.evaluate(() => { setView("report"); renderAll(); });
await page.waitForTimeout(900);
await snap(`${S}/11-report.png`);

// ---- instructor ----
await page.evaluate(() => { state.activeRole = "admin"; setDensity("detailed"); setView("visualizer"); renderAll(); });
await page.waitForTimeout(1200);
await snap(`${I}/01-create-case.png`);

// manage view with representative analytics (demo data has no live Supabase —
// inject a realistic sample so the guide shows what instructors actually see)
await page.evaluate(() => { setView("manage"); renderAll(); });
await page.waitForTimeout(700);
await page.evaluate(() => {
  const en = localStorage.getItem("swarm-id-locale-v1") === "en";
  const stages = (en
    ? [["Enrolled", 22], ["Signed in", 20], ["Opened a case", 19], ["Explored lenses", 16], ["Contributed", 13], ["Submitted reflection", 9]]
    : [["코스 참여", 22], ["접속함", 20], ["케이스 열람", 19], ["관점 탐색", 16], ["기여 (노드·질문·메모)", 13], ["성찰 제출", 9]]
  ).map((p) => ({ label: p[0], count: p[1] }));
  const kpis = en
    ? [["20/22", "Active students"], ["31", "Nodes"], ["54", "Questions"], ["27", "Notes"], ["9", "Reflections"]]
    : [["20/22", "활동 학생"], ["31", "노드 추가"], ["54", "질문"], ["27", "메모"], ["9", "성찰 제출"]];
  const lens = en
    ? [["Teacher", 38], ["Student", 27], ["Edtech", 19], ["Admin", 11], ["Accessibility", 5]]
    : [["교사", 38], ["학생", 27], ["에듀테크", 19], ["행정", 11], ["접근성", 5]];
  const rows = en
    ? [["Mina Kim", "Jun 10, 2:22 PM", 3, 5, 2, 1], ["Seo-yeon Lee", "Jun 10, 2:18 PM", 2, 4, 3, 1], ["Jiho Park", "Jun 10, 1:55 PM", 4, 2, 1, 0]]
    : [["김민지", "6월 10일 14:22", 3, 5, 2, 1], ["이서연", "6월 10일 14:18", 2, 4, 3, 1], ["박지호", "6월 10일 13:55", 4, 2, 1, 0]];
  document.getElementById("manage-analytics-body").innerHTML = `
    <div class="manage-kpi-row">${kpis.map(([v, l]) => `<div class="manage-kpi"><strong>${v}</strong><span>${l}</span></div>`).join("")}</div>
    <div class="manage-analytics-grid">
      <div><h4>${en ? "Engagement funnel" : "참여 퍼널"}</h4>${buildManageFunnel(stages)}</div>
      <div><h4>${en ? "Lens switches" : "관점 전환 분포"}</h4><div class="manage-lens-row">${lens.map(([l, p]) => `<span class="manage-lens-chip"><strong>${l}</strong> ${p}%</span>`).join("")}</div>
      <p class="muted manage-hint">${en ? "Low-share lenses are good candidates for explicit discussion." : "비중이 낮은 관점은 수업에서 명시적으로 다뤄볼 만해요."}</p></div>
    </div>
    <h4>${en ? "Per-student activity" : "학생별 활동"}</h4>
    <div class="manage-table-wrap"><table class="manage-table">
      <thead><tr>${(en ? ["Name", "Last active", "Nodes", "Questions", "Notes", "Reflections"] : ["이름", "마지막 활동", "노드", "질문", "메모", "성찰"]).map((h) => `<th>${h}</th>`).join("")}</tr></thead>
      <tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody>
    </table></div>`;
});
await page.waitForTimeout(400);
await snap(`${I}/02-manage.png`);
await page.locator(".manage-case-row").first().screenshot({ path: `${I}/03-manage-actions.png` }).then(() => console.log("✓ actions"));
await page.locator("#manage-analytics-body").screenshot({ path: `${I}/04-analytics.png` }).then(() => console.log("✓ analytics"));

await browser.close();
console.log("done");
