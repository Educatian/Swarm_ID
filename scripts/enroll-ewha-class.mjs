/**
 * Enroll the 6 Ewha student dummy accounts into Dr. Hyeji Jang's
 * 교육방법 및 교육공학 (EDU101) course.
 *
 * Runs the SAME path the student UI uses: sign in as each student, then call
 * the `enroll_in_course_by_code` RPC. Idempotent — already-enrolled students
 * are reported as "already".
 *
 * Prerequisite: `node scripts/create-ewha-accounts.mjs` must have been run
 * first (creates the students, institution, course, and join code).
 *
 * Run:
 *   export SUPABASE_URL="https://wvbvexiwyjifatrvdsnv.supabase.co"
 *   export SUPABASE_ANON_KEY="sb_publishable_TlUkIam0ghqeFFgA82DwLA_1NjIQ-XZ"
 *   node scripts/enroll-ewha-class.mjs
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Missing SUPABASE_URL / SUPABASE_ANON_KEY");
  process.exit(1);
}

const JOIN_CODE = "EWHA-LIT";

const students = Array.from({ length: 6 }, (_, i) => {
  const n = i + 1;
  return {
    email: `kstudent${n}@swarm.io`,
    password: `classewha${n}`,
    displayName: `Ewha Student ${n}`,
  };
});

async function enrollOne({ email, password, displayName }) {
  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error: signErr } = await client.auth.signInWithPassword({ email, password });
  if (signErr) throw new Error(`sign-in: ${signErr.message}`);

  const { data, error } = await client.rpc("enroll_in_course_by_code", {
    p_join_code: JOIN_CODE,
    p_display_name: displayName,
    p_section: null,
  });
  if (error) throw new Error(`enroll: ${error.message}`);

  await client.auth.signOut();
  return data;
}

(async () => {
  console.log(`Enrolling ${students.length} Ewha students into ${JOIN_CODE}`);
  for (const student of students) {
    try {
      const res = await enrollOne(student);
      const status = res?.already_member ? "already" : "enrolled";
      console.log(`  ✓ ${status.padEnd(9)} ${student.email}`);
    } catch (err) {
      console.error(`  ✗ failed    ${student.email}  — ${err.message || err}`);
    }
  }
  console.log("Done.");
})();
