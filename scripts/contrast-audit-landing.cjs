// Contrast audit of the landing page in both themes (live or local URL arg).
const { chromium } = require('playwright');

const URL = process.argv[2] || 'https://swarm-id-ko.pages.dev/';

async function audit(page, label) {
  const fails = await page.evaluate(() => {
    function parse(c) {
      const m = c.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/);
      if (!m) return null;
      return { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] };
    }
    function composite(fg, bg) {
      const a = fg.a + bg.a * (1 - fg.a);
      if (a === 0) return { r: 255, g: 255, b: 255, a: 1 };
      return {
        r: (fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / a,
        g: (fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / a,
        b: (fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / a, a
      };
    }
    function effBg(el) {
      let bg = { r: 255, g: 255, b: 255, a: 1 };
      const chain = [];
      let n = el;
      while (n && n !== document.documentElement) { chain.unshift(n); n = n.parentElement; }
      const htmlBg = parse(getComputedStyle(document.documentElement).backgroundColor);
      if (htmlBg && htmlBg.a > 0) bg = composite(htmlBg, bg);
      for (const node of chain) {
        const c = parse(getComputedStyle(node).backgroundColor);
        if (c && c.a > 0) bg = composite(c, bg);
      }
      return bg;
    }
    function lum(c) {
      const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
      return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
    }
    function ratio(a, b) { const l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); }

    const out = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const seen = new Set();
    while (walker.nextNode()) {
      const t = walker.currentNode.textContent.trim();
      if (!t) continue;
      const el = walker.currentNode.parentElement;
      if (!el || seen.has(el)) continue;
      seen.add(el);
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none') continue;
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) continue;
      // skip offscreen
      if (r.bottom < 0 || r.top > window.innerHeight * 3) continue;
      if (el.closest('[aria-hidden="true"]')) continue;
      if (el.matches(':disabled') || el.closest('button:disabled')) continue;
      let fg = parse(cs.color);
      if (!fg) continue;
      // fold element opacity chain into alpha
      let op = 1, n = el;
      while (n && n !== document.body) { op *= parseFloat(getComputedStyle(n).opacity || '1'); n = n.parentElement; }
      fg = { ...fg, a: fg.a * op };
      const bg = effBg(el);
      const fgC = composite(fg, bg);
      const cr = ratio(fgC, bg);
      const size = parseFloat(cs.fontSize);
      const bold = parseInt(cs.fontWeight, 10) >= 700;
      const large = size >= 24 || (size >= 18.66 && bold);
      const need = large ? 3 : 4.5;
      if (cr < need) {
        out.push({
          text: t.slice(0, 36), cls: (el.className || '').toString().slice(0, 60),
          tag: el.tagName, ratio: Math.round(cr * 100) / 100, need,
          color: cs.color, bg: `rgb(${Math.round(bg.r)},${Math.round(bg.g)},${Math.round(bg.b)})`
        });
      }
    }
    return out;
  });
  console.log(`--- ${label}: ${fails.length} fails ---`);
  for (const f of fails.slice(0, 30)) console.log(JSON.stringify(f));
  return fails.length;
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 860 } });
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: process.env.TEMP + '/swarmko_dark.png' });
  const darkFails = await audit(page, 'DARK (default)');
  // toggle via the repurposed locale toggle (material icon light_mode/dark_mode)
  const toggled = await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find(b => /light_mode|dark_mode/.test(b.innerHTML));
    if (btn) { btn.click(); return true; }
    return false;
  });
  await page.waitForTimeout(900);
  await page.screenshot({ path: process.env.TEMP + '/swarmko_light.png' });
  const lightFails = toggled ? await audit(page, 'LIGHT (toggled)') : 'NO TOGGLE FOUND';
  console.log('summary:', JSON.stringify({ darkFails, lightFails, toggled, htmlClass: await page.evaluate(() => document.documentElement.className) }));
  await browser.close();
})();
