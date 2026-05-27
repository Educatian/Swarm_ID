/**
 * Enroll the 22 CAT 531 student accounts into Jewoong Moon's CAT 531 course
 * (join code UA-CAT531-SUMMER26) on Swarm ID / Design Tension Studio.
 *
 * Runs the SAME path the student UI uses: sign in as each student, then call
 * the `enroll_in_course_by_code` RPC. Idempotent — already-enrolled students
 * are reported as "already".
 *
 * Prerequisite: `node scripts/create-cat531-accounts.mjs` must have been run
 * first (creates the students, institution, course, and join code).
 *
 * Run (PowerShell):
 *   $env:SUPABASE_URL = "https://wvbvexiwyjifatrvdsnv.supabase.co"
 *   $env:SUPABASE_ANON_KEY = "sb_publishable_TlUkIam0ghqeFFgA82DwLA_1NjIQ-XZ"
 *   node scripts/enroll-cat531-class.mjs
 *
 * Run (bash / git-bash):
 *   export SUPABASE_URL="https://wvbvexiwyjifatrvdsnv.supabase.co"
 *   export SUPABASE_ANON_KEY="sb_publishable_TlUkIam0ghqeFFgA82DwLA_1NjIQ-XZ"
 *   node scripts/enroll-cat531-class.mjs
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Missing SUPABASE_URL / SUPABASE_ANON_KEY");
  process.exit(1);
}

const JOIN_CODE = "UA-CAT100-SUMMER26";

// TODO: keep this roster IDENTICAL to STUDENT_NAMES in create-cat100-accounts.mjs.
const STUDENT_NAMES = [
  // "First Last",
];

const alnum = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const lastName = (s) => alnum(s.trim().split(/\s+/).slice(-1)[0]);

const students = STUDENT_NAMES.map((name) => ({
  email: `${alnum(name)}@cat100.swarm.io`,
  password: `cat100-${lastName(name)}`,
  displayName: name,
}));

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
  console.log(`Enrolling ${students.length} CAT 100 students into ${JOIN_CODE}`);
  for (const student of students) {
    try {
      const res = await enrollOne(student);
      const status = res?.already_member ? "already" : "enrolled";
      console.log(`  ✓ ${status.padEnd(9)} ${student.email.padEnd(28)} ${student.displayName}`);
    } catch (err) {
      console.error(`  ✗ failed    ${student.email}  — ${err.message || err}`);
    }
  }
  console.log("Done.");
})();
