/* Live E2E verification of the AI-feedback instrumentation chain.
   instructor creates test case -> student runs feedback+JOL -> readback events -> archive case. */
import { chromium } from "playwright";

const SITE = "https://swarm-id-ko.pages.dev";
const browser = await chromium.launch();

async function login(page, email, password) {
  await page.goto(SITE + "/?v=e2e", { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  await page.fill("#landing-login-email", email);
  await page.fill("#landing-login-password", password);
  await page.click("#landing-login-submit");
  await page.waitForTimeout(6000);
}

// ---------- Phase 1: instructor creates test case ----------
const PRESET_CASE = process.argv[2] || "";
let ctx = await browser.newContext();
let page = await ctx.newPage();
const errs = [];
let created;
if (PRESET_CASE) {
  created = { caseId: PRESET_CASE, title: "(preset)", published: true };
} else {
page = await ctx.newPage();
page.on("pageerror", e => errs.push(String(e)));
await login(page, "jmoon19@ua.edu", "cat531-instructor");
created = await page.evaluate(async () => {
  if (state.activeRole !== "admin") return { error: "not admin: " + state.activeRole };
  await uploadStructuredDocument(
    "ZZ TEST 계측 검증용 케이스",
    "중학교 과학 수업에 AI 튜터를 도입하려는 상황이다. 교사 부담과 개인화 사이의 긴장, 데이터 프라이버시, 기기 접근 격차가 핵심 쟁점이다. 학생 주체성과 행정 예산 제약도 충돌한다.",
    "published"
  );
  const c = getActiveCaseRecord();
  c.reflectionPrompts = ["가장 중요한 쟁점은 무엇이고, 왜 그렇게 판단했나요?"];
  c.boardSettings = { ...c.boardSettings, studentView: "full" };
  await syncCaseToSupabase(c);
  return { caseId: c.id, title: c.title, published: c.published };
});
}
console.log("PHASE1 create:", JSON.stringify(created));
await ctx.close();
if (created.error) { await browser.close(); process.exit(1); }
const CASE_ID = created.caseId;

// ---------- Phase 2: student runs the flows ----------
ctx = await browser.newContext();
page = await ctx.newPage();
page.on("pageerror", e => errs.push("student:" + String(e)));
await login(page, "beckyallen@swarm.io", "cat531-allen");
await page.evaluate(() => { try { finishWelcome(false); endTutorial(false); } catch (_) {} });
const studentState = await page.evaluate(async (caseId) => {
  state.activeCaseId = caseId;
  syncActiveCaseState();
  renderAll();
  return { role: state.activeRole, caseTitle: getActiveCaseRecord()?.title, prompts: asArray(getActiveCaseRecord()?.reflectionPrompts).length };
}, CASE_ID);
console.log("PHASE2 student:", JSON.stringify(studentState));

// JOL + question
await page.evaluate(() => { setView("visualizer"); renderAll(); document.querySelector(".canvas-panel").classList.add("composer-open"); });
await page.waitForTimeout(800);
await page.fill("#visualizer-input", "계측 검증: 프라이버시와 개인화는 양립 가능한가?");
await page.evaluate(() => document.getElementById("visualizer-form").requestSubmit());
await page.waitForTimeout(700);
await page.click("[data-jol='split']");
await page.waitForTimeout(6000);

// reflection feedback + submit
await page.evaluate(() => { setView("report"); renderAll(); });
await page.waitForTimeout(900);
await page.fill("textarea.reflection-response", "계측 검증 초안: 가장 중요한 쟁점은 교사 부담과 개인화의 충돌이다.");
await page.click("[data-reflection-feedback='0']");
await page.waitForTimeout(5000);
const critiqueCount = await page.locator(".critique-item").count();
await page.fill("textarea.reflection-response", "계측 검증 수정본: 가장 중요한 쟁점은 교사 부담과 개인화의 충돌이며, 데이터 프라이버시 노드가 이를 뒷받침한다.");
await page.click("[data-reflection-submit='0']");
await page.waitForTimeout(3000);
console.log("PHASE2 critique items:", critiqueCount);

// readback own events for this case
const events = await page.evaluate(async (caseId) => {
  const client = initializeSupabase();
  const { data, error } = await client
    .from("analytics_events")
    .select("event_type, payload, created_at")
    .eq("case_id", caseId)
    .order("created_at", { ascending: true });
  if (error) return { error: error.message };
  return data.map((r) => ({
    t: r.event_type,
    keys: Object.keys(r.payload || {}).filter((k) => !["session_id", "seq"].includes(k)).slice(0, 12),
    sample: {
      had_feedback: r.payload?.had_feedback,
      revised: r.payload?.revised_after_feedback,
      anchors_fb: r.payload?.anchors_at_feedback,
      anchors_sub: r.payload?.anchors_at_submit,
      prediction: r.payload?.prediction,
      correct: r.payload?.correct,
      sources: Array.isArray(r.payload?.responses) ? r.payload.responses.map((x) => x.source).join(",") : undefined,
    },
  }));
}, CASE_ID);
console.log("PHASE3 events:");
for (const e of (Array.isArray(events) ? events : [events])) console.log("  ", JSON.stringify(e));
await ctx.close();

// ---------- Phase 4: instructor archives the test case ----------
ctx = await browser.newContext();
page = await ctx.newPage();
await login(page, "jmoon19@ua.edu", "cat531-instructor");
const archived = await page.evaluate(async (caseId) => {
  state.activeCaseId = caseId; syncActiveCaseState(); renderAll();
  await setCaseArchived(caseId, true);
  const c = getCaseById(caseId);
  return { archived: Boolean(c?.boardSettings?.archived), published: c?.published };
}, CASE_ID);
console.log("PHASE4 archive:", JSON.stringify(archived), "| exclusion key case_id =", CASE_ID);
await ctx.close();
console.log("page errors:", errs.length ? errs.join(" | ").slice(0, 300) : "none");
await browser.close();
