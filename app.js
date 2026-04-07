const viewMeta = {
  visualizer: {
    title: "Case Network",
    description: "See the people, constraints, and tensions around one case in one place.",
  },
  perspectives: {
    title: "Perspectives",
    description: "Read the case from one point of view at a time before changing the design.",
  },
  matrix: {
    title: "Trade-offs",
    description: "See which parts of the design move together when one condition changes.",
  },
  sandbox: {
    title: "Test Changes",
    description: "Try a scenario change and see which parts of the case become less stable.",
  },
  report: {
    title: "Report",
    description: "Turn the case analysis into a summary, evidence trail, and reflection draft.",
  },
};

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

const emptyMetrics = {
  personalization: 0,
  teacherLoad: 0,
  privacy: 0,
  accessibility: 0,
};

const legacyDemoIds = new Set([
  "inst-northstar",
  "course-id-studio",
  "case-personalized-pathways",
  "instructor-rivera",
  "learner-maya-cho",
]);

const state = {
  activeView: "visualizer",
  activeStakeholder: "teacher",
  activeMapLayer: "base",
  activeRole: "admin",
  activeInstitutionId: "",
  activeCourseId: "",
  activeCaseId: "",
  activeInstructorId: "",
  activeLearnerId: "",
  metrics: { ...emptyMetrics },
  autonomousIteration: true,
  evidence: [],
  decisions: [],
  chat: [],
  timeline: [],
  graph: {
    iteration: 0,
    auto: true,
    nodes: [],
    links: [],
    events: [],
  },
  selectedGraphNodeId: "",
  platform: {
    institutions: [],
  },
  auth: {
    source: "none",
    ready: false,
    loading: false,
    configured: false,
    sessionEmail: "",
    userId: "",
    remoteRole: "",
    message: "",
  },
  ai: {
    provider: "gemini",
    configured: false,
    model: "gemini-2.5-flash",
    busy: false,
    status: "Gemini will use the app endpoint when available, or fall back to local logic.",
    lastError: "",
  },
};

const STORAGE_KEY = "swarm-id-platform-v2";
const SESSION_STORAGE_KEY = "swarm-id-session-v1";
const TUTORIAL_STORAGE_KEY = "swarm-id-tutorial-v1";
const PLATFORM_ADMIN_EMAIL = "admin@swarm.io";
const DEFAULT_SUPABASE_CONFIG = window.SUPABASE_CONFIG || { url: "", anonKey: "" };
const DEFAULT_GEMINI_CONFIG = window.GEMINI_CONFIG || { apiKey: "", model: "gemini-2.5-flash" };
const tutorialState = {
  active: false,
  stepIndex: 0,
  steps: [],
  target: null,
  seenByRole: {},
};
function createLearnerRunScaffold(caseRecord, learner) {
  return {
    id: `run-${caseRecord.id}-${learner.id}`,
    caseId: caseRecord.id,
    learnerId: learner.id,
    learnerName: learner.name,
    learnerFocus: learner.focus,
    status: "Private workspace started",
    metrics: { ...caseRecord.metrics },
    evidence: [],
    decisions: [],
    chat: [],
    timeline: [`${learner.name} opened a private workspace from the published instructor case.`],
    agendaNodes: [],
    aiGeneratedNodes: [],
    annotations: [],
  };
}

function normalizeCourseData(course) {
  const nextCourse = course;
  nextCourse.joinCode = nextCourse.joinCode || "";
  nextCourse.documents = Array.isArray(nextCourse.documents) ? nextCourse.documents : [];
  nextCourse.cases = (Array.isArray(nextCourse.cases) ? nextCourse.cases : []).map((item) => ({
    ...item,
    boardSettings: defaultBoardSettings(asObject(item.boardSettings)),
  }));
  nextCourse.instructors =
    Array.isArray(nextCourse.instructors) && nextCourse.instructors.length
      ? nextCourse.instructors
      : [];
  nextCourse.publishedCaseIds = Array.isArray(nextCourse.publishedCaseIds)
    ? nextCourse.publishedCaseIds
    : nextCourse.cases.filter((item) => item.published).map((item) => item.id);
  nextCourse.learners =
    Array.isArray(nextCourse.learners) && nextCourse.learners.length
      ? nextCourse.learners
      : [];
  nextCourse.learnerRuns = (Array.isArray(nextCourse.learnerRuns) ? nextCourse.learnerRuns : []).map((run) => ({
    ...run,
    agendaNodes: asArray(run.agendaNodes),
    aiGeneratedNodes: asArray(run.aiGeneratedNodes),
    annotations: asArray(run.annotations),
  }));

  return nextCourse;
}

function normalizePlatformState(platform) {
  const nextPlatform = safeClone(platform);
  nextPlatform.institutions = (nextPlatform.institutions || [])
    .filter((institution) => !legacyDemoIds.has(institution.id))
    .map((institution) => ({
      ...institution,
      courses: (institution.courses || [])
        .filter((course) => !legacyDemoIds.has(course.id))
        .map((course) => {
          const nextCourse = normalizeCourseData(course);
          nextCourse.cases = nextCourse.cases.filter((item) => !legacyDemoIds.has(item.id));
          nextCourse.instructors = nextCourse.instructors.filter((item) => !legacyDemoIds.has(item.id));
          nextCourse.learners = nextCourse.learners.filter((item) => !legacyDemoIds.has(item.id));
          nextCourse.publishedCaseIds = nextCourse.publishedCaseIds.filter((caseId) => !legacyDemoIds.has(caseId));
          nextCourse.documents = nextCourse.documents.filter((document) => !legacyDemoIds.has(document.caseId));
          nextCourse.learnerRuns = nextCourse.learnerRuns.filter(
            (run) => !legacyDemoIds.has(run.caseId) && !legacyDemoIds.has(run.learnerId)
          );
          return nextCourse;
        }),
    }));
  return nextPlatform;
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function asObject(value, fallback = {}) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : fallback;
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

function buildRemotePlatform({
  institutions = [],
  courses = [],
  memberships = [],
  allCourseMemberships = [],
  cases = [],
  documents = [],
  learnerRuns = [],
}) {
  const membershipIndex = new Map(allCourseMemberships.map((membership) => [membership.id, membership]));
  memberships.forEach((membership) => {
    if (!membershipIndex.has(membership.id)) {
      membershipIndex.set(membership.id, membership);
    }
  });
  const courseMemberships = [...membershipIndex.values()];

  return normalizePlatformState({
    institutions: institutions.map((institution) => {
      const institutionCourses = courses.filter((course) => course.institution_id === institution.id);
      return {
        id: institution.id,
        name: institution.name,
        settings: asObject(institution.settings),
        courses: institutionCourses.map((course) => {
          const coursePeople = courseMemberships.filter((membership) => membership.course_id === course.id);
          const courseCases = cases
            .filter((caseRow) => caseRow.course_id === course.id)
            .map((caseRow) => ({
              id: caseRow.id,
              title: caseRow.title,
              summary: caseRow.summary || "",
              prompt: caseRow.prompt || "",
              learningGoals: asArray(caseRow.learning_goals),
              constraints: asArray(caseRow.constraints),
              metrics: asObject(
                caseRow.metrics,
                deriveMetricsFromText(
                  [
                    caseRow.title,
                    caseRow.summary,
                    caseRow.prompt,
                    ...asArray(caseRow.learning_goals),
                    ...asArray(caseRow.constraints),
                  ]
                    .filter(Boolean)
                    .join(" ")
                )
              ),
              evidence: asArray(caseRow.evidence),
              decisions: asArray(caseRow.decisions),
              chat: asArray(caseRow.chat),
              timeline: asArray(caseRow.timeline),
              stakeholderProfiles: asObject(caseRow.stakeholder_profiles),
              matrixInsights: asArray(caseRow.matrix_insights),
              sandboxFeed: asArray(caseRow.sandbox_feed),
              reflectionPrompts: asArray(caseRow.reflection_prompts),
              networkMeta: asArray(caseRow.network_meta),
              uiCopy: asObject(caseRow.ui_copy),
              boardSettings: defaultBoardSettings(asObject(caseRow.board_settings)),
              pipeline: asObject(caseRow.pipeline, {
                ontologyStatus: "Structured",
                graphStatus: "Case map ready",
                simulationStatus: "Question prompts ready",
                reportStatus: caseRow.published ? "Published to learner side" : "Instructor draft",
              }),
              published: Boolean(caseRow.published),
            }));

          return {
            id: course.id,
            name: course.name,
            code: course.code,
              joinCode: course.join_code || "",
            publishedCaseIds: courseCases.filter((item) => item.published).map((item) => item.id),
            settings: asObject(course.settings),
            instructors: coursePeople
              .filter((membership) => membership.role === "admin")
              .map((membership) => ({
                id: membership.user_id,
                name: membership.display_name || membership.full_name || "Instructor",
                title: membership.title || "Course instructor",
                courseId: course.id,
              })),
            learners: coursePeople
              .filter((membership) => membership.role === "user")
              .map((membership) => ({
                id: membership.user_id,
                name: membership.display_name || membership.full_name || "Student",
                focus: membership.focus || "Reflection run",
                section: membership.section || course.code,
                courseId: course.id,
              })),
            learnerRuns: learnerRuns
              .filter((run) => {
                const caseRecord = courseCases.find((item) => item.id === run.case_id);
                return Boolean(caseRecord);
              })
              .map((run) => ({
                id: run.id,
                caseId: run.case_id,
                learnerId: run.learner_id,
                learnerName: run.learner_name || "Student",
                learnerFocus: run.learner_focus || "Reflection run",
                status: run.status || "Learner workspace updated",
                metrics: asObject(run.metrics),
                evidence: asArray(run.evidence),
                decisions: asArray(run.decisions),
                chat: asArray(run.chat),
                timeline: asArray(run.timeline),
                agendaNodes: asArray(run.agenda_nodes),
                aiGeneratedNodes: asArray(run.ai_generated_nodes),
                annotations: asArray(run.annotations),
                updatedAt: run.updated_at || "",
              })),
            documents: documents
              .filter((document) => document.course_id === course.id)
              .map((document) => ({
                id: document.id,
                title: document.title,
                kind: document.kind || "uploaded-brief",
                uploadedAt: document.uploaded_at || "",
                published: Boolean(document.published),
                text: document.text || "",
                caseId: document.case_id || "",
              })),
            cases: courseCases,
          };
        }),
      };
    }),
  });
}

function isSupabaseSessionActive() {
  return state.auth.source === "supabase" && Boolean(state.auth.userId);
}

function serializeCaseForSupabase(caseRecord, courseId) {
  return {
    course_id: courseId,
    title: caseRecord.title,
    summary: caseRecord.summary || "",
    prompt: caseRecord.prompt || "",
    agenda_prompt: getCaseBoardSettings(caseRecord).agendaPrompt || "",
    submission_deadline: getCaseBoardSettings(caseRecord).dueAt
      ? new Date(`${getCaseBoardSettings(caseRecord).dueAt}T23:59:00Z`).toISOString()
      : null,
    learning_goals: asArray(caseRecord.learningGoals),
    constraints: asArray(caseRecord.constraints),
    metrics: asObject(caseRecord.metrics),
    evidence: asArray(caseRecord.evidence),
    decisions: asArray(caseRecord.decisions),
    chat: asArray(caseRecord.chat),
    timeline: asArray(caseRecord.timeline),
    stakeholder_profiles: asObject(caseRecord.stakeholderProfiles),
    matrix_insights: asArray(caseRecord.matrixInsights),
    sandbox_feed: asArray(caseRecord.sandboxFeed),
    reflection_prompts: asArray(caseRecord.reflectionPrompts),
    network_meta: asArray(caseRecord.networkMeta),
    ui_copy: asObject(caseRecord.uiCopy),
    board_settings: asObject(caseRecord.boardSettings),
    pipeline: asObject(caseRecord.pipeline),
    published: Boolean(caseRecord.published),
  };
}

function serializeDocumentForSupabase(documentRecord, courseId, caseId) {
  return {
    course_id: courseId,
    case_id: caseId,
    title: documentRecord.title,
    kind: documentRecord.kind || "uploaded-brief",
    text: documentRecord.text || "",
    published: Boolean(documentRecord.published),
    uploaded_at: documentRecord.uploadedAt || new Date().toISOString().slice(0, 10),
  };
}

function serializeLearnerRunForSupabase(runRecord, caseId = state.activeCaseId, learnerId = state.activeLearnerId) {
  return {
    case_id: caseId,
    learner_id: learnerId,
    learner_name: runRecord.learnerName || "",
    learner_focus: runRecord.learnerFocus || "",
    status: runRecord.status || "Learner workspace updated",
    metrics: asObject(runRecord.metrics),
    evidence: asArray(runRecord.evidence),
    decisions: asArray(runRecord.decisions),
    chat: asArray(runRecord.chat),
    timeline: asArray(runRecord.timeline),
    agenda_nodes: asArray(runRecord.agendaNodes),
    ai_generated_nodes: asArray(runRecord.aiGeneratedNodes),
    annotations: asArray(runRecord.annotations),
  };
}

function getAuthDisplayName() {
  const email = state.auth.sessionEmail || "";
  const local = email.split("@")[0] || "Instructor";
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function isPlatformAdminAccount(email = state.auth.sessionEmail) {
  return String(email || "").trim().toLowerCase() === PLATFORM_ADMIN_EMAIL;
}

async function refreshRemotePlatformContext(preferredCaseId = "") {
  if (!isSupabaseSessionActive()) return;
  const context = await fetchSupabaseContext(state.auth.userId);
  applyRemoteSessionContext(context, {
    id: state.auth.userId,
    email: state.auth.sessionEmail,
  });
  if (preferredCaseId) {
    state.activeCaseId = preferredCaseId;
    syncActiveCaseState();
  }
}

async function ensureSupabaseProfile(user = { id: state.auth.userId, email: state.auth.sessionEmail }) {
  const client = initializeSupabase();
  if (!client || !user?.id) return;
  const fallbackName = getAuthDisplayName() || String(user.email || "").split("@")[0] || "User";
  const { error } = await client.from("profiles").upsert(
    {
      id: user.id,
      full_name: fallbackName,
    },
    { onConflict: "id" }
  );
  if (error) throw error;
}

async function syncCaseToSupabase(caseRecord, courseId = getActiveCourse()?.id) {
  if (!isSupabaseSessionActive() || !caseRecord || !courseId) return;
  const client = initializeSupabase();
  if (!client) throw new Error("Login is not ready yet.");
  const { error } = await client
    .from("cases")
    .update(serializeCaseForSupabase(caseRecord, courseId))
    .eq("id", caseRecord.id);
  if (error) throw error;
}

async function syncLearnerRunToSupabase(runRecord, caseId = state.activeCaseId, learnerId = state.activeLearnerId) {
  if (!isSupabaseSessionActive() || !runRecord || !caseId || !learnerId) return;
  const client = initializeSupabase();
  if (!client) throw new Error("Login is not ready yet.");
  const { data, error } = await client
    .from("learner_runs")
    .upsert(serializeLearnerRunForSupabase(runRecord, caseId, learnerId), {
      onConflict: "case_id,learner_id",
    })
    .select("*")
    .single();
  if (error) throw error;
  if (data?.id) {
    runRecord.id = data.id;
  }
}

async function createInstitutionInSupabase(name) {
  const client = initializeSupabase();
  if (!client) throw new Error("Login is not ready yet.");
  const institutionName = String(name || "").trim();
  if (!institutionName) throw new Error("Add an institution name first.");
  await ensureSupabaseProfile();

  const { data: institution, error: institutionError } = await client
    .from("institutions")
    .insert({ name: institutionName, settings: {} })
    .select("*")
    .single();
  if (institutionError) throw institutionError;

  const starterCode = "NEW-100";
  const { data: course, error: courseError } = await client
    .from("courses")
    .insert({
      institution_id: institution.id,
      code: starterCode,
      name: "New Course",
      join_code: buildJoinCode(starterCode),
      settings: {},
    })
    .select("*")
    .single();
  if (courseError) throw courseError;

  const { error: membershipError } = await client.from("course_memberships").insert({
    user_id: state.auth.userId,
    institution_id: institution.id,
    course_id: course.id,
    role: "admin",
    display_name: getAuthDisplayName(),
    title: "Instructor",
    is_primary: true,
    status: "active",
  });
  if (membershipError) throw membershipError;

  await refreshRemotePlatformContext();
  state.activeInstitutionId = institution.id;
  state.activeCourseId = course.id;
  state.activeCaseId = "";
}

async function createCourseInSupabase(name, code) {
  const client = initializeSupabase();
  const institution = getActiveInstitution();
  if (!client) throw new Error("Login is not ready yet.");
  if (!institution) throw new Error("Create or select an institution first.");
  await ensureSupabaseProfile();
  const courseName = String(name || "").trim();
  const courseCode = String(code || "").trim();
  if (!courseName || !courseCode) {
    throw new Error("Add a course name and code first.");
  }

  const { data: course, error: courseError } = await client
    .from("courses")
    .insert({
      institution_id: institution.id,
      code: courseCode,
      name: courseName,
      join_code: buildJoinCode(courseCode || courseName),
      settings: {},
    })
    .select("*")
    .single();
  if (courseError) throw courseError;

  const { error: membershipError } = await client.from("course_memberships").insert({
    user_id: state.auth.userId,
    institution_id: institution.id,
    course_id: course.id,
    role: "admin",
    display_name: getAuthDisplayName(),
    title: "Instructor",
    is_primary: true,
    status: "active",
  });
  if (membershipError) throw membershipError;

  await refreshRemotePlatformContext();
  state.activeInstitutionId = institution.id;
  state.activeCourseId = course.id;
  state.activeCaseId = "";
}

async function fetchSupabaseContext(userId) {
  const client = initializeSupabase();
  if (!client) {
    throw new Error("Login is not ready yet.");
  }

  const profileQuery = client.from("profiles").select("*").eq("id", userId).maybeSingle();
  const membershipQuery = client
    .from("course_memberships")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .order("is_primary", { ascending: false });

  const [{ data: profile, error: profileError }, { data: memberships, error: membershipError }] = await Promise.all([
    profileQuery,
    membershipQuery,
  ]);

  if (profileError) throw profileError;
  if (membershipError) throw membershipError;
  if (!memberships || memberships.length === 0) {
    return {
      profile: profile || null,
      primaryMembership: null,
      platform: normalizePlatformState({ institutions: [] }),
    };
  }

  const primaryMembership =
    memberships.find((membership) => membership.is_primary) ||
    memberships.find((membership) => membership.role === "admin") ||
    memberships[0];
  const courseIds = [...new Set(memberships.map((membership) => membership.course_id))];
  const institutionIds = [...new Set(memberships.map((membership) => membership.institution_id).filter(Boolean))];

  const [
    { data: courseRows, error: courseError },
    { data: institutionRows, error: institutionError },
    { data: allCourseMemberships, error: allMembershipError },
    { data: caseRows, error: caseError },
    { data: documentRows, error: documentError },
  ] = await Promise.all([
    client.from("courses").select("*").in("id", courseIds),
    client.from("institutions").select("*").in("id", institutionIds),
    client.from("course_memberships").select("*").in("course_id", courseIds).eq("status", "active"),
    client.from("cases").select("*").in("course_id", courseIds),
    client.from("documents").select("*").in("course_id", courseIds),
  ]);

  if (courseError) throw courseError;
  if (institutionError) throw institutionError;
  if (allMembershipError) throw allMembershipError;
  if (caseError) throw caseError;
  if (documentError) throw documentError;

  const caseIds = (caseRows || []).map((caseRow) => caseRow.id);
  let resolvedLearnerRuns = [];
  if (caseIds.length) {
    const { data, error } = await client.from("learner_runs").select("*").in("case_id", caseIds);
    if (error) throw error;
    resolvedLearnerRuns = data || [];
  }

  return {
    profile: profile || null,
    primaryMembership,
    platform: buildRemotePlatform({
      institutions: institutionRows || [],
      courses: courseRows || [],
      memberships: memberships || [],
      allCourseMemberships: allCourseMemberships || [],
      cases: caseRows || [],
      documents: documentRows || [],
      learnerRuns: resolvedLearnerRuns,
    }),
  };
}

function applyRemoteSessionContext({ profile, primaryMembership, platform }, sessionUser) {
  state.platform = platform;
  state.activeRole = primaryMembership?.role || (isPlatformAdminAccount(sessionUser?.email) ? "admin" : "user");
  state.activeInstitutionId = primaryMembership?.institution_id || "";
  state.activeCourseId = primaryMembership?.course_id || "";
  state.activeInstructorId = primaryMembership?.role === "admin" ? primaryMembership.user_id : "";
  state.activeLearnerId = primaryMembership?.role === "user" ? primaryMembership.user_id : "";
  state.activeCaseId = "";
  state.auth = {
    ...state.auth,
    source: "supabase",
    ready: true,
    configured: true,
    loading: false,
    userId: sessionUser.id,
    sessionEmail: sessionUser.email || "",
    remoteRole: primaryMembership?.role || "",
    message: primaryMembership
      ? profile?.full_name || profile?.name || "Signed in"
      : "Signed in",
  };
  ensureActiveSelections();
  syncActiveCaseState();
  persistSessionState();
}

async function signInWithSupabase(email, password) {
  const client = initializeSupabase();
  if (!client) {
    throw new Error("Login is not ready yet.");
  }
  state.auth.loading = true;
  state.auth.message = "Signing in...";
  renderLandingLogin();

  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw error;
  const sessionUser = data?.user;
  if (!sessionUser) {
    throw new Error("No profile was found for this account.");
  }
  await ensureSupabaseProfile(sessionUser);
  const context = await fetchSupabaseContext(sessionUser.id);
  applyRemoteSessionContext(context, sessionUser);
  return context;
}

async function updateSignedInProfileName(fullName) {
  const client = initializeSupabase();
  const nextName = String(fullName || "").trim();
  if (!client || !state.auth.userId || !nextName) return;
  const { error } = await client
    .from("profiles")
    .update({ full_name: nextName })
    .eq("id", state.auth.userId);
  if (error) throw error;
}

async function joinCourseWithCodeRemote(joinCode) {
  const client = initializeSupabase();
  if (!client) throw new Error("Login is not ready yet.");
  if (!state.auth.userId) throw new Error("Sign in first.");
  const normalizedCode = String(joinCode || "").trim().toUpperCase();
  if (!normalizedCode) {
    throw new Error("Enter a course code first.");
  }

  const { data: course, error: courseError } = await client
    .from("courses")
    .select("id, institution_id, code, name, join_code")
    .eq("join_code", normalizedCode)
    .maybeSingle();
  if (courseError) throw courseError;
  if (!course) {
    throw new Error("That course code was not found.");
  }

  const membershipPayload = {
    user_id: state.auth.userId,
    institution_id: course.institution_id,
    course_id: course.id,
    role: "user",
    display_name: getAuthDisplayName(),
    is_primary: true,
    status: "active",
  };

  const { error: membershipError } = await client
    .from("course_memberships")
    .upsert(membershipPayload, { onConflict: "user_id,course_id" });
  if (membershipError) {
    if (membershipError.code === "23505") {
      throw new Error("This student account is already linked to another active course.");
    }
    throw membershipError;
  }

  await refreshRemotePlatformContext();
  state.activeRole = "user";
  state.auth.message = `Joined ${course.code}.`;
  ensureActiveSelections();
  persistSessionState();
  return course;
}

async function restoreSupabaseSession() {
  const client = initializeSupabase();
  if (!client) return false;
  try {
    const { data: sessionData } = await client.auth.getSession();
    if (!sessionData?.session?.user) {
      return false;
    }
    const context = await fetchSupabaseContext(sessionData.session.user.id);
    applyRemoteSessionContext(context, sessionData.session.user);
    return true;
  } catch (error) {
    state.auth.message = error.message || "Session restore failed.";
    return false;
  }
}

async function signOutSupabaseIfNeeded() {
  if (state.auth.source !== "supabase") return;
  const client = initializeSupabase();
  if (!client) return;
  await client.auth.signOut();
}

const seedPlatform = { institutions: [] };

const dom = {
  landingShell: document.getElementById("landing-shell"),
  appShell: document.getElementById("app-shell"),
  landingEnterButtons: [
    document.getElementById("landing-enter-button"),
    document.getElementById("landing-cta-primary"),
    document.getElementById("landing-footer-enter"),
  ].filter(Boolean),
  landingNetworkAnchor: document.getElementById("landing-network-anchor"),
  landingNetwork: document.getElementById("landing-network"),
  landingLoginCard: document.getElementById("landing-login-card"),
  landingLoginForm: document.getElementById("landing-login-form"),
  landingLoginEmail: document.getElementById("landing-login-email"),
  landingLoginPassword: document.getElementById("landing-login-password"),
  landingLoginHelper: document.getElementById("landing-login-helper"),
  landingAuthStatus: document.getElementById("landing-auth-status"),
  landingJoinForm: document.getElementById("landing-join-form"),
  landingJoinEmail: document.getElementById("landing-join-email"),
  landingJoinPassword: document.getElementById("landing-join-password"),
  landingJoinCode: document.getElementById("landing-join-code"),
  landingJoinHelper: document.getElementById("landing-join-helper"),
  viewButtons: [...document.querySelectorAll("[data-view]")],
  viewPanels: [...document.querySelectorAll("[data-view-panel]")],
  roleControl: document.getElementById("role-control"),
  roleSelect: document.getElementById("role-select"),
  institutionSelect: document.getElementById("institution-select"),
  courseSelect: document.getElementById("course-select"),
  caseControl: document.getElementById("case-control"),
  caseControlLabel: document.getElementById("case-control-label"),
  caseSelect: document.getElementById("case-select"),
  learnerControl: document.getElementById("learner-control"),
  learnerSelect: document.getElementById("learner-select"),
  sessionIdentityLabel: document.getElementById("session-identity-label"),
  startTutorialButton: document.getElementById("start-tutorial"),
  returnToLanding: document.getElementById("return-to-landing"),
  visualizerLayout: document.getElementById("visualizer-layout"),
  intakeTitle: document.getElementById("intake-title"),
  intakeBadge: document.getElementById("intake-badge"),
  workflowGuide: document.getElementById("workflow-guide"),
  platformContext: document.getElementById("platform-context"),
  pipelineConsole: document.getElementById("pipeline-console"),
  caseSummaryLabel: document.getElementById("case-summary-label"),
  sidebarCaseControl: document.getElementById("sidebar-case-control"),
  sidebarCaseLabel: document.getElementById("sidebar-case-label"),
  sidebarCaseSelect: document.getElementById("sidebar-case-select"),
  caseTitle: document.getElementById("case-title"),
  caseSubtitle: document.getElementById("case-subtitle"),
  topKicker: document.getElementById("top-kicker"),
  topTitle: document.getElementById("view-title"),
  sidebarTensionLabel: document.getElementById("sidebar-tension-label"),
  sidebarTension: document.getElementById("sidebar-tension"),
  sidebarTensionFill: document.getElementById("sidebar-tension-fill"),
  healthFill: document.getElementById("health-fill"),
  healthCopy: document.getElementById("health-copy"),
  activeStakeholderPill: document.getElementById("active-stakeholder-pill"),
  activeStakeholderStatus: document.getElementById("active-stakeholder-status"),
  networkStage: document.getElementById("network-stage"),
  networkSvg: document.getElementById("network-svg"),
  networkEmptyPreview: document.getElementById("network-empty-preview"),
  networkTooltip: document.getElementById("network-tooltip"),
  networkTooltipKicker: document.getElementById("network-tooltip-kicker"),
  networkTooltipTitle: document.getElementById("network-tooltip-title"),
  networkTooltipBody: document.getElementById("network-tooltip-body"),
  mapLayerControl: document.getElementById("map-layer-control"),
  mapLayerSelect: document.getElementById("map-layer-select"),
  stageNoteKicker: document.getElementById("stage-note-kicker"),
  stageNoteTitle: document.getElementById("stage-note-title"),
  stageNoteBody: document.getElementById("stage-note-body"),
  networkMetaGrid: document.getElementById("network-meta-grid"),
  visualizerInput: document.getElementById("visualizer-input"),
  graphCycle: document.getElementById("graph-cycle"),
  graphEvents: document.getElementById("graph-events"),
  lensName: document.getElementById("lens-name"),
  lensSummary: document.getElementById("lens-summary"),
  lensStatus: document.getElementById("lens-status"),
  lensScore: document.getElementById("lens-score"),
  topTensions: document.getElementById("top-tensions"),
  evidenceStrip: document.getElementById("evidence-strip"),
  stakeholderPills: document.getElementById("stakeholder-pills"),
  perspectiveStakeholderPills: document.getElementById("perspective-stakeholder-pills"),
  selectedNodeKicker: document.getElementById("selected-node-kicker"),
  selectedNodeTitle: document.getElementById("selected-node-title"),
  selectedNodeCopy: document.getElementById("selected-node-copy"),
  quickAnnotationForm: document.getElementById("quick-annotation-form"),
  quickAnnotationSubmit: document.getElementById("quick-annotation-submit"),
  perspectiveConflicts: document.getElementById("perspective-conflicts"),
  orbitTitle: document.getElementById("orbit-title"),
  orbitIcon: document.getElementById("orbit-icon"),
  orbitSummary: document.getElementById("orbit-summary"),
  chatBadge: document.getElementById("chat-badge"),
  chatThread: document.getElementById("chat-thread"),
  metricBars: document.getElementById("metric-bars"),
  radarFill: document.getElementById("radar-fill"),
  decisionLog: document.getElementById("decision-log"),
  matrixInsights: document.getElementById("matrix-insights"),
  matrixState: document.getElementById("matrix-state"),
  cohesionScore: document.getElementById("cohesion-score"),
  cognitiveLoad: document.getElementById("cognitive-load"),
  inferenceLag: document.getElementById("inference-lag"),
  reactionFeed: document.getElementById("reaction-feed"),
  simulationState: document.getElementById("simulation-state"),
  reportSummary: document.getElementById("report-summary"),
  reportTensions: document.getElementById("report-tensions"),
  reportRecommendations: document.getElementById("report-recommendations"),
  reportEvidence: document.getElementById("report-evidence"),
  rubricList: document.getElementById("rubric-list"),
  reflectionPrompts: document.getElementById("reflection-prompts"),
  reflectionFeed: document.getElementById("reflection-feed"),
  reflectionBadge: document.getElementById("reflection-badge"),
  tourOverlay: document.getElementById("tour-overlay"),
  tourCard: document.getElementById("tour-card"),
  tourStepLabel: document.getElementById("tour-step-label"),
  tourTitle: document.getElementById("tour-title"),
  tourBody: document.getElementById("tour-body"),
  tourBack: document.getElementById("tour-back"),
  tourNext: document.getElementById("tour-next"),
  tourSkip: document.getElementById("tour-skip"),
  constraintTokens: document.getElementById("constraint-tokens"),
  metricInputs: {
    personalization: document.getElementById("personalization-range"),
    teacherLoad: document.getElementById("teacher-load-range"),
    privacy: document.getElementById("privacy-range"),
    accessibility: document.getElementById("accessibility-range"),
  },
  metricLabels: {
    personalization: document.getElementById("personalization-value"),
    teacherLoad: document.getElementById("teacher-load-value"),
    privacy: document.getElementById("privacy-value"),
    accessibility: document.getElementById("accessibility-value"),
  },
};

const tonePalette = {
  primary: "#97a9ff",
  danger: "#ff716b",
  ok: "#00efa0",
  neutral: "#a6acb8",
  shell: "#f5f7fb",
};

const graphRenderer = {
  initialized: false,
  svg: null,
  root: null,
  linkLayer: null,
  nodeLayer: null,
  simulation: null,
  zoom: null,
  width: 0,
  height: 0,
};

const landingRenderer = {
  initialized: false,
  svg: null,
  root: null,
  linkLayer: null,
  nodeLayer: null,
  simulation: null,
  width: 0,
  height: 0,
};

let supabaseClient = null;
let lastGraphSignature = "";

function safeClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function readStoredSession() {
  try {
    return JSON.parse(window.localStorage.getItem(SESSION_STORAGE_KEY) || "{}");
  } catch (error) {
    return {};
  }
}

function persistSessionState() {
  window.localStorage.setItem(
    SESSION_STORAGE_KEY,
    JSON.stringify({
      activeRole: state.activeRole,
      activeMapLayer: state.activeMapLayer,
      activeInstitutionId: state.activeInstitutionId,
      activeCourseId: state.activeCourseId,
      activeCaseId: state.activeCaseId,
      activeInstructorId: state.activeInstructorId,
      activeLearnerId: state.activeLearnerId,
      auth: state.auth,
    })
  );
}

function hydrateSessionState() {
  const stored = readStoredSession();
  if (!stored || typeof stored !== "object") return;
  state.activeRole = stored.activeRole || state.activeRole;
  state.activeMapLayer = stored.activeMapLayer || state.activeMapLayer;
  state.activeInstitutionId = stored.activeInstitutionId || state.activeInstitutionId;
  state.activeCourseId = stored.activeCourseId || state.activeCourseId;
  state.activeCaseId = stored.activeCaseId || state.activeCaseId;
  state.activeInstructorId = stored.activeInstructorId || state.activeInstructorId;
  state.activeLearnerId = stored.activeLearnerId || state.activeLearnerId;
  if (stored.auth && typeof stored.auth === "object") {
    state.auth = { ...state.auth, ...stored.auth };
  }
}

function hydrateTutorialState() {
  try {
    tutorialState.seenByRole = JSON.parse(window.localStorage.getItem(TUTORIAL_STORAGE_KEY) || "{}");
  } catch (error) {
    tutorialState.seenByRole = {};
  }
}

function persistTutorialState() {
  window.localStorage.setItem(TUTORIAL_STORAGE_KEY, JSON.stringify(tutorialState.seenByRole));
}

function initializeSupabase() {
  const hasClient = Boolean(window.supabase && typeof window.supabase.createClient === "function");
  const hasConfig = Boolean(DEFAULT_SUPABASE_CONFIG.url && DEFAULT_SUPABASE_CONFIG.anonKey);
  state.auth.configured = hasClient && hasConfig;
  if (!state.auth.configured) {
    state.auth.source = "none";
    if (!state.auth.loading) {
      state.auth.message = "";
    }
    return null;
  }

  if (!supabaseClient) {
    supabaseClient = window.supabase.createClient(DEFAULT_SUPABASE_CONFIG.url, DEFAULT_SUPABASE_CONFIG.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  state.auth.ready = true;
  if (!state.auth.loading && !state.auth.userId && state.auth.source !== "supabase") {
    state.auth.message = "";
  }
  return supabaseClient;
}

function loadPlatformState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return normalizePlatformState(seedPlatform);
    }
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.institutions)) {
      return normalizePlatformState(seedPlatform);
    }
    return normalizePlatformState(parsed);
  } catch (error) {
    return normalizePlatformState(seedPlatform);
  }
}

