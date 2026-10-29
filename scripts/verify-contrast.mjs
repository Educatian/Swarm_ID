/* WCAG contrast sweep over every view in both themes.

   Written after a pass where 84 light-theme failures were sitting in the app
   unnoticed — node glyphs invisible on their own body, buttons white on white,
   a whole drawer of dark-on-dark text. The smoke suite caught none of it,
   because none of it throws.

   Three things this probe learned the hard way, all of them load-bearing:
     - a surface painted by a gradient has no backgroundColor, so walking
       ancestors for one falls through to something dark and reports
       dark-on-dark for text that is plainly readable. Read the last opaque
       colour stop instead.
     - `background` shorthands stack translucent accents over an opaque base
       and the base is the LAST layer, so taking the first stop reports text as
       sitting on 10%-alpha indigo.
     - SVG text is painted by `fill`; reading `color` there returns whatever
       was inherited and yields a contrast of exactly 1.

   Node icons and provenance badges resolve their sibling circle fill.
   Arbitrary artwork, overlapping geometry and gradients still require visual review.

   Usage: node scripts/verify-contrast.mjs [--base=http://127.0.0.1:8137]   */
import { chromium } from "playwright";
import fs from 'node:fs';

const BASE = (process.argv.find((a) => a.startsWith("--base=")) || "").split("=")[1]
  || process.env.SMOKE_BASE || "http://127.0.0.1:8137";
const VIEWS = ["home", "visualizer", "perspectives", "matrix", "sandbox", "report", "manage", "drawer-intake", "drawer-insight", "coach", "tutorial", "landing"];
const HARD = 2.5; // below this the text is effectively invisible, not merely dim

const browser = await chromium.launch();
const page = await browser.newPage({reducedMotion:'reduce'});
await page.setViewportSize({ width: 1440, height: 1000 });
await page.goto(`${BASE}/preview.html?lang=${process.env.UI_LANG || 'ko'}&role=admin`, { waitUntil: "networkidle" });
await page.waitForTimeout(2500);

