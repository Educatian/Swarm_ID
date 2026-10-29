import dns from "node:dns";
import process from "node:process";

dns.setDefaultResultOrder("ipv4first");
const args = new Set(process.argv.slice(2));
const execute = args.has("--execute");
const backupConfirmed = args.has("--backup-confirmed");
const accessToken = process.env.SUPABASE_ACCESS_TOKEN;
const origin = String(process.env.CLOUDFLARE_MIGRATION_ORIGIN || "").replace(/\/$/, "");
const migrationSecret = process.env.MIGRATION_SECRET;
const projectRef = "wvbvexiwyjifatrvdsnv";
const tables = ["profiles", "institutions", "courses", "course_memberships", "cases", "documents", "learner_runs", "cohort_graph_snapshots", "course_invites", "facilitator_actions", "research_consents", "analytics_events"];

if (!accessToken) throw new Error("SUPABASE_ACCESS_TOKEN is required.");
if (execute && (!origin || !migrationSecret || !backupConfirmed)) throw new Error("Execution requires the Cloudflare origin, migration secret, and --backup-confirmed.");

async function sourceQuery(query) {
  const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, { method: "POST", headers: { authorization: `Bearer ${accessToken}`, "content-type": "application/json" }, body: JSON.stringify({ query }), signal: AbortSignal.timeout(120000) });
  if (!response.ok) throw new Error(`Supabase query failed (${response.status}).`);
  return response.json();
}
async function post(path, body) {
  let lastError;
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    try {
      const response = await fetch(`${origin}${path}`, { method: "POST", headers: { authorization: `Bearer ${migrationSecret}`, "content-type": "application/json" }, body: JSON.stringify(body), signal: AbortSignal.timeout(120000) });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(`${response.status}: ${payload.error || "migration failed"}`);
      return payload;
    } catch (error) { lastError = error; if (attempt < 5) await new Promise((resolve) => setTimeout(resolve, attempt * 500)); }
  }
  throw lastError;
}

const rawUsers = await sourceQuery(`SELECT id::text,email,encrypted_password,raw_user_meta_data,created_at,updated_at FROM auth.users ORDER BY id`);
const users = rawUsers.map((row) => ({ id: String(row.id), email: String(row.email || `disabled+${row.id}@invalid.local`).trim().toLowerCase(), password_hash: String(row.encrypted_password || "$disabled$"), active: Boolean(row.encrypted_password && row.email), metadata: { ...(row.raw_user_meta_data || {}), ...(!row.encrypted_password || !row.email ? { requires_password_setup: true } : {}) }, created_at: row.created_at, updated_at: row.updated_at }));
const records = {};
for (const table of tables) records[table] = await sourceQuery(`SELECT * FROM public."${table}" ORDER BY 1`);

console.log(`Mode: ${execute ? "EXECUTE" : "DRY RUN"}`);
console.log(`auth_users: ${users.length}`);
console.log(`password_setup_required: ${users.filter((user) => !user.active).length}`);
for (const table of tables) console.log(`${table}: ${records[table].length}`);
if (!execute) process.exit(0);

let result;
for (let offset = 0; offset < users.length; offset += 100) result = await post("/api/migration/auth", { users: users.slice(offset, offset + 100) });
if (Number(result?.count) !== users.length) throw new Error(`Auth count mismatch: ${users.length} != ${result?.count}`);
for (const table of tables) {
  const rows = records[table]; let tableResult = { count: 0 };
  for (let offset = 0; offset < rows.length; offset += 100) tableResult = await post("/api/migration/records", { table, rows: rows.slice(offset, offset + 100) });
  if (Number(tableResult.count) !== rows.length) throw new Error(`${table} count mismatch: ${rows.length} != ${tableResult.count}`);
}
console.log(`Migration verified: ${users.length + Object.values(records).reduce((sum, rows) => sum + rows.length, 0)} records.`);
