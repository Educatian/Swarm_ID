/**
 * Unified screenshot capture for all four classroom guides.
 *
 * Runs a single Playwright session per role/locale combination and
 * populates guides/screenshots/{role}-{locale}/NN-name.png.
 *
 * Since we do not have Hyojung's instructor password handy, we use
 * iuclass1@swarm.io and flip its W200 membership role between 'admin'
 * (instructor capture) and 'user' (student capture) externally via SQL.
 *
 * Run:
 *   node scripts/capture-guides.mjs
 */

import { chromium } from "playwright";
import { mkdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SHOTS_DIR = path.join(ROOT, "guides", "screenshots");

const APP_URL = process.env.APP_URL || "https://swarmid.vercel.app";
const EMAIL = process.env.E2E_EMAIL || "iuclass1@swarm.io";
const PASSWORD = process.env.E2E_PASSWORD || "classiu1";

const VIEWPORT = { width: 1440, height: 900 };

function ensureDir(p) {
  if (!existsSync(p)) mkdirSync(p, { recursive: true });
}

async function shot(page, role, n, name) {
  const dir = path.join(SHOTS_DIR, role);
  ensureDir(dir);
  const file = path.join(dir, `${String(n).padStart(2, "0")}-${name}.png`);
  await page.screenshot({ path: file, fullPage: false });
  console.log(`  ✓ ${role}/${String(n).padStart(2, "0")}-${name}.png`);
}

async function wait(page, ms) {
  await page.waitForTimeout(ms);
}

async function setLocale(page, locale) {
  // Click the locale toggle button if the UI doesn't already match.
  try {
    await page.evaluate((loc) => {
      if (window.state && window.state.locale !== loc) {
        window.state.locale = loc;
        if (typeof window.applyTranslations === "function") window.applyTranslations();
        if (typeof window.renderAll === "function") window.renderAll();
      }
      try { localStorage.setItem("swarm-id-locale", loc); } catch (e) {}
    }, locale);
    await wait(page, 400);
  } catch (e) {
    // ignore
  }
}

async function signIn(page) {
  await page.goto(APP_URL, { waitUntil: "networkidle" });
  await wait(page, 1200);

  // Fill the login form.
  const emailField = page.locator('input[type="email"]').first();
  const passwordField = page.locator('input[type="password"]').first();
  await emailField.waitFor({ state: "visible", timeout: 10000 });
  await emailField.fill(EMAIL);
  await passwordField.fill(PASSWORD);

  const submit = page.locator('form button[type="submit"]').first();
  await Promise.all([
    page.waitForLoadState("networkidle"),
    submit.click(),
  ]);
  await wait(page, 2500);
}

async function runInstructor(browser, locale) {
  const ctx = await browser.newContext({ viewport: VIEWPORT });
  const page = await ctx.newPage();
  const role = `instructor-${locale}`;

  // 01 · Landing / sign-in
  await page.goto(APP_URL, { waitUntil: "networkidle" });
  await wait(page, 1500);
  if (locale === "ko") await setLocale(page, "ko");
  await wait(page, 600);
  await shot(page, role, 1, "login");

  // sign in
  await signIn(page);
  if (locale === "ko") await setLocale(page, "ko");
  await wait(page, 1500);

  // 02 · Studio landing
  await shot(page, role, 2, "studio-landing");

  // 03 · Case library (scroll intake panel)
  await page.evaluate(() => {
    const el = document.querySelector('[data-collapsible-panel="intake"]') || document.querySelector(".intake-panel");
    el?.scrollIntoView({ behavior: "instant", block: "start" });
  });
  await wait(page, 500);
  await shot(page, role, 3, "case-library");

  // 04 · Open a case
  const openCase = page.locator('button:has-text("Open case"), button:has-text("케이스 열기")').first();
  if (await openCase.count()) {
    await openCase.click();
    await wait(page, 2500);
  }
  await shot(page, role, 4, "case-open");

  // 05 · Upload/structure brief
  const briefArea = page.locator('textarea').first();
  if (await briefArea.count()) {
    await briefArea.scrollIntoViewIfNeeded();
    await wait(page, 400);
  }
  await shot(page, role, 5, "upload-brief");

  // 06 · Board settings
  const settingsTab = page.locator('a:has-text("Settings"), a:has-text("설정"), button:has-text("Settings"), button:has-text("설정")').first();
  if (await settingsTab.count()) {
    await settingsTab.click();
    await wait(page, 900);
  }
  await shot(page, role, 6, "board-settings");

  // 07 · Perspectives
  const perspectivesNav = page.locator('[data-view="perspectives"], a:has-text("Perspectives"), a:has-text("관점")').first();
  if (await perspectivesNav.count()) {
    await perspectivesNav.click();
    await wait(page, 900);
  }
  await shot(page, role, 7, "perspectives");

  // 08 · Trade-offs
  const tradeoffsNav = page.locator('[data-view="matrix"], a:has-text("Trade-offs"), a:has-text("트레이드")').first();
  if (await tradeoffsNav.count()) {
    await tradeoffsNav.click();
    await wait(page, 900);
  }
  await shot(page, role, 8, "trade-offs");

  // 09 · Sandbox
  const sandboxNav = page.locator('[data-view="sandbox"], a:has-text("Sandbox"), a:has-text("샌드박스")').first();
  if (await sandboxNav.count()) {
    await sandboxNav.click();
    await wait(page, 900);
  }
  await shot(page, role, 9, "sandbox");

  // 10 · Report
  const reportNav = page.locator('[data-view="report"], a:has-text("Report"), a:has-text("리포트")').first();
  if (await reportNav.count()) {
    await reportNav.click();
    await wait(page, 900);
  }
  await shot(page, role, 10, "report");

  await ctx.close();
}

async function runStudent(browser, locale) {
  const ctx = await browser.newContext({ viewport: VIEWPORT });
  const page = await ctx.newPage();
  const role = `student-${locale}`;

  // 01 · Landing / sign-in
  await page.goto(APP_URL, { waitUntil: "networkidle" });
  await wait(page, 1500);
  if (locale === "ko") await setLocale(page, "ko");
  await wait(page, 600);
  await shot(page, role, 1, "login");

  await signIn(page);
  if (locale === "ko") await setLocale(page, "ko");
  await wait(page, 1500);

  // 02 · Onboarding card
  await shot(page, role, 2, "onboarding");

  // 03 · Case library (student sees published only)
  await page.evaluate(() => {
    const el = document.querySelector('[data-collapsible-panel="intake"]') || document.querySelector(".intake-panel");
    el?.scrollIntoView({ behavior: "instant", block: "start" });
  });
  await wait(page, 500);
  await shot(page, role, 3, "pick-case");

  // Open first case
  const openCase = page.locator('button:has-text("Open case"), button:has-text("케이스 열기")').first();
  if (await openCase.count()) {
    await openCase.click();
    await wait(page, 2500);
  }

  // 04 · Case map
  await shot(page, role, 4, "case-map");

  // 05 · Composer with first question
  const composer = page.locator('#visualizer-input');
  if (await composer.count()) {
    await composer.scrollIntoViewIfNeeded();
    await composer.fill(
      locale === "ko"
        ? "이 수업에서 학생 자율성과 교사 검토 부담은 어떻게 충돌하나요?"
        : "How do student autonomy and teacher review load collide in this design?"
    );
    await wait(page, 500);
  }
  await shot(page, role, 5, "first-question");

  // Submit the question
  const ask = page.locator('#visualizer-form button[type="submit"]');
  if (await ask.count()) {
    await ask.click();
  }
  await wait(page, 9000);

  // 06 · Swarm round — 5 agent responses visible
  await shot(page, role, 6, "swarm-round");

  // 07 · Disagreement edges (second classifier pass)
  await wait(page, 5000);
  await shot(page, role, 7, "disagreement-edges");

  // 08 · Challenge button visible on a chat message
  await page.evaluate(() => {
    const btn = document.querySelector(".chat-challenge");
    btn?.scrollIntoView({ block: "center" });
  });
  await wait(page, 600);
  await shot(page, role, 8, "challenge-button");

  // 09 · Add-to-map form
  const agendaTrigger = page.locator('button:has-text("Add to map"), button:has-text("맵에 추가")').first();
  if (await agendaTrigger.count()) {
    await agendaTrigger.scrollIntoViewIfNeeded();
    await wait(page, 500);
  }
  await shot(page, role, 9, "add-agenda");

  // 10 · Report
  const reportNav = page.locator('[data-view="report"], a:has-text("Report"), a:has-text("리포트")').first();
  if (await reportNav.count()) {
    await reportNav.click();
    await wait(page, 900);
  }
  await shot(page, role, 10, "report");

  // 11 · Export buttons (tolerate absence)
  try {
    const exportBtn = page.locator('button:has-text("Download"), button:has-text("다운로드")').first();
    if (await exportBtn.count()) {
      await exportBtn.scrollIntoViewIfNeeded({ timeout: 3000 }).catch(() => {});
      await wait(page, 300);
    }
  } catch (e) {
    // ignore — still grab the current viewport as step 11
  }
  await shot(page, role, 11, "export");

  await ctx.close();
}

(async () => {
  ensureDir(SHOTS_DIR);
  console.log(`Capture target: ${APP_URL}`);
  console.log(`Signing in as: ${EMAIL}\n`);

  const role = (process.argv[2] || "all").toLowerCase();
  const localeArg = (process.argv[3] || "all").toLowerCase();

  const browser = await chromium.launch({ headless: true });
  try {
    const locales = localeArg === "all" ? ["en", "ko"] : [localeArg];
    for (const loc of locales) {
      if (role === "instructor" || role === "all") {
        console.log(`\n=== instructor · ${loc} ===`);
        await runInstructor(browser, loc);
      }
      if (role === "student" || role === "all") {
        console.log(`\n=== student · ${loc} ===`);
        await runStudent(browser, loc);
      }
    }
    console.log("\nAll captures complete.");
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
