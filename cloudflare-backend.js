import bcrypt from "bcryptjs";

const TABLES = new Set([
  "profiles", "institutions", "courses", "course_memberships", "cases", "documents",
  "learner_runs", "cohort_graph_snapshots", "course_invites", "facilitator_actions",
  "research_consents", "analytics_events",
]);
const SESSION_SECONDS = 30 * 24 * 60 * 60;
const PLATFORM_ADMIN_EMAIL = "admin@swarm.io";
let tablesReady = false;

export async function handleDtsApi(path, request, env) {
  if (!path.startsWith("/api/")) return null;
  if (path === "/api/health" && request.method === "GET") {
    return json({ ok: true, db: Boolean(env.DB), auth: Boolean(env.DB), ai: Boolean(env.OPENROUTER_API_KEY) });
  }
  if (path === "/api/auth/sign-in" && request.method === "POST") return signIn(request, env);
  if (path === "/api/auth/sign-up-course" && request.method === "POST") return signUpCourse(request, env);
  if (path === "/api/auth/session" && request.method === "GET") return getSession(request, env);
  if (path === "/api/auth/sign-out" && request.method === "POST") return signOut(request, env);
  if (path === "/api/data" && request.method === "POST") return dataApi(request, env);
  if (path === "/api/rpc/lookup_course_by_join_code" && request.method === "POST") return lookupCourse(request, env);
  if (path === "/api/rpc/enroll_in_course_by_code" && request.method === "POST") return enrollCourse(request, env);
  if (path === "/api/functions/admin-invite-student" && request.method === "POST") return manageInvite(request, env);
  if (path === "/api/functions/admin-manage-membership" && request.method === "POST") return manageMembership(request, env);
  if (path === "/api/migration/auth" && request.method === "POST") return migrateAuth(request, env);
  if (path === "/api/migration/records" && request.method === "POST") return migrateRecords(request, env);
  return null;
}

async function ensureTables(env) {
  if (tablesReady) return;
  if (!env.DB) throw statusError("Cloudflare D1 is not configured.", 503);
  const statements = [
    `CREATE TABLE IF NOT EXISTS dts_auth_users (id TEXT PRIMARY KEY,email TEXT NOT NULL UNIQUE COLLATE NOCASE,password_hash TEXT NOT NULL,metadata_json TEXT NOT NULL DEFAULT '{}',active INTEGER NOT NULL DEFAULT 1,created_at TEXT NOT NULL,updated_at TEXT NOT NULL)`,
    `CREATE TABLE IF NOT EXISTS dts_auth_sessions (token_hash TEXT PRIMARY KEY,user_id TEXT NOT NULL,expires_at INTEGER NOT NULL,created_at INTEGER NOT NULL,user_agent TEXT,FOREIGN KEY(user_id) REFERENCES dts_auth_users(id) ON DELETE CASCADE)`,
    `CREATE INDEX IF NOT EXISTS idx_dts_sessions_user ON dts_auth_sessions(user_id,expires_at)`,
    `CREATE TABLE IF NOT EXISTS dts_records (table_name TEXT NOT NULL,record_id TEXT NOT NULL,payload_json TEXT NOT NULL,owner_id TEXT,course_id TEXT,case_id TEXT,created_at TEXT NOT NULL,updated_at TEXT NOT NULL,PRIMARY KEY(table_name,record_id))`,
    `CREATE INDEX IF NOT EXISTS idx_dts_records_course ON dts_records(table_name,course_id)`,
    `CREATE INDEX IF NOT EXISTS idx_dts_records_owner ON dts_records(table_name,owner_id)`,
    `CREATE INDEX IF NOT EXISTS idx_dts_records_case ON dts_records(table_name,case_id)`,
    `CREATE TABLE IF NOT EXISTS dts_rate_limits (bucket TEXT NOT NULL,client_key TEXT NOT NULL,window_start INTEGER NOT NULL,count INTEGER NOT NULL,PRIMARY KEY(bucket,client_key))`,
  ];
  for (const statement of statements) await env.DB.prepare(statement).run();
  tablesReady = true;
}

