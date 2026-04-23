/**
 * Create 1 instructor account (Yujin Park) + 8 dummy student accounts for
 * Yujin Park's FSU class. Mirror of scripts/create-iu-accounts.mjs — same
 * admin-API upsert pattern, same "safe to re-run" behavior.
 *
 * Accounts created:
 *   yujinpark@swarm.io  / classfsuyp     (role: admin)
 *   fsuclass1@swarm.io  / classfsu1      (role: user)
 *   fsuclass2@swarm.io  / classfsu2      (role: user)
 *   ...
 *   fsuclass8@swarm.io  / classfsu8      (role: user)
 *
 * Each account is:
 *   - email-confirmed (skips Supabase magic-link step)
 *   - tagged with user_metadata { role, cohort, institution, course }
 *
 * ---------- Setup ----------
 *   npm i -D @supabase/supabase-js
 *
 * ---------- Run (bash / git-bash) ----------
 *   export SUPABASE_URL="https://wvbvexiwyjifatrvdsnv.supabase.co"
 *   export SUPABASE_SERVICE_ROLE_KEY="<paste your service_role key>"
 *   node scripts/create-fsu-accounts.mjs
 *
 * ---------- Run (PowerShell) ----------
 *   $env:SUPABASE_URL = "https://wvbvexiwyjifatrvdsnv.supabase.co"
 *   $env:SUPABASE_SERVICE_ROLE_KEY = "<paste your service_role key>"
 *   node scripts/create-fsu-accounts.mjs
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

// --- shared metadata ----------------------------------------------------
// TODO(yujin): confirm course title + code with Yujin before running. These
// land in user_metadata only — they do NOT create a course row; that still
// happens via the admin UI or a separate seed (see enroll-fsu-class.mjs).
const COHORT = "fsu-yjpark";
const INSTITUTION = "Florida State University";
const COURSE = "FSU Yujin Park class";

// --- instructor --------------------------------------------------------
const instructor = {
  email: "yujinpark@swarm.io",
  password: "classfsuyp",
  name: "Yujin Park",
  role: "admin",
};

// --- 8 dummy students --------------------------------------------------
const students = Array.from({ length: 8 }, (_, i) => {
  const n = i + 1;
  return {
    email: `fsuclass${n}@swarm.io`,
    password: `classfsu${n}`,
    name: `FSU Class ${n}`,
    role: "user",
  };
});

const accounts = [instructor, ...students];

async function upsertAccount({ email, password, name, role }) {
  const metadata = {
    display_name: name,
    role,
    cohort: COHORT,
    institution: INSTITUTION,
    course: COURSE,
  };

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: metadata,
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
        user_metadata: metadata,
      });
      if (updErr) throw updErr;
      return { email, status: "updated", id: existing.id };
    }
    throw error;
  }

  return { email, status: "created", id: data.user?.id };
}

(async () => {
  console.log(`Creating ${accounts.length} FSU accounts on ${SUPABASE_URL}`);
  console.log(`  ↳ 1 instructor (${instructor.email}) + ${students.length} dummy students\n`);
  for (const acc of accounts) {
    try {
      const res = await upsertAccount(acc);
      const tag = acc.role === "admin" ? "[instructor]" : "[student]   ";
      console.log(`  ✓ ${res.status.padEnd(8)} ${tag} ${res.email}  (${res.id})`);
    } catch (err) {
      console.error(`  ✗ failed   ${acc.email}  — ${err.message || err}`);
    }
  }
  console.log("\nDone.");
  console.log("Next: ask Yujin to create her course in the admin UI, then");
  console.log("update JOIN_CODE in enroll-fsu-class.mjs and run it to enroll");
  console.log("the 8 dummy students.");
})();
