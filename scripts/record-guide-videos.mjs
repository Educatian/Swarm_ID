/* Record narrated screen-recording clips for the KO guides.
   Pattern: Playwright recordVideo + injected fake cursor; one clip per guide
   step, held open until the narration duration elapses. Mux audio afterwards
   with scripts/mux-guide-videos.py.
   Usage: py -m http.server 8137  (repo root) then: node scripts/record-guide-videos.mjs [filter] */
import { chromium } from "playwright";
import { mkdirSync, readdirSync, renameSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";

const BASE = "http://127.0.0.1:8137";
const FF = execFileSync("py", ["-c", "import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())"]).toString().trim();

function audioDur(mp3) {
  try {
    execFileSync(FF, ["-i", mp3], { stdio: ["ignore", "pipe", "pipe"] });
    return 30;
  } catch (e) {
    const m = String(e.stderr).match(/Duration: (\d+):(\d+):(\d+\.\d+)/);
    if (!m) return 30;
    return Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]);
  }
}

const CURSOR_INIT = `
  window.addEventListener("DOMContentLoaded", () => {
    const c = document.createElement("div");
    c.id = "fake-cursor";
    c.style.cssText = "position:fixed;z-index:99999;width:28px;height:28px;border-radius:50%;" +
      "background:rgba(255,213,87,.5);border:3px solid rgba(255,213,87,1);pointer-events:none;" +
      "transform:translate(-50%,-50%);transition:width .15s,height .15s;left:640px;top:400px;box-shadow:0 0 18px rgba(255,213,87,.8)";
    document.body.appendChild(c);
    window.addEventListener("mousemove", (e) => { c.style.left = e.clientX + "px"; c.style.top = e.clientY + "px"; }, true);
    window.addEventListener("mousedown", () => { c.style.width = "42px"; c.style.height = "42px"; }, true);
    window.addEventListener("mouseup", () => { c.style.width = "28px"; c.style.height = "28px"; }, true);
  });
`;

async function glide(page, x, y, ms = 700) {
  await page.mouse.move(x, y, { steps: Math.max(8, Math.round(ms / 30)) });
  await page.waitForTimeout(180);
}

async function glideTo(page, selector, ms = 700) {
  const loc = page.locator(selector).first();
  let box = await loc.boundingBox().catch(() => null);
  if (!box) return null;
  // The view must FOLLOW the cursor: if the target sits outside the viewport,
  // smooth-scroll it to center first so the recording shows the camera move.
  const viewport = page.viewportSize();
  if (box.y < 70 || box.y + box.height > viewport.height - 40) {
    await loc.evaluate((el) => el.scrollIntoView({ behavior: "smooth", block: "center" })).catch(() => {});
    await page.waitForTimeout(950);
    box = await loc.boundingBox().catch(() => null);
    if (!box) return null;
  }
  const cx = box.x + box.width / 2;
  const cy = Math.min(Math.max(box.y + box.height / 2, 10), viewport.height - 10);
  await glide(page, cx, cy, ms);
  return { ...box, cx, cy };
}

async function clickAt(page, selector) {
  const box = await glideTo(page, selector);
  if (!box) return;
  await page.mouse.down();
  await page.waitForTimeout(120);
  await page.mouse.up();
  await page.waitForTimeout(350);
}

async function typeSlow(page, selector, text) {
  await clickAt(page, selector);
  await page.locator(selector).first().type(text, { delay: 55 }).catch(() => {});
}

async function enterStudio(page, opts = {}) {
  const density = opts.density || "simple";
  const view = opts.view || "visualizer";
  await page.goto(BASE + "/preview.html", { waitUntil: "networkidle" });
  await page.waitForTimeout(1800);
  await page.evaluate(
    (cfg) => {
      localStorage.setItem("task-banner-collapsed", "0");
      setDensity(cfg.d);
      setView(cfg.v);
      renderAll();
    },
    { d: density, v: view }
  );
  await page.waitForTimeout(1200);
}