function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers } });
}
function statusError(message, status = 400, code = "REQUEST_ERROR") {
  const error = new Error(message); error.status = status; error.code = code; return error;
}
async function bodyJson(request) {
  const length = Number(request.headers.get("content-length") || 0);
  if (length > 1_500_000) throw statusError("Request is too large.", 413);
  return request.json().catch(() => ({}));
}
function bearer(request) {
  const value = request.headers.get("authorization") || "";
  return value.startsWith("Bearer ") ? value.slice(7).trim() : "";
}
async function sha256(value) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(String(value)));
  return [...new Uint8Array(digest)].map((part) => part.toString(16).padStart(2, "0")).join("");
}
function constantTimeEqual(a, b) {
  const left = new TextEncoder().encode(String(a)); const right = new TextEncoder().encode(String(b));
  if (left.length !== right.length) return false;
  let diff = 0; for (let i = 0; i < left.length; i += 1) diff |= left[i] ^ right[i]; return diff === 0;
}
async function rateLimit(request, env, bucket, limit) {
  await ensureTables(env);
  const ip = request.headers.get("cf-connecting-ip") || "unknown";
  const key = await sha256(`${bucket}:${ip}`);
  const windowStart = Math.floor(Date.now() / 60000);
  const row = await env.DB.prepare(
    `INSERT INTO dts_rate_limits(bucket,client_key,window_start,count) VALUES(?,?,?,1)
     ON CONFLICT(bucket,client_key) DO UPDATE SET window_start=CASE WHEN dts_rate_limits.window_start<excluded.window_start THEN excluded.window_start ELSE dts_rate_limits.window_start END,count=CASE WHEN dts_rate_limits.window_start<excluded.window_start THEN 1 ELSE dts_rate_limits.count+1 END RETURNING count`,
  ).bind(bucket, key, windowStart).first();
  if (Number(row?.count || 0) > limit) throw statusError("Too many requests. Try again shortly.", 429, "RATE_LIMITED");
}

