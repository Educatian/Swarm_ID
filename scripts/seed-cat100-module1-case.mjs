/**
 * Seed the CAT 100 Module 1 case ("Personal Digital Tension Map", DTS lite) and
 * PUBLISH it, with students locked to the Case Network view
 * (board_settings.studentView = "network-only").
 *
 * Topic (from CAT-100 Summer 2026 Module 1 / "Activity C0 — Personal Digital
 * Tension Map (DTS lite)"): tensions in the student's OWN digital life —
 * privacy, attention, AI use, social media. 30-min session; deliverable = a
 * tension-map URL + 100-word reflection that feeds Assignment 1.1 (Digital
 * Footprint discussion). "Instructor configures axes + cohort" — the four axes
 * below are sensible defaults; edit to taste.
 *
 * Prerequisite: `node scripts/setup-cat100-course.mjs` (creates the CAT100
 * course this case attaches to). Idempotent — re-running updates the case.
 *
 * Run (PowerShell):
 *   $env:SUPABASE_URL = "https://wvbvexiwyjifatrvdsnv.supabase.co"
 *   $env:SUPABASE_SERVICE_ROLE_KEY = "<paste your service_role key>"
 *   node scripts/seed-cat100-module1-case.mjs
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
const COURSE_CODE = "CAT100";

const CASE_TITLE = "Module 1 · Personal Digital Tension Map";

const CASE = {
  title: CASE_TITLE,
  summary:
    "Map the tensions you navigate in your own digital life — privacy, attention, AI use, and social media — then pick the one that matters most to you.",
  prompt:
    "Your digital life is full of trade-offs: convenience vs. privacy, connection vs. comparison, AI help vs. doing the work yourself. Map the tensions you actually navigate, then mark the one that matters most — you'll reference it in your Digital Footprint discussion.",
  agenda_prompt:
    "Add nodes for the tensions you navigate in your own digital life (privacy, attention, AI use, social media). Mark the one that matters most to you and note why — this feeds your Assignment 1.1 Digital Footprint discussion.",
  learning_goals: [
    "Identify tensions in your own digital life across privacy, attention, AI use, and social media.",
    "Recognize the trade-offs you make as a digital citizen.",
    "Choose one tension to carry into your Digital Footprint discussion.",
  ],
  constraints: [
    "Privacy vs. convenience: sharing data, location, or contacts for easier or free services.",
    "Attention vs. engagement: notifications, feeds, and autoplay compete for your focus.",
    "AI use vs. authentic effort: where AI help becomes doing the work for you.",
    "Connection vs. comparison: staying connected on social media vs. social comparison and pressure.",
  ],
  board_settings: {
    agendaPrompt:
      "Add nodes for the tensions you navigate in your own digital life (privacy, attention, AI use, social media). Mark the one that matters most to you and note why — this feeds your Assignment 1.1 Digital Footprint discussion.",
    dueAt: "2026-06-01", // CONFIRM: Module 1 (Week 1) close date for CAT100
    maxLearnerNodes: 6, // "lite" — fewer than CAT531
    maxAiExpansionsPerNode: 3,
    layoutMode: "force",
    sharingMode: "private", // personal digital life → private map (instructor admin still reads it)
    studentView: "network-only",
  },
  published: true,
};

async function findInstitutionId(name) {
  const { data, error } = await admin.from("institutions").select("id").eq("name", name).maybeSingle();
  if (error) throw error;
  return data?.id || null;
}

async function findCourseId(institutionId, code) {
  const { data, error } = await admin
    .from("courses").select("id").eq("institution_id", institutionId).eq("code", code).maybeSingle();
  if (error) throw error;
  return data?.id || null;
}

(async () => {
  console.log(`Seeding CAT 100 Module 1 case on ${SUPABASE_URL}`);

  const institutionId = await findInstitutionId(INSTITUTION_NAME);
  if (!institutionId) {
    console.error(`  ✗ institution "${INSTITUTION_NAME}" not found. Run scripts/setup-cat100-course.mjs first.`);
    process.exit(1);
  }
  const courseId = await findCourseId(institutionId, COURSE_CODE);
  if (!courseId) {
    console.error(`  ✗ course ${COURSE_CODE} not found. Run scripts/setup-cat100-course.mjs first.`);
    process.exit(1);
  }
  console.log(`  ✓ course ${COURSE_CODE} (${courseId})`);

  const payload = {
    course_id: courseId,
    title: CASE.title,
    summary: CASE.summary,
    prompt: CASE.prompt,
    agenda_prompt: CASE.agenda_prompt,
    learning_goals: CASE.learning_goals,
    constraints: CASE.constraints,
    board_settings: CASE.board_settings,
    published: CASE.published,
  };

  const { data: existing, error: findErr } = await admin
    .from("cases").select("id").eq("course_id", courseId).eq("title", CASE.title).maybeSingle();
  if (findErr) throw findErr;

  if (existing) {
    const { error } = await admin.from("cases").update(payload).eq("id", existing.id);
    if (error) throw error;
    console.log(`  ✓ case updated   (${existing.id})  published=${CASE.published}  studentView=network-only`);
  } else {
    const { data: created, error } = await admin.from("cases").insert(payload).select("id").single();
    if (error) throw error;
    console.log(`  ✓ case created   (${created.id})  published=${CASE.published}  studentView=network-only`);
  }

  console.log("\nStudents who sign in via cat100.html now land on this published case,");
  console.log("locked to the Case Network view (explore + add their own tension nodes + annotate).");
  console.log("Done.");
})();
