/**
 * Enroll all 8 FSU dummy accounts into Yujin Park's course.
 * Mirror of scripts/enroll-iu-class.mjs — runs the SAME path the student UI
 * uses: sign in as the dummy account, then call the
 * `enroll_in_course_by_code` RPC. Idempotent.
 *
 * All 8 students → section "FSU-A" (single cohort per Yujin's request).
 *
 * ---------- Prerequisites ----------
 * 1. Run scripts/create-fsu-accounts.mjs first to create the 8 dummy accounts.
 * 2. Yujin must have created her course in the admin UI AND set a join code
 *    (the JOIN_CODE below must match exactly).
 *
 * ---------- Run (bash / git-bash) ----------
 *   export SUPABASE_URL="https://wvbvexiwyjifatrvdsnv.supabase.co"
 *   export SUPABASE_ANON_KEY="sb_publishable_TlUkIam0ghqeFFgA82DwLA_1NjIQ-XZ"
 *   node scripts/enroll-fsu-class.mjs
 *
 * ---------- Run (PowerShell) ----------
 *   $env:SUPABASE_URL = "https://wvbvexiwyjifatrvdsnv.supabase.co"
 *   $env:SUPABASE_ANON_KEY = "sb_publishable_TlUkIam0ghqeFFgA82DwLA_1NjIQ-XZ"
 *   node scripts/enroll-fsu-class.mjs
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Missing SUPABASE_URL / SUPABASE_ANON_KEY");
  process.exit(1);
}

// TODO(yujin): replace with the join code Yujin sets on her course.
const JOIN_CODE = "FSU-YJPARK";

const accounts = Array.from({ length: 8 }, (_, i) => {
  const n = i + 1;
  return {
    email: `fsuclass${n}@swarm.io`,
    password: `classfsu${n}`,
    displayName: `FSU Class ${n}`,
    section: "FSU-A",
  };
});

async function enrollOne({ email, password, displayName, section }) {
  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error: signErr } = await client.auth.signInWithPassword({ email, password });
  if (signErr) throw new Error(`sign-in: ${signErr.message}`);

  const { data, error } = await client.rpc("enroll_in_course_by_code", {
    p_join_code: JOIN_CODE,
    p_display_name: displayName,
    p_section: section,
  });
  if (error) throw new Error(`enroll: ${error.message}`);

  await client.auth.signOut();
  return data;
}

(async () => {
  console.log(`Enrolling ${accounts.length} FSU accounts into ${JOIN_CODE}`);
  for (const acc of accounts) {
    try {
      const res = await enrollOne(acc);
      const status = res?.already_member ? "already" : "enrolled";
      console.log(`  ✓ ${status.padEnd(9)} ${acc.email}  → section ${res?.section || acc.section}`);
    } catch (err) {
      console.error(`  ✗ failed    ${acc.email}  — ${err.message || err}`);
    }
  }
  console.log("Done.");
})();