function publicUser(row) {
  let metadata = {}; try { metadata = JSON.parse(row.metadata_json || "{}"); } catch (_) {}
  return { id: row.id, email: row.email, user_metadata: metadata };
}
async function createSession(request, env, row) {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  const token = btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  const now = Math.floor(Date.now() / 1000);
  await env.DB.prepare(`INSERT INTO dts_auth_sessions(token_hash,user_id,expires_at,created_at,user_agent) VALUES(?,?,?,?,?)`)
    .bind(await sha256(token), row.id, now + SESSION_SECONDS, now, String(request.headers.get("user-agent") || "").slice(0, 300)).run();
  return { user: publicUser(row), access_token: token, expires_at: now + SESSION_SECONDS };
}
async function authRow(request, env) {
  const token = bearer(request); if (!token) return null;
  await ensureTables(env);
  return env.DB.prepare(
    `SELECT u.id,u.email,u.metadata_json,s.expires_at FROM dts_auth_sessions s JOIN dts_auth_users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>? AND u.active=1`,
  ).bind(await sha256(token), Math.floor(Date.now() / 1000)).first();
}
async function requireUser(request, env) {
  const user = await authRow(request, env); if (!user) throw statusError("Sign in is required.", 401, "AUTH_REQUIRED"); return user;
}
async function signIn(request, env) {
  try {
    await rateLimit(request, env, "auth", 10);
    const body = await bodyJson(request); const email = String(body.email || "").trim().toLowerCase(); const password = String(body.password || "");
    const row = await env.DB.prepare(`SELECT * FROM dts_auth_users WHERE email=? COLLATE NOCASE AND active=1`).bind(email).first();
    if (!row || !(await bcrypt.compare(password, row.password_hash))) throw statusError("Invalid email or password.", 401, "INVALID_CREDENTIALS");
    const session = await createSession(request, env, row); return json({ data: { user: session.user, session } });
  } catch (error) { return errorResponse(error); }
}
async function signUpCourse(request, env) {
  try {
    await rateLimit(request, env, "signup", 5);
    const body = await bodyJson(request); const email = String(body.email || "").trim().toLowerCase(); const password = String(body.password || ""); const joinCode = String(body.joinCode || "").trim().toUpperCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw statusError("Enter a valid email.", 400);
    if (password.length < 12 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) throw statusError("Use at least 12 characters with upper/lowercase letters and a number.", 400, "WEAK_PASSWORD");
    const courses = await readRecords(env, "courses"); const course = courses.find((row) => String(row.join_code || "").toUpperCase() === joinCode);
    if (!course) throw statusError("Invalid email, password, or course code.", 400, "INVALID_REGISTRATION");
    const existing = await env.DB.prepare(`SELECT * FROM dts_auth_users WHERE email=? COLLATE NOCASE`).bind(email).first();
    if (existing && Number(existing.active) === 1) throw statusError("Invalid email, password, or course code.", 400, "INVALID_REGISTRATION");
    const id = existing?.id || crypto.randomUUID(); const now = new Date().toISOString();
    let oldMetadata = {}; try { oldMetadata = JSON.parse(existing?.metadata_json || "{}"); } catch (_) {}
    const metadata = { ...oldMetadata, display_name: oldMetadata.display_name || email.split("@")[0] }; delete metadata.requires_password_setup;
    if (existing) {
      await env.DB.prepare(`UPDATE dts_auth_users SET password_hash=?,metadata_json=?,active=1,updated_at=? WHERE id=?`).bind(await bcrypt.hash(password, 12), JSON.stringify(metadata), now, id).run();
    } else {
      await env.DB.prepare(`INSERT INTO dts_auth_users(id,email,password_hash,metadata_json,active,created_at,updated_at) VALUES(?,?,?,?,1,?,?)`).bind(id, email, await bcrypt.hash(password, 12), JSON.stringify(metadata), now, now).run();
    }
    const profiles = await readRecords(env, "profiles");
    if (!profiles.some((row) => row.id === id)) await putRecord(env, "profiles", { id, full_name: metadata.display_name, created_at: now }, now);
    const memberships = await readRecords(env, "course_memberships");
    if (!memberships.some((row) => row.user_id === id && row.course_id === course.id && row.status === "active")) await putRecord(env, "course_memberships", { id: crypto.randomUUID(), user_id: id, institution_id: course.institution_id, course_id: course.id, role: "user", display_name: metadata.display_name, title: "Learner", focus: "Reflection run", section: course.code, is_primary: false, status: "active", created_at: now }, now);
    const row = { id, email, metadata_json: JSON.stringify(metadata) }; const session = await createSession(request, env, row);
    return json({ data: { user: session.user, session } }, 201);
  } catch (error) { return errorResponse(error); }
}
async function getSession(request, env) {
  try { const row = await authRow(request, env); if (!row) return json({ data: { session: null } }); const user = publicUser(row); return json({ data: { session: { user, access_token: bearer(request), expires_at: row.expires_at } } }); }
  catch (error) { return errorResponse(error); }
}
async function signOut(request, env) {
  try { const token = bearer(request); if (token && env.DB) await env.DB.prepare(`DELETE FROM dts_auth_sessions WHERE token_hash=?`).bind(await sha256(token)).run(); return json({ data: { ok: true } }); }
  catch (error) { return errorResponse(error); }
}

