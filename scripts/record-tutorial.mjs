// Auto-record a captioned (no-audio) tutorial walkthrough of the CAT 531
// Design Tension Studio, then transcode webm -> mp4.
//
//   FFMPEG_BIN=<path> node scripts/record-tutorial.mjs "Becky Allen"
//
// Captions + a fake cursor are injected into the page so the silent video is
// still followable. No nodes/notes are committed (read-only walkthrough).
import { chromium } from "playwright";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { mkdirSync, renameSync, rmSync } from "fs";
import { execFileSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const VID_DIR = join(ROOT, "guide-img", "_video_raw");
mkdirSync(VID_DIR, { recursive: true });

const BASE = process.env.DTS_BASE || "https://swarmid.vercel.app";
const FFMPEG = process.env.FFMPEG_BIN || "ffmpeg";
const NAME = process.argv[2] || "Becky Allen";
const W = 1280, H = 800;

// Injected on every navigation: fake cursor, caption bar, step pill, cards.
const INIT = `
window.__tut = {
  ensure() {
    if (document.getElementById("tut-style")) return;
    const s = document.createElement("style");
    s.id = "tut-style";
    s.textContent = \`
      #tut-cursor{position:fixed;z-index:2147483647;left:640px;top:400px;width:26px;height:26px;
        pointer-events:none;transition:left .6s cubic-bezier(.4,0,.2,1),top .6s cubic-bezier(.4,0,.2,1);
        transform:translate(-3px,-2px);filter:drop-shadow(0 2px 3px rgba(0,0,0,.5));}
      #tut-ring{position:fixed;z-index:2147483646;width:42px;height:42px;border-radius:50%;
        border:3px solid #6ea8fe;left:0;top:0;opacity:0;transform:translate(-50%,-50%) scale(.4);pointer-events:none;}
      #tut-ring.go{animation:tutpulse .6s ease-out;}
      @keyframes tutpulse{0%{opacity:.9;transform:translate(-50%,-50%) scale(.4);}100%{opacity:0;transform:translate(-50%,-50%) scale(1.6);}}
      #tut-cap{position:fixed;z-index:2147483645;left:50%;bottom:46px;transform:translateX(-50%);
        max-width:78%;background:rgba(11,16,32,.93);color:#eef2ff;border:1px solid #6ea8fe66;
        border-radius:14px;padding:16px 26px;font:600 21px/1.45 system-ui,"Segoe UI",sans-serif;
        text-align:center;box-shadow:0 18px 50px -18px #000;opacity:0;transition:opacity .35s;}
      #tut-pill{position:fixed;z-index:2147483645;left:50%;bottom:120px;transform:translateX(-50%);
        background:#6ea8fe;color:#07122b;font:800 12px/1 system-ui;letter-spacing:.12em;
        text-transform:uppercase;padding:7px 14px;border-radius:999px;opacity:0;transition:opacity .35s;}
      #tut-card{position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;
        background:radial-gradient(1100px 700px at 80% -10%,#1c2c5a,transparent),#0b1020;
        color:#eef2ff;opacity:0;transition:opacity .5s;pointer-events:none;text-align:center;padding:40px;}
      #tut-card.show{opacity:1;}
      #tut-card h2{font:800 44px/1.15 system-ui;margin:0 0 14px;}
      #tut-card p{font:400 20px/1.5 system-ui;color:#9aa6c6;margin:0;max-width:60ch;}
      #tut-card .k{color:#6ea8fe;font-weight:700;letter-spacing:.15em;text-transform:uppercase;font-size:13px;margin-bottom:18px;}
    \`;
    document.documentElement.appendChild(s);
    const cur = document.createElement("div");
    cur.id = "tut-cursor";
    cur.innerHTML = '<svg viewBox="0 0 24 24" width="26" height="26"><path d="M3 2l7 18 2.5-7.5L20 10z" fill="#fff" stroke="#0b1020" stroke-width="1.4" stroke-linejoin="round"/></svg>';
    const ring = document.createElement("div"); ring.id = "tut-ring";
    const cap = document.createElement("div"); cap.id = "tut-cap";
    const pill = document.createElement("div"); pill.id = "tut-pill";
    const card = document.createElement("div"); card.id = "tut-card";
    card.innerHTML = '<div><div class="k" id="tut-card-k"></div><h2 id="tut-card-h"></h2><p id="tut-card-p"></p></div>';
    [cur, ring, cap, pill, card].forEach((el) => document.body.appendChild(el));
  },
  moveTo(x, y) { this.ensure(); const c = document.getElementById("tut-cursor"); c.style.left = x + "px"; c.style.top = y + "px"; },
  pulse(x, y) { this.ensure(); const r = document.getElementById("tut-ring"); r.style.left = x + "px"; r.style.top = y + "px"; r.classList.remove("go"); void r.offsetWidth; r.classList.add("go"); },
  caption(t, pill) { this.ensure(); const c = document.getElementById("tut-cap"); c.textContent = t || ""; c.style.opacity = t ? "1" : "0";
    const p = document.getElementById("tut-pill"); if (pill) { p.textContent = pill; p.style.opacity = "1"; } else { p.style.opacity = "0"; } },
  card(k, h, p) { this.ensure(); document.getElementById("tut-card-k").textContent = k || ""; document.getElementById("tut-card-h").textContent = h || "";
    document.getElementById("tut-card-p").textContent = p || ""; document.getElementById("tut-card").classList.add("show"); },
  hideCard() { this.ensure(); const c = document.getElementById("tut-card"); if (c) c.classList.remove("show"); }
};
document.addEventListener("DOMContentLoaded", () => window.__tut.ensure());
`;

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: W, height: H },
  recordVideo: { dir: VID_DIR, size: { width: W, height: H } },
});
await context.addInitScript(INIT);
const page = await context.newPage();

