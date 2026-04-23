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

const translations = {
  en: {
    languageToggle: "KO",
    skipToMain: "Skip to main content",
    labName: "Instructional design systems lab",
    signIn: "Sign In",
    signInSubmit: "Continue",
    landingHeroKicker: "AI + Human Network Visualization",
    landingHeroTitle: "Turn design tension into a living network.",
    landingHeroBody: "Human judgment, institutional friction, and AI reasoning in one responsive field.",
    signalTeacherLoad: "Teacher load",
    signalStudentAgency: "Student agency",
    signalGovernance: "Governance",
    signalAccessibility: "Accessibility",
    openWorkspace: "Open your workspace",
    studentJoin: "Student join",
    joinCourse: "Join a course",
    email: "Email",
    password: "Password",
    courseCode: "Course code",
    joinWithCode: "Join with Code",
    landingHuman: "Human",
    landingHumanBody: "Teachers, students, critique, workload",
    landingSystem: "System",
    landingSystemBody: "Policy, platform, evidence, scale",
    selectedCase: "Selected Case",
    case: "Case",
    noActiveCase: "No active case",
    waitingForCourseData: "Waiting for course data.",
    caseTension: "Case tension",
    navNetwork: "Network",
    navPerspectives: "Perspectives",
    navTradeoffs: "Trade-offs",
    navSandbox: "Sandbox",
    navReport: "Report",
    currentStatus: "Current status",
    workspace: "Workspace",
    institution: "Institution",
    course: "Course",
    student: "Student",
    showTutorial: "Show Tutorial",
    switchAccount: "Sign out",
    startHere: "Start here",
    createOrChooseCase: "Create or Choose a Case",
    choosePublishedCase: "Choose a Published Case",
    instructor: "Instructor",
    systemTopology: "System topology",
    proposalNetwork: "Proposal network",
    mapLayer: "Map layer",
    baseMap: "Base map",
    myView: "My view",
    classView: "Class view",
    selectedLens: "Selected lens",
    topTensions: "Top tensions",
    evidenceQueue: "Evidence queue",
    selectedNode: "Selected node",
    hoverOrClick: "Hover or click",
    noNodeSelected: "No node selected",
    hoverNodeHelp: "Hover or click a node in the network to inspect it here.",
    relatedActivity: "Related activity",
    myQuestions: "My questions",
    classPatterns: "Class patterns",
    noteType: "Note type",
    share: "Share",
    note: "Note",
    question: "Question",
    concern: "Concern",
    onlyMe: "Only me",
    addNotePlaceholder: "Add a note to the selected node...",
    saveNote: "Save note",
    askQuestionPlaceholder: "Ask what conflict matters most in this case...",
    askQuestion: "Ask a Question",
    askQuestionHint: "Your question will be added to the cohort graph. Your instructor and classmates can see it.",
    tensionScaleHint: "0–100 · higher means more friction across stakeholders",
    downloadPng: "Download PNG",
    downloadHtmlSnapshot: "Download HTML Snapshot",
    swarmActivity: "Swarm activity",
    peopleInCase: "People in the case",
    keyConcerns: "Key concerns",
    currentFocus: "Current focus",
    questions: "Questions",
    askAboutPerspective: "Ask about this perspective",
    askPerspectivePlaceholder: "Ask what this person would worry about...",
    ask: "Ask",
    tradeoffRadar: "Trade-off radar chart",
    personalizationDepth: "Personalization depth",
    teacherLoadLabel: "Teacher load",
    privacyResilience: "Privacy resilience",
    accessibilityCoverage: "Accessibility coverage",
    budgetCut: "50% budget cut",
    noSummary: "No summary",
    noTensions: "No tensions",
    noRecommendations: "No recommendations",
    noEvidence: "No evidence",
    noScores: "No scores",
    instructorView: "Instructor View",
    noPrompts: "No prompts",
    noActivity: "No activity",
    checking: "Checking...",
    noCourseLinkedYet: "No course linked yet.",
    studentJoinHelper: "Sign in as a student, then enter your course code.",
    tutorialBack: "Back",
    tutorialNext: "Next",
    tutorialSkip: "Skip",
    tutorialFinish: "Finish",
    createFirstCase: "Create the first case",
    noPublishedCasesYet: "No published cases yet",
    currentCase: "Current case",
    publishedCase: "Published case",
    currentCourse: "Current course",
    draft: "Draft",
    published: "Published",
    notSet: "not set",
    live: "Live",
    signInEmailPlaceholder: "you@school.edu",
    studentEmailPlaceholder: "student@school.edu",
    passwordPlaceholder: "Password",
    courseCodePlaceholder: "Course join code",
    workspaceRole: "Workspace",
    stageD3: "D3 force graph",
    stakeholderTeacher: "Teacher",
    stakeholderAdministrator: "Administrator",
    stakeholderStudent: "Student",
    stakeholderIt: "IT Systems",
    stakeholderAccessibility: "Accessibility",
    statusNeedsAttention: "Needs attention",
    statusLookingStable: "Looking stable",
    statusMixedSignals: "Mixed signals",
    statusAtRisk: "At risk",
    statusNeedsReview: "Needs review",
    workflowQuickStart: "Quick start",
    wfChooseCourse: "Choose the course",
    wfConfirmCourse: "Confirm the course before creating or editing a case.",
    wfReviewUpdateCase: "Review or update the case",
    wfUseCaseSelector: "Use the case selector to switch cases or keep editing the current one.",
    wfCreateCase: "Create a case",
    wfPasteBrief: "Paste a course brief below and the studio will structure it.",
    wfPublishedToStudents: "Published to students",
    wfStudentsCanOpen: "Students can now open this case in their workspace.",
    wfPublishWhenReady: "Publish when ready",
    wfKeepDraftPrivate: "Keep drafts private until you want students to work from them.",
    wfStartInCourse: "Start in the course where your instructor published the case.",
    wfOpenPublishedCase: "Open the published case",
    wfSelectPublishedCase: "Select a published case",
    wfSelectedCaseLoaded: "The selected case is now loaded into your learner run.",
    wfUseSelectorPublished: "Use the case selector above to pick one published case.",
    wfWaitInstructorPublish: "Wait for your instructor to publish a case for this course.",
    wfAskQuestionsReflect: "Ask questions and reflect",
    wfUseNetworkReflect: "Use the network, evidence, and prompts to build your reflection.",
    wfStartLearnerRun: "Start your learner run",
    wfCaseUnlocksPage: "Once a case is selected, the rest of the page will open up.",
    courseSetup: "Course setup",
    institutionNamePlaceholder: "Institution name...",
    addInstitution: "Add institution",
    courseNamePlaceholder: "Course name...",
    addCourse: "Add course",
    newCase: "New case",
    titlePlaceholder: "Title...",
    caseTitleLabel: "Case title",
    caseBriefLabel: "Instructional brief",
    caseVisibilityLabel: "Visibility",
    publishToLearners: "Publish to learners",
    keepAsDraft: "Keep as draft (review before sharing)",
    pasteBriefPlaceholder: "Paste the brief — include audience, learning objective, constraints, and resources...",
    createCaseBtn: "Create case",
    createCourseFirst: "Create a course first.",
    noCourseAssigned: "No course assigned.",
    boardSettings: "Board settings",
    mainQuestionPlaceholder: "Main question...",
    dueDate: "Due date",
    sharingMode: "Sharing mode",
    privateOnly: "Private only",
    nodeLimitPerStudent: "Node limit per student",
    aiAdditionsPerNode: "AI additions per node",
    layout: "Layout",
    force: "Force",
    cluster: "Cluster",
    radial: "Radial",
    saveSettings: "Save settings",
    courseCases: "Course cases",
    courseCasesHelp: "Open a case to keep working, or publish it when students should be able to choose it.",
    openCase: "Open case",
    publishVerb: "Publish",
    unpublishVerb: "Unpublish",
    noCasesYet: "No cases yet.",
    yourCopy: "Your copy",
    readyToStart: "Ready to start",
    availableCases: "Available cases",
    ready: "Ready",
    addNode: "Add a node",
    agendaBodyPlaceholder: "Why does this matter for your redesign?",
    addToMap: "Add to Map",
    addNodeDefaultPrompt: "Add a node.",
    noNodes: "No nodes",
    aiAdditionsTitle: "AI additions",
    aiSuggested: "AI suggested",
    noAdditions: "No additions",
    classViewTitle: "Class view",
    off: "Off",
    sharedPatterns: "Shared patterns",
    sharedClustersCount: "{count} shared clusters",
    studentRunsCount: "{count} student runs",
    noInstitutionSelected: "No institution selected",
    noCourseSelected: "No course selected",
    createBaseBoardNote: "Create the base board here, decide how much students can add, then share the join code when the board is ready.",
    choosePublishedBoardNote: "Choose one published board, inspect the instructor's base map, then add your own nodes and notes in your private layer.",
    caseCount: "{count} cases",
    publishedCount: "{count} published",
    publishedCasesCount: "{count} published cases",
    statusCasePublished: "This case is published. Students can now open it in their own view.",
    statusCaseDraft: "This case is still a draft. Publish it when students should start using it.",
    statusCreateChoose: "Create or choose a case to start the workflow.",
    statusLearnerExploring: "{name} is exploring the selected case in private notes.",
    statusChoosePublished: "Choose a published case to unlock the rest of the page.",
    noCasePick: "No case",
    pickCase: "Pick a case",
    start: "Start",
    startWithCase: "Start with a case.",
    casePreview: "Case preview",
    panelUpdatesWhenCaseOpen: "The panel updates when a case is open.",
    noLens: "No lens",
    openCaseShort: "Open a case.",
    selectNode: "Select a node",
    noRelatedQuestionsYet: "No related questions yet.",
    openLearnerRun: "Open a learner run.",
    noSharedPatternsYet: "No shared patterns yet.",
    noDialogueYet: "No dialogue yet.",
    youLabel: "You",
    matrixNeedsAttention: "Needs attention",
    matrixBalanced: "Balanced",
    matrixWatchClosely: "Watch closely",
    personalization: "Personalization",
    feasibility: "Feasibility",
    teacherSlack: "Teacher slack",
    noInsights: "No insights",
    noHistory: "No history",
    veryHigh: "Very high",
    high: "High",
    moderate: "Moderate",
    sandboxCriticalReview: "Critical review",
    sandboxStable: "Stable",
    sandboxNeedsTuning: "Needs tuning",
    instructorOnly: "Instructor only",
    noNotes: "No notes",
    autoIteration: "Autonomous iteration",
    autoIterationBody: "Allow the system to suggest redesign moves before instructor review.",
    stressScenarios: "Stress scenarios",
    accessibilityAudit: "Accessibility audit",
    unionWorkloadComplaint: "Union workload complaint",
    systemResponse: "System response",
    whatChangesAfterAdjustment: "What changes after the adjustment",
    alignmentCohesion: "Alignment cohesion",
    cognitiveLoadLabel: "Cognitive load",
    responseTime: "Response time",
    caseReport: "Case report",
    draftSummary: "Draft the summary",
    refreshSummary: "Refresh summary",
    executiveSummary: "Executive summary",
    priorityTensions: "Priority tensions",
    recommendedRedesignMoves: "Recommended redesign moves",
    evidenceTrace: "Evidence trace",
    reflection: "Reflection",
    feedbackAndReflection: "Feedback and reflection",
    reflectionPromptsLabel: "Reflection prompts",
    recentDialogue: "Recent dialogue",
    exampleView: "Example view",
    caseMapAppears: "This is where the case map appears.",
    caseMapAppearsBody: "Once a case is selected, the map will show people, constraints, and the main tensions around the design.",
    instructionalSignals: "Instructional signals",
    constraintFriction: "Constraint friction",
    alignedEvidence: "Aligned evidence",
    instructionalSignalsDesc: "What the teacher intends — objectives, lesson moves, pedagogical goals.",
    constraintFrictionDesc: "Where real constraints — time, tools, policies, workload — collide with that intent.",
    alignedEvidenceDesc: "Evidence from teachers, students, or IT systems that supports (or challenges) a design move.",
    conceptHelpTitle: "How to read this map",
    conceptHelpBody: "Each case is a design problem viewed through three stakeholders. Switch lenses (Teacher → IT Systems → Students) to see how the same tension looks from each side — they pull on each other, so no single view is enough.",
    perspectiveTeacherShort: "Teacher: what they plan and decide.",
    perspectiveItShort: "IT Systems: what the tools allow or block.",
    perspectiveStudentShort: "Students: what learners actually experience.",
    visualizerIntroTitle: "Visualizer — map the case",
    visualizerIntroBody: "Every node is a stakeholder concern, constraint, or design move. Edges show which concerns pull on each other. Click a node to read it; add a new node to extend the case with a worry the original doesn't capture.",
    thinking: "Thinking...",
    questionCouldNotBeProcessed: "The question could not be processed.",
    studentOnboardingTitle: "First steps",
    studentOnboardingStep1: "Open a published case from the list below.",
    studentOnboardingStep2: "Read the brief, then look at how nodes connect in the map.",
    studentOnboardingStep3: "Switch lenses (Teacher → IT Systems → Students) to see the same case from each side.",
    studentOnboardingStep4: "Ask a question or add a node the original case doesn't capture.",
    studentOnboardingTourButton: "Take the guided tour",
    expandStartHere: "Start here",
    expandSelectedLens: "Selected lens",
    mobileMap: "Map",
    mobilePeople: "People",
    mobileTest: "Test",
  },
  ko: {
    languageToggle: "EN",
    skipToMain: "본문으로 바로가기",
    labName: "수업설계 시스템 연구실",
    signIn: "로그인",
    signInSubmit: "계속",
    landingHeroKicker: "AI + 인간 네트워크 시각화",
    landingHeroTitle: "설계의 긴장을 살아 있는 네트워크로 바꾸세요.",
    landingHeroBody: "사람의 판단, 제도적 제약, AI 추론을 하나의 화면에서 함께 살펴봅니다.",
    signalTeacherLoad: "교수자 부담",
    signalStudentAgency: "학생 주체성",
    signalGovernance: "거버넌스",
    signalAccessibility: "접근성",
    openWorkspace: "워크스페이스 열기",
    studentJoin: "학생 참여",
    joinCourse: "코스 참여하기",
    email: "이메일",
    password: "비밀번호",
    courseCode: "코스 코드",
    joinWithCode: "코드로 참여",
    landingHuman: "인간",
    landingHumanBody: "교수자, 학생, 비평, 업무 부담",
    landingSystem: "시스템",
    landingSystemBody: "정책, 플랫폼, 근거, 확장성",
    selectedCase: "선택된 케이스",
    case: "케이스",
    noActiveCase: "열린 케이스 없음",
    waitingForCourseData: "코스 데이터를 기다리는 중입니다.",
    caseTension: "케이스 긴장 수준",
    navNetwork: "네트워크",
    navPerspectives: "관점",
    navTradeoffs: "상충 관계",
    navSandbox: "샌드박스",
    navReport: "리포트",
    currentStatus: "현재 상태",
    workspace: "작업 공간",
    institution: "소속 기관",
    course: "수업",
    student: "학생",
    showTutorial: "튜토리얼 보기",
    switchAccount: "로그아웃",
    startHere: "여기서 시작하세요",
    createOrChooseCase: "케이스를 만들거나 선택하세요",
    choosePublishedCase: "공개된 케이스 선택",
    instructor: "교수자",
    systemTopology: "시스템 구조",
    proposalNetwork: "제안 네트워크",
    mapLayer: "지도 레이어",
    baseMap: "기본 지도",
    myView: "내 화면",
    classView: "전체 화면",
    selectedLens: "선택한 관점",
    topTensions: "주요 쟁점",
    evidenceQueue: "근거 목록",
    selectedNode: "선택한 노드",
    hoverOrClick: "올려두거나 클릭하세요",
    noNodeSelected: "선택된 노드가 없습니다",
    hoverNodeHelp: "네트워크의 노드에 마우스를 올리거나 클릭하면 이곳에서 내용을 확인할 수 있습니다.",
    relatedActivity: "관련 활동",
    myQuestions: "내 질문",
    classPatterns: "전체 패턴",
    noteType: "메모 종류",
    share: "공유",
    note: "메모",
    question: "질문",
    concern: "걱정되는 점",
    onlyMe: "나만 보기",
    addNotePlaceholder: "선택한 노드에 메모를 추가해주세요...",
    saveNote: "메모 저장",
    askQuestionPlaceholder: "이 케이스에서 가장 중요한 갈등은 무엇일지 물어보세요...",
    askQuestion: "질문하기",
    askQuestionHint: "질문은 전체 네트워크에 추가되어 교수자와 같은 반 학생들이 볼 수 있습니다.",
    tensionScaleHint: "0–100 · 숫자가 클수록 이해관계자 사이의 갈등이 큽니다",
    downloadPng: "PNG로 내려받기",
    downloadHtmlSnapshot: "HTML 스냅샷 내려받기",
    swarmActivity: "AI 협력 활동",
    peopleInCase: "케이스 안의 인물들",
    keyConcerns: "주요 쟁점",
    currentFocus: "지금 보고 있는 관점",
    questions: "질문",
    askAboutPerspective: "이 관점에 질문하기",
    askPerspectivePlaceholder: "이 사람은 어떤 점을 걱정할지 물어보세요...",
    ask: "질문하기",
    tradeoffRadar: "상충 관계 레이더 차트",
    personalizationDepth: "개인화 수준",
    teacherLoadLabel: "교수자 업무 부담",
    privacyResilience: "프라이버시 안정성",
    accessibilityCoverage: "접근성 수준",
    budgetCut: "예산 50% 삭감",
    noSummary: "요약이 아직 없습니다",
    noTensions: "표시할 긴장 요소가 없습니다",
    noRecommendations: "추천 항목이 없습니다",
    noEvidence: "근거가 없습니다",
    noScores: "점수가 없습니다",
    instructorView: "교수자 화면",
    noPrompts: "프롬프트가 없습니다",
    noActivity: "활동 기록이 없습니다",
    checking: "확인 중...",
    noCourseLinkedYet: "아직 연결된 코스가 없습니다.",
    studentJoinHelper: "학생으로 로그인한 뒤 코스 참여 코드를 입력해주세요.",
    tutorialBack: "이전",
    tutorialNext: "다음",
    tutorialSkip: "건너뛰기",
    tutorialFinish: "완료",
    createFirstCase: "첫 케이스 만들기",
    noPublishedCasesYet: "게시된 케이스가 아직 없습니다",
    currentCase: "현재 케이스",
    publishedCase: "게시된 케이스",
    currentCourse: "현재 코스",
    draft: "초안",
    published: "공개됨",
    notSet: "설정 안 됨",
    live: "실시간",
    signInEmailPlaceholder: "you@school.edu",
    studentEmailPlaceholder: "student@school.edu",
    passwordPlaceholder: "비밀번호",
    courseCodePlaceholder: "코스 참여 코드",
    workspaceRole: "워크스페이스",
    stageD3: "D3 포스 그래프",
    stakeholderTeacher: "교수자",
    stakeholderAdministrator: "관리자",
    stakeholderStudent: "학생",
    stakeholderIt: "IT 시스템",
    stakeholderAccessibility: "접근성",
    statusNeedsAttention: "주의 필요",
    statusLookingStable: "안정적",
    statusMixedSignals: "혼재된 신호",
    statusAtRisk: "위험",
    statusNeedsReview: "검토 필요",
    workflowQuickStart: "빠른 시작",
    wfChooseCourse: "수업 선택하기",
    wfConfirmCourse: "케이스를 만들거나 수정하기 전에, 올바른 수업이 선택되어 있는지 확인해주세요.",
    wfReviewUpdateCase: "케이스 검토하기 또는 수정하기",
    wfUseCaseSelector: "케이스 선택기로 초안과 공개된 케이스를 전환하거나, 현재 케이스를 계속 수정할 수 있습니다.",
    wfCreateCase: "케이스 만들기",
    wfPasteBrief: "아래에 수업 설명 요약을 붙여넣으면 스튜디오가 자동으로 케이스로 구성합니다.",
    wfPublishedToStudents: "학생에게 공개됨",
    wfStudentsCanOpen: "이제 학생들이 자신의 작업 공간에서 이 케이스를 열어볼 수 있습니다.",
    wfPublishWhenReady: "준비되면 공개하세요",
    wfKeepDraftPrivate: "학생들이 사용할 시점 전까지는 초안을 비공개로 두세요.",
    wfStartInCourse: "교수자가 케이스를 공개한 수업에서 시작해주세요.",
    wfOpenPublishedCase: "공개된 케이스 열기",
    wfSelectPublishedCase: "공개된 케이스 선택",
    wfSelectedCaseLoaded: "선택한 케이스가 내 학습 세션에 열렸습니다.",
    wfUseSelectorPublished: "위의 케이스 선택기에서 공개된 케이스 하나를 골라주세요.",
    wfWaitInstructorPublish: "교수자가 이 수업에 케이스를 공개할 때까지 기다려주세요.",
    wfAskQuestionsReflect: "질문하고 되돌아보기",
    wfUseNetworkReflect: "네트워크, 근거, 프롬프트를 활용해 자신의 생각을 정리해보세요.",
    wfStartLearnerRun: "학습 세션 시작하기",
    wfCaseUnlocksPage: "케이스를 선택하면 나머지 페이지가 열립니다.",
    courseSetup: "수업 설정",
    institutionNamePlaceholder: "기관 이름을 입력하세요...",
    addInstitution: "기관 추가",
    courseNamePlaceholder: "수업 이름을 입력하세요...",
    addCourse: "수업 추가",
    newCase: "새 케이스",
    titlePlaceholder: "제목을 입력하세요...",
    caseTitleLabel: "케이스 제목",
    caseBriefLabel: "수업 설명 요약",
    caseVisibilityLabel: "공개 범위",
    publishToLearners: "학생에게 공개하기",
    keepAsDraft: "초안으로 두기 (공유 전 검토)",
    pasteBriefPlaceholder: "설명 요약을 붙여넣으세요 — 학습 대상, 학습 목표, 제약 조건, 활용 자원을 포함해주세요...",
    createCaseBtn: "케이스 만들기",
    createCourseFirst: "먼저 수업을 만들어주세요.",
    noCourseAssigned: "배정된 수업이 없습니다.",
    boardSettings: "보드 설정",
    mainQuestionPlaceholder: "중심 질문을 입력하세요...",
    dueDate: "마감일",
    sharingMode: "공유 방식",
    privateOnly: "나만 보기",
    nodeLimitPerStudent: "학생 1명당 노드 수 제한",
    aiAdditionsPerNode: "노드 1개당 AI 제안 수",
    layout: "배치 방식",
    force: "물리 기반",
    cluster: "군집형",
    radial: "방사형",
    saveSettings: "설정 저장",
    courseCases: "이 수업의 케이스",
    courseCasesHelp: "이어서 작업할 케이스를 열거나, 학생들이 볼 수 있게 공개해주세요.",
    openCase: "케이스 열기",
    publishVerb: "공개",
    unpublishVerb: "공개 취소",
    noCasesYet: "아직 만든 케이스가 없습니다.",
    yourCopy: "내 작업 사본",
    readyToStart: "시작 준비 완료",
    availableCases: "참여 가능한 케이스",
    ready: "준비 완료",
    addNode: "노드 추가하기",
    agendaBodyPlaceholder: "이 점이 수업 재설계에 왜 중요한가요?",
    addToMap: "지도에 추가하기",
    addNodeDefaultPrompt: "노드를 추가해주세요.",
    noNodes: "노드가 없습니다",
    aiAdditionsTitle: "AI가 제안한 노드",
    aiSuggested: "AI 제안",
    noAdditions: "추가된 노드가 없습니다",
    classViewTitle: "전체 화면",
    off: "끔",
    sharedPatterns: "공통 패턴",
    sharedClustersCount: "공통 군집 {count}개",
    studentRunsCount: "학생 참여 {count}건",
    noInstitutionSelected: "선택된 기관이 없습니다",
    noCourseSelected: "선택된 수업이 없습니다",
    createBaseBoardNote: "여기서 기본 보드를 만들고, 학생이 얼마나 노드를 추가할 수 있을지 정한 뒤, 준비가 되면 참여 코드를 공유해주세요.",
    choosePublishedBoardNote: "공개된 보드를 하나 선택하고, 교수자가 만든 기본 지도를 살펴본 뒤, 내 화면에서 노드와 메모를 추가해보세요.",
    caseCount: "케이스 {count}개",
    publishedCount: "공개 {count}개",
    publishedCasesCount: "공개된 케이스 {count}개",
    statusCasePublished: "이 케이스는 공개되었습니다. 이제 학생들이 각자의 화면에서 열어볼 수 있습니다.",
    statusCaseDraft: "이 케이스는 아직 초안입니다. 학생이 사용할 시점에 공개해주세요.",
    statusCreateChoose: "시작하려면 케이스를 만들거나 선택해주세요.",
    statusLearnerExploring: "{name}님이 선택한 케이스를 개인 메모에서 살펴보고 있습니다.",
    statusChoosePublished: "페이지의 나머지 부분을 열려면 공개된 케이스를 선택해주세요.",
    noCasePick: "선택된 케이스 없음",
    pickCase: "케이스 선택",
    start: "시작",
    startWithCase: "먼저 케이스를 선택해주세요.",
    casePreview: "케이스 미리보기",
    panelUpdatesWhenCaseOpen: "케이스를 열면 이 내용이 업데이트됩니다.",
    noLens: "선택된 관점 없음",
    openCaseShort: "케이스를 열어주세요.",
    selectNode: "노드 선택",
    noRelatedQuestionsYet: "아직 관련 질문이 없습니다.",
    openLearnerRun: "학습 세션을 열어주세요.",
    noSharedPatternsYet: "아직 공통 패턴이 없습니다.",
    noDialogueYet: "아직 오간 대화가 없습니다.",
    youLabel: "나",
    matrixNeedsAttention: "주의 필요",
    matrixBalanced: "균형 상태",
    matrixWatchClosely: "자세히 살피기",
    personalization: "개인화",
    feasibility: "실행 가능성",
    teacherSlack: "교수자 여유 시간",
    noInsights: "분석 결과 없음",
    noHistory: "기록 없음",
    veryHigh: "매우 높음",
    high: "높음",
    moderate: "보통",
    sandboxCriticalReview: "중점 검토",
    sandboxStable: "안정적",
    sandboxNeedsTuning: "조정 필요",
    instructorOnly: "교수자 전용",
    noNotes: "메모 없음",
    autoIteration: "자율 수정 제안",
    autoIterationBody: "교수자가 검토하기 전에 시스템이 수정 방향을 먼저 제안하도록 합니다.",
    stressScenarios: "부담 시나리오",
    accessibilityAudit: "접근성 점검",
    unionWorkloadComplaint: "교원 업무 과중 제기",
    systemResponse: "시스템 반응",
    whatChangesAfterAdjustment: "조정 후 달라지는 점",
    alignmentCohesion: "정합성",
    cognitiveLoadLabel: "인지 부하",
    responseTime: "응답 시간",
    caseReport: "케이스 리포트",
    draftSummary: "요약 초안 작성",
    refreshSummary: "요약 다시 만들기",
    executiveSummary: "핵심 요약",
    priorityTensions: "우선 쟁점",
    recommendedRedesignMoves: "권장하는 수정 방향",
    evidenceTrace: "근거 연결",
    reflection: "생각 정리",
    feedbackAndReflection: "피드백과 생각 정리",
    reflectionPromptsLabel: "생각 정리 질문",
    recentDialogue: "최근 대화",
    exampleView: "예시 화면",
    caseMapAppears: "여기에 케이스 지도가 표시됩니다.",
    caseMapAppearsBody: "케이스를 선택하면 이 지도에 관련 인물, 제약 조건, 주요 쟁점이 나타납니다.",
    instructionalSignals: "수업 설계 신호",
    constraintFriction: "제약 충돌",
    alignedEvidence: "관련 근거",
    instructionalSignalsDesc: "교사가 의도한 것 — 학습 목표, 수업 전략, 교수 설계 의도입니다.",
    constraintFrictionDesc: "시간·도구·정책·업무 부담 같은 현실 제약이 수업 의도와 충돌하는 지점입니다.",
    alignedEvidenceDesc: "교사·학생·IT 시스템 관점에서 설계 선택을 뒷받침하거나 반박하는 근거입니다.",
    conceptHelpTitle: "이 지도를 읽는 법",
    conceptHelpBody: "모든 케이스는 세 주체(교사 · IT 시스템 · 학생)의 관점으로 바라본 설계 문제입니다. 관점을 바꿔 보면 같은 긴장이 어떻게 달라 보이는지 확인할 수 있습니다. 세 관점은 서로를 잡아당기기 때문에 한 면만 봐서는 충분하지 않습니다.",
    perspectiveTeacherShort: "교사: 무엇을 계획하고 결정하는가.",
    perspectiveItShort: "IT 시스템: 도구가 무엇을 허용하고 막는가.",
    perspectiveStudentShort: "학생: 학습자가 실제로 무엇을 경험하는가.",
    visualizerIntroTitle: "시각화 도구 — 케이스를 지도로 펼치기",
    visualizerIntroBody: "각 노드는 관계자의 우려, 제약, 설계 결정입니다. 선은 어떤 요소들이 서로 맞물리는지를 보여줍니다. 노드를 눌러 내용을 확인하고, 원본에서 빠진 걱정거리는 새 노드로 추가해 보세요.",
    thinking: "생각 중입니다...",
    questionCouldNotBeProcessed: "질문을 처리하지 못했습니다.",
    studentOnboardingTitle: "무엇부터 해볼까요",
    studentOnboardingStep1: "아래 목록에서 공개된 케이스를 하나 골라 열어 보세요.",
    studentOnboardingStep2: "설명 요약을 읽고, 지도에서 노드들이 어떻게 연결되는지 살펴 보세요.",
    studentOnboardingStep3: "관점을 바꿔가며(교사 → IT 시스템 → 학생) 같은 케이스가 어떻게 달라 보이는지 확인해 보세요.",
    studentOnboardingStep4: "질문을 남기거나, 원본 케이스에 없는 관점을 새 노드로 추가해 보세요.",
    studentOnboardingTourButton: "가이드 투어 시작하기",
    expandStartHere: "시작하기",
    expandSelectedLens: "선택한 관점",
    mobileMap: "지도",
    mobilePeople: "인물",
    mobileTest: "테스트",
  },
};

