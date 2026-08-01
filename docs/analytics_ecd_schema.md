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

### 2.0 정의를 쓸 때 지킨 세 가지

**(1) 정의는 관찰 가능한 것에 묶는다.** "관점을 잘 전환한다"는 정의가 아니다.
"무엇을 세면 그 주장이 서고, 무엇을 세면 안 서는가"까지 써야 정의다.

**(2) 각 구인에 배제 규칙을 같이 쓴다.** 무엇이 증거인지만 쓰면 구현할 때 애매한
것이 전부 포함되고, 결국 모든 구인이 "많이 조작함"으로 붕괴한다. 그래서 항목마다
**증거 아님**을 명시한다.

**(3) 클릭 수는 어떤 구인의 정의에도 넣지 않는다.** 빈도만 보상하면 시스템은
클릭 놀이를 학습으로 오인하고, 학생은 그걸 금방 알아챈다. 빈도는 **분모**로만 쓰고,
분자는 항상 산출물의 변화다.

### 2.1 `lens_shift` — 관점 전환

**정의.** 자기 판단으로 다른 이해관계자 렌즈를 선택하고, **그 전환 이후 자신의
산출물이 달라지는** 정도.

- **증거임** — 이해관계자 pill을 직접 눌러 전환(`source: "pill"`), 전환 후 일정
  시간 내 해당 렌즈에서 나온 노드·주석·근거 인용, 같은 쟁점을 두 렌즈 이상에서 다룬 흔적.
- **증거 아님** — 맵 노드를 클릭했더니 렌즈가 따라 바뀐 경우, 전환만 하고 아무 산출물
  변화가 없는 경우, 왕복 전환(A→B→A)의 단순 횟수.
- **관찰변수** — `deliberate_switch_count`, `post_switch_yield`(전환 후 120초 내
  산출물 생성 비율), `lens_coverage`(다룬 렌즈 수 / 제시된 렌즈 수),
  `multi_lens_issue_ratio`(2개 이상 렌즈에서 다뤄진 쟁점 비율).
- **지금 측정 가능한가 — 아니오.** §2.7 (1) 참조. 의도적 전환과 부수적 전환이 구분되지 않는다.
- **판별 위험** — `tension_id`와 섞인다. 전환의 *결과물*로 정의를 좁혀 분리한다.

### 2.2 `tension_id` — 쟁점 식별·우선순위

**정의.** 이해관계자 간 갈등을 쟁점으로 명명하고, 그중 **무엇이 지금 중요한지 골라
근거를 대는** 판단.

- **증거임** — 갈등을 명명한 노드 생성, 쟁점 우선순위 지정(`tension.rank`)과 그
  **변경 이력**, 우선순위 판단에 이유가 붙은 경우.
- **증거 아님** — 노드 조회·선택(주목일 뿐 판단이 아님), 시스템이 이미 갈등으로
  표시해 둔 것을 그대로 읽은 것, 노드 총량.
- **관찰변수** — `named_tension_count`, `rank_revision_count`(재정렬 = 재고의 흔적),
  `rank_stability`, `ranked_with_reason_ratio`.
- **지금 측정 가능한가 — 부분.** `node.add`는 있으나 갈등 명명인지 단순 추가인지
  구분되지 않고, 우선순위 이벤트는 아예 없다.
- **판별 위험** — 노드를 많이 만드는 성향과 구분이 안 된다. `node_count`를 task
  feature로 통제해야 한다.

### 2.3 `justification` — 근거 기반 정당화

**정의.** 자기 주장에 맵 위의 특정 근거를 **연결**하고, 지적을 받으면 연결을
**보강**하는 정도.

- **증거임** — 주장에 인용된 근거의 존재와 특정성(어떤 노드인지), 피드백 전후
  근거 수 증가(`anchors_at_feedback` → `anchors_at_submit`), 반례를 인용한 경우.
- **증거 아님** — 답변 길이, 근거 없는 단정, 근거 노드를 열어본 것(읽음 ≠ 인용).
- **관찰변수** — `cite_density`(주장당 인용 수), `cite_specificity`(node_id 지정 비율),
  `anchor_gain`(피드백 후 증가분), `counter_evidence_ratio`.
- **지금 측정 가능한가 — 부분이지만 이 중 가장 낫다.** `reflection.submit`이 이미
  피드백 전후 앵커 수를 싣고 있어 `anchor_gain`은 오늘도 계산된다. 다만
  `evidence.cite`가 없어 인용의 특정성은 알 수 없다.
