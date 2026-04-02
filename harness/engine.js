"use strict";

const stakeholders = {
  teacher: {
    label: "Teacher",
    icon: "school",
    status: "Needs attention",
    summary:
      "The teaching lens sees immediate pressure on facilitation time, formative feedback quality, and the practical overhead required to keep AI-generated pathways pedagogically coherent.",
  },
  administrator: {
    label: "Administrator",
    icon: "corporate_fare",
    status: "Looking stable",
    summary:
      "The administrator lens cares about adoption, policy fit, and whether the design can scale across sections without producing uneven implementation quality.",
  },
  student: {
    label: "Student",
    icon: "person",
    status: "Mixed signals",
    summary:
      "The student lens responds to relevance and feedback speed, but also questions whether automation compresses agency or obscures why a redesign choice matters.",
  },
  it: {
    label: "IT Systems",
    icon: "terminal",
    status: "At risk",
    summary:
      "The IT lens tracks interoperability, data movement, vendor dependencies, and whether the design can survive the realities of campus systems and support capacity.",
  },
  accessibility: {
    label: "Accessibility",
    icon: "universal_local",
    status: "Needs review",
    summary:
      "The accessibility lens focuses on modality parity, cognitive load, transparency, and whether personalization logic preserves equitable participation.",
  },
};

const stakeholderKeywordMap = {
  teacher: ["teacher", "instructor", "faculty", "feedback", "grading", "moderation", "review"],
  administrator: ["administrator", "admin", "program", "policy", "scale", "adoption", "institution"],
  student: ["student", "learner", "agency", "choice", "engagement", "motivation", "reflection"],
  it: ["it", "lms", "integration", "platform", "system", "api", "data", "telemetry", "vendor"],
  accessibility: ["accessibility", "screen", "caption", "alt text", "equity", "udl", "wcag", "parity"],
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function asObject(value, fallback = {}) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : fallback;
}

function safeClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);
}

function defaultBoardSettings(overrides = {}) {
  return {
    agendaPrompt: "Identify the most important instructional tension before redesigning.",
    dueAt: "",
    maxLearnerNodes: 6,
    maxAiExpansionsPerNode: 3,
    layoutMode: "force",
    sharingMode: "cohort",
    ...overrides,
  };
}

function getCaseStakeholderMeta(key, activeCase = {}) {
  const base = stakeholders[key] || stakeholders.teacher;
  const overrides = asObject(activeCase?.stakeholderProfiles?.[key]);
  return {
    ...base,
    ...overrides,
    label: overrides.label || base.label,
    icon: overrides.icon || base.icon,
    status: overrides.status || base.status,
    summary: overrides.summary || base.summary,
  };
}

function extractKeywordBuckets(text) {
  const normalized = String(text || "").toLowerCase();
  return {
    teacher: /(teacher|instructor|faculty|grading|feedback|moderation)/.test(normalized),
    administrator: /(administrator|dean|program|policy|adoption|scale|compliance)/.test(normalized),
    student: /(student|learner|motivation|agency|engagement)/.test(normalized),
    it: /(lms|integration|data|system|vendor|api|telemetry|privacy)/.test(normalized),
    accessibility: /(accessibility|screen reader|caption|alt text|equity|udl|wcag)/.test(normalized),
  };
}

function deriveMetricsFromText(text) {
  const normalized = String(text || "").toLowerCase();
  const keywordCounts = {
    personalization: (normalized.match(/personal|adaptive|tailor|pathway/g) || []).length,
    teacherLoad: (normalized.match(/teacher|instructor|grading|review|moderation|workload/g) || []).length,
    privacy: (normalized.match(/privacy|data|telemetry|policy|compliance|governance/g) || []).length,
    accessibility: (normalized.match(/access|caption|alt text|screen reader|equity|udl/g) || []).length,
  };
  return {
    personalization: clamp(54 + keywordCounts.personalization * 8, 35, 95),
    teacherLoad: clamp(42 + keywordCounts.teacherLoad * 7, 30, 92),
    privacy: clamp(46 + keywordCounts.privacy * 7, 32, 95),
    accessibility: clamp(40 + keywordCounts.accessibility * 9, 28, 96),
  };
}

