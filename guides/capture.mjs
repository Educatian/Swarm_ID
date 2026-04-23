/**
 * Swarm_ID screenshot capture for the four guides.
 *
 * Usage:
 *   # Install once (repo root):
 *   #   npm init -y && npm i -D playwright && npx playwright install chromium
 *   APP_URL=https://swarmid.vercel.app \
 *   INSTRUCTOR_EMAIL=... INSTRUCTOR_PASSWORD=... \
 *   STUDENT_EMAIL=...    STUDENT_PASSWORD=... \
 *   STUDENT_JOIN_CODE=... \
 *   node guides/capture.mjs instructor   # or: student | both
 *
 * Output tree:
 *   guides/screenshots/instructor/01-login.png ... 10-report.png
 *   guides/screenshots/student/01-join.png ... 11-reflection.png
 *
 * The guide markdown files reference screenshots by the same step numbers
 * in both locales, so running this script once populates all four guides.
 */

import { chromium } from "playwright";
import { mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const APP_URL = process.env.APP_URL || "https://swarmid.vercel.app";
const ROLE = (process.argv[2] || "both").toLowerCase();
const LOCALE = (process.env.LOCALE || "en").toLowerCase(); // "en" or "ko"
const SHOTS_DIR = path.join(__dirname, "screenshots");

function ensureDir(p) {
  if (!existsSync(p)) mkdirSync(p, { recursive: true });
}

async function shot(page, role, number, name) {
  const dir = path.join(SHOTS_DIR, role);
  ensureDir(dir);
  const label = String(number).padStart(2, "0");
  const file = path.join(dir, `${label}-${name}.png`);
  await page.screenshot({ path: file, fullPage: false });
  console.log(`  ✓ ${role}/${label}-${name}.png`);
}

async function wait(page, ms) {
  await page.waitForTimeout(ms);
}

async function setLocale(page, locale) {
  // The app has a locale toggle button in the topbar. We set it via a
  // best-effort selector chain and fall back to JS evaluation.
  try {
    await page.evaluate((loc) => {
      if (window.state && window.state.locale !== loc) {
        window.state.locale = loc;
        if (typeof window.applyTranslations === "function") window.applyTranslations();
        if (typeof window.renderAll === "function") window.renderAll();
      }
    }, locale);
  } catch (_) {
    // ignore - some pages run before state is attached to window
  }
}

async function loginAs(page, email, password) {
  await page.goto(APP_URL, { waitUntil: "networkidle" });
  await wait(page, 800);

  // Landing/login screen: fill email + password.
  const emailField = page.locator('input[type="email"]').first();
  const passwordField = page.locator('input[type="password"]').first();
  await emailField.fill(email);
  await passwordField.fill(password);

  // Submit — the primary button on the landing form.
  const submit = page.locator('form button[type="submit"]').first();
  await Promise.all([
    page.waitForLoadState("networkidle"),
    submit.click(),
  ]);
  await wait(page, 1500);
}

// -------------------- Instructor flow --------------------
async function runInstructor(browser) {
  const email = process.env.INSTRUCTOR_EMAIL;
  const password = process.env.INSTRUCTOR_PASSWORD;
  if (!email || !password) {
    console.error("Missing INSTRUCTOR_EMAIL / INSTRUCTOR_PASSWORD");
    return;
  }

  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const role = `instructor-${LOCALE}`;

  // 01 · Landing / login screen (pre-fill visible)
  await page.goto(APP_URL, { waitUntil: "networkidle" });
  await wait(page, 1000);
  await shot(page, role, 1, "login");

  // Log in and continue
  await loginAs(page, email, password);
  await setLocale(page, LOCALE);
  await wait(page, 800);

  // 02 · Studio landing (case network view)
  await shot(page, role, 2, "studio-landing");

  // 03 · Publish / open a case from the case list
  // Scroll intake panel so case list is visible then highlight a case.
  await page.evaluate(() => {
    document.querySelector('[data-collapsible-panel="intake"]')?.scrollIntoView({ behavior: "instant", block: "start" });
  });
  await wait(page, 400);
  await shot(page, role, 3, "case-library");

  // 04 · Open a published case (first Open-case button)
  const openCase = page.locator('button:has-text("Open case"), button:has-text("케이스 열기")').first();
  if (await openCase.count()) {
    await openCase.click();
    await wait(page, 1200);
  }
  await shot(page, role, 4, "case-open");

  // 05 · Upload / structure a new brief (intake composer)
  // Scroll to the brief textarea.
  const briefArea = page.locator('textarea').first();
  if (await briefArea.count()) {
    await briefArea.scrollIntoViewIfNeeded();
    await wait(page, 300);
  }
  await shot(page, role, 5, "upload-brief");

  // 06 · Board settings / governance
  const settingsTab = page.locator('button:has-text("Settings"), button:has-text("설정")').first();
  if (await settingsTab.count()) {
    await settingsTab.click();
    await wait(page, 800);
  }
  await shot(page, role, 6, "board-settings");

  // 07 · Perspectives view
  const perspectivesNav = page.locator('[data-view="perspectives"], a:has-text("Perspectives"), a:has-text("관점")').first();
  if (await perspectivesNav.count()) {
    await perspectivesNav.click();
    await wait(page, 800);
  }
  await shot(page, role, 7, "perspectives");

  // 08 · Trade-offs view
  const tradeoffsNav = page.locator('[data-view="matrix"], a:has-text("Trade-offs"), a:has-text("트레이드")').first();
  if (await tradeoffsNav.count()) {
    await tradeoffsNav.click();
    await wait(page, 800);
  }
  await shot(page, role, 8, "trade-offs");

  // 09 · Sandbox (scenarios)
  const sandboxNav = page.locator('[data-view="sandbox"], a:has-text("Sandbox"), a:has-text("샌드박스")').first();
  if (await sandboxNav.count()) {
    await sandboxNav.click();
    await wait(page, 800);
  }
  await shot(page, role, 9, "sandbox");

  // 10 · Report view (export)
  const reportNav = page.locator('[data-view="report"], a:has-text("Report"), a:has-text("리포트")').first();
  if (await reportNav.count()) {
    await reportNav.click();
    await wait(page, 800);
  }
  await shot(page, role, 10, "report");

  await ctx.close();
}

// -------------------- Student flow --------------------
async function runStudent(browser) {
  const email = process.env.STUDENT_EMAIL;
  const password = process.env.STUDENT_PASSWORD;
  if (!email || !password) {
    console.error("Missing STUDENT_EMAIL / STUDENT_PASSWORD");
    return;
  }

  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const role = `student-${LOCALE}`;

  // 01 · Login / join
  await page.goto(APP_URL, { waitUntil: "networkidle" });
  await wait(page, 1000);
  await shot(page, role, 1, "login");

  await loginAs(page, email, password);
  await setLocale(page, LOCALE);
  await wait(page, 800);

  // 02 · Student onboarding card (first-time view)
  await shot(page, role, 2, "onboarding");

  // 03 · Case selection (published cases)
  const openCase = page.locator('button:has-text("Open case"), button:has-text("케이스 열기")').first();
  await shot(page, role, 3, "pick-case");
  if (await openCase.count()) {
    await openCase.click();
    await wait(page, 1500);
  }

  // 04 · Case map with brief
  await shot(page, role, 4, "case-map");

  // 05 · First question (composer)
  const composer = page.locator('#visualizer-input');
  if (await composer.count()) {
    await composer.fill(
      LOCALE === "ko"
        ? "이 수업에서 학생 자율성과 교사 검토 부담은 어떻게 충돌하나요?"
        : "How do student autonomy and teacher review load collide in this design?"
    );
    await wait(page, 400);
  }
  await shot(page, role, 5, "first-question");

  // Submit the question and wait for the 5-agent swarm round to populate.
  const ask = page.locator('#visualizer-form button[type="submit"]');
  if (await ask.count()) {
    await ask.click();
  }
  await wait(page, 9000); // parallel Gemini calls usually settle under 7s

  // 06 · Swarm round — 5 agent responses visible, provenance badges on nodes
  await shot(page, role, 6, "swarm-round");

  // 07 · Disagreement edges rendered (wait for classifier second pass)
  await wait(page, 5000);
  await shot(page, role, 7, "disagreement-edges");

  // 08 · Challenge this lens — open prompt, simulate response
  // (Playwright can't interact with window.prompt directly, so we trigger via JS)
  await page.evaluate(() => {
    const btn = document.querySelector(".chat-challenge");
    btn?.scrollIntoView({ block: "center" });
  });
  await wait(page, 400);
  await shot(page, role, 8, "challenge-button");

  // 09 · Add your own agenda node
  const agendaTrigger = page.locator('button:has-text("Add to map"), button:has-text("맵에 추가")').first();
  if (await agendaTrigger.count()) {
    await agendaTrigger.scrollIntoViewIfNeeded();
    await wait(page, 400);
  }
  await shot(page, role, 9, "add-agenda");

  // 10 · Report view (personal reflection)
  const reportNav = page.locator('[data-view="report"], a:has-text("Report"), a:has-text("리포트")').first();
  if (await reportNav.count()) {
    await reportNav.click();
    await wait(page, 800);
  }
  await shot(page, role, 10, "report");

  // 11 · Export / reflection close
  const exportBtn = page.locator('button:has-text("Download"), button:has-text("다운로드")').first();
  if (await exportBtn.count()) {
    await exportBtn.scrollIntoViewIfNeeded();
  }
  await shot(page, role, 11, "export");

  await ctx.close();
}

// -------------------- Main --------------------
(async () => {
  ensureDir(SHOTS_DIR);
  const browser = await chromium.launch({ headless: true });
  try {
    if (ROLE === "instructor" || ROLE === "both") await runInstructor(browser);
    if (ROLE === "student" || ROLE === "both") await runStudent(browser);
    console.log("Done.");
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
