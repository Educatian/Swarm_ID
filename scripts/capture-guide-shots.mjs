// Capture screenshots for the CAT 531 student guide.
// Usage:
//   node scripts/capture-guide-shots.mjs login          -> login page only (no auth)
//   node scripts/capture-guide-shots.mjs full <name>    -> login + in-app network view as <name>
import { chromium } from "playwright";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { mkdirSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "guide-img");
mkdirSync(OUT, { recursive: true });

const BASE = process.env.DTS_BASE || "https://swarmid.vercel.app";
const mode = process.argv[2] || "login";
const studentName = process.argv[3] || "";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 820 }, deviceScaleFactor: 2 });

// Mask the signed-in roster student's name to a generic label in screenshots.
async function maskNow() {
  if (!studentName) return;
  await page.evaluate(({ real, mask }) => {
    const rep = (s) => (s && s.includes(real)) ? s.split(real).join(mask) : s;
    const fix = () => {
      const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const ns = []; while (tw.nextNode()) ns.push(tw.currentNode);
      ns.forEach((n) => { n.nodeValue = rep(n.nodeValue); });
      document.querySelectorAll("input,textarea").forEach((el) => { el.value = rep(el.value); });
      document.querySelectorAll("option").forEach((o) => { o.textContent = rep(o.textContent); });
    };
    fix();
    if (window.__maskInt) clearInterval(window.__maskInt);
    window.__maskInt = setInterval(fix, 200);
  }, { real: studentName, mask: "Sample Student" });
}

async function shot(name) {
  await maskNow();
  await page.waitForTimeout(900);
  await page.screenshot({ path: join(OUT, name) });
  console.log("saved", name);
}

// 1) Login page (no auth needed)
await page.goto(`${BASE}/cat531.html`, { waitUntil: "networkidle" });
await shot("01-login.png");

if (mode === "full" && studentName) {
  // pick the name, start
  await page.selectOption("#name", studentName);
  await page.click("#start-btn");
  // hand-off to index.html + boot
  await page.waitForURL("**/index.html", { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(4500);

  // Dismiss the guided-tour overlay so screenshots show the real UI.
  for (const label of ["Skip", "Skip tour", "×", "Got it", "Close"]) {
    const b = page.getByRole("button", { name: label, exact: false }).first();
    if (await b.count()) { await b.click().catch(() => {}); await page.waitForTimeout(400); }
  }
  await page.keyboard.press("Escape").catch(() => {});
  await page.waitForTimeout(800);
  await shot("02-app-landing.png");

  // Open the published case to reveal the full Case Network.
  const openBtn = page.getByRole("button", { name: /open case/i }).first();
  if (await openBtn.count()) {
    await openBtn.click().catch(() => {});
  } else {
    const caseCard = page.locator("[data-case-id], .case-card, .case-list li").first();
    if (await caseCard.count()) await caseCard.click().catch(() => {});
  }
  await page.waitForTimeout(4000);
  await page.keyboard.press("Escape").catch(() => {});
  await page.waitForTimeout(600);
  await shot("03-case-network.png");

  // Focused shot of the lens panel (right side) for the "switch lenses" step.
  await page.mouse.wheel(0, 600);
  await page.waitForTimeout(1200);
  await shot("04-lenses-and-add.png");
}

await browser.close();
console.log("done ->", OUT);