const legacyDemoIds = new Set([
  "inst-northstar",
  "course-id-studio",
  "case-personalized-pathways",
  "instructor-rivera",
  "learner-maya-cho",
]);

const STORAGE_KEY = "swarm-id-platform-v2";
const SESSION_STORAGE_KEY = "swarm-id-session-v1";
const TUTORIAL_STORAGE_KEY = "swarm-id-tutorial-v1";
const LOCALE_STORAGE_KEY = "swarm-id-locale-v1";
const PLATFORM_ADMIN_EMAIL = "admin@swarm.io";
const DEFAULT_SUPABASE_CONFIG = window.SUPABASE_CONFIG || { url: "", anonKey: "" };
const DEFAULT_GEMINI_CONFIG = window.GEMINI_CONFIG || { apiKey: "", model: "gemini-2.5-flash" };

const state = {
  locale: window.localStorage.getItem(LOCALE_STORAGE_KEY) || "en",
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

function t(key, vars = {}) {
  const locale = translations[state.locale] ? state.locale : "en";
  const fallbackLocale = translations.en;
  const value =
    key.split(".").reduce((acc, part) => (acc && acc[part] != null ? acc[part] : undefined), translations[locale]) ??
    key.split(".").reduce((acc, part) => (acc && acc[part] != null ? acc[part] : undefined), fallbackLocale) ??
    key;
  return String(value).replace(/\{(\w+)\}/g, (_, token) => String(vars[token] ?? ""));
}

function setLocale(nextLocale) {
  state.locale = nextLocale === "ko" ? "ko" : "en";
  window.localStorage.setItem(LOCALE_STORAGE_KEY, state.locale);
  document.documentElement.lang = state.locale;
  applyStaticTranslations();
  renderAll();
  renderLandingLogin();
}

function stakeholderLabelKey(key) {
  return (
    {
      teacher: "stakeholderTeacher",
      administrator: "stakeholderAdministrator",
      student: "stakeholderStudent",
      it: "stakeholderIt",
      accessibility: "stakeholderAccessibility",
    }[key] || ""
  );
}

function stakeholderStatusKey(status) {
  return (
    {
      "Needs attention": "statusNeedsAttention",
      "Looking stable": "statusLookingStable",
      "Mixed signals": "statusMixedSignals",
      "At risk": "statusAtRisk",
      "Needs review": "statusNeedsReview",
    }[status] || ""
  );
}

function applyStaticTranslations() {
  document.title = "Design Tension Studio";
  document.documentElement.lang = state.locale;
  const skipLink = document.querySelector(".skip-link");
  if (skipLink) skipLink.textContent = t("skipToMain");

  const brandKickers = document.querySelectorAll(".landing-brand-kicker, .brand-block p");
  brandKickers.forEach((node) => {
    node.textContent = t("labName");
  });

  if (dom.landingLocaleToggle) dom.landingLocaleToggle.textContent = t("languageToggle");
  if (dom.workspaceLocaleToggle) dom.workspaceLocaleToggle.textContent = t("languageToggle");
  if (dom.startTutorialButton) dom.startTutorialButton.textContent = t("showTutorial");
  if (dom.returnToLanding) dom.returnToLanding.textContent = t("switchAccount");
  if (document.getElementById("landing-enter-button")) document.getElementById("landing-enter-button").textContent = t("signIn");
  if (document.getElementById("landing-login-submit")) document.getElementById("landing-login-submit").textContent = t("signInSubmit");
  if (document.getElementById("landing-join-submit")) document.getElementById("landing-join-submit").textContent = t("joinWithCode");

  const landingCopy = document.querySelector(".landing-copy");
  if (landingCopy) {
    const kicker = landingCopy.querySelector(".landing-kicker");
    const title = landingCopy.querySelector("h2");
    const body = landingCopy.querySelector(".landing-body");
    if (kicker) kicker.textContent = t("landingHeroKicker");
    if (title) title.textContent = t("landingHeroTitle");
    if (body) body.textContent = t("landingHeroBody");
  }

  const signalSpans = document.querySelectorAll(".landing-signal-row span");
  [t("signalTeacherLoad"), t("signalStudentAgency"), t("signalGovernance"), t("signalAccessibility")].forEach((text, index) => {
    if (signalSpans[index]) signalSpans[index].textContent = text;
  });

  const loginHeads = document.querySelectorAll(".landing-login-head");
  if (loginHeads[0]) {
    const kicker = loginHeads[0].querySelector(".landing-kicker");
    const strong = loginHeads[0].querySelector("strong");
    if (kicker) kicker.textContent = t("signIn");
    if (strong) strong.textContent = t("openWorkspace");
  }
  if (loginHeads[1]) {
    const kicker = loginHeads[1].querySelector(".landing-kicker");
    const strong = loginHeads[1].querySelector("strong");
    if (kicker) kicker.textContent = t("studentJoin");
    if (strong) strong.textContent = t("joinCourse");
  }

  const loginLabels = document.querySelectorAll("#landing-login-form .mini-control > span");
  if (loginLabels[0]) loginLabels[0].textContent = t("email");
  if (loginLabels[1]) loginLabels[1].textContent = t("password");
  const joinLabels = document.querySelectorAll("#landing-join-form .mini-control > span");
  if (joinLabels[0]) joinLabels[0].textContent = t("email");
  if (joinLabels[1]) joinLabels[1].textContent = t("password");
  if (joinLabels[2]) joinLabels[2].textContent = t("courseCode");

  if (dom.landingLoginEmail) dom.landingLoginEmail.placeholder = t("signInEmailPlaceholder");
  if (dom.landingLoginPassword) dom.landingLoginPassword.placeholder = t("passwordPlaceholder");
  if (dom.landingJoinEmail) dom.landingJoinEmail.placeholder = t("studentEmailPlaceholder");
  if (dom.landingJoinPassword) dom.landingJoinPassword.placeholder = t("passwordPlaceholder");
  if (dom.landingJoinCode) dom.landingJoinCode.placeholder = t("courseCodePlaceholder");
  if (dom.visualizerInput) dom.visualizerInput.placeholder = t("askQuestionPlaceholder");
  const chatInput = document.getElementById("chat-input");
  if (chatInput) chatInput.placeholder = t("askPerspectivePlaceholder");
  const quickAnnotationBody = document.getElementById("quick-annotation-body");
  if (quickAnnotationBody) quickAnnotationBody.placeholder = t("addNotePlaceholder");

  const landingAnnotations = document.querySelectorAll(".landing-annotation");
  if (landingAnnotations[0]) {
    const label = landingAnnotations[0].querySelector(".landing-annotation-label");
    const strong = landingAnnotations[0].querySelector("strong");
    if (label) label.textContent = t("landingHuman");
    if (strong) strong.textContent = t("landingHumanBody");
  }
  if (landingAnnotations[1]) {
    const label = landingAnnotations[1].querySelector(".landing-annotation-label");
    const strong = landingAnnotations[1].querySelector("strong");
    if (label) label.textContent = t("landingSystem");
    if (strong) strong.textContent = t("landingSystemBody");
  }

  const navMap = {
    visualizer: "navNetwork",
    perspectives: "navPerspectives",
    matrix: "navTradeoffs",
    sandbox: "navSandbox",
    report: "navReport",
  };
  document.querySelectorAll("[data-view]").forEach((button) => {
    const label = button.querySelector("span:last-child");
    if (label && navMap[button.dataset.view]) {
      label.textContent = t(navMap[button.dataset.view]);
    }
  });

  const healthHeaderLabel = document.querySelector(".health-header span");
  if (healthHeaderLabel) healthHeaderLabel.textContent = t("currentStatus");

  const roleLabel = document.querySelector("#role-control > span");
  if (roleLabel) roleLabel.textContent = t("workspaceRole");
  const institutionLabel = document.querySelector("#institution-select")?.closest("label")?.querySelector("span");
  const courseLabel = document.querySelector("#course-select")?.closest("label")?.querySelector("span");
  const learnerLabel = document.querySelector("#learner-control > span");
  if (institutionLabel) institutionLabel.textContent = t("institution");
  if (courseLabel) courseLabel.textContent = t("course");
  if (learnerLabel) learnerLabel.textContent = t("student");

  const roleOptions = document.querySelectorAll("#role-select option");
  if (roleOptions[0]) roleOptions[0].textContent = t("instructor");
  if (roleOptions[1]) roleOptions[1].textContent = t("student");

  const canvasHeader = document.querySelector(".canvas-header");
  if (canvasHeader) {
    const eyebrow = canvasHeader.querySelector(".eyebrow");
    const title = canvasHeader.querySelector("h3");
    if (eyebrow) eyebrow.textContent = t("systemTopology");
    if (title) title.textContent = t("proposalNetwork");
  }
  const mapLayerLabel = document.querySelector("#map-layer-control > span");
  if (mapLayerLabel) mapLayerLabel.textContent = t("mapLayer");
  const mapLayerOptions = document.querySelectorAll("#map-layer-select option");
  if (mapLayerOptions[0]) mapLayerOptions[0].textContent = t("baseMap");
  if (mapLayerOptions[1]) mapLayerOptions[1].textContent = t("myView");
  if (mapLayerOptions[2]) mapLayerOptions[2].textContent = t("classView");
  const activeMapLayerSelect = dom.mapLayerSelect;
  if (activeMapLayerSelect) {
    [...activeMapLayerSelect.options].forEach((option) => {
      if (option.value === "base") option.textContent = t("baseMap");
      if (option.value === "personal") option.textContent = t("myView");
      if (option.value === "cohort") option.textContent = t("classView");
    });
  }

  const insightPanel = document.querySelector(".insight-panel");
  if (insightPanel) {
    const sectionHeads = insightPanel.querySelectorAll(".subsection-head h4");
    if (insightPanel.querySelector(".section-header .eyebrow")) insightPanel.querySelector(".section-header .eyebrow").textContent = t("selectedLens");
    if (sectionHeads[0]) sectionHeads[0].textContent = t("topTensions");
    if (sectionHeads[1]) sectionHeads[1].textContent = t("evidenceQueue");
    if (sectionHeads[2]) sectionHeads[2].textContent = t("selectedNode");
    if (sectionHeads[3]) sectionHeads[3].textContent = t("relatedActivity");
  }
  const activityEyebrows = document.querySelectorAll(".related-activity-columns .eyebrow");
  if (activityEyebrows[0]) activityEyebrows[0].textContent = t("myQuestions");
  if (activityEyebrows[1]) activityEyebrows[1].textContent = t("classPatterns");
  const quickLabels = document.querySelectorAll("#quick-annotation-form .mini-control > span");
  if (quickLabels[0]) quickLabels[0].textContent = t("noteType");
  if (quickLabels[1]) quickLabels[1].textContent = t("share");
  const noteTypeOptions = document.querySelectorAll('#quick-annotation-form select[name="noteType"] option');
  if (noteTypeOptions[0]) noteTypeOptions[0].textContent = t("note");
  if (noteTypeOptions[1]) noteTypeOptions[1].textContent = t("question");
  if (noteTypeOptions[2]) noteTypeOptions[2].textContent = t("concern");
  const shareOptions = document.querySelectorAll('#quick-annotation-form select[name="visibility"] option');
  if (shareOptions[0]) shareOptions[0].textContent = t("onlyMe");
  if (shareOptions[1]) shareOptions[1].textContent = t("classView");
  if (dom.quickAnnotationSubmit) dom.quickAnnotationSubmit.textContent = t("saveNote");
  if (dom.downloadPngButton) dom.downloadPngButton.textContent = t("downloadPng");
  if (dom.downloadHtmlButton) dom.downloadHtmlButton.textContent = t("downloadHtmlSnapshot");
  const swarmHead = document.querySelector(".swarm-activity-panel .subsection-head h4");
  if (swarmHead) swarmHead.textContent = t("swarmActivity");
  const visualizerSubmit = document.querySelector('#visualizer-form button[type="submit"]');
  if (visualizerSubmit && !visualizerSubmit.disabled) visualizerSubmit.textContent = t("askQuestion");
  const visualizerHint = document.getElementById("visualizer-hint");
  if (visualizerHint) visualizerHint.textContent = t("askQuestionHint");

  const stageLegendItems = document.querySelectorAll(".stage-overlay-bottom .legend-item");
  stageLegendItems.forEach((item) => {
    const key = item.dataset.legendKey;
    if (!key) return;
    const label = item.querySelector(".legend-label");
    const desc = item.querySelector(".legend-desc");
    if (label) label.textContent = t(key);
    if (desc) desc.textContent = t(`${key}Desc`);
  });

  const visualizerIntroTitle = document.getElementById("visualizer-intro-title");
  if (visualizerIntroTitle) visualizerIntroTitle.textContent = t("visualizerIntroTitle");
  const visualizerIntroBody = document.getElementById("visualizer-intro-body");
  if (visualizerIntroBody) visualizerIntroBody.textContent = t("visualizerIntroBody");

  const onboardingCard = document.getElementById("student-onboarding");
  if (onboardingCard) {
    const isStudent = state.activeRole === "user";
    let dismissed = false;
    try { dismissed = localStorage.getItem("view-intro-dismissed:student-onboarding") === "1"; } catch (_) {}
    onboardingCard.hidden = !isStudent || dismissed;
    const onbTitle = document.getElementById("student-onboarding-title");
    if (onbTitle) onbTitle.textContent = t("studentOnboardingTitle");
    ["1", "2", "3", "4"].forEach((n) => {
      const el = document.getElementById(`student-onboarding-step-${n}`);
      if (el) el.textContent = t(`studentOnboardingStep${n}`);
    });
    const tourBtn = document.getElementById("student-onboarding-tour-button");
    if (tourBtn) tourBtn.textContent = t("studentOnboardingTourButton");
  }

  const expandIntakeLabel = document.getElementById("panel-expand-intake-label");
  if (expandIntakeLabel) expandIntakeLabel.textContent = t("expandStartHere");
  const expandInsightLabel = document.getElementById("panel-expand-insight-label");
  if (expandInsightLabel) expandInsightLabel.textContent = t("expandSelectedLens");

  const conceptHelpTitle = document.getElementById("concept-help-title");
  if (conceptHelpTitle) conceptHelpTitle.textContent = t("conceptHelpTitle");
  const conceptHelpBody = document.getElementById("concept-help-body");
  if (conceptHelpBody) conceptHelpBody.textContent = t("conceptHelpBody");
  const perspectiveTeacherLabel = document.getElementById("perspective-teacher-label");
  if (perspectiveTeacherLabel) {
    const parts = t("perspectiveTeacherShort").split(":");
    perspectiveTeacherLabel.textContent = parts[0] || "";
    const body = document.getElementById("perspective-teacher-body");
    if (body) body.textContent = parts.slice(1).join(":").trim();
  }
  const perspectiveItLabel = document.getElementById("perspective-it-label");
  if (perspectiveItLabel) {
    const parts = t("perspectiveItShort").split(":");
    perspectiveItLabel.textContent = parts[0] || "";
    const body = document.getElementById("perspective-it-body");
    if (body) body.textContent = parts.slice(1).join(":").trim();
  }
  const perspectiveStudentLabel = document.getElementById("perspective-student-label");
  if (perspectiveStudentLabel) {
    const parts = t("perspectiveStudentShort").split(":");
    perspectiveStudentLabel.textContent = parts[0] || "";
    const body = document.getElementById("perspective-student-body");
    if (body) body.textContent = parts.slice(1).join(":").trim();
  }

  const emptyPreview = document.querySelector(".network-empty-preview");
  if (emptyPreview) {
    const eyebrow = emptyPreview.querySelector(".eyebrow");
    const title = emptyPreview.querySelector("strong");
    const body = emptyPreview.querySelector("p:not(.eyebrow)");
    const tokens = emptyPreview.querySelectorAll(".preview-token");
    if (eyebrow) eyebrow.textContent = t("exampleView");
    if (title) title.textContent = t("caseMapAppears");
    if (body) body.textContent = t("caseMapAppearsBody");
    if (tokens[0]) tokens[0].textContent = t("signalTeacherLoad");
    if (tokens[1]) tokens[1].textContent = t("signalStudentAgency");
    if (tokens[2]) tokens[2].textContent = t("signalAccessibility");
  }

  const perspectivesView = document.querySelector('[data-view-panel="perspectives"]');
  if (perspectivesView) {
    const headers = perspectivesView.querySelectorAll(".section-header");
    if (headers[0]) {
      const eyebrow = headers[0].querySelector(".eyebrow");
      const title = headers[0].querySelector("h3");
      if (eyebrow) eyebrow.textContent = t("peopleInCase");
      if (title) title.textContent = t("keyConcerns");
    }
    if (headers[1]) {
      const eyebrow = headers[1].querySelector(".eyebrow");
      if (eyebrow) eyebrow.textContent = t("currentFocus");
    }
    if (headers[2]) {
      const eyebrow = headers[2].querySelector(".eyebrow");
      const title = headers[2].querySelector("h3");
      if (eyebrow) eyebrow.textContent = t("questions");
      if (title) title.textContent = t("askAboutPerspective");
    }
  }
  const chatSubmit = document.querySelector('#chat-form button[type="submit"]');
  if (chatSubmit && !chatSubmit.disabled) chatSubmit.textContent = t("ask");

  const chatPromptButtons = document.querySelectorAll('#chat-form button[data-prompt]');
  if (chatPromptButtons[0]) chatPromptButtons[0].textContent = state.locale === "ko" ? "해결 방향 제안" : "Suggest a fix";
  if (chatPromptButtons[1]) chatPromptButtons[1].textContent = state.locale === "ko" ? "핵심 우려 찾기" : "Find the main concern";

  const metricLabels = {
    'label[for="personalization-range"]': "personalizationDepth",
    'label[for="teacher-load-range"]': "teacherLoadLabel",
    'label[for="privacy-range"]': "privacyResilience",
    'label[for="accessibility-range"]': "accessibilityCoverage",
  };
  Object.entries(metricLabels).forEach(([selector, key]) => {
    const label = document.querySelector(selector);
    if (label) {
      const valueSpan = label.querySelector("span");
      label.childNodes[0].textContent = `${t(key)} `;
      if (valueSpan) label.appendChild(valueSpan);
    }
  });
  const budgetButton = document.querySelector('[data-scenario="budget"]');
  if (budgetButton) budgetButton.textContent = t("budgetCut");
  const accessibilityButton = document.querySelector('[data-scenario="accessibility"]');
  if (accessibilityButton) accessibilityButton.textContent = t("accessibilityAudit");
  const workloadButton = document.querySelector('[data-scenario="workload"]');
  if (workloadButton) workloadButton.textContent = t("unionWorkloadComplaint");

  const matrixView = document.querySelector('[data-view-panel="matrix"]');
  if (matrixView) {
    const sectionHeaders = matrixView.querySelectorAll(".section-header");
    if (sectionHeaders[0]) {
      const eyebrow = sectionHeaders[0].querySelector(".eyebrow");
      const title = sectionHeaders[0].querySelector("h3");
      if (eyebrow) eyebrow.textContent = t("navTradeoffs");
      if (title) title.textContent = state.locale === "ko" ? "함께 변하는 요소" : "What changes together";
    }
    if (sectionHeaders[1]) {
      const eyebrow = sectionHeaders[1].querySelector(".eyebrow");
      const title = sectionHeaders[1].querySelector("h3");
      if (eyebrow) eyebrow.textContent = state.locale === "ko" ? "변경 이력" : "Change history";
      if (title) title.textContent = state.locale === "ko" ? "의사결정 로그" : "Decision log";
    }
    const radarLabels = matrixView.querySelectorAll(".radar-label");
    if (radarLabels[0]) radarLabels[0].textContent = t("personalization");
    if (radarLabels[1]) radarLabels[1].textContent = state.locale === "ko" ? "프라이버시" : "Privacy";
    if (radarLabels[2]) radarLabels[2].textContent = t("accessibility");
    if (radarLabels[3]) radarLabels[3].textContent = t("feasibility");
    if (radarLabels[4]) radarLabels[4].textContent = t("teacherLoadLabel");
  }

  const sandboxView = document.querySelector('[data-view-panel="sandbox"]');
  if (sandboxView) {
    const sectionHeaders = sandboxView.querySelectorAll(".section-header");
    if (sectionHeaders[0]) {
      const eyebrow = sectionHeaders[0].querySelector(".eyebrow");
      const title = sectionHeaders[0].querySelector("h3");
      if (eyebrow) eyebrow.textContent = state.locale === "ko" ? "변화 실험" : "Test changes";
      if (title) title.textContent = state.locale === "ko" ? "케이스 조정" : "Adjust the case";
    }
    if (sectionHeaders[1]) {
      const eyebrow = sectionHeaders[1].querySelector(".eyebrow");
      const title = sectionHeaders[1].querySelector("h3");
      if (eyebrow) eyebrow.textContent = t("systemResponse");
      if (title) title.textContent = t("whatChangesAfterAdjustment");
    }
    const toggleTitle = sandboxView.querySelector(".toggle-row h4");
    const toggleBody = sandboxView.querySelector(".toggle-row p");
    const stressLabel = sandboxView.querySelector(".scenario-group .label");
    const reactionCards = sandboxView.querySelectorAll(".reaction-grid .metric-card p");
    if (toggleTitle) toggleTitle.textContent = t("autoIteration");
    if (toggleBody) toggleBody.textContent = t("autoIterationBody");
    if (stressLabel) stressLabel.textContent = t("stressScenarios");
    if (reactionCards[0]) reactionCards[0].textContent = t("alignmentCohesion");
    if (reactionCards[1]) reactionCards[1].textContent = t("cognitiveLoadLabel");
    if (reactionCards[2]) reactionCards[2].textContent = t("responseTime");
  }

  const reportView = document.querySelector('[data-view-panel="report"]');
  if (reportView) {
    const sectionHeaders = reportView.querySelectorAll(".section-header");
    if (sectionHeaders[0]) {
      const eyebrow = sectionHeaders[0].querySelector(".eyebrow");
      const title = sectionHeaders[0].querySelector("h3");
      if (eyebrow) eyebrow.textContent = t("caseReport");
      if (title) title.textContent = t("draftSummary");
    }
    if (sectionHeaders[1]) {
      const eyebrow = sectionHeaders[1].querySelector(".eyebrow");
      const title = sectionHeaders[1].querySelector("h3");
      if (eyebrow) eyebrow.textContent = t("reflection");
      if (title) title.textContent = t("feedbackAndReflection");
    }
    const labels = reportView.querySelectorAll(".memo-section .label, .reflection-block .label");
    if (labels[0]) labels[0].textContent = t("executiveSummary");
    if (labels[1]) labels[1].textContent = t("priorityTensions");
    if (labels[2]) labels[2].textContent = t("recommendedRedesignMoves");
    if (labels[3]) labels[3].textContent = t("evidenceTrace");
    if (labels[4]) labels[4].textContent = t("reflectionPromptsLabel");
    if (labels[5]) labels[5].textContent = t("recentDialogue");
  }

  const regenerateMemoButton = document.getElementById("regenerate-memo");
  if (regenerateMemoButton) regenerateMemoButton.textContent = t("refreshSummary");

  const mobileDockLabels = document.querySelectorAll(".mobile-dock .dock-item span:last-child");
  if (mobileDockLabels[0]) mobileDockLabels[0].textContent = t("mobileMap");
  if (mobileDockLabels[1]) mobileDockLabels[1].textContent = t("mobilePeople");
  if (mobileDockLabels[2]) mobileDockLabels[2].textContent = t("navTradeoffs");
  if (mobileDockLabels[3]) mobileDockLabels[3].textContent = t("mobileTest");
  if (mobileDockLabels[4]) mobileDockLabels[4].textContent = t("navReport");
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

function logEvent(eventType, payload = {}) {
  if (!isSupabaseSessionActive()) return;
  const client = initializeSupabase();
  if (!client) return;
  const course = getActiveCourse();
  const row = {
    user_id: state.auth.userId,
    course_id: course?.id || null,
    case_id: state.activeCaseId || null,
    role: state.activeRole || null,
    event_type: String(eventType || "unknown"),
    payload: payload && typeof payload === "object" ? payload : { value: payload },
    client_ts: new Date().toISOString(),
  };
  try {
    const result = client.from("analytics_events").insert(row);
    if (result && typeof result.then === "function") {
      result.then(({ error } = {}) => {
        if (error) console.warn("analytics_events insert failed", eventType, error.message || error);
      }).catch((error) => {
        console.warn("analytics_events insert threw", eventType, error?.message || error);
      });
    }
  } catch (error) {
    console.warn("analytics_events dispatch failed", eventType, error?.message || error);
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
  logEvent("auth.sign_in", { email_domain: (sessionUser.email || "").split("@")[1] || "", role: state.activeRole });
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
    .select("id, institution_id, code, name, join_code, settings")
    .eq("join_code", normalizedCode)
    .maybeSingle();
  if (courseError) throw courseError;
  if (!course) {
    throw new Error("That course code was not found.");
  }

  const courseSections = Array.isArray(course.settings?.sections)
    ? course.settings.sections.map((s) => String(s).trim()).filter(Boolean)
    : [];
  let chosenSection = null;
  if (courseSections.length > 0) {
    const prompt = `Which section of ${course.code} are you in?\n\nEnter one of: ${courseSections.join(", ")}`;
    for (let i = 0; i < 3 && !chosenSection; i++) {
      const raw = window.prompt(prompt, courseSections[0]);
      if (raw === null) throw new Error("Section is required to join this course.");
      const match = courseSections.find((s) => s.toLowerCase() === String(raw).trim().toLowerCase());
      if (match) chosenSection = match;
    }
    if (!chosenSection) throw new Error("Section not recognized. Ask your instructor for the correct section number.");
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
  if (chosenSection) membershipPayload.section = chosenSection;

  const { data: existingMemberships, error: membershipLookupError } = await client
    .from("course_memberships")
    .select("id, course_id, role, status")
    .eq("user_id", state.auth.userId)
    .eq("status", "active");
  if (membershipLookupError) throw membershipLookupError;

  const activeMemberships = asArray(existingMemberships);
  const sameCourseMembership = activeMemberships.find((item) => item.course_id === course.id && item.role === "user");
  if (!sameCourseMembership) {
    const otherActiveStudentMembership = activeMemberships.find(
      (item) => item.course_id !== course.id && item.role === "user"
    );
    if (otherActiveStudentMembership) {
      throw new Error("This student account is already linked to another active course.");
    }

    const { error: membershipInsertError } = await client.from("course_memberships").insert(membershipPayload);
    if (membershipInsertError) {
      if (membershipInsertError.code === "23505") {
        throw new Error("This student account is already linked to another active course.");
      }
      throw membershipInsertError;
    }
  }

  await refreshRemotePlatformContext();
  state.activeRole = "user";
  state.auth.message = `Joined ${course.code}.`;
  ensureActiveSelections();
  persistSessionState();
  logEvent("course.join", { course_code: course.code, course_id: course.id, section: chosenSection || null });
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
  landingLocaleToggle: document.getElementById("landing-locale-toggle"),
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
  topbar: document.querySelector(".topbar"),
  topbarCollapseToggle: document.getElementById("topbar-collapse-toggle"),
  topbarCompactSummary: document.getElementById("topbar-compact-summary"),
  workspaceLocaleToggle: document.getElementById("workspace-locale-toggle"),
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
  caseTitleEdit: document.getElementById("case-title-edit"),
  caseSubtitle: document.getElementById("case-subtitle"),
  topKicker: document.getElementById("top-kicker"),
  topTitle: document.getElementById("view-title"),
  sidebarTensionLabel: document.getElementById("sidebar-tension-label"),
  sidebarTension: document.getElementById("sidebar-tension"),
  sidebarTensionFill: document.getElementById("sidebar-tension-fill"),
  sidebarTensionHint: document.getElementById("sidebar-tension-hint"),
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
  studentExportActions: document.getElementById("student-export-actions"),
  downloadPngButton: document.getElementById("download-png-button"),
  downloadHtmlButton: document.getElementById("download-html-button"),
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
  relatedPersonalActivity: document.getElementById("related-personal-activity"),
  relatedClassActivity: document.getElementById("related-class-activity"),
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
  instructorCohortBlock: document.getElementById("instructor-cohort-block"),
  instructorCohortPanel: document.getElementById("instructor-cohort-panel"),
  cohortRefresh: document.getElementById("cohort-refresh"),
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
  const labelKey = stakeholderLabelKey(key);
  const statusKey = stakeholderStatusKey(overrides.status || base.status);
  return {
    ...base,
    ...overrides,
    label: overrides.label || (labelKey ? t(labelKey) : base.label),
    icon: overrides.icon || base.icon,
    status: statusKey ? t(statusKey) : overrides.status || base.status,
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
  const layers = [{ value: "base", label: t("baseMap") }];
  if (state.activeRole === "user") {
    layers.push({ value: "personal", label: t("myView") });
  }
  if (settings.sharingMode !== "private") {
    layers.push({ value: "cohort", label: t("classView") });
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
  const isKorean = state.locale === "ko";
  setAiStatus(`Responding with ${getGeminiConfig().model}â€¦`, { busy: true });
  try {
    const response = await requestGeminiContent({
      systemInstruction: isKorean
        ? "당신은 교수 설계 분석 보조입니다. 한 관계자의 관점에서 평이한 한국어로 답하세요. 글머리 기호나 마크다운은 사용하지 마세요."
        : "You are an instructional design analysis assistant. Answer from one stakeholder lens in plain language, with no bullets and no markdown.",
      prompt: [
        `Stakeholder lens: ${stakeholder.label}`,
        `Stakeholder summary: ${stakeholder.summary}`,
        `Case title: ${activeCase?.title || "Untitled case"}`,
        `Case summary: ${activeCase?.summary || ""}`,
        `Constraints: ${normalizeStringList(activeCase?.constraints).join(" | ")}`,
        `Question: ${question}`,
        isKorean
          ? "한국어로 2~3문장 이내의 자연스러운 답변을 작성하세요. 설계 관점의 긴장 요소 한 가지와 실무에서 점검할 다음 단계 한 가지를 포함하세요."
          : "Answer in 2 or 3 concise sentences. Mention one design tension and one practical next check.",
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
  dom.caseSummaryLabel.textContent = state.activeRole === "admin" ? (state.locale === "ko" ? "선택된 교수자 케이스" : "Selected Instructor Case") : (state.locale === "ko" ? "선택된 게시 케이스" : "Selected Published Case");
  dom.sidebarTensionLabel.textContent = state.activeRole === "admin" ? t("caseTension") : (state.locale === "ko" ? "학습 런 긴장도" : "Learner run tension");
  if (dom.sidebarTensionHint) dom.sidebarTensionHint.textContent = t("tensionScaleHint");
  if (!activeCase) {
    state.metrics = { ...emptyMetrics };
    state.evidence = [];
    state.decisions = [];
    state.chat = [];
    state.timeline = [];
    dom.caseTitle.textContent = state.locale === "ko" ? "선택된 케이스 없음" : "No case selected";
    dom.caseSubtitle.textContent =
      state.activeRole === "admin"
        ? (state.locale === "ko" ? "케이스를 만들거나 선택하세요." : "Create or select a case.")
        : (state.locale === "ko" ? "게시된 케이스를 선택하세요." : "Choose a published case.");
    if (dom.caseTitleEdit) dom.caseTitleEdit.hidden = true;
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
  if (dom.caseTitleEdit) dom.caseTitleEdit.hidden = state.activeRole !== "admin";
}

async function renameActiveCase() {
  const course = getActiveCourse();
  const activeCase = getCaseById(state.activeCaseId, course);
  if (!activeCase || state.activeRole !== "admin") return;
  const prompt = state.locale === "ko" ? "새 케이스 제목을 입력하세요" : "Enter a new case title";
  const nextTitle = window.prompt(prompt, activeCase.title);
  if (nextTitle === null) return;
  const trimmed = nextTitle.trim();
  if (!trimmed || trimmed === activeCase.title) return;
  const previousTitle = activeCase.title;
  activeCase.title = trimmed;
  dom.caseTitle.textContent = trimmed;
  persistPlatformState();
  renderPipeline();
  logEvent("case.rename", { case_id: activeCase.id, from: previousTitle, to: trimmed });
  if (isSupabaseSessionActive()) {
    try {
      await syncCaseToSupabase(activeCase, course?.id);
    } catch (error) {
      console.error("Failed to persist case rename", error);
    }
  }
}

function handleReflectionSubmit(promptIndex) {
  const activeCase = getCaseById(state.activeCaseId);
  if (!activeCase) return;
  const prompts = asArray(activeCase.reflectionPrompts);
  const prompt = prompts[promptIndex];
  if (prompt == null) return;
  const textarea = dom.reflectionPrompts?.querySelector(
    `textarea.reflection-response[data-prompt-index="${promptIndex}"]`
  );
  const status = dom.reflectionPrompts?.querySelector(
    `[data-reflection-status="${promptIndex}"]`
  );
  const answer = String(textarea?.value || "").trim();
  if (!answer) {
    if (status) status.textContent = state.locale === "ko" ? "먼저 답변을 적어주세요." : "Write your reflection first.";
    return;
  }
  logEvent("reflection.submit", {
    prompt_index: promptIndex,
    prompt: String(prompt).slice(0, 400),
    answer: answer.slice(0, 2000),
    length: answer.length,
  });
  if (status) status.textContent = state.locale === "ko" ? "제출됨 · 강사에게 공유되었습니다." : "Submitted — shared with your instructor.";
}

async function renderInstructorCohortPanel() {
  const panel = dom.instructorCohortPanel;
  if (!panel) return;
  const course = getActiveCourse();
  const activeCase = getCaseById(state.activeCaseId);
  if (!course?.id || !activeCase?.id) {
    panel.innerHTML = `<p class="muted">${state.locale === "ko" ? "게시된 케이스가 선택되면 표시됩니다." : "Select a case to see cohort activity."}</p>`;
    return;
  }
  if (!isSupabaseSessionActive()) {
    panel.innerHTML = `<p class="muted">${state.locale === "ko" ? "로그인 후 데이터가 표시됩니다." : "Sign in to load cohort data."}</p>`;
    return;
  }
  const client = initializeSupabase();
  if (!client) return;
  panel.innerHTML = `<p class="muted">${state.locale === "ko" ? "불러오는 중…" : "Loading…"}</p>`;
  try {
    const [membersRes, eventsRes] = await Promise.all([
      client
        .from("course_memberships")
        .select("user_id, display_name, status, role, section")
        .eq("course_id", course.id)
        .eq("role", "user")
        .eq("status", "active"),
      client
        .from("analytics_events")
        .select("user_id, event_type, case_id, created_at")
        .eq("course_id", course.id),
    ]);
    if (membersRes.error) throw membersRes.error;
    if (eventsRes.error) throw eventsRes.error;
    const allMembers = asArray(membersRes.data);
    const events = asArray(eventsRes.data);
    const configuredSections = Array.isArray(course.settings?.sections)
      ? course.settings.sections.map((s) => String(s).trim()).filter(Boolean)
      : [];
    const currentFilter = state.cohortSectionFilter && (configuredSections.includes(state.cohortSectionFilter) || state.cohortSectionFilter === "__unassigned__")
      ? state.cohortSectionFilter
      : "__all__";
    state.cohortSectionFilter = currentFilter;
    const members = currentFilter === "__all__"
      ? allMembers
      : currentFilter === "__unassigned__"
        ? allMembers.filter((m) => !m.section)
        : allMembers.filter((m) => m.section === currentFilter);
    const filterBar = configuredSections.length
      ? `<div class="cohort-filter" role="group" aria-label="Section filter">
          ${[
            { v: "__all__", label: state.locale === "ko" ? "전체" : "All" },
            ...configuredSections.map((s) => ({ v: s, label: s })),
            { v: "__unassigned__", label: state.locale === "ko" ? "미지정" : "Unassigned" },
          ].map((opt) => `<button type="button" class="cohort-filter-button${opt.v === currentFilter ? " is-active" : ""}" data-cohort-filter="${escapeHtml(opt.v)}">${escapeHtml(opt.label)}</button>`).join("")}
        </div>`
      : "";
    if (!members.length) {
      panel.innerHTML = `${filterBar}<p class="muted">${state.locale === "ko" ? "이 섹션에 학생이 없습니다." : "No students in this section."}</p>`;
      return;
    }
    const byUser = new Map();
    for (const ev of events) {
      if (!ev.user_id) continue;
      let entry = byUser.get(ev.user_id);
      if (!entry) {
        entry = {
          total: 0,
          joined: false,
          opened: false,
          addedNode: false,
          reflected: false,
          askedQuestion: false,
          lastAt: null,
        };
        byUser.set(ev.user_id, entry);
      }
      entry.total += 1;
      if (!entry.lastAt || ev.created_at > entry.lastAt) entry.lastAt = ev.created_at;
      if (ev.event_type === "course.join") entry.joined = true;
      const scopedToCase = ev.case_id === activeCase.id;
      if (ev.event_type === "case.open" && scopedToCase) entry.opened = true;
      if (ev.event_type === "node.add" && scopedToCase) entry.addedNode = true;
      if (ev.event_type === "reflection.submit" && scopedToCase) entry.reflected = true;
      if (ev.event_type === "question.ask" && scopedToCase) entry.askedQuestion = true;
    }
    const tick = (b) => (b ? '<span class="check">&#10003;</span>' : '<span class="dash">&mdash;</span>');
    const fmt = (iso) => {
      if (!iso) return '<span class="dash">&mdash;</span>';
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return '<span class="dash">&mdash;</span>';
      return escapeHtml(d.toISOString().slice(0, 16).replace("T", " "));
    };
    const showSectionCol = configuredSections.length > 0;
    const headers = state.locale === "ko"
      ? ["학생", ...(showSectionCol ? ["섹션"] : []), "참여", "케이스 열기", "노드 추가", "질문", "리플렉션", "총 이벤트", "최근 활동"]
      : ["Student", ...(showSectionCol ? ["Section"] : []), "Joined", "Opened case", "Added node", "Asked", "Reflected", "Events", "Last active"];
    const rows = members
      .map((m) => {
        const entry = byUser.get(m.user_id) || { total: 0, joined: false, opened: false, addedNode: false, reflected: false, askedQuestion: false, lastAt: null };
        const name = escapeHtml(m.display_name || m.user_id.slice(0, 8));
        const sectionCell = showSectionCol
          ? `<td>${m.section ? escapeHtml(m.section) : '<span class="dash">&mdash;</span>'}</td>`
          : "";
        return `
          <tr class="cohort-row" data-cohort-user="${escapeHtml(m.user_id)}" data-cohort-name="${name}">
            <td><button type="button" class="cohort-name-button">${name}</button></td>
            ${sectionCell}
            <td>${tick(entry.joined)}</td>
            <td>${tick(entry.opened)}</td>
            <td>${tick(entry.addedNode)}</td>
            <td>${tick(entry.askedQuestion)}</td>
            <td>${tick(entry.reflected)}</td>
            <td>${entry.total}</td>
            <td>${fmt(entry.lastAt)}</td>
          </tr>
        `;
      })
      .join("");
    panel.innerHTML = `
      ${filterBar}
      <table>
        <thead><tr>${headers.map((h) => `<th>${escapeHtml(h)}</th>`).join("")}</tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div id="cohort-drilldown" class="cohort-drilldown" hidden></div>
    `;
  } catch (error) {
    console.error("cohort panel load failed", error);
    panel.innerHTML = `<p class="muted">${state.locale === "ko" ? "불러오기 실패" : "Failed to load cohort data."}</p>`;
  }
}

function formatDrilldownEvent(ev) {
  const payload = ev.payload || {};
  const stamp = ev.created_at ? new Date(ev.created_at).toISOString().slice(0, 16).replace("T", " ") : "";
  const safe = (v) => escapeHtml(String(v == null ? "" : v));
  const ko = state.locale === "ko";
  switch (ev.event_type) {
    case "auth.sign_in":
      return { stamp, label: ko ? "로그인" : "Signed in", body: "" };
    case "course.join":
      return { stamp, label: ko ? "코스 참여" : "Joined course", body: payload.course_code ? safe(payload.course_code) : "" };
    case "case.open":
      return { stamp, label: ko ? "케이스 열기" : "Opened case", body: payload.via ? `via ${safe(payload.via)}` : "" };
    case "case.create":
      return { stamp, label: ko ? "케이스 생성" : "Created case", body: safe(payload.title || "") };
    case "case.rename":
      return { stamp, label: ko ? "케이스 이름 변경" : "Renamed case", body: `${safe(payload.from)} → ${safe(payload.to)}` };
    case "case.publish":
      return { stamp, label: ko ? "게시" : "Published case", body: safe(payload.title || "") };
    case "case.unpublish":
      return { stamp, label: ko ? "게시 취소" : "Unpublished case", body: safe(payload.title || "") };
    case "view.switch":
      return { stamp, label: ko ? "뷰 전환" : "Viewed", body: `${safe(payload.from)} → ${safe(payload.to)}` };
    case "lens.change":
      return { stamp, label: ko ? "렌즈 변경" : "Switched lens", body: `${safe(payload.from)} → ${safe(payload.to)}` };
    case "node.add":
      return { stamp, label: ko ? "노드 추가" : "Added node", body: safe(payload.title || "(untitled)"), sub: payload.stakeholder ? `stakeholder: ${safe(payload.stakeholder)}` : "" };
    case "question.ask":
      return { stamp, label: ko ? "질문" : "Asked", body: safe(payload.text || ""), sub: payload.stakeholder ? `lens: ${safe(payload.stakeholder)}` : "" };
    case "perspective.quick":
      return { stamp, label: ko ? "빠른 프롬프트" : "Quick prompt", body: safe(payload.prompt || "") };
    case "reflection.submit":
      return {
        stamp,
        label: ko ? `리플렉션 #${payload.prompt_index ?? "?"}` : `Reflection #${payload.prompt_index ?? "?"}`,
        body: safe(payload.answer || ""),
        sub: payload.prompt ? `prompt: ${safe(payload.prompt)}` : "",
        highlight: true,
      };
    case "tutorial.start":
      return { stamp, label: ko ? "튜토리얼 시작" : "Tutorial started", body: "" };
    case "tutorial.step":
      return { stamp, label: ko ? "튜토리얼 단계" : "Tutorial step", body: `#${safe(payload.step_index)}` };
    case "tutorial.complete":
      return { stamp, label: ko ? "튜토리얼 완료" : "Tutorial completed", body: "" };
    case "tutorial.skip":
      return { stamp, label: ko ? "튜토리얼 건너뛰기" : "Tutorial skipped", body: `#${safe(payload.step_index ?? 0)}` };
    default:
      return { stamp, label: safe(ev.event_type), body: safe(JSON.stringify(payload).slice(0, 160)) };
  }
}

async function renderStudentDrilldown(userId, displayName) {
  const container = document.getElementById("cohort-drilldown");
  if (!container) return;
  const course = getActiveCourse();
  if (!course?.id) return;
  if (!isSupabaseSessionActive()) return;
  const client = initializeSupabase();
  if (!client) return;
  container.hidden = false;
  const ko = state.locale === "ko";
  const loading = ko ? "불러오는 중…" : "Loading timeline…";
  container.innerHTML = `
    <div class="drilldown-header">
      <h4>${escapeHtml(displayName)} ${ko ? "활동 타임라인" : "activity timeline"}</h4>
      <button type="button" class="toolbar-button" data-drilldown-close>${ko ? "닫기" : "Close"}</button>
    </div>
    <p class="muted">${loading}</p>
  `;
  try {
    const { data, error } = await client
      .from("analytics_events")
      .select("event_type, payload, case_id, created_at")
      .eq("course_id", course.id)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw error;
    const events = asArray(data);
    if (!events.length) {
      container.innerHTML = `
        <div class="drilldown-header">
          <h4>${escapeHtml(displayName)} ${ko ? "활동 타임라인" : "activity timeline"}</h4>
          <button type="button" class="toolbar-button" data-drilldown-close>${ko ? "닫기" : "Close"}</button>
        </div>
        <p class="muted">${ko ? "활동 이벤트가 없습니다." : "No activity yet."}</p>
      `;
      return;
    }
    const reflections = events
      .filter((ev) => ev.event_type === "reflection.submit")
      .sort((a, b) => (a.created_at < b.created_at ? -1 : 1));
    const reflectionMarkup = reflections.length
      ? `
        <section class="drilldown-section">
          <p class="label">${ko ? "리플렉션 답변" : "Reflection answers"}</p>
          <div class="drilldown-reflections">
            ${reflections
              .map((ev) => {
                const p = ev.payload || {};
                return `
                  <article class="drilldown-reflection">
                    <header>#${escapeHtml(String(p.prompt_index ?? "?"))} &middot; ${escapeHtml(new Date(ev.created_at).toISOString().slice(0, 16).replace("T", " "))}</header>
                    ${p.prompt ? `<p class="muted">${escapeHtml(String(p.prompt))}</p>` : ""}
                    <p>${escapeHtml(String(p.answer || ""))}</p>
                  </article>
                `;
              })
              .join("")}
          </div>
        </section>
      `
      : "";
    const timelineMarkup = `
      <section class="drilldown-section">
        <p class="label">${ko ? "이벤트 타임라인" : "Event timeline"}</p>
        <ol class="drilldown-timeline">
          ${events
            .map((ev) => {
              const row = formatDrilldownEvent(ev);
              const cls = row.highlight ? "drilldown-item is-highlight" : "drilldown-item";
              return `
                <li class="${cls}">
                  <span class="drilldown-stamp">${escapeHtml(row.stamp)}</span>
                  <span class="drilldown-label">${row.label}</span>
                  ${row.body ? `<p class="drilldown-body">${row.body}</p>` : ""}
                  ${row.sub ? `<p class="drilldown-sub muted">${row.sub}</p>` : ""}
                </li>
              `;
            })
            .join("")}
        </ol>
      </section>
    `;
    container.innerHTML = `
      <div class="drilldown-header">
        <h4>${escapeHtml(displayName)} ${ko ? "활동 타임라인" : "activity timeline"}</h4>
        <span class="muted drilldown-count">${events.length} ${ko ? "건" : "events"}</span>
        <button type="button" class="toolbar-button" data-drilldown-close>${ko ? "닫기" : "Close"}</button>
      </div>
      ${reflectionMarkup}
      ${timelineMarkup}
    `;
  } catch (error) {
    console.error("drilldown load failed", error);
    container.innerHTML = `
      <div class="drilldown-header">
        <h4>${escapeHtml(displayName)} ${ko ? "활동 타임라인" : "activity timeline"}</h4>
        <button type="button" class="toolbar-button" data-drilldown-close>${ko ? "닫기" : "Close"}</button>
      </div>
      <p class="muted">${ko ? "불러오기 실패" : "Failed to load timeline."}</p>
    `;
  }
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

function tokenizeForMatch(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 3);
}

function hasMeaningfulOverlap(left, right) {
  const leftTokens = tokenizeForMatch(left);
  const rightTokens = new Set(tokenizeForMatch(right));
  return leftTokens.some((token) => rightTokens.has(token));
}

function getComparableNodeForActivity(node) {
  if (!node) return null;
  if (node.type !== "satellite") return node;
  const frame = buildRenderableGraph();
  return frame.nodes.find((entry) => entry.id === node.parent) || node;
}

function nodeMatchesActivity(node, item) {
  const comparableNode = getComparableNodeForActivity(node);
  if (!comparableNode || !item) return false;
  const itemTitle = String(item.title || item.targetLabel || "").trim();
  const itemBody = String(item.body || "").trim();
  const itemText = `${itemTitle} ${itemBody}`.trim();

  if (comparableNode.type === "stakeholder") {
    return (item.stakeholder || "student") === comparableNode.id;
  }

  if (itemTitle && comparableNode.label && itemTitle.toLowerCase() === comparableNode.label.toLowerCase()) {
    return true;
  }

  return (
    ((item.stakeholder || "") === comparableNode.stakeholder && comparableNode.type !== "core") ||
    hasMeaningfulOverlap(itemText, `${comparableNode.label || ""} ${comparableNode.detail || ""}`)
  );
}

function renderRelatedActivityList(items, emptyMessage) {
  return items.length
    ? items
        .map(
          (item) => `
            <article class="evidence-item">
              <strong>${item.title}</strong>
              <p>${item.body}</p>
            </article>
          `
        )
        .join("")
    : emptyNoteMarkup(emptyMessage);
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
        ? t("case")
        : t("published")
      : course
        ? t("course")
        : t("workspace");
  }
  dom.topTitle.textContent = activeCase
    ? activeCase.title
    : course
      ? `${course.code} · ${course.name}`
      : t("workspace");
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
  dom.caseControlLabel.textContent = state.activeRole === "admin" ? t("instructor") + " " + t("case").toLowerCase() : t("published") + " " + t("case").toLowerCase();
  dom.caseSelect.innerHTML = selectableCases.length
    ? selectableCases
        .map(
          (item) =>
            `<option value="${item.id}">${item.title}${
              state.activeRole === "admin" ? ` (${item.published ? "Published" : "Draft"})` : ""
            }</option>`
        )
        .join("")
    : `<option value="">${state.activeRole === "admin" ? t("createFirstCase") : t("noPublishedCasesYet")}</option>`;
  dom.caseSelect.value = state.activeCaseId || selectableCases[0]?.id || "";
  dom.caseSelect.disabled = selectableCases.length === 0;
  dom.caseControl.classList.toggle("is-hidden", !course);
  dom.sidebarCaseLabel.textContent = state.activeRole === "admin" ? t("instructor") + " " + t("case").toLowerCase() : t("published") + " " + t("case").toLowerCase();
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

  dom.intakeTitle.textContent = state.activeRole === "admin" ? t("createOrChooseCase") : t("choosePublishedCase");
  dom.intakeBadge.textContent = state.activeRole === "admin" ? t("instructor") : t("student");
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

  dom.caseControlLabel.textContent = state.activeRole === "admin" ? `${t("instructor")} ${t("case").toLowerCase()}` : t("publishedCase");
  dom.caseSelect.innerHTML = selectableCases.length
    ? selectableCases
        .map(
          (item) =>
            `<option value="${item.id}">${item.title}${
              state.activeRole === "admin" ? ` (${item.published ? t("published") : t("draft")})` : ""
            }</option>`
        )
        .join("")
    : `<option value="">${state.activeRole === "admin" ? t("createFirstCase") : t("noPublishedCasesYet")}</option>`;
  dom.caseSelect.value = state.activeCaseId || selectableCases[0]?.id || "";
  dom.caseSelect.disabled = selectableCases.length === 0;
  dom.caseControl.classList.toggle("is-hidden", !course);

  dom.sidebarCaseLabel.textContent = state.activeRole === "admin" ? `${t("instructor")} ${t("case").toLowerCase()}` : t("publishedCase");
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
    state.activeRole === "admin" ? activeInstructor?.name || t("instructor") : activeLearner?.name || t("student");

  dom.intakeTitle.textContent = state.activeRole === "admin" ? t("createOrChooseCase") : t("choosePublishedCase");
  dom.intakeBadge.textContent = state.activeRole === "admin" ? t("instructor") : t("student");
  dom.workflowGuide.innerHTML = buildWorkflowGuideMarkup(course, activeCase, visibleCases, activeLearner);

  dom.platformContext.innerHTML = `
    <article class="context-card">
      <strong>${course ? `${course.code} · ${course.name}` : institution?.name || t("noCourseSelected")}</strong>
      <p>${institution?.name || t("noInstitutionSelected")}</p>
      ${
        state.activeRole === "admin" && activeInstructor
          ? `<div class="card-meta"><span>${activeInstructor.name}</span><span>${t("caseCount", { count: course?.cases?.length || 0 })}</span><span>${t("publishedCount", { count: visibleCases.length })}</span><span>${t("courseCode")} ${course?.joinCode || t("notSet")}</span></div>
             <p class="context-note">${t("createBaseBoardNote")}</p>`
          : ""
      }
      ${
        state.activeRole === "user" && activeLearner
          ? `<div class="card-meta"><span>${activeLearner.name}</span><span>${t("publishedCasesCount", { count: visibleCases.length })}</span></div>
             <p class="context-note">${t("choosePublishedBoardNote")}</p>`
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
            label: t("wfChooseCourse"),
            body: t("wfConfirmCourse"),
            state: course ? "done" : "current",
          },
          {
            label: activeCase ? t("wfReviewUpdateCase") : t("wfCreateCase"),
            body: activeCase
              ? t("wfUseCaseSelector")
              : t("wfPasteBrief"),
            state: activeCase ? "done" : course ? "current" : "upcoming",
          },
          {
            label: activeCase?.published ? t("wfPublishedToStudents") : t("wfPublishWhenReady"),
            body: activeCase?.published
              ? t("wfStudentsCanOpen")
              : t("wfKeepDraftPrivate"),
            state: activeCase?.published ? "done" : activeCase ? "current" : "upcoming",
          },
        ]
      : [
          {
            label: t("wfChooseCourse"),
            body: t("wfStartInCourse"),
            state: course ? "done" : "current",
          },
          {
            label: activeCase ? t("wfOpenPublishedCase") : t("wfSelectPublishedCase"),
            body: activeCase
              ? t("wfSelectedCaseLoaded")
              : visibleCases.length
                ? t("wfUseSelectorPublished")
                : t("wfWaitInstructorPublish"),
            state: activeCase ? "done" : course ? "current" : "upcoming",
          },
          {
            label: activeLearner ? t("wfAskQuestionsReflect") : t("wfStartLearnerRun"),
            body: activeCase
              ? t("wfUseNetworkReflect")
              : t("wfCaseUnlocksPage"),
            state: activeCase ? "current" : "upcoming",
          },
        ];

  return `
    <article class="workflow-card">
      <p class="eyebrow">${t("workflowQuickStart")}</p>
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
    return `<div class="empty-note">${t("noCasePick")}</div>`;
  }

  return `
    <article class="pipeline-card pipeline-card-highlight">
      <strong>${activeCase.title}</strong>
      <p>${activeCase.summary}</p>
      <div class="pipeline-chip-row">
        <span class="pipeline-chip">${activeCase.published ? t("published") : t("draft")}</span>
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
              <strong>${t("courseSetup")}</strong>
              <div class="pipeline-form-row two-up">
                <form class="pipeline-form" id="add-institution-form">
                  <input name="institutionName" type="text" placeholder="${t("institutionNamePlaceholder")}" required>
                  <button class="toolbar-button" type="submit">${t("addInstitution")}</button>
                </form>
                <form class="pipeline-form" id="add-course-form">
                  <input name="courseName" type="text" placeholder="${t("courseNamePlaceholder")}" required>
                  <input name="courseCode" type="text" placeholder="${t("courseCode")}" required>
                  <button class="toolbar-button" type="submit">${t("addCourse")}</button>
                </form>
              </div>
            </article>
          `
          : ""
      }
      <article class="pipeline-card">
        <strong>${t("newCase")}</strong>
        ${
          course
            ? `
              <form class="pipeline-form" id="upload-document-form">
                <label class="mini-control">
                  <span>${t("caseTitleLabel")}</span>
                  <input name="documentTitle" type="text" placeholder="${t("titlePlaceholder")}" autocomplete="off" required>
                </label>
                <label class="mini-control">
                  <span>${t("caseBriefLabel")}</span>
                  <textarea name="documentText" placeholder="${t("pasteBriefPlaceholder")}" autocomplete="off" required></textarea>
                </label>
                <label class="mini-control">
                  <span>${t("caseVisibilityLabel")}</span>
                  <select name="publishMode">
                    <option value="draft" selected>${t("keepAsDraft")}</option>
                    <option value="published">${t("publishToLearners")}</option>
                  </select>
                </label>
                <div class="pipeline-actions">
                  <button class="toolbar-button toolbar-button-primary" type="submit">${t("createCaseBtn")}</button>
                </div>
              </form>
            `
            : `<div class="empty-note">${canManageCourses ? t("createCourseFirst") : t("noCourseAssigned")}</div>`
        }
      </article>
      ${
        activeCase
          ? `
            <article class="pipeline-card">
              <strong>${t("boardSettings")}</strong>
              <p></p>
              <form class="pipeline-form" id="board-settings-form">
                <textarea name="agendaPrompt" placeholder="${t("mainQuestionPlaceholder")}" autocomplete="off">${getCaseBoardSettings(activeCase).agendaPrompt || ""}</textarea>
                <div class="pipeline-form-row two-up">
                  <label class="mini-control">
                    <span>${t("dueDate")}</span>
                    <input name="dueAt" type="date" value="${getCaseBoardSettings(activeCase).dueAt || ""}">
                  </label>
                  <label class="mini-control">
                    <span>${t("sharingMode")}</span>
                    <select name="sharingMode">
                      <option value="private" ${getCaseBoardSettings(activeCase).sharingMode === "private" ? "selected" : ""}>${t("privateOnly")}</option>
                      <option value="cohort" ${getCaseBoardSettings(activeCase).sharingMode === "cohort" ? "selected" : ""}>${t("classView")}</option>
                    </select>
                  </label>
                </div>
                <div class="pipeline-form-row two-up">
                  <label class="mini-control">
                    <span>${t("nodeLimitPerStudent")}</span>
                    <input name="maxLearnerNodes" type="number" min="1" max="20" value="${getCaseBoardSettings(activeCase).maxLearnerNodes}">
                  </label>
                  <label class="mini-control">
                    <span>${t("aiAdditionsPerNode")}</span>
                    <input name="maxAiExpansionsPerNode" type="number" min="1" max="8" value="${getCaseBoardSettings(activeCase).maxAiExpansionsPerNode}">
                  </label>
                </div>
                <div class="pipeline-form-row two-up">
                  <label class="mini-control">
                    <span>${t("layout")}</span>
                    <select name="layoutMode">
                      <option value="force" ${getCaseBoardSettings(activeCase).layoutMode === "force" ? "selected" : ""}>${t("force")}</option>
                      <option value="cluster" ${getCaseBoardSettings(activeCase).layoutMode === "cluster" ? "selected" : ""}>${t("cluster")}</option>
                      <option value="radial" ${getCaseBoardSettings(activeCase).layoutMode === "radial" ? "selected" : ""}>${t("radial")}</option>
                    </select>
                  </label>
                </div>
                <div class="pipeline-actions">
                  <button class="toolbar-button toolbar-button-primary" type="submit">${t("saveSettings")}</button>
                </div>
              </form>
            </article>
          `
          : ""
      }
      <article class="pipeline-card">
        <strong>${t("courseCases")}</strong>
        <p>${t("courseCasesHelp")}</p>
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
                        <span>${item.published ? t("published") : t("draft")}</span>
                      </div>
                      <div class="card-actions">
                        <button class="toolbar-button" type="button" data-select-case="${item.id}">${t("openCase")}</button>
                        <button class="toolbar-button" type="button" data-toggle-publish="${item.id}">
                          ${item.published ? t("unpublishVerb") : t("publishVerb")}
                        </button>
                      </div>
                    </article>
                  `
                  )
                  .join("")
              : `<div class="empty-note">${t("noCasesYet")}</div>`
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
      <strong>${t("yourCopy")}</strong>
      <p></p>
      ${
        activeLearner
          ? `
            <div class="card-meta">
              <span>${activeLearner.name}</span>
              <span>${activeLearner.focus}</span>
              <span>${activeRun?.status || t("readyToStart")}</span>
            </div>
          `
          : ""
      }
    </article>
    <article class="pipeline-card">
      <strong>${t("availableCases")}</strong>
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
                        )[0]?.status || t("ready")
                      }</span>
                    </div>
                    <div class="card-actions">
                      <button class="toolbar-button" type="button" data-select-case="${item.id}">${t("openCase")}</button>
                    </div>
                  </article>
                `
                )
                .join("")
            : `<div class="empty-note">${t("noCasePick")}</div>`
        }
      </div>
    </article>
    <article class="pipeline-card">
      <strong>${t("addNode")}</strong>
      <p></p>
      <form class="pipeline-form" id="agenda-node-form">
        <input name="agendaTitle" type="text" placeholder="${t("titlePlaceholder")}" autocomplete="off" required>
        <textarea name="agendaBody" placeholder="${t("agendaBodyPlaceholder")}" autocomplete="off"></textarea>
        <div class="pipeline-actions">
          <button class="toolbar-button toolbar-button-primary" type="submit">${t("addToMap")}</button>
        </div>
      </form>
      <p class="context-note">${getCaseBoardSettings(activeCase).agendaPrompt || t("addNodeDefaultPrompt")}</p>
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
                      <span>${item.createdAt || (state.locale === "ko" ? "지금" : "Now")}</span>
                    </div>
                  </article>
                `
                )
                .join("")
            : `<div class="empty-note">${t("noNodes")}</div>`
        }
      </div>
    </article>
    <article class="pipeline-card">
      <strong>${t("aiAdditionsTitle")}</strong>
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
                      <span>${t("aiSuggested")}</span>
                    </div>
                  </article>
                `
                )
                .join("")
            : `<div class="empty-note">${t("noAdditions")}</div>`
        }
      </div>
    </article>
    <article class="pipeline-card">
      <strong>${t("classViewTitle")}</strong>
      <p>${
        getCaseBoardSettings(activeCase).sharingMode === "private"
          ? t("off")
          : t("sharedPatterns")
      }</p>
      <div class="card-meta">
        <span>${t("sharedClustersCount", { count: buildCohortIssueEntries(activeCase).length })}</span>
        <span>${t("studentRunsCount", { count: getVisibleLearnerRunsForCase(activeCase, course).length })}</span>
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
          ? t("statusCasePublished")
          : t("statusCaseDraft")
        : t("statusCreateChoose")
      : activeCase
        ? t("statusLearnerExploring", { name: activeLearner?.name || t("student") })
        : t("statusChoosePublished");
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
    const parentNode = (state.graph?.nodes || []).find((n) => n.id === node.parent);
    const parentLabel = parentNode?.label || node.parent || "";
    const ko = state.locale === "ko";
    // Per-stakeholder concern pools: each satellite picks a distinct phrase so
    // siblings orbiting the same parent don't read identical.
    const concernPool = {
      teacher: {
        en: [
          { t: "Grading turnaround pressure", b: "A section of the class is piling up work to grade, and current tools don't help triage the exceptions." },
          { t: "Pacing drift across sections", b: "Different sections are drifting off the original lesson cadence; re-alignment is starting to feel manual." },
          { t: "Differentiation for edge learners", b: "A few students need alternative pathways but the default flow doesn't bend far enough to accommodate them." },
          { t: "Feedback that actually moves work", b: "Comments are getting acknowledged but not acted on — the revision loop isn't closing." },
          { t: "Lesson prep overhead", b: "Planning time is being eaten by small logistics decisions that could be templated or delegated." },
          { t: "Formative check reliability", b: "Quick checks are firing but the signal is noisy — hard to tell if the misconception is real or a guess." },
          { t: "Parent / guardian loop", b: "External check-ins are landing inconsistently; some families get detail, others get silence." },
        ],
        ko: [
          { t: "채점 회전 부담", b: "일부 분반에서 예외 상황이 쌓이고 있는데, 지금 도구로는 우선순위를 가리기가 쉽지 않습니다." },
          { t: "분반 간 진도 어긋남", b: "분반마다 원래 잡아둔 수업 리듬에서 어긋나고 있어, 맞추는 작업이 점점 수작업이 되고 있습니다." },
          { t: "경계 학습자 차별화", b: "몇몇 학생은 다른 경로가 필요한데, 현재 기본 흐름은 그만큼 유연하게 구부러지지 않습니다." },
          { t: "실제로 수정에 반영되는 피드백", b: "피드백은 확인되지만 수정으로 이어지지 않아, 리뷰-수정 루프가 닫히지 않고 있습니다." },
          { t: "수업 준비 오버헤드", b: "작은 운영 결정들이 준비 시간을 잠식하고 있어 — 템플릿화하거나 위임할 여지가 있습니다." },
          { t: "형성 평가 신호 품질", b: "짧은 점검이 돌고는 있지만 신호가 잡음이 많아, 진짜 오개념인지 찍은 건지 구분이 어렵습니다." },
          { t: "학부모·보호자 연락 루프", b: "외부 소통이 불균일합니다 — 어떤 가정은 상세 안내를, 어떤 가정은 공백을 받고 있습니다." },
        ],
      },
      student: {
        en: [
          { t: "Why-this-matters gap", b: "The point of the assignment isn't landing; students engage procedurally but disengage from the meaning." },
          { t: "Time-on-task anxiety", b: "Learners are unsure how much time is 'enough' — they either overwork or quietly skip." },
          { t: "Feedback legibility", b: "Comments arrive but students can't always tell what to DO with them next." },
          { t: "Group dynamics friction", b: "Peer collaboration is uneven; load concentrates on a few while others coast." },
          { t: "Self-assessment honesty", b: "Students want to self-assess truthfully but worry honesty will cost them points." },
          { t: "Accessibility mismatch", b: "Default format clashes with how this learner takes in content — captioning, pace, modality." },
        ],
        ko: [
          { t: "왜 중요한지 닿지 않음", b: "과제의 의도가 전달되지 않아, 학생은 절차는 따라가지만 의미에서는 멀어집니다." },
          { t: "투입 시간 불안", b: "얼마나 해야 '충분한지' 알기 어려워, 과하게 붙잡거나 조용히 건너뜁니다." },
          { t: "피드백 해석 가능성", b: "피드백은 도착하지만, 다음에 무엇을 해야 하는지는 학생이 알아차리기 어렵습니다." },
          { t: "모둠 활동 편중", b: "동료 협업 부담이 고르지 않아 — 몇몇에게 몰리고 나머지는 수동적입니다." },
          { t: "자기평가의 정직함", b: "솔직하게 자기평가를 하고 싶지만, 그것이 점수로 돌아올까 염려합니다." },
          { t: "접근성 불일치", b: "기본 포맷이 이 학습자의 방식(자막·속도·매체)과 맞지 않습니다." },
        ],
      },
      it: {
        en: [
          { t: "SSO and roster sync", b: "Identity handoff between systems is fragile; stale rosters create ghost accounts." },
          { t: "Data retention ambiguity", b: "Retention policy doesn't map cleanly onto this tool's default storage windows." },
          { t: "Third-party privacy review", b: "Vendor DPA terms still pending; deployment is blocked on legal sign-off." },
          { t: "Integration maintenance load", b: "Every new connector adds an on-call surface that IT absorbs silently." },
          { t: "Network-level accessibility", b: "Latency or firewall rules are quietly degrading the experience for off-campus learners." },
        ],
        ko: [
          { t: "SSO·명단 동기화", b: "시스템 간 신원 연동이 취약하고, 오래된 명단이 유령 계정을 만듭니다." },
          { t: "데이터 보존 모호함", b: "보존 정책이 이 도구의 기본 저장 기간과 깔끔하게 맞아떨어지지 않습니다." },
          { t: "외부 업체 개인정보 검토", b: "벤더 DPA 승인이 지연되어 배포가 법무 확인 단계에서 멈춰 있습니다." },
          { t: "통합 유지보수 부담", b: "새 커넥터마다 IT가 말없이 떠안는 온콜 표면이 늘어납니다." },
          { t: "네트워크 수준 접근성", b: "지연이나 방화벽 규칙이 교외 학습자의 경험을 조용히 떨어뜨립니다." },
        ],
      },
      administrator: {
        en: [
          { t: "Policy audit readiness", b: "When audit season lands, can we show the chain of decisions that produced this outcome?" },
          { t: "Equity reporting", b: "Outcome data needs to disaggregate cleanly across groups; current pipeline fights this." },
          { t: "Budget & license runway", b: "Seat licensing renews before pilot evaluation closes — renewal may precede evidence." },
          { t: "Cross-department alignment", b: "Adjacent programs are running parallel pilots without shared success criteria." },
        ],
        ko: [
          { t: "감사 대응 준비", b: "감사 시즌이 오면 이 결과에 이른 의사결정 흐름을 보여줄 수 있을까요?" },
          { t: "형평성 보고", b: "집단별로 성과 데이터를 깔끔하게 분해해야 하는데, 현재 파이프라인이 이를 방해합니다." },
          { t: "예산·라이선스 만료", b: "좌석 라이선스 갱신이 파일럿 평가 마감보다 먼저 와서, 증거 없이 갱신이 일어날 수 있습니다." },
          { t: "부서 간 정렬", b: "인접 프로그램들이 공통 성공 지표 없이 병행 파일럿을 돌리고 있습니다." },
        ],
      },
      accessibility: {
        en: [
          { t: "Caption parity", b: "Video captions are present but not checked for accuracy — synchrony and terminology drift." },
          { t: "Screen reader traversal", b: "Navigation order jumps around for assistive tech; keyboard-only users lose context." },
          { t: "Color and contrast", b: "Status indicators rely on color alone; learners with low vision miss them." },
          { t: "Time-bound tasks", b: "Rigid timers disadvantage learners with processing accommodations." },
        ],
        ko: [
          { t: "자막 동등성", b: "자막은 존재하지만 정확성 검토가 없어, 동기화와 용어가 조금씩 어긋납니다." },
          { t: "스크린리더 탐색 순서", b: "보조 기기에서 탐색 순서가 뛰어, 키보드만 쓰는 사용자는 맥락을 잃습니다." },
          { t: "색상·대비", b: "상태 표시가 색에만 의존하여, 저시력 학습자가 놓칩니다." },
          { t: "시간 제한 과제", b: "고정 타이머가 처리 속도 조정이 필요한 학습자에게 불리하게 작동합니다." },
        ],
      },
    };
    const fallbackPool = {
      en: [
        { t: "Secondary concern", b: "A follow-up issue surfacing from the main cluster. Worth a second look if similar ones keep appearing nearby." },
        { t: "Edge-case signal", b: "A smaller pattern branching off the main topic — often hints at where the design hasn't been tested yet." },
      ],
      ko: [
        { t: "보조 이슈", b: "주요 군집에서 파생된 후속 이슈입니다. 비슷한 노드가 계속 근처에 생긴다면 다시 들여다볼 가치가 있습니다." },
        { t: "경계 신호", b: "본 주제에서 갈라진 작은 패턴입니다 — 설계가 아직 검증되지 않은 구간을 시사하는 경우가 많습니다." },
      ],
    };
    const pool = concernPool[node.stakeholder] || fallbackPool;
    const entries = ko ? pool.ko : pool.en;
    const idx = ((node.orbitIndex || 0) + (parentNode?.id?.length || 0)) % entries.length;
    const pick = entries[idx];
    return {
      kicker: ko ? `파생 이슈 · ${parentLabel}` : `Branch of ${parentLabel}`,
      title: pick.t,
      body: pick.b,
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

function getNetworkExportFilename(extension) {
  const activeCase = getActiveCaseRecord();
  const activeLearner = getActiveLearner();
  const layerLabel = state.activeMapLayer === "cohort" ? "class-view" : state.activeMapLayer === "personal" ? "my-view" : "base-map";
  const caseLabel = slugify(activeCase?.title || "case-map");
  const learnerLabel = slugify(activeLearner?.name || "student");
  return `${caseLabel}-${learnerLabel}-${layerLabel}.${extension}`;
}

function getNetworkExportSvgStyles() {
  return `
    svg {
      background: #f5f7fb;
    }
    .network-link {
      stroke: rgba(198, 205, 219, 0.22);
      stroke-linecap: round;
    }
    .network-link[data-tone="danger"] { stroke: rgba(255, 113, 107, 0.58); }
    .network-link[data-tone="primary"] { stroke: rgba(151, 169, 255, 0.44); }
    .network-link[data-tone="ok"] { stroke: rgba(0, 239, 160, 0.48); }
    .network-link.is-active { opacity: 0.94; stroke-width: 2.4px; }
    .network-link.is-faded { opacity: 0.15; }
    .network-node text {
      font-family: Inter, Arial, sans-serif;
      pointer-events: none;
    }
    .network-node .node-shell {
      fill: rgba(255, 255, 255, 0.94);
      stroke: rgba(170, 171, 176, 0.5);
      stroke-width: 1.3px;
    }
    .network-node .node-body {
      fill: rgba(20, 24, 30, 0.9);
      stroke: rgba(255, 255, 255, 0.12);
      stroke-width: 1.5px;
    }
    .network-node .node-halo {
      fill: none;
      stroke: rgba(255, 221, 87, 0.86);
      stroke-width: 2.3px;
      opacity: 0;
    }
    .network-node .node-icon {
      font-size: 14px;
      fill: #f6f6fc;
      text-anchor: middle;
      dominant-baseline: central;
    }
    .network-node .node-label {
      fill: rgba(246, 246, 252, 0.92);
      font-size: 11px;
      font-weight: 700;
      text-anchor: middle;
    }
    .network-node .node-meta {
      fill: rgba(170, 171, 176, 0.94);
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      text-anchor: middle;
    }
    .network-node[data-tone="primary"] .node-body { stroke: rgba(151, 169, 255, 0.75); }
    .network-node[data-tone="danger"] .node-body { stroke: rgba(255, 113, 107, 0.76); }
    .network-node[data-tone="ok"] .node-body { stroke: rgba(0, 239, 160, 0.7); }
    .network-node[data-type="core"] .node-body {
      fill: rgba(18, 24, 40, 0.96);
      stroke: rgba(151, 169, 255, 0.95);
      stroke-width: 2.2px;
      filter: drop-shadow(0 0 18px rgba(62, 101, 255, 0.34));
    }
    .network-node[data-type="signal"] .node-body { fill: rgba(16, 20, 28, 0.9); }
    .network-node.is-active .node-halo,
    .network-node.is-hotspot .node-halo,
    .network-node.is-selected .node-halo {
      opacity: 1;
    }
    .network-node.is-selected .node-body,
    .network-node.is-selected .node-shell {
      stroke: #ffbf47 !important;
      stroke-width: 2.8px;
    }
    .network-node.is-faded .node-body,
    .network-node.is-faded .node-shell,
    .network-node.is-faded text {
      opacity: 0.24;
    }
  `;
}

function buildExportableSvgMarkup() {
  if (!hasActiveCase()) {
    throw new Error("Open a case before downloading.");
  }
  if (!dom.networkSvg || !dom.networkSvg.childNodes.length) {
    throw new Error("The network is not ready yet.");
  }

  const exportWidth = graphRenderer.width || 1200;
  const exportHeight = graphRenderer.height || 760;
  const svgClone = dom.networkSvg.cloneNode(true);
  svgClone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svgClone.setAttribute("width", String(exportWidth));
  svgClone.setAttribute("height", String(exportHeight));
  svgClone.setAttribute("viewBox", svgClone.getAttribute("viewBox") || `0 0 ${exportWidth} ${exportHeight}`);

  const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
  style.textContent = getNetworkExportSvgStyles();
  svgClone.insertBefore(style, svgClone.firstChild);

  const background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  background.setAttribute("x", "0");
  background.setAttribute("y", "0");
  background.setAttribute("width", String(exportWidth));
  background.setAttribute("height", String(exportHeight));
  background.setAttribute("fill", "#f5f7fb");
  svgClone.insertBefore(background, style.nextSibling);

  return new XMLSerializer().serializeToString(svgClone);
}

function downloadBlob(filename, blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function downloadNetworkPngSnapshot() {
  const svgMarkup = buildExportableSvgMarkup();
  const svgBlob = new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8" });
  const svgUrl = URL.createObjectURL(svgBlob);

  try {
    const image = await new Promise((resolve, reject) => {
      const nextImage = new Image();
      nextImage.onload = () => resolve(nextImage);
      nextImage.onerror = () => reject(new Error("The network image could not be prepared."));
      nextImage.src = svgUrl;
    });

    const exportWidth = graphRenderer.width || 1200;
    const exportHeight = graphRenderer.height || 760;
    const canvas = document.createElement("canvas");
    canvas.width = exportWidth * 2;
    canvas.height = exportHeight * 2;
    const context = canvas.getContext("2d");
    context.scale(2, 2);
    context.fillStyle = "#f5f7fb";
    context.fillRect(0, 0, exportWidth, exportHeight);
    context.drawImage(image, 0, 0, exportWidth, exportHeight);

    const pngBlob = await new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("The PNG file could not be created."));
        }
      }, "image/png");
    });

    downloadBlob(getNetworkExportFilename("png"), pngBlob);
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}

function downloadNetworkHtmlSnapshot() {
  const activeCase = getActiveCaseRecord();
  const activeInstitution = getActiveInstitution();
  const activeCourse = getActiveCourse();
  const activeLearner = getActiveLearner();
  const svgMarkup = buildExportableSvgMarkup();
  const caseTitle = escapeHtml(activeCase?.title || "Case map snapshot");
  const institutionName = escapeHtml(activeInstitution?.name || "Institution");
  const courseName = escapeHtml(`${activeCourse?.code || "Course"} ${activeCourse?.name || ""}`.trim());
  const learnerName = escapeHtml(activeLearner?.name || "Student");
  const layerLabel = escapeHtml(state.activeMapLayer === "cohort" ? "Class view" : state.activeMapLayer === "personal" ? "My view" : "Base map");
  const lensLabel = escapeHtml(`${getCaseStakeholderMeta(state.activeStakeholder).label} lens`);
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${caseTitle}</title>
    <style>
      :root {
        color-scheme: light;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: Inter, Arial, sans-serif;
        background:
          linear-gradient(rgba(151, 169, 255, 0.06) 1px, transparent 1px),
          linear-gradient(90deg, rgba(151, 169, 255, 0.06) 1px, transparent 1px),
          #f5f7fb;
        background-size: 36px 36px;
        color: #1d2433;
      }
      .snapshot-shell {
        max-width: 1440px;
        margin: 0 auto;
        padding: 32px;
      }
      .snapshot-header {
        display: grid;
        gap: 10px;
        margin-bottom: 20px;
      }
      .eyebrow {
        margin: 0;
        text-transform: uppercase;
        letter-spacing: 0.18em;
        font-size: 11px;
        color: #6a7387;
      }
      h1 {
        margin: 0;
        font-family: "Space Grotesk", Inter, Arial, sans-serif;
        font-size: 38px;
        line-height: 1.05;
        color: #1d2433;
      }
      .snapshot-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }
      .snapshot-chip {
        display: inline-flex;
        align-items: center;
        min-height: 36px;
        padding: 0 14px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.82);
        border: 1px solid rgba(151, 169, 255, 0.24);
        color: #41506e;
        font-size: 13px;
      }
      .snapshot-stage {
        border-radius: 28px;
        border: 1px solid rgba(151, 169, 255, 0.18);
        background: rgba(255, 255, 255, 0.82);
        box-shadow: 0 24px 60px rgba(93, 109, 155, 0.12);
        overflow: hidden;
      }
      .snapshot-stage svg {
        display: block;
        width: 100%;
        height: auto;
      }
      .snapshot-note {
        margin-top: 18px;
        color: #5c677f;
        font-size: 14px;
        line-height: 1.6;
      }
    </style>
  </head>
  <body>
    <main class="snapshot-shell">
      <header class="snapshot-header">
        <p class="eyebrow">Design Tension Studio · HTML snapshot</p>
        <h1>${caseTitle}</h1>
        <div class="snapshot-meta">
          <span class="snapshot-chip">${institutionName}</span>
          <span class="snapshot-chip">${courseName}</span>
          <span class="snapshot-chip">${learnerName}</span>
          <span class="snapshot-chip">${layerLabel}</span>
          <span class="snapshot-chip">${lensLabel}</span>
        </div>
      </header>
      <section class="snapshot-stage">
        ${svgMarkup}
      </section>
      <p class="snapshot-note">This file is a standalone snapshot of the current network view. Open it in any browser to revisit the map, inspect labels, and share a stable version of your design discussion.</p>
    </main>
  </body>
</html>`;

  downloadBlob(getNetworkExportFilename("html"), new Blob([html], { type: "text/html;charset=utf-8" }));
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
      ? state.locale === "ko"
        ? "이 보기는 클래스 전체에서 반복된 패턴을 묶어 보여줍니다."
        : "This view combines patterns shared across the class."
      : state.activeMapLayer === "personal"
        ? state.locale === "ko"
          ? "노드에 호버해 이슈를 보고 클릭해 메모를 추가하세요."
          : "Hover to inspect an issue and click to add your notes."
        : state.locale === "ko"
          ? "노드에 호버해 그 뒤의 이슈를 살펴보세요."
          : "Hover a node to inspect the issue behind it."
    : state.locale === "ko"
      ? "케이스를 만들거나 선택하면 네트워크가 생성됩니다."
      : "Create or choose a case to generate the network.";
  dom.stageNoteBody.textContent = activeCase
    ? state.activeMapLayer === "cohort"
      ? state.locale === "ko"
        ? "클래스 보기는 모든 개인 메모를 그대로 보여주지 않고 반복된 학생 우려를 공유 클러스터로 묶습니다."
        : "Class view groups repeated student concerns into shared clusters instead of showing every personal note."
      : state.activeMapLayer === "personal"
        ? state.locale === "ko"
          ? "노드를 클릭해 선택한 뒤 오른쪽 렌즈 패널에 메모를 추가하세요. 새 질문이나 메모 뒤에는 맵이 갱신됩니다."
          : "Click a node to select it, then add a note in the right lens panel. The map updates after new questions or notes."
        : state.locale === "ko"
          ? "이해관계자 노드를 클릭하면 관점이 바뀝니다. 케이스가 바뀌거나 새 질문이 들어오면 네트워크도 함께 갱신됩니다."
          : "Click a stakeholder node to change perspective. The network updates when the case changes or a new question is asked."
    : state.locale === "ko"
      ? "케이스가 준비되면 이 맵에 이해관계자, 긴장, 근거 연결이 나타납니다."
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
          title: state.locale === "ko" ? "시작 전에" : "Before You Start",
          body:
            state.activeRole === "admin"
              ? (state.locale === "ko" ? "수업 설명요약에서 케이스를 만들면 이곳에 네트워크가 나타납니다." : "Create a case from a course brief, then the network will appear here.")
              : (state.locale === "ko" ? "코스에서 게시된 케이스 하나를 선택하면 네트워크가 로드됩니다." : "Choose one published case from your course to load the network."),
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

function renderExportActions() {
  if (!dom.studentExportActions || !dom.downloadPngButton || !dom.downloadHtmlButton) {
    return;
  }

  const canExport = state.activeRole === "user" && hasActiveCase();
  dom.studentExportActions.hidden = state.activeRole !== "user";
  dom.downloadPngButton.disabled = !canExport;
  dom.downloadHtmlButton.disabled = !canExport;
  dom.downloadPngButton.title = canExport ? "Download the current network as a PNG." : "Open a case to export.";
  dom.downloadHtmlButton.title = canExport ? "Download a standalone HTML snapshot of the current network." : "Open a case to export.";
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
    dom.activeStakeholderPill.textContent = t("noCasePick");
    dom.activeStakeholderStatus.textContent = t("pickCase");
    dom.lensName.textContent = t("selectedLens");
    dom.lensSummary.textContent =
      state.activeRole === "admin"
        ? t("startWithCase")
        : t("pickCase");
    dom.lensStatus.textContent = state.activeRole === "admin" ? t("start") : t("pickCase");
    dom.lensScore.textContent = "--";
    dom.orbitTitle.textContent = t("casePreview");
    dom.orbitIcon.textContent = "hub";
    dom.orbitSummary.textContent = t("panelUpdatesWhenCaseOpen");
    dom.chatBadge.textContent = t("noCasePick");
    dom.topTensions.innerHTML = `
      <article class="tension-item">
        <strong>${t("startHere")}</strong>
        <p>${state.activeRole === "admin" ? t("wfCreateCase") : t("pickCase")}</p>
      </article>
    `;
    dom.evidenceStrip.innerHTML = `
      <article class="evidence-item">
        <strong>${t("noEvidence")}</strong>
        <p>${t("openCaseShort")}</p>
      </article>
    `;
    dom.stakeholderPills.innerHTML = "";
    if (dom.perspectiveStakeholderPills) {
      dom.perspectiveStakeholderPills.innerHTML = "";
    }
    dom.selectedNodeKicker.textContent = t("hoverOrClick");
    dom.selectedNodeTitle.textContent = t("noNodeSelected");
    dom.selectedNodeCopy.textContent = t("hoverNodeHelp");
    if (dom.relatedPersonalActivity) {
      dom.relatedPersonalActivity.innerHTML = emptyNoteMarkup(t("selectNode"));
    }
    if (dom.relatedClassActivity) {
      dom.relatedClassActivity.innerHTML = emptyNoteMarkup(t("selectNode"));
    }
    if (dom.quickAnnotationForm) {
      dom.quickAnnotationForm.hidden = true;
    }
    if (dom.quickAnnotationSubmit) {
      dom.quickAnnotationSubmit.disabled = true;
    }
    dom.perspectiveConflicts.innerHTML = `
      <article class="conflict-card">
        <strong>${t("noLens")}</strong>
        <p>${t("openCaseShort")}</p>
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
  const comparableNode = getComparableNodeForActivity(selectedNode);
  const activeRun = state.activeRole === "user" ? getActiveLearnerRun() : null;
  const personalItems = comparableNode
    ? [
        ...asArray(activeRun?.agendaNodes).map((item) => ({
          title: item.title || "Question",
          body: item.body || "Added to your map.",
          stakeholder: item.stakeholder || "student",
        })),
        ...asArray(activeRun?.aiGeneratedNodes).map((item) => ({
          title: item.title || "AI addition",
          body: item.body || "AI generated issue.",
          stakeholder: item.stakeholder || "student",
        })),
        ...asArray(activeRun?.annotations).map((item) => ({
          title: item.targetLabel ? `${item.targetLabel} note` : "Note",
          body: item.body || "Added note.",
          stakeholder: item.stakeholder || "student",
          targetLabel: item.targetLabel || "",
        })),
      ]
        .filter((item) => nodeMatchesActivity(comparableNode, item))
        .slice(0, 4)
    : [];
  const classItems = comparableNode
    ? buildCohortIssueEntries(activeCase)
        .filter((item) => nodeMatchesActivity(comparableNode, item))
        .slice(0, 4)
    : [];

  dom.activeStakeholderPill.textContent = state.locale === "ko" ? `${stakeholder.label} 관점` : `${stakeholder.label} focus`;
  dom.activeStakeholderStatus.textContent = state.locale === "ko" ? `${stakeholder.status} · 사이클 ${state.graph.iteration}` : `${stakeholder.status} · cycle ${state.graph.iteration}`;
  dom.lensName.textContent = stakeholder.label;
  dom.lensSummary.textContent = stakeholder.summary;
  dom.lensStatus.textContent = stakeholder.status;
  dom.lensScore.textContent = String(riskScore);
  dom.orbitTitle.textContent = `${stakeholder.label} orbit`;
  dom.orbitIcon.textContent = stakeholder.icon;
  dom.orbitSummary.textContent = stakeholder.summary;
  dom.chatBadge.textContent = state.locale === "ko" ? `${stakeholder.label} 보기` : `${stakeholder.label} view`;
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

  dom.selectedNodeKicker.textContent = selectedNodeIssue?.kicker || t("hoverOrClick");
  dom.selectedNodeTitle.textContent = selectedNodeIssue?.title || t("noNodeSelected");
  dom.selectedNodeCopy.textContent =
    selectedNodeIssue?.body || t("hoverNodeHelp");
  if (dom.relatedPersonalActivity) {
    dom.relatedPersonalActivity.innerHTML = renderRelatedActivityList(
      personalItems,
      state.activeRole === "user" ? t("noRelatedQuestionsYet") : t("openLearnerRun")
    );
  }
  if (dom.relatedClassActivity) {
    dom.relatedClassActivity.innerHTML = renderRelatedActivityList(classItems, t("noSharedPatternsYet"));
  }
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
              <small>${entry.role === "agent" ? getCaseStakeholderMeta(entry.stakeholder).label : t("youLabel")}</small>
            </article>
          `
        )
        .join("")
    : `
      <article class="chat-message agent">
        <div>${getCaseUiCopy().emptyChatMessage || t("noDialogueYet")}</div>
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
  dom.matrixState.textContent = conflict > 70 ? t("matrixNeedsAttention") : alignment > 75 ? t("matrixBalanced") : t("matrixWatchClosely");

  const bars = [
    { label: t("personalization"), value: personalization, color: "var(--primary)" },
    { label: state.locale === "ko" ? "프라이버시" : "Privacy", value: privacy, color: "var(--tertiary-dim)" },
    { label: t("stakeholderAccessibility"), value: accessibility, color: "var(--primary)" },
    { label: t("feasibility"), value: feasibility, color: "var(--tertiary-dim)" },
    { label: t("teacherSlack"), value: 100 - teacherLoad, color: "var(--secondary)" },
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
    : emptyNoteMarkup(t("noInsights"));

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
    : emptyNoteMarkup(t("noHistory"));
}

function renderSandbox() {
  const activeCase = getActiveCaseRecord();
  const { alignment, conflict } = computeScores();
  const loadBand = state.metrics.teacherLoad > 70 ? t("veryHigh") : state.metrics.teacherLoad > 55 ? t("high") : t("moderate");
  const lag = Math.round(8 + conflict * 0.12);
  const instructorMode = state.activeRole === "admin";

  dom.cohesionScore.textContent = `${alignment}%`;
  dom.cognitiveLoad.textContent = loadBand;
  dom.inferenceLag.textContent = `${lag}ms`;
  dom.simulationState.textContent = instructorMode
    ? conflict > 72
      ? t("sandboxCriticalReview")
      : alignment > 75
        ? t("sandboxStable")
        : t("sandboxNeedsTuning")
    : t("instructorOnly");

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
    : emptyNoteMarkup(t("noNotes"));
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

  dom.reportSummary.textContent = summary || t("noSummary");

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
    : emptyNoteMarkup(t("noTensions"));

  dom.reportRecommendations.innerHTML = reportRecommendations.length
    ? reportRecommendations
        .map(
          (item) => `
            <article class="memo-item">
              <strong>${state.locale === "ko" ? "추천" : "Recommendation"}</strong>
              <p>${item.body}</p>
            </article>
          `
        )
        .join("")
    : emptyNoteMarkup(t("noRecommendations"));

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
    : emptyNoteMarkup(t("noEvidence"));

  const rubric = activeCase
    ? [
        {
          label:
            state.activeRole === "admin"
              ? state.locale === "ko"
                ? "렌즈 범위"
                : "Lens coverage"
              : state.locale === "ko"
                ? "관점 전환"
                : "Perspective shift",
          value: Math.min(96, 60 + state.evidence.length * 8),
        },
        {
          label: state.locale === "ko" ? "제약 명확성" : "Constraint clarity",
          value: Math.round((state.metrics.privacy + state.metrics.accessibility) / 2),
        },
        {
          label:
            state.activeRole === "admin"
              ? state.locale === "ko"
                ? "리디자인 품질"
                : "Redesign quality"
              : state.locale === "ko"
                ? "수정 품질"
                : "Revision quality",
          value: feasibility,
        },
        { label: t("evidenceTrace"), value: Math.min(94, 58 + state.evidence.length * 7) },
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
    : emptyNoteMarkup(t("noScores"));

  dom.reflectionBadge.textContent =
    state.activeRole === "admin"
      ? t("instructorView")
      : `${activeLearner?.name || t("student")} ${state.locale === "ko" ? "리플렉션" : "reflection"}`;

  const reflectionPrompts = asArray(activeCase?.reflectionPrompts);
  const isStudent = state.activeRole === "user";
  dom.reflectionPrompts.innerHTML = reflectionPrompts.length
    ? reflectionPrompts
        .map((item, index) => {
          const safe = escapeHtml(String(item || ""));
          if (!isStudent) return `<article class="prompt-item">${safe}</article>`;
          const placeholder = state.locale === "ko" ? "당신의 답변을 적으세요..." : "Type your reflection...";
          const submitLabel = state.locale === "ko" ? "제출" : "Submit";
          return `
            <article class="prompt-item" data-prompt-index="${index}">
              <span class="prompt-text">${safe}</span>
              <textarea class="reflection-response" data-prompt-index="${index}" placeholder="${placeholder}"></textarea>
              <div class="reflection-footer">
                <button type="button" class="toolbar-button toolbar-button-primary reflection-submit" data-reflection-submit="${index}">${submitLabel}</button>
                <span class="reflection-status" data-reflection-status="${index}"></span>
              </div>
            </article>
          `;
        })
        .join("")
    : emptyNoteMarkup(t("noPrompts"));

  if (dom.instructorCohortBlock) {
    const showCohort = state.activeRole === "admin" && Boolean(activeCase);
    dom.instructorCohortBlock.hidden = !showCohort;
    if (showCohort) {
      renderInstructorCohortPanel();
    }
  }

  dom.reflectionFeed.innerHTML = state.timeline.length
    ? state.timeline
        .map(
          (item, index) => `
            <article class="reflection-item">
              <strong>${state.locale === "ko" ? `${index + 1}차 반복` : `Iteration ${index + 1}`}</strong>
              <p>${item}</p>
            </article>
          `
        )
        .join("")
    : emptyNoteMarkup(t("noActivity"));
}

function renderAll() {
  if (dom.visualizerInput) {
    dom.visualizerInput.placeholder = t("askQuestionPlaceholder");
  }
  const chatInput = document.getElementById("chat-input");
  if (chatInput) {
    chatInput.placeholder = t("askPerspectivePlaceholder");
  }
  updateTopbarCompactSummary();
  syncActiveCaseState();
  ensureGraphCurrent();
  dom.visualizerLayout?.classList.toggle("is-focused", hasActiveCase());
  renderPlatformControls();
  renderPipelineConsole();
  renderConstraints();
  renderNavigation();
  renderSidebar();
  renderGraph();
  renderExportActions();
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
  dom.landingAuthStatus.textContent = state.auth.loading ? t("checking") : state.auth.message;
  dom.landingLoginHelper.textContent =
    state.auth.source === "supabase" && activeInstitution && activeCourse
      ? `${activeInstitution.name} - ${activeCourse.code} ${activeCourse.name}`
      : state.auth.source === "supabase"
        ? t("noCourseLinkedYet")
        : configured
        ? ""
        : "";
  dom.landingJoinHelper.textContent = configured
    ? t("studentJoinHelper")
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
  const hasCourse = Boolean(getActiveCourse());
  if (state.activeRole === "admin") {
    if (!hasCourse) {
      return [
        {
          selector: "#add-course-form",
          title: state.locale === "ko" ? "첫 코스 만들기" : "Create Your First Course",
          body: state.locale === "ko"
            ? "아직 코스가 없습니다. 코스 이름과 코드(예: W200)를 입력해 학생을 위한 첫 코스를 만드세요. 코스를 만든 뒤 튜토리얼을 다시 실행하면 나머지 단계를 안내합니다."
            : "You don't have a course yet. Enter a course name and code (e.g., W200) here to spin up your first course. Replay the tutorial after creating the course to see the rest of the flow.",
          view: "visualizer",
        },
      ];
    }
    return [
      {
        selector: "#course-select",
        title: state.locale === "ko" ? "코스 선택" : "Choose the Course",
        body: state.locale === "ko" ? "케이스를 만들거나 수정하기 전에 올바른 코스인지 먼저 확인하세요." : "Start by making sure you are in the right course before creating or editing a case.",
      },
      {
        selector: "#case-select",
        title: state.locale === "ko" ? "작업할 케이스 선택" : "Pick the Case You Want to Work On",
        body: state.locale === "ko" ? "이 목록에서 초안과 게시된 케이스를 전환할 수 있습니다." : "Use this list to switch between drafts and published cases.",
      },
      {
        selector: "#upload-document-form",
        title: state.locale === "ko" ? "케이스 생성 또는 게시" : "Create or Publish a Case",
        body: state.locale === "ko"
          ? "제목, 수업 설명요약, 공개 설정을 입력해 케이스를 만드세요. 기본값은 초안이며, 학생에게 공개할 준비가 되면 '학생에게 게시'로 전환하세요."
          : "Fill in the title, instructional brief, and visibility to create a case. New cases start as drafts — switch to 'Publish to learners' when students should see it.",
        view: "visualizer",
      },
      {
        selector: "#network-stage",
        title: state.locale === "ko" ? "케이스 맵 읽기" : "Read the Case Map",
        body: state.locale === "ko" ? "이 맵은 설계 결정을 형성하는 사람, 제약, 긴장을 보여줍니다." : "This map shows the people, constraints, and tensions that shape the design decision.",
        view: "visualizer",
      },
      {
        selector: "#visualizer-form",
        title: state.locale === "ko" ? "질문하기" : "Ask a Question",
        body: state.locale === "ko" ? "가장 중요한 갈등이나 특정 이해관계자의 우려를 물어 맵의 해석을 더해보세요." : "Ask about the most important conflict or a stakeholder concern to add more insight to the map.",
        view: "visualizer",
      },
      ...(hasCase
        ? [
            {
              selector: "#report-summary",
              title: state.locale === "ko" ? "분석을 요약으로 정리" : "Turn the Analysis into a Summary",
              body: state.locale === "ko" ? "준비가 되면 리포트 보기에서 요약, 긴장, 근거를 확인하세요." : "When you are ready, open the report view to review the summary, tensions, and evidence.",
              view: "report",
            },
          ]
        : []),
    ];
  }

  return [
    {
      selector: "#course-select",
      title: state.locale === "ko" ? "코스 확인" : "Check the Course",
      body: state.locale === "ko" ? "교수자가 안내한 코스에 들어와 있는지 먼저 확인하세요." : "Make sure you are in the course your instructor asked you to join.",
    },
    {
      selector: "#case-select",
      title: state.locale === "ko" ? "게시된 케이스 선택" : "Choose a Published Case",
      body: state.locale === "ko" ? "이 목록에는 교수자가 학생과 공유한 케이스만 보입니다." : "This list only shows cases your instructor has shared with students.",
    },
    ...(hasCase
      ? [
          {
            selector: "#agenda-node-form",
            title: state.locale === "ko" ? "노드 하나 추가" : "Add One Node",
            body: state.locale === "ko" ? "자신의 관점에서 질문, 우려, 이슈 하나를 추가하세요. 이것은 개인 학습 레이어의 일부가 됩니다." : "Add one question, concern, or issue from your own point of view. This becomes part of your private learner layer.",
            view: "visualizer",
          },
          {
            selector: "#network-stage",
            title: state.locale === "ko" ? "케이스 맵 읽기" : "Read the Case Map",
            body: state.locale === "ko" ? "먼저 큰 클러스터를 훑어보세요. 노드에 호버하면 내용을 보고, 이해관계자 노드를 클릭하면 렌즈가 바뀝니다." : "Scan the main clusters first. Hover a node to inspect it, then click a stakeholder node to shift the lens.",
            view: "visualizer",
          },
          {
            selector: "#chat-form",
            title: state.locale === "ko" ? "한 관점에서 질문하기" : "Ask from One Perspective",
            body: state.locale === "ko" ? "특정 이해관계자의 관점에서 답을 듣고 싶을 때 이 입력창을 사용하세요." : "Use this box when you want a response from one stakeholder's point of view.",
            view: "perspectives",
          },
          {
            selector: "#reflection-prompts",
            title: state.locale === "ko" ? "리플렉션 작성" : "Write Your Reflection",
            body: state.locale === "ko" ? "이 프롬프트를 활용해 맵에서 찾은 내용을 짧은 리플렉션으로 정리하세요." : "Use these prompts to turn what you found in the map into a short reflection.",
            view: "report",
          },
        ]
      : [
          // Fallback for students who haven't opened a case yet — still give them somewhere to go.
          {
            selector: "#network-stage",
            title: state.locale === "ko" ? "케이스를 선택하면 지도가 열립니다" : "Pick a Case to Open the Map",
            body: state.locale === "ko"
              ? "위의 목록에서 게시된 케이스를 하나 고르면 네트워크 지도가 이곳에 나타납니다. 그 뒤 튜토리얼을 다시 실행하면 노드 추가, 리플렉션까지 나머지 단계를 안내합니다."
              : "Pick one published case above and the network map will appear here. Replay the tutorial after that and it will walk you through adding a node, asking from a perspective, and writing a reflection.",
            view: "visualizer",
          },
        ]),
  ];
}

function positionTutorialCard(target) {
  const rect = target.getBoundingClientRect();
  const viewportPadding = 16;
  const cardWidth = Math.min(360, window.innerWidth - viewportPadding * 2);
  const cardHeight = Math.min(
    dom.tourCard.offsetHeight || 220,
    window.innerHeight - viewportPadding * 2
  );
  const preferredLeft = Math.min(
    window.innerWidth - cardWidth - viewportPadding,
    Math.max(viewportPadding, rect.left + rect.width / 2 - cardWidth / 2)
  );
  const spaceBelow = window.innerHeight - rect.bottom - viewportPadding;
  const spaceAbove = rect.top - viewportPadding;
  const showAbove = spaceBelow < cardHeight && spaceAbove > spaceBelow;
  const preferredTop = showAbove ? rect.top - cardHeight - 12 : rect.bottom + 12;
  const top = Math.max(
    viewportPadding,
    Math.min(window.innerHeight - cardHeight - viewportPadding, preferredTop)
  );
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
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(renderTutorialStep);
    });
    return;
  }

  const target = document.querySelector(step.selector);
  if (!target) {
    if (tutorialState.stepIndex >= tutorialState.steps.length - 1) {
      endTutorial(true);
      return;
    }
    tutorialState.stepIndex += 1;
    renderTutorialStep();
    return;
  }

  clearTutorialHighlight();
  tutorialState.target = target;
  target.classList.add("tour-target-active");
  target.scrollIntoView({ behavior: "auto", block: "center", inline: "nearest" });
  dom.tourOverlay.classList.remove("is-hidden");
  dom.tourOverlay.setAttribute("aria-hidden", "false");
  dom.tourStepLabel.textContent =
    state.locale === "ko"
      ? `${tutorialState.stepIndex + 1} / ${tutorialState.steps.length} 단계`
      : `Step ${tutorialState.stepIndex + 1} of ${tutorialState.steps.length}`;
  dom.tourTitle.textContent = step.title;
  dom.tourBody.textContent = step.body;
  dom.tourBack.disabled = tutorialState.stepIndex === 0;
  dom.tourBack.textContent = t("tutorialBack");
  dom.tourSkip.textContent = t("tutorialSkip");
  dom.tourNext.textContent = tutorialState.stepIndex === tutorialState.steps.length - 1 ? t("tutorialFinish") : t("tutorialNext");
  window.requestAnimationFrame(() => positionTutorialCard(target));
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
  logEvent("tutorial.start", { role: roleKey, forced: Boolean(force), step_count: tutorialState.steps.length });
  window.requestAnimationFrame(renderTutorialStep);
}

