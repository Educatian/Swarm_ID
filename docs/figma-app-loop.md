# DTS Figma ↔ App 운영 루프

Figma 파일 `4WIyk1eds5QF6B8fV9fpTU`를 UI/UX 설계 기준으로 사용한다.

## 적용 순서

1. `preview.html`과 `app.js`에서 역할·뷰·상태·반응형 변형을 확인한다.
2. 실행 중인 화면을 Figma에 캡처하고, 캡처 노드 이름을 `Current · <route/state>`로 고정한다.
3. Figma `01 · UX Audit & Decisions`에서 정보 우선순위, 텍스트 잘림, 간격, 접근성, 모바일 작업 맥락을 검토한다.
4. Figma `02 · Improved Full App`의 개선안을 기준으로 `styles.css`/`app.js`에 반영한다.
5. 데스크톱·모바일 브라우저를 확인하고 `node scripts/smoke-usability-upgrade.mjs`를 실행한다.
6. 변경된 화면을 다시 캡처해 Figma의 Current 캡처와 비교하고, 불일치가 있으면 3단계로 되돌아간다.

## 현재 커버리지

| 앱 화면 | Figma Current 노드 |
| --- | --- |
| 랜딩 | `18:2` |
| 학습자 홈 | `19:2`, 모바일 `37:2` |
| 네트워크 | `33:2` |
| 관점 | `31:2` |
| 상충 관계 | `32:2` |
| 실험 공간 | `43:2` |
| 리포트 | `34:2` |
| 교수자 개요/관리 | `35:2`, `36:2` |

## 파일 구조

작업 페이지는 `17:2 · 03 · Full App UI UX Loop`이고, 그 아래 섹션은 다음과 같다.

| 섹션 | 이름 | 주요 노드 |
| --- | --- | --- |
| `17:3` | 00 · Current Product Captures | 위 표의 Current 캡처 |
| `17:4` | 01 · UX Audit & Decisions | 감사 보드 `50:2`–`50:19`, `51:4`–`51:9` |
| `17:5` | 02 · Improved Full App | 구현 기록 `52:2`–`52:28`, 교사 관심사 시각화 제안 `46:2` |
| `17:6` | 03 · DTS Design System | 운영 규칙 보드 `44:2 · Figma ↔ App Operating Loop` |

정리된 교수자 콘솔 시안은 `26:41 · Instructor · Clean operations`다.

교수자 콘솔 감사는 별도 파일 `uumUXm2LdFzra2VM5UDxiJ`(DTS Instructor Console — Hyeji UX Audit)에도 있다. 두 파일이 갈라지지 않도록, 화면 구조의 기준은 항상 `4WIyk1eds5QF6B8fV9fpTU`로 둔다.

## 검증 기준

- 모든 화면에서 텍스트가 잘리지 않고 주요 CTA가 한눈에 보여야 한다.
- 모바일에서는 현재 과업과 다음 행동을 우선 노출한다.
- Figma와 브라우저의 화면 구조·간격·상태가 일치해야 한다.
- 코드 변경 없이 Figma만 수정하거나, Figma 확인 없이 코드를 임의 수정하지 않는다.
