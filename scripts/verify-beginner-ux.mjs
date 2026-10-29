/* Regression checks for beginner routing, bilingual entry, preview isolation,
   and mobile controls. Uses synthetic demo data only; never signs in. */
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
const BASE = process.env.SMOKE_BASE || "http://127.0.0.1:8146";
const OUT = process.env.UX_OUTPUT || path.resolve("output/playwright/beginner-ux");
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const checks = [];
const check = (name, ok, detail = "") => {
  checks.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"} ${name} ${detail}`);
};
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
const page = await context.newPage();
const errors = [];
page.on("pageerror", e => errors.push(e.message));
for (const lang of ["ko", "en"]) {
  await page.goto(`${BASE}/index.html`);
  await page.waitForFunction(() => typeof setLocale === "function");
  await page.evaluate(lang => setLocale(lang), lang);
  await page.locator(".ux-demo-link").waitFor();
  check(`${lang}: entry has a no-login sample`, (await page.locator(".ux-demo-link").getAttribute("href")).includes(`lang=${lang}`));
  await page.screenshot({ path: path.join(OUT, `landing-${lang}.png`), fullPage: true });
  await page.locator(".ux-demo-link").click();
  await page.locator(".ux-home").waitFor();
  await page.waitForTimeout(650);
  check(`${lang}: sample mode is explicit`, await page.locator(".ux-demo-banner").isVisible());
  check(`${lang}: exactly three primary routes`, await page.locator(".workspace-primary-nav button:visible").count() === 3);
  check(`${lang}: no fabricated learning percentage`, await page.locator("#home-view [role=progressbar]").count() === 0);
  await page.screenshot({ path: path.join(OUT, `home-${lang}.png`), fullPage: true });
  await page.locator(".home-continue-cta").click();
  check(`${lang}: primary action opens map`, await page.locator("#app-shell").getAttribute("data-active-view") === "visualizer");
  await page.screenshot({ path: path.join(OUT, `map-${lang}.png`), fullPage: true });
  await page.locator('.workspace-primary-nav [data-view="report"]').click();
  check(`${lang}: reflection route opens`, await page.locator("#app-shell").getAttribute("data-active-view") === "report");
  await page.locator("textarea.reflection-response").first().fill(lang === "ko" ? "기기 접근 격차를 고려해 대체 활동을 함께 준비해야 해요." : "We should offer an alternative activity for students without device access.");
  await page.locator("[data-reflection-submit]").first().click();
  check(`${lang}: sample submission is labelled`, /체험용|Sample reflection/.test(await page.locator("[data-reflection-status]").first().innerText()));
  await page.screenshot({ path: path.join(OUT, `reflection-${lang}.png`), fullPage: true });
  await page.locator('.workspace-primary-nav [data-view="home"]').click();
  for (const width of [390, 720, 980]) {
    await page.setViewportSize({ width, height: 844 });
    await page.evaluate(() => window.scrollTo(0, 0));
    check(`${lang}/${width}: no page overflow`, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    check(`${lang}/${width}: settings reachable`, await page.locator(".topbar-more > summary").isVisible());
    check(`${lang}/${width}: navigation reachable`, await page.locator('.workspace-primary-nav [data-view="report"]').isVisible());
    if (width === 390) await page.screenshot({ path: path.join(OUT, `mobile-home-${lang}.png`), fullPage: true });
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.evaluate(() => { getCaseById(state.activeCaseId).boardSettings.studentView = "network-only"; renderAll(); });
  check(`${lang}: restricted course hides reflection route`, !(await page.locator('.workspace-primary-nav [data-view="report"]').isVisible()));
  check(`${lang}: restricted course has no reflection launcher`, await page.locator('#home-view [data-home-goto="report"]').count() === 0);
}
// A saved real session must never be restored, cleared, or used by a sample.
const isolated = await browser.newContext();
await isolated.addInitScript(() => {
  localStorage.setItem("dts-cloudflare-session-v1", JSON.stringify({ access_token: "synthetic-preview-isolation-check" }));
});
const demo = await isolated.newPage();
const apiRequests = [];
demo.on("request", r => { if (new URL(r.url()).pathname.startsWith("/api/")) apiRequests.push(r.url()); });
await demo.goto(`${BASE}/preview.html?lang=en`);
await demo.locator(".ux-home").waitFor();
await demo.waitForTimeout(650);
await demo.evaluate(async () => {
  logEvent("ux.test", {});
  persistPlatformState();
  persistSessionState();
  try { await requestGeminiContent({ prompt: "Synthetic sample isolation check" }); } catch (_) {}
});
check("preview makes no auth, data, or AI API requests", apiRequests.length === 0, apiRequests.join(", "));
check("preview preserves the saved account", (await demo.evaluate(() => JSON.parse(localStorage.getItem("dts-cloudflare-session-v1"))?.access_token)) === "synthetic-preview-isolation-check");
check("no JavaScript runtime errors", errors.length === 0, errors.join("; "));
writeFileSync(path.join(OUT, "verification.json"), JSON.stringify({ base: BASE, checks, errors }, null, 2));
await browser.close();
process.exit(checks.some(c => !c.ok) ? 1 : 0);
