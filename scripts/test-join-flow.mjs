/**
 * End-to-end test: simulate what the app does when a student signs in
 * and enters the join code `W200-LIT`.
 *
 * Flow mirrors app.js:
 *   1. signInWithPassword(iuclass1 / classiu1)
 *   2. ensureSupabaseProfile() — upsert profile row
 *   3. joinCourseWithCodeRemote("W200-LIT") —
 *        - look up course by join_code
 *        - insert into course_memberships with section
 *   4. Verify the membership landed for Hyojung's W200 course
 *
 * Run:
 *   export SUPABASE_URL="https://wvbvexiwyjifatrvdsnv.supabase.co"
 *   export SUPABASE_ANON_KEY="<paste anon key from supabase-config.js>"
 *   node scripts/test-join-flow.mjs
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY env.");
  process.exit(1);
}

const EMAIL = "iuclass1@swarm.io";
const PASSWORD = "classiu1";
const JOIN_CODE = "W200-LIT";
const SECTION = "8748";

const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function main() {
  // 1. Sign in
  console.log(`1. Sign in as ${EMAIL}`);
  const { data: authData, error: authErr } = await client.auth.signInWithPassword({
    email: EMAIL,
    password: PASSWORD,
  });
  if (authErr) throw new Error(`Sign-in failed: ${authErr.message}`);
  const userId = authData.user.id;
  console.log(`   ✓ userId=${userId}`);

  // 2. Upsert profile (mirrors ensureSupabaseProfile)
  console.log(`2. Upsert profile row`);
  const { error: profErr } = await client.from("profiles").upsert(
    { id: userId, full_name: "IU Class 1" },
    { onConflict: "id" }
  );
  if (profErr) throw new Error(`Profile upsert failed: ${profErr.message}`);
  console.log(`   ✓ profiles row ready`);

  // 3. Look up course by join_code via RPC (mirrors updated joinCourseWithCodeRemote)
  console.log(`3. Look up course by join_code=${JOIN_CODE} (via RPC)`);
  const { data: lookupRows, error: courseErr } = await client
    .rpc("lookup_course_by_join_code", { p_join_code: JOIN_CODE });
  if (courseErr) throw new Error(`Course lookup failed: ${courseErr.message}`);
  const course = Array.isArray(lookupRows) ? lookupRows[0] : lookupRows;
  if (!course) throw new Error(`Course with code ${JOIN_CODE} not found`);
  console.log(`   ✓ ${course.code} · ${course.name} (course_id=${course.id})`);

  // 4. Guard: already enrolled?
  const { data: existing, error: existingErr } = await client
    .from("course_memberships")
    .select("id, course_id, role, status, section")
    .eq("user_id", userId)
    .eq("status", "active");
  if (existingErr) throw new Error(`Existing membership lookup failed: ${existingErr.message}`);
  const sameCourse = (existing || []).find((m) => m.course_id === course.id && m.role === "user");
  if (sameCourse) {
    console.log(`   • Already a member of ${course.code} (section=${sameCourse.section}). Skipping insert.`);
  } else {
    // 5. Enroll via RPC (mirrors updated joinCourseWithCodeRemote)
    console.log(`5. Enroll via RPC (section=${SECTION})`);
    const { data: enrollData, error: insErr } = await client.rpc(
      "enroll_in_course_by_code",
      { p_join_code: JOIN_CODE, p_display_name: "IU Class 1", p_section: SECTION }
    );
    if (insErr) throw new Error(`Enroll RPC failed: ${insErr.message}`);
    console.log(`   ✓ enrolled:`, enrollData);
  }

  // 6. Verify by reading back with same auth
  console.log(`6. Verify via course_memberships SELECT as the signed-in student`);
  const { data: verify, error: verifyErr } = await client
    .from("course_memberships")
    .select("course_id, role, section, display_name, status")
    .eq("user_id", userId);
  if (verifyErr) throw new Error(`Verify failed: ${verifyErr.message}`);
  console.log(`   memberships for ${EMAIL}:`);
  console.table(verify);

  // 7. What published cases can the student see now?
  console.log(`7. Fetch published cases the student can see`);
  const { data: cases, error: caseErr } = await client
    .from("cases")
    .select("id, title, published")
    .eq("course_id", course.id)
    .eq("published", true);
  if (caseErr) throw new Error(`Case fetch failed: ${caseErr.message}`);
  console.log(`   published cases in ${course.code}: ${cases.length}`);
  for (const c of cases) console.log(`     - ${c.title}`);

  await client.auth.signOut();
  console.log(`\n✅ Join flow verified end-to-end for ${EMAIL}.`);
}

main().catch((err) => {
  console.error("✗ Test failed:", err.message || err);
  process.exit(1);
});