function createEmptyCourseTemplate({ id, name, code, joinCode = "" }) {
  return {
    id,
    name,
    code,
    joinCode,
    publishedCaseIds: [],
    settings: {
      learnerVisibility: "Published cases only",
      evidenceRule: "One evidence note per case",
      reportMode: "Shared memo + reflection",
    },
    instructors: [],
    learners: [],
    learnerRuns: [],
    documents: [],
    cases: [],
  };
}

function persistPlatformState() {
  state.platform = normalizePlatformState(state.platform);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.platform));
  persistSessionState();
}

function getInstitutionById(institutionId) {
  return state.platform.institutions.find((institution) => institution.id === institutionId) || null;
}

function getActiveInstitution() {
  return getInstitutionById(state.activeInstitutionId) || state.platform.institutions[0] || null;
}

function getCourseById(courseId, institution = getActiveInstitution()) {
  if (!institution) return null;
  return institution.courses.find((course) => course.id === courseId) || null;
}

function getActiveCourse() {
  return getCourseById(state.activeCourseId) || getActiveInstitution()?.courses?.[0] || null;
}

function getInstructors(course = getActiveCourse()) {
  return Array.isArray(course?.instructors) ? course.instructors : [];
}

function getInstructorById(instructorId, course = getActiveCourse()) {
  return getInstructors(course).find((instructor) => instructor.id === instructorId) || null;
}

function getActiveInstructor() {
  return getInstructorById(state.activeInstructorId) || getInstructors()[0] || null;
}

function getLearners(course = getActiveCourse()) {
  return Array.isArray(course?.learners) ? course.learners : [];
}

function getLearnerById(learnerId, course = getActiveCourse()) {
  return getLearners(course).find((learner) => learner.id === learnerId) || null;
}

function getActiveLearner() {
  return getLearnerById(state.activeLearnerId) || getLearners()[0] || null;
}

function getCaseById(caseId, course = getActiveCourse()) {
  if (!course) return null;
  return course.cases.find((item) => item.id === caseId) || null;
}

function getLearnerRun(caseId = state.activeCaseId, learnerId = state.activeLearnerId, course = getActiveCourse()) {
  if (!course || !Array.isArray(course.learnerRuns)) return null;
  return (
    course.learnerRuns.find((run) => run.caseId === caseId && run.learnerId === learnerId) || null
  );
}

function getOrCreateLearnerRun(caseId = state.activeCaseId, learnerId = state.activeLearnerId, course = getActiveCourse()) {
  const caseRecord = getCaseById(caseId, course);
  const learner = getLearnerById(learnerId, course);
  if (!course || !caseRecord || !learner) return null;

  let run = getLearnerRun(caseId, learnerId, course);
  if (!run) {
    run = createLearnerRunScaffold(caseRecord, learner);
    course.learnerRuns.push(run);
    persistPlatformState();
  }
  return run;
}

function getActiveLearnerRun() {
  return getOrCreateLearnerRun();
}

function getIdentityOptionsForRole(role, course = getActiveCourse()) {
  return role === "admin" ? getInstructors(course) : getLearners(course);
}

function getActiveCaseRecord(course = getActiveCourse()) {
  return getCaseById(state.activeCaseId, course);
}

function getActiveWorkspaceRecord(course = getActiveCourse()) {
  const activeCase = getActiveCaseRecord(course);
  if (!activeCase) return null;
  if (state.activeRole === "admin") return activeCase;
  if (state.activeMapLayer === "personal") {
    return getOrCreateLearnerRun(activeCase.id, state.activeLearnerId, course) || activeCase;
  }
  return activeCase;
}

function getCaseBoardSettings(caseRecord = getActiveCaseRecord()) {
  return defaultBoardSettings(asObject(caseRecord?.boardSettings));
}

function getCaseUiCopy() {
  const activeCase = getActiveCaseRecord();
  return asObject(activeCase?.uiCopy);
}

function getCaseStakeholderMeta(key) {
  const activeCase = getActiveCaseRecord();
  const base = stakeholders[key];
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

function getCaseMatrixInsights(fallback) {
  const activeCase = getActiveCaseRecord();
  return asArray(activeCase?.matrixInsights).length ? activeCase.matrixInsights : fallback;
}

function getCaseSandboxFeed(fallback) {
  const activeCase = getActiveCaseRecord();
  return asArray(activeCase?.sandboxFeed).length ? activeCase.sandboxFeed : fallback;
}

function getCaseReflectionPrompts(fallback) {
  const activeCase = getActiveCaseRecord();
  return asArray(activeCase?.reflectionPrompts).length ? activeCase.reflectionPrompts : fallback;
}

function getCaseNetworkMeta(fallback) {
  const activeCase = getActiveCaseRecord();
  return asArray(activeCase?.networkMeta).length ? activeCase.networkMeta : fallback;
}

function getVisibleCases(course = getActiveCourse()) {
  if (!course) return [];
  if (state.activeRole === "admin") {
    return course.cases;
  }
  return course.cases.filter((item) => item.published);
}

function getSelectableCases(course = getActiveCourse()) {
  if (!course) return [];
  return state.activeRole === "admin" ? asArray(course.cases) : getVisibleCases(course);
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);
}

function buildJoinCode(seed = "") {
  const base = String(seed || "COURSE").replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 6) || "COURSE";
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${base}-${suffix}`;
}

function getAllowedMapLayers(caseRecord = getActiveCaseRecord()) {
  const settings = getCaseBoardSettings(caseRecord);
  const layers = [{ value: "base", label: "Base map" }];
  if (state.activeRole === "user") {
    layers.push({ value: "personal", label: "My view" });
  }
  if (settings.sharingMode !== "private") {
    layers.push({ value: "cohort", label: "Class view" });
  }
  return layers;
}

function ensureActiveSelections() {
  const institution = getActiveInstitution() || state.platform.institutions[0] || null;
  if (!institution) {
    return;
  }
  state.activeInstitutionId = institution.id;

  const course = getCourseById(state.activeCourseId, institution) || institution.courses[0] || null;
  if (!course) {
    return;
  }
  state.activeCourseId = course.id;
  normalizeCourseData(course);

  const instructors = getInstructors(course);
  const currentInstructor = getInstructorById(state.activeInstructorId, course) || instructors[0] || null;
  state.activeInstructorId = currentInstructor?.id || "";

  const learners = getLearners(course);
  const currentLearner = getLearnerById(state.activeLearnerId, course) || learners[0] || null;
  state.activeLearnerId = currentLearner?.id || "";

  const selectableCases = getSelectableCases(course);
  const visibleCases = getVisibleCases(course);
  const fallbackCase = selectableCases[0] || visibleCases[0] || course.cases[0] || null;
  const currentCase = getCaseById(state.activeCaseId, course);
  if (!currentCase || (state.activeRole === "user" && !currentCase.published)) {
    state.activeCaseId = fallbackCase ? fallbackCase.id : "";
  }
  if (state.activeRole === "user" && state.activeView === "sandbox") {
    state.activeView = "visualizer";
  }
  const allowedMapLayers = getAllowedMapLayers(getCaseById(state.activeCaseId, course));
  if (!allowedMapLayers.find((item) => item.value === state.activeMapLayer)) {
    state.activeMapLayer = state.activeRole === "user" ? "personal" : "base";
    if (!allowedMapLayers.find((item) => item.value === state.activeMapLayer)) {
      state.activeMapLayer = allowedMapLayers[0]?.value || "base";
    }
  }
}

function extractKeywordBuckets(text) {
  const normalized = text.toLowerCase();
  return {
    teacher: /(teacher|instructor|faculty|grading|feedback|moderation)/.test(normalized),
    administrator: /(administrator|dean|program|policy|adoption|scale|compliance)/.test(normalized),
    student: /(student|learner|motivation|agency|engagement)/.test(normalized),
    it: /(lms|integration|data|system|vendor|api|telemetry|privacy)/.test(normalized),
    accessibility: /(accessibility|screen reader|caption|alt text|equity|udl|wcag)/.test(normalized),
  };
}

function deriveMetricsFromText(text) {
  const normalized = text.toLowerCase();
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

function getGeminiConfig() {
  return {
    apiKey: String(window.GEMINI_CONFIG?.apiKey || DEFAULT_GEMINI_CONFIG.apiKey || "").trim(),
    model:
      String(window.GEMINI_CONFIG?.model || DEFAULT_GEMINI_CONFIG.model || "gemini-2.5-flash").trim() ||
      "gemini-2.5-flash",
  };
}

function isGeminiConfigured() {
  return Boolean(getGeminiConfig().apiKey);
}

function extractJsonCandidate(text) {
  const direct = String(text || "").trim();
  if (!direct) return "";
  if (direct.startsWith("{") || direct.startsWith("[")) return direct;
  const fencedMatch = direct.match(/```json\s*([\s\S]*?)```/i) || direct.match(/```\s*([\s\S]*?)```/i);
  if (fencedMatch?.[1]) return fencedMatch[1].trim();
  const firstBrace = direct.indexOf("{");
  const lastBrace = direct.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return direct.slice(firstBrace, lastBrace + 1).trim();
  }
  return direct;
}

function normalizeStringList(value, fallback = []) {
  const items = asArray(value)
    .map((item) => String(item || "").trim())
    .filter(Boolean);
  return items.length ? items : fallback;
}

function normalizeStakeholderKey(value, fallback = "teacher") {
  const candidate = String(value || "").trim().toLowerCase();
  if (stakeholders[candidate]) return candidate;
  return inferStakeholderFromText(candidate, fallback);
}

function normalizeEvidenceList(value, fallback = []) {
  const items = asArray(value)
    .map((item, index) => {
      const evidence = asObject(item);
      const body = String(evidence.body || "").trim();
      if (!body) return null;
      return {
        stakeholder: normalizeStakeholderKey(
          evidence.stakeholder,
          ["teacher", "student", "administrator", "it", "accessibility"][index % 5]
        ),
        title: String(evidence.title || `Evidence ${index + 1}`).trim(),
        body,
      };
    })
    .filter(Boolean);
  return items.length ? items : fallback;
}

function normalizeSimpleCardList(value, fallback = []) {
  const items = asArray(value)
    .map((item) => {
      const entry = asObject(item);
      const title = String(entry.title || "").trim();
      const body = String(entry.body || "").trim();
      if (!title || !body) return null;
      return { title, body };
    })
    .filter(Boolean);
  return items.length ? items : fallback;
}

function normalizeValueCardList(value, fallback = []) {
  const items = asArray(value)
    .map((item) => {
      const entry = asObject(item);
      const label = String(entry.label || entry.title || "").trim();
      const valueText = String(entry.value || entry.body || "").trim();
      const note = String(entry.note || "").trim();
      if (!label || !valueText) return null;
      return note ? { label, value: valueText, note } : { label, value: valueText };
    })
    .filter(Boolean);
  return items.length ? items : fallback;
}

function normalizeStakeholderProfiles(value, fallback = {}) {
  const next = {};
  Object.keys(stakeholders).forEach((key) => {
    const source = asObject(asObject(value)[key]);
    const candidate = {};
    ["label", "summary", "status", "icon"].forEach((field) => {
      const text = String(source[field] || "").trim();
      if (text) candidate[field] = text;
    });
    if (Object.keys(candidate).length) {
      next[key] = candidate;
    }
  });
  return Object.keys(next).length ? next : fallback;
}

function normalizeUiCopy(value, fallback = {}) {
  const candidate = {};
  Object.entries(asObject(value)).forEach(([key, item]) => {
    const text = String(item || "").trim();
    if (text) candidate[key] = text;
  });
  return Object.keys(candidate).length ? candidate : fallback;
}

function mergeStructuredCase(baseCase, aiDraft) {
  const next = asObject(aiDraft);
  const merged = {
    ...baseCase,
    summary: String(next.summary || baseCase.summary || "").trim() || baseCase.summary,
    prompt: String(next.prompt || baseCase.prompt || "").trim() || baseCase.prompt,
    learningGoals: normalizeStringList(next.learningGoals, baseCase.learningGoals).slice(0, 6),
    constraints: normalizeStringList(next.constraints, baseCase.constraints).slice(0, 8),
    evidence: normalizeEvidenceList(next.evidence, baseCase.evidence).slice(0, 6),
    stakeholderProfiles: normalizeStakeholderProfiles(next.stakeholderProfiles, baseCase.stakeholderProfiles),
    matrixInsights: normalizeSimpleCardList(next.matrixInsights, baseCase.matrixInsights).slice(0, 6),
    sandboxFeed: normalizeValueCardList(next.sandboxFeed, baseCase.sandboxFeed).slice(0, 6),
    reflectionPrompts: normalizeStringList(next.reflectionPrompts, baseCase.reflectionPrompts).slice(0, 6),
    networkMeta: normalizeValueCardList(next.networkMeta, baseCase.networkMeta).slice(0, 6),
    uiCopy: normalizeUiCopy(next.uiCopy, baseCase.uiCopy),
  };

  if (String(next.caseSubtitle || "").trim()) {
    merged.uiCopy = {
      ...merged.uiCopy,
      caseSubtitle: String(next.caseSubtitle).trim(),
    };
  }

  return merged;
}

function setAiStatus(message, { busy = state.ai.busy, error = "" } = {}) {
  const config = getGeminiConfig();
  state.ai.configured = Boolean(config.apiKey);
  state.ai.model = config.model;
  state.ai.busy = busy;
  state.ai.lastError = error;
  state.ai.status =
    message ||
    (state.ai.configured
      ? `Gemini ready on ${config.model}.`
      : "Gemini will use the app endpoint when available, or fall back to local logic.");
}

function getGeminiResponseText(payload) {
  return asArray(payload?.candidates)
    .flatMap((candidate) => asArray(candidate?.content?.parts))
    .map((part) => String(part?.text || "").trim())
    .filter(Boolean)
    .join("\n")
    .trim();
}

async function requestGeminiContent({
  systemInstruction = "",
  prompt,
  responseMimeType = "text/plain",
  temperature = 0.7,
}) {
  const { apiKey, model } = getGeminiConfig();
  const payload = {
    systemInstruction,
    prompt,
    responseMimeType,
    temperature,
    model,
  };
  const response = apiKey
    ? await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          ...(systemInstruction
            ? {
                system_instruction: {
                  parts: [{ text: systemInstruction }],
                },
              }
            : {}),
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature,
            responseMimeType,
          },
        }),
      })
    : await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Gemini request failed (${response.status}). ${detail}`.trim());
  }

  const result = await response.json();
  const text = apiKey ? getGeminiResponseText(result) : String(result?.text || "").trim();
  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }
  return text;
}

