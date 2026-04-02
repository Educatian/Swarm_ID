"use strict";

const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const engine = require("./engine");

function readJson(name) {
  const file = path.join(__dirname, "fixtures", name);
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function logPass(label) {
  process.stdout.write(`PASS ${label}\n`);
}

function run() {
  const caseInput = readJson("case-input.json");
  const structured = engine.structuredCaseFromDocument({
    ...caseInput,
    now: "Fixture",
  });

  assert.equal(structured.title, caseInput.title);
  assert.ok(structured.learningGoals.length >= 3);
  assert.ok(structured.constraints.some((item) => /Teacher review|Teacher review load/i.test(item)));
  assert.ok(structured.metrics.personalization >= 35);
  assert.ok(structured.metrics.teacherLoad >= 30);
  logPass("structuredCaseFromDocument returns a canonical case");

  const agendaNode = {
    id: "agenda-teacher-visibility",
    title: "Keep teacher feedback visible",
    body: "Students should know how faculty judgment changes the redesign path.",
    stakeholder: "teacher",
  };
  const expansions = engine.generateAgendaExpansions({
    agendaNode,
    activeCase: structured,
    activeStakeholder: "teacher",
    uniqueSeed: "harness",
  });

  assert.ok(expansions.length > 0);
  assert.ok(expansions.length <= structured.boardSettings.maxAiExpansionsPerNode);
  assert.ok(expansions.every((item) => item.sourceAgendaId === agendaNode.id));
  logPass("generateAgendaExpansions respects board settings");

  const cohortCourse = readJson("cohort-course.json");
  const caseId = structured.id;
  const normalizedCourse = {
    learnerRuns: cohortCourse.learnerRuns.map((run) => ({
      ...run,
      caseId,
    })),
  };
  const cohortEntries = engine.buildCohortIssueEntries(
    {
      ...structured,
      id: caseId,
    },
    normalizedCourse
  );

  assert.ok(cohortEntries.length >= 2);
  assert.ok(cohortEntries.some((item) => /Keep teacher feedback visible/.test(item.title)));
  assert.ok(cohortEntries.some((item) => /Design proposal note/.test(item.title)));
  logPass("buildCohortIssueEntries synthesizes repeated learner activity");

  const personalRun = {
    agendaNodes: [agendaNode],
    aiGeneratedNodes: expansions,
    annotations: [
      {
        targetId: "proposal",
        targetLabel: "Design proposal",
        noteType: "question",
        body: "Where is the evidence trail shown to students?",
        visibility: "private",
        stakeholder: "student",
      },
    ],
  };

  const personalGraph = engine.buildGraphSnapshot({
    activeCase: structured,
    activeMapLayer: "personal",
    activeStakeholder: "teacher",
    activeRun: personalRun,
    evidence: structured.evidence,
    timeline: structured.timeline,
    course: normalizedCourse,
  });

  assert.ok(personalGraph.nodes.length > 0);
  assert.ok(personalGraph.links.length > 0);
  assert.ok(personalGraph.issueEntries.some((item) => item.issueType === "agenda"));
  assert.ok(personalGraph.issueEntries.some((item) => item.issueType === "expansion"));
  assert.ok(personalGraph.issueEntries.some((item) => item.issueType === "annotation-question"));
  logPass("buildGraphSnapshot includes learner-layer issues");

  const cohortGraph = engine.buildGraphSnapshot({
    activeCase: structured,
    activeMapLayer: "cohort",
    activeStakeholder: "teacher",
    activeRun: null,
    evidence: structured.evidence,
    timeline: structured.timeline,
    course: normalizedCourse,
  });

  assert.ok(cohortGraph.issueEntries.some((item) => item.issueType === "cohort"));
  assert.ok(cohortGraph.issueEntries.some((item) => item.issueType === "annotation-cluster"));
  logPass("buildGraphSnapshot includes cohort-layer issues");

  process.stdout.write("\nHarness completed successfully.\n");
}

try {
  run();
} catch (error) {
  process.stderr.write(`FAIL ${error.message}\n`);
  if (error.stack) {
    process.stderr.write(`${error.stack}\n`);
  }
  process.exitCode = 1;
}