function inferStakeholderFromText(text = "", fallback = "teacher") {
  const normalized = String(text || "").toLowerCase();
  let bestStakeholder = fallback || "teacher";
  let bestScore = 0;

  Object.entries(stakeholderKeywordMap).forEach(([stakeholderKey, tokens]) => {
    const score = tokens.reduce((total, token) => total + (normalized.includes(token) ? 1 : 0), 0);
    if (score > bestScore) {
      bestScore = score;
      bestStakeholder = stakeholderKey;
    }
  });

  return bestStakeholder;
}

function structuredCaseFromDocument({ title, text, publish = true, now = "Now" }) {
  const cleanText = String(text || "").trim();
  const sentences = cleanText
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
  const keywords = extractKeywordBuckets(cleanText);
  const metrics = deriveMetricsFromText(cleanText);
  const goals = [
    "Surface stakeholder tensions before committing to a redesign direction.",
    "Make trade-offs visible across pedagogy, governance, and implementation burden.",
    "Support memo writing with evidence rather than intuition alone.",
  ];
  const constraints = [
    metrics.teacherLoad > 66 ? "Teacher review load must stay within realistic weekly capacity" : "Teacher review remains in the loop",
    keywords.accessibility ? "Accessibility evidence is required before publication" : "Accessibility check required",
    keywords.it ? "Institutional data and LMS integration must stay auditable" : "System fit must be documented",
    "Students must be able to explain why a recommendation was made",
  ];
  const evidence = sentences.slice(0, 4).map((sentence, index) => {
    const stakeholderOrder = ["teacher", "student", "administrator", "it", "accessibility"];
    const stakeholder = stakeholderOrder[index % stakeholderOrder.length];
    return {
      stakeholder,
      title: `${stakeholders[stakeholder].label} evidence ${index + 1}`,
      body: sentence,
    };
  });
  const timeline = [
    "Uploaded source document parsed into issue fragments and design signals.",
    "Ontology-like stakeholder and constraint structure extracted from the uploaded brief.",
    "Graph and report state synchronized to the latest published case.",
  ];
  const prominentStakeholders = Object.entries(keywords)
    .filter(([, present]) => present)
    .map(([key]) => stakeholders[key].label);

  return {
    id: `case-${slugify(title)}-fixture`,
    title,
    summary:
      prominentStakeholders.length > 0
        ? `Structured from uploaded brief with emphasis on ${prominentStakeholders.join(", ")}.`
        : "Structured from uploaded brief and ready for graph, simulation, and memo generation.",
    prompt: sentences[0] || cleanText.slice(0, 280),
    learningGoals: goals,
    constraints,
    metrics,
    evidence,
    decisions: [
      {
        stamp: now,
        title: "Case structured from upload",
        body: "The admin intake pipeline converted the uploaded document into a canonical case record for graph rendering and report generation.",
      },
    ],
    chat: [
      {
        role: "agent",
        stakeholder: "teacher",
        body: "The uploaded brief has been structured. The next useful move is to test which stakeholder tension dominates before publishing to learners.",
      },
    ],
    timeline,
    stakeholderProfiles: {},
    matrixInsights: [],
    sandboxFeed: [],
    reflectionPrompts: [],
    networkMeta: [],
    uiCopy: {},
    boardSettings: defaultBoardSettings(),
    pipeline: {
      ontologyStatus: "Structured from upload",
      graphStatus: "Case map ready",
      simulationStatus: "Question prompts ready",
      reportStatus: publish ? "Published to learner side" : "Admin draft only",
    },
    published: publish,
  };
}

function getVisibleLearnerRunsForCase(activeCase, course) {
  if (!activeCase || !course) return [];
  return asArray(course.learnerRuns).filter((run) => run.caseId === activeCase.id);
}

