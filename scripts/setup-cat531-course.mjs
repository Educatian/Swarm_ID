/**
 * One-time CAT 531 course setup for the NAME-ONLY (anonymous login) flow used
 * by cat531.html. Creates ONLY what students need to land on a real case:
 *
 *   - Instructor account: jmoon19@ua.edu / cat531-instructor (admin)
 *   - Institution:  University of Alabama
 *   - Course:       CAT 531  (code CAT531, join code UA-CAT531-SUMMER26)
 *   - Instructor admin membership
 *
 * It does NOT create student accounts. Students sign in anonymously through
 * cat531.html (no account provisioning) and self-enroll with join code
 * UA-CAT531-SUMMER26. The instructor then authors + PUBLISHES the Module 1 case from
 * inside the app (sign in as the instructor, create case, paste the brief,
 * publish). Only published cases are visible to students.
 *
 * Idempotent — safe to rerun.
 *
 * Run (PowerShell):
 *   $env:SUPABASE_URL = "https://wvbvexiwyjifatrvdsnv.supabase.co"
 *   $env:SUPABASE_SERVICE_ROLE_KEY = "<paste your service_role key>"
 *   node scripts/setup-cat531-course.mjs
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing env. Export SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running.");
  process.exit(1);
}

const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const INSTITUTION_NAME = "University of Alabama";
const COURSE_NAME = "CAT 531";
const COURSE_CODE = "CAT531";
const JOIN_CODE = "UA-CAT531-SUMMER26"; // must match JOIN_CODE in cat531.html

const INSTRUCTOR = {
  email: "jmoon19@ua.edu",
  password: "cat531-instructor", // change to your own password, then rerun
  name: "Jewoong Moon",
  title: "Instructor",
};

async function upsertInstructor() {
  const metadata = {
    display_name: INSTRUCTOR.name,
    role: "admin",
    cohort: "ua-cat531",
    institution: INSTITUTION_NAME,
    course: COURSE_NAME,
  };
  const { data, error } = await admin.auth.admin.createUser({
    email: INSTRUCTOR.email,
    password: INSTRUCTOR.password,
    email_confirm: true,
    user_metadata: metadata,
  });
  if (error) {
    if (!String(error.message || "").toLowerCase().includes("already")) throw error;
    const { data: list, error: listErr } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (listErr) throw listErr;
    const existing = list.users.find((u) => u.email === INSTRUCTOR.email);
    if (!existing) throw error;
    const { error: updErr } = await admin.auth.admin.updateUserById(existing.id, {
      password: INSTRUCTOR.password,
      email_confirm: true,
      user_metadata: metadata,
    });
    if (updErr) throw updErr;
    return { id: existing.id, status: "updated" };
  }
  return { id: data.user?.id, status: "created" };
}

async function findOrCreateInstitution(name) {
  const { data: existing, error } = await admin.from("institutions").select("*").eq("name", name).maybeSingle();
  if (error) throw error;
  if (existing) return { id: existing.id, status: "exists" };
  const { data: created, error: cErr } = await admin.from("institutions").insert({ name, settings: {} }).select("*").single();
  if (cErr) throw cErr;
  return { id: created.id, status: "created" };
}

async function findOrCreateCourse({ institutionId, code, name, joinCode }) {
  const { data: existing, error } = await admin
    .from("courses").select("*").eq("institution_id", institutionId).eq("code", code).maybeSingle();
  if (error) throw error;
  if (existing) {
    if (existing.join_code !== joinCode || existing.name !== name) {
      const { error: uErr } = await admin.from("courses").update({ join_code: joinCode, name }).eq("id", existing.id);
      if (uErr) throw uErr;
      return { id: existing.id, status: "updated" };
    }
    return { id: existing.id, status: "exists" };
  }
  const { data: created, error: cErr } = await admin
    .from("courses").insert({ institution_id: institutionId, code, name, join_code: joinCode, settings: {} }).select("*").single();
  if (cErr) throw cErr;
  return { id: created.id, status: "created" };
}

async function upsertAdminMembership({ userId, institutionId, courseId }) {
  const { data: existing, error } = await admin
    .from("course_memberships").select("*").eq("user_id", userId).eq("course_id", courseId).maybeSingle();
  if (error) throw error;
  const payload = {
    user_id: userId, institution_id: institutionId, course_id: courseId,
    role: "admin", display_name: INSTRUCTOR.name, title: INSTRUCTOR.title,
    is_primary: true, status: "active",
  };
  if (existing) {
    const { error: uErr } = await admin.from("course_memberships").update(payload).eq("id", existing.id);
    if (uErr) throw uErr;
    return "updated";
  }
  const { error: iErr } = await admin.from("course_memberships").insert(payload);
  if (iErr) throw iErr;
  return "created";
}

(async () => {
  console.log(`Setting up CAT 531 course on ${SUPABASE_URL}`);

  const ins = await upsertInstructor();
  console.log(`  ✓ instructor ${ins.status.padEnd(8)} ${INSTRUCTOR.email}  (${ins.id})`);
  await admin.from("profiles").upsert({ id: ins.id, full_name: INSTRUCTOR.name }, { onConflict: "id" });

  const inst = await findOrCreateInstitution(INSTITUTION_NAME);
  console.log(`  ✓ institution ${inst.status.padEnd(8)} ${INSTITUTION_NAME}  (${inst.id})`);

  const course = await findOrCreateCourse({ institutionId: inst.id, code: COURSE_CODE, name: COURSE_NAME, joinCode: JOIN_CODE });
  console.log(`  ✓ course      ${course.status.padEnd(8)} ${COURSE_CODE} · ${COURSE_NAME}  (${course.id})`);
  console.log(`    join code:  ${JOIN_CODE}`);

  const m = await upsertAdminMembership({ userId: ins.id, institutionId: inst.id, courseId: course.id });
  console.log(`  ✓ membership ${m.padEnd(8)} ${INSTRUCTOR.email} → ${COURSE_CODE} (admin)`);

  console.log("\nNext:");
  console.log("  1. Supabase → Authentication → Sign In / Providers → enable Anonymous Sign-Ins");
  console.log("  2. Sign in to the app as the instructor, create the Module 1 case, paste the brief, PUBLISH it");
  console.log("  3. Share the student link:  <your-deploy>/cat531.html");
  console.log("Done.");
})();
