/* Preview-only: inject demo data and jump straight into the main app (no login).
   Loaded ONLY by preview.html. boot() in app.js calls window.__dtsPreviewInject()
   as its last step when window.__DTS_PREVIEW__ is set. No-op in production. */
window.__DTS_PREVIEW__ = true;
(function () {
  function inject() {
    const previewParams = new URLSearchParams(window.location.search);
    const EN = (function () {
      if (["ko", "en"].includes(previewParams.get("lang"))) return previewParams.get("lang") === "en";
      try { return localStorage.getItem("swarm-id-locale-v1") === "en"; } catch (_) { return false; }
    })();
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
      title: EN ? "Adopting AI-Personalized Learning" : "AI 개인화 학습 도입",
      published: true,
      summary: EN
        ? "Mapping the design tensions of a school adopting computer-based instruction (CBI)."
        : "학교가 컴퓨터 기반 수업(CBI)을 도입하는 상황의 설계 쟁점을 지도화합니다.",
      pipeline: { graphStatus: EN ? "Synced" : "동기화됨" },
      learningGoals: [EN ? "Integrate CBI without losing pedagogical intent" : "CBI를 교육적 의도를 잃지 않고 통합하기"],
      constraints: EN
        ? ["Pedagogy vs automation", "Equity vs standardization", "Control vs convenience"]
        : ["페다고지 vs 자동화", "형평성 vs 표준화", "통제 vs 편의"],
      metrics: { personalization: 70, teacherLoad: 62, privacy: 55, accessibility: 50 },
      evidence: [],
      decisions: [],
      chat: [],
      timeline: [],
      matrixInsights: [],
      sandboxFeed: [],
      reflectionPrompts: [EN ? "Which issue matters most in this case? Explain your choice using one example from the map." : "이 사례에서 가장 중요한 쟁점은 무엇인가요? 맵의 사례 하나를 근거로 선택의 이유를 적어보세요."],
      networkMeta: [],
      uiCopy: {},
      stakeholderProfiles: {},
      boardSettings: { sharingMode: "cohort", studentView: "full", maxLearnerNodes: 8, maxAiExpansionsPerNode: 2 },
    };
    const course = {
      id: "c",
      code: "EDU101",
      name: EN ? "AI in Education" : "인공지능활용교육론",
      cases: [ca],
      publishedCaseIds: ["ca"],
      learners: EN
        ? [
            { id: "l", name: "Mina" },
            { id: "p1", name: "Seo-yeon" },
            { id: "p2", name: "Jiho" },
          ]
        : [
            { id: "l", name: "민지" },
            { id: "p1", name: "서연" },
            { id: "p2", name: "지호" },
          ],
      learnerRuns: EN
        ? [
            run("l", "Mina", [A("AI pacing overrides teacher judgment", "teacher"), A("Device access gap", "student"), A("Data sovereignty", "it")]),
            run("p1", "Seo-yeon", [A("AI pacing overrides teacher judgment", "teacher"), A("Grading labor increases", "teacher")]),
            run("p2", "Jiho", [A("AI pacing overrides teacher judgment", "teacher"), A("Device access gap", "student"), A("Administrative adoption pressure", "administrator")]),
          ]
        : [
            run("l", "민지", [A("AI 페이싱이 교사 판단을 덮음", "teacher"), A("기기 접근 격차", "student"), A("데이터 주권", "it")]),
            run("p1", "서연", [A("AI 페이싱이 교사 판단을 덮음", "teacher"), A("채점 노동 증가", "teacher")]),
            run("p2", "지호", [A("AI 페이싱이 교사 판단을 덮음", "teacher"), A("기기 접근 격차", "student"), A("행정 도입 압력", "administrator")]),
          ],
      instructors: [],
    };

    state.platform.institutions = [{ id: "i", name: EN ? "Ewha Womans University" : "이화여자대학교", courses: [course] }];
    state.locale = EN ? "en" : "ko";
    state.activeRole = previewParams.get("role") === "admin" ? "admin" : "user";
    state.activeInstitutionId = "i";
    state.activeCourseId = "c";
    state.activeCaseId = "ca";
    state.activeLearnerId = "l";
    state.activeMapLayer = "base";
    const requestedViewRaw = previewParams.get("view");
    const requestedView = requestedViewRaw === "network" ? "visualizer" : requestedViewRaw;
    state.activeView = ["home", "visualizer", "perspectives", "matrix", "sandbox", "report", "manage"].includes(requestedView)
      ? requestedView
      : "home";
    state.density = ["advanced", "detailed"].includes(previewParams.get("density")) ? "detailed" : "simple";

    if (typeof applyStaticTranslations === "function") applyStaticTranslations();
    document.getElementById("landing-shell")?.classList.add("is-hidden");
    document.getElementById("app-shell")?.classList.remove("is-hidden");
    try {
      renderAll();
      window.setTimeout(() => {
        state.activeRole = previewParams.get("role") === "admin" ? "admin" : "user";
        state.density = ["advanced", "detailed"].includes(previewParams.get("density")) ? "detailed" : "simple";
        if (requestedView && typeof setView === "function") setView(requestedView);
        renderAll();
        if (previewParams.get("coach") === "1" && typeof openAgentCoach === "function") openAgentCoach();
      }, 400);
    } catch (e) {
      console.error("preview render error", e);
    }

    // Small banner so it's clear this is a no-login demo.
    if (!document.getElementById("ux-preview-notice")) {
      const flag = document.createElement("div");
      flag.id = "ux-preview-notice";
      flag.className = "ux-demo-banner";
      flag.innerHTML = '<span><strong>' + t("uxDemo") + '</strong><span>' + t("uxDemoNote") + '</span></span><a href="./index.html">' + t("uxExitDemo") + ' <span aria-hidden="true">↗</span></a>';
      document.querySelector(".workspace")?.prepend(flag);
    }
  }

  // boot() invokes this after it has finished its own landing/app render.
  window.__dtsPreviewInject = inject;
})();