const STUDENT = {
  "01-landing": async (page) => {
    await page.goto(BASE + "/index.html", { waitUntil: "networkidle" });
    await page.waitForTimeout(2200);
    await glideTo(page, ".landing-steps li:nth-child(1)", 900);
    await glideTo(page, ".landing-steps li:nth-child(2)", 700);
    await glideTo(page, ".landing-steps li:nth-child(3)", 700);
    await glideTo(page, "#landing-login-email", 800);
    await clickAt(page, "#landing-auth-mode-toggle");
    await glideTo(page, "#landing-join-code", 700);
    await clickAt(page, "#landing-auth-mode-toggle");
  },
  "02-welcome": async (page) => {
    await enterStudio(page);
    await page.evaluate(() => showWelcome(true));
    await page.waitForTimeout(1500);
    for (let i = 0; i < 3; i++) {
      await clickAt(page, "#welcome-next");
      await page.waitForTimeout(1700);
    }
    await clickAt(page, "#welcome-skip");
  },
  "03-home": async (page) => {
    await enterStudio(page, { view: "home" });
    await glideTo(page, ".home-greeting", 800);
    await page.waitForTimeout(900);
    await clickAt(page, "[data-home-goto='visualizer']");
    await page.waitForTimeout(1500);
  },
  "04-task-banner": async (page) => {
    await enterStudio(page);
    await glideTo(page, "#task-banner .task-step:nth-child(1)", 700);
    await glideTo(page, "#task-banner .task-step:nth-child(3)", 800);
    await glideTo(page, "#task-banner .task-step:nth-child(5)", 800);
    await clickAt(page, "[data-task-collapse]");
    await page.waitForTimeout(900);
    await clickAt(page, "[data-task-expand]");
  },
  "05-map-read": async (page) => {
    await enterStudio(page);
    const nodes = page.locator(".network-node[data-type='signal']");
    const n = await nodes.count();
    for (const idx of [1, Math.min(3, Math.max(0, n - 1))]) {
      const box = await nodes.nth(idx).boundingBox().catch(() => null);
      if (box) {
        await glide(page, box.x + box.width / 2, box.y + 10, 900);
        await page.mouse.down();
        await page.mouse.up();
        await page.waitForTimeout(1600);
      }
    }
    await clickAt(page, "#map-focus-btn");
    await page.waitForTimeout(1300);
    await clickAt(page, "#map-focus-btn");
  },
  "06-lens-bar": async (page) => {
    await enterStudio(page);
    const keys = ["student", "it", "administrator", "teacher"];
    for (const k of keys) {
      await clickAt(page, "#stakeholder-pills button[data-pill='" + k + "']");
      await page.waitForTimeout(1400);
    }
  },
  "07-swarm-round": async (page) => {
    await enterStudio(page, { density: "detailed" });
    await clickAt(page, "#composer-toggle");
    await typeSlow(page, "#visualizer-input", "AI 개인화가 교사 자율성을 침해하지 않으려면?");
    await clickAt(page, "#visualizer-form button[type='submit']");
    await page.waitForTimeout(2600);
    await glideTo(page, "#graph-events", 900);
  },
  "08-add-node": async (page) => {
    await enterStudio(page);
    await clickAt(page, ".map-dock-btn[data-drawer='intake']");
    await page.waitForTimeout(700);
    await typeSlow(page, "#agenda-node-form input[name='agendaTitle']", "기기 접근 격차");
    await typeSlow(page, "#agenda-node-form textarea[name='agendaBody']", "가정에 기기가 없는 학생은 어떻게 참여하나요?");
    await clickAt(page, "#agenda-node-form button[type='submit']");
    await page.waitForTimeout(2500);
  },
  "09-list-view": async (page) => {
    await enterStudio(page);
    await clickAt(page, "#map-mode-btn");
    await page.waitForTimeout(900);
    await typeSlow(page, "#node-list-search", "교사");
    await page.waitForTimeout(900);
    await page.locator("#node-list-search").fill("");
    await clickAt(page, ".node-list-row");
    await page.waitForTimeout(800);
    await clickAt(page, "#map-mode-btn");
  },
  "10-class-view": async (page) => {
    await enterStudio(page);
    await glideTo(page, "#map-layer-select", 700);
    await page.locator("#map-layer-select").selectOption("cohort").catch(() => {});
    await page.waitForTimeout(2000);
    await page.evaluate(() => {
      const pill = document.getElementById("presence-pill");
      if (pill) {
        pill.hidden = false;
        pill.textContent = "함께 보는 중 3명";
      }
      showToast("서연 님의 활동이 맵에 반영됐어요.");
    });
    await glideTo(page, "#presence-pill", 800);
  },
  "11-report": async (page) => {
    await enterStudio(page);
    await clickAt(page, ".nav-item[data-view='report']");
    await page.waitForTimeout(1200);
    await glideTo(page, "#report-summary", 800);
    await glideTo(page, "#reflection-prompts", 1000);
  },
};

