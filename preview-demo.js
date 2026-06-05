/* Preview-only: inject demo data and jump straight into the main app (no login).
   Loaded ONLY by preview.html. boot() in app.js calls window.__dtsPreviewInject()
   as its last step when window.__DTS_PREVIEW__ is set. No-op in production. */
window.__DTS_PREVIEW__ = true;
(function () {
  function inject() {
    const A = (title, stakeholder) => ({ title, stakeholder: stakeholder || "teacher", body: title });
    const arrs = () => ({
      aiGeneratedNodes: [],
      annotations: [],
      evidence: [],
      decisions: [],
      chat: [],
      timeline: [],
      metrics: { personalization: 70, teacherLoad: 62, privacy: 55, accessibility: 50 },
    });
    const run = (id, name, nodes) => ({ caseId: "ca", learnerId: id, learnerName: name, agendaNodes: nodes, ...arrs() });

    const ca = {
      id: "ca",
      title: "AI 개인화 학습 도입",
      published: true,
      summary: "학교가 컴퓨터 기반 수업(CBI)을 도입하는 상황의 설계 긴장을 지도화합니다.",
      pipeline: { graphStatus: "동기화됨" },
      learningGoals: ["CBI를 교육적 의도를 잃지 않고 통합하기"],
      constraints: ["페다고지 vs 자동화", "형평성 vs 표준화", "통제 vs 편의"],
      metrics: { personalization: 70, teacherLoad: 62, privacy: 55, accessibility: 50 },
      evidence: [],
      decisions: [],
      chat: [],
      timeline: [],
      matrixInsights: [],
      sandboxFeed: [],
      reflectionPrompts: [],
      networkMeta: [],
      uiCopy: {},
      stakeholderProfiles: {},
      boardSettings: { sharingMode: "cohort", studentView: "full", maxLearnerNodes: 8, maxAiExpansionsPerNode: 2 },
    };
    const course = {
      id: "c",
      code: "EDU101",
      name: "인공지능활용교육론",
      cases: [ca],
      publishedCaseIds: ["ca"],
      learners: [
        { id: "l", name: "민지" },
        { id: "p1", name: "서연" },
        { id: "p2", name: "지호" },
      ],
      learnerRuns: [
        run("l", "민지", [A("AI 페이싱이 교사 판단을 덮음", "teacher"), A("기기 접근 격차", "student"), A("데이터 주권", "it")]),
        run("p1", "서연", [A("AI 페이싱이 교사 판단을 덮음", "teacher"), A("채점 노동 증가", "teacher")]),
        run("p2", "지호", [A("AI 페이싱이 교사 판단을 덮음", "teacher"), A("기기 접근 격차", "student"), A("행정 도입 압력", "administrator")]),
      ],
      instructors: [],
    };

    state.platform.institutions = [{ id: "i", name: "이화여자대학교", courses: [course] }];
    state.locale = "ko";
    state.activeRole = "user";
    state.activeInstitutionId = "i";
    state.activeCourseId = "c";
    state.activeCaseId = "ca";
    state.activeLearnerId = "l";
    state.activeMapLayer = "compare";
    state.activeView = "home";

    if (typeof applyStaticTranslations === "function") applyStaticTranslations();
    document.getElementById("landing-shell")?.classList.add("is-hidden");
    document.getElementById("app-shell")?.classList.remove("is-hidden");
    try {
      renderAll();
    } catch (e) {
      console.error("preview render error", e);
    }

    // Small banner so it's clear this is a no-login demo.
    if (!document.getElementById("preview-flag")) {
      const flag = document.createElement("div");
      flag.id = "preview-flag";
      flag.textContent = "미리보기 · 데모 데이터 (로그인 없음)";
      flag.style.cssText =
        "position:fixed;left:50%;bottom:14px;transform:translateX(-50%);z-index:9999;" +
        "background:rgba(67,97,238,0.92);color:#fff;font:600 12px/1 Inter,sans-serif;" +
        "padding:8px 16px;border-radius:999px;box-shadow:0 8px 24px rgba(0,0,0,0.25);";
      document.body.appendChild(flag);
    }
  }

  // boot() invokes this after it has finished its own landing/app render.
  window.__dtsPreviewInject = inject;
})();
