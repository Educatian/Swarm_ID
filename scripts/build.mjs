/* Produce the minified assets the pages actually load.

   Compression at the CDN already does most of the work — gzip alone takes
   app.js from 616KB to 159KB — so this exists for the remainder: another 13%
   on the script and 36% on the stylesheet, roughly 38KB, which is about 190ms
   on a throttled mid-tier phone.

   The real hazard is not the saving, it is drift: an edit to app.js that never
   gets built would be invisible, and the deployed app would silently run old
   code. So the build records the hash of every source it consumed and
   check-build.mjs fails when those hashes stop matching. Run that in the
   verification suite and drift cannot reach a deploy unnoticed.

   Usage: node scripts/build.mjs        */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { build } from "esbuild";

const TARGETS = [
  // Identifiers are deliberately left alone. This is a classic script whose
  // top-level names (setView, renderAll, state) are reached from inline
  // handlers and from the verification scripts; mangling them breaks the app
  // in ways no syntax check would catch.
  { src: "app.js", out: "app.min.js", loader: "js", minifyIdentifiers: false },
  { src: "styles.css", out: "styles.min.css", loader: "css", minifyIdentifiers: false },
];

const sha = (p) => createHash("sha256").update(readFileSync(p)).digest("hex").slice(0, 16);
const kb = (n) => (n / 1024).toFixed(0) + "KB";

const manifest = { builtFrom: {} };
for (const t of TARGETS) {
  await build({
    entryPoints: [t.src],
    outfile: t.out,
    minifyWhitespace: true,
    minifySyntax: true,
    minifyIdentifiers: t.minifyIdentifiers,
    loader: { [t.src.endsWith(".css") ? ".css" : ".js"]: t.loader },
    bundle: false,
    legalComments: "none",
    logLevel: "error",
  });
  manifest.builtFrom[t.src] = sha(t.src);
  console.log(`  ${t.src} -> ${t.out}  ${kb(readFileSync(t.src).length)} -> ${kb(readFileSync(t.out).length)}`);
}
writeFileSync("build-manifest.json", JSON.stringify(manifest, null, 2) + "\n");
console.log("wrote build-manifest.json");
