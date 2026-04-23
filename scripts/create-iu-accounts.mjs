/**
 * Create 8 dummy student accounts for Hyojung Kim's W200 classes
 * (sections 8748 / 8750 — April 21 / 23 / 28).
 *
 * Accounts created:
 *   iuclass1@swarm.io  / classiu1
 *   iuclass2@swarm.io  / classiu2
 *   ...
 *   iuclass8@swarm.io  / classiu8
 *
 * Each account is:
 *   - email-confirmed (skips the Supabase magic-link step)
 *   - tagged with user_metadata { role: "user", cohort: "iu-w200" }
 *
 * ---------- Setup ----------
 *   npm i -D @supabase/supabase-js
 *
 * ---------- Run (bash / git-bash) ----------
 *   export SUPABASE_URL="https://wvbvexiwyjifatrvdsnv.supabase.co"
 *   export SUPABASE_SERVICE_ROLE_KEY="<paste your service_role key>"
 *   node scripts/create-iu-accounts.mjs
 *
 * ---------- Run (PowerShell) ----------
 *   $env:SUPABASE_URL = "https://wvbvexiwyjifatrvdsnv.supabase.co"
 *   $env:SUPABASE_SERVICE_ROLE_KEY = "<paste your service_role key>"
 *   node scripts/create-iu-accounts.mjs
 *
 * The service_role key lives in Supabase dashboard →
 *   Project Settings → API → Project API keys → "service_role" (secret).
 * NEVER commit it. It bypasses RLS — treat it like a root password.
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "Missing env. Export SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running."
  );
  process.exit(1);
}

const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const accounts = Array.from({ length: 8 }, (_, i) => {
  const n = i + 1;
  return {
    email: `iuclass${n}@swarm.io`,
    password: `classiu${n}`,
    name: `IU Class ${n}`,
  };
});

async function upsertAccount({ email, password, name }) {
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      display_name: name,
      role: "user",
      cohort: "iu-w200",
      institution: "Indiana University",
      course: "W200 Teaching with Technology",
    },
  });

  if (error) {
    // If it already exists, update the password instead so re-runs are safe.
    if (String(error.message || "").toLowerCase().includes("already")) {
      const { data: list, error: listErr } = await admin.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
      });
      if (listErr) throw listErr;
      const existing = list.users.find((u) => u.email === email);
      if (!existing) throw error;
      const { error: updErr } = await admin.auth.admin.updateUserById(existing.id, {
        password,
        email_confirm: true,
        user_metadata: {
          display_name: name,
          role: "user",
          cohort: "iu-w200",
          institution: "Indiana University",
          course: "W200 Teaching with Technology",
        },
      });
      if (updErr) throw updErr;
      return { email, status: "updated", id: existing.id };
    }
    throw error;
  }

  return { email, status: "created", id: data.user?.id };
}

(async () => {
  console.log(`Creating ${accounts.length} IU W200 dummy accounts on ${SUPABASE_URL}`);
  for (const acc of accounts) {
    try {
      const res = await upsertAccount(acc);
      console.log(`  ✓ ${res.status.padEnd(8)} ${res.email}  (${res.id})`);
    } catch (err) {
      console.error(`  ✗ failed   ${acc.email}  — ${err.message || err}`);
    }
  }
  console.log("Done.");
})();