function endTutorial(markSeen = true) {
  const wasActive = tutorialState.active;
  const lastIndex = tutorialState.stepIndex;
  const total = tutorialState.steps.length;
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
  if (wasActive) {
    const reachedEnd = total > 0 && lastIndex >= total - 1;
    logEvent(reachedEnd ? "tutorial.complete" : "tutorial.skip", {
      role: state.activeRole,
      step_index: lastIndex,
      step_count: total,
    });
  }
}

function advanceTutorial(direction) {
  if (!tutorialState.active) return;
  if (direction > 0 && tutorialState.stepIndex >= tutorialState.steps.length - 1) {
    endTutorial(true);
    return;
  }
  tutorialState.stepIndex = Math.max(0, Math.min(tutorialState.steps.length - 1, tutorialState.stepIndex + direction));
  logEvent("tutorial.step", {
    role: state.activeRole,
    step_index: tutorialState.stepIndex,
    direction: direction > 0 ? "forward" : "back",
  });
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
  logEvent("node.add", {
    node_id: agendaNode.id,
    title: agendaNode.title.slice(0, 200),
    body_length: agendaNode.body.length,
    stakeholder: agendaNode.stakeholder,
    expansion_count: expansions.length,
  });
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
  const previous = state.activeView;
  state.activeView = nextView;
  renderNavigation();
  if (previous !== nextView) {
    logEvent("view.switch", { from: previous, to: nextView });
  }
}

