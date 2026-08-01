# DTS 로깅 스키마 — Evidence-Centered Design 정렬

## 0. 왜 이 문서가 필요한가

이 앱의 목표는 `docs/swarm_id_app_functions.md`에 이렇게 적혀 있다.

> The goal is not "the right answer." The goal is **faster lens-shifting, better
> justification, and deeper redesign.**

정답을 채점하지 않겠다고 선언한 시스템은 **무엇을 근거로 무엇을 주장할지**를 따로
설계해야 한다. 그 설계가 없으면 로그는 "많이 눌렀다"는 사실만 남기고, 그것은 학습에
대한 주장이 아니다. ECD(Mislevy, Steinberg & Almond)는 정확히 그 간극을 메우는 틀이라
여기에 맞춘다.

ECD의 CAF(Conceptual Assessment Framework) 세 축을 로깅 요구사항으로 번역하면:

| ECD 축 | 묻는 것 | 로그가 실어야 하는 것 |
| --- | --- | --- |
| **Student Model** | 무엇을 주장하려는가 | 이 이벤트가 **어느 구인의 증거인지** |
| **Evidence Model — evidence rules** | 산출물에서 무엇을 뽑는가 | work product 스냅샷 + 거기서 계산한 **observable** |
| **Evidence Model — measurement** | 그 관찰이 주장을 얼마나 움직이는가 | 방향·강도, 그리고 **직전 상태** |
| **Task Model** | 어떤 상황이 그 증거를 유발했는가 | **task features**(케이스·이해관계자 구성·스캐폴드 상태·제약) |
| Assembly / Presentation / Delivery | 조건이 서로 같았는가 | 밀도·테마·뷰포트·시간 예산 |

핵심 원칙 하나: **task features 없이 기록된 관찰은 해석할 수 없다.** 학생이 나아진
것인지 과제가 쉬워진 것인지 사후에 분리할 방법이 사라진다.

---

## 1. 현재 상태 (2026-08-01 실측)

- 이벤트 타입 **40종**, 호출 지점 **49곳**, `public.analytics_events`에 append-only.
- 봉투: `user_id` `course_id` `case_id` `role` `session_id` `seq`
  `consent_version` `consent_granted` `client_ts` + 서버 `created_at`.
- 이미 잘 되어 있는 것 — 그대로 둔다:
  - 순서 보장(`session_id` + `seq`)과 서버 시각 병기 → 시계 왜곡에 강함.
  - 동의 게이팅이 `logEvent` 진입부에 있음(학생은 미동의 시 아예 기록 안 됨).
  - 일부 이벤트가 이미 **evidence rule을 내장**한다. `reflection.submit`의
    `anchors_at_feedback` vs `anchors_at_submit`, `revised_after_feedback`는
    "피드백을 받고 실제로 근거를 늘렸는가"라는 관찰변수 그 자체다.
  - `jol.predict` / `jol.outcome` — 메타인지(JOL) 보정을 이미 재고 있다.
  - `peer.exposure`, `visibility.change`(가시 상태 한정 체류) — 사회적 노출과
    유효 시간의 분모.

### 확인된 공백

| 없는 이벤트 | 왜 필요한가 |
| --- | --- |
| `node.edit` / `node.delete` | 재설계는 **고쳐 쓰기**에서 드러난다. 추가만 기록하면 "깊은 재설계"를 주장할 근거가 없다 |
| `annotation.revise` | `annotation.created`에 `revision` 필드는 있으나 개정 자체가 이벤트가 아니라 개정 궤적을 못 만든다 |
| `evidence.cite` | 정당화의 최소 단위(어떤 노드를 근거로 끌어왔는가)가 리포트 시점에만 집계된다 |
| `tension.rank` | "어떤 쟁점이 지금 중요한가"는 이 앱의 핵심 판단인데 선택 흔적이 없다 |
| `agent.compare` | "같은 안에 대한 서로 다른 반응 비교"가 제품 정의에 있는데 로그가 없다 |
| `case.submit` | 과업 종료 경계가 없어 세션을 과업으로 자를 수 없다 |
| `prompt.shown` / `opportunity.skipped` | **비반응도 증거다.** 제시했는데 안 한 것을 못 세면 능력과 노출을 혼동한다 |

---

## 2. Student Model — 구인 6개

앱이 스스로 선언한 목표에서 직접 유도한다. 임의로 늘리지 않는다.