- **판별 위험** — 장문 작성 습관. 그래서 **길이를 정의에서 명시적으로 배제**했다.

### 2.4 `redesign` — 재설계·종합

**정의.** 새로 알게 된 것을 **이미 만들어 둔 산출물의 수정**으로 바꾸는 정도.
추가가 아니라 **고쳐 쓰기**가 핵심이다.

- **증거임** — 기존 노드/주석의 내용 수정과 그 변화량, 자기 판단의 철회·번복,
  피드백·관점 전환 이후에 일어난 수정(선후 관계가 있는 것).
- **증거 아님** — 새 노드 추가(그건 `tension_id`), 최초 제출, 서식·위치 변경.
- **관찰변수** — `edit_count`, `edit_magnitude`(편집 거리), `revision_depth`(한 산출물의
  최대 개정 횟수), `informed_edit_ratio`(피드백/전환 직후 수정 비율).
- **지금 측정 가능한가 — 아니오. 유효한 증거가 하나도 없다.** §2.7 (2)(3) 참조.
  이 앱이 목표로 내건 "deeper redesign"이 현재 로그로는 전혀 주장되지 않는다.
- **판별 위험** — 없음. 오히려 지금 가장 비어 있는 칸이다.

### 2.5 `metacognition` — 자기점검

**정의.** 결과를 보기 전에 예측하고, 예측이 빗나갔을 때 **행동을 바꾸는** 정도.

- **증거임** — JOL 예측과 실제의 정합(보정오차), 빗나간 뒤의 수정 행동,
  피드백 요청 시점(막히기 전 vs 제출 직전), 스캐폴드를 필요할 때 여는 판단.
- **증거 아님** — 예측의 적중 그 자체(운), 피드백 요청 횟수, `prediction: "skip"`.
- **관찰변수** — `calibration_error`(|예측−실제| 평균), `overconfidence_bias`(부호 있는 평균),
  `post_error_revision_rate`, `help_timing`(요청 시각 / 과업 경과).
- **지금 측정 가능한가 — 예, 6개 중 유일하게.** `jol.predict`/`jol.outcome`이
  `prediction`·`correct`·`disagreements`를 싣고 `skip`도 구분한다. 봉투만 확장하면 된다.
- **판별 위험** — 문항 수가 적으면 보정오차가 불안정하다. §6 참조.

### 2.6 `collab` — 협업·상호참조

**정의.** 동료의 산출물을 **실제로 보고**, 그것을 자기 산출물에 반영하거나 반박하는 정도.

- **증거임** — 동료 산출물을 연 뒤의 체류, 동료 노드를 근거로 인용, 공개 주석으로
  응답, 동료 견해와 대립각을 세운 흔적.
- **증거 아님** — 동료 활동 알림 수신, 접속 인원 수, 같은 세션에 있었다는 사실.
- **관찰변수** — `peer_view_dwell_ms`, `peer_cite_count`, `public_annotation_ratio`,
  `peer_response_latency`.
- **지금 측정 가능한가 — 아니오.** §2.7 (4) 참조. 현재 `peer.exposure`는 실시간
  구독 콜백에서 발화하므로 "알림이 도착했다"이지 "보았다"가 아니다.
- **판별 위험** — 접속 시간과 혼동된다. 노출을 분모로 두고 반응을 분자로 둬야 한다.

### 2.7 코드에서 확인된 정의 위협 4건

정의를 쓰다가 실물에서 확인한 것들이다. 넷 다 **데이터 공백이 아니라 해석 오류**를
만든다 — 지금 집계하면 틀린 숫자가 나온다.

**(1) 렌즈 전환의 출처가 구분되지 않는다.** `setStakeholder()`는 인자로 출처를 받지
않는데 호출부가 셋이다 — 이해관계자 pill(의도적), 그래프 노드 focus, 그리고
`node.select` 안에서 노드에 stakeholder가 붙어 있으면 자동 호출되는 경로. 셋 다
동일한 `perspective_switched`를 만든다. **맵을 클릭하며 돌아다니면 `lens_shift`가
부풀려진다.** → `setStakeholder(next, source)`로 출처를 받아 페이로드에 싣는다.