// Mask the signed-in roster student's name to a generic label in the captured
// UI so the public guide never spotlights a specific enrolled student. Runs on
// a short interval so it survives the app's live re-renders during the video.
async function maskNow() {
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
  }, { real: NAME, mask: "Sample Student" });
}

const wait = (ms) => page.waitForTimeout(ms);
const cap = async (text, pill = "") => { await page.evaluate(([t, p]) => window.__tut.caption(t, p), [text, pill]); };
const card = async (k, h, p) => { await page.evaluate(([a, b, c]) => window.__tut.card(a, b, c), [k, h, p]); };
const hideCard = async () => { await page.evaluate(() => window.__tut.hideCard()); };
async function point(locator) {
  const el = typeof locator === "string" ? page.locator(locator).first() : locator;
  try { await el.scrollIntoViewIfNeeded({ timeout: 2000 }); } catch (_) {}
  const box = await el.boundingBox();
  if (!box) return null;
  const x = box.x + box.width / 2, y = box.y + box.height / 2;
  await page.evaluate(([px, py]) => window.__tut.moveTo(px, py), [x, y]);
  return { el, x, y };
}
async function pointClick(locator, { click = true } = {}) {
  const hit = await point(locator);
  await wait(750);
  if (hit) { await page.evaluate(([x, y]) => window.__tut.pulse(x, y), [hit.x, hit.y]);
    if (click) { await hit.el.click({ force: true }).catch(() => {}); } }
  return hit;
}