function setStakeholder(nextStakeholder) {
  const previous = state.activeStakeholder;
  state.activeStakeholder = nextStakeholder;
  renderAll();
  if (previous !== nextStakeholder) {
    logEvent("lens.change", { from: previous, to: nextStakeholder });
  }
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
  if (!hasActiveCase()) {
    throw new Error(
      state.activeRole === "admin"
        ? "Create or choose a case before asking a question."
        : "Choose a published case before asking a question."
    );
  }
  state.chat.push({ role: "user", stakeholder: state.activeStakeholder, body: clean });
  renderAll();
  logEvent("question.ask", {
    text: clean.slice(0, 500),
    length: clean.length,
    stakeholder: state.activeStakeholder,
    view: state.activeView,
  });
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
  logEvent(targetCase.published ? "case.publish" : "case.unpublish", { case_id: caseId, title: targetCase.title });
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
  logEvent("case.open", { via: "topbar" });
});

dom.sidebarCaseSelect.addEventListener("change", (event) => {
  state.activeCaseId = event.target.value;
  ensureActiveSelections();
  persistSessionState();
  renderAll();
  logEvent("case.open", { via: "sidebar" });
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
    logEvent("perspective.quick", { prompt: promptButton.dataset.prompt, stakeholder: state.activeStakeholder });
  }

  const reflectionSubmit = event.target.closest("[data-reflection-submit]");
  if (reflectionSubmit) {
    const idx = Number(reflectionSubmit.getAttribute("data-reflection-submit"));
    if (Number.isFinite(idx)) handleReflectionSubmit(idx);
  }

  const viewIntroDismiss = event.target.closest("[data-view-intro-dismiss]");
  if (viewIntroDismiss) {
    const key = viewIntroDismiss.getAttribute("data-view-intro-dismiss");
    const card = document.querySelector(`[data-view-intro="${key}"]`) || document.getElementById(key);
    if (card) {
      card.classList.add("is-hidden");
      if (card.hasAttribute("hidden") || card.tagName.toLowerCase() === "div") card.hidden = true;
    }
    try { localStorage.setItem(`view-intro-dismissed:${key}`, "1"); } catch (_) {}
    return;
  }

  const cohortFilterBtn = event.target.closest("[data-cohort-filter]");
  if (cohortFilterBtn) {
    state.cohortSectionFilter = cohortFilterBtn.getAttribute("data-cohort-filter");
    const ddContainer = document.getElementById("cohort-drilldown");
    if (ddContainer) { ddContainer.hidden = true; ddContainer.innerHTML = ""; }
    renderInstructorCohortPanel();
    return;
  }

  const cohortRow = event.target.closest("[data-cohort-user]");
  if (cohortRow) {
    const uid = cohortRow.getAttribute("data-cohort-user");
    const name = cohortRow.getAttribute("data-cohort-name") || uid.slice(0, 8);
    if (uid) renderStudentDrilldown(uid, name);
  }

  const drilldownClose = event.target.closest("[data-drilldown-close]");
  if (drilldownClose) {
    const container = document.getElementById("cohort-drilldown");
    if (container) {
      container.hidden = true;
      container.innerHTML = "";
    }
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
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalLabel = submitButton ? submitButton.textContent : "";
    const stages = state.locale === "ko"
      ? ["설명요약 분석 중…", "이해관계자 추출 중…", "긴장 관계 계산 중…", "케이스 저장 중…"]
      : ["Parsing brief…", "Extracting stakeholders…", "Computing tensions…", "Saving case…"];
    let stageIndex = 0;
    const setStage = (label) => { if (submitButton) submitButton.textContent = label; };
    setStage(stages[0]);
    if (submitButton) submitButton.disabled = true;
    const stageTimer = setInterval(() => {
      stageIndex = Math.min(stageIndex + 1, stages.length - 1);
      setStage(stages[stageIndex]);
    }, 700);
    try {
      const submittedTitle = String(form.get("documentTitle")).trim();
      const submittedText = String(form.get("documentText")).trim();
      const submittedMode = String(form.get("publishMode"));
      await uploadStructuredDocument(submittedTitle, submittedText, submittedMode);
      event.target.reset();
      regenerateGraph("admin upload structured");
      renderAll();
      logEvent("case.create", {
        title: submittedTitle.slice(0, 200),
        brief_length: submittedText.length,
        publish_mode: submittedMode,
        case_id: state.activeCaseId || null,
      });
    } catch (error) {
      state.auth.message = error.message || "The document could not be structured.";
      renderLandingLogin();
    } finally {
      clearInterval(stageTimer);
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalLabel || t("createCaseBtn");
      }
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

document.getElementById("visualizer-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const input = document.getElementById("visualizer-input");
  const submitButton = event.target.querySelector('button[type="submit"]');
  const previousLabel = submitButton?.textContent || "";
  try {
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = t("thinking");
    }
    input.disabled = true;
    await handleAsk(input.value);
    input.value = "";
  } catch (error) {
    state.auth.message = error.message || t("questionCouldNotBeProcessed");
    renderLandingLogin();
  } finally {
    input.disabled = false;
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = previousLabel || t("askQuestion");
    }
    input.focus();
  }
});

