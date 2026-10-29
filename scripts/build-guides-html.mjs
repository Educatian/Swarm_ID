/**
 * Convert the four markdown guides into standalone styled HTML pages
 * that embed the captured screenshots inline.
 *
 * Output: guides/instructor-en.html, instructor-ko.html,
 *         student-en.html, student-ko.html
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, cpSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const GUIDES = path.join(ROOT, "guides");
const outputArg = process.argv.find(a => a.startsWith("--output="));
const OUTPUT = outputArg ? path.resolve(outputArg.slice("--output=".length)) : GUIDES;
mkdirSync(OUTPUT, { recursive: true });

const guides = [
  { slug: "student-ko", md: "student-ko.md", title: "쟁점 하나에서, 내 생각까지", lang: "ko" },
  { slug: "student-en", md: "student-en.md", title: "From one issue to your own position", lang: "en" },
  { slug: "instructor-ko", md: "instructor-ko.md", title: "첫 수업을 차분하게 시작하기", lang: "ko" },
  { slug: "instructor-en", md: "instructor-en.md", title: "Start your first class with confidence", lang: "en" },
];

// --- tiny markdown-to-HTML (purpose-built for these guides) ---
function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderInline(s) {
  // code
  s = s.replace(/`([^`]+)`/g, (_, c) => `<code>${escapeHtml(c)}</code>`);
  // bold
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  // italic (single *) — avoid already-handled double
  s = s.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  // links [text](url)
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return s;
}

function renderMarkdown(md, lang = "ko") {
  const lines = md.split(/\r?\n/);
  const out = [];
  let i = 0;
  let inList = false;
  let inOrdered = false;
  let inTable = false;
  let tableBuf = [];
  let inBlockquote = false;
  let inFence = false;
  let fenceBuf = [];

  const closeList = () => {
    if (inList) { out.push("</ul>"); inList = false; }
    if (inOrdered) { out.push("</ol>"); inOrdered = false; }
  };
  const closeBlockquote = () => {
    if (inBlockquote) { out.push("</blockquote>"); inBlockquote = false; }
  };
  const flushTable = () => {
    if (!inTable) return;
    const [head, _sep, ...body] = tableBuf;
    const headCells = head.split("|").slice(1, -1).map(c => c.trim());
    let html = '<div class="table-wrap"><table><thead><tr>';
    for (const c of headCells) html += `<th>${renderInline(escapeHtml(c))}</th>`;
    html += "</tr></thead><tbody>";
    for (const row of body) {
      const cells = row.split("|").slice(1, -1).map(c => c.trim());
      html += "<tr>";
      for (const c of cells) html += `<td>${renderInline(escapeHtml(c))}</td>`;
      html += "</tr>";
    }
    html += "</tbody></table></div>";
    out.push(html);
    tableBuf = [];
    inTable = false;
  };

  while (i < lines.length) {
    const raw = lines[i];
    const line = raw;

    // fenced code
    if (line.startsWith("```")) {
      if (inFence) {
        out.push(`<pre><code>${escapeHtml(fenceBuf.join("\n"))}</code></pre>`);
        fenceBuf = [];
        inFence = false;
      } else {
        closeList(); closeBlockquote(); flushTable();
        inFence = true;
      }
      i++; continue;
    }
    if (inFence) { fenceBuf.push(raw); i++; continue; }

    // table
    if (/^\|.+\|\s*$/.test(line) && /^\|[\s\-:|]+\|\s*$/.test(lines[i + 1] || "")) {
      closeList(); closeBlockquote();
      inTable = true;
      tableBuf = [line, lines[i + 1]];
      i += 2;
      while (i < lines.length && /^\|.+\|\s*$/.test(lines[i])) {
        tableBuf.push(lines[i]);
        i++;
      }
      flushTable();
      continue;
    }

    // horizontal rule
    if (/^---+\s*$/.test(line)) {
      closeList(); closeBlockquote(); flushTable();
      out.push("<hr>");
      i++; continue;
    }

    // heading
    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      closeList(); closeBlockquote(); flushTable();
      const lvl = h[1].length;
      out.push(`<h${lvl}>${renderInline(escapeHtml(h[2]))}</h${lvl}>`);
      i++; continue;
    }

    // screen-recording line: [video](path.mp4)
    const videoOnly = line.match(/^\[video\]\(([^)]+)\)\s*$/);
    if (videoOnly) {
      closeList(); closeBlockquote(); flushTable();
      out.push(`<figure class="screencast"><video controls preload="metadata" playsinline poster="${videoOnly[1].replace(/\.mp4$/, ".jpg")}" src="${videoOnly[1]}"></video><figcaption>${lang === "ko" ? "나레이션이 포함된 화면 녹화 — 재생 버튼을 누르세요" : "Screen recording with narration — press play"}</figcaption></figure>`);
      i++; continue;
    }

    // audio narration line: [audio](path.mp3)
    const audioOnly = line.match(/^\[audio\]\(([^)]+)\)\s*$/);
    if (audioOnly) {
      closeList(); closeBlockquote(); flushTable();
      out.push(`<div class="narration"><span class="narration-label">${lang === "ko" ? "나레이션 듣기" : "Listen to the narration"}</span><audio controls preload="none" src="${audioOnly[1]}"></audio></div>`);
      i++; continue;
    }

    // image line: ![alt](path) possibly on its own
    const imgOnly = line.match(/^!\[([^\]]*)\]\(([^)]+)\)\s*$/);
    if (imgOnly) {
      closeList(); closeBlockquote(); flushTable();
      out.push(`<figure><img src="${imgOnly[2]}" alt="${escapeHtml(imgOnly[1])}" loading="lazy"><figcaption>${escapeHtml(imgOnly[1])}</figcaption></figure>`);
      i++; continue;
    }

    // blockquote
    if (/^>\s?/.test(line)) {
      flushTable(); closeList();
      if (!inBlockquote) { out.push("<blockquote>"); inBlockquote = true; }
      out.push(renderInline(escapeHtml(line.replace(/^>\s?/, ""))) + "<br>");
      i++; continue;
    } else if (inBlockquote && line.trim() === "") {
      closeBlockquote();
    }

    // list
    const ul = line.match(/^(\s*)-\s+(.*)$/);
    const ol = line.match(/^(\s*)\d+\.\s+(.*)$/);
    if (ul) {
      flushTable(); closeBlockquote();
      if (inOrdered) { out.push("</ol>"); inOrdered = false; }
      if (!inList) { out.push("<ul>"); inList = true; }
      out.push(`<li>${renderInline(escapeHtml(ul[2]))}</li>`);
      i++; continue;
    }
    if (ol) {
      flushTable(); closeBlockquote();
      if (inList) { out.push("</ul>"); inList = false; }
      if (!inOrdered) { out.push("<ol>"); inOrdered = true; }
      out.push(`<li>${renderInline(escapeHtml(ol[2]))}</li>`);
      i++; continue;
    } else {
      closeList();
    }

    // blank line
    if (line.trim() === "") {
      closeBlockquote();
      i++; continue;
    }

    // paragraph — collapse with next line if not structural
    let buf = [line];
    while (i + 1 < lines.length) {
      const nxt = lines[i + 1];
      if (nxt.trim() === "" ||
          /^#{1,4}\s/.test(nxt) ||
          /^---+\s*$/.test(nxt) ||
          /^>\s?/.test(nxt) ||
          /^(\s*)-\s+/.test(nxt) ||
          /^(\s*)\d+\.\s+/.test(nxt) ||
          nxt.startsWith("```") ||
          /^\|.+\|\s*$/.test(nxt) ||
          /^!\[[^\]]*\]\(/.test(nxt)) break;
      buf.push(nxt); i++;
    }
    out.push(`<p>${renderInline(escapeHtml(buf.join(" ")))}</p>`);
    i++;
  }

  closeList(); closeBlockquote(); flushTable();
  if (inFence) {
    out.push(`<pre><code>${escapeHtml(fenceBuf.join("\n"))}</code></pre>`);
  }
  return out.join("\n");
}

// --- shared CSS ---
const css = `
:root {
  --bg: #fafafa;
  --panel: #fff;
  --ink: #1f2937;
  --muted: #6b7280;
  --accent: #4361ee;
  --accent-danger: #ef4444;
  --accent-ok: #1b9c85;
  --border: #e5e7eb;
  --radius: 14px;
  --mono: ui-monospace, SFMono-Regular, "SF Mono", Consolas, monospace;
  --sans: -apple-system, BlinkMacSystemFont, "Segoe UI", "Malgun Gothic", "Apple SD Gothic Neo", sans-serif;
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  font-family: var(--sans);
  color: var(--ink);
  background: var(--bg);
  margin: 0;
  line-height: 1.65;
  font-size: 16px;
}
.hero {
  background: linear-gradient(135deg, #4361ee 0%, #1b9c85 100%);
  color: #fff;
  padding: 48px 32px 56px;
  margin-bottom: 32px;
}
.hero-inner {
  max-width: 900px;
  margin: 0 auto;
}
.hero .eyebrow {
  text-transform: uppercase;
  letter-spacing: .14em;
  font-size: 12px;
  opacity: .82;
  margin-bottom: 8px;
}
.hero h1 {
  font-size: 40px;
  margin: 0 0 12px;
  line-height: 1.15;
  letter-spacing: -.01em;
}
.hero p { opacity: .9; margin: 0; font-size: 17px; max-width: 720px; }
main {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 32px 96px;
}
h1, h2, h3, h4 { color: var(--ink); line-height: 1.25; letter-spacing: -.01em; }
h2 {
  margin-top: 48px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
  font-size: 26px;
}
h2:first-of-type { border-top: 0; padding-top: 0; margin-top: 0; }
h3 { font-size: 20px; margin-top: 32px; }
h4 { font-size: 17px; margin-top: 22px; color: var(--muted); }
p { margin: 12px 0; }
a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; }
code {
  font-family: var(--mono);
  background: #eef2ff;
  color: #3538cd;
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 0.92em;
}
pre {
  background: #0f172a;
  color: #e2e8f0;
  padding: 16px 20px;
  border-radius: var(--radius);
  overflow-x: auto;
  margin: 18px 0;
  font-size: 14px;
  line-height: 1.55;
}
pre code {
  background: transparent;
  color: inherit;
  padding: 0;
  font-size: inherit;
}
blockquote {
  border-left: 4px solid var(--accent);
  background: #eef2ff;
  color: #1e3a8a;
  padding: 14px 20px;
  margin: 18px 0;
  border-radius: 0 var(--radius) var(--radius) 0;
}
.screencast video {
  width: 100%;
  border-radius: 12px;
  border: 1px solid rgba(42, 63, 200, 0.2);
  background: #0b0d14;
  box-shadow: 0 10px 30px rgba(20, 30, 80, 0.12);
}

.narration {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 14px 0 6px;
  padding: 10px 14px;
  border-radius: 12px;
  background: rgba(42, 63, 200, 0.06);
  border: 1px solid rgba(42, 63, 200, 0.18);
}
.narration-label { font-size: 0.82rem; font-weight: 600; white-space: nowrap; }
.narration audio { width: 100%; height: 36px; }

figure {
  margin: 24px 0;
  padding: 14px;
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: 0 4px 18px rgba(15, 23, 42, .06);
}
figure img {
  width: 100%;
  display: block;
  border-radius: 10px;
  border: 1px solid var(--border);
}
figcaption {
  font-size: 13px;
  color: var(--muted);
  margin-top: 10px;
  text-align: center;
}
hr {
  border: 0;
  border-top: 1px solid var(--border);
  margin: 40px 0;
}
ul, ol { padding-left: 24px; }
li { margin: 6px 0; }
.table-wrap {
  overflow-x: auto;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  margin: 20px 0;
  background: var(--panel);
}
table { width: 100%; border-collapse: collapse; font-size: 14.5px; }
th, td { padding: 10px 14px; text-align: left; border-bottom: 1px solid var(--border); }
th { background: #f9fafb; font-weight: 600; color: #374151; }
tr:last-child td { border-bottom: 0; }
.guide-nav {
  max-width: 900px;
  margin: 0 auto 24px;
  padding: 0 32px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  font-size: 14px;
}
.guide-nav a {
  padding: 6px 12px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--panel);
  color: var(--muted);
}
.guide-nav a.active {
  background: var(--ink);
  color: #fff;
  border-color: var(--ink);
}
footer {
  max-width: 900px;
  margin: 0 auto;
  padding: 48px 32px;
  color: var(--muted);
  font-size: 13px;
  border-top: 1px solid var(--border);
}
@media (max-width: 640px) {
  .hero { padding: 32px 20px; }
  .hero h1 { font-size: 28px; }
  main { padding: 0 20px 64px; }
  h2 { font-size: 22px; }
}
/* The updated workspace's restrained palette, with reading-first hierarchy. */
:root { --bg:#f5f6f9; --ink:#202b3c; --muted:#526176; --accent:#4053d8; }
.hero { background:#fff; color:var(--ink); border-bottom:1px solid var(--border); padding:56px 24px 40px; }
.hero-inner { max-width:1100px; }
.hero h1 { max-width:760px; font-size:clamp(30px,4vw,48px); letter-spacing:-.04em; line-height:1.22; }
.hero .eyebrow { color:var(--accent); opacity:1; font-weight:700; }
.hero p { opacity:1; color:var(--muted); }
.guide-nav { max-width:1148px; padding:0 24px; }
.guide-nav a { padding:10px 14px; min-height:44px; }
.guide-layout { max-width:1148px; margin:auto; padding:0 24px; display:grid; grid-template-columns:230px minmax(0,1fr); gap:40px; }
.guide-layout main { min-width:0; width:100%; padding:0 0 64px; }
.guide-toc { position:sticky; top:20px; align-self:start; max-height:calc(100vh - 40px); overflow:auto; padding:16px; background:white; border:1px solid var(--border); border-radius:14px; }
.guide-toc h2 { font-size:13px; margin:0 0 12px; }
.guide-toc a { display:block; padding:10px 8px; border-radius:8px; font-size:14px; line-height:1.5; color:var(--muted); }
.guide-toc a[aria-current] { background:#eef0ff; color:#283bb3; font-weight:700; }
main h2 { scroll-margin-top:24px; margin-top:48px; font-size:25px; line-height:1.4; }
main h3 { font-size:18px; line-height:1.5; }
main p, main li { line-height:1.85; overflow-wrap:anywhere; }
blockquote { background:#fff8ec; color:#654b1f; border-color:#b98731; font-size:15px; }
figure { padding:8px; box-shadow:none; }
figure a { display:block; }
.skip-link { position:absolute; top:-100px; left:16px; z-index:10; background:white; padding:12px; }
.skip-link:focus { top:8px; }
:focus-visible { outline:3px solid #4053d8; outline-offset:4px; }
footer { max-width:1148px; }
@media(max-width:800px) { .guide-layout { display:block; padding:0 20px; } .guide-toc { position:static; max-height:none; margin-bottom:32px; } .guide-toc a { display:inline-block; margin:2px; border:1px solid var(--border); } .hero { padding:32px 20px; } }
@media(prefers-reduced-motion:reduce) { html { scroll-behavior:auto; } }
@media print { .guide-toc,.guide-nav,.skip-link { display:none; } .guide-layout { display:block; } .hero { padding:0 0 20px; } body { background:white; } figure { break-inside:avoid; } }
`;

function navLinks(activeSlug) {
  const activeGuide = guides.find(g => g.slug === activeSlug);
  const isKoreanPage = activeGuide?.lang === "ko";
  return guides.map(g => {
    const cls = g.slug === activeSlug ? ' class="active"' : "";
    const labels = isKoreanPage
      ? {
          "instructor-en": "교수자 가이드(영어)",
          "instructor-ko": "교수자 가이드",
          "student-en": "학생 가이드(영어)",
          "student-ko": "학생 가이드",
        }
      : {
          "instructor-en": "Instructor Guide",
          "instructor-ko": "Instructor Guide (Korean)",
          "student-en": "Student Guide",
          "student-ko": "Student Guide (Korean)",
        };
    return `<a href="./${g.slug}.html"${cls}>${labels[g.slug] || g.slug}</a>`;
  }).join("");
}

function wrap(title, lang, slug, bodyHtml, tagline) {
  const sections = [];
  bodyHtml = bodyHtml.replace(/<h2>(.*?)<\/h2>/g, (_, label) => {
    const id = `section-${sections.length + 1}`;
    sections.push({ id, label });
    return `<h2 id="${id}">${label}</h2>`;
  });
  return `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(tagline)}">
  <style>${css}</style>
</head>
<body>
  <a class="skip-link" href="#guide-content">${lang === "ko" ? "본문으로 바로가기" : "Skip to content"}</a>
  <header class="hero">
    <div class="hero-inner">
      <p class="eyebrow">${lang === "ko" ? "디자인 텐션 스튜디오 · 새 화면 안내" : "Design Tension Studio · Updated walkthrough"} · 2026.09 · v2</p>
      <h1>${escapeHtml(title)}</h1>
      <p>${escapeHtml(tagline)}</p>
    </div>
  </header>
  <nav class="guide-nav" aria-label="${lang === "ko" ? "역할과 언어" : "Role and language"}">${navLinks(slug)}</nav>
  <div class="guide-layout">
  <nav class="guide-toc" aria-label="${lang === "ko" ? "이 안내서의 순서" : "On this page"}"><h2>${lang === "ko" ? "필요한 단계로 바로 가기" : "Jump to a step"}</h2>${sections.map(s => `<a href="#${s.id}">${s.label}</a>`).join("")}</nav>
  <main id="guide-content" tabindex="-1">
${bodyHtml}
  </main>
  </div>
  <footer>
    <p>${lang === "ko"
      ? "2026년 9월 화면 기준. 학생 화면은 가상의 공개 체험 데이터입니다. 이전 버전 영상은 새 안내에서 제외했습니다. 수업·권한에 따라 보이는 기능이 다를 수 있습니다."
      : "Based on the September 2026 interface. Student screenshots use fictional public-preview data. Previous-version videos are excluded. Available features depend on your course and permissions."}</p>
  </footer>
  <script>
    const headings = [...document.querySelectorAll('main h2[id]')];
    const links = [...document.querySelectorAll('.guide-toc a')];
    function updateSection() {
      let current = headings[0];
      for (const heading of headings) { if (heading.getBoundingClientRect().top <= 140) current = heading; }
      for (const link of links) { if (current && link.hash === '#' + current.id) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current'); }
    }
    let queued = false;
    addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(() => { updateSection(); queued = false; }); } }, {passive:true});
    addEventListener('hashchange', updateSection);
    updateSection();
  </script>
</body>
</html>`;
}

const taglines = {
  "instructor-en": "Prepare the case, guide the discussion, and verify what was received.",
  "instructor-ko": "사례 준비부터 토론과 수신 확인까지. 첫 수업에 필요한 것만.",
  "student-en": "Read one issue. Compare perspectives. Explain a choice with evidence.",
  "student-ko": "쟁점을 읽고, 다른 입장을 비교하고, 근거 있는 내 선택을 남겨요.",
};

for (const g of guides) {
  const mdPath = path.join(GUIDES, g.md);
  if (!existsSync(mdPath)) {
    console.error(`missing: ${mdPath}`);
    continue;
  }
  // Skip the first H1 of the .md since the hero already shows the title.
  let md = readFileSync(mdPath, "utf8");
  md = md.replace(/^#\s+[^\r\n]+\r?\n(?:\r?\n)?/, "");
  let body = renderMarkdown(md, g.lang);
  if (OUTPUT !== GUIDES) {
    const origin = g.lang === "ko" ? "https://swarm-id-ko.pages.dev" : "https://swarm-id-en.pages.dev";
    body = body.replaceAll('href="../', `href="${origin}/`);
  }
  const html = wrap(g.title, g.lang, g.slug, body, taglines[g.slug] || "");
  const outPath = path.join(OUTPUT, `${g.slug}.html`);
  writeFileSync(outPath, html, "utf8");
  console.log(`  ✓ ${g.slug}.html`);
}

// Also write a tiny index.html that lists all four.
const indexBody = `
<h2>시작할 안내를 고르세요 · Choose your guide</h2>
<ul>
${guides.map(g => `<li><a href="./${g.slug}.html">${escapeHtml(g.title)}</a> — <small>${escapeHtml(taglines[g.slug] || "")}</small></li>`).join("\n")}
</ul>
<p>학생은 첫 쟁점부터, 교수자는 수업 준비부터 시작하세요. Start with one issue as a student, or prepare a class as an instructor.</p>
`;
writeFileSync(
  path.join(OUTPUT, "index.html"),
  wrap("Design Tension Studio · Guides", "ko", "index", indexBody, "새 화면에 맞춘 학생·교수자 안내 · Updated student and instructor walkthroughs."),
  "utf8"
);
console.log("  ✓ index.html");
if (OUTPUT !== GUIDES) {
  cpSync(path.join(GUIDES, "screenshots", "v2"), path.join(OUTPUT, "screenshots", "v2"), { recursive: true });
}