function parseRecord(row) { try { return JSON.parse(row.payload_json); } catch (_) { return {}; } }
async function readRecords(env, table) {
  await ensureTables(env); const result = await env.DB.prepare(`SELECT payload_json FROM dts_records WHERE table_name=?`).bind(table).all(); return (result.results || []).map(parseRecord);
}
function recordId(table, row) {
  if (row.id) return String(row.id);
  if (table === "research_consents") return `${row.user_id}:${row.course_id}:${row.consent_version}`;
  return crypto.randomUUID();
}
function indexes(table, row) {
  return {
    owner: row.user_id || row.learner_id || row.instructor_id || (table === "profiles" ? row.id : null) || null,
    course: row.course_id || null,
    caseId: row.case_id || (table === "cases" ? row.id : null) || null,
  };
}
async function putRecord(env, table, input, sourceTime) {
  const row = { ...input }; row.id ||= recordId(table, row);
  const now = sourceTime || row.updated_at || row.created_at || new Date().toISOString(); const idx = indexes(table, row);
  await env.DB.prepare(
    `INSERT INTO dts_records(table_name,record_id,payload_json,owner_id,course_id,case_id,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?)
     ON CONFLICT(table_name,record_id) DO UPDATE SET payload_json=excluded.payload_json,owner_id=excluded.owner_id,course_id=excluded.course_id,case_id=excluded.case_id,updated_at=excluded.updated_at`,
  ).bind(table, String(row.id), JSON.stringify(row), idx.owner, idx.course, idx.caseId, row.created_at || now, now).run();
  return row;
}
function matchFilter(row, filter) {
  const actual = row?.[filter.column];
  if (filter.type === "eq") return JSON.stringify(actual) === JSON.stringify(filter.value) || String(actual ?? "") === String(filter.value ?? "");
  if (filter.type === "in") return (filter.values || []).some((value) => String(actual ?? "") === String(value ?? ""));
  return false;
}
function filterRows(rows, filters = []) { return rows.filter((row) => filters.every((filter) => matchFilter(row, filter))); }
async function contextFor(env, user) {
  return {
    user,
    memberships: await readRecords(env, "course_memberships"),
    institutions: await readRecords(env, "institutions"),
    courses: await readRecords(env, "courses"),
    cases: await readRecords(env, "cases"),
  };
}
function member(ctx, courseId, role) { return ctx.memberships.some((m) => m.user_id === ctx.user.id && m.course_id === courseId && m.status === "active" && (!role || m.role === role)); }
function institutionAdmin(ctx, institutionId) { return ctx.user.email === PLATFORM_ADMIN_EMAIL || ctx.memberships.some((m) => m.user_id === ctx.user.id && m.institution_id === institutionId && m.role === "admin" && m.status === "active"); }
function canCreateInstitution(ctx) { return ctx.user.email === PLATFORM_ADMIN_EMAIL || ctx.memberships.some((m) => m.user_id === ctx.user.id && m.role === "admin" && m.status === "active"); }
function institutionCreator(ctx, institutionId) { return ctx.institutions.some((institution) => institution.id === institutionId && institution.created_by === ctx.user.id); }
function courseCreator(ctx, courseId) { return ctx.courses.some((course) => course.id === courseId && course.created_by === ctx.user.id); }
function courseForCase(ctx, caseId) { return ctx.cases.find((item) => item.id === caseId)?.course_id || null; }
function canRead(ctx, table, row) {
  if (table === "profiles") return row.id === ctx.user.id;
  if (table === "institutions") return ctx.user.email === PLATFORM_ADMIN_EMAIL || ctx.memberships.some((m) => m.user_id === ctx.user.id && m.institution_id === row.id && m.status === "active");
  if (table === "courses") return ctx.user.email === PLATFORM_ADMIN_EMAIL || member(ctx, row.id);
  if (table === "course_memberships") return row.user_id === ctx.user.id || member(ctx, row.course_id, "admin");
  if (table === "cases" || table === "documents") return member(ctx, row.course_id, "admin") || (member(ctx, row.course_id) && row.published === true);
  if (table === "learner_runs") return row.learner_id === ctx.user.id || member(ctx, courseForCase(ctx, row.case_id), "admin");
  if (table === "course_invites") return member(ctx, row.course_id, "admin");
  if (table === "facilitator_actions") return member(ctx, row.course_id, "admin") || (member(ctx, row.course_id) && row.status === "published");
  if (table === "research_consents") return row.user_id === ctx.user.id;
  if (table === "analytics_events") return row.user_id === ctx.user.id || member(ctx, row.course_id, "admin");
  if (table === "cohort_graph_snapshots") return member(ctx, courseForCase(ctx, row.case_id));
  return false;
}
function canWrite(ctx, table, row) {
  if (table === "profiles") return row.id === ctx.user.id;
  if (table === "institutions") return canCreateInstitution(ctx);
  if (table === "courses") return ctx.user.email === PLATFORM_ADMIN_EMAIL || institutionAdmin(ctx, row.institution_id) || row.created_by === ctx.user.id;
  if (table === "course_memberships") return ctx.user.email === PLATFORM_ADMIN_EMAIL || member(ctx, row.course_id, "admin") || institutionCreator(ctx, row.institution_id) || courseCreator(ctx, row.course_id);
  if (table === "cases" || table === "documents" || table === "course_invites") return member(ctx, row.course_id, "admin");
  if (table === "learner_runs") return row.learner_id === ctx.user.id || member(ctx, courseForCase(ctx, row.case_id), "admin");
  if (table === "facilitator_actions") return row.instructor_id === ctx.user.id && member(ctx, row.course_id, "admin");
  if (table === "research_consents" || table === "analytics_events") return row.user_id === ctx.user.id;
  if (table === "cohort_graph_snapshots") return member(ctx, courseForCase(ctx, row.case_id), "admin");
  return false;
}
function withDefaults(table, row) {
  const now = new Date().toISOString(); const next = { ...row };
  next.id ||= recordId(table, next); next.created_at ||= now;
  if (table === "analytics_events") next.client_ts ||= now;
  if (table === "learner_runs") next.updated_at ||= now;
  return next;
}
function conflictFields(table, options, row) {
  if (options?.onConflict) return String(options.onConflict).split(",").map((part) => part.trim()).filter(Boolean);
  if (table === "profiles") return ["id"];
  return row.id ? ["id"] : [];
}
async function dataApi(request, env) {
  try {
    await rateLimit(request, env, "data", 360); const user = await requireUser(request, env); const body = await bodyJson(request);
    const table = String(body.table || ""); if (!TABLES.has(table)) throw statusError("Unsupported data table.", 400);
    const operation = String(body.operation || "select"); const ctx = await contextFor(env, user); let rows = await readRecords(env, table);
    if (operation === "select") {
      rows = filterRows(rows.filter((row) => canRead(ctx, table, row)), body.filters);
      if (body.order?.column) rows.sort((a, b) => String(a[body.order.column] ?? "").localeCompare(String(b[body.order.column] ?? "")) * (body.order.ascending === false ? -1 : 1));
      const count = rows.length; if (body.limit != null) rows = rows.slice(0, Math.max(0, Number(body.limit) || 0));
      return cardinalityResponse(rows, body, count);
    }
    if (!["insert", "upsert", "update", "delete"].includes(operation)) throw statusError("Unsupported data operation.", 400);
    const affected = [];
    if (operation === "insert" || operation === "upsert") {
      const inputs = Array.isArray(body.values) ? body.values : [body.values || {}];
      for (const input of inputs) {
        let next = withDefaults(table, input); const fields = conflictFields(table, body.options, next);
        const existing = rows.find((row) => fields.length && fields.every((field) => String(row[field] ?? "") === String(next[field] ?? "")));
        if (existing && operation === "insert") throw statusError("A matching record already exists.", 409, "23505");
        if (existing) next = { ...existing, ...next, id: existing.id };
        if (!canWrite(ctx, table, next)) throw statusError("You do not have permission to change this record.", 403);
        affected.push(await putRecord(env, table, next));
      }
    } else {
      const targets = filterRows(rows, body.filters);
      for (const current of targets) {
        if (!canWrite(ctx, table, current)) throw statusError("You do not have permission to change this record.", 403);
        if (operation === "delete") {
          await env.DB.prepare(`DELETE FROM dts_records WHERE table_name=? AND record_id=?`).bind(table, String(current.id)).run(); affected.push(current);
        } else {
          const next = { ...current, ...(body.values || {}), id: current.id, updated_at: new Date().toISOString() };
          if (!canWrite(ctx, table, next)) throw statusError("You do not have permission to change this record.", 403);
          affected.push(await putRecord(env, table, next));
        }
      }
    }
    return body.returning ? cardinalityResponse(affected, body, affected.length) : json({ data: null, count: affected.length });
  } catch (error) { return errorResponse(error); }
}
function cardinalityResponse(rows, body, count) {
  if (body.options?.head) return json({ data: null, count });
  if (body.cardinality === "single") {
    if (rows.length !== 1) return json({ error: rows.length ? "Expected one record." : "Record not found.", code: "PGRST116" }, rows.length ? 409 : 404);
    return json({ data: rows[0], count });
  }
  if (body.cardinality === "maybeSingle") {
    if (rows.length > 1) return json({ error: "Expected at most one record.", code: "PGRST116" }, 409);
    return json({ data: rows[0] || null, count });
  }
  return json({ data: rows, count });
}

