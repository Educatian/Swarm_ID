/**
 * Delete the transient logging-verification rows from analytics_events.
 * Uses service_role (bypasses RLS — student keys cannot delete analytics_events).
 * No secrets stored here; key comes from env.
 *
 * Run (bash, via `!`):
 *   cd "C:\Users\jewoo\Projects\jewoo_backup_2026-05-11\projects\Swarm_ID" && \
 *   export SUPABASE_SERVICE_ROLE_KEY="$(tr -d '\r\n' < "C:\Users\jewoo\Desktop\datasandbox_supabase_servicerole.txt")" && \
 *   node scripts/cleanup-test-events.mjs
 */
import { createClient } from "@supabase/supabase-js";

const URL = process.env.SUPABASE_URL || "https://wvbvexiwyjifatrvdsnv.supabase.co";
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!KEY) {
  console.error("Need SUPABASE_SERVICE_ROLE_KEY (analytics_events delete is RLS-blocked for anon/student).");
  process.exit(1);
}
const c = createClient(URL, KEY, { auth: { persistSession: false } });

const a = await c.from("analytics_events").delete().eq("event_type", "__smoke_test__").select("id");
const b = await c.from("analytics_events").delete().eq("payload->>__transient_test", "true").select("id");
const delA = a.error ? `ERR ${a.error.message}` : `${a.data.length}`;
const delB = b.error ? `ERR ${b.error.message}` : `${b.data.length}`;
console.log(`deleted __smoke_test__: ${delA}`);
console.log(`deleted __transient_test: ${delB}`);

const { count, error } = await c.from("analytics_events").select("*", { count: "exact", head: true });
console.log(`analytics_events now: ${error ? "ERR " + error.message : count + " rows"}`);