if (dom.downloadPngButton) {
  dom.downloadPngButton.addEventListener("click", async () => {
    const previousLabel = dom.downloadPngButton.textContent;
    try {
      dom.downloadPngButton.disabled = true;
      dom.downloadPngButton.textContent = "Preparing...";
      await downloadNetworkPngSnapshot();
    } catch (error) {
      console.error(error);
      state.graph.events.unshift({
        title: "PNG export unavailable",
        body: error.message || "The PNG export could not be created.",
      });
      state.graph.events = state.graph.events.slice(0, 4);
      renderAll();
    } finally {
      dom.downloadPngButton.textContent = previousLabel;
      renderExportActions();
    }
  });
}

if (dom.downloadHtmlButton) {
  dom.downloadHtmlButton.addEventListener("click", () => {
    const previousLabel = dom.downloadHtmlButton.textContent;
    try {
      dom.downloadHtmlButton.disabled = true;
      dom.downloadHtmlButton.textContent = "Preparing...";
      downloadNetworkHtmlSnapshot();
    } catch (error) {
      console.error(error);
      state.graph.events.unshift({
        title: "HTML snapshot unavailable",
        body: error.message || "The HTML snapshot could not be created.",
      });
      state.graph.events = state.graph.events.slice(0, 4);
      renderAll();
    } finally {
      dom.downloadHtmlButton.textContent = previousLabel;
      renderExportActions();
    }
  });
}