async function lookupCourse(request, env) {
  try { await requireUser(request, env); const body = await bodyJson(request); const code = String(body.p_join_code || "").trim().toUpperCase(); const course = (await readRecords(env, "courses")).find((row) => String(row.join_code || "").toUpperCase() === code); return json({ data: course ? [course] : [] }); }
  catch (error) { return errorResponse(error); }
}
async function enrollCourse(request, env) {
  try {
    const user = await requireUser(request, env); const body = await bodyJson(request); const code = String(body.p_join_code || "").trim().toUpperCase(); const course = (await readRecords(env, "courses")).find((row) => String(row.join_code || "").toUpperCase() === code);
    if (!course) throw statusError("Course not found.", 404); const memberships = await readRecords(env, "course_memberships");
    const existing = memberships.find((m) => m.user_id === user.id && m.course_id === course.id && m.status === "active"); if (existing) return json({ data: existing });
    if (memberships.some((m) => m.user_id === user.id && m.role === "user" && m.status === "active" && m.course_id !== course.id)) throw statusError("This student account is already linked to another active course.", 409, "23505");
    const row = withDefaults("course_memberships", { user_id: user.id, institution_id: course.institution_id, course_id: course.id, role: "user", display_name: String(body.p_display_name || user.email), title: "Learner", focus: "Reflection run", section: body.p_section || course.code, is_primary: false, status: "active" });
    return json({ data: await putRecord(env, "course_memberships", row) });
  } catch (error) { return errorResponse(error); }
}
async function requireCourseAdmin(request, env, courseId) { const user = await requireUser(request, env); const ctx = await contextFor(env, user); if (!member(ctx, courseId, "admin")) throw statusError("Instructor permission required.", 403); return { user, ctx }; }
async function manageInvite(request, env) {
  try {
    const body = await bodyJson(request); const courseId = String(body.courseId || ""); const { user } = await requireCourseAdmin(request, env, courseId); const email = String(body.email || "").trim().toLowerCase(); if (!email) throw statusError("Email is required.");
    const invites = await readRecords(env, "course_invites"); const current = invites.find((row) => row.course_id === courseId && row.email === email);
    if (body.action === "revoke") { if (!current) throw statusError("Invite not found.", 404); const row = { ...current, status: "revoked", revoked_at: new Date().toISOString() }; return json({ data: { invite: await putRecord(env, "course_invites", row) } }); }
    const course = (await readRecords(env, "courses")).find((row) => row.id === courseId); const now = new Date().toISOString();
    const row = { ...(current || {}), id: current?.id || crypto.randomUUID(), course_id: courseId, email, display_name: String(body.displayName || "") || null, status: "ready", auth_user_id: current?.auth_user_id || null, created_by: user.id, created_at: current?.created_at || now, sent_at: null, last_sent_at: now, revoked_at: null };
    return json({ data: { invite: await putRecord(env, "course_invites", row), delivery: "secure_link", invite_url: `/?join=${encodeURIComponent(course?.join_code || "")}` } });
  } catch (error) { return errorResponse(error); }
}
async function manageMembership(request, env) {
  try {
    const body = await bodyJson(request); const courseId = String(body.courseId || ""); await requireCourseAdmin(request, env, courseId); const email = String(body.email || "").trim().toLowerCase(); const target = await env.DB.prepare(`SELECT id,email,metadata_json FROM dts_auth_users WHERE email=? COLLATE NOCASE AND active=1`).bind(email).first(); if (!target) throw statusError("Create or invite this account first.", 404);
    const course = (await readRecords(env, "courses")).find((row) => row.id === courseId); if (!course) throw statusError("Course not found.", 404); const role = body.role === "user" ? "user" : "admin"; const all = await readRecords(env, "course_memberships"); const current = all.find((row) => row.user_id === target.id && row.course_id === courseId);
    const row = { ...(current || {}), id: current?.id || crypto.randomUUID(), user_id: target.id, institution_id: course.institution_id, course_id: courseId, role, display_name: String(body.displayName || email), title: role === "admin" ? "Course instructor" : "Learner", section: course.code, is_primary: false, status: "active", created_at: current?.created_at || new Date().toISOString() };
    return json({ data: { membership: await putRecord(env, "course_memberships", row) } });
  } catch (error) { return errorResponse(error); }
}