function buildCohortIssueEntries(activeCase, course) {
  const runs = getVisibleLearnerRunsForCase(activeCase, course);
  const agendaBuckets = new Map();
  const annotationBuckets = new Map();

  runs.forEach((run) => {
    asArray(run.agendaNodes).forEach((item) => {
      const key = slugify(item.title || item.body || "agenda");
      if (!agendaBuckets.has(key)) {
        agendaBuckets.set(key, {
          title: item.title || "Shared agenda",
          bodies: [],
          count: 0,
          stakeholder: item.stakeholder || "student",
        });
      }
      const bucket = agendaBuckets.get(key);
      bucket.count += 1;
      if (item.body) bucket.bodies.push(item.body);
    });

    asArray(run.annotations)
      .filter((item) => item.visibility === "cohort")
      .forEach((item) => {
        const key = `${item.targetId || slugify(item.targetLabel || "target")}-${item.noteType || "note"}`;
        if (!annotationBuckets.has(key)) {
          annotationBuckets.set(key, {
            title: item.targetLabel || "Shared note",
            noteType: item.noteType || "note",
            bodies: [],
            count: 0,
            stakeholder: inferStakeholderFromText(`${item.targetLabel || ""} ${item.body || ""}`, "student"),
          });
        }
        const bucket = annotationBuckets.get(key);
        bucket.count += 1;
        if (item.body) bucket.bodies.push(item.body);
      });
  });

  const cohortEntries = [];
  [...agendaBuckets.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .forEach((bucket, index) => {
      cohortEntries.push({
        issueType: "cohort",
        title: `${bucket.title} (${bucket.count})`,
        body: bucket.bodies[0] || `${bucket.count} students raised this as a shared agenda.`,
        stakeholder: bucket.stakeholder || inferStakeholderFromText(bucket.title, index % 2 === 0 ? "student" : "teacher"),
      });
    });

  [...annotationBuckets.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .forEach((bucket) => {
      cohortEntries.push({
        issueType: "annotation-cluster",
        title: `${bucket.title} note (${bucket.count})`,
        body: bucket.bodies[0] || `${bucket.count} shared notes were attached to this part of the case.`,
        stakeholder: bucket.stakeholder,
      });
    });

  return cohortEntries;
}

function graphToneForValue(value, reverse = false) {
  const score = reverse ? 100 - value : value;
  if (score >= 68) return "ok";
  if (score >= 48) return "primary";
  return "danger";
}

function graphToneForStakeholder(stakeholderKey, metrics) {
  const { personalization, teacherLoad, privacy, accessibility } = metrics;
  const feasibility = Math.round(
    clamp(
      (100 - teacherLoad) * 0.38 + privacy * 0.24 + accessibility * 0.2 + (100 - Math.max(personalization - 90, 0) * 2) * 0.18,
      0,
      100
    )
  );
  const map = {
    teacher: teacherLoad,
    administrator: feasibility,
    student: Math.round((accessibility + clamp(100 - Math.max(personalization - 55, 0), 22, 100)) / 2),
    it: privacy,
    accessibility,
  };
  const value = map[stakeholderKey] ?? 58;
  return stakeholderKey === "teacher" ? graphToneForValue(value, true) : graphToneForValue(value);
}

function graphToneForIssue(issueType, stakeholderKey, metrics, evidenceCount) {
  if (issueType === "constraint") {
    return stakeholderKey === "teacher"
      ? graphToneForValue(metrics.teacherLoad, true)
      : stakeholderKey === "it" || stakeholderKey === "administrator"
        ? graphToneForValue(metrics.privacy)
        : stakeholderKey === "accessibility"
          ? graphToneForValue(metrics.accessibility)
          : "primary";
  }
  if (issueType === "evidence") {
    return evidenceCount >= 3 ? "ok" : "primary";
  }
  if (issueType === "goal") {
    return graphToneForValue(metrics.personalization);
  }
  return graphToneForStakeholder(stakeholderKey, metrics);
}

function buildCaseIssueEntries({
  activeCase,
  activeMapLayer = "base",
  activeStakeholder = "teacher",
  activeRun = null,
  evidence = [],
  timeline = [],
  course = null,
}) {
  const issueEntries = [];
  const goals = asArray(activeCase?.learningGoals).slice(0, 3);
  const constraints = asArray(activeCase?.constraints).slice(0, 4);
  const visibleEvidence = asArray(evidence).slice(0, 4);
  const visibleTimeline = asArray(timeline).slice(0, 2);
  const boardSettings = defaultBoardSettings(asObject(activeCase?.boardSettings));
  const agendaNodes = activeMapLayer === "personal" ? asArray(activeRun?.agendaNodes).slice(0, boardSettings.maxLearnerNodes) : [];
  const aiGeneratedNodes =
    activeMapLayer === "personal"
      ? asArray(activeRun?.aiGeneratedNodes).slice(0, boardSettings.maxLearnerNodes * boardSettings.maxAiExpansionsPerNode)
      : [];
  const annotations =
    activeMapLayer === "personal" ? asArray(activeRun?.annotations).slice(0, boardSettings.maxLearnerNodes * 2) : [];
  const cohortEntries = activeMapLayer === "cohort" ? buildCohortIssueEntries(activeCase, course) : [];

  goals.forEach((goal, index) => {
    issueEntries.push({
      issueType: "goal",
      title: `Goal ${index + 1}`,
      body: goal,
      stakeholder: inferStakeholderFromText(goal, index === 0 ? "student" : activeStakeholder),
    });
  });

  constraints.forEach((constraint, index) => {
    issueEntries.push({
      issueType: "constraint",
      title: `Constraint ${index + 1}`,
      body: constraint,
      stakeholder: inferStakeholderFromText(constraint, index === 0 ? "teacher" : activeStakeholder),
    });
  });

  visibleEvidence.forEach((item, index) => {
    const title = item.title || `Evidence ${index + 1}`;
    const body = item.body || title;
    issueEntries.push({
      issueType: "evidence",
      title,
      body,
      stakeholder: item.stakeholder || inferStakeholderFromText(`${title} ${body}`, activeStakeholder),
    });
  });

  visibleTimeline.forEach((step, index) => {
    issueEntries.push({
      issueType: "timeline",
      title: `Process step ${index + 1}`,
      body: step,
      stakeholder: inferStakeholderFromText(step, activeStakeholder),
    });
  });

  agendaNodes.forEach((item, index) => {
    issueEntries.push({
      issueType: "agenda",
      title: item.title || `Agenda ${index + 1}`,
      body: item.body || item.title || "Learner agenda",
      stakeholder: item.stakeholder || inferStakeholderFromText(`${item.title || ""} ${item.body || ""}`, "student"),
    });
  });

  aiGeneratedNodes.forEach((item, index) => {
    issueEntries.push({
      issueType: "expansion",
      title: item.title || `AI issue ${index + 1}`,
      body: item.body || item.title || "Related issue",
      stakeholder: item.stakeholder || inferStakeholderFromText(`${item.title || ""} ${item.body || ""}`, activeStakeholder),
    });
  });

  annotations.forEach((item, index) => {
    issueEntries.push({
      issueType: item.noteType === "question" ? "annotation-question" : "annotation",
      title: item.targetLabel ? `${item.targetLabel} note ${index + 1}` : `Note ${index + 1}`,
      body: item.body || "Learner note",
      stakeholder: inferStakeholderFromText(`${item.targetLabel || ""} ${item.body || ""}`, item.stakeholder || "student"),
    });
  });

  cohortEntries.forEach((item) => issueEntries.push(item));

  if (!issueEntries.length && activeCase?.summary) {
    issueEntries.push({
      issueType: "summary",
      title: "Case summary",
      body: activeCase.summary,
      stakeholder: inferStakeholderFromText(activeCase.summary, activeStakeholder),
    });
  }

  return issueEntries;
}

function buildGraphSnapshot({
  activeCase,
  activeMapLayer = "base",
  activeStakeholder = "teacher",
  activeRun = null,
  evidence = [],
  timeline = [],
  course = null,
}) {
  const issueEntries = buildCaseIssueEntries({
    activeCase,
    activeMapLayer,
    activeStakeholder,
    activeRun,
    evidence,
    timeline,
    course,
  });
  const metrics = asObject(activeCase?.metrics, {
    personalization: 60,
    teacherLoad: 50,
    privacy: 60,
    accessibility: 60,
  });
  const activeStakeholders = new Set([activeStakeholder]);
  issueEntries.forEach((entry) => activeStakeholders.add(entry.stakeholder));

  const stakeholderNodes = [...activeStakeholders]
    .filter((stakeholderKey) => stakeholders[stakeholderKey])
    .map((stakeholderKey) => {
      const meta = getCaseStakeholderMeta(stakeholderKey, activeCase);
      const linkedCount = issueEntries.filter((entry) => entry.stakeholder === stakeholderKey).length;
      return {
        id: stakeholderKey,
        label: meta.label,
        kind: "stakeholder",
        stakeholder: stakeholderKey,
        tone: graphToneForStakeholder(stakeholderKey, metrics),
        icon: meta.icon,
        meta: linkedCount ? `${linkedCount} issues` : meta.status.toLowerCase(),
        detail: meta.summary,
      };
    });

  const issueCountByStakeholder = {};
  issueEntries.forEach((entry) => {
    issueCountByStakeholder[entry.stakeholder] = (issueCountByStakeholder[entry.stakeholder] || 0) + 1;
  });

  const issueProgressByStakeholder = {};
  const signalNodes = issueEntries.map((entry, index) => {
    const clusterSlot = issueProgressByStakeholder[entry.stakeholder] || 0;
    issueProgressByStakeholder[entry.stakeholder] = clusterSlot + 1;
    const idBase = slugify(`${entry.issueType}-${entry.title}`) || `issue-${index + 1}`;
    return {
      id: `${idBase}-${index + 1}`,
      label: entry.title,
      kind: "signal",
      stakeholder: entry.stakeholder,
      tone: graphToneForIssue(entry.issueType, entry.stakeholder, metrics, evidence.length),
      issueType: entry.issueType,
      detail: entry.body,
      clusterSlot,
      clusterTotal: issueCountByStakeholder[entry.stakeholder],
    };
  });

  const nodes = [...stakeholderNodes, ...signalNodes];
  const links = [];

  stakeholderNodes.forEach((node) => {
    links.push({ source: "proposal", target: node.id, tone: node.tone, weight: 2.6, kind: "stakeholder" });
  });

  signalNodes.forEach((node) => {
    links.push({
      source: node.stakeholder,
      target: node.id,
      tone: node.tone,
      weight: node.issueType === "constraint" ? 2.1 : 1.7,
      kind: "issue",
    });
  });

  return { nodes, links, issueEntries };
}

function generateAgendaExpansions({
  agendaNode,
  activeCase,
  activeStakeholder = "teacher",
  nowLabel = "Now",
  uniqueSeed = "fixture",
}) {
  const baseText = `${agendaNode.title || ""} ${agendaNode.body || ""}`;
  const primaryStakeholder = inferStakeholderFromText(baseText, agendaNode.stakeholder || activeStakeholder);
  const boardSettings = defaultBoardSettings(asObject(activeCase?.boardSettings));
  const relatedStakeholders = Array.from(
    new Set([primaryStakeholder, activeStakeholder, inferStakeholderFromText(activeCase?.summary || "", "teacher")])
  ).filter((key) => stakeholders[key]);

  return relatedStakeholders.slice(0, boardSettings.maxAiExpansionsPerNode).map((stakeholderKey, index) => {
    const stakeholderMeta = getCaseStakeholderMeta(stakeholderKey, activeCase);
    const constraint = asArray(activeCase?.constraints)[index] || activeCase?.summary || "Design constraint";
    return {
      id: `ai-${slugify(agendaNode.title)}-${uniqueSeed}-${index + 1}`,
      title:
        index === 0
          ? `${stakeholderMeta.label} concern`
          : index === 1
            ? `${stakeholderMeta.label} response`
            : `${stakeholderMeta.label} follow-up`,
      body:
        index === 0
          ? `${stakeholderMeta.label} may see this agenda as a pressure point because ${String(constraint).toLowerCase()}.`
          : index === 1
            ? `${stakeholderMeta.label} would likely ask for clearer evidence before this direction is adopted.`
            : `${stakeholderMeta.label} introduces a related design tension that should be checked before the case moves forward.`,
      stakeholder: stakeholderKey,
      sourceAgendaId: agendaNode.id,
      createdAt: nowLabel,
    };
  });
}

module.exports = {
  stakeholders,
  clamp,
  asArray,
  asObject,
  safeClone,
  slugify,
  defaultBoardSettings,
  getCaseStakeholderMeta,
  extractKeywordBuckets,
  deriveMetricsFromText,
  inferStakeholderFromText,
  structuredCaseFromDocument,
  buildCohortIssueEntries,
  buildCaseIssueEntries,
  buildGraphSnapshot,
  generateAgendaExpansions,
};