**(2) `synthesis_block_revised`는 개정의 증거가 아니다.** `reflection.submit` 직후
무조건 함께 발화한다. 이름과 달리 **최초 제출에도 찍힌다.** 지금 이걸 개정으로
집계하면 개정률이 항상 100%다.

**(3) `annotation.revision`은 죽은 필드다.** 생성 시 `revision: 1`로 하드코딩되고
증가시키는 곳이 없다. 개정 궤적이 존재하지 않는다.

**(2)+(3) 결과 → `redesign`은 현재 유효한 증거가 0건이다.** 이것이 P0에서
`node.edit`과 `annotation.revise`를 최우선에 둔 이유다.

**(4) `peer.exposure`는 열람이 아니다.** Supabase 실시간 구독 콜백에서 발화하므로
학습자가 화면을 보고 있지 않아도, 다른 탭에 있어도 찍힌다. 노출의 상한일 뿐이며
`collab`의 분자로 쓰면 안 된다.

**(참고) `task.step`은 반복 증거가 아니다.** `markTaskProgress`가 케이스당 한 번만
기록하므로(`if (progress[stepId]) return`) 첫 도달 이정표로만 쓴다.

> 이 6개는 **주장 후보**이지 검증된 척도가 아니다. 척도화(신뢰도·타당도)는 데이터가
> 쌓인 뒤 별도로 해야 하며, 그 전까지 대시보드에 점수로 표시하지 않는다. 현재
> 정직하게 측정 가능한 것은 `metacognition` 하나, 부분적으로 `justification`이다.

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
| `perspective_switched` | lens_shift | positive | **`source` 없이는 집계 불가** — §2.7(1). `source: "pill"`만 positive, 나머지는 `none` |
| `lens.change` | — | none | `perspective_switched`와 같은 지점에서 함께 발화하는 중복. 측정에 쓰지 않는다 |
| `node.add` | tension_id | positive | 갈등 명명 여부를 구분할 필드 필요 |
| `node.select` | tension_id | exposure | 선택은 주목, 후속 행동이 수행 |
| `annotation.created` | justification | positive | `stance`가 쟁점/질문이면 tension_id도 |
| `annotation.scaffold_opened` | justification | **support_use** | |
| `reflection.submit` | justification | positive | 이미 관찰변수 내장 — `anchor_gain` 오늘도 계산됨 |
| `synthesis_block_revised` | — | none | **개정 증거 아님** — 최초 제출에도 발화, §2.7(2) |
| `feedback.requested` | metacognition | support_use | 요청 시각을 `help_timing`으로 |
| `feedback.shown` | — | exposure | 분모 |
| `jol.predict` / `jol.outcome` | metacognition | positive | 보정오차 = \|예측−실제\|. `skip`은 `none`으로 분리 |
| `peer.exposure` | collab | exposure | **열람 아님** — 실시간 알림 수신, §2.7(4). 분모로만 |
| `question.ask` / `question.answer` | justification | positive/exposure | |
| `export.onepager` | redesign | positive | 종료 산출물 |
| `session.heartbeat`, `visibility.change` | — | none | 시간 분모 |
| 나머지 UI 이벤트(`view.switch`, `theme.change`, `density.change`, `drawer.open`, `map.*`) | — | none | 조건 통제용 |

### 4.2 신규 — 우선순위 순

**P0-a — 기존 이벤트 수정 (신규보다 먼저)**

새 이벤트를 붙이기 전에 §2.7의 해석 오류부터 고친다. 이건 데이터가 없는 게 아니라
**틀린 데이터가 쌓이는** 문제라 우선한다.

| 수정 | 내용 |
| --- | --- |
| `setStakeholder(next, source)` | 호출부 3곳에서 `"pill"` / `"graph_focus"` / `"node_select"` 전달 → `perspective_switched.source` |
| `lens.change` 제거 또는 `none` 고정 | `perspective_switched`와 완전 중복 |
| `synthesis_block_revised` | 실제 개정일 때만 발화하도록 조건화, 아니면 이름을 사실에 맞게 변경 |
| `annotation.revision` | 하드코딩 `1` 해제, 개정 시 증가 |
| `peer.exposure` | 문서·필드명에서 열람이 아님을 명시(`notified` 계열로) |

**P0-b — 이게 없으면 핵심 주장을 못 한다**

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
| `peer.view` | collab | `peer_run_id`, `dwell_ms`, `visible` — 알림이 아닌 **실제 열람** |

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