document.getElementById("chat-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const input = document.getElementById("chat-input");
  const submitButton = event.target.querySelector('button[type="submit"]');
  const previousLabel = submitButton?.textContent || "";
  try {
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Thinking...";
    }
    input.disabled = true;
    await handleAsk(input.value);
    input.value = "";
  } catch (error) {
    state.auth.message = error.message || "The question could not be processed.";
    renderLandingLogin();
  } finally {
    input.disabled = false;
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = previousLabel || "Ask";
    }
    input.focus();
  }
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

document.getElementById("student-onboarding-tour-button")?.addEventListener("click", () => {
  startTutorial(true);
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

document.addEventListener("keydown", (event) => {
  if (!tutorialState.active) return;
  if (event.key === "Escape") {
    event.preventDefault();
    endTutorial(true);
    return;
  }
  if (event.key === "ArrowRight") {
    event.preventDefault();
    advanceTutorial(1);
    return;
  }
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    advanceTutorial(-1);
  }
});

dom.landingLocaleToggle?.addEventListener("click", () => {
  setLocale(state.locale === "en" ? "ko" : "en");
});

dom.workspaceLocaleToggle?.addEventListener("click", () => {
  setLocale(state.locale === "en" ? "ko" : "en");
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

dom.caseTitleEdit?.addEventListener("click", () => {
  renameActiveCase();
});

dom.cohortRefresh?.addEventListener("click", () => {
  renderInstructorCohortPanel();
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

function updateTopbarCompactSummary() {
  const summary = dom.topbarCompactSummary;
  if (!summary) return;
  const collapsed = dom.topbar?.classList.contains("is-collapsed");
  if (!collapsed) {
    summary.hidden = true;
    summary.textContent = "";
    return;
  }
  const course = getActiveCourse();
  const caseRec = getCaseById(state.activeCaseId);
  const parts = [];
  if (course?.code) parts.push(course.code);
  if (caseRec?.title) parts.push(caseRec.title);
  summary.textContent = parts.join(" · ") || "Context hidden";
  summary.hidden = false;
}

function setTopbarCollapsed(collapsed, { persist = true } = {}) {
  if (!dom.topbar) return;
  dom.topbar.classList.toggle("is-collapsed", !!collapsed);
  if (dom.topbarCollapseToggle) {
    const label = collapsed ? "Expand context bar" : "Collapse context bar";
    dom.topbarCollapseToggle.setAttribute("aria-label", label);
    dom.topbarCollapseToggle.setAttribute("title", label);
  }
  updateTopbarCompactSummary();
  if (persist) {
    try { localStorage.setItem("topbar-collapsed", collapsed ? "1" : "0"); } catch (_) {}
  }
}

function restoreTopbarCollapse() {
  let stored = "0";
  try { stored = localStorage.getItem("topbar-collapsed") || "0"; } catch (_) {}
  setTopbarCollapsed(stored === "1", { persist: false });
}

function restoreDismissedViewIntros() {
  document.querySelectorAll("[data-view-intro]").forEach((card) => {
    const key = card.getAttribute("data-view-intro");
    try {
      if (localStorage.getItem(`view-intro-dismissed:${key}`) === "1") {
        card.classList.add("is-hidden");
      }
    } catch (_) {}
  });
}

function setPanelCollapsed(panelKey, collapsed, { persist = true } = {}) {
  const panel = document.querySelector(`[data-collapsible-panel="${panelKey}"]`);
  if (!panel) return;
  panel.classList.toggle("is-collapsed", !!collapsed);
  const layout = document.getElementById("visualizer-layout");
  if (layout) {
    layout.classList.toggle(`${panelKey}-collapsed`, !!collapsed);
  }
  const toggle = panel.querySelector(".panel-collapse-toggle");
  if (toggle) {
    const label = collapsed ? "Expand panel" : "Collapse panel";
    toggle.setAttribute("aria-label", label);
    toggle.setAttribute("title", label);
  }
  // Single toggle pill in the canvas header is always visible; update its state label + chevron orientation.
  const expandBtn = document.getElementById(`panel-expand-${panelKey}`);
  if (expandBtn) {
    expandBtn.hidden = false;
    expandBtn.classList.toggle("is-panel-open", !collapsed);
    expandBtn.setAttribute("aria-expanded", collapsed ? "false" : "true");
  }
  if (persist) {
    try { localStorage.setItem(`panel-collapsed:${panelKey}`, collapsed ? "1" : "0"); } catch (_) {}
  }
  // Re-measure the D3 stage after layout changes so the graph expands into the reclaimed space.
  // Use two rAFs so CSS grid has actually reflowed before we read the new width/height.
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      try { if (typeof resizeGraphRenderer === "function") resizeGraphRenderer(); } catch (_) {}
      try { if (typeof regenerateGraph === "function") regenerateGraph("panel collapse"); } catch (_) {}
      // Full render path rebuilds force targets from fresh graphRenderer width/height.
      try { if (typeof renderGraph === "function") renderGraph(); } catch (_) {}
      // Restart the simulation with a fresh alpha so nodes visibly migrate to new cluster centers.
      try {
        if (typeof graphRenderer !== "undefined" && graphRenderer?.simulation) {
          graphRenderer.simulation.alpha(0.85).restart();
        }
      } catch (_) {}
    });
  });
}

function restoreCollapsiblePanels() {
  // One-time reset for this version: earlier builds could persist a broken collapsed state,
  // and students benefit from rediscovering the tutorial once more. Runs once per browser.
  try {
    if (!localStorage.getItem("panel-collapsed-v2")) {
      localStorage.removeItem("panel-collapsed:intake");
      localStorage.removeItem("panel-collapsed:insight");
      localStorage.removeItem("swarm-id-tutorial-v1");
      localStorage.setItem("panel-collapsed-v2", "1");
    }
  } catch (_) {}
  document.querySelectorAll("[data-collapsible-panel]").forEach((panel) => {
    const key = panel.getAttribute("data-collapsible-panel");
    let stored = "0";
    try { stored = localStorage.getItem(`panel-collapsed:${key}`) || "0"; } catch (_) {}
    setPanelCollapsed(key, stored === "1", { persist: false });
  });
}

function wireCollapsiblePanels() {
  document.querySelectorAll(".panel-collapse-toggle[data-collapse-target]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-collapse-target");
      if (!key) return;
      const panel = document.querySelector(`[data-collapsible-panel="${key}"]`);
      const nextCollapsed = !panel?.classList.contains("is-collapsed");
      setPanelCollapsed(key, nextCollapsed);
    });
  });
  document.querySelectorAll(".panel-expand-toggle[data-expand-target]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-expand-target");
      if (!key) return;
      const panel = document.querySelector(`[data-collapsible-panel="${key}"]`);
      const nextCollapsed = !panel?.classList.contains("is-collapsed");
      setPanelCollapsed(key, nextCollapsed);
    });
  });
  wireLegendToggle();
}

