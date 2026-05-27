/**
 * Seed the CAT 531 Module 1 case ("Foundations of CBI: Design Tensions") and
 * PUBLISH it, configured so students are locked to the Case Network view
 * (node interaction only) via board_settings.studentView = "network-only".
 *
 * Topic (from CAT-531 Summer 2026 Module 1 / DTS activity design):
 *   tensions pre-service teachers navigate when integrating computer-based
 *   instruction (CBI) in classrooms — pedagogy, equity, and control trade-offs.
 *   Student deliverable bridges to "Module 1 Assess - Design Tension Rationale".
 *
 * Prerequisite: `node scripts/setup-cat531-course.mjs` (creates the CAT531
 * course this case attaches to). Idempotent — re-running updates the case.
 *
 * Run (PowerShell):
 *   $env:SUPABASE_URL = "https://wvbvexiwyjifatrvdsnv.supabase.co"
 *   $env:SUPABASE_SERVICE_ROLE_KEY = "<paste your service_role key>"
 *   node scripts/seed-cat531-module1-case.mjs
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
const COURSE_CODE = "CAT531";

const CASE_TITLE = "Module 1 · Foundations of CBI: Design Tensions in Classroom Integration";

const CASE = {
  title: CASE_TITLE,
  summary:
    "Pre-service teachers integrating computer-based instruction (CBI) must balance pedagogy, equity, and control. Map the tensions on the network before proposing any redesign.",
  prompt:
    "A school is adopting computer-based instruction across its classrooms. Pre-service teachers are asked to integrate it without losing pedagogical intent, widening equity gaps, or handing instructional control to the system. Where are the design tensions, and which one matters most?",
  // The add-node prompt students see on the Case Network — the "Design Tension
  // Rationale" framing.
  agenda_prompt:
    "Add nodes for the design tensions a pre-service teacher must navigate when integrating computer-based instruction. Cover pedagogy, equity, and control. Then mark the one tension that matters most and write your rationale.",
  learning_goals: [
    "Identify design tensions across pedagogy, equity, and control when integrating CBI.",
    "Explain how one design decision produces ripple effects across teachers, students, IT, and administration.",
    "Build a defensible design rationale grounded in evidence, not preference.",
  ],
  constraints: [
    "Pedagogy vs. automation: CBI pacing can override a teacher's judgment about when to slow down or reteach.",
    "Equity vs. standardization: a uniform tool can widen gaps for learners who need different access (captioning, pace, devices, connectivity).",
    "Control vs. convenience: data flows and adaptive logic shift instructional control toward the platform.",
    "Teacher workload vs. fidelity: keeping CBI pathways pedagogically coherent adds hidden labor.",
    "Evidence vs. adoption pressure: tools are often adopted before evidence of classroom fit is established.",
  ],
  board_settings: {
    agendaPrompt:
      "Add nodes for the design tensions a pre-service teacher must navigate when integrating computer-based instruction. Cover pedagogy, equity, and control. Then mark the one tension that matters most and write your rationale.",
    dueAt: "2026-05-30",
    maxLearnerNodes: 8,
    maxAiExpansionsPerNode: 3,
    layoutMode: "force",
    sharingMode: "cohort",
    studentView: "network-only", // lock students to the Case Network view
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
  console.log(`Seeding CAT 531 Module 1 case on ${SUPABASE_URL}`);

  const institutionId = await findInstitutionId(INSTITUTION_NAME);
  if (!institutionId) {
    console.error(`  ✗ institution "${INSTITUTION_NAME}" not found. Run scripts/setup-cat531-course.mjs first.`);
    process.exit(1);
  }
  const courseId = await findCourseId(institutionId, COURSE_CODE);
  if (!courseId) {
    console.error(`  ✗ course ${COURSE_CODE} not found. Run scripts/setup-cat531-course.mjs first.`);
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

  // Idempotent: update an existing case with the same title, else insert.
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

  console.log("\nStudents who sign in via cat531.html now land on this published case,");
  console.log("locked to the Case Network view (explore + add agenda nodes + annotate).");
  console.log("Done.");
})();
