/* Fail if the minified assets no longer match their sources.

   The pages load app.min.js and styles.min.css. Editing app.js without
   rebuilding would leave the deployed app running old code with nothing on
   screen to say so — the same shape as the cache-busting drift that shipped
   three times in one day before it was caught. This turns that into a
   red test instead of a silent regression.

   Usage: node scripts/check-build.mjs   (exit 1 on drift) */
import { createHash } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";

const sha = (p) => createHash("sha256").update(readFileSync(p)).digest("hex").slice(0, 16);
const problems = [];

if (!existsSync("build-manifest.json")) {
  problems.push("build-manifest.json is missing — run: node scripts/build.mjs");
} else {
  const manifest = JSON.parse(readFileSync("build-manifest.json", "utf8"));
  for (const [src, recorded] of Object.entries(manifest.builtFrom)) {
    if (!existsSync(src)) { problems.push(`${src} is gone but the manifest still lists it`); continue; }
    const now = sha(src);
    if (now !== recorded) problems.push(`${src} changed since the last build (${recorded} -> ${now})`);
  }
  for (const out of ["i18n.min.js", "app.min.js", "styles.min.css"]) {
    if (!existsSync(out)) problems.push(`${out} is missing — run: node scripts/build.mjs`);
  }
}

// The pages must actually load the built files, or the build is decorative.
for (const page of ["index.html", "preview.html"]) {
  const html = readFileSync(page, "utf8");
  if (!/i18n\.min\.js/.test(html)) problems.push(`${page} does not load i18n.min.js`);
  if (!/app\.min\.js/.test(html)) problems.push(`${page} does not load app.min.js`);
  if (!/styles\.min\.css/.test(html)) problems.push(`${page} does not load styles.min.css`);
}

if (problems.length) {
  console.error("FAIL build freshness");
  problems.forEach((p) => console.error("  - " + p));
  process.exit(1);
}
console.log("PASS build freshness — minified assets match their sources and the pages load them");
