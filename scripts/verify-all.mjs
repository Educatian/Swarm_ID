/* Run every verification gate and report which ones hold.

   The suite exists because of a specific gap: in one long session eleven real
   defects were found in this app and the smoke suite caught none of them.
   Invisible node glyphs, a workspace collapsed to 248px, buttons white on
   white, instructor-only UI leaking to learners — none of that throws, so a
   suite built around "does it error" was blind to all of it. Every gate here
   is the automated form of a defect that a person had to spot in a screenshot.

   Needs a static server on --base (default http://127.0.0.1:8137), e.g.
     py -m http.server 8137
   Usage: node scripts/verify-all.mjs [--base=...] [--skip=contrast,render]  */
import { spawn } from "node:child_process";

const arg = (n) => (process.argv.find((a) => a.startsWith(`--${n}=`)) || "").split("=")[1] || "";
const BASE = arg("base") || process.env.SMOKE_BASE || "http://127.0.0.1:8137";
const skip = new Set(arg("skip").split(",").filter(Boolean));

const GATES = [
  { id: "build", label: "build freshness", script: "scripts/check-build.mjs", needsServer: false },
  { id: "smoke", label: "usability smoke", script: "scripts/smoke-usability-upgrade.mjs", needsServer: true },
  { id: "contrast", label: "contrast (both themes)", script: "scripts/verify-contrast.mjs", needsServer: true },
  { id: "render", label: "render structure", script: "scripts/verify-render.mjs", needsServer: true },
  { id: "telemetry", label: "telemetry envelope", script: "scripts/verify-telemetry.mjs", needsServer: true },
];

const run = (gate) => new Promise((resolve) => {
  const started = Date.now();
  const child = spawn(process.execPath, [gate.script, `--base=${BASE}`], {
    env: { ...process.env, SMOKE_BASE: BASE },
  });
  let tail = [];
  const keep = (buf) => { tail.push(String(buf)); if (tail.length > 40) tail = tail.slice(-40); };
  child.stdout.on("data", keep);
  child.stderr.on("data", keep);
  child.on("close", (code) => resolve({ gate, code, secs: ((Date.now() - started) / 1000).toFixed(0),
    tail: tail.join("").trim().split("\n").slice(-6) }));
});

const results = [];
for (const gate of GATES) {
  if (skip.has(gate.id)) { console.log(`SKIP  ${gate.label}`); continue; }
  process.stdout.write(`....  ${gate.label}\r`);
  const r = await run(gate);
  results.push(r);
  console.log(`${r.code === 0 ? "PASS" : "FAIL"}  ${gate.label.padEnd(24)} ${r.secs}s`);
  if (r.code !== 0) r.tail.forEach((l) => console.log("        " + l));
}

const failed = results.filter((r) => r.code !== 0);
console.log("\n" + (failed.length
  ? `${failed.length} of ${results.length} gates failed: ${failed.map((f) => f.gate.id).join(", ")}`
  : `all ${results.length} gates passed`));
process.exit(failed.length ? 1 : 0);