| id | 구인 | 이 앱에서의 정의 | 주된 증거원 |
| --- | --- | --- | --- |
| `lens_shift` | 관점 전환 | 같은 쟁점을 다른 이해관계자 렌즈로 다시 읽는 빈도·전환 지연·전환 후 산출물 변화 | `perspective_switched`, `lens.change`, `agent.compare` |
| `tension_id` | 쟁점 식별·우선순위 | 갈등을 알아보고 그중 무엇이 지금 중요한지 고르는 판단 | `tension.rank`, `node.select`, `node.add` |
| `justification` | 근거 기반 정당화 | 주장에 맵의 근거를 연결하는 정도와 그 개선 | `evidence.cite`, `reflection.submit`, `annotation.created` |
| `redesign` | 재설계·종합 | 받은 정보를 실제 수정으로 바꾸는 정도 | `node.edit`, `synthesis_block_revised`, `sandbox` 조정 |
| `metacognition` | 자기점검 | 예측과 결과의 정합, 피드백 후 수정 여부 | `jol.predict`/`jol.outcome`, `revised_after_feedback` |
| `collab` | 협업·상호참조 | 동료 산출물에 노출되고 그것을 자기 산출물에 반영하는 정도 | `peer.exposure`, `annotation.created(visibility)` |

> 주의: 이 6개는 **주장 후보**이지 검증된 척도가 아니다. 척도화(신뢰도·타당도)는
> 데이터가 쌓인 뒤 별도로 해야 하며, 그 전까지 대시보드에 점수로 표시하지 않는다.

---

## 3. 봉투 확장 — 모든 이벤트가 실어야 할 것

기존 봉투에 아래를 **추가**한다. 이벤트별 페이로드가 아니라 `logEvent` 한 곳에서
자동 부착해야 누락이 생기지 않는다.

```jsonc
{
  // --- 기존 (유지) ---
  "user_id": "...", "course_id": "...", "case_id": "...", "role": "user",
  "session_id": "...", "seq": 42,
  "consent_version": 2, "consent_granted": true,
  "client_ts": "...",          // + 서버 created_at

  // --- Student Model 연결 ---
  "construct": "justification",   // 이 이벤트가 증거인 구인 (없으면 null)
  "evidence_role": "positive",    // positive | negative | support_use | exposure | none

  // --- Task Model: task features ---
  "task": {
    "case_id": "...",
    "stakeholder_set": ["teacher","student","edtech","admin"],
    "active_stakeholder": "teacher",
    "node_count": 14,             // 과제 복잡도 대리치
    "constraint_count": 3,
    "scaffold": {                 // 지금 켜져 있는 지원
      "coach_open": false,
      "annotation_scaffold": false,
      "intro_visible": true
    },
    "phase": "explore"            // explore | annotate | synthesize | reflect
  },

  // --- Delivery: 조건 통제 ---
  "context": {
    "view": "visualizer", "density": "advanced", "theme": "light",
    "viewport": [1440, 950], "locale": "ko",
    "visible_ms_since_view": 18432   // 가시 상태 한정 누적
  }
}
```

`construct`와 `evidence_role`은 **호출부에서 명시**한다. 자동 추론하면 나중에
"이건 무슨 증거였나"를 되짚을 수 없다.

`evidence_role`의 값이 중요하다:
- `positive` — 구인을 드러내는 수행
- `negative` — 구인의 부재를 드러내는 수행(예: 근거 없이 결론)
- `support_use` — 스캐폴드 사용(능력의 반증이 아니라 **필요의 증거**)
- `exposure` — 노출만 있고 수행 없음(분모)
- `none` — 운영/UI 이벤트, 측정에 쓰지 않음

---

## 4. 이벤트 목록

### 4.1 유지 — 봉투만 확장 (40종 중 측정에 쓰는 것)

| 이벤트 | construct | evidence_role | 비고 |
| --- | --- | --- | --- |
| `perspective_switched` | lens_shift | positive | 전환 지연(`ms_since_view`) 추가 |
| `lens.change` | lens_shift | positive | |
| `node.add` | tension_id | positive | |
| `node.select` | tension_id | exposure | 선택은 노출, 후속 행동이 수행 |
| `annotation.created` | justification | positive | `stance`가 쟁점/질문이면 tension_id도 |
| `annotation.scaffold_opened` | justification | **support_use** | |
| `reflection.submit` | justification | positive | 이미 관찰변수 내장 |
| `synthesis_block_revised` | redesign | positive | |
| `feedback.requested` | metacognition | support_use | |
| `feedback.shown` | — | exposure | 분모 |
| `jol.predict` / `jol.outcome` | metacognition | positive | 보정오차 = |예측−실제| |
| `peer.exposure` | collab | exposure | |
| `question.ask` / `question.answer` | justification | positive/exposure | |
| `export.onepager` | redesign | positive | 종료 산출물 |
| `session.heartbeat`, `visibility.change` | — | none | 시간 분모 |
| 나머지 UI 이벤트(`view.switch`, `theme.change`, `density.change`, `drawer.open`, `map.*`) | — | none | 조건 통제용 |