async function requestGeminiJson(options) {
  const raw = await requestGeminiContent({
    ...options,
    responseMimeType: "application/json",
    temperature: options.temperature ?? 0.4,
  });
  return JSON.parse(extractJsonCandidate(raw));
}

async function structureCaseFromDocumentWithAi(input) {
  const baseCase = structuredCaseFromDocument(input);

  setAiStatus(`Structuring this case with ${getGeminiConfig().model}â€¦`, { busy: true });
  try {
    const draft = await requestGeminiJson({
      systemInstruction:
        "You structure instructional design documents into concise JSON for a learning network app. Return only valid JSON.",
      prompt: [
        "Create a compact case structure from the uploaded document.",
        "Return JSON with these keys only:",
        "summary, prompt, learningGoals, constraints, evidence, stakeholderProfiles, matrixInsights, sandboxFeed, reflectionPrompts, networkMeta, uiCopy, caseSubtitle",
        "Rules:",
        "- learningGoals: 3 to 5 short strings",
        "- constraints: 3 to 6 short strings",
        "- evidence: up to 4 objects with stakeholder, title, body",
        "- stakeholderProfiles: optional object keyed by teacher, administrator, student, it, accessibility with summary/status",
        "- matrixInsights: up to 4 objects with title and body",
        "- sandboxFeed: up to 4 objects with label, value, optional note",
        "- reflectionPrompts: 3 short prompts",
        "- networkMeta: up to 3 objects with label and value",
        "- uiCopy: optional object with short copy strings",
        "- caseSubtitle: one short sentence",
        "",
        `Title: ${input.title}`,
        `Publish to learners: ${input.publish ? "yes" : "no"}`,
        "Document:",
        input.text,
      ].join("\n"),
    });
    setAiStatus(`${getGeminiConfig().model} structured the case.`, { busy: false });
    return mergeStructuredCase(baseCase, draft);
  } catch (error) {
    console.error(error);
    setAiStatus(`Gemini fallback active. ${error.message}`, { busy: false, error: error.message });
    return baseCase;
  }
}

async function generateAgendaExpansionsWithAi(agendaNode, activeCase = getActiveCaseRecord()) {
  const fallback = generateAgendaExpansions(agendaNode, activeCase);

  const settings = getCaseBoardSettings(activeCase);
  setAiStatus(`Expanding learner agenda with ${getGeminiConfig().model}â€¦`, { busy: true });
  try {
    const payload = await requestGeminiJson({
      systemInstruction:
        "You expand learner agenda nodes into concise related issue nodes for a D3 network. Return only valid JSON.",
      prompt: [
        "Return JSON with one key: items.",
        `items must be an array of up to ${settings.maxAiExpansionsPerNode} objects.`,
        "Each object must have: title, body, stakeholder.",
        "Allowed stakeholders: teacher, administrator, student, it, accessibility.",
        "Keep each body to one or two sentences.",
        "",
        `Case summary: ${activeCase?.summary || ""}`,
        `Case constraints: ${normalizeStringList(activeCase?.constraints).join(" | ")}`,
        `Agenda title: ${agendaNode.title}`,
        `Agenda body: ${agendaNode.body}`,
        `Current lens: ${state.activeStakeholder}`,
      ].join("\n"),
    });

    const items = asArray(payload?.items)
      .map((item, index) => {
        const entry = asObject(item);
        const title = String(entry.title || "").trim();
        const body = String(entry.body || "").trim();
        if (!title || !body) return null;
        return {
          id: `ai-${slugify(agendaNode.title)}-${Date.now().toString(36)}-${index + 1}`,
          title,
          body,
          stakeholder: normalizeStakeholderKey(entry.stakeholder, agendaNode.stakeholder || state.activeStakeholder),
          sourceAgendaId: agendaNode.id,
          createdAt: "Now",
        };
      })
      .filter(Boolean)
      .slice(0, settings.maxAiExpansionsPerNode);

    setAiStatus(`${getGeminiConfig().model} expanded the learner agenda.`, { busy: false });
    return items.length ? items : fallback;
  } catch (error) {
    console.error(error);
    setAiStatus(`Gemini fallback active. ${error.message}`, { busy: false, error: error.message });
    return fallback;
  }
}

async function generateAgentReplyWithAi(stakeholderKey, question) {
  const fallback = generateAgentReply(stakeholderKey);

  const stakeholder = getCaseStakeholderMeta(stakeholderKey);
  const activeCase = getActiveCaseRecord();
  setAiStatus(`Responding with ${getGeminiConfig().model}â€¦`, { busy: true });
  try {
    const response = await requestGeminiContent({
      systemInstruction:
        "You are an instructional design analysis assistant. Answer from one stakeholder lens in plain language, with no bullets and no markdown.",
      prompt: [
        `Stakeholder lens: ${stakeholder.label}`,
        `Stakeholder summary: ${stakeholder.summary}`,
        `Case title: ${activeCase?.title || "Untitled case"}`,
        `Case summary: ${activeCase?.summary || ""}`,
        `Constraints: ${normalizeStringList(activeCase?.constraints).join(" | ")}`,
        `Question: ${question}`,
        "Answer in 2 or 3 concise sentences. Mention one design tension and one practical next check.",
      ].join("\n"),
      responseMimeType: "text/plain",
      temperature: 0.6,
    });
    setAiStatus(`${getGeminiConfig().model} answered from the ${stakeholder.label.toLowerCase()} lens.`, { busy: false });
    return response;
  } catch (error) {
    console.error(error);
    setAiStatus(`Gemini fallback active. ${error.message}`, { busy: false, error: error.message });
    return fallback;
  }
}

setAiStatus();