async function requireMigration(request, env) { if (!env.MIGRATION_SECRET || !constantTimeEqual(bearer(request), String(env.MIGRATION_SECRET))) throw statusError("Migration authorization required.", 401); await ensureTables(env); }
async function migrateAuth(request, env) {
  try {
    await requireMigration(request, env); const body = await bodyJson(request); const users = Array.isArray(body.users) ? body.users.slice(0, 100) : []; const statements = [];
    for (const user of users) { if (!user.id || !user.email || !user.password_hash) continue; statements.push(env.DB.prepare(`INSERT INTO dts_auth_users(id,email,password_hash,metadata_json,active,created_at,updated_at) VALUES(?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET email=excluded.email,password_hash=excluded.password_hash,metadata_json=excluded.metadata_json,active=excluded.active,updated_at=excluded.updated_at`).bind(String(user.id), String(user.email).toLowerCase(), String(user.password_hash), JSON.stringify(user.metadata || {}), user.active === false ? 0 : 1, user.created_at || new Date().toISOString(), user.updated_at || new Date().toISOString())); }
    if (statements.length) await env.DB.batch(statements); const count = await env.DB.prepare(`SELECT COUNT(*) AS count FROM dts_auth_users`).first(); return json({ ok: true, count: Number(count?.count || 0) });
  } catch (error) { return errorResponse(error); }
}
async function migrateRecords(request, env) {
  try {
    await requireMigration(request, env); const body = await bodyJson(request); const table = String(body.table || ""); if (!TABLES.has(table)) throw statusError("Unsupported migration table."); const rows = Array.isArray(body.rows) ? body.rows.slice(0, 250) : []; const statements = [];
    for (const input of rows) { const row = { ...input }; row.id ||= recordId(table, row); const now = row.updated_at || row.created_at || new Date().toISOString(); const idx = indexes(table, row); statements.push(env.DB.prepare(`INSERT INTO dts_records(table_name,record_id,payload_json,owner_id,course_id,case_id,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?) ON CONFLICT(table_name,record_id) DO UPDATE SET payload_json=excluded.payload_json,owner_id=excluded.owner_id,course_id=excluded.course_id,case_id=excluded.case_id,updated_at=excluded.updated_at`).bind(table, String(row.id), JSON.stringify(row), idx.owner, idx.course, idx.caseId, row.created_at || now, now)); }
    if (statements.length) await env.DB.batch(statements); const count = await env.DB.prepare(`SELECT COUNT(*) AS count FROM dts_records WHERE table_name=?`).bind(table).first(); return json({ ok: true, table, count: Number(count?.count || 0) });
  } catch (error) { return errorResponse(error); }
}
function errorResponse(error) { return json({ error: error?.message || String(error), code: error?.code || "REQUEST_ERROR" }, Number(error?.status) || 500); }
