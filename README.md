# vibe-project-2026-LEE_SUNG_JE
바이브 코딩 프로젝트 1

---

# 에이전트 AI 필독

> **이 파일을 가장 먼저 읽는다.** 읽은 뒤 바로 `spec-kit/agents.md`를 끝까지 읽고, 그다음에 개발을 시작한다.
> `agents.md`는 협상 대상이 아닌 **계약**이다. 이 README는 그 계약으로 들어가는 안내문이다.

---

## 1. 시작 순서 (MUST)

1. 이 `README.md`를 읽는다.
2. `task-history/task.md`가 있으면 읽어 이전 작업과 현재 구현 상태를 확인한다. 완료된 작업을 다시 하지 말고, 새 작업은 기존 상태에서 이어서 진행한다.
3. **`spec-kit/agents.md`를 전부 읽는다.** (PART A 디자이너 규약 · PART B 개발자 규약 · PART C 작업 프로토콜 · PART D 타겟 사이트 규약)
4. 사용자의 요청을 한 번 요약하고, **수정할 파일 / 건드리지 않을 파일**을 밝힌다. (agents.md C1)
5. 기존 토큰·컴포넌트·모듈을 먼저 조사한 뒤 작업한다.
6. 작업이 끝나면 agents.md **C3 보고 형식**과 **§5 체크리스트**로 자가 검수한다. 후속 작업에 필요한 변경 상태와 검증 결과는 `task-history/task.md`에 갱신한다.

> `agents.md`를 읽지 않은 채 코드를 쓰지 않는다.

---

## 2. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 기술 스택 | HTML5 / CSS3 / Vanilla JavaScript (ES2022+), 프레임워크·번들러 없음 |
| 기준 수준 | 15년차 시니어 디자이너 · 15년차 시니어 개발자 |
| 타겟 사이트 | https://kr.nothing.tech/ — **디자인(색·서체·박스 수치)은 동일**, **내부 레이아웃은 D4 박스 구조로 새로 구성** |
| 규약 문서 | `spec-kit/agents.md` |

---

## 3. 규칙 우선순위

충돌 시 위에서부터 따른다.

1. 사용자의 명시적 요청
2. `agents.md`의 MUST 규칙
3. 접근성 · 보안 · 성능
4. `agents.md`의 SHOULD 규칙
5. 에이전트의 개인적 취향 (가장 낮음)

- 일반 규칙(PART A·B)과 타겟 사이트 규칙(PART D)이 충돌하면 **PART D가 우선**한다.
- 사용자 요청이 MUST와 충돌하면 임의로 진행하지 말고, **충돌 사실과 대안을 먼저 알린다.**

---

## 4. 꼭 기억할 핵심 규칙 (요약)

> 전체 내용과 예외는 `agents.md`가 기준이다. 아래는 빠른 확인용이다.

**레이아웃 (D4)**
- 구조: `겉박스(header / section / footer) > .inner-box > .partition-box > .content-box`
- `body`의 직계 자식은 `header`, `main`, `footer`뿐. `main`의 직계 자식은 `section`뿐.
- 속박스 이름은 **`.inner-box`만** 사용. `max-width: 1792px`, 중앙 정렬, 좌우 패딩 `16 / 24 / 40 / 64px`.
- **파티션 박스는 Flex만.** Grid는 `.content-box` 안에서만 허용.
- 모바일 퍼스트, **`768px`에서 가로 전환**. 미디어 쿼리는 `min-width`만.

**디자인 토큰 (D1~D3)**
- 색은 Greyscale + Accent 3종(Red / Yellow / Blue). 소스에 `#hex` 직접 사용 금지.
- 반경은 `0 / 4px / 8px`만(정원형 예외). pill 금지. 그림자는 `--shadow-sm`, `--shadow-float`만.
- 간격은 `--space-{px}` 토큰만. 서체는 Ndot(제품명) · NType82(헤드라인·본문) · LatteraMonoLL(라벨) 역할 고정.
- `lang="ko"` 텍스트에는 굵기 100 금지(400 사용).

**코드 (PART B)**
- 인라인 `style` · 인라인 이벤트 · `!important` · id 선택자 · `transition: all` 금지.
- CSS는 BEM + 단일 클래스. JS는 ES 모듈, `js-*` / `data-*` 훅만 사용, 전역 변수 금지.
- 접근성(키보드, `focus-visible`, `prefers-reduced-motion`)은 기본 품질이다.

---

## 5. 사용자에게 먼저 물어봐야 하는 것

`agents.md`의 **D10(확인 필요 항목)** 은 확정값이 아니다. 해당 값이 필요한 작업이면 **임의로 정하지 말고 사용자에게 확인**한다. 특히 아래는 작업 초기에 자주 걸린다.

- **폰트 파일**(Ndot / NType82 / LatteraMonoLL) 보유 여부 → 없으면 폴백으로 구현하고 파일 제공을 요청한다. 원본 CDN 직접 링크 금지.
- **메인 페이지 HTML**: 받은 HTML은 빈 페이지뿐이라 요소별 클래스 매핑을 확정할 수 없다.
- 헤더 높이 · 버튼/입력창 반경 · 포커스 링 색 · 다크 모드 기본값 · 푸터 배경 등.

질문은 **한 번에 모아서** 한다.

---

## 6. 금지 사항 (요약)

- 요청하지 않은 전체 파일 재작성, 범위 밖 파일 수정
- 기존 동작을 확인 없이 삭제
- 승인 없이 외부 라이브러리 · CDN · 프레임워크 추가 (Lenis 포함)
- D1에 없는 색, D3 외의 그림자·반경 추가
- 플레이스홀더(`TODO`, `...`)를 남긴 채 “완료” 보고
- 검증하지 않고 “완료” 보고

---

## 7. 폴더 구조

```
project-root/
├─ README.md                  # 이 파일 (가장 먼저 읽는다)
├─ task-history/
│  └─ task.md                 # 이전 작업 요약 및 다음 작업 인계
├─ spec-kit/
│  └─ agents.md               # 프로젝트 규약 (계약)
├─ index.html
├─ pages/
├─ css/
│  ├─ base/                   # tokens.css · reset.css · typography.css
│  ├─ layout/                 # box.css(.inner-box, .partition-box) · header · footer
│  ├─ components/
│  ├─ pages/
│  ├─ utilities.css
│  └─ main.css                # @import 진입점 (순서 고정)
├─ js/
│  ├─ main.js                 # 초기화만
│  ├─ modules/
│  ├─ utils/
│  └─ config.js
└─ assets/
   ├─ images/
   ├─ icons/
   └─ fonts/
```

- CSS 로딩 순서: `tokens → reset → typography → layout → components → pages → utilities`
- 파일이 300줄을 넘으면 분리를 검토한다.

---

## 8. 작업 완료 보고 형식

```
## 변경 요약
- (무엇을, 왜 바꿨는지)

## 변경 파일
- path/to/file — 변경 내용

## 검증 결과
- 콘솔 에러: 없음
- 반응형: 375 / 768 / 1280 확인
- 키보드/접근성: 확인

## 가정 및 남은 이슈
- (있다면)
```

---

## 9. 규약 변경

규약을 바꿔야 한다면 **변경 사유와 영향 범위를 먼저 제안**하고, 사용자 승인 후에만 `spec-kit/agents.md`를 수정한다. 수정 이력은 agents.md 부록 표에 기록한다.
