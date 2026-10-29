# Benchmark REA — 디스커션 네트워크 앱 (2026-10-29)

대상: 공개 소스를 직접 클론해 코드 수준으로 읽은 4개 앱. 실행이 아니라 소스 독해 기반이며, 각 항목은 원본 파일 위치를 남겼어요.

| 앱 | 핵심 질문 | 스택 |
| --- | --- | --- |
| InfraNodus (noduslabs/infranodus, v2 OSS) | 담론 네트워크의 구조적 공백(gap)은 어디인가 | Node/Express/EJS + Neo4j, sigma.js·graphology·jsnetworkx (지표는 클라이언트) |
| Pol.is (compdemocracy/polis) | 어떤 진술이 집단을 가르고, 어떤 진술이 합의인가 | Clojure 수학 서버(PCA·k-means·repness) + d3 클라이언트 |
| Argdown (christianvoigt/argdown) | 주장 사이 관계(지지/반박/모순)를 어떻게 표기·배치하나 | TS 플러그인 파이프라인 + dagre/viz.js |
| Debate Map (debate-map/app) | 평가 집계·타임라인 재생·변경 이력 | React/MobX + Rust/Postgres |

## 가장 앞선 기능 → DTS 이식 판단

| # | 기능 (원본) | 구현 핵심 | DTS 판단 |
| --- | --- | --- | --- |
| 1 | 매개 중심성 크기 (InfraNodus `GraphRank.ejs`) | Brandes betweenness, 가중치→거리 1/w, sqrt 스케일 | **이식** — 쟁점 그래프(위성 제외)에서 "다리 쟁점" 강조 |
| 2 | 구조적 공백 질문 (InfraNodus `createInsightClusters`) | 원본은 상위 4개 군집 중 작은 2개를 고를 뿐, 실제 공백 측정 없음 | **개선 이식** — 관점(교사·학생·IT·행정) 쌍마다 교차 연결 밀도를 계산해 영향력은 큰데 연결이 약한 쌍을 공백으로 선정, "A와 B는 어떻게 연결될까요?" 질문 → 질문/노드 추가 입력창으로 연결 |
| 3 | 핀 고정 포커스 (InfraNodus `GraphUpdate.ejs`) | 고정 노드 + 이웃만 남기고 나머지 흐리게, 근거 목록 필터 | **이식** — 선택 노드의 1-hop 이웃 포커스 |
| 4 | 다양성 지표 (InfraNodus `PolysingularityLogic.ejs`) | modularity·최대 군집 비율·엔트로피 규칙표 → 편중/집중/다양/분산 | **적응** — 관점별 노드 분포 엔트로피로 "내 맵이 한 관점에 쏠렸는지" 표시 |
| 5 | 집단 오목 껍질 (Polis `vis2/graphUtil.js`) | 그룹별 hull + 짧은 충돌 force | **이식** — 관점별 영역을 옅은 hull로 표시(d3.polygonHull + 패딩) |
| 6 | 집단 인식 합의 (Polis `conversation.clj:633`) | 그룹별 스무딩 동의율의 곱 → 모든 집단이 동의해야 높음 | **보류(데이터 필요)** — 학생 투표 스키마가 없어 이번 범위 밖. 학급 보기에서 "여러 관점에서 반복된 쟁점"으로 근사 |
| 7 | 타입 있는 관계 (Argdown `model.ts`) | support/attack/contrary, 대칭 관계는 역방향 엣지 | **부분 이식** — 기존 엣지 kind(issue/sequence/inter-stakeholder) 범례 정리. 학생 작성 관계는 저장 스키마 변경이 필요해 보류 |
| 8 | 타임라인 재생 (Debate Map `ForEffects.ts`) | 공개 시점 fold, 페이드 글로우, 카메라 보간 | **보류** — 이벤트 로그 기반 재생은 다음 단계. 카메라 맞춤(zoom-to-fit, scale = min(W/w,H/h)·0.9)만 이번에 이식 |
| 9 | 지난 방문 이후 변경 표시 (Debate Map `mapNodeEdits.ts`) | localStorage 방문 시각 vs createdAt | **보류** — 학급 노드에 createdAt 일관성 확인 후 |

## 이번 릴리스에 넣는 것

1. 맵 우선 레이아웃: 맵 위 크롬(제목줄·할 일 배너·맵 읽는 법) 압축, 화면 맞춤(fit) 버튼과 첫 렌더 자동 맞춤, 관점 버튼과 노드 겹침 해소.
2. 네트워크 인사이트 패널(`map-insights.js`): 다리 쟁점(betweenness 상위), 관점 공백 질문(+ 바로 질문 추가), 관점 균형 지표.
3. 이웃 포커스와 관점 hull.

페르소나 여정 테스트 결과에 따라 순서와 범위를 조정했고, 그 기록은 `docs/persona-journey-rounds-2026-10.md`에 있어요.
