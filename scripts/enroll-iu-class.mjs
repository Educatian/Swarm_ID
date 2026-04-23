/**
 * Enroll all 8 IU dummy accounts into Hyojung's W200 course.
 * Runs the SAME path the student UI will use: sign in as the account,
 * then call the `enroll_in_course_by_code` RPC. Idempotent.
 *
 * Split: iuclass1..4 → section 8748, iuclass5..8 → section 8750.
 *
 * Run:
 *   export SUPABASE_URL="https://wvbvexiwyjifatrvdsnv.supabase.co"
 *   export SUPABASE_ANON_KEY="sb_publishable_TlUkIam0ghqeFFgA82DwLA_1NjIQ-XZ"
 *   node scripts/enroll-iu-class.mjs
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Missing SUPABASE_URL / SUPABASE_ANON_KEY");
  process.exit(1);
}

const JOIN_CODE = "W200-LIT";

const accounts = Array.from({ length: 8 }, (_, i) => {
  const n = i + 1;
  return {
    email: `iuclass${n}@swarm.io`,
    password: `classiu${n}`,
    displayName: `IU Class ${n}`,
    section: n <= 4 ? "8748" : "8750",
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
  console.log(`Enrolling ${accounts.length} IU accounts into ${JOIN_CODE}`);
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