### 4.2 신규 — 우선순위 순

**P0 — 이게 없으면 핵심 주장을 못 한다**

| 이벤트 | construct | 페이로드 핵심 | 왜 P0인가 |
| --- | --- | --- | --- |
| `node.edit` | redesign | `node_id`, `field`, `before_len`, `after_len`, `edit_distance`, `since_create_ms` | "깊은 재설계"의 유일한 직접 증거 |
| `evidence.cite` | justification | `claim_id`, `cited_node_ids[]`, `cite_count`, `source` | 정당화의 최소 단위 |
| `tension.rank` | tension_id | `ranked_ids[]`, `top_id`, `changed_from_prior` | "지금 무엇이 중요한가" 판단 |
| `opportunity.skipped` | (해당 구인) | `opportunity`, `shown_ms`, `dismissed_by` | **비반응 증거** — 없으면 능력과 노출 혼동 |

**P1 — 궤적과 비교를 가능하게 한다**

| 이벤트 | construct | 페이로드 핵심 |
| --- | --- | --- |
| `annotation.revise` | redesign | `annotation_id`, `revision`, `stance_before/after`, `body_delta` |
| `agent.compare` | lens_shift | `compared[]`, `dwell_ms`, `divergence_noted` |
| `node.delete` | redesign | `node_id`, `age_ms`, `had_annotations` |
| `case.submit` | — | `duration_ms`, `node_count`, `annotation_count`, `cite_count` (과업 경계) |
| `prompt.shown` | — | `prompt_id`, `trigger` (기회 분모) |

**P2 — 해석 품질을 높인다**

| 이벤트 | 목적 |
| --- | --- |
| `sandbox.adjust` | 슬라이더 조정 전후 지표 — 현재 `applyScenario`만 기록됨 |
| `constraint.view` | 제약 조건을 실제로 열어봤는지 |
| `idle.detected` | 체류 시간에서 이탈 구간 제거 |
| `rubric.criterion_view` | 교수자가 어느 기준으로 봤는지 |

---

## 5. 구현 원칙

1. **봉투는 한 곳에서.** `construct`/`evidence_role`/`task`/`context` 부착은
   `logEvent` 내부에서. 호출부는 구인과 역할만 넘긴다.
2. **산출물은 스냅샷, 관찰변수는 계산해서 함께.** 나중에 재계산하려면 원본이 필요하고,
   지금 판단하려면 관찰변수가 필요하다. 둘 다 싣는다(길이 상한 유지).
3. **비반응을 기록한다.** 기회(`prompt.shown`)와 미수행(`opportunity.skipped`)이
   없으면 어떤 비율도 정직하게 계산되지 않는다.
4. **점수를 만들지 않는다.** 이 스키마는 관찰변수까지만 만든다. 구인 점수는
   데이터가 쌓인 뒤 별도 측정모형에서, 신뢰도·타당도 확인 후에.
5. **동의 게이팅 유지.** 현재 학생 미동의 시 기록하지 않는 동작을 신규 이벤트에도
   그대로 적용한다. `evidence_role: exposure`도 예외 없음.
6. **PII 최소화.** 자유서술은 상한을 두고, 이름·이메일은 페이로드에 넣지 않는다
   (`user_id`로 조인).

---

## 6. 열린 질문 — 데이터 전에 답할 수 없는 것

- 6개 구인이 실제로 분리되는가, 아니면 하나의 "참여도"로 붕괴하는가.
- `lens_shift`를 빈도로 볼지 **전환 후 산출물 변화**로 볼지. 빈도만 보면 클릭 놀이를
  보상하게 된다.
- JOL 보정오차가 이 과제 길이에서 안정적으로 추정되는가.
- 스캐폴드 사용(`support_use`)을 능력 추정에서 어떻게 취급할지 — 감점이 아니라
  조건부 정보로 다뤄야 하는데, 그 모형은 아직 없다.