function structuredCaseFromDocument({ title, text, publish = true }) {
  const cleanText = text.trim();
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
    id: `case-${slugify(title)}-${Date.now().toString(36)}`,
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
        stamp: "Now",
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

function syncActiveCaseState() {
  ensureActiveSelections();
  const course = getActiveCourse();
  const activeCase = getCaseById(state.activeCaseId, course);
  dom.caseSummaryLabel.textContent = state.activeRole === "admin" ? "Selected Instructor Case" : "Selected Published Case";
  dom.sidebarTensionLabel.textContent = state.activeRole === "admin" ? "Case tension" : "Learner run tension";
  if (!activeCase) {
    state.metrics = { ...emptyMetrics };
    state.evidence = [];
    state.decisions = [];
    state.chat = [];
    state.timeline = [];
    dom.caseTitle.textContent = "No case selected";
    dom.caseSubtitle.textContent =
      state.activeRole === "admin"
        ? "Create or select a case."
        : "Choose a published case.";
    return;
  }

  const activeRecord = getActiveWorkspaceRecord(course);

  state.metrics = { ...activeRecord.metrics };
  state.evidence = safeClone(activeRecord.evidence);
  state.decisions = safeClone(activeRecord.decisions);
  state.chat = safeClone(activeRecord.chat);
  state.timeline = safeClone(activeRecord.timeline);
  dom.caseTitle.textContent = activeCase.title;
  dom.caseSubtitle.textContent =
    getCaseUiCopy().caseSubtitle ||
    activeCase.summary ||
    course?.settings?.courseSummary ||
    "Live case data is connected to this workspace.";
}

function updateActiveCaseRecord(mutator) {
  const course = getActiveCourse();
  const activeCase = getCaseById(state.activeCaseId, course);
  if (!activeCase) {
    return;
  }
  mutator(activeCase);
  persistPlatformState();
}

function persistActiveCaseState() {
  updateActiveCaseRecord((activeCase) => {
    activeCase.metrics = { ...state.metrics };
    activeCase.evidence = safeClone(state.evidence);
    activeCase.decisions = safeClone(state.decisions);
    activeCase.chat = safeClone(state.chat);
    activeCase.timeline = safeClone(state.timeline);
  });
  if (isSupabaseSessionActive()) {
    const activeCase = getActiveCaseRecord();
    syncCaseToSupabase(activeCase).catch((error) => {
      console.error(error);
      state.auth.message = error.message || "Case changes could not be saved.";
      renderLandingLogin();
    });
  }
}

function updateActiveLearnerRunRecord(mutator) {
  const activeRun = getActiveLearnerRun();
  if (!activeRun) return;
  mutator(activeRun);
  persistPlatformState();
}

function persistActiveLearnerRunState() {
  updateActiveLearnerRunRecord((activeRun) => {
    activeRun.metrics = { ...state.metrics };
    activeRun.evidence = safeClone(state.evidence);
    activeRun.decisions = safeClone(state.decisions);
    activeRun.chat = safeClone(state.chat);
    activeRun.timeline = safeClone(state.timeline);
    activeRun.status = "Learner workspace updated";
    activeRun.updatedAt = new Date().toISOString();
  });
  if (isSupabaseSessionActive()) {
    const activeRun = getActiveLearnerRun();
    syncLearnerRunToSupabase(activeRun).catch((error) => {
      console.error(error);
      state.auth.message = error.message || "Your changes could not be saved.";
      renderLandingLogin();
    });
  }
}

function persistActiveWorkspaceState() {
  if (state.activeRole === "admin") {
    persistActiveCaseState();
    return;
  }
  persistActiveLearnerRunState();
}

function isViewAllowed(view) {
  if (!hasActiveCase()) {
    return view === "visualizer";
  }
  if (state.activeRole === "admin") return true;
  return view !== "sandbox";
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function computeScores() {
  const { personalization, teacherLoad, privacy, accessibility } = state.metrics;
  const automationWeight = state.autonomousIteration ? 6 : -4;
  const alignment = Math.round(
    clamp(
      personalization * 0.27 +
        privacy * 0.24 +
        accessibility * 0.21 +
        (100 - teacherLoad) * 0.18 +
        automationWeight,
      0,
      100
    )
  );
  const conflict = Math.round(
    clamp(
      teacherLoad * 0.42 +
        (100 - privacy) * 0.22 +
        (100 - accessibility) * 0.2 +
        Math.max(personalization - 84, 0) * 0.16,
      0,
      100
    )
  );
  const feasibility = Math.round(
    clamp(
      (100 - teacherLoad) * 0.38 +
        privacy * 0.24 +
        accessibility * 0.2 +
        (100 - Math.max(personalization - 90, 0) * 2) * 0.18,
      0,
      100
    )
  );
  return { alignment, conflict, feasibility };
}

function graphToneForValue(value, reverse = false) {
  const score = reverse ? 100 - value : value;
  if (score >= 68) return "ok";
  if (score >= 48) return "primary";
  return "danger";
}

function graphJitter(seed, amplitude) {
  return Math.sin(seed) * amplitude;
}

const stakeholderKeywordMap = {
  teacher: ["teacher", "instructor", "faculty", "feedback", "grading", "moderation", "review"],
  administrator: ["administrator", "admin", "program", "policy", "scale", "adoption", "institution"],
  student: ["student", "learner", "agency", "choice", "engagement", "motivation", "reflection"],
  it: ["it", "lms", "integration", "platform", "system", "api", "data", "telemetry", "vendor"],
  accessibility: ["accessibility", "screen", "caption", "alt text", "equity", "udl", "wcag", "parity"],
};

function inferStakeholderFromText(text = "", fallback = state.activeStakeholder) {
  const normalized = text.toLowerCase();
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

function stakeholderSignalValue(stakeholderKey, metrics = state.metrics) {
  const { personalization, teacherLoad, privacy, accessibility } = metrics;
  const { feasibility } = computeScores();
  const map = {
    teacher: teacherLoad,
    administrator: feasibility,
    student: Math.round((accessibility + clamp(100 - Math.max(personalization - 55, 0), 22, 100)) / 2),
    it: privacy,
    accessibility,
  };
  return map[stakeholderKey] ?? 58;
}

function graphToneForStakeholder(stakeholderKey, metrics = state.metrics) {
  return stakeholderKey === "teacher"
    ? graphToneForValue(stakeholderSignalValue(stakeholderKey, metrics), true)
    : graphToneForValue(stakeholderSignalValue(stakeholderKey, metrics));
}

function graphToneForIssue(issueType, stakeholderKey, metrics = state.metrics) {
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
    return state.evidence.length >= 3 ? "ok" : "primary";
  }
  if (issueType === "goal") {
    return graphToneForValue(metrics.personalization);
  }
  return graphToneForStakeholder(stakeholderKey, metrics);
}

function getVisibleLearnerRunsForCase(activeCase = getActiveCaseRecord(), course = getActiveCourse()) {
  if (!activeCase || !course) return [];
  return asArray(course.learnerRuns).filter((run) => run.caseId === activeCase.id);
}

function annotationIssueType(noteType = "") {
  return noteType === "question" ? "annotation-question" : "annotation";
}

function buildCohortIssueEntries(activeCase = getActiveCaseRecord(), course = getActiveCourse()) {
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
            stakeholder: inferStakeholderFromText(`${item.targetLabel} ${item.body}`, "student"),
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

function buildCaseIssueEntries(activeCase) {
  const issueEntries = [];
  const goals = asArray(activeCase?.learningGoals).slice(0, 3);
  const constraints = asArray(activeCase?.constraints).slice(0, 4);
  const evidence = asArray(state.evidence).slice(0, 4);
  const timeline = asArray(state.timeline).slice(0, 2);
  const activeRun = state.activeRole === "user" ? getActiveLearnerRun() : null;
  const boardSettings = getCaseBoardSettings(activeCase);
  const agendaNodes =
    state.activeMapLayer === "personal" ? asArray(activeRun?.agendaNodes).slice(0, boardSettings.maxLearnerNodes) : [];
  const aiGeneratedNodes =
    state.activeMapLayer === "personal"
      ? asArray(activeRun?.aiGeneratedNodes).slice(0, boardSettings.maxLearnerNodes * boardSettings.maxAiExpansionsPerNode)
      : [];
  const annotations =
    state.activeMapLayer === "personal"
      ? asArray(activeRun?.annotations).slice(0, boardSettings.maxLearnerNodes * 2)
      : [];
  const cohortEntries = state.activeMapLayer === "cohort" ? buildCohortIssueEntries(activeCase) : [];

  goals.forEach((goal, index) => {
    issueEntries.push({
      issueType: "goal",
      title: `Goal ${index + 1}`,
      body: goal,
      stakeholder: inferStakeholderFromText(goal, index === 0 ? "student" : state.activeStakeholder),
    });
  });

  constraints.forEach((constraint, index) => {
    issueEntries.push({
      issueType: "constraint",
      title: `Constraint ${index + 1}`,
      body: constraint,
      stakeholder: inferStakeholderFromText(constraint, index === 0 ? "teacher" : state.activeStakeholder),
    });
  });

  evidence.forEach((item, index) => {
    const title = item.title || `Evidence ${index + 1}`;
    const body = item.body || title;
    issueEntries.push({
      issueType: "evidence",
      title,
      body,
      stakeholder: item.stakeholder || inferStakeholderFromText(`${title} ${body}`, state.activeStakeholder),
    });
  });

  timeline.forEach((step, index) => {
    issueEntries.push({
      issueType: "timeline",
      title: `Process step ${index + 1}`,
      body: step,
      stakeholder: inferStakeholderFromText(step, state.activeStakeholder),
    });
  });

  agendaNodes.forEach((item, index) => {
    issueEntries.push({
      issueType: "agenda",
      title: item.title || `Agenda ${index + 1}`,
      body: item.body || item.title || "Learner agenda",
      stakeholder: item.stakeholder || inferStakeholderFromText(`${item.title} ${item.body}`, "student"),
    });
  });

  aiGeneratedNodes.forEach((item, index) => {
    issueEntries.push({
      issueType: "expansion",
      title: item.title || `AI issue ${index + 1}`,
      body: item.body || item.title || "Related issue",
      stakeholder: item.stakeholder || inferStakeholderFromText(`${item.title} ${item.body}`, state.activeStakeholder),
    });
  });

  annotations.forEach((item, index) => {
    issueEntries.push({
      issueType: annotationIssueType(item.noteType),
      title: item.targetLabel ? `${item.targetLabel} note ${index + 1}` : `Note ${index + 1}`,
      body: item.body || "Learner note",
      stakeholder: inferStakeholderFromText(`${item.targetLabel || ""} ${item.body || ""}`, item.stakeholder || "student"),
    });
  });

  cohortEntries.forEach((item) => {
    issueEntries.push(item);
  });

  if (!issueEntries.length && activeCase?.summary) {
    issueEntries.push({
      issueType: "summary",
      title: "Case summary",
      body: activeCase.summary,
      stakeholder: inferStakeholderFromText(activeCase.summary, state.activeStakeholder),
    });
  }

  return issueEntries;
}

function buildGraphSnapshot(reason) {
  const activeCase = getActiveCaseRecord();
  const iteration = state.graph.iteration;
  const issueEntries = buildCaseIssueEntries(activeCase);
  const activeStakeholders = new Set([state.activeStakeholder]);
  issueEntries.forEach((entry) => activeStakeholders.add(entry.stakeholder));

  const stakeholderNodes = [...activeStakeholders]
    .filter((stakeholderKey) => stakeholders[stakeholderKey])
    .map((stakeholderKey, index) => {
      const meta = getCaseStakeholderMeta(stakeholderKey);
      const linkedCount = issueEntries.filter((entry) => entry.stakeholder === stakeholderKey).length;
      return {
        id: stakeholderKey,
        label: meta.label,
        kind: "stakeholder",
        stakeholder: stakeholderKey,
        tone: graphToneForStakeholder(stakeholderKey),
        x: 20 + index * 14 + graphJitter(iteration * 0.6 + index, 2),
        y: 18 + index * 9 + graphJitter(iteration * 0.44 + index, 2),
        icon: meta.icon,
        meta: linkedCount ? `${linkedCount} issue${linkedCount === 1 ? "" : "s"}` : meta.status.toLowerCase(),
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
      tone: graphToneForIssue(entry.issueType, entry.stakeholder),
      x: 48 + graphJitter(iteration * 0.33 + index, 2),
      y: 30 + graphJitter(iteration * 0.41 + index, 2),
      icon:
        entry.issueType === "constraint"
          ? "warning"
          : entry.issueType === "evidence"
            ? "library_books"
            : entry.issueType === "timeline"
              ? "schedule"
              : "target",
      meta:
        entry.issueType === "constraint"
          ? "constraint"
          : entry.issueType === "evidence"
            ? "evidence"
            : entry.issueType === "timeline"
              ? "process"
              : "goal",
      issueType: entry.issueType,
      detail: entry.body,
      clusterSlot,
      clusterTotal: issueCountByStakeholder[entry.stakeholder],
      isDerived: true,
    };
  });

  const nodes = [...stakeholderNodes, ...signalNodes];
  const links = [];

  stakeholderNodes.forEach((node) => {
    links.push({
      source: "proposal",
      target: node.id,
      tone: node.tone,
      weight: 2.6,
      kind: "stakeholder",
    });
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

  const groupedSignals = signalNodes.reduce((acc, node) => {
    if (!acc[node.stakeholder]) acc[node.stakeholder] = [];
    acc[node.stakeholder].push(node);
    return acc;
  }, {});

  Object.values(groupedSignals).forEach((group) => {
    group.forEach((node, index) => {
      const next = group[index + 1];
      if (!next) return;
      links.push({
        source: node.id,
        target: next.id,
        tone: node.tone === "danger" || next.tone === "danger" ? "danger" : "neutral",
        weight: 1.1,
        kind: "sequence",
      });
    });
  });

  const evidenceNodes = signalNodes.filter((node) => node.issueType === "evidence");
  evidenceNodes.forEach((node) => {
    links.push({
      source: "proposal",
      target: node.id,
      tone: node.tone,
      weight: 1.2,
      kind: "trace",
    });
  });

  return { nodes, links };
}

function tensionLevel(score) {
  if (score >= 72) return "High";
  if (score >= 52) return "Medium";
  return "Low";
}

function stakeholderConflicts(key) {
  const { personalization, teacherLoad, privacy, accessibility } = state.metrics;
  const { feasibility } = computeScores();
  const map = {
    teacher: [
      {
        level: "critical",
        title: "Manual feedback burden increases",
        body: `Teacher load is currently ${teacherLoad}, which means moderation and exception handling remain too heavy during peer feedback cycles.`,
      },
      {
        level: "medium",
        title: "Pedagogical drift risk",
        body: `Personalization depth is ${personalization}. Unless the teacher can inspect the rationale, scaffolding may feel efficient but pedagogically opaque.`,
      },
    ],
    administrator: [
      {
        level: "medium",
        title: "Cross-section consistency gap",
        body: `Current feasibility is ${feasibility}, which may create uneven rollout quality across instructors and cohorts.`,
      },
      {
        level: "critical",
        title: "Policy oversight required",
        body: `Privacy resilience is ${privacy}. Administrative approval will stall if governance remains implicit.`,
      },
    ],
    student: [
      {
        level: "critical",
        title: "Agency compression",
        body: `Students benefit from tailored pathways, but a personalization score of ${personalization} can start to feel directive if choice is not explained.`,
      },
      {
        level: "medium",
        title: "Feedback trust is uneven",
        body: `Accessibility coverage is ${accessibility}. Students with different support needs may not experience the same clarity or pacing.`,
      },
    ],
    it: [
      {
        level: "critical",
        title: "Integration complexity is rising",
        body: "Teacher workload and personalization are moving in opposite directions, which usually signals orchestration logic the LMS cannot cleanly absorb.",
      },
      {
        level: "medium",
        title: "Support capacity pressure",
        body: "When privacy drops below 70, exception-handling and vendor review overhead tend to escalate for campus IT.",
      },
    ],
    accessibility: [
      {
        level: "critical",
        title: "Multimodal parity is incomplete",
        body: `Accessibility coverage is ${accessibility}. The system needs stronger guarantees for alt text, reading order, and explanation clarity.`,
      },
      {
        level: "medium",
        title: "Cognitive load can spike",
        body: "Conflict increases when students must parse too many automated signals without a human framing layer.",
      },
    ],
  };
  return map[key];
}

function stakeholderRecommendations(key) {
  const map = {
    teacher: [
      "Keep human approval over redesign release decisions.",
      "Batch AI suggestions into fewer, higher-quality intervention moments.",
    ],
    administrator: [
      "Add rubric-visible governance checkpoints to every case.",
      "Require one evidence note per stakeholder before escalation.",
    ],
    student: [
      "Explain why the app is prioritizing one redesign path.",
      "Preserve student override moments before the final submission.",
    ],
    it: [
      "Reduce raw telemetry and exchange only scenario summaries.",
      "Constrain integrations to the current LMS and one auditable AI layer.",
    ],
    accessibility: [
      "Attach accessibility evidence to every redesign round.",
      "Add plain-language summaries to each recommendation.",
    ],
  };
  return map[key];
}

function radarValues() {
  const { personalization, teacherLoad, privacy, accessibility } = state.metrics;
  const { feasibility } = computeScores();
  return [personalization, privacy, accessibility, feasibility, 100 - teacherLoad];
}

function polygonPoints(values) {
  const centerX = 120;
  const centerY = 120;
  const radius = 96;
  return values
    .map((value, index) => {
      const angle = (-90 + index * 72) * (Math.PI / 180);
      const scaled = (value / 100) * radius;
      const x = centerX + Math.cos(angle) * scaled;
      const y = centerY + Math.sin(angle) * scaled;
      const dot = document.getElementById(`radar-dot-${index}`);
      dot.setAttribute("cx", String(x));
      dot.setAttribute("cy", String(y));
      return `${x},${y}`;
    })
    .join(" ");
}

function renderConstraints() {
  if (!dom.constraintTokens) return;
  const activeCase = getCaseById(state.activeCaseId);
  const constraints = activeCase?.constraints || [];
  dom.constraintTokens.innerHTML = constraints.map((item) => `<span class="token">${item}</span>`).join("");
}

function hasActiveCase() {
  return Boolean(getCaseById(state.activeCaseId, getActiveCourse()));
}

function renderNavigation() {
  if (!isViewAllowed(state.activeView)) {
    state.activeView = "visualizer";
  }
  dom.viewButtons.forEach((button) => {
    const allowed = isViewAllowed(button.dataset.view);
    button.classList.toggle("is-hidden", !allowed);
    button.classList.toggle("is-active", button.dataset.view === state.activeView);
  });
  dom.viewPanels.forEach((panel) => {
    const allowed = isViewAllowed(panel.dataset.viewPanel);
    panel.classList.toggle("is-hidden", !allowed);
    panel.classList.toggle("is-active", panel.dataset.viewPanel === state.activeView);
  });
  const course = getActiveCourse();
  const activeCase = getCaseById(state.activeCaseId, course);
  if (dom.topKicker) {
    dom.topKicker.textContent = activeCase
      ? state.activeRole === "admin"
        ? "Current case"
        : "Published case"
      : course
        ? "Current course"
        : "Workspace";
  }
  dom.topTitle.textContent = activeCase
    ? activeCase.title
    : course
      ? `${course.code} · ${course.name}`
      : "Workspace";
}

function renderPlatformControlsLegacy() {
  ensureActiveSelections();
  const institution = getActiveInstitution();
  const course = getActiveCourse();
  const activeCase = getCaseById(state.activeCaseId, course);
  const selectableCases = getSelectableCases(course);
  const visibleCases = getVisibleCases(course);
  const instructors = getInstructors(course);
  const activeInstructor = getActiveInstructor();
  const learners = getLearners(course);
  const activeLearner = getActiveLearner();

  dom.roleSelect.value = state.activeRole;
  dom.roleControl.classList.add("is-hidden");
  dom.roleSelect.disabled = true;
  dom.institutionSelect.innerHTML = state.platform.institutions
    .map((item) => `<option value="${item.id}">${item.name}</option>`)
    .join("");
  dom.institutionSelect.value = institution?.id || "";

  dom.courseSelect.innerHTML = (institution?.courses || [])
    .map((item) => `<option value="${item.id}">${item.code} · ${item.name}</option>`)
    .join("");
  dom.courseSelect.value = course?.id || "";
  dom.caseControlLabel.textContent = state.activeRole === "admin" ? "Instructor case" : "Published case";
  dom.caseSelect.innerHTML = selectableCases.length
    ? selectableCases
        .map(
          (item) =>
            `<option value="${item.id}">${item.title}${
              state.activeRole === "admin" ? ` (${item.published ? "Published" : "Draft"})` : ""
            }</option>`
        )
        .join("")
    : `<option value="">${state.activeRole === "admin" ? "Create the first case" : "No published cases yet"}</option>`;
  dom.caseSelect.value = state.activeCaseId || selectableCases[0]?.id || "";
  dom.caseSelect.disabled = selectableCases.length === 0;
  dom.caseControl.classList.toggle("is-hidden", !course);
  dom.sidebarCaseLabel.textContent = state.activeRole === "admin" ? "Instructor case" : "Published case";
  dom.sidebarCaseSelect.innerHTML = dom.caseSelect.innerHTML;
  dom.sidebarCaseSelect.value = dom.caseSelect.value;
  dom.sidebarCaseSelect.disabled = dom.caseSelect.disabled;
  dom.sidebarCaseControl.classList.toggle("is-hidden", !course);
  dom.learnerSelect.innerHTML = learners
    .map((learner) => `<option value="${learner.id}">${learner.name}</option>`)
    .join("");
  dom.learnerSelect.value = activeLearner?.id || "";
  dom.learnerControl.classList.toggle("is-hidden", state.activeRole !== "user");
  const allowedMapLayers = getAllowedMapLayers(activeCase);
  dom.mapLayerSelect.innerHTML = allowedMapLayers
    .map((item) => `<option value="${item.value}">${item.label}</option>`)
    .join("");
  dom.mapLayerSelect.value = allowedMapLayers.find((item) => item.value === state.activeMapLayer)?.value || allowedMapLayers[0]?.value || "base";
  dom.mapLayerControl.classList.toggle("is-hidden", !activeCase);
  dom.sessionIdentityLabel.textContent =
    state.activeRole === "admin"
      ? activeInstructor?.name || "Instructor"
      : activeLearner?.name || "Student";

  dom.intakeTitle.textContent = state.activeRole === "admin" ? "Create or Choose a Case" : "Choose a Published Case";
  dom.intakeBadge.textContent = state.activeRole === "admin" ? "Instructor" : "Student";
  dom.workflowGuide.innerHTML = buildWorkflowGuideMarkup(course, activeCase, visibleCases, activeLearner);
  dom.courseSelect.innerHTML = dom.courseSelect.innerHTML.replace(/Ã‚Â·/g, "Â·");
  dom.platformContext.innerHTML = `
    <article class="context-card">
      <strong>${institution?.name || "No institution selected"}</strong>
      <p>${course ? `${course.code} · ${course.name}` : "No course selected"}.</p>
      <div class="card-meta">
        <span>${course?.documents?.length || 0} documents</span>
        <span>${course?.cases?.length || 0} structured cases</span>
        <span>${instructors.length} instructors</span>
        <span>${learners.length} learners</span>
        <span>${visibleCases.length} ${state.activeRole === "admin" ? "available in studio" : "published cases"}</span>
      </div>
      ${
        state.activeRole === "admin" && activeInstructor
          ? `<div class="card-meta"><span>${activeInstructor.name}</span><span>${activeInstructor.title}</span><span>${course?.settings?.reportMode || "Report mode"}</span></div>
             <p class="context-note">Instructors create and publish course cases here. Students only see the cases you release.</p>`
          : ""
      }
      ${
        state.activeRole === "user" && activeLearner
          ? `<div class="card-meta"><span>${activeLearner.name}</span><span>${activeLearner.focus}</span><span>${activeLearner.section}</span></div>
             <p class="context-note">Select one published case from this course. Your questions and reflections stay in your private notes.</p>`
          : ""
      }
    </article>
  `;

  dom.platformContext.innerHTML = `
    <article class="context-card">
      <strong>${course ? `${course.code} · ${course.name}` : institution?.name || "No course selected"}</strong>
      <p>${institution?.name || "No institution selected"}</p>
      ${
        state.activeRole === "admin" && activeInstructor
          ? `<div class="card-meta"><span>${activeInstructor.name}</span><span>${course?.cases?.length || 0} cases</span><span>${visibleCases.length} published</span><span>Join code ${course?.joinCode || "not set"}</span></div>
             <p class="context-note">Work on one case at a time. Students only see the cases you publish.</p>`
          : ""
      }
      ${
        state.activeRole === "user" && activeLearner
          ? `<div class="card-meta"><span>${activeLearner.name}</span><span>${visibleCases.length} published cases</span></div>
             <p class="context-note">Choose one published case and explore it in your own private notes.</p>`
          : ""
      }
    </article>
  `;
  dom.platformContext.innerHTML = dom.platformContext.innerHTML.replace(/Ã‚Â·/g, "Â·");
}

function renderPlatformControls() {
  ensureActiveSelections();
  const institution = getActiveInstitution();
  const course = getActiveCourse();
  const activeCase = getCaseById(state.activeCaseId, course);
  const selectableCases = getSelectableCases(course);
  const visibleCases = getVisibleCases(course);
  const activeInstructor = getActiveInstructor();
  const learners = getLearners(course);
  const activeLearner = getActiveLearner();

  dom.roleSelect.value = state.activeRole;
  dom.roleControl.classList.add("is-hidden");
  dom.roleSelect.disabled = true;

  dom.institutionSelect.innerHTML = state.platform.institutions
    .map((item) => `<option value="${item.id}">${item.name}</option>`)
    .join("");
  dom.institutionSelect.value = institution?.id || "";

  dom.courseSelect.innerHTML = (institution?.courses || [])
    .map((item) => `<option value="${item.id}">${item.code} · ${item.name}</option>`)
    .join("");
  dom.courseSelect.value = course?.id || "";

  dom.caseControlLabel.textContent = state.activeRole === "admin" ? "Instructor case" : "Published case";
  dom.caseSelect.innerHTML = selectableCases.length
    ? selectableCases
        .map(
          (item) =>
            `<option value="${item.id}">${item.title}${
              state.activeRole === "admin" ? ` (${item.published ? "Published" : "Draft"})` : ""
            }</option>`
        )
        .join("")
    : `<option value="">${state.activeRole === "admin" ? "Create the first case" : "No published cases yet"}</option>`;
  dom.caseSelect.value = state.activeCaseId || selectableCases[0]?.id || "";
  dom.caseSelect.disabled = selectableCases.length === 0;
  dom.caseControl.classList.toggle("is-hidden", !course);

  dom.sidebarCaseLabel.textContent = state.activeRole === "admin" ? "Instructor case" : "Published case";
  dom.sidebarCaseSelect.innerHTML = dom.caseSelect.innerHTML;
  dom.sidebarCaseSelect.value = dom.caseSelect.value;
  dom.sidebarCaseSelect.disabled = dom.caseSelect.disabled;
  dom.sidebarCaseControl.classList.toggle("is-hidden", !course);

  dom.learnerSelect.innerHTML = learners.map((learner) => `<option value="${learner.id}">${learner.name}</option>`).join("");
  dom.learnerSelect.value = activeLearner?.id || "";
  dom.learnerControl.classList.toggle("is-hidden", state.activeRole !== "user");

  const allowedMapLayers = getAllowedMapLayers(activeCase);
  dom.mapLayerSelect.innerHTML = allowedMapLayers.map((item) => `<option value="${item.value}">${item.label}</option>`).join("");
  dom.mapLayerSelect.value =
    allowedMapLayers.find((item) => item.value === state.activeMapLayer)?.value || allowedMapLayers[0]?.value || "base";
  dom.mapLayerControl.classList.toggle("is-hidden", !activeCase);

  dom.sessionIdentityLabel.textContent =
    state.activeRole === "admin" ? activeInstructor?.name || "Instructor" : activeLearner?.name || "Student";

  dom.intakeTitle.textContent = state.activeRole === "admin" ? "Create or Choose a Case" : "Choose a Published Case";
  dom.intakeBadge.textContent = state.activeRole === "admin" ? "Instructor" : "Student";
  dom.workflowGuide.innerHTML = buildWorkflowGuideMarkup(course, activeCase, visibleCases, activeLearner);

  dom.platformContext.innerHTML = `
    <article class="context-card">
      <strong>${course ? `${course.code} · ${course.name}` : institution?.name || "No course selected"}</strong>
      <p>${institution?.name || "No institution selected"}</p>
      ${
        state.activeRole === "admin" && activeInstructor
          ? `<div class="card-meta"><span>${activeInstructor.name}</span><span>${course?.cases?.length || 0} cases</span><span>${visibleCases.length} published</span><span>Join code ${course?.joinCode || "not set"}</span></div>
             <p class="context-note">Create the base board here, decide how much students can add, then share the join code when the board is ready.</p>`
          : ""
      }
      ${
        state.activeRole === "user" && activeLearner
          ? `<div class="card-meta"><span>${activeLearner.name}</span><span>${visibleCases.length} published cases</span></div>
             <p class="context-note">Choose one published board, inspect the instructor's base map, then add your own nodes and notes in your private layer.</p>`
          : ""
      }
    </article>
  `;
}

function buildWorkflowGuideMarkup(course, activeCase, visibleCases, activeLearner) {
  const steps =
    state.activeRole === "admin"
      ? [
          {
            label: "Choose the course",
            body: "Confirm the course before creating or editing a case.",
            state: course ? "done" : "current",
          },
          {
            label: activeCase ? "Review or update the case" : "Create a case",
            body: activeCase
              ? "Use the case selector to switch cases or keep editing the current one."
              : "Paste a course brief below and the studio will structure it.",
            state: activeCase ? "done" : course ? "current" : "upcoming",
          },
          {
            label: activeCase?.published ? "Published to students" : "Publish when ready",
            body: activeCase?.published
              ? "Students can now open this case in their workspace."
              : "Keep drafts private until you want students to work from them.",
            state: activeCase?.published ? "done" : activeCase ? "current" : "upcoming",
          },
        ]
      : [
          {
            label: "Choose the course",
            body: "Start in the course where your instructor published the case.",
            state: course ? "done" : "current",
          },
          {
            label: activeCase ? "Open the published case" : "Select a published case",
            body: activeCase
              ? "The selected case is now loaded into your learner run."
              : visibleCases.length
                ? "Use the case selector above to pick one published case."
                : "Wait for your instructor to publish a case for this course.",
            state: activeCase ? "done" : course ? "current" : "upcoming",
          },
          {
            label: activeLearner ? "Ask questions & reflect" : "Start your learner run",
            body: activeCase
              ? "Use the network, evidence, and prompts to build your reflection."
              : "Once a case is selected, the rest of the page will open up.",
            state: activeCase ? "current" : "upcoming",
          },
        ];

  return `
    <article class="workflow-card">
      <p class="eyebrow">Quick start</p>
      <div class="workflow-steps">
        ${steps
          .map(
            (step, index) => `
              <article class="workflow-step is-${step.state}">
                <div class="workflow-step-index">${index + 1}</div>
                <div>
                  <strong>${step.label}</strong>
                  <p>${step.body}</p>
                </div>
              </article>
            `
          )
          .join("")}
      </div>
    </article>
  `;
}

function pipelineStatusMarkup(activeCase) {
  if (!activeCase) {
    return `<div class="empty-note">${
      state.activeRole === "admin"
        ? "No case"
        : "No case"
    }</div>`;
  }

  return `
    <article class="pipeline-card pipeline-card-highlight">
      <strong>${activeCase.title}</strong>
      <p>${activeCase.summary}</p>
      <div class="pipeline-chip-row">
        <span class="pipeline-chip">${activeCase.published ? "Published" : "Draft"}</span>
        <span class="pipeline-chip">${activeCase.pipeline.graphStatus}</span>
      </div>
    </article>
  `;
}

function emptyNoteMarkup(message) {
  return `<div class="empty-note">${message}</div>`;
}

function renderPipelineConsole() {
  const institution = getActiveInstitution();
  const course = getActiveCourse();
  const activeCase = getCaseById(state.activeCaseId, course);
  const visibleCases = getVisibleCases(course);
  const activeLearner = state.activeRole === "user" ? getActiveLearner() : null;
  const activeRun = state.activeRole === "user" ? getActiveLearnerRun() : null;

  if (state.activeRole === "admin") {
    const canManageCourses = isPlatformAdminAccount();
    dom.pipelineConsole.innerHTML = `
      ${pipelineStatusMarkup(activeCase)}
      ${
        canManageCourses
          ? `
            <article class="pipeline-card">
              <strong>Course setup</strong>
              <div class="pipeline-form-row two-up">
                <form class="pipeline-form" id="add-institution-form">
                  <input name="institutionName" type="text" placeholder="Institution name..." required>
                  <button class="toolbar-button" type="submit">Add institution</button>
                </form>
                <form class="pipeline-form" id="add-course-form">
                  <input name="courseName" type="text" placeholder="Course name..." required>
                  <input name="courseCode" type="text" placeholder="Course code..." required>
                  <button class="toolbar-button" type="submit">Add course</button>
                </form>
              </div>
            </article>
          `
          : ""
      }
      <article class="pipeline-card">
        <strong>New case</strong>
        ${
          course
            ? `
              <form class="pipeline-form" id="upload-document-form">
                <div class="pipeline-form-row two-up">
                  <input name="documentTitle" type="text" placeholder="Title..." autocomplete="off" required>
                  <select name="publishMode">
                    <option value="published">Publish to learners</option>
                    <option value="draft">Keep as draft</option>
                  </select>
                </div>
                <textarea name="documentText" placeholder="Paste the brief..." autocomplete="off" required></textarea>
                <div class="pipeline-actions">
                  <button class="toolbar-button toolbar-button-primary" type="submit">Create case</button>
                </div>
              </form>
            `
            : `<div class="empty-note">${canManageCourses ? "Create a course first." : "No course assigned."}</div>`
        }
      </article>
      ${
        activeCase
          ? `
            <article class="pipeline-card">
              <strong>Board settings</strong>
              <p></p>
              <form class="pipeline-form" id="board-settings-form">
                <textarea name="agendaPrompt" placeholder="Main question..." autocomplete="off">${getCaseBoardSettings(activeCase).agendaPrompt || ""}</textarea>
                <div class="pipeline-form-row two-up">
                  <label class="mini-control">
                    <span>Due date</span>
                    <input name="dueAt" type="date" value="${getCaseBoardSettings(activeCase).dueAt || ""}">
                  </label>
                  <label class="mini-control">
                    <span>Sharing mode</span>
                    <select name="sharingMode">
                      <option value="private" ${getCaseBoardSettings(activeCase).sharingMode === "private" ? "selected" : ""}>Private only</option>
                      <option value="cohort" ${getCaseBoardSettings(activeCase).sharingMode === "cohort" ? "selected" : ""}>Class view</option>
                    </select>
                  </label>
                </div>
                <div class="pipeline-form-row two-up">
                  <label class="mini-control">
                    <span>Node limit per student</span>
                    <input name="maxLearnerNodes" type="number" min="1" max="20" value="${getCaseBoardSettings(activeCase).maxLearnerNodes}">
                  </label>
                  <label class="mini-control">
                    <span>AI additions per node</span>
                    <input name="maxAiExpansionsPerNode" type="number" min="1" max="8" value="${getCaseBoardSettings(activeCase).maxAiExpansionsPerNode}">
                  </label>
                </div>
                <div class="pipeline-form-row two-up">
                  <label class="mini-control">
                    <span>Layout</span>
                    <select name="layoutMode">
                      <option value="force" ${getCaseBoardSettings(activeCase).layoutMode === "force" ? "selected" : ""}>Force</option>
                      <option value="cluster" ${getCaseBoardSettings(activeCase).layoutMode === "cluster" ? "selected" : ""}>Cluster</option>
                      <option value="radial" ${getCaseBoardSettings(activeCase).layoutMode === "radial" ? "selected" : ""}>Radial</option>
                    </select>
                  </label>
                </div>
                <div class="pipeline-actions">
                  <button class="toolbar-button toolbar-button-primary" type="submit">Save settings</button>
                </div>
              </form>
            </article>
          `
          : ""
      }
      <article class="pipeline-card">
        <strong>Course cases</strong>
        <p>Open a case to keep working, or publish it when students should be able to choose it.</p>
        <div class="case-list">
          ${
            course?.cases?.length
              ? course.cases
                  .map(
                    (item) => `
                    <article class="case-card ${item.id === state.activeCaseId ? "is-selected" : ""}">
                      <strong>${item.title}</strong>
                      <p>${item.summary}</p>
                      <div class="card-meta">
                        <span>${item.published ? "Published" : "Draft"}</span>
                      </div>
                      <div class="card-actions">
                        <button class="toolbar-button" type="button" data-select-case="${item.id}">Open Case</button>
                        <button class="toolbar-button" type="button" data-toggle-publish="${item.id}">
                          ${item.published ? "Unpublish" : "Publish"}
                        </button>
                      </div>
                    </article>
                  `
                  )
                  .join("")
              : '<div class="empty-note">No cases yet.</div>'
          }
        </div>
      </article>
    `;
    return;

    dom.pipelineConsole.innerHTML = `
      ${pipelineStatusMarkup(activeCase)}
      <div class="settings-grid">
        <article>
          <strong>Institution settings</strong>
          <p>${institution?.settings?.defaultAccess || "Unset"} access · ${institution?.settings?.governanceGate || "Unset"} governance gate · ${institution?.settings?.accessibilityGate || "Unset"} accessibility gate</p>
        </article>
        <article>
          <strong>Course settings</strong>
          <p>${course?.settings?.learnerVisibility || "Unset"} · ${course?.settings?.evidenceRule || "Unset"} · ${course?.settings?.reportMode || "Unset"}</p>
        </article>
      </div>
      <article class="pipeline-card">
        <strong>Add institution or course</strong>
        <div class="pipeline-form-row two-up">
          <form class="pipeline-form" id="add-institution-form">
            <input name="institutionName" type="text" placeholder="New institution name" required>
            <button class="toolbar-button" type="submit">Add institution</button>
          </form>
          <form class="pipeline-form" id="add-course-form">
            <input name="courseName" type="text" placeholder="New course name" required>
            <input name="courseCode" type="text" placeholder="Course code" required>
            <button class="toolbar-button" type="submit">Add course</button>
          </form>
        </div>
      </article>
      <article class="pipeline-card">
        <strong>Upload and structure a document</strong>
        <p>Admins can upload a brief, structure it into a case, and decide whether learners can see it immediately.</p>
        <form class="pipeline-form" id="upload-document-form">
          <div class="pipeline-form-row two-up">
            <input name="documentTitle" type="text" placeholder="Document title" required>
            <select name="publishMode">
              <option value="published">Publish to learners</option>
              <option value="draft">Keep as admin draft</option>
            </select>
          </div>
          <textarea name="documentText" placeholder="Paste syllabus, assignment prompt, policy note, or design brief here..." required></textarea>
          <div class="pipeline-actions">
            <button class="toolbar-button toolbar-button-primary" type="submit">Structure document</button>
          </div>
        </form>
      </article>
      <article class="pipeline-card">
        <strong>Structured cases</strong>
        <p>Instructor-authored cases live here. Open any draft to continue editing, or publish it so students can select it on their side.</p>
        <div class="case-list">
          ${
            course?.cases?.length
              ? course.cases
                  .map(
                    (item) => `
                    <article class="case-card ${item.id === state.activeCaseId ? "is-selected" : ""}">
                      <strong>${item.title}</strong>
                      <p>${item.summary}</p>
                      <div class="card-meta">
                        <span>${item.published ? "Published" : "Draft"}</span>
                        <span>${item.pipeline.graphStatus}</span>
                      </div>
                      <div class="card-actions">
                        <button class="toolbar-button" type="button" data-select-case="${item.id}">Open case</button>
                        <button class="toolbar-button" type="button" data-toggle-publish="${item.id}">
                          ${item.published ? "Unpublish" : "Publish"}
                        </button>
                      </div>
                    </article>
                  `
                  )
                  .join("")
              : '<div class="empty-note">No cases yet.</div>'
          }
        </div>
      </article>
      <article class="pipeline-card">
        <strong>Uploaded documents</strong>
        <div class="document-list">
          ${
            course?.documents?.length
              ? course.documents
                  .slice()
                  .reverse()
                  .map(
                    (document) => `
                    <article class="document-card ${document.caseId === state.activeCaseId ? "is-selected" : ""}">
                      <strong>${document.title}</strong>
                      <p>${document.text.slice(0, 180)}${document.text.length > 180 ? "..." : ""}</p>
                      <div class="card-meta">
                        <span>${document.kind}</span>
                        <span>${document.published ? "Learner visible" : "Admin draft"}</span>
                        <span>${document.uploadedAt}</span>
                      </div>
                    </article>
                  `
                  )
                  .join("")
              : '<div class="empty-note">No documents yet.</div>'
          }
        </div>
      </article>
    `;
    return;
  }

  dom.pipelineConsole.innerHTML = `
    ${pipelineStatusMarkup(activeCase)}
    <article class="pipeline-card">
      <strong>Your copy</strong>
      <p></p>
      ${
        activeLearner
          ? `
            <div class="card-meta">
              <span>${activeLearner.name}</span>
              <span>${activeLearner.focus}</span>
              <span>${activeRun?.status || "Ready to start"}</span>
            </div>
          `
          : ""
      }
    </article>
    <article class="pipeline-card">
      <strong>Available cases</strong>
      <div class="case-list">
        ${
          visibleCases.length
            ? visibleCases
                .map(
                  (item) => `
                  <article class="case-card ${item.id === state.activeCaseId ? "is-selected" : ""}">
                    <strong>${item.title}</strong>
                    <p>${item.summary}</p>
                    <div class="card-meta">
                      <span>${item.pipeline.reportStatus}</span>
                      <span>${
                        (course?.learnerRuns || []).filter(
                          (run) => run.caseId === item.id && run.learnerId === activeLearner?.id
                        )[0]?.status || "Ready"
                      }</span>
                    </div>
                    <div class="card-actions">
                      <button class="toolbar-button" type="button" data-select-case="${item.id}">Open Case</button>
                    </div>
                  </article>
                `
                )
                .join("")
            : '<div class="empty-note">No cases</div>'
        }
      </div>
    </article>
    <article class="pipeline-card">
      <strong>Add a node</strong>
      <p></p>
      <form class="pipeline-form" id="agenda-node-form">
        <input name="agendaTitle" type="text" placeholder="Title..." autocomplete="off" required>
        <textarea name="agendaBody" placeholder="Why does this matter for your redesign?" autocomplete="off"></textarea>
        <div class="pipeline-actions">
          <button class="toolbar-button toolbar-button-primary" type="submit">Add to Map</button>
        </div>
      </form>
      <p class="context-note">${getCaseBoardSettings(activeCase).agendaPrompt || "Add a node."}</p>
      <div class="case-list">
        ${
          asArray(activeRun?.agendaNodes).length
            ? asArray(activeRun?.agendaNodes)
                .map(
                  (item) => `
                  <article class="case-card">
                    <strong>${item.title}</strong>
                    <p>${item.body}</p>
                    <div class="card-meta">
                      <span>${getCaseStakeholderMeta(item.stakeholder || "student").label}</span>
                      <span>${item.createdAt || "Now"}</span>
                    </div>
                  </article>
                `
                )
                .join("")
            : '<div class="empty-note">No nodes</div>'
        }
      </div>
    </article>
    <article class="pipeline-card">
      <strong>AI additions</strong>
      <div class="document-list">
        ${
          asArray(activeRun?.aiGeneratedNodes).length
            ? asArray(activeRun?.aiGeneratedNodes)
                .map(
                  (item) => `
                  <article class="document-card">
                    <strong>${item.title}</strong>
                    <p>${item.body}</p>
                    <div class="card-meta">
                      <span>${getCaseStakeholderMeta(item.stakeholder || "teacher").label}</span>
                      <span>AI suggested</span>
                    </div>
                  </article>
                `
                )
                .join("")
            : '<div class="empty-note">No additions</div>'
        }
      </div>
    </article>
    <article class="pipeline-card">
      <strong>Class view</strong>
      <p>${
        getCaseBoardSettings(activeCase).sharingMode === "private"
          ? "Off"
          : "Shared patterns"
      }</p>
      <div class="card-meta">
        <span>${buildCohortIssueEntries(activeCase).length} shared clusters</span>
        <span>${getVisibleLearnerRunsForCase(activeCase, course).length} student runs</span>
      </div>
    </article>
  `;
}

function renderSidebar() {
  const scores = computeScores();
  const activeCase = getCaseById(state.activeCaseId, getActiveCourse());
  const activeLearner = getActiveLearner();
  dom.sidebarTension.textContent = tensionLevel(scores.conflict);
  dom.sidebarTensionFill.style.width = `${scores.conflict}%`;
  dom.healthFill.style.width = `${scores.alignment}%`;
  const baseHealthCopy =
    state.activeRole === "admin"
      ? activeCase
        ? activeCase.published
          ? "This case is published. Students can now open it in their own view."
          : "This case is still a draft. Publish it when students should start using it."
        : "Create or choose a case to start the workflow."
      : activeCase
        ? `${activeLearner?.name || "This learner"} is exploring the selected case in private notes.`
        : "Choose a published case to unlock the rest of the page.";
  dom.healthCopy.textContent = state.ai.busy ? `${baseHealthCopy} ${state.ai.status}` : baseHealthCopy;
}

function satelliteCountForNode(node) {
  const base = node.kind === "stakeholder" ? 5 : 2;
  const toneBoost = node.tone === "danger" ? 2 : node.tone === "ok" ? 1 : 0;
  const cycleBoost = state.graph.iteration % (node.kind === "stakeholder" ? 3 : 2);
  return base + toneBoost + cycleBoost;
}

function estimateSwarmFrame() {
  const satelliteCount = state.graph.nodes.reduce((total, node) => total + satelliteCountForNode(node), 0);
  return {
    nodes: state.graph.nodes.length + satelliteCount + 1,
    links: state.graph.links.length + satelliteCount,
  };
}

function nodeRadius(node) {
  if (node.type === "core") return 22;
  if (node.type === "stakeholder") return 13;
  if (node.type === "signal") return 9;
  return node.size ?? 4;
}

function clusterAnchorMap(width, height) {
  return {
    proposal: { x: width * 0.5, y: height * 0.5 },
    teacher: { x: width * 0.22, y: height * 0.24 },
    administrator: { x: width * 0.77, y: height * 0.2 },
    student: { x: width * 0.79, y: height * 0.72 },
    it: { x: width * 0.24, y: height * 0.75 },
    accessibility: { x: width * 0.9, y: height * 0.48 },
  };
}

function signalAnchor(node, anchors, width, height) {
  const core = anchors.proposal;
  const owner = anchors[node.stakeholder] || core;
  const presets = {
    "adaptive-pathing": { x: width * 0.5, y: height * 0.22 },
    "moderation-burden": { x: width * 0.34, y: height * 0.55 },
    governance: { x: width * 0.66, y: height * 0.56 },
    "evidence-trace": { x: width * 0.5, y: height * 0.82 },
    "caption-parity": { x: width * 0.6, y: height * 0.31 },
    "telemetry-scope": { x: width * 0.64, y: height * 0.7 },
  };
  if (presets[node.id]) {
    return presets[node.id];
  }
  if (typeof node.clusterSlot === "number" && typeof node.clusterTotal === "number") {
    const total = Math.max(node.clusterTotal, 1);
    const baseAngle = -Math.PI / 2 + (Math.PI * 1.25 * (node.clusterSlot + 1)) / (total + 1);
    const radius =
      node.issueType === "constraint"
        ? 132
        : node.issueType === "evidence"
          ? 112
          : node.issueType === "timeline"
            ? 146
            : 120;
    const centerX = (core.x + owner.x) / 2;
    const centerY = (core.y + owner.y) / 2;
    return {
      x: clamp(centerX + Math.cos(baseAngle) * radius, 30, width - 30),
      y: clamp(centerY + Math.sin(baseAngle) * (radius * 0.72), 30, height - 30),
    };
  }
  return {
    x: (core.x + owner.x) / 2,
    y: (core.y + owner.y) / 2,
  };
}

function resolveClusterTarget(node) {
  const width = graphRenderer.width || 1000;
  const height = graphRenderer.height || 720;
  const layoutMode = getCaseBoardSettings().layoutMode;
  const anchors = clusterAnchorMap(width, height);
  const center = { x: width / 2, y: height / 2 };

  if (layoutMode === "radial" && node.type === "stakeholder") {
    const stakeholderKeys = Object.keys(stakeholders);
    const index = stakeholderKeys.indexOf(node.id);
    const angle = (Math.PI * 2 * Math.max(index, 0)) / stakeholderKeys.length - Math.PI / 2;
    return {
      x: center.x + Math.cos(angle) * Math.min(width, height) * 0.28,
      y: center.y + Math.sin(angle) * Math.min(width, height) * 0.28,
    };
  }

  if (layoutMode === "radial" && node.type === "signal") {
    const parentTarget = anchors[node.stakeholder] || anchors.proposal;
    const angleSeed = (node.id.length % 12) / 12;
    const angle = angleSeed * Math.PI * 2;
    return {
      x: clamp(parentTarget.x + Math.cos(angle) * 92, 24, width - 24),
      y: clamp(parentTarget.y + Math.sin(angle) * 92, 24, height - 24),
    };
  }

  if (node.type === "core") {
    return anchors.proposal;
  }
  if (node.type === "stakeholder") {
    return anchors[node.id] || anchors[node.stakeholder] || anchors.proposal;
  }
  if (node.type === "signal") {
    return signalAnchor(node, anchors, width, height);
  }

  const parentTarget = anchors[node.parent] || anchors[node.stakeholder] || anchors.proposal;
  const orbitTotal = Math.max(node.orbitTotal || 1, 1);
  const angle = (Math.PI * 2 * node.orbitIndex) / orbitTotal + state.graph.iteration * 0.18;
  const radius = node.parentType === "stakeholder" ? 52 + (node.orbitIndex % 3) * 16 : 30 + (node.orbitIndex % 2) * 10;
  return {
    x: clamp(parentTarget.x + Math.cos(angle) * radius, 24, width - 24),
    y: clamp(parentTarget.y + Math.sin(angle) * radius, 24, height - 24),
  };
}

function buildRenderableGraph() {
  const activeCase = getCaseById(state.activeCaseId);
  const uiCopy = getCaseUiCopy();
  const proposalNode = {
    id: "proposal",
    label: uiCopy.graphCoreLabel || activeCase?.title || "Design Proposal",
    meta: `cycle ${state.graph.iteration}`,
    type: "core",
    tone: "primary",
    icon: "auto_awesome",
    stakeholder: state.activeStakeholder,
    isHotspot: true,
  };

  const baseNodes = state.graph.nodes.map((node) => ({
    ...node,
    type: node.kind === "stakeholder" ? "stakeholder" : "signal",
    isHotspot: node.tone === "danger" || node.id === state.activeStakeholder,
  }));

  const nodes = [proposalNode, ...baseNodes];
  const links = state.graph.links.map((link) => ({
    ...link,
    id: `${link.source}->${link.target}`,
  }));

  baseNodes.forEach((node) => {
    const count = satelliteCountForNode(node);
    for (let index = 0; index < count; index += 1) {
      const satelliteId = `${node.id}-sat-${index}`;
      nodes.push({
        id: satelliteId,
        type: "satellite",
        label: "",
        meta: "",
        tone: index === 0 && node.tone !== "primary" ? node.tone : "shell",
        stakeholder: node.stakeholder,
        parent: node.id,
        parentType: node.type,
        orbitIndex: index,
        orbitTotal: count,
        size: node.kind === "stakeholder" ? (index === 0 ? 5 : 4) : 3.4,
      });
      links.push({
        id: `${node.id}->${satelliteId}`,
        source: node.id,
        target: satelliteId,
        tone: index === 0 && node.tone !== "primary" ? node.tone : "neutral",
        weight: index === 0 ? 1.2 : 0.8,
        kind: "satellite",
      });
    }
  });

  return { nodes, links };
}

function describeNodeIssue(node) {
  const stakeholder = stakeholders[node.stakeholder];
  const scores = computeScores();
  const conflict = stakeholder ? stakeholderConflicts(node.stakeholder)[0] : null;
  const titles = {
    proposal: "Systemwide design tension",
    teacher: "Teacher load hotspot",
    administrator: "Policy adoption checkpoint",
    student: "Learner agency signal",
    it: "Integration risk cluster",
    accessibility: "Accessibility review flag",
    "adaptive-pathing": "Pathway personalization spike",
    "moderation-burden": "Moderation overload",
    governance: "Governance friction",
    "evidence-trace": "Evidence continuity gap",
    "caption-parity": "Caption parity concern",
    "telemetry-scope": "Telemetry scope watch",
  };

  if (node.type === "core") {
    return {
      kicker: `Conflict ${scores.conflict}%`,
      title: titles[node.id] || node.label,
      body:
        "This core node aggregates the current swarm frame. When nearby clusters tighten, the proposal is absorbing more unresolved instructional trade-offs.",
    };
  }

  if (node.type === "satellite") {
    return {
      kicker: "Peripheral signal",
      title: "Secondary issue fragment",
      body:
        "This small node represents an echo issue branching off a major stakeholder or signal cluster. Dense satellites usually mean the main issue is spawning follow-up questions.",
    };
  }

  if (node.issueType) {
    return {
      kicker: `${node.issueType[0].toUpperCase()}${node.issueType.slice(1)} · ${stakeholder?.label || "Issue"}`,
      title: node.label,
      body: node.detail || node.meta || "This node was generated from the active case structure.",
    };
  }

  if (node.id === "moderation-burden") {
    return {
      kicker: `Teacher load ${state.metrics.teacherLoad}`,
      title: titles[node.id],
      body: "The swarm is detecting that facilitation, exception handling, and review workload are accumulating faster than the current instructional flow can absorb.",
    };
  }

  if (node.id === "governance" || node.id === "telemetry-scope") {
    return {
      kicker: `Privacy ${state.metrics.privacy}`,
      title: titles[node.id] || node.label,
      body: "This issue cluster points to data handling ambiguity. If it keeps growing, adoption risk increases for both IT and administrative reviewers.",
    };
  }

  if (node.id === "adaptive-pathing") {
    return {
      kicker: `Personalization ${state.metrics.personalization}`,
      title: titles[node.id],
      body: "The swarm sees strong personalization potential here, but it may over-direct learner decisions if the rationale remains hidden.",
    };
  }

  if (node.id === "evidence-trace") {
    return {
      kicker: `Evidence ${state.evidence.length}`,
      title: titles[node.id],
      body: "This node reflects whether redesign decisions are leaving a usable trail of evidence that can support memo writing, critique, and reflection.",
    };
  }

  if (node.id === "caption-parity") {
    return {
      kicker: `Accessibility ${state.metrics.accessibility}`,
      title: titles[node.id],
      body: "The swarm is flagging that equivalent access across captions, alt text, pacing, and explanation layers is still fragile.",
    };
  }

  if (conflict) {
    return {
      kicker: stakeholder ? stakeholder.status : "Issue detected",
      title: titles[node.id] || conflict.title,
      body: conflict.body,
    };
  }

  return {
    kicker: node.meta || "Issue detected",
    title: titles[node.id] || node.label,
    body: stakeholder ? stakeholder.summary : "This node represents a live issue cluster in the swarm graph.",
  };
}

function moveNetworkTooltip(event) {
  if (!dom.networkTooltip || dom.networkTooltip.hidden || !dom.networkStage) {
    return;
  }

  const stageRect = dom.networkStage.getBoundingClientRect();
  const tooltipRect = dom.networkTooltip.getBoundingClientRect();
  const offset = 18;
  const rawLeft = event.clientX - stageRect.left + offset;
  const rawTop = event.clientY - stageRect.top - tooltipRect.height - offset;
  const clampedLeft = clamp(rawLeft, 12, stageRect.width - tooltipRect.width - 12);
  const clampedTop = rawTop < 12 ? clamp(event.clientY - stageRect.top + offset, 12, stageRect.height - tooltipRect.height - 12) : rawTop;

  dom.networkTooltip.style.left = `${clampedLeft}px`;
  dom.networkTooltip.style.top = `${clampedTop}px`;
}

function showNetworkTooltip(event, node) {
  if (!dom.networkTooltip) {
    return;
  }

  const issue = describeNodeIssue(node);
  dom.networkTooltipKicker.textContent = issue.kicker;
  dom.networkTooltipTitle.textContent = issue.title;
  dom.networkTooltipBody.textContent = issue.body;
  dom.networkTooltip.hidden = false;
  moveNetworkTooltip(event);
}

function hideNetworkTooltip() {
  if (!dom.networkTooltip) {
    return;
  }
  dom.networkTooltip.hidden = true;
}

function initializeGraphRenderer() {
  if (graphRenderer.initialized || !window.d3 || !dom.networkSvg) {
    return;
  }

  const d3 = window.d3;
  graphRenderer.svg = d3.select(dom.networkSvg);
  graphRenderer.root = graphRenderer.svg.append("g").attr("class", "network-root");
  graphRenderer.linkLayer = graphRenderer.root.append("g").attr("class", "network-links");
  graphRenderer.nodeLayer = graphRenderer.root.append("g").attr("class", "network-nodes");
  graphRenderer.zoom = d3
    .zoom()
    .scaleExtent([0.6, 2.5])
    .on("zoom", (event) => {
      graphRenderer.root.attr("transform", event.transform);
    });

  graphRenderer.svg.call(graphRenderer.zoom).on("dblclick.zoom", null);
  graphRenderer.simulation = d3
    .forceSimulation()
    .force(
      "link",
      d3
        .forceLink()
        .id((node) => node.id)
        .distance((link) => {
          const sourceId = typeof link.source === "object" ? link.source.id : link.source;
          return link.kind === "satellite" ? 38 : sourceId === "proposal" ? 150 : 90;
        })
        .strength((link) => (link.kind === "satellite" ? 0.95 : 0.28))
    )
    .force("charge", d3.forceManyBody().strength((node) => (node.type === "satellite" ? -26 : node.type === "core" ? -620 : node.type === "stakeholder" ? -280 : -120)))
    .force("collide", d3.forceCollide().radius((node) => nodeRadius(node) + (node.type === "satellite" ? 4 : 16)))
    .force("x", d3.forceX((node) => resolveClusterTarget(node).x).strength((node) => (node.type === "satellite" ? 0.24 : 0.07)))
    .force("y", d3.forceY((node) => resolveClusterTarget(node).y).strength((node) => (node.type === "satellite" ? 0.24 : 0.07)));

  window.addEventListener("resize", () => {
    if (!graphRenderer.initialized) {
      return;
    }
    resizeGraphRenderer();
    graphRenderer.simulation.alpha(0.45).restart();
  });

  graphRenderer.initialized = true;
  resizeGraphRenderer();
}

function resizeGraphRenderer() {
  if (!graphRenderer.initialized || !dom.networkStage) {
    return;
  }

  const rect = dom.networkStage.getBoundingClientRect();
  graphRenderer.width = Math.max(320, Math.round(rect.width));
  graphRenderer.height = Math.max(420, Math.round(rect.height));
  graphRenderer.svg.attr("viewBox", `0 0 ${graphRenderer.width} ${graphRenderer.height}`);
}

function resetGraphViewport() {
  if (!graphRenderer.initialized || !window.d3) {
    return;
  }
  graphRenderer.svg.transition().duration(450).call(graphRenderer.zoom.transform, window.d3.zoomIdentity);
}

function updateGraphRenderer(frame) {
  if (!window.d3 || !graphRenderer.initialized) {
    return;
  }

  const d3 = window.d3;
  resizeGraphRenderer();

  const previousPositions = new Map();
  graphRenderer.nodeLayer.selectAll(".network-node").each((node) => {
    previousPositions.set(node.id, { x: node.x, y: node.y, vx: node.vx, vy: node.vy });
  });

  const nodes = frame.nodes.map((node, index) => {
    const previous = previousPositions.get(node.id);
    const target = resolveClusterTarget(node);
    const next = { ...node };
    if (previous) {
      Object.assign(next, previous);
    } else {
      next.x = target.x + graphJitter(index * 1.3 + state.graph.iteration, 24);
      next.y = target.y + graphJitter(index * 1.8 + state.graph.iteration, 18);
    }
    if (next.type === "core") {
      next.fx = target.x;
      next.fy = target.y;
      next.x = target.x;
      next.y = target.y;
    } else {
      next.fx = null;
      next.fy = null;
    }
    return next;
  });

  const highlightedNodeIds = new Set(["proposal"]);
  frame.nodes.forEach((node) => {
    if (node.id === state.activeStakeholder || node.stakeholder === state.activeStakeholder || node.parent === state.activeStakeholder) {
      highlightedNodeIds.add(node.id);
      if (node.parent) {
        highlightedNodeIds.add(node.parent);
      }
    }
  });

  frame.links.forEach((link) => {
    if (highlightedNodeIds.has(link.source) || highlightedNodeIds.has(link.target) || link.source === state.activeStakeholder || link.target === state.activeStakeholder) {
      highlightedNodeIds.add(link.source);
      highlightedNodeIds.add(link.target);
    }
  });

  const links = frame.links.map((link) => ({
    ...link,
    isHighlighted:
      highlightedNodeIds.has(link.source) ||
      highlightedNodeIds.has(link.target) ||
      link.source === state.activeStakeholder ||
      link.target === state.activeStakeholder,
  }));

  const linkSelection = graphRenderer.linkLayer.selectAll(".network-link").data(links, (link) => link.id);

  linkSelection.exit().remove();

  const linkMerge = linkSelection
    .enter()
    .append("line")
    .attr("class", "network-link")
    .merge(linkSelection)
    .attr("data-tone", (link) => link.tone)
    .classed("is-active", (link) => link.isHighlighted)
    .classed("is-faded", (link) => !link.isHighlighted)
    .attr("stroke-width", (link) => (link.kind === "satellite" ? link.weight : link.weight + 0.2));

  const nodeSelection = graphRenderer.nodeLayer.selectAll(".network-node").data(nodes, (node) => node.id);
  nodeSelection.exit().remove();

  const nodeEnter = nodeSelection.enter().append("g").attr("class", "network-node");

  nodeEnter
    .filter((node) => node.type === "satellite")
    .append("circle")
    .attr("class", "node-shell")
    .attr("r", (node) => nodeRadius(node));

  const majorNodes = nodeEnter.filter((node) => node.type !== "satellite");
  majorNodes.append("circle").attr("class", "node-halo").attr("r", (node) => nodeRadius(node) + 6);
  majorNodes.append("circle").attr("class", "node-body").attr("r", (node) => nodeRadius(node));
  majorNodes.append("text").attr("class", "node-icon").attr("y", 0).text((node) => node.icon);
  majorNodes
    .append("text")
    .attr("class", "node-label")
    .attr("y", (node) => nodeRadius(node) + 16)
    .text((node) => node.label);
  majorNodes
    .append("text")
    .attr("class", "node-meta")
    .attr("y", (node) => nodeRadius(node) + 29)
    .text((node) => node.meta);

  const nodeMerge = nodeEnter
    .merge(nodeSelection)
    .attr("data-tone", (node) => node.tone)
    .attr("data-type", (node) => node.type)
    .classed("is-active", (node) => node.id === state.activeStakeholder || node.stakeholder === state.activeStakeholder)
    .classed("is-selected", (node) => node.id === state.selectedGraphNodeId)
    .classed("is-hotspot", (node) => Boolean(node.isHotspot))
    .classed("is-faded", (node) => !highlightedNodeIds.has(node.id) && node.type !== "core");

  nodeMerge
    .select(".node-shell")
    .attr("fill", (node) => (node.tone === "shell" ? tonePalette.shell : tonePalette[node.tone] || tonePalette.shell))
    .attr("stroke", (node) => (node.tone === "shell" ? "rgba(170, 171, 176, 0.5)" : tonePalette[node.tone] || tonePalette.neutral));

  nodeMerge.select(".node-body").attr("stroke", (node) => tonePalette[node.tone] || tonePalette.neutral);
  nodeMerge.select(".node-halo").attr("stroke", (node) => (node.tone === "danger" ? "#ffd45c" : "rgba(255, 221, 87, 0.82)"));
  nodeMerge.select(".node-label").text((node) => node.label);
  nodeMerge.select(".node-meta").text((node) => node.meta);
  nodeMerge.select(".node-icon").text((node) => node.icon);

  nodeMerge.on("click", (_, node) => {
    if (node.type === "satellite") {
      return;
    }
    state.selectedGraphNodeId = node.id;
    if (node.stakeholder && stakeholders[node.stakeholder]) {
      setStakeholder(node.stakeholder);
      return;
    }
    renderAll();
  });

  nodeMerge
    .filter((node) => node.type !== "satellite")
    .on("mouseenter", (event, node) => {
      showNetworkTooltip(event, node);
    })
    .on("mousemove", (event) => {
      moveNetworkTooltip(event);
    })
    .on("mouseleave", () => {
      hideNetworkTooltip();
    });

  nodeMerge
    .filter((node) => node.type !== "satellite")
    .call(
      d3
        .drag()
        .on("start", (event, node) => {
          if (!event.active) {
            graphRenderer.simulation.alphaTarget(0.3).restart();
          }
          node.fx = node.x;
          node.fy = node.y;
        })
        .on("drag", (event, node) => {
          node.fx = event.x;
          node.fy = event.y;
        })
        .on("end", (event, node) => {
          if (!event.active) {
            graphRenderer.simulation.alphaTarget(0);
          }
          if (node.type === "core") {
            const target = resolveClusterTarget(node);
            node.fx = target.x;
            node.fy = target.y;
          } else {
            node.fx = null;
            node.fy = null;
          }
        })
    );

  graphRenderer.simulation.nodes(nodes).on("tick", () => {
    linkMerge
      .attr("x1", (link) => link.source.x)
      .attr("y1", (link) => link.source.y)
      .attr("x2", (link) => link.target.x)
      .attr("y2", (link) => link.target.y);

    nodeMerge.attr("transform", (node) => `translate(${node.x}, ${node.y})`);
  });

  graphRenderer.simulation.force("link").links(links);
  const layoutMode = getCaseBoardSettings().layoutMode;
  const forceStrength = layoutMode === "force" ? 0.03 : layoutMode === "radial" ? 0.12 : 0.08;
  graphRenderer.simulation
    .force("x")
    .strength((node) => (node.type === "satellite" ? forceStrength + 0.12 : forceStrength));
  graphRenderer.simulation
    .force("y")
    .strength((node) => (node.type === "satellite" ? forceStrength + 0.12 : forceStrength));
  graphRenderer.simulation.alpha(0.85).restart();
}

function renderGraph() {
  hideNetworkTooltip();
  const activeCase = getCaseById(state.activeCaseId, getActiveCourse());
  dom.networkEmptyPreview.hidden = Boolean(activeCase);
  dom.graphCycle.textContent = String(state.graph.iteration);
  dom.graphEvents.innerHTML = state.graph.events
    .map(
      (event) => `
        <article class="evidence-item">
          <strong>${event.title}</strong>
          <p>${event.body}</p>
        </article>
      `
    )
    .join("");

  const scores = computeScores();
  const frame = buildRenderableGraph();
  dom.networkMetaGrid.hidden = Boolean(activeCase);
  if (state.selectedGraphNodeId && !frame.nodes.find((node) => node.id === state.selectedGraphNodeId)) {
    state.selectedGraphNodeId = "";
  }
  const counts = {
    nodes: frame.nodes.length,
    links: frame.links.length,
  };

  dom.stageNoteTitle.textContent = activeCase
    ? state.activeMapLayer === "cohort"
      ? "This view combines patterns shared across the class."
      : state.activeMapLayer === "personal"
        ? "Hover to inspect an issue and click to add your notes."
        : "Hover a node to inspect the issue behind it."
    : "Create or choose a case to generate the network.";
  dom.stageNoteBody.textContent = activeCase
    ? state.activeMapLayer === "cohort"
      ? "Class view groups repeated student concerns into shared clusters instead of showing every personal note."
      : state.activeMapLayer === "personal"
        ? "Click a node to select it, then add a note in the right lens panel. The map updates after new questions or notes."
        : "Click a stakeholder node to change perspective. The network updates when the case changes or a new question is asked."
    : "Once a case is available, this map will show stakeholders, tensions, and evidence links.";

  const metaItems = activeCase
    ? getCaseNetworkMeta([
        {
          title: "What You See",
          body: `${counts.nodes} nodes and ${counts.links} links are visible in the current ${state.activeMapLayer === "cohort" ? "class" : state.activeMapLayer === "personal" ? "personal" : "base"} map.`,
        },
        {
          title: "Main Pressure Point",
          body:
            scores.conflict >= 70
              ? "Teacher load and governance are driving the strongest tension right now."
              : "No single issue is dominating. The main tensions are spread across smaller clusters.",
        },
        {
          title: "When It Updates",
          body: "The map refreshes when the selected case changes or when a new question is asked.",
        },
        {
          title: "Current Layer",
          body:
            state.activeMapLayer === "cohort"
              ? "Class view shows repeated agendas and shared notes across the course."
              : state.activeMapLayer === "personal"
                ? "My view mixes the instructor base map with your own notes and AI-added issues."
                : "Base map shows the instructor-authored case before student additions.",
        },
      ])
    : [
        {
          title: "Before You Start",
          body:
            state.activeRole === "admin"
              ? "Create a case from a course brief, then the network will appear here."
              : "Choose one published case from your course to load the network.",
        },
      ];

  dom.networkMetaGrid.innerHTML = metaItems
    .map(
      (item) => `
        <article class="network-meta-card">
          <strong>${item.title}</strong>
          <p>${item.body}</p>
        </article>
      `
    )
    .join("");

  if (!activeCase) {
    dom.networkSvg.setAttribute("viewBox", "0 0 1000 720");
    dom.networkSvg.innerHTML = "";
    return;
  }

  if (!window.d3) {
    dom.networkSvg.setAttribute("viewBox", "0 0 1000 720");
    dom.networkSvg.innerHTML = `
      <text x="500" y="340" text-anchor="middle" fill="#97a9ff" font-size="22" font-family="Space Grotesk, sans-serif">
        D3 failed to load
      </text>
      <text x="500" y="374" text-anchor="middle" fill="#aaabb0" font-size="12" font-family="Inter, sans-serif">
        Reload with network access to enable the case map.
      </text>
    `;
    return;
  }

  initializeGraphRenderer();
  updateGraphRenderer(frame);
}

function getSelectedRenderableNode() {
  if (!state.selectedGraphNodeId) return null;
  const frame = buildRenderableGraph();
  return frame.nodes.find((node) => node.id === state.selectedGraphNodeId) || null;
}

let graphLoop = null;

function regenerateGraph(reason = "manual refresh") {
  state.graph.iteration += 1;
  const snapshot = buildGraphSnapshot(reason);
  state.graph.nodes = snapshot.nodes;
  state.graph.links = snapshot.links;
  state.graph.events.unshift({
    title: `Cycle ${state.graph.iteration}`,
    body: `${snapshot.nodes.length} nodes and ${snapshot.links.length} links regenerated from "${reason}".`,
  });
  state.graph.events = state.graph.events.slice(0, 4);
}

function ensureGraphCurrent() {
  const activeCase = getActiveCaseRecord();
  const activeRun = state.activeRole === "user" ? getActiveLearnerRun() : null;
  const signature = JSON.stringify({
    role: state.activeRole,
    layer: state.activeMapLayer,
    caseId: activeCase?.id || "",
    learnerId: state.activeLearnerId || "",
    stakeholder: state.activeStakeholder,
    agendaCount: asArray(activeRun?.agendaNodes).length,
    annotationCount: asArray(activeRun?.annotations).length,
    aiCount: asArray(activeRun?.aiGeneratedNodes).length,
    layoutMode: getCaseBoardSettings(activeCase).layoutMode,
  });
  if (signature !== lastGraphSignature) {
    lastGraphSignature = signature;
    regenerateGraph("state sync");
  }
}

function syncGraphLoop() {
  if (graphLoop) {
    clearInterval(graphLoop);
    graphLoop = null;
  }
}

function renderStakeholderFocus() {
  const activeCase = getCaseById(state.activeCaseId, getActiveCourse());
  if (!activeCase) {
    dom.activeStakeholderPill.textContent = "No case";
    dom.activeStakeholderStatus.textContent = "Pick a case";
    dom.lensName.textContent = "Selected lens";
    dom.lensSummary.textContent =
      state.activeRole === "admin"
        ? "Start with a case."
        : "Pick a case.";
    dom.lensStatus.textContent = state.activeRole === "admin" ? "Start" : "Pick";
    dom.lensScore.textContent = "--";
    dom.orbitTitle.textContent = "Case preview";
    dom.orbitIcon.textContent = "hub";
    dom.orbitSummary.textContent = "The panel updates when a case is open.";
    dom.chatBadge.textContent = "No case";
    dom.topTensions.innerHTML = `
      <article class="tension-item">
        <strong>Start here</strong>
        <p>${state.activeRole === "admin" ? "Create a case." : "Pick a case."}</p>
      </article>
    `;
    dom.evidenceStrip.innerHTML = `
      <article class="evidence-item">
        <strong>No evidence</strong>
        <p>Open a case.</p>
      </article>
    `;
    dom.stakeholderPills.innerHTML = "";
    if (dom.perspectiveStakeholderPills) {
      dom.perspectiveStakeholderPills.innerHTML = "";
    }
    dom.selectedNodeKicker.textContent = "Hover or click";
    dom.selectedNodeTitle.textContent = "No node selected";
    dom.selectedNodeCopy.textContent = "Hover or click a node in the network to inspect it here.";
    if (dom.quickAnnotationForm) {
      dom.quickAnnotationForm.hidden = true;
    }
    if (dom.quickAnnotationSubmit) {
      dom.quickAnnotationSubmit.disabled = true;
    }
    dom.perspectiveConflicts.innerHTML = `
      <article class="conflict-card">
        <strong>No lens</strong>
        <p>Open a case.</p>
      </article>
    `;
    return;
  }

  const stakeholder = getCaseStakeholderMeta(state.activeStakeholder);
  const conflicts = stakeholderConflicts(state.activeStakeholder);
  const scores = computeScores();
  const riskScore = Math.round(scores.conflict * 0.65 + conflicts.length * 6);
  const selectedNode = getSelectedRenderableNode();
  const selectedNodeIssue = selectedNode ? describeNodeIssue(selectedNode) : null;

  dom.activeStakeholderPill.textContent = `${stakeholder.label} focus`;
  dom.activeStakeholderStatus.textContent = `${stakeholder.status} · cycle ${state.graph.iteration}`;
  dom.lensName.textContent = stakeholder.label;
  dom.lensSummary.textContent = stakeholder.summary;
  dom.lensStatus.textContent = stakeholder.status;
  dom.lensScore.textContent = String(riskScore);
  dom.orbitTitle.textContent = `${stakeholder.label} orbit`;
  dom.orbitIcon.textContent = stakeholder.icon;
  dom.orbitSummary.textContent = stakeholder.summary;
  dom.chatBadge.textContent = `${stakeholder.label} online`;
  dom.activeStakeholderStatus.textContent = `${stakeholder.status} · cycle ${state.graph.iteration}`;
  dom.chatBadge.textContent = `${stakeholder.label} view`;
  dom.activeStakeholderStatus.textContent = stakeholder.status;

  dom.topTensions.innerHTML = conflicts
    .map(
      (item) => `
        <article class="tension-item">
          <strong>${item.title}</strong>
          <p>${item.body}</p>
        </article>
      `
    )
    .join("");

  dom.evidenceStrip.innerHTML = state.evidence
    .slice(-4)
    .reverse()
    .map(
      (item) => `
        <article class="evidence-item">
          <strong>${item.title}</strong>
          <p>${item.body}</p>
        </article>
      `
    )
    .join("");

  const stakeholderPillMarkup = Object.entries(stakeholders)
    .map(
      ([key, item]) => `
        <button class="${key === state.activeStakeholder ? "token-active" : "token"}" data-pill="${key}">
          ${item.label}
        </button>
      `
    )
    .join("");
  dom.stakeholderPills.innerHTML = stakeholderPillMarkup;
  if (dom.perspectiveStakeholderPills) {
    dom.perspectiveStakeholderPills.innerHTML = stakeholderPillMarkup;
  }

  dom.selectedNodeKicker.textContent = selectedNodeIssue?.kicker || "Hover or click";
  dom.selectedNodeTitle.textContent = selectedNodeIssue?.title || "No node selected";
  dom.selectedNodeCopy.textContent =
    selectedNodeIssue?.body || "Hover or click a node in the network to inspect it here.";
  if (dom.quickAnnotationForm) {
    dom.quickAnnotationForm.hidden = state.activeRole !== "user";
    const visibilitySelect = dom.quickAnnotationForm.querySelector('select[name="visibility"]');
    if (visibilitySelect) {
      const cohortOption = visibilitySelect.querySelector('option[value="cohort"]');
      if (cohortOption) {
        cohortOption.disabled = getCaseBoardSettings(activeCase).sharingMode === "private";
      }
    }
  }
  if (dom.quickAnnotationSubmit) {
    dom.quickAnnotationSubmit.disabled = !(state.activeRole === "user" && selectedNode);
  }

  dom.perspectiveConflicts.innerHTML = conflicts
    .map(
      (item) => `
        <article class="conflict-card" data-level="${item.level}">
          <strong>${item.title}</strong>
          <p>${item.body}</p>
        </article>
      `
    )
    .join("");
}

function renderChat() {
  const filtered = state.chat.filter((entry) => entry.stakeholder === state.activeStakeholder);
  dom.chatThread.innerHTML = filtered.length
    ? filtered
        .map(
          (entry) => `
            <article class="chat-message ${entry.role}">
              <div>${entry.body}</div>
              <small>${entry.role === "agent" ? getCaseStakeholderMeta(entry.stakeholder).label : "You"}</small>
            </article>
          `
        )
        .join("")
    : `
      <article class="chat-message agent">
        <div>${getCaseUiCopy().emptyChatMessage || "No dialogue yet."}</div>
        <small>${getCaseStakeholderMeta(state.activeStakeholder).label}</small>
      </article>
    `;
  dom.chatThread.scrollTop = dom.chatThread.scrollHeight;
}

function renderMatrix() {
  const activeCase = getActiveCaseRecord();
  const { personalization, teacherLoad, privacy, accessibility } = state.metrics;
  const { feasibility, alignment, conflict } = computeScores();
  dom.radarFill.setAttribute("points", polygonPoints(radarValues()));
  dom.matrixState.textContent = conflict > 70 ? "Needs Attention" : alignment > 75 ? "Balanced" : "Watch Closely";

  const bars = [
    { label: "Personalization", value: personalization, color: "var(--primary)" },
    { label: "Privacy", value: privacy, color: "var(--tertiary-dim)" },
    { label: "Accessibility", value: accessibility, color: "var(--primary)" },
    { label: "Feasibility", value: feasibility, color: "var(--tertiary-dim)" },
    { label: "Teacher slack", value: 100 - teacherLoad, color: "var(--secondary)" },
  ];

  dom.metricBars.innerHTML = bars
    .map(
      (item) => `
        <div class="metric-bar">
          <header><span>${item.label}</span><strong>${item.value}%</strong></header>
          <div class="bar-track">
            <div class="bar-fill" style="width:${item.value}%; background:${item.color};"></div>
          </div>
        </div>
      `
    )
    .join("");

  const matrixInsights = asArray(activeCase?.matrixInsights);
  dom.matrixInsights.innerHTML = matrixInsights.length
    ? matrixInsights
        .map(
          (item) => `
            <article class="insight-card">
              <strong>${item.title}</strong>
              <p>${item.body}</p>
            </article>
          `
        )
        .join("")
    : emptyNoteMarkup("No insights");

  dom.decisionLog.innerHTML = state.decisions.length
    ? state.decisions
        .map(
          (item) => `
            <article class="decision-item">
              <time>${item.stamp}</time>
              <strong>${item.title}</strong>
              <p>${item.body}</p>
            </article>
          `
        )
        .join("")
    : emptyNoteMarkup("No history");
}

function renderSandbox() {
  const activeCase = getActiveCaseRecord();
  const { alignment, conflict } = computeScores();
  const loadBand = state.metrics.teacherLoad > 70 ? "Very high" : state.metrics.teacherLoad > 55 ? "High" : "Moderate";
  const lag = Math.round(8 + conflict * 0.12);
  const instructorMode = state.activeRole === "admin";

  dom.cohesionScore.textContent = `${alignment}%`;
  dom.cognitiveLoad.textContent = loadBand;
  dom.inferenceLag.textContent = `${lag}ms`;
  dom.simulationState.textContent = instructorMode
    ? conflict > 72
      ? "Critical review"
      : alignment > 75
        ? "Stable"
        : "Needs tuning"
    : "Instructor only";

  Object.entries(dom.metricLabels).forEach(([key, label]) => {
    label.textContent = String(state.metrics[key]);
  });
  document.getElementById("autonomy-toggle").checked = state.autonomousIteration;
  document.getElementById("autonomy-toggle").disabled = !instructorMode;
  Object.values(dom.metricInputs).forEach((input) => {
    input.disabled = !instructorMode;
  });
  document.querySelectorAll("[data-scenario]").forEach((button) => {
    button.disabled = !instructorMode;
  });

  const sandboxFeed = asArray(activeCase?.sandboxFeed);
  dom.reactionFeed.innerHTML = sandboxFeed.length
    ? sandboxFeed
        .map(
          (item) => `
            <article class="feed-item">
              <strong>${item.title || item.label}</strong>
              <p>${item.body || item.note || item.value || ""}</p>
            </article>
          `
        )
        .join("")
    : emptyNoteMarkup("No notes");
}

function renderReport() {
  const { feasibility } = computeScores();
  const activeCase = getCaseById(state.activeCaseId);
  const course = getActiveCourse();
  const activeLearner = getActiveLearner();
  const uiCopy = getCaseUiCopy();
  const summary = uiCopy.reportSummary || activeCase?.summary || "";
  const reportTensions = state.evidence.slice(-3).reverse();
  const reportRecommendations = state.chat.filter((item) => item.role === "agent").slice(-2).reverse();

  dom.reportSummary.textContent = summary || "No summary";

  dom.reportTensions.innerHTML = reportTensions.length
    ? reportTensions
        .map(
          (item) => `
            <article class="memo-item">
              <strong>${item.title}</strong>
              <p>${item.body}</p>
            </article>
          `
        )
        .join("")
    : emptyNoteMarkup("No tensions");

  dom.reportRecommendations.innerHTML = reportRecommendations.length
    ? reportRecommendations
        .map(
          (item) => `
            <article class="memo-item">
              <strong>Recommendation</strong>
              <p>${item.body}</p>
            </article>
          `
        )
        .join("")
    : emptyNoteMarkup("No recommendations");

  dom.reportEvidence.innerHTML = state.evidence.length
    ? state.evidence
        .slice(-5)
        .reverse()
        .map(
          (item) => `
            <article class="memo-item">
              <strong>${item.title}</strong>
              <p>${item.body}</p>
            </article>
          `
        )
        .join("")
    : emptyNoteMarkup("No evidence");

  const rubric = activeCase
    ? [
        { label: state.activeRole === "admin" ? "Lens coverage" : "Perspective shift", value: Math.min(96, 60 + state.evidence.length * 8) },
        { label: state.activeRole === "admin" ? "Constraint clarity" : "Constraint clarity", value: Math.round((state.metrics.privacy + state.metrics.accessibility) / 2) },
        { label: state.activeRole === "admin" ? "Redesign quality" : "Revision quality", value: feasibility },
        { label: state.activeRole === "admin" ? "Evidence trace" : "Evidence trace", value: Math.min(94, 58 + state.evidence.length * 7) },
      ]
    : [];

  dom.rubricList.innerHTML = rubric.length
    ? rubric
        .map(
          (item) => `
            <article class="rubric-item">
              <header><span>${item.label}</span><strong>${item.value}%</strong></header>
              <div class="bar-track">
                <div class="bar-fill" style="width:${item.value}%; background:var(--primary);"></div>
              </div>
            </article>
          `
        )
        .join("")
    : emptyNoteMarkup("No scores");

  dom.reflectionBadge.textContent =
    state.activeRole === "admin"
      ? "Instructor View"
      : `${activeLearner?.name || "Student"} reflection`;

  const reflectionPrompts = asArray(activeCase?.reflectionPrompts);
  dom.reflectionPrompts.innerHTML = reflectionPrompts.length
    ? reflectionPrompts.map((item) => `<article class="prompt-item">${item}</article>`).join("")
    : emptyNoteMarkup("No prompts");

  dom.reflectionFeed.innerHTML = state.timeline.length
    ? state.timeline
        .map(
          (item, index) => `
            <article class="reflection-item">
              <strong>Iteration ${index + 1}</strong>
              <p>${item}</p>
            </article>
          `
        )
        .join("")
    : emptyNoteMarkup("No activity");
}

function renderAll() {
  if (dom.visualizerInput) {
    dom.visualizerInput.placeholder = "Ask what conflict matters most in this case...";
  }
  const chatInput = document.getElementById("chat-input");
  syncActiveCaseState();
  ensureGraphCurrent();
  dom.visualizerLayout?.classList.toggle("is-focused", hasActiveCase());
  renderPlatformControls();
  renderPipelineConsole();
  renderConstraints();
  renderNavigation();
  renderSidebar();
  renderGraph();
  renderStakeholderFocus();
  renderChat();
  renderMatrix();
  renderSandbox();
  renderReport();
  normalizeRenderedCopy();
  if (tutorialState.active) {
    window.requestAnimationFrame(renderTutorialStep);
  }
}

function renderLandingLogin() {
  const configured = initializeSupabase() !== null;
  const activeInstitution = getActiveInstitution();
  const activeCourse = getActiveCourse();
  const activeIdentity = state.activeRole === "admin" ? getActiveInstructor() : getActiveLearner();
  dom.landingLoginEmail.value = state.auth.sessionEmail || dom.landingLoginEmail.value || "";
  dom.landingLoginPassword.value = "";
  dom.landingLoginEmail.disabled = state.auth.loading;
  dom.landingLoginPassword.disabled = state.auth.loading;
  dom.landingJoinEmail.disabled = state.auth.loading;
  dom.landingJoinPassword.disabled = state.auth.loading;
  dom.landingJoinCode.disabled = state.auth.loading;
  dom.landingAuthStatus.textContent = state.auth.loading ? "Checking..." : state.auth.message;
  dom.landingLoginHelper.textContent =
    state.auth.source === "supabase" && activeInstitution && activeCourse
      ? `${activeInstitution.name} - ${activeCourse.code} ${activeCourse.name}`
      : state.auth.source === "supabase"
        ? "No course linked yet."
      : configured
        ? ""
        : "";
  dom.landingJoinHelper.textContent = configured
    ? "Sign in as a student, then enter your course code."
    : "";
  normalizeRenderedCopy();
}
function normalizeRenderedCopy() {
  return;
}

function clearTutorialHighlight() {
  if (tutorialState.target) {
    tutorialState.target.classList.remove("tour-target-active");
    tutorialState.target = null;
  }
}

function getTutorialSteps() {
  const hasCase = hasActiveCase();
  if (state.activeRole === "admin") {
    return [
      {
        selector: "#course-select",
        title: "Choose the Course",
        body: "Start by making sure you are in the right course before creating or editing a case.",
      },
      {
        selector: "#case-select",
        title: "Pick the Case You Want to Work On",
        body: "Use this list to switch between drafts and published cases.",
      },
      {
        selector: "#pipeline-console",
        title: "Create or Publish a Case",
        body: "Paste a course brief here to make a case, then publish it when students should see it.",
        view: "visualizer",
      },
      {
        selector: "#network-stage",
        title: "Read the Case Map",
        body: "This map shows the people, constraints, and tensions that shape the design decision.",
        view: "visualizer",
      },
      {
        selector: "#visualizer-form",
        title: "Ask a Question",
        body: "Ask about the most important conflict or a stakeholder concern to add more insight to the map.",
        view: "visualizer",
      },
      ...(hasCase
        ? [
            {
              selector: "#report-summary",
              title: "Turn the Analysis into a Summary",
              body: "When you are ready, open the report view to review the summary, tensions, and evidence.",
              view: "report",
            },
          ]
        : []),
    ];
  }

  return [
    {
      selector: "#course-select",
      title: "Check the Course",
      body: "Make sure you are in the course your instructor asked you to join.",
    },
    {
      selector: "#case-select",
      title: "Choose a Published Case",
      body: "This list only shows cases your instructor has shared with students.",
    },
    {
      selector: "#pipeline-console",
      title: "Add Your Own Idea",
      body: "Use this area to add one question or concern. The AI will add related issues to the map.",
      view: "visualizer",
    },
    {
      selector: "#network-stage",
      title: "Explore the Case Map",
      body: "Hover to inspect an issue and click a person to change the perspective.",
      view: "visualizer",
    },
    {
      selector: "#chat-form",
      title: "Ask from One Perspective",
      body: "Use this question box when you want to hear what one person in the case would worry about.",
      view: "perspectives",
    },
    ...(hasCase
      ? [
          {
            selector: "#reflection-prompts",
            title: "Write Your Reflection",
            body: "Use these prompts to turn what you found in the map into a short reflection.",
            view: "report",
          },
        ]
      : []),
  ];
}

function positionTutorialCard(target) {
  const rect = target.getBoundingClientRect();
  const cardWidth = Math.min(360, window.innerWidth - 32);
  const preferredLeft = Math.min(
    window.innerWidth - cardWidth - 16,
    Math.max(16, rect.left + rect.width / 2 - cardWidth / 2)
  );
  const showAbove = rect.bottom + 220 > window.innerHeight;
  const top = showAbove ? Math.max(16, rect.top - 196) : Math.min(window.innerHeight - 180, rect.bottom + 16);
  dom.tourCard.style.left = `${preferredLeft}px`;
  dom.tourCard.style.top = `${top}px`;
}

function renderTutorialStep() {
  if (!tutorialState.active) return;
  const step = tutorialState.steps[tutorialState.stepIndex];
  if (!step) {
    endTutorial(true);
    return;
  }

  if (step.view && state.activeView !== step.view) {
    setView(step.view);
    return;
  }

  const target = document.querySelector(step.selector);
  if (!target) {
    tutorialState.stepIndex += 1;
    renderTutorialStep();
    return;
  }

  clearTutorialHighlight();
  tutorialState.target = target;
  target.classList.add("tour-target-active");
  target.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
  dom.tourOverlay.classList.remove("is-hidden");
  dom.tourOverlay.setAttribute("aria-hidden", "false");
  dom.tourStepLabel.textContent = `Step ${tutorialState.stepIndex + 1} of ${tutorialState.steps.length}`;
  dom.tourTitle.textContent = step.title;
  dom.tourBody.textContent = step.body;
  dom.tourBack.disabled = tutorialState.stepIndex === 0;
  dom.tourNext.textContent = tutorialState.stepIndex === tutorialState.steps.length - 1 ? "Finish" : "Next";
  positionTutorialCard(target);
}

function startTutorial(force = false) {
  const roleKey = state.activeRole;
  if (tutorialState.active && !force) return;
  if (!force && tutorialState.seenByRole[roleKey]) return;
  clearTutorialHighlight();
  tutorialState.steps = getTutorialSteps();
  tutorialState.stepIndex = 0;
  tutorialState.active = tutorialState.steps.length > 0;
  if (!tutorialState.active) return;
  window.requestAnimationFrame(renderTutorialStep);
}

function endTutorial(markSeen = true) {
  if (markSeen) {
    tutorialState.seenByRole[state.activeRole] = true;
    persistTutorialState();
  }
  clearTutorialHighlight();
  tutorialState.active = false;
  tutorialState.stepIndex = 0;
  tutorialState.steps = [];
  dom.tourOverlay.classList.add("is-hidden");
  dom.tourOverlay.setAttribute("aria-hidden", "true");
}

function advanceTutorial(direction) {
  if (!tutorialState.active) return;
  if (direction > 0 && tutorialState.stepIndex >= tutorialState.steps.length - 1) {
    endTutorial(true);
    return;
  }
  tutorialState.stepIndex = Math.max(0, Math.min(tutorialState.steps.length - 1, tutorialState.stepIndex + direction));
  renderTutorialStep();
}

function createInstructorProfile(name, course) {
  const instructor = {
    id: `instructor-${slugify(name)}-${Date.now().toString(36)}`,
    name,
    title: "Course instructor",
    courseId: course.id,
  };
  course.instructors.push(instructor);
  persistPlatformState();
  return instructor;
}

function createLearnerProfile(name, course) {
  const learner = {
    id: `learner-${slugify(name)}-${Date.now().toString(36)}`,
    name,
    focus: "New reflection run",
    section: course.code,
    courseId: course.id,
  };
  course.learners.push(learner);
  persistPlatformState();
  return learner;
}

function findCourseByJoinCode(joinCode) {
  const normalized = String(joinCode || "").trim().toUpperCase();
  if (!normalized) return null;
  for (const institution of state.platform.institutions) {
    for (const course of institution.courses || []) {
      if (String(course.joinCode || "").trim().toUpperCase() === normalized) {
        return { institution, course };
      }
    }
  }
  return null;
}

function joinCourseWithCode(name, joinCode) {
  const match = findCourseByJoinCode(joinCode);
  if (!match) {
    throw new Error("That join code was not found.");
  }

  const { institution, course } = match;
  normalizeCourseData(course);
  const normalizedName = String(name || "").trim() || "Student";

  let learner =
    getLearners(course).find((item) => item.name.toLowerCase() === normalizedName.toLowerCase()) ||
    createLearnerProfile(normalizedName, course);

  state.activeRole = "user";
  state.activeInstitutionId = institution.id;
  state.activeCourseId = course.id;
  state.activeLearnerId = learner.id;
  state.activeCaseId = "";
  state.auth = {
    ...state.auth,
    source: "local",
    loading: false,
    message: `Joined ${course.code} with the shared course code.`,
  };
  ensureActiveSelections();
  persistSessionState();
  return { institution, course, learner };
}

function generateAgendaExpansions(agendaNode, activeCase = getActiveCaseRecord()) {
  const baseText = `${agendaNode.title} ${agendaNode.body}`;
  const primaryStakeholder = inferStakeholderFromText(baseText, agendaNode.stakeholder || state.activeStakeholder);
  const boardSettings = getCaseBoardSettings(activeCase);
  const relatedStakeholders = Array.from(
    new Set([
      primaryStakeholder,
      state.activeStakeholder,
      inferStakeholderFromText(activeCase?.summary || "", "teacher"),
    ])
  ).filter((key) => stakeholders[key]);

  return relatedStakeholders.slice(0, boardSettings.maxAiExpansionsPerNode).map((stakeholderKey, index) => {
    const stakeholderMeta = getCaseStakeholderMeta(stakeholderKey);
    const constraint = asArray(activeCase?.constraints)[index] || activeCase?.summary || "Design constraint";
    return {
      id: `ai-${slugify(agendaNode.title)}-${Date.now().toString(36)}-${index + 1}`,
      title:
        index === 0
          ? `${stakeholderMeta.label} concern`
          : index === 1
            ? `${stakeholderMeta.label} response`
            : `${stakeholderMeta.label} follow-up`,
      body:
        index === 0
          ? `${stakeholderMeta.label} may see this agenda as a pressure point because ${constraint.toLowerCase()}.`
          : index === 1
            ? `${stakeholderMeta.label} would likely ask for clearer evidence before this direction is adopted.`
            : `${stakeholderMeta.label} introduces a related design tension that should be checked before the case moves forward.`,
      stakeholder: stakeholderKey,
      sourceAgendaId: agendaNode.id,
      createdAt: "Now",
    };
  });
}

async function addAgendaNode(title, body = "") {
  const activeRun = getActiveLearnerRun();
  if (!activeRun) {
    throw new Error("Select a published case before adding an agenda node.");
  }
  const boardSettings = getCaseBoardSettings();

  const cleanTitle = String(title || "").trim();
  const cleanBody = String(body || "").trim();
  if (!cleanTitle) {
    throw new Error("Add a short agenda title first.");
  }
  if (asArray(activeRun.agendaNodes).length >= boardSettings.maxLearnerNodes) {
    throw new Error(`This board allows up to ${boardSettings.maxLearnerNodes} student-added nodes.`);
  }

  const agendaNode = {
    id: `agenda-${slugify(cleanTitle)}-${Date.now().toString(36)}`,
    title: cleanTitle,
    body: cleanBody || `${cleanTitle} is now being tracked in this learner run.`,
    stakeholder: inferStakeholderFromText(`${cleanTitle} ${cleanBody}`, state.activeStakeholder),
    createdAt: "Now",
  };
  const expansions = await generateAgendaExpansionsWithAi(agendaNode);

  updateActiveLearnerRunRecord((run) => {
    run.agendaNodes = [agendaNode, ...asArray(run.agendaNodes)].slice(0, boardSettings.maxLearnerNodes);
    run.aiGeneratedNodes = [...expansions, ...asArray(run.aiGeneratedNodes)].slice(
      0,
      boardSettings.maxLearnerNodes * boardSettings.maxAiExpansionsPerNode
    );
    run.timeline = [
      `${agendaNode.title} was added as a learner agenda and expanded into related issues.`,
      ...asArray(run.timeline),
    ].slice(0, 6);
    run.evidence = [
      {
        stakeholder: agendaNode.stakeholder,
        title: `Learner agenda: ${agendaNode.title}`,
        body: agendaNode.body,
      },
      ...asArray(run.evidence),
    ].slice(0, 6);
    run.status = "Agenda expanded";
    run.updatedAt = new Date().toISOString();
  });

  state.timeline = [
    `${agendaNode.title} was added as a learner agenda and expanded into related issues.`,
    ...state.timeline,
  ].slice(0, 6);
  state.evidence = [
    {
      stakeholder: agendaNode.stakeholder,
      title: `Learner agenda: ${agendaNode.title}`,
      body: agendaNode.body,
    },
    ...state.evidence,
  ].slice(0, 6);
  regenerateGraph(`agenda ${agendaNode.title}`);
  if (isSupabaseSessionActive()) {
    syncLearnerRunToSupabase(getActiveLearnerRun()).catch((error) => {
      console.error(error);
      state.auth.message = error.message || "Your node could not be saved.";
      renderLandingLogin();
    });
  }
}

function updateBoardSettings(values) {
  updateActiveCaseRecord((activeCase) => {
    activeCase.boardSettings = defaultBoardSettings({
      ...getCaseBoardSettings(activeCase),
      ...values,
      maxLearnerNodes: clamp(Number(values.maxLearnerNodes) || getCaseBoardSettings(activeCase).maxLearnerNodes, 1, 20),
      maxAiExpansionsPerNode: clamp(
        Number(values.maxAiExpansionsPerNode) || getCaseBoardSettings(activeCase).maxAiExpansionsPerNode,
        1,
        8
      ),
    });
  });
  persistActiveWorkspaceState();
  if (isSupabaseSessionActive()) {
    const activeCase = getActiveCaseRecord();
    syncCaseToSupabase(activeCase).catch((error) => {
      console.error(error);
      state.auth.message = error.message || "Board settings could not be saved.";
      renderLandingLogin();
    });
  }
}

function addNodeAnnotation(noteType, visibility, body) {
  const activeRun = getActiveLearnerRun();
  if (!activeRun) {
    throw new Error("Choose a published case before adding a note.");
  }
  if (!state.selectedGraphNodeId) {
    throw new Error("Select a node in the map first.");
  }
  const selected = buildRenderableGraph().nodes.find((node) => node.id === state.selectedGraphNodeId);
  if (!selected) {
    throw new Error("The selected node is no longer available.");
  }

  const boardSettings = getCaseBoardSettings();
  const annotation = {
    id: `annotation-${slugify(selected.id)}-${Date.now().toString(36)}`,
    targetId: selected.id,
    targetLabel: selected.label,
    targetType: "node",
    noteType: noteType || "note",
    visibility: boardSettings.sharingMode === "private" ? "private" : visibility || "private",
    body: String(body || "").trim(),
    stakeholder: selected.stakeholder || state.activeStakeholder,
    createdAt: "Now",
  };

  if (!annotation.body) {
    throw new Error("Add a short note before saving.");
  }

  updateActiveLearnerRunRecord((run) => {
    run.annotations = [annotation, ...asArray(run.annotations)].slice(0, 24);
    run.timeline = [`${selected.label} was annotated from the learner view.`, ...asArray(run.timeline)].slice(0, 8);
    run.evidence = [
      {
        stakeholder: annotation.stakeholder,
        title: `${selected.label} note`,
        body: annotation.body,
      },
      ...asArray(run.evidence),
    ].slice(0, 8);
    run.status = annotation.visibility === "cohort" ? "Shared note added" : "Private note added";
    run.updatedAt = new Date().toISOString();
  });

  state.timeline = [`${selected.label} was annotated from the learner view.`, ...state.timeline].slice(0, 8);
  state.evidence = [
    {
      stakeholder: annotation.stakeholder,
      title: `${selected.label} note`,
      body: annotation.body,
    },
    ...state.evidence,
  ].slice(0, 8);
  regenerateGraph(`annotation ${selected.label}`);
  if (isSupabaseSessionActive()) {
    syncLearnerRunToSupabase(getActiveLearnerRun()).catch((error) => {
      console.error(error);
      state.auth.message = error.message || "Your note could not be saved.";
      renderLandingLogin();
    });
  }
}

function focusLandingLogin() {
  dom.landingLoginCard?.scrollIntoView({ behavior: "smooth", block: "center" });
  window.setTimeout(() => {
    dom.landingLoginEmail?.focus();
  }, 150);
}

function openStudio() {
  dom.landingShell?.classList.add("is-hidden");
  dom.appShell?.classList.remove("is-hidden");
  window.location.hash = "studio";
  persistSessionState();
  renderAll();
  startTutorial(false);
}

function returnToLanding() {
  endTutorial(false);
  dom.appShell?.classList.add("is-hidden");
  dom.landingShell?.classList.remove("is-hidden");
  window.location.hash = "";
  state.auth.loading = false;
  renderLandingLogin();
}

function landingSeedGraph() {
  return {
    nodes: [
      { id: "core", label: "case", tone: "primary", type: "core", x: 480, y: 300 },
      { id: "teacher", label: "teacher", tone: "warm", type: "major", x: 250, y: 180 },
      { id: "student", label: "student", tone: "primary", type: "major", x: 320, y: 430 },
      { id: "policy", label: "policy", tone: "mint", type: "major", x: 700, y: 210 },
      { id: "platform", label: "platform", tone: "primary", type: "major", x: 760, y: 380 },
      { id: "access", label: "access", tone: "mint", type: "major", x: 610, y: 500 },
      { id: "peer-1", label: "", tone: "shell", type: "minor", x: 160, y: 120 },
      { id: "peer-2", label: "", tone: "shell", type: "minor", x: 205, y: 290 },
      { id: "peer-3", label: "", tone: "shell", type: "minor", x: 270, y: 90 },
      { id: "peer-4", label: "", tone: "shell", type: "minor", x: 220, y: 520 },
      { id: "peer-5", label: "", tone: "shell", type: "minor", x: 380, y: 520 },
      { id: "peer-6", label: "", tone: "shell", type: "minor", x: 820, y: 180 },
      { id: "peer-7", label: "", tone: "shell", type: "minor", x: 855, y: 330 },
      { id: "peer-8", label: "", tone: "shell", type: "minor", x: 780, y: 520 },
      { id: "peer-9", label: "", tone: "shell", type: "minor", x: 560, y: 110 },
      { id: "peer-10", label: "", tone: "shell", type: "minor", x: 540, y: 610 },
    ],
    links: [
      { source: "core", target: "teacher", tone: "warm", width: 2.4 },
      { source: "core", target: "student", tone: "primary", width: 2.1 },
      { source: "core", target: "policy", tone: "primary", width: 2.3 },
      { source: "core", target: "platform", tone: "mint", width: 2.2 },
      { source: "core", target: "access", tone: "mint", width: 2.3 },
      { source: "teacher", target: "student", tone: "primary", width: 1.4 },
      { source: "policy", target: "platform", tone: "primary", width: 1.5 },
      { source: "access", target: "student", tone: "warm", width: 1.4 },
      { source: "teacher", target: "peer-1", tone: "warm", width: 1.1 },
      { source: "teacher", target: "peer-2", tone: "warm", width: 1.1 },
      { source: "teacher", target: "peer-3", tone: "primary", width: 1 },
      { source: "student", target: "peer-4", tone: "primary", width: 1 },
      { source: "student", target: "peer-5", tone: "primary", width: 1 },
      { source: "policy", target: "peer-6", tone: "mint", width: 1 },
      { source: "platform", target: "peer-7", tone: "primary", width: 1 },
      { source: "access", target: "peer-8", tone: "mint", width: 1 },
      { source: "policy", target: "peer-9", tone: "primary", width: 1 },
      { source: "access", target: "peer-10", tone: "warm", width: 1 },
    ],
  };
}

function resizeLandingNetwork() {
  if (!landingRenderer.initialized || !dom.landingNetworkAnchor) return;
  const rect = dom.landingNetworkAnchor.getBoundingClientRect();
  landingRenderer.width = Math.max(420, Math.round(rect.width));
  landingRenderer.height = Math.max(360, Math.round(rect.height));
  landingRenderer.svg.attr("viewBox", `0 0 ${landingRenderer.width} ${landingRenderer.height}`);
}

function initializeLandingNetwork() {
  if (landingRenderer.initialized || !window.d3 || !dom.landingNetwork) return;
  const d3 = window.d3;
  const seed = landingSeedGraph();
  landingRenderer.svg = d3.select(dom.landingNetwork);
  landingRenderer.root = landingRenderer.svg.append("g");
  landingRenderer.linkLayer = landingRenderer.root.append("g");
  landingRenderer.nodeLayer = landingRenderer.root.append("g");
  landingRenderer.initialized = true;
  resizeLandingNetwork();

  const nodes = seed.nodes.map((node) => ({ ...node }));
  const links = seed.links.map((link) => ({ ...link }));
  const centerX = () => landingRenderer.width * 0.5;
  const centerY = () => landingRenderer.height * 0.5;

  const linkSel = landingRenderer.linkLayer
    .selectAll(".landing-link")
    .data(links)
    .enter()
    .append("line")
    .attr("class", "landing-link")
    .attr("data-tone", (link) => link.tone)
    .attr("stroke-width", (link) => link.width);

  const nodeSel = landingRenderer.nodeLayer
    .selectAll(".landing-node-group")
    .data(nodes)
    .enter()
    .append("g")
    .attr("class", "landing-node-group");

  nodeSel
    .append("circle")
    .attr("class", (node) => (node.type === "core" ? "landing-node-core" : "landing-node-shell"))
    .attr("r", (node) => (node.type === "core" ? 34 : node.type === "major" ? 18 : 6));

  nodeSel
    .filter((node) => node.type !== "core")
    .append("circle")
    .attr("class", "landing-node-body")
    .attr("data-tone", (node) => node.tone)
    .attr("r", (node) => (node.type === "major" ? 14 : 4));

  nodeSel
    .filter((node) => node.type === "core" || node.type === "major")
    .append("text")
    .attr("class", "landing-node-label")
    .attr("y", (node) => (node.type === "core" ? 56 : 30))
    .text((node) => node.label);

  nodeSel.call(
    d3
      .drag()
      .on("start", (event, node) => {
        if (!event.active) {
          landingRenderer.simulation.alphaTarget(0.22).restart();
        }
        node.fx = node.x;
        node.fy = node.y;
      })
      .on("drag", (event, node) => {
        node.fx = event.x;
        node.fy = event.y;
      })
      .on("end", (event, node) => {
        if (!event.active) {
          landingRenderer.simulation.alphaTarget(0);
        }
        node.fx = event.x;
        node.fy = event.y;
      })
  );

  landingRenderer.simulation = d3
    .forceSimulation(nodes)
    .force("link", d3.forceLink(links).id((node) => node.id).distance((link) => (link.target.type === "minor" ? 42 : 120)).strength((link) => (link.target.type === "minor" ? 0.9 : 0.3)))
    .force("charge", d3.forceManyBody().strength((node) => (node.type === "core" ? -420 : node.type === "major" ? -180 : -40)))
    .force("collide", d3.forceCollide().radius((node) => (node.type === "core" ? 50 : node.type === "major" ? 22 : 8)))
    .force("x", d3.forceX((node) => (node.type === "core" ? centerX() : node.x * (landingRenderer.width / 960))).strength((node) => (node.type === "minor" ? 0.12 : 0.045)))
    .force("y", d3.forceY((node) => (node.type === "core" ? centerY() : node.y * (landingRenderer.height / 720))).strength((node) => (node.type === "minor" ? 0.12 : 0.045)))
    .on("tick", () => {
      linkSel
        .attr("x1", (link) => link.source.x)
        .attr("y1", (link) => link.source.y)
        .attr("x2", (link) => link.target.x)
        .attr("y2", (link) => link.target.y);

      nodeSel.attr("transform", (node) => `translate(${node.x}, ${node.y})`);
    });

  const core = nodes.find((node) => node.id === "core");
  if (core) {
    core.fx = centerX();
    core.fy = centerY();
  }

  window.addEventListener("resize", () => {
    if (!landingRenderer.initialized) return;
    resizeLandingNetwork();
    const coreNode = nodes.find((node) => node.id === "core");
    if (coreNode) {
      coreNode.fx = centerX();
      coreNode.fy = centerY();
    }
    landingRenderer.simulation.alpha(0.45).restart();
  });
}

function setView(nextView) {
  if (!isViewAllowed(nextView)) {
    state.activeView = "visualizer";
    renderNavigation();
    return;
  }
  state.activeView = nextView;
  renderNavigation();
}

function setStakeholder(nextStakeholder) {
  state.activeStakeholder = nextStakeholder;
  renderAll();
}

function pushEvidence(stakeholder, title, body) {
  state.evidence.push({ stakeholder, title, body });
  if (state.evidence.length > 9) {
    state.evidence.shift();
  }
  persistActiveWorkspaceState();
}

function generateAgentReply(stakeholderKey) {
  const stakeholder = getCaseStakeholderMeta(stakeholderKey);
  const topConflict = stakeholderConflicts(stakeholderKey)[0];
  const scores = computeScores();
  return (
    `${stakeholder.label} lens: ${topConflict.title.toLowerCase()} is still the sharpest issue. ` +
    `With alignment at ${scores.alignment}% and conflict at ${scores.conflict}%, I would ${stakeholderRecommendations(stakeholderKey)[0].toLowerCase()}`
  );
}

async function handleAsk(question) {
  const clean = question.trim();
  if (!clean) return;
  state.chat.push({ role: "user", stakeholder: state.activeStakeholder, body: clean });
  const response = await generateAgentReplyWithAi(state.activeStakeholder, clean);
  state.chat.push({ role: "agent", stakeholder: state.activeStakeholder, body: response });
  pushEvidence(state.activeStakeholder, `${stakeholders[state.activeStakeholder].label} response`, response);
  state.timeline.push(`Swarm dialogue expanded through the ${stakeholders[state.activeStakeholder].label.toLowerCase()} lens.`);
  if (state.timeline.length > 5) {
    state.timeline.shift();
  }
  persistActiveWorkspaceState();
  regenerateGraph(clean);
  renderAll();
}

function applyScenario(name) {
  if (state.activeRole !== "admin") return;
  const scenarios = {
    budget: { personalization: 66, teacherLoad: 74, privacy: 62, accessibility: 52, autonomousIteration: false },
    accessibility: { personalization: 74, teacherLoad: 63, privacy: 68, accessibility: 82, autonomousIteration: true },
    workload: { personalization: 70, teacherLoad: 86, privacy: 64, accessibility: 55, autonomousIteration: false },
  };
  const next = scenarios[name];
  state.metrics.personalization = next.personalization;
  state.metrics.teacherLoad = next.teacherLoad;
  state.metrics.privacy = next.privacy;
  state.metrics.accessibility = next.accessibility;
  state.autonomousIteration = next.autonomousIteration;
  pushEvidence("teacher", `Scenario applied: ${name}`, `The sandbox injected the "${name}" scenario to observe how stakeholder tension redistributed.`);
  state.decisions.unshift({
    stamp: "Now",
    title: `Scenario update: ${name}`,
    body: `The sandbox applied the ${name} scenario and recalculated alignment, feasibility, and conflict tension.`,
  });
  state.decisions = state.decisions.slice(0, 5);
  persistActiveWorkspaceState();
  regenerateGraph(`scenario ${name}`);
  renderAll();
}

async function addInstitution(name) {
  if (isSupabaseSessionActive() && isPlatformAdminAccount()) {
    await createInstitutionInSupabase(name);
    persistSessionState();
    return;
  }
  const institutionId = `inst-${slugify(name)}-${Date.now().toString(36)}`;
  const courseId = `course-${Date.now().toString(36)}`;
  state.platform.institutions.push({
    id: institutionId,
    name,
    settings: {
      defaultAccess: "course-members",
      governanceGate: "Required",
      accessibilityGate: "Mandatory",
    },
    courses: [
      createEmptyCourseTemplate({
        id: courseId,
        name: "New Course",
        code: "NEW-100",
      }),
    ],
  });
  state.activeInstitutionId = institutionId;
  state.activeCourseId = getInstitutionById(institutionId).courses[0].id;
  state.activeCaseId = "";
  persistPlatformState();
  persistSessionState();
}

async function addCourse(name, code) {
  if (isSupabaseSessionActive() && isPlatformAdminAccount()) {
    await createCourseInSupabase(name, code);
    persistSessionState();
    return;
  }
  const institution = getActiveInstitution();
  if (!institution) {
    throw new Error("Create or select an institution first.");
  }
  const courseId = `course-${slugify(code || name)}-${Date.now().toString(36)}`;
  institution.courses.push(
    createEmptyCourseTemplate({
      id: courseId,
      name,
      code,
      joinCode: buildJoinCode(code || name),
    })
  );
  state.activeCourseId = courseId;
  state.activeCaseId = "";
  persistPlatformState();
  persistSessionState();
}

async function uploadStructuredDocument(title, text, publishMode) {
  const course = getActiveCourse();
  if (!course) {
    throw new Error("Create or select a course first.");
  }
  const publish = publishMode === "published";
  const nextCase = await structureCaseFromDocumentWithAi({ title, text, publish });
  const nextDocument = {
    id: `doc-${slugify(title)}-${Date.now().toString(36)}`,
    title,
    kind: "uploaded-brief",
    uploadedAt: new Date().toISOString().slice(0, 10),
    published: publish,
    text: text.trim(),
    caseId: nextCase.id,
  };
  if (isSupabaseSessionActive()) {
    const client = initializeSupabase();
    if (!client) throw new Error("Login is not ready yet.");
    const { data: insertedCase, error: caseError } = await client
      .from("cases")
      .insert(serializeCaseForSupabase(nextCase, course.id))
      .select("*")
      .single();
    if (caseError) throw caseError;
    const { error: documentError } = await client
      .from("documents")
      .insert(serializeDocumentForSupabase(nextDocument, course.id, insertedCase.id));
    if (documentError) throw documentError;
    await refreshRemotePlatformContext(insertedCase.id);
    return;
  }
  course.documents.push(nextDocument);
  course.cases.unshift(nextCase);
  if (publish && !course.publishedCaseIds.includes(nextCase.id)) {
    course.publishedCaseIds.unshift(nextCase.id);
  }
  state.activeCaseId = nextCase.id;
  state.metrics = { ...nextCase.metrics };
  state.evidence = safeClone(nextCase.evidence);
  state.decisions = safeClone(nextCase.decisions);
  state.chat = safeClone(nextCase.chat);
  state.timeline = safeClone(nextCase.timeline);
  persistPlatformState();
}

function toggleCasePublish(caseId) {
  const course = getActiveCourse();
  const targetCase = getCaseById(caseId, course);
  if (!course || !targetCase) return;
  targetCase.published = !targetCase.published;
  targetCase.pipeline.reportStatus = targetCase.published ? "Published to learner side" : "Admin draft only";
  course.publishedCaseIds = course.cases.filter((item) => item.published).map((item) => item.id);
  course.documents.forEach((document) => {
    if (document.caseId === caseId) {
      document.published = targetCase.published;
    }
  });
  if (state.activeRole === "user" && !targetCase.published) {
    ensureActiveSelections();
  }
  persistPlatformState();
  if (isSupabaseSessionActive()) {
    syncCaseToSupabase(targetCase, course.id)
      .then(async () => {
        const client = initializeSupabase();
        if (!client) return;
        await client.from("documents").update({ published: targetCase.published }).eq("case_id", caseId);
      })
      .catch((error) => {
        console.error(error);
        state.auth.message = error.message || "Case status could not be updated.";
        renderLandingLogin();
      });
  }
}

dom.viewButtons.forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.view));
});

dom.roleSelect.addEventListener("change", (event) => {
  state.activeRole = event.target.value;
  ensureActiveSelections();
  persistSessionState();
  renderLandingLogin();
  renderAll();
});

dom.institutionSelect.addEventListener("change", (event) => {
  state.activeInstitutionId = event.target.value;
  const institution = getActiveInstitution();
  state.activeCourseId = institution?.courses?.[0]?.id || "";
  state.activeCaseId = "";
  ensureActiveSelections();
  persistSessionState();
  renderLandingLogin();
  renderAll();
});

dom.courseSelect.addEventListener("change", (event) => {
  state.activeCourseId = event.target.value;
  state.activeCaseId = "";
  ensureActiveSelections();
  persistSessionState();
  renderLandingLogin();
  renderAll();
});

dom.caseSelect.addEventListener("change", (event) => {
  state.activeCaseId = event.target.value;
  ensureActiveSelections();
  persistSessionState();
  renderAll();
});

dom.sidebarCaseSelect.addEventListener("change", (event) => {
  state.activeCaseId = event.target.value;
  ensureActiveSelections();
  persistSessionState();
  renderAll();
});

dom.learnerSelect.addEventListener("change", (event) => {
  state.activeLearnerId = event.target.value;
  ensureActiveSelections();
  persistSessionState();
  renderLandingLogin();
  renderAll();
});

dom.mapLayerSelect?.addEventListener("change", (event) => {
  state.activeMapLayer = event.target.value;
  state.selectedGraphNodeId = "";
  persistSessionState();
  renderAll();
});

document.addEventListener("click", (event) => {
  const pill = event.target.closest("[data-pill]");
  if (pill) {
    setStakeholder(pill.dataset.pill);
  }

  const graphNode = event.target.closest("[data-graph-node]");
  if (graphNode) {
    setStakeholder(graphNode.dataset.focus);
  }

  const promptButton = event.target.closest("[data-prompt]");
  if (promptButton) {
    document.getElementById("chat-input").value = promptButton.dataset.prompt;
  }

  const scenarioButton = event.target.closest("[data-scenario]");
  if (scenarioButton) {
    applyScenario(scenarioButton.dataset.scenario);
  }

  const selectCaseButton = event.target.closest("[data-select-case]");
  if (selectCaseButton) {
    state.activeCaseId = selectCaseButton.dataset.selectCase;
    renderAll();
  }

  const publishButton = event.target.closest("[data-toggle-publish]");
  if (publishButton) {
    toggleCasePublish(publishButton.dataset.togglePublish);
    renderAll();
  }
});

document.addEventListener("submit", async (event) => {
  if (event.target.id === "landing-login-form") {
    event.preventDefault();
    const email = dom.landingLoginEmail.value.trim();
    const password = dom.landingLoginPassword.value;
    if (!email || !password) return;
    signInWithSupabase(email, password)
      .then(() => {
        renderLandingLogin();
        openStudio();
      })
      .catch((error) => {
        state.auth.loading = false;
        state.auth.message = error.message || "Sign-in failed.";
        renderLandingLogin();
      });
    return;
  }

  if (event.target.id === "landing-join-form") {
    event.preventDefault();
    try {
      const joinEmail = dom.landingJoinEmail.value.trim();
      const joinPassword = dom.landingJoinPassword.value;
      if (!joinEmail || !joinPassword) {
        throw new Error("Enter your student email and password.");
      }
      await signInWithSupabase(joinEmail, joinPassword);
      await joinCourseWithCodeRemote(dom.landingJoinCode.value.trim());
      renderLandingLogin();
      openStudio();
    } catch (error) {
      state.auth.message = error.message || "Join code could not be used.";
      renderLandingLogin();
    }
    return;
  }

  if (event.target.id === "add-institution-form") {
    event.preventDefault();
    const form = new FormData(event.target);
    try {
      await addInstitution(String(form.get("institutionName")).trim());
      event.target.reset();
      renderLandingLogin();
      renderAll();
    } catch (error) {
      state.auth.message = error.message || "Institution could not be created.";
      renderLandingLogin();
    }
    return;
  }

  if (event.target.id === "add-course-form") {
    event.preventDefault();
    const form = new FormData(event.target);
    try {
      await addCourse(String(form.get("courseName")).trim(), String(form.get("courseCode")).trim());
      event.target.reset();
      renderLandingLogin();
      renderAll();
    } catch (error) {
      state.auth.message = error.message || "Course could not be created.";
      renderLandingLogin();
    }
    return;
  }

  if (event.target.id === "upload-document-form") {
    event.preventDefault();
    const form = new FormData(event.target);
    try {
      await uploadStructuredDocument(
        String(form.get("documentTitle")).trim(),
        String(form.get("documentText")).trim(),
        String(form.get("publishMode"))
      );
      event.target.reset();
      regenerateGraph("admin upload structured");
      renderAll();
    } catch (error) {
      state.auth.message = error.message || "The document could not be structured.";
      renderLandingLogin();
    }
    return;
  }

  if (event.target.id === "board-settings-form") {
    event.preventDefault();
    const form = new FormData(event.target);
    updateBoardSettings({
      agendaPrompt: String(form.get("agendaPrompt") || "").trim(),
      dueAt: String(form.get("dueAt") || "").trim(),
      maxLearnerNodes: String(form.get("maxLearnerNodes") || "").trim(),
      maxAiExpansionsPerNode: String(form.get("maxAiExpansionsPerNode") || "").trim(),
      layoutMode: String(form.get("layoutMode") || "").trim(),
      sharingMode: String(form.get("sharingMode") || "").trim(),
    });
    regenerateGraph("board settings updated");
    renderAll();
    return;
  }

  if (event.target.id === "agenda-node-form") {
    event.preventDefault();
    const form = new FormData(event.target);
    try {
      await addAgendaNode(String(form.get("agendaTitle")).trim(), String(form.get("agendaBody")).trim());
      event.target.reset();
      renderAll();
    } catch (error) {
      state.auth.message = error.message || "Agenda node could not be added.";
      renderLandingLogin();
    }
    return;
  }

  if (event.target.id === "annotation-form") {
    event.preventDefault();
    const form = new FormData(event.target);
    try {
      addNodeAnnotation(
        String(form.get("noteType") || "note"),
        String(form.get("visibility") || "private"),
        String(form.get("annotationBody") || "")
      );
      event.target.reset();
      renderAll();
    } catch (error) {
      state.auth.message = error.message || "Annotation could not be added.";
      renderLandingLogin();
    }
  }

  if (event.target.id === "quick-annotation-form") {
    event.preventDefault();
    const form = new FormData(event.target);
    try {
      addNodeAnnotation(
        String(form.get("noteType") || "note"),
        String(form.get("visibility") || "private"),
        String(form.get("annotationBody") || "")
      );
      event.target.reset();
      renderAll();
    } catch (error) {
      state.auth.message = error.message || "Annotation could not be added.";
      renderLandingLogin();
    }
  }
});

document.getElementById("visualizer-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.getElementById("visualizer-input");
  handleAsk(input.value)
    .then(() => {
      input.value = "";
    })
    .catch((error) => {
      state.auth.message = error.message || "The question could not be processed.";
      renderLandingLogin();
    });
});

document.getElementById("chat-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.getElementById("chat-input");
  handleAsk(input.value)
    .then(() => {
      input.value = "";
    })
    .catch((error) => {
      state.auth.message = error.message || "The question could not be processed.";
      renderLandingLogin();
    });
});

Object.entries(dom.metricInputs).forEach(([key, input]) => {
  input.addEventListener("input", () => {
    if (state.activeRole !== "admin") return;
    state.metrics[key] = Number(input.value);
    persistActiveWorkspaceState();
    regenerateGraph(`${key} adjusted`);
    renderAll();
  });
});

document.getElementById("autonomy-toggle").addEventListener("change", (event) => {
  if (state.activeRole !== "admin") {
    event.target.checked = state.autonomousIteration;
    return;
  }
  state.autonomousIteration = event.target.checked;
  updateActiveCaseRecord((activeCase) => {
    activeCase.pipeline.simulationStatus = state.autonomousIteration ? "Autonomous iteration enabled" : "Instructor-gated iteration";
  });
  regenerateGraph("iteration mode toggled");
  renderAll();
});

["regenerate-memo"].forEach((id) => {
  document.getElementById(id)?.addEventListener("click", () => {
    state.decisions.unshift({
      stamp: "Now",
      title: state.activeRole === "admin" ? "Memo refreshed" : "Reflection memo refreshed",
      body:
        state.activeRole === "admin"
          ? `The report generator rebuilt the design memo using the current ${stakeholders[state.activeStakeholder].label.toLowerCase()} lens and sandbox metrics.`
          : `The learner memo was rebuilt using the current ${stakeholders[state.activeStakeholder].label.toLowerCase()} lens, student evidence notes, and the student's private notes.`,
    });
    state.decisions = state.decisions.slice(0, 5);
    if (state.activeRole === "admin") {
      updateActiveCaseRecord((activeCase) => {
        activeCase.pipeline.reportStatus = "Memo refreshed for instructor review";
      });
    } else {
      updateActiveLearnerRunRecord((activeRun) => {
        activeRun.status = "Reflection memo refreshed";
      });
    }
    persistActiveWorkspaceState();
    setView("report");
    renderAll();
  });
});