const sweep = async (theme, density, width) => {
  await page.goto(`${BASE}/preview.html?lang=${process.env.UI_LANG || 'ko'}&role=admin`,{waitUntil:'networkidle'});
  await page.setViewportSize({width,height:1000});
  await page.evaluate(({t,d}) => { state.activeRole = "admin"; state.density=d; setTheme(t); renderAll(); }, {t:theme,d:density});
  await page.waitForTimeout(100);
  const all = [];
  for (const v of VIEWS) {
    if(v==='landing') {
      await page.goto(`${BASE}/index.html`,{waitUntil:'networkidle'});
      await page.evaluate(t=>setTheme(t),theme);
    } else await page.evaluate((x) => {
      setAgentCoachOpen(false);endTutorial(false);closeMapDrawers();
      setView(x.startsWith('drawer-')||x==='coach'||x==='tutorial'?'visualizer':x);renderAll();
      if(x.startsWith('drawer-'))openMapDrawer(x.slice(7));
      if(x==='coach')setAgentCoachOpen(true);
      if(x==='tutorial')startTutorial(true);
    }, v);
    await page.evaluate(()=>document.fonts.ready);
    await page.waitForTimeout(350);
    if(process.env.CONTRAST_SHOTS && width===390 && density==='simple' && ['home','visualizer','report','coach','landing','perspectives','tutorial'].includes(v)) {
      fs.mkdirSync(process.env.CONTRAST_SHOTS,{recursive:true});
      await page.screenshot({path:`${process.env.CONTRAST_SHOTS}/${theme}-${v}.png`});
    }
    all.push(...await page.evaluate((view) => {
      const rgb = (c) => { const m = (c || "").match(/[\d.]+/g);
        return m ? { r: +m[0], g: +m[1], b: +m[2], a: m.length > 3 ? +m[3] : 1 } : null; };
      const over = (f, b) => ({ r: f.r * f.a + b.r * (1 - f.a), g: f.g * f.a + b.g * (1 - f.a),
        b: f.b * f.a + b.b * (1 - f.a), a: 1 });
      const lum = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
        return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
      const ratio = (a, b) => { const l1 = lum(a), l2 = lum(b);
        return +(((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)).toFixed(2)); };
      const gradient = (cs) => {
        const bi = cs.backgroundImage;
        if (!bi || bi === "none" || !/gradient/.test(bi)) return null;
        const toks = bi.match(/rgba?\([^)]+\)|#[0-9a-fA-F]{6}\b/g) || [];
        let last = null;
        for (const t of toks) {
          let c;
          if (t[0] === "#") c = { r: parseInt(t.slice(1, 3), 16), g: parseInt(t.slice(3, 5), 16), b: parseInt(t.slice(5, 7), 16), a: 1 };
          // A 0.92-alpha base still reads as the surface; demanding a full 1.0
          // made the probe walk past the orbit canvas to a light ancestor and
          // report low contrast for text that sits on a dark panel.
          else { c = rgb(t); if (!c || c.a < 0.85) continue; }
          last = { r: c.r, g: c.g, b: c.b, a: 1 };
        }
        return last;
      };
      const effBg = (el) => {
        const stack = []; let n = el;
        while (n && n !== document.documentElement) {
          const cs = getComputedStyle(n);
          const c = rgb(cs.backgroundColor);
          if (c && c.a > 0) { stack.push(c); if (c.a >= 0.85) break; }
          const g = gradient(cs); if (g) { stack.push(g); break; }
          n = n.parentElement;
        }
        const bcs = getComputedStyle(document.body);
        const rootC = (rgb(bcs.backgroundColor) || {}).a === 1 ? rgb(bcs.backgroundColor)
          : (gradient(bcs) || { r: 255, g: 255, b: 255, a: 1 });
        let base = { r: rootC.r, g: rootC.g, b: rootC.b, a: 1 };
        for (let i = stack.length - 1; i >= 0; i--) base = over(stack[i], base);
        return base;
      };
      const out = [];
      document.querySelectorAll("*").forEach((el) => {
        const placeholder=el.matches('input,textarea')&&!el.value&&el.placeholder;
        const txt = placeholder || [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join("");
        if (!txt) return;
        const r = el.getBoundingClientRect();
        if (r.width < 4 || r.height < 4) return;
        const cs = getComputedStyle(el,placeholder?'::placeholder':null);
        if (cs.visibility === "hidden" || cs.display === "none" || +cs.opacity < 0.15) return;
        // A closed <details> keeps its contents in the layout when CSS sets a
        // display on them; those are not on screen and must not be judged.
        if (el.closest("details:not([open])")) return;
        if(el.matches(':disabled') || el.closest('[hidden],.is-hidden,button:disabled')) return;
        const isSvg = el.ownerSVGElement != null;
        const paint = isSvg ? cs.fill : cs.color;
        const fg = rgb(paint); if (!fg) return;
        let bg = effBg(el);
        const shape = el.classList.contains('node-icon') ? el.closest('.network-node')?.querySelector('.node-body')
          : el.closest('.node-badge')?.querySelector('circle');
        if(shape){const fill=rgb(getComputedStyle(shape).fill);if(fill)bg=over(fill,bg);}
        const size = parseFloat(cs.fontSize);
        const large = size >= 24 || (+cs.fontWeight >= 700 && size >= 18.66);
        const need = large || el.classList.contains('material-symbols-outlined') || el.classList.contains('node-icon') ? 3 : 4.5;
        let opacity=placeholder?+cs.opacity:1;
        for(let n=el;n;n=n.parentElement)opacity*=+getComputedStyle(n).opacity;
        if(opacity===0)return; // Closed drawers remain in the DOM but are not rendered.
        fg.a*=opacity;
        const c = ratio(fg.a < 1 ? over(fg, bg) : fg, bg);
        if (c < need) out.push({ view, isSvg,
          sel: el.id?'#'+el.id:(el.tagName + "." + String(el.className).split(" ")[0]).slice(0, 70),
          parent:el.parentElement.className, placeholder:!!placeholder,
          text: txt.slice(0, 24), contrast: c, need, paint, bg, opacity });
      });
      return out;
    }, v));
  }
  return all;
};

let failed = false;const report=[];
for (const theme of ["light", "dark"]) for(const density of ['simple','advanced']) for(const width of [390,1440]) {
  if(process.env.CONTRAST_QUICK && (density!=='simple'||width!==390))continue;
  const hits = await sweep(theme,density,width);
  const dom = hits.filter((h) => !h.isSvg);
  const hard = dom.filter((h) => h.contrast < HARD);
  const worst = dom.length ? Math.min(...dom.map((h) => h.contrast)) : "-";
  report.push({theme,density,width,dom,svg:hits.filter(h=>h.isSvg)});
  console.log(`${theme} ${density} ${width} below AA: ${dom.length} worst ${worst} (svg failures: ${hits.length-dom.length})`);
  dom.slice(0, 8).forEach((h) => console.log(`   ${String(h.contrast).padStart(5)} (need ${h.need})  ${h.view.padEnd(10)} ${h.sel.padEnd(34)} "${h.text}"`));
  if (hits.length) failed = true;
}
await browser.close();
if(process.env.CONTRAST_REPORT)fs.writeFileSync(process.env.CONTRAST_REPORT,JSON.stringify(report,null,2));
console.log(failed ? "FAIL contrast" : "PASS contrast — no measured text/icon failures in either theme (not a full accessibility audit)");
process.exit(failed ? 1 : 0);