const INSTRUCTOR = {
  "01-create-case": async (page) => {
    await enterStudio(page, { density: "detailed" });
    await page.evaluate(() => {
      state.activeRole = "admin";
      renderAll();
    });
    await page.waitForTimeout(1200);
    await glideTo(page, "#intake-title", 800);
    await glideTo(page, "#pipeline-console", 900);
    const brief = page.locator("#pipeline-console textarea").first();
    if (await brief.count()) {
      const box = await brief.boundingBox().catch(() => null);
      if (box) {
        await glide(page, box.x + 40, box.y + 20, 700);
        await page.mouse.down();
        await page.mouse.up();
        await brief.type("중학교 과학 수업에 AI 튜터를 도입하려는 상황...", { delay: 45 }).catch(() => {});
      }
    }
  },
  "02-manage": async (page) => {
    await enterStudio(page, { density: "detailed" });
    await page.evaluate(() => {
      state.activeRole = "admin";
      renderAll();
    });
    await page.waitForTimeout(800);
    await clickAt(page, ".nav-item[data-view='manage']");
    await page.waitForTimeout(900);
    await page.evaluate(() => {
      const stages = [["코스 참여", 22], ["접속함", 20], ["케이스 열람", 19], ["관점 탐색", 16], ["기여 (노드·질문·메모)", 13], ["성찰 제출", 9]].map((p) => ({ label: p[0], count: p[1] }));
      const kpis = [["20/22", "활동 학생"], ["31", "노드 추가"], ["54", "질문"], ["27", "메모"], ["9", "성찰 제출"]];
      const lens = [["교사", 38], ["학생", 27], ["에듀테크", 19], ["행정", 11], ["접근성", 5]];
      const kpiHtml = kpis.map((p) => '<div class="manage-kpi"><strong>' + p[0] + "</strong><span>" + p[1] + "</span></div>").join("");
      const lensHtml = lens.map((p) => '<span class="manage-lens-chip"><strong>' + p[0] + "</strong> " + p[1] + "%</span>").join("");
      document.getElementById("manage-analytics-body").innerHTML =
        '<div class="manage-kpi-row">' + kpiHtml + "</div>" +
        '<div class="manage-analytics-grid"><div><h4>참여 퍼널</h4>' + buildManageFunnel(stages) + "</div>" +
        '<div><h4>관점 전환 분포</h4><div class="manage-lens-row">' + lensHtml + "</div></div></div>";
    });
    await glideTo(page, ".manage-join-code", 800);
    await glideTo(page, ".manage-case-row", 800);
    await glideTo(page, "#manage-analytics-body", 1000);
  },
  "03-actions": async (page) => {
    await enterStudio(page, { density: "detailed" });
    await page.evaluate(() => {
      state.activeRole = "admin";
      setView("manage");
      renderAll();
    });
    await page.waitForTimeout(900);
    await glideTo(page, "[data-manage-publish]", 800);
    await glideTo(page, "[data-manage-delete]", 700);
    await clickAt(page, "[data-manage-archive]");
    await page.waitForTimeout(1600);
    await clickAt(page, "[data-manage-show-archived]");
    await page.waitForTimeout(800);
    await clickAt(page, "[data-manage-unarchive]");
  },
  "04-analytics": async (page) => {
    await INSTRUCTOR["02-manage"](page);
    await page.evaluate(() => document.getElementById("manage-analytics-body").scrollIntoView({ behavior: "smooth", block: "start" }));
    await page.waitForTimeout(1200);
    await glideTo(page, ".manage-funnel", 900);
    await glideTo(page, ".manage-lens-row", 900);
  },
  "05-realtime": async (page) => {
    await enterStudio(page, { density: "detailed" });
    await page.evaluate(() => {
      state.activeRole = "admin";
      renderAll();
    });
    await page.waitForTimeout(800);
    await page.locator("#map-layer-select").selectOption("cohort").catch(() => {});
    await page.waitForTimeout(1400);
    await page.evaluate(() => {
      const pill = document.getElementById("presence-pill");
      if (pill) {
        pill.hidden = false;
        pill.textContent = "함께 보는 중 12명";
      }
      pushGraphEvent("동료 활동", "민지 님의 활동이 맵에 반영됐어요");
      showToast("민지 님의 활동이 맵에 반영됐어요.");
      renderAll();
    });
    await glideTo(page, "#presence-pill", 800);
    await glideTo(page, "#network-stage", 1000);
  },
};

async function record(group, name, fn, audioPath, outDir) {
  const dur = audioDur(audioPath);
  const tmp = "guides/videos/_tmp-" + group + "-" + name;
  rmSync(tmp, { recursive: true, force: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    recordVideo: { dir: tmp, size: { width: 1280, height: 800 } },
  });
  const page = await ctx.newPage();
  await page.addInitScript(CURSOR_INIT);
  const start = Date.now();
  try {
    await fn(page);
  } catch (e) {
    console.warn("  ! " + name + " action error: " + String(e).slice(0, 120));
  }
  const remain = dur * 1000 + 1200 - (Date.now() - start);
  if (remain > 0) await page.waitForTimeout(remain);
  await ctx.close();
  await browser.close();
  const webm = readdirSync(tmp).find((f) => f.endsWith(".webm"));
  mkdirSync(outDir, { recursive: true });
  renameSync(tmp + "/" + webm, outDir + "/" + name + ".webm");
  rmSync(tmp, { recursive: true, force: true });
  console.log("recorded " + group + "/" + name + ".webm (target " + dur.toFixed(1) + "s)");
}

const only = process.argv[2] || "";
for (const [name, fn] of Object.entries(STUDENT)) {
  if (only && !("student/" + name).includes(only)) continue;
  await record("student", name, fn, "guides/audio/student-ko/" + name + ".mp3", "guides/videos/student-ko");
}
for (const [name, fn] of Object.entries(INSTRUCTOR)) {
  if (only && !("instructor/" + name).includes(only)) continue;
  await record("instructor", name, fn, "guides/audio/instructor-ko/" + name + ".mp3", "guides/videos/instructor-ko");
}
console.log("recording done");