dom.landingEnterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    focusLandingLogin();
  });
});

dom.startTutorialButton?.addEventListener("click", () => {
  startTutorial(true);
});

dom.tourNext?.addEventListener("click", () => {
  advanceTutorial(1);
});

dom.tourBack?.addEventListener("click", () => {
  advanceTutorial(-1);
});

dom.tourSkip?.addEventListener("click", () => {
  endTutorial(true);
});

window.addEventListener("resize", () => {
  if (tutorialState.active) {
    renderTutorialStep();
  }
});

window.addEventListener("keydown", (event) => {
  if (!tutorialState.active) return;
  if (event.key === "Escape") {
    endTutorial(true);
  }
  if (event.key === "ArrowRight" || event.key === "Enter") {
    advanceTutorial(1);
  }
  if (event.key === "ArrowLeft") {
    advanceTutorial(-1);
  }
});

dom.returnToLanding?.addEventListener("click", async () => {
  endTutorial(false);
  await signOutSupabaseIfNeeded();
  state.auth = {
    ...state.auth,
    source: state.auth.configured ? "supabase" : "none",
    loading: false,
    userId: "",
    sessionEmail: "",
    remoteRole: "",
    message: state.auth.configured
      ? "Signed out."
      : "",
  };
  returnToLanding();
});

async function boot() {
  state.platform = loadPlatformState();
  hydrateSessionState();
  hydrateTutorialState();
  initializeSupabase();
  ensureActiveSelections();
  syncActiveCaseState();
  initializeLandingNetwork();
  renderLandingLogin();
  regenerateGraph("initial load");
  syncGraphLoop();
  const restored = await restoreSupabaseSession();
  renderLandingLogin();
  if (window.location.hash === "#studio" || restored) {
    dom.landingShell?.classList.add("is-hidden");
    dom.appShell?.classList.remove("is-hidden");
  }
  renderAll();
  if (!dom.appShell?.classList.contains("is-hidden")) {
    startTutorial(false);
  }
}

boot();