function setLegendCollapsed(collapsed) {
  const legend = document.getElementById("stage-legend");
  const reopen = document.getElementById("legend-reopen");
  if (!legend || !reopen) return;
  legend.setAttribute("data-collapsed", collapsed ? "true" : "false");
  reopen.hidden = !collapsed;
  try {
    localStorage.setItem("legend-collapsed", collapsed ? "1" : "0");
  } catch (err) {
    /* ignore storage errors */
  }
}

function wireLegendToggle() {
  const closeBtn = document.getElementById("legend-close");
  const reopenBtn = document.getElementById("legend-reopen");
  if (closeBtn && !closeBtn.dataset.wired) {
    closeBtn.dataset.wired = "1";
    closeBtn.addEventListener("click", () => setLegendCollapsed(true));
  }
  if (reopenBtn && !reopenBtn.dataset.wired) {
    reopenBtn.dataset.wired = "1";
    reopenBtn.addEventListener("click", () => setLegendCollapsed(false));
  }
  try {
    const saved = localStorage.getItem("legend-collapsed");
    if (saved === "1") setLegendCollapsed(true);
  } catch (err) {
    /* ignore */
  }
}

async function boot() {
  applyStaticTranslations();
  restoreDismissedViewIntros();
  restoreTopbarCollapse();
  restoreCollapsiblePanels();
  wireCollapsiblePanels();
  dom.topbarCollapseToggle?.addEventListener("click", () => {
    const nextCollapsed = !dom.topbar?.classList.contains("is-collapsed");
    setTopbarCollapsed(nextCollapsed);
  });
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

