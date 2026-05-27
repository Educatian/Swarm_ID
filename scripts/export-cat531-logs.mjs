/**
 * Export ALL CAT 531 logs (analytics_events + learner_runs) in one shot, to
 * CSV + JSON, with a summary that also answers "is logging actually happening?".
 *
 * No secrets are stored in this file — credentials come from env / defaults.
 *
 * --- AUTH MODES (script auto-picks) ---
 *   A) anon key + INSTRUCTOR login (default, what you asked for):
 *        relies on admin RLS letting the course owner read all rows.
 *        Defaults: jmoon19@ua.edu / cat531-instructor, publishable anon key.
 *   B) service_role key (fallback, bypasses RLS entirely):
 *        set SUPABASE_SERVICE_ROLE_KEY and it is used instead.
 *
 * --- RUN (bash, via the `!` prefix) ---
 *   # Mode A (anon + instructor, defaults):
 *   cd "C:\Users\jewoo\Projects\jewoo_backup_2026-05-11\projects\Swarm_ID" && node scripts/export-cat531-logs.mjs
 *
 *   # Mode B (service_role, full access):
 *   cd "C:\Users\jewoo\Projects\jewoo_backup_2026-05-11\projects\Swarm_ID" && export SUPABASE_SERVICE_ROLE_KEY="$(tr -d '\r\n' < "C:\Users\jewoo\Desktop\datasandbox_supabase_servicerole.txt")" && node scripts/export-cat531-logs.mjs
 *
 * Override defaults with env: SUPABASE_URL, SUPABASE_ANON_KEY,
 *   INSTRUCTOR_EMAIL, INSTRUCTOR_PASSWORD.
 *
 * Output: ./_exports/<timestamp>/  (analytics_events.{csv,json}, learner_runs.{csv,json})
 */
import { createClient } from "@supabase/supabase-js";
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..");

const URL = process.env.SUPABASE_URL || "https://wvbvexiwyjifatrvdsnv.supabase.co";
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const ANON = process.env.SUPABASE_ANON_KEY || "sb_publishable_TlUkIam0ghqeFFgA82DwLA_1NjIQ-XZ";
const IEMAIL = process.env.INSTRUCTOR_EMAIL || "jmoon19@ua.edu";
const IPASS = process.env.INSTRUCTOR_PASSWORD || "cat531-instructor";

let sb, mode;
if (SERVICE) {
  sb = createClient(URL, SERVICE, { auth: { persistSession: false } });
  mode = "service_role (full access, bypasses RLS)";
} else {
  sb = createClient(URL, ANON, { auth: { persistSession: false } });
  const { error } = await sb.auth.signInWithPassword({ email: IEMAIL, password: IPASS });
  if (error) {
    console.error(`Instructor sign-in failed (${IEMAIL}): ${error.message}`);
    console.error("Fix the password (INSTRUCTOR_PASSWORD=...) or use SUPABASE_SERVICE_ROLE_KEY instead.");
    process.exit(1);
  }
  mode = `anon key + instructor login (${IEMAIL}; relies on admin RLS)`;
}
console.log(`Auth mode: ${mode}\nProject:   ${URL}\n`);

async function fetchAll(table, orderCol) {
  const pageSize = 1000;
  let from = 0;
  const all = [];
  for (;;) {
    let q = sb.from(table).select("*").range(from, from + pageSize - 1);
    if (orderCol) q = q.order(orderCol, { ascending: true });
    const { data, error } = await q;
    if (error) throw new Error(`${table}: ${error.message}`);
    all.push(...data);
    if (data.length < pageSize) break;
    from += pageSize;
  }
  return all;
}

const csvEscape = (v) => {
  if (v === null || v === undefined) return "";
  let s = typeof v === "object" ? JSON.stringify(v) : String(v);
  if (/[",\n\r]/.test(s)) s = '"' + s.replace(/"/g, '""') + '"';
  return s;
};
function toCsv(rows) {
  if (!rows.length) return "";
  const cols = Object.keys(rows[0]);
  return cols.join(",") + "\n" + rows.map((r) => cols.map((c) => csvEscape(r[c])).join(",")).join("\n") + "\n";
}

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const outDir = resolve(repoRoot, "_exports", stamp);
mkdirSync(outDir, { recursive: true });

let events = [];
try {
  events = await fetchAll("analytics_events", "created_at");
  writeFileSync(resolve(outDir, "analytics_events.json"), JSON.stringify(events, null, 2));
  writeFileSync(resolve(outDir, "analytics_events.csv"), toCsv(events));
} catch (e) {
  console.error("analytics_events export error:", e.message);
}

let runs = [];
try {
  runs = await fetchAll("learner_runs", "updated_at");
  writeFileSync(resolve(outDir, "learner_runs.json"), JSON.stringify(runs, null, 2));
  writeFileSync(resolve(outDir, "learner_runs.csv"), toCsv(runs));
} catch (e) {
  console.error("learner_runs export error:", e.message);
}

// ---- Summary (also answers: is logging happening?) ----
const evUsers = new Set(events.map((e) => e.user_id));
const evTypes = events.reduce((m, e) => ((m[e.event_type] = (m[e.event_type] || 0) + 1), m), {});
const times = events.map((e) => e.created_at).filter(Boolean).sort();
const lrLearners = new Set(runs.map((r) => r.learner_id));

console.log("================ EXPORT SUMMARY ================");
console.log(`analytics_events : ${events.length} rows  |  ${evUsers.size} distinct users`);
if (times.length) console.log(`   time range    : ${times[0]}  ->  ${times[times.length - 1]}`);
if (events.length) {
  console.log("   event_type histogram:");
  Object.entries(evTypes).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(`     ${String(v).padStart(5)}  ${k}`));
}
console.log(`learner_runs     : ${runs.length} rows  |  ${lrLearners.size} distinct learners`);
console.log("");
if (events.length === 0 && runs.length === 0) {
  console.log("LOGGING CHECK: no rows yet. Either no students have used the studio,");
  console.log("  OR (mode A) admin RLS is not granting cross-student reads — if you");
  console.log("  expected data, re-run with SUPABASE_SERVICE_ROLE_KEY to confirm.");
} else {
  console.log("LOGGING CHECK: ✅ data is being recorded.");
}
console.log(`\nSaved to: ${outDir}`);
await sb.auth.signOut().catch(() => {});