try {
  // INTRO ----------------------------------------------------------------
  await page.goto(`${BASE}/cat531.html`, { waitUntil: "networkidle" });
  await page.evaluate(() => window.__tut.ensure());
  await maskNow();
  await card("CAT 531 · Computer-Based Instruction",
    "Design Tension Studio", "A quick walkthrough of the Module 1 activity");
  await wait(3200);
  await hideCard(); await wait(600);

  // STEP 1 — LOGIN -------------------------------------------------------
  await cap("Pick your name from the list. No password needed.", "Step 1 · Log in");
  await point("#name"); await wait(1000);
  await page.selectOption("#name", NAME); await wait(900);
  await cap("Then click Start.", "Step 1 · Log in");
  await pointClick("#start-btn");
  await page.waitForURL("**/index.html", { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(4500);
  await page.evaluate(() => window.__tut.ensure());
  await maskNow();

  // dismiss the auto guided-tour overlay so the real UI is visible. It can appear
  // a beat after boot, so retry a few times until no Skip button remains.
  async function dismissTour() {
    for (let i = 0; i < 6; i++) {
      let acted = false;
      for (const label of ["Skip", "Skip tour", "Got it", "Close"]) {
        const b = page.getByRole("button", { name: label, exact: false }).first();
        if (await b.count() && await b.isVisible().catch(() => false)) {
          await b.click().catch(() => {}); acted = true; await wait(350);
        }
      }
      await page.keyboard.press("Escape").catch(() => {});
      if (!acted) break;
      await wait(500);
    }
  }
  await dismissTour();
  await wait(800);

  // STEP 2 — READ THE MAP / OPEN CASE ------------------------------------
  await cap("Your classroom case is already provided. You don't write or invent one.", "Step 2 · The case is given");
  await wait(3200);
  await dismissTour();
  await cap("Open the published Module 1 case.", "Step 2 · Open the case");
  const openBtn = page.getByRole("button", { name: /open case/i }).first();
  if (await openBtn.count()) { await pointClick(openBtn); }
  await wait(3500);
  await page.keyboard.press("Escape").catch(() => {});

  // STEP 3 — LENSES ------------------------------------------------------
  await cap("Switch lenses to see the same case from each stakeholder's side.", "Step 3 · Switch lenses");
  await wait(1500);
  for (const [key, line] of [
    ["teacher", "Teacher — pedagogy, pacing, judgment"],
    ["administrator", "Administrator — adoption, policy, cost"],
    ["student", "Student — access, equity, experience"],
    ["it", "IT Systems — devices, data, connectivity"],
    ["accessibility", "Accessibility — who gets left out"],
  ]) {
    const chip = page.locator(`#stakeholder-pills button[data-pill="${key}"]`).first();
    if (await chip.count()) { await cap(line, "Step 3 · Switch lenses"); await pointClick(chip); await wait(1400); }
  }

  // STEP 4 — ADD A NODE (point only, no write) ---------------------------
  await cap("Spot a tension the case misses? Click Add a node.", "Step 4 · Add a node");
  const addBtn = page.getByRole("button", { name: /add a node/i }).first();
  if (await addBtn.count()) { await pointClick(addBtn, { click: false }); }
  await wait(2800);

  // STEP 5 — ANNOTATE + RATIONALE ----------------------------------------
  await cap("Click a node, then save a note with your reasoning.", "Step 5 · Save a note");
  await wait(3000);
  await cap("Finally, decide which tension matters most — that's your rationale.", "Step 5 · Rationale");
  await wait(3400);

  // OUTRO ----------------------------------------------------------------
  await cap("");
  await card("You're ready", "Open the Studio and start mapping",
    "Full written guide: cat531-guide.html  ·  Questions? jmoon19@ua.edu");
  await wait(3600);
} finally {
  const vid = page.video();
  await context.close();
  await browser.close();
  const raw = vid ? await vid.path() : null;
  if (raw) {
    const out = join(ROOT, "cat531-tutorial.mp4");
    console.log("raw webm:", raw);
    execFileSync(FFMPEG, [
      "-y", "-i", raw,
      "-vf", "fps=30,scale=1280:-2",
      "-c:v", "libx264", "-crf", "23", "-preset", "medium",
      "-pix_fmt", "yuv420p", "-movflags", "+faststart",
      out,
    ], { stdio: "inherit" });
    console.log("mp4 ->", out);
    try { rmSync(VID_DIR, { recursive: true, force: true }); } catch (_) {}
  }
}
