/**
 * Seed Dr. Hyeji Jang's Ewha Womans University course on Swarm ID.
 *
 * Creates:
 *   - Instructor account: hyejijang@swarm.id / ewhahyeji
 *   - 6 student accounts: kstudent1..6@swarm.io / classewha1..6
 *   - Institution:  Ewha Womans University
 *   - Course:       교육방법 및 교육공학  (code EDU101, join EWHA-LIT)
 *   - Instructor course_memberships row (role=admin, is_primary=true)
 *
 * Idempotent — rerunning safely upserts accounts and skips existing rows.
 *
 * ---------- Setup ----------
 *   npm i -D @supabase/supabase-js
 *
 * ---------- Run (bash / git-bash) ----------
 *   export SUPABASE_URL="https://wvbvexiwyjifatrvdsnv.supabase.co"
 *   export SUPABASE_SERVICE_ROLE_KEY="<paste your service_role key>"
 *   node scripts/create-ewha-accounts.mjs
 *
 * ---------- Run (PowerShell) ----------
 *   $env:SUPABASE_URL = "https://wvbvexiwyjifatrvdsnv.supabase.co"
 *   $env:SUPABASE_SERVICE_ROLE_KEY = "<paste your service_role key>"
 *   node scripts/create-ewha-accounts.mjs
 *
 * The service_role key lives in Supabase dashboard →
 *   Project Settings → API → Project API keys → "service_role" (secret).
 * NEVER commit it. It bypasses RLS — treat it like a root password.
 *
 * Note on instructor email domain:
 *   The instructor is "hyejijang@swarm.id" (with .id, matching the Swarm ID
 *   project). Students are on @swarm.io (matching IU seed). If this is a
 *   typo and you meant @swarm.io for the instructor too, change INSTRUCTOR.email
 *   below and rerun — upsert is safe.
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

const INSTITUTION_NAME = "Ewha Womans University";
const COURSE_NAME = "교육방법 및 교육공학";
const COURSE_CODE = "EDU101";
const JOIN_CODE = "EWHA-LIT";

const INSTRUCTOR = {
  email: "hyejijang@swarm.id",
  password: "ewhahyeji",
  name: "Dr. Hyeji Jang",
  title: "Instructor",
  role: "admin",
};

const STUDENTS = Array.from({ length: 6 }, (_, i) => {
  const n = i + 1;
  return {
    email: `kstudent${n}@swarm.io`,
    password: `classewha${n}`,
    name: `Ewha Student ${n}`,
  };
});

async function upsertAuthUser({ email, password, name, role }) {
  const metadata = {
    display_name: name,
    role,
    cohort: "ewha-edu101",
    institution: INSTITUTION_NAME,
    course: COURSE_NAME,
  };

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: metadata,
  });

  if (error) {
    if (!String(error.message || "").toLowerCase().includes("already")) {
      throw error;
    }
    // Update the existing account so re-runs sync password + metadata.
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
    return { id: existing.id, status: "updated" };
  }

  return { id: data.user?.id, status: "created" };
}

async function upsertProfile({ id, name }) {
  const { error } = await admin
    .from("profiles")
    .upsert({ id, full_name: name }, { onConflict: "id" });
  if (error) throw error;
}

async function findOrCreateInstitution(name) {
  const { data: existing, error: findErr } = await admin
    .from("institutions")
    .select("*")
    .eq("name", name)
    .maybeSingle();
  if (findErr) throw findErr;
  if (existing) return { id: existing.id, status: "exists" };

  const { data: created, error: createErr } = await admin
    .from("institutions")
    .insert({ name, settings: {} })
    .select("*")
    .single();
  if (createErr) throw createErr;
  return { id: created.id, status: "created" };
}

async function findOrCreateCourse({ institutionId, code, name, joinCode }) {
  const { data: existing, error: findErr } = await admin
    .from("courses")
    .select("*")
    .eq("institution_id", institutionId)
    .eq("code", code)
    .maybeSingle();
  if (findErr) throw findErr;
  if (existing) {
    // Make sure the join_code matches what we expect.
    if (existing.join_code !== joinCode || existing.name !== name) {
      const { error: updErr } = await admin
        .from("courses")
        .update({ join_code: joinCode, name })
        .eq("id", existing.id);
      if (updErr) throw updErr;
      return { id: existing.id, status: "updated" };
    }
    return { id: existing.id, status: "exists" };
  }

  const { data: created, error: createErr } = await admin
    .from("courses")
    .insert({
      institution_id: institutionId,
      code,
      name,
      join_code: joinCode,
      settings: {},
    })
    .select("*")
    .single();
  if (createErr) throw createErr;
  return { id: created.id, status: "created" };
}

async function upsertInstructorMembership({
  userId,
  institutionId,
  courseId,
  displayName,
  title,
}) {
  const { data: existing, error: findErr } = await admin
    .from("course_memberships")
    .select("*")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .maybeSingle();
  if (findErr) throw findErr;

  const payload = {
    user_id: userId,
    institution_id: institutionId,
    course_id: courseId,
    role: "admin",
    display_name: displayName,
    title,
    is_primary: true,
    status: "active",
  };

  if (existing) {
    const { error: updErr } = await admin
      .from("course_memberships")
      .update(payload)
      .eq("id", existing.id);
    if (updErr) throw updErr;
    return "updated";
  }

  const { error: insErr } = await admin.from("course_memberships").insert(payload);
  if (insErr) throw insErr;
  return "created";
}

(async () => {
  console.log(`Seeding Ewha course on ${SUPABASE_URL}`);

  // 1. Instructor account + profile
  console.log("\n— Instructor —");
  const instructorAuth = await upsertAuthUser(INSTRUCTOR);
  console.log(`  ✓ auth ${instructorAuth.status.padEnd(8)} ${INSTRUCTOR.email}  (${instructorAuth.id})`);
  await upsertProfile({ id: instructorAuth.id, name: INSTRUCTOR.name });
  console.log(`  ✓ profile        ${INSTRUCTOR.name}`);

  // 2. Student accounts + profiles
  console.log("\n— Students —");
  for (const student of STUDENTS) {
    try {
      const auth = await upsertAuthUser({ ...student, role: "user" });
      await upsertProfile({ id: auth.id, name: student.name });
      console.log(`  ✓ ${auth.status.padEnd(8)} ${student.email}  (${auth.id})`);
    } catch (err) {
      console.error(`  ✗ failed   ${student.email}  — ${err.message || err}`);
    }
  }

  // 3. Institution + course
  console.log("\n— Institution / course —");
  const inst = await findOrCreateInstitution(INSTITUTION_NAME);
  console.log(`  ✓ institution ${inst.status.padEnd(8)} ${INSTITUTION_NAME}  (${inst.id})`);
  const course = await findOrCreateCourse({
    institutionId: inst.id,
    code: COURSE_CODE,
    name: COURSE_NAME,
    joinCode: JOIN_CODE,
  });
  console.log(`  ✓ course      ${course.status.padEnd(8)} ${COURSE_CODE} · ${COURSE_NAME}  (${course.id})`);
  console.log(`    join code:  ${JOIN_CODE}`);

  // 4. Instructor admin membership
  console.log("\n— Instructor membership —");
  const membershipStatus = await upsertInstructorMembership({
    userId: instructorAuth.id,
    institutionId: inst.id,
    courseId: course.id,
    displayName: INSTRUCTOR.name,
    title: INSTRUCTOR.title,
  });
  console.log(`  ✓ membership ${membershipStatus.padEnd(8)} ${INSTRUCTOR.email} → ${COURSE_CODE} (admin)`);

  console.log("\nNext step: run  `node scripts/enroll-ewha-class.mjs`  to enroll the 6 students.");
  console.log("Done.");
})();
