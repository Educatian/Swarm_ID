/**
 * Convert the four markdown guides into standalone styled HTML pages
 * that embed the captured screenshots inline.
 *
 * Output: guides/instructor-en.html, instructor-ko.html,
 *         student-en.html, student-ko.html
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const GUIDES = path.join(ROOT, "guides");

const guides = [
  { slug: "instructor-en", md: "instructor-en.md", title: "Swarm_ID — Instructor Guide", lang: "en" },
  { slug: "instructor-ko", md: "instructor-ko.md", title: "Swarm_ID — 강사용 가이드", lang: "ko" },
  { slug: "student-en",    md: "student-en.md",    title: "Swarm_ID — Student Guide",    lang: "en" },
  { slug: "student-ko",    md: "student-ko.md",    title: "Swarm_ID — 학생용 가이드",    lang: "ko" },
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

function renderMarkdown(md) {
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
`;

function navLinks(activeSlug) {
  return guides.map(g => {
    const cls = g.slug === activeSlug ? ' class="active"' : "";
    return `<a href="./${g.slug}.html"${cls}>${g.slug}</a>`;
  }).join("");
}

function wrap(title, lang, slug, bodyHtml, tagline) {
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
  <header class="hero">
    <div class="hero-inner">
      <p class="eyebrow">Swarm_ID · Classroom guide</p>
      <h1>${escapeHtml(title)}</h1>
      <p>${escapeHtml(tagline)}</p>
    </div>
  </header>
  <nav class="guide-nav">${navLinks(slug)}</nav>
  <main>
${bodyHtml}
  </main>
  <footer>
    <p>Generated from <code>guides/${slug}.md</code>. Screenshots captured on <code>https://swarmid.vercel.app</code> via Playwright.</p>
  </footer>
</body>
</html>`;
}

const taglines = {
  "instructor-en": "Step-by-step setup for instructors preparing a class session with Swarm_ID.",
  "instructor-ko": "Swarm_ID로 수업을 준비하는 강사를 위한 단계별 안내서.",
  "student-en": "What students see in Swarm_ID — from sign-in through swarm rounds to export.",
  "student-ko": "Swarm_ID에서 학생이 보는 화면 — 로그인부터 스웜 라운드와 내보내기까지.",
};

for (const g of guides) {
  const mdPath = path.join(GUIDES, g.md);
  if (!existsSync(mdPath)) {
    console.error(`missing: ${mdPath}`);
    continue;
  }
  // Skip the first H1 of the .md since the hero already shows the title.
  let md = readFileSync(mdPath, "utf8");
  md = md.replace(/^#\s+.*\n+/, "");
  const body = renderMarkdown(md);
  const html = wrap(g.title, g.lang, g.slug, body, taglines[g.slug] || "");
  const outPath = path.join(GUIDES, `${g.slug}.html`);
  writeFileSync(outPath, html, "utf8");
  console.log(`  ✓ ${g.slug}.html`);
}

// Also write a tiny index.html that lists all four.
const indexBody = `
<h2>Four guides</h2>
<ul>
${guides.map(g => `<li><a href="./${g.slug}.html">${escapeHtml(g.title)}</a> — <small>${escapeHtml(taglines[g.slug] || "")}</small></li>`).join("\n")}
</ul>
<h3>How screenshots were captured</h3>
<p>Each PNG under <code>guides/screenshots/{role}-{locale}/</code> was produced by <code>scripts/capture-guides.mjs</code>, which drives a headless Chromium through the real deployed app at <a href="https://swarmid.vercel.app">swarmid.vercel.app</a>.</p>
`;
writeFileSync(
  path.join(GUIDES, "index.html"),
  wrap("Swarm_ID — Guides", "en", "instructor-en", indexBody, "Instructor and student walkthroughs."),
  "utf8"
);
console.log("  ✓ index.html");
