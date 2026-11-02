# PROJECT CONVENTIONS — 웹 프로젝트 필수 규약

> 대상: 본 프로젝트에서 작업하는 모든 에이전트 AI
> 기술 스택: **HTML5 / CSS3 / Vanilla JavaScript (ES2022+)**
> 기준 수준: **15년차 시니어 디자이너 · 15년차 시니어 개발자**
> 타겟 사이트: **https://kr.nothing.tech/** — 디자인은 동일, 내부 레이아웃은 별도 규칙 → **PART D 참조**
> 이 문서는 협상 대상이 아니라 **계약**이다. 작업 전 반드시 읽고, 작업 후 §5 체크리스트로 자가 검수한다.

---

## 0. 문서 사용법

### 0.1 규칙 레벨
| 표기 | 의미 |
|------|------|
| **MUST / MUST NOT** | 예외 없이 지킨다. 어길 경우 작업 미완료로 간주한다. |
| **SHOULD / SHOULD NOT** | 특별한 이유가 없으면 지킨다. 어길 경우 사유를 주석 또는 응답에 명시한다. |
| **MAY** | 선택 사항. |

### 0.2 우선순위
충돌 시 다음 순서로 판단한다.

1. 사용자의 명시적 요청
2. 본 문서의 MUST 규칙
3. 접근성 · 보안 · 성능
4. 본 문서의 SHOULD 규칙
5. 에이전트의 개인적 취향 (**가장 낮음**)

> 사용자 요청이 MUST 규칙과 충돌하면, 임의로 진행하지 말고 충돌 사실과 대안을 먼저 알린다.

### 0.3 용어
- **토큰(Token)**: 색상·간격·폰트 등 디자인 값을 CSS 변수로 정의한 것.
- **컴포넌트**: 재사용 가능한 UI 단위 (버튼, 카드, 모달 등).
- **하드코딩**: 토큰이나 상수를 거치지 않고 값을 직접 쓰는 행위.

### 0.4 일반 규칙과 특화 규칙의 관계 【추가】
- PART A·B는 **일반 규칙**, PART D는 **타겟 사이트(Nothing KR) 특화 규칙**이다.
- 같은 항목이 충돌하면 **PART D가 우선**한다.
- 사이트와 충돌하던 일반 규칙은 본문에서 직접 고치고 `【수정】`을, 새로 생긴 규칙에는 `【추가】`를 붙였다.
- PART D에서 `(확인 필요)`가 붙은 값은 사이트에서 아직 직접 검증하지 못한 값이다. 에이전트는 임의로 확정하지 말고 사용자에게 확인을 요청한다.

---

## 1. 공통 원칙 (Designer · Developer 모두 적용)

1. **일관성 > 창의성.** 새로 만들기 전에 기존 토큰/컴포넌트를 먼저 찾는다.
2. **단일 출처(Single Source of Truth).** 색상, 간격, 문구, 설정값은 한 곳에서만 정의한다.
3. **모바일 퍼스트.** 가장 작은 화면에서 먼저 설계·구현하고 확장한다.
4. **접근성은 기능이다.** 나중에 붙이는 옵션이 아니라 기본 품질이다.
5. **작게 만들고, 바로 검증한다.** 한 번에 대규모로 작성하지 않는다.
6. **요청하지 않은 변경 금지.** 범위 밖의 파일·스타일·구조를 임의로 수정하지 않는다.
7. **추측 금지.** 요구사항이 모호하면 가정 사항을 명시하거나 질문한다.
8. **가독성이 곧 유지보수성.** 영리한 코드보다 읽기 쉬운 코드를 택한다.

---

# PART A. DESIGNER 규약

> 15년차 디자이너의 관점: 화려함보다 **일관성, 위계, 가독성, 사용자 목적 달성**을 우선한다.
> 디자인 결정은 반드시 **토큰**으로 표현되어야 하며, 개발에 그대로 전달 가능해야 한다.

## A1. 디자인 시스템 (Design Tokens)

### A1.1 토큰 우선 (MUST)
- 모든 색상·폰트·간격·반경·그림자·z-index·모션 값은 **토큰으로 정의**한다.
- 토큰에 없는 값을 쓰려면 **먼저 토큰을 추가**한다. 일회성 값(매직 넘버) 금지.
- 토큰은 `css/base/tokens.css`의 `:root`에 **한 번만** 정의한다.

### A1.2 색상 (MUST) 【수정】
- 팔레트는 **Greyscale 스케일(흰색 ~ `#040404`) + Accent 3종(Red / Yellow / Blue)** 으로 한정한다. 상세 값은 **D1**.
- 화면 면적의 대부분은 **무채색**이다. Accent는 **신호용**(포커스, 강조 CTA, 알림·오류, 다크 모드 포인트)으로만 쓰고 장식에 쓰지 않는다. 한 화면에서 활성 Accent는 **1종 이하**(SHOULD).
- 일반 규칙의 60-30-10 법칙, Primary 50~900 스케일, Success/Warning/Danger/Info 세트는 **본 프로젝트에서 폐기**한다.
- 색은 **RGB 채널 변수**(`--greyscale-900: 89 90 90`)로 정의하고 `rgb(var(--greyscale-900) / <alpha>)`로 쓴다(사이트 방식, 투명도 조절이 쉬움). 소스에 `#hex`를 직접 쓰지 않는다.
- 위계는 색보다 **서체 · 크기 · 여백 · 사진**으로 만든다.
- 의미 전달을 **색상에만 의존하지 않는다**(아이콘·텍스트·테두리 두께 병행).
- **명도 대비(WCAG AA)**: 일반 텍스트 **4.5:1 이상**, 큰 텍스트·UI 경계 **3:1 이상**. 흰 배경 위 텍스트는 `--greyscale-800`(`#6F7070`)보다 밝은 회색을 쓰지 않는다.
- **다크 모드를 지원한다**(`.dark` / `.light` 클래스 방식). 토큰은 시맨틱 이름으로 정의하고 값만 교체한다.

```css
:root {
  --greyscale-white: 255 255 255;
  --greyscale-black: 4 4 4;
  --accent-yellow: 255 199 0;
}
body { background: rgb(var(--greyscale-white)); color: rgb(var(--greyscale-black)); }
```

### A1.3 타이포그래피 (MUST) 【수정】
- 폰트 패밀리는 **역할별 3계열**로 고정한다(일반 규칙의 “최대 2종”을 수정). 상세는 **D2**.
  - **Ndot** (`Ndot-Regular` / `Ndot-Bold`) — 제품명·로고·디스플레이 숫자
  - **NType82** (`NType82-Regular` / `NType82-Headline`) — 헤드라인·본문
  - **LatteraMonoLL** — 라벨·콜아웃·캡션
- **타입 스케일**은 D2 표에 있는 토큰만 사용한다. 그 외 크기 금지.
- 본문(`body-*`) 기본 **16px**. 보조 텍스트는 14px(`body-sm`), UI 라벨은 11~16px(`mono-*`)까지 허용한다. 입력창은 **16px 이상**(iOS 자동 확대 방지).
- **굵기는 `@font-face`에 선언된 값과 일치**시킨다(Ndot-Regular `55`, Ndot-Bold `57`, NType82 `400`, 헤드라인 얇은 스타일 `100`). 임의의 굵기(500/600/700) 금지.
- **한국어(`lang="ko"`)·중국어 텍스트는 굵기 100을 쓰지 않고 400으로 강제**한다(사이트 규칙). 일본어·아랍어는 300.
- 행간은 D2 표의 값을 따른다.
- 한 줄 길이: 본문 **한글 기준 약 30~45자, 영문 45~75자**(`max-width: 65ch`, 대형 화면 `85ch`까지).
- 본문 정렬은 왼쪽 정렬. 긴 문단의 가운데·양쪽 정렬 금지.
- 한글 줄바꿈은 `word-break: keep-all; overflow-wrap: break-word;`를 기본으로 한다.

### A1.4 간격 (Spacing) (MUST) 【수정】
- 간격은 **4px 기반 토큰**(`--space-{px}`)만 사용한다. 사이트에서 확인된 값만 정의한다(D3.1).
- 용도별 구간: **컴포넌트 내부 `4~28px` / 거터 `16·24·40·64px` / 섹션 세로 `80·96·112·120·128·144·160px`, 대형 섹션(`md` 이상) `208·240·256px`**. 【수정】 (CSS 전수 검증, D3.1)
- 관련된 요소는 **가깝게**, 무관한 요소는 **멀게** (근접성 원칙). 내부 간격 ≤ 외부 간격.
- 토큰에 없는 임의의 px 값(예: 13px, 27px) 사용 금지.
- 요소 사이 간격은 `gap`을 우선한다. 섹션 세로 간격은 `padding-block`으로 만든다. `margin`은 `margin-inline: auto`(속박스 중앙 정렬)와 섹션 외곽 여백 변수(`--wrapper-mt/mb`)에 한해 쓴다.

### A1.5 반경·그림자·테두리 (MUST) 【수정】
- `border-radius`는 **`0 / 4px / 8px`** 3단계가 기본이다. 정원(1:1) 요소 전용 `--radius-full`(`9999px`)과 스크롤바 썸 `999px`만 예외다【수정】. 상세는 **D3.2**.
  - `0` : 풀블리드 사진·영상, 직각 면
  - `4px` : 작은 UI(태그·칩·소형 컨트롤)
  - `8px` : 카드, 이미지 프레임, 패널
- **pill(가로로 긴 알약) 형태 금지.** (원본 CSS에 `rounded-full`이 존재하므로 정원형 요소의 사용처는 D10-12에서 확인한다.)
- 그림자는 **2종만**(`shadow-sm`, 플로팅 패널용 소프트 섀도) + 반투명 **프로스트(blur 45px) 면**을 쓴다. 그 외 그림자 금지. 상세는 **D3.3**.
- 테두리는 **1px**이 기본이고, 강조(탭·밑줄)는 **2px**. 색은 `--color-border`(`#e5e7eb`) 또는 Greyscale 토큰.

### A1.6 Z-index (MUST)
- z-index는 **토큰 레이어**로만 사용한다【수정】: `base 0 / raised 10 / dropdown 20 / sticky 30 / overlay 40 / modal 50 / toast 60` (D3.6, 사이트 값).
- `z-index: 9999` 류의 값 금지.

---

## A2. 레이아웃 & 반응형

### A2.1 브레이크포인트 (MUST) 【수정】
| 이름 | 최소 너비 | 대상 |
|------|-----------|------|
| (기본) | 0 | 모바일 |
| `xs` | 400px | 큰 모바일 |
| `sm` | 640px | 소형 태블릿 |
| `md` | 768px | 태블릿 (**데스크톱 레이아웃 전환점**) |
| `lg` | 1024px | 노트북 |
| `xl` | 1280px | 데스크톱 |
| `2xl` | 1536px | 와이드 |
| `3xl` | 1792px | 초와이드 (속박스 최대폭과 동일) |

- **`min-width` 기반 미디어 쿼리**만 사용한다(모바일 퍼스트).
- 위 값 외의 브레이크포인트를 임의로 추가하지 않는다. (914px은 사이트 컨테이너 정의에만 있고 레이아웃 전환에는 쓰이지 않는다.)

### A2.2 컨테이너 & 박스 구조 (MUST) 【수정】
- 일반 규칙의 12컬럼 그리드·1200px 컨테이너는 **폐기**한다. 레이아웃은 **겉박스 > 속박스(`.inner-box`) > 파티션 박스** 구조로만 만든다. 상세는 **D4**.
- 속박스 최대 너비는 **1792px**(사이트 `max-w-screen-3xl`), 좌우 패딩은 반응형 **16 / 24 / 40 / 64px**.
- 가로 스크롤이 발생하면 **결함**이다.

### A2.3 시각적 위계 (MUST)
- 한 화면에 **주 CTA는 1개**. 보조 CTA는 시각적으로 한 단계 낮춘다.
- 위계는 **크기 > 굵기 > 색상 > 여백** 순으로 만든다.
- 페이지당 `h1`은 하나, 섹션 구조는 정보 구조(IA)와 일치해야 한다.
- 【수정】 섹션 간 세로 간격은 섹션(겉박스)의 `padding-block`으로 만든다(`96 / 112 / 144 / 160 / 256px`, D3.1). 풀블리드 미디어 밴드는 패딩 0으로 이어 붙인다.

---

## A3. 컴포넌트 디자인 규칙

### A3.1 공통 상태 정의 (MUST)
모든 인터랙티브 컴포넌트는 아래 상태를 **반드시 디자인·구현**한다.

`default` · `hover` · `focus-visible` · `active` · `disabled` · (해당 시) `loading` · `error` · `selected`

- `focus-visible` 스타일 제거 금지. 대체 시 **3:1 이상 대비의 2px 이상 윤곽선**을 제공한다.
- `hover`는 터치 기기에서 의존하지 않는다(`@media (hover: hover)` 안에서만 정의).

### A3.2 버튼 (MUST) 【수정】
- 변형: **`solid-dark`(검정 채움) / `solid-light`(흰 채움) / `accent`(노랑 채움, hover `#F4E300`) / `ghost`(투명)**. 상세는 **D5**.
- 높이는 **40 / 44 / 56px** 3단계(원본에서 확인된 높이 `h-[2.5rem]`·`h-10`, `h-11`, `h-14`). 기본 **44px**. 터치 영역은 항상 **44px 이상**을 유지한다. (원본에는 `h-9`=36px, `h-12`=48px도 있으나 컨트롤 용도는 확인되지 않아 채택하지 않는다.)
- 라벨은 **LatteraMonoLL**(`mono-sm`~`mono-md`)이다. 버튼 라벨의 대문자 여부는 원본 HTML 없이는 확정할 수 없어(D10-6) `type-callout`(원본이 대문자)을 쓸 때만 대문자로 하고, 그 외에는 원문 표기를 둔다【수정】. 소스 HTML에는 항상 원문 표기를 둔다.
- 아이콘 단독 버튼에는 `aria-label` 필수.
- 라벨은 **동사 중심**(“Discover”, “Sign up”). “확인”, “클릭” 같은 모호한 문구 지양.
- 비활성은 `opacity: 0.3`(원본 `disabled:opacity-30`)【수정】 + `cursor: not-allowed`. 로딩 중에는 중복 클릭을 막고 상태를 표시한다.

### A3.3 폼 (MUST)
- 모든 입력에는 **보이는 `<label>`**을 둔다. placeholder를 라벨 대용으로 쓰지 않는다.
- 오류 메시지는 **필드 바로 아래**, 원인과 해결 방법을 함께 안내한다(“이메일 형식이 올바르지 않습니다. 예: name@example.com”).
- 필수 표시, 도움말, 오류 상태를 모두 설계한다.
- 입력 유형에 맞는 `type`, `inputmode`, `autocomplete`를 지정한다.

### A3.4 내비게이션 (MUST)
- 현재 위치를 시각적으로 표시한다(`aria-current="page"`).
- 모바일은 햄버거 메뉴/드로어 패턴, 열림·닫힘 모두 **키보드와 ESC**로 조작 가능해야 한다.
- 1차 메뉴 항목은 **7개 이하**를 권장한다.

### A3.5 빈 상태·에러·로딩 (MUST)
- 데이터가 없는 상태(Empty), 오류 상태(Error), 로딩(Skeleton/Spinner)을 **반드시 설계**한다.
- 오류 문구는 사용자를 탓하지 않고 **다음 행동**을 제시한다.

### A3.6 모달·토스트 (SHOULD)
- 모달은 꼭 필요한 경우에만. 닫기 버튼 + ESC + 배경 클릭 닫기, 포커스 트랩 제공.
- 토스트는 3~5초 후 자동 소멸하되, 중요한 메시지는 사용자가 닫을 때까지 유지.

---

## A4. 이미지·아이콘·모션

### A4.1 이미지 (MUST)
- 모든 이미지는 **비율(aspect-ratio)** 을 지정해 레이아웃 시프트를 막는다.
- 정보 전달 이미지는 의미 있는 `alt`, 장식 이미지는 `alt=""`.
- 포맷: **WebP/AVIF 우선**, 아이콘·로고는 **SVG**.
- 텍스트가 이미지 위에 올라갈 때는 **오버레이 또는 그라데이션**으로 대비 4.5:1을 확보한다.
- 이미지 안에 **텍스트를 굽지 않는다**(반응형·접근성·번역 불가).

### A4.2 아이콘 (MUST)
- 아이콘 세트는 **한 종류**만 사용한다(선 굵기·모서리 스타일 통일).
- 크기 토큰: `16 / 20 / 24 / 32px`.
- 의미가 불분명한 아이콘은 **텍스트 라벨을 병행**한다.

### A4.3 모션 (MUST)
- 모션은 **의미(상태 변화·주의 유도·공간 이해)** 가 있을 때만 사용한다. 장식용 과한 애니메이션 금지.
- 【수정】 시간·이징은 사이트 값을 따른다: `100ms / 150ms / 200ms / 500ms`, `cubic-bezier(.4, 0, .2, 1)` (D7).
- `transform`·`opacity` 위주로 애니메이션한다. `width/height/top/left` 애니메이션 금지.
- **`prefers-reduced-motion: reduce`를 반드시 존중**한다.
- 자동 재생 캐러셀·무한 반복 애니메이션은 정지 수단을 제공하거나 사용하지 않는다.

---

## A5. 콘텐츠·카피 (SHOULD)
- 톤앤매너(존댓말/반말, 전문적/친근함)를 **프로젝트 시작 시 1회 정의**하고 유지한다.
- 버튼·제목·오류 문구의 **어휘를 통일**한다(예: “지원하기”와 “신청하기” 혼용 금지).
- 로렘입숨(Lorem ipsum) 대신 **현실적인 더미 데이터**를 사용한다.
- 날짜·숫자·통화 표기 형식을 통일한다(예: `2026.11.02`, `1,000원`).

---

## A6. 디자이너 산출물 체크리스트
- [ ] 모든 값이 토큰으로 표현되었는가?
- [ ] 모바일 · 태블릿 · 데스크톱 3개 뷰포트가 정의되었는가?
- [ ] 모든 인터랙티브 요소의 상태(hover/focus/disabled 등)가 있는가?
- [ ] 명도 대비 AA를 통과하는가?
- [ ] Empty / Error / Loading 상태가 있는가?
- [ ] 한 화면에 주 CTA가 1개인가?
- [ ] 이미지·아이콘의 규격과 대체 텍스트 방침이 있는가?

---

# PART B. DEVELOPER 규약

> 15년차 개발자의 관점: **읽기 쉽고, 바꾸기 쉽고, 깨지지 않는** 코드를 쓴다.
> 프레임워크 없이도 구조·책임 분리·일관성으로 규모에 대응한다.

## B1. 프로젝트 구조

### B1.1 디렉터리 (MUST)
```
project-root/
├─ index.html                 # 진입 페이지
├─ pages/                     # 추가 페이지 (about.html 등)
├─ css/
│  ├─ base/
│  │  ├─ tokens.css           # 디자인 토큰 (:root 변수)
│  │  ├─ reset.css            # 리셋/노멀라이즈
│  │  └─ typography.css       # 기본 타이포
│  ├─ layout/                 # box.css(inner-box, partition-box), header, footer (D4)
│  ├─ components/             # button, card, modal, form ...
│  ├─ pages/                  # 페이지 전용 스타일 (최소화)
│  ├─ utilities.css           # 소수의 유틸리티 클래스
│  └─ main.css                # @import 진입점 (순서 고정)
├─ js/
│  ├─ main.js                 # 진입점 (초기화만)
│  ├─ modules/                # 기능 단위 모듈 (nav.js, modal.js ...)
│  ├─ utils/                  # 순수 함수 (dom.js, format.js ...)
│  └─ config.js               # 상수/설정
├─ assets/
│  ├─ images/
│  ├─ icons/
│  └─ fonts/
└─ README.md
```
- 파일 하나가 **300줄을 넘기면 분리**를 검토한다.
- HTML 안에 **인라인 `<style>`, 인라인 `style=""`, 인라인 이벤트(`onclick=""`)를 쓰지 않는다**(MUST NOT). 단, JS가 동적으로 계산하는 값은 CSS 변수 주입으로 처리한다.
- 관심사 분리: **구조=HTML / 표현=CSS / 동작=JS**.

### B1.2 네이밍 규칙 (MUST)
| 대상 | 규칙 | 예시 |
|------|------|------|
| 파일·폴더 | `kebab-case`, 영문 소문자 | `main-nav.js` |
| CSS 클래스 | **BEM** `block__element--modifier` | `card__title--large` |
| CSS 변수 | `--category-name` | `--color-primary`, `--space-4` |
| JS 변수·함수 | `camelCase` | `getUserList` |
| JS 상수 | `UPPER_SNAKE_CASE` | `MAX_RETRY` |
| JS 클래스 | `PascalCase` | `ModalController` |
| JS 훅용 클래스/속성 | `js-` 접두사 또는 `data-` 속성 | `.js-menu-toggle`, `data-action="open"` |
| boolean | `is / has / can` 접두사 | `isOpen`, `hasError` |
| 상태 클래스 | `is-` 접두사 | `is-active`, `is-hidden` |

- 한글·약어 남발 금지, 의미를 드러내는 **영어 이름**을 사용한다. (`btn1`, `div2`, `temp` 금지)
- **스타일링 클래스와 JS 훅을 분리**한다. JS는 `js-*` / `data-*`로만 요소를 선택한다.

---

## B2. HTML 규칙

### B2.1 문서 기본 (MUST)
- `<!DOCTYPE html>`, `<html lang="ko">`, `<meta charset="UTF-8">`, `<meta name="viewport" content="width=device-width, initial-scale=1">` 필수.
- `<title>`은 페이지마다 **고유**하게, `<meta name="description">` 작성.
- 기본 OG 메타(`og:title`, `og:description`, `og:image`)를 작성한다(SHOULD).
- 들여쓰기 **2칸 스페이스**, 속성은 **쌍따옴표**, 태그·속성명은 **소문자**.

### B2.2 시맨틱 마크업 (MUST)
- 구조: `header / nav / main / section / article / aside / footer`를 목적에 맞게 사용. 페이지당 `main`은 1개.
- `div`/`span`은 **의미 있는 태그가 없을 때만** 사용한다.
- 제목 레벨(`h1~h6`)은 **순서를 건너뛰지 않는다**. 스타일 목적으로 제목 태그를 고르지 않는다.
- 클릭 시 **동작**은 `<button>`, **이동**은 `<a href>`. `div`/`a`에 `onclick`으로 버튼 흉내 내기 금지.
- 목록 형태의 콘텐츠는 `ul/ol/li`, 표 형태는 `table`(+`caption`, `th scope`).
- 폼 요소는 `label[for]` 또는 감싸기로 반드시 연결한다.

### B2.3 접근성 (MUST)
- 키보드만으로 **모든 기능**을 사용할 수 있어야 한다(Tab / Shift+Tab / Enter / Space / ESC / 방향키).
- 포커스 순서는 DOM 순서 = 시각적 순서. 양수 `tabindex` 금지.
- 페이지 상단에 **본문 바로가기(Skip link)** 제공.
- ARIA는 **네이티브 요소로 불가능할 때만** 보강한다. (첫 번째 규칙: ARIA를 쓰지 않는 것이 최선)
- 상태 표현: `aria-expanded`, `aria-controls`, `aria-current`, `aria-live`, `aria-hidden`을 정확히 사용한다.
- 모달 오픈 시 포커스 이동·포커스 트랩·닫힌 후 포커스 복귀.
- 동영상·오디오는 자막/대체 수단을 제공한다.

### B2.4 성능 관련 HTML (MUST)
- `<img>`에는 `width`/`height`(또는 CSS `aspect-ratio`), `loading="lazy"`(첫 화면 제외), `decoding="async"`.
- 첫 화면 핵심 이미지(LCP)는 `loading="eager"` + `fetchpriority="high"`.
- 스크립트는 `<script type="module" src="...">` 또는 `defer`. `<head>` 내 동기 스크립트 금지.
- 폰트는 `preload` + `font-display: swap`.

---

## B3. CSS 규칙

### B3.1 작성 원칙 (MUST)
- **모바일 퍼스트**: 기본 스타일 = 모바일, `@media (min-width: …)`로 확장.
- 모든 색상·간격·폰트·반경·그림자·z-index는 **`var(--token)` 사용**. 하드코딩 금지.
- **BEM + 단일 클래스 선택자** 원칙. 명시도(specificity)를 낮게 유지한다.
  - `id` 선택자 스타일링 금지, **`!important` 금지**(유틸리티·외부 라이브러리 덮어쓰기 예외 시 주석 필수).
  - 선택자 중첩은 **최대 3단계**.
- 태그 선택자 스타일링은 `reset.css`·`typography.css`에서만 허용한다.
- 컴포넌트 CSS는 **자신의 내부만** 스타일링한다. 외부 레이아웃(margin 등)은 **부모/레이아웃 클래스**가 담당한다.

### B3.2 레이아웃 (MUST) 【수정】
- **파티션 박스는 Flexbox만 사용한다. Grid로 만들지 않는다.** Grid는 파티션 박스 **내부의 내용박스(`.content-box`)에서 필요할 때만** 적용한다. `float`, 테이블 레이아웃 금지. 상세는 **D4**.
- (참고) 원본 사이트는 12컬럼 체계(`grid-cols-12`, `col-span-1~12`를 `md`·`lg`·`xl`에서 재지정)와 `grid-cols-2·3·5·6` 등을 섞어 쓴다. 모바일 4컬럼은 CSS에서 확인되지 않아 삭제했다【수정】. 본 프로젝트는 **같은 시각 결과를 flex 파티션과 n-up 폭 계산식(D4.5)으로 만든다.**
- 간격은 `gap`을 우선 사용(마진 상쇄·마지막 요소 예외 처리 방지).
- 고정 px 너비 지양 → `%`, `min()`, `max()`, `clamp()`, `flex-basis`, `calc()` 활용.
- 모든 요소 `box-sizing: border-box`.
- 높이는 **가급적 고정하지 않는다**(콘텐츠에 의해 결정). 풀스크린 밴드는 `100vh` 대신 `100svh`/`100dvh`를 사용한다. 고정 높이 예외: 헤더, 컨트롤(40/44/56px).
- 논리 속성(`margin-inline`, `padding-block`)을 우선 사용한다(SHOULD).

### B3.3 단위 (MUST)
| 용도 | 단위 |
|------|------|
| 폰트 크기 | `rem` (px 금지) |
| 간격·크기 | `rem` / `em` / 토큰 |
| 테두리·미세 값 | `px` |
| 미디어 쿼리 | `px` (원본이 `width>=400px … 1792px`를 쓰므로 `px`로 통일)【수정】 |
| 줄 높이 | 단위 없는 숫자 |

### B3.4 CSS 파일 로딩 순서 (MUST)
`tokens → reset → typography → layout → components → pages → utilities`

### B3.5 속성 작성 순서 (SHOULD)
`position → display/flex/grid → box model(width, margin, padding) → typography → visual(color, background, border, shadow) → motion → 기타`

### B3.6 상호작용 (MUST)
- `:focus-visible` 스타일을 정의한다. `outline: none` 단독 사용 금지.
- `:hover` 효과는 `@media (hover: hover)` 안에 둔다.
- 트랜지션은 속성을 **명시**한다(`transition: all` 금지).
- `@media (prefers-reduced-motion: reduce)` 대응을 전역으로 둔다.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### B3.7 금지 사항 (MUST NOT)
- `!important`, id 선택자, 인라인 스타일, `transition: all`
- 매직 넘버(근거 없는 px/z-index/색상)
- 요소 숨김을 위한 `display:none` 남용으로 접근성 훼손 (시각적으로만 숨길 때는 `.visually-hidden` 유틸리티 사용)
- 벤더 프리픽스 수동 작성(필요 시 Autoprefixer 등 도구 사용)

---

## B4. JavaScript 규칙

### B4.1 언어 · 모듈 (MUST)
- **ES2022+ 문법**, `type="module"` 사용. 전역 변수·전역 함수 선언 금지.
- `var` 금지. 기본 `const`, 재할당이 필요할 때만 `let`.
- `===` / `!==`만 사용. 암묵적 형변환 지양.
- 파일은 **하나의 책임**. `main.js`는 **초기화·모듈 연결만** 수행한다.
- 모듈은 `export` / `import`로 명시적으로 연결한다.
- 세미콜론 사용, 문자열은 작은따옴표 또는 템플릿 리터럴 중 **하나로 통일**.

### B4.2 DOM 다루기 (MUST)
- 요소 선택은 `querySelector` / `querySelectorAll` + `js-*`/`data-*` 훅.
- 요소 조회는 **초기화 시 1회**하고 변수에 캐싱한다. 루프 안에서 반복 조회 금지.
- 스타일 변경은 **클래스 토글**(`classList`)로 한다. `element.style.xxx` 직접 조작은 동적 값(CSS 변수 주입) 외 금지.
- **이벤트 위임**을 우선 사용한다(목록·반복 요소).
- `innerHTML`에 **사용자 입력/외부 데이터**를 삽입하지 않는다(XSS). `textContent` 또는 `createElement`/`template`을 사용한다.
- 이벤트 리스너를 추가하면 필요 시 **해제 경로**를 둔다(`AbortController` 활용 권장).
- 스크롤·리사이즈 등 고빈도 이벤트는 `passive: true`, **throttle/debounce** 또는 `IntersectionObserver` / `ResizeObserver`를 사용한다.

### B4.3 함수 · 구조 (MUST)
- 함수는 **한 가지 일**만 한다. 길이 **40줄 이내**, 매개변수 **3개 이하**(초과 시 객체로 전달).
- **순수 함수**(입력→출력)와 **부수 효과**(DOM, 네트워크)를 분리한다.
- 중첩 깊이 **3단계 이하**. 조기 반환(early return)으로 평탄하게 작성한다.
- 매직 넘버·문자열은 `config.js`의 상수로 이동한다.
- 반복 로직은 **3번째 등장 시** 유틸/함수로 추출한다(DRY, 단 과도한 추상화 금지).
- 주석은 **“무엇”이 아니라 “왜”** 를 쓴다. 죽은 코드·주석 처리된 코드는 남기지 않는다.

### B4.4 비동기 · 에러 처리 (MUST)
- `async/await` + `try/catch`. 콜백 지옥, 미처리 Promise 금지.
- `fetch` 사용 시 `response.ok` 검사, 타임아웃/실패 UI(에러 상태), 로딩 상태를 구현한다.
- 사용자에게는 **이해 가능한 메시지**를, 개발자에게는 `console.error`로 **원인**을 남긴다.
- 외부 입력(폼·URL 파라미터·API 응답)은 **항상 검증**한다. 신뢰하지 않는다.
- `console.log`는 커밋 전 제거한다(`console.error`/`warn`은 허용).

### B4.5 상태 관리 (SHOULD)
- UI 상태는 **단일 객체**로 관리하고, 상태 변경 → 렌더 함수 호출의 단방향 흐름을 유지한다.
- 상태는 DOM에서 읽지 말고, **DOM이 상태를 반영**하도록 한다.
- `localStorage`/`sessionStorage` 사용 시 `try/catch`와 키 네임스페이스(`appName:key`)를 적용하고, **민감 정보는 저장하지 않는다**.

### B4.6 UI 패턴 구현 (MUST)
- 햄버거 메뉴·모달·탭·아코디언 등은 **ARIA 속성 + 키보드 조작 + 포커스 관리**까지 구현해야 완료로 본다.
- 모달/드로어 오픈 시 body 스크롤 잠금 및 해제를 보장한다.
- 리사이즈로 뷰포트가 바뀌어도 UI 상태가 깨지지 않아야 한다(예: 모바일 메뉴가 열린 채 데스크톱 전환).

### B4.7 금지 사항 (MUST NOT)
- `eval`, `document.write`, `with`, 인라인 이벤트 핸들러
- 전역 오염, 암묵적 전역 변수
- 외부 라이브러리 **무단 추가** (추가 필요 시 사유·용량·대안을 먼저 제시하고 승인 받는다)
- 의미 없는 `setTimeout`으로 타이밍 문제 우회

---

## B5. 성능 규칙 (MUST)

| 지표 | 목표 |
|------|------|
| LCP | 2.5초 이하 |
| INP | 200ms 이하 |
| CLS | 0.1 이하 |
| Lighthouse (Perf / A11y / Best Practices / SEO) | 각 **90 이상** |

- 이미지는 **적정 크기·압축** 후 사용(`srcset`/`sizes` 또는 `<picture>`).
- 렌더 차단 리소스를 최소화한다(핵심 CSS 우선, JS `defer`/`module`).
- 폰트는 필요한 **굵기·서브셋만** 로드한다.
- 레이아웃 스래싱(읽기/쓰기 번갈아 DOM 접근)을 피한다.
- 불필요한 **외부 요청·라이브러리**를 제거한다. 외부 리소스는 `rel="preconnect"`를 고려한다.

---

## B6. 보안 규칙 (MUST)
- 사용자 입력을 HTML로 렌더링할 때는 **반드시 이스케이프**한다.
- 외부 링크 `target="_blank"`에는 `rel="noopener noreferrer"` 필수.
- **API 키·토큰·비밀번호를 소스에 포함하지 않는다.**
- 외부 스크립트는 신뢰할 수 있는 출처만, 가능하면 **SRI(`integrity`)** 적용.
- 폼 제출·API 통신은 **HTTPS** 전제. 민감 정보 로깅 금지.

---

## B7. 브라우저 · 호환성 (MUST)
- 지원 범위: **최신 Chrome / Edge / Safari / Firefox 및 iOS Safari, Android Chrome 최신 2개 메이저 버전**.
- 최신 CSS/JS 기능은 **지원 여부를 확인**하고, 필요 시 폴백을 제공한다(`@supports`, 기능 감지).
- 브라우저 **UA 스니핑 금지**, 기능 감지를 사용한다.
- 터치·마우스·키보드 입력을 모두 고려한다.

---

## B8. 품질 · 검증 · 버전 관리

### B8.1 작업 완료 전 자가 검증 (MUST)
1. 브라우저 콘솔에 **에러·경고 0건**
2. 모바일(375px) · 태블릿(768px) · 데스크톱(1280px)에서 **레이아웃 확인**, 가로 스크롤 없음
3. **키보드만으로** 전체 흐름 조작 가능, 포커스 표시 확인
4. HTML 유효성(W3C) 오류 없음
5. 이미지 깨짐·404 없음, 링크 동작 확인
6. 이번 변경이 **다른 페이지/컴포넌트를 깨뜨리지 않는지** 확인

### B8.2 Git (SHOULD)
- 커밋은 **작고 의미 단위**로. 메시지 형식: `type(scope): 설명`
  - type: `feat / fix / style / refactor / perf / docs / chore`
  - 예: `feat(nav): 모바일 햄버거 메뉴 추가`
- 한 커밋에 **서로 다른 목적의 변경을 섞지 않는다**.
- `README.md`에 실행 방법, 폴더 구조, 주요 규칙 링크를 유지한다.

### B8.3 코드 포맷 (SHOULD)
- Prettier / ESLint / Stylelint 사용 시 설정 파일을 루트에 두고 **설정을 따른다**.
- 도구가 없는 경우에도 본 문서의 들여쓰기·네이밍 규칙을 준수한다.

---

# PART C. AGENT 작업 프로토콜

## C1. 작업 시작 전 (MUST)
1. 요청을 요약하고 **범위**(수정할 파일, 건드리지 않을 파일)를 명시한다.
2. 기존 **토큰·컴포넌트·모듈**을 먼저 조사하고 **재사용 가능 여부**를 판단한다.
3. 모호한 부분은 **가정을 명시**하거나 질문한다. (질문은 한 번에 모아서)
4. 변경 규모가 크면 **작업 계획**(파일 목록, 순서)을 먼저 제시한다.
5. 【추가】 새 영역을 만들기 전에 **D4 박스 구조**(겉박스 > `.inner-box` > 파티션 박스)에 들어맞는지 확인한다.

## C2. 작업 중 (MUST)
- 기존 코드의 **스타일·네이밍·구조를 따른다.** 취향대로 리팩터링하지 않는다.
- 요청 범위 밖의 변경이 필요하면 **멈추고 제안**한다. 임의 수정 금지.
- 새 토큰·컴포넌트·유틸을 만들면 **위치와 사용법**을 간단히 기록한다.
- 불확실한 API/속성은 추측하지 말고 **확인 후 사용**한다.

## C3. 작업 종료 후 (MUST)
다음 형식으로 보고한다.

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

## C4. 절대 금지 (MUST NOT)
- 요청하지 않은 **전체 파일 재작성**
- 기존 동작을 **확인 없이 삭제**
- 규약과 충돌하는 코드를 **말없이** 작성
- 검증하지 않고 **“완료”** 라고 보고
- 승인 없이 **외부 라이브러리·CDN·프레임워크 추가**
- 【추가】 파티션 박스를 **Grid로 구성**, `.inner-box` 외의 이름으로 속박스 생성, 박스 구조(D4) 임의 변경
- 【추가】 D1 토큰에 없는 **색 추가**(포커스·오류·호버 포함), D3 외의 그림자·반경, pill 버튼 사용
- 【추가】 확인 필요 항목(D10)을 사용자 확인 없이 **확정된 값처럼 사용**
- 플레이스홀더(`TODO`, `...`, “여기에 코드 추가”)를 남긴 채 완료 처리

---

# PART D. TARGET SITE 특화 규약 — Nothing KR

> 타겟: **https://kr.nothing.tech/**
> 원칙: **디자인(색상 · 서체 · 박스 수치)은 타겟 사이트와 동일하게, 내부 레이아웃은 D4 규칙으로 새로 구성한다.**
> 충돌 시 PART D가 PART A·B보다 우선한다.

## D0. 근거와 정정

### D0.1 분석한 소스
| 파일 | 정체 | 쓰임 |
|------|------|------|
| `CDeSFfHM.css` (120KB) | **Nothing 사이트 본체 CSS** (Tailwind 컴파일본, 실제 사용된 클래스만 포함) | 색·서체·간격·반경·반응형 값의 1차 근거 |
| `Ch7VuJCF.css` | **Shopify Hydrogen 스타터 기본 스타일** (장바구니·검색 어사이드, 헤더 등) | 템플릿 기본값. 사이트 디자인 토큰으로 보지 않는다 |
| `fOJvfYOR.css` | Lenis(스무스 스크롤) 라이브러리 CSS | 참고 |
| `saved_resource*.html` 2개 | 빈 페이지 · 서비스워커 iframe | **메인 HTML이 아니므로 구조 분석 불가** |

> 【추가】 `낫싱사이트.zip`은 위 5개 파일(HTML 2 + CSS 3)로 이루어져 있고 **이전 분석 파일과 이름·크기가 같다.** HTML은 여전히 `about:blank` 저장본과 서비스워커 iframe뿐이다. 따라서 새 파일에서 얻은 정보는 없고, 대신 CSS를 **스크립트로 전수 재검증**했다(D0.4).

### D0.2 한계 (MUST 인지)
- 메인 HTML이 없어서 **“어느 요소에 어떤 클래스가 붙는지”는 확인할 수 없다.** 컴파일 CSS에 있다는 것은 **사이트 어딘가에서 쓰인 값**이라는 뜻이다. 요소별로 확정되지 않은 값은 `(확인 필요)`로 표시했다.
- 폰트 파일(woff2)은 Shopify CDN에 있지만 **상용 서체**다. 원본 CDN을 직접 링크하지 않는다(D2.1).

### D0.3 이전 추정값에서 정정된 사항
이 문서의 이전 판은 외부 정리 문서에 의존했다. 실제 CSS와 달랐던 항목은 아래와 같이 바로잡았다.

| 항목 | 이전 추정 | 실제 CSS 분석 결과 |
|------|-----------|--------------------|
| 브랜드 색 | 없음(흑·백만) | **Accent Red `#C8102E` · Yellow `#FFC700` · Blue `#002F6C`** + Greyscale 스케일 |
| 검정 | `#000` | **`#040404`**(`greyscale-black`). `#000`도 일부 혼재 |
| 다크 모드 | 없음 | **있음** (`.dark` / `.light` 클래스) |
| 반경 | 6px / 8px | **4px / 8px** (+0) |
| 그림자 | 없음 | **있음**(소프트 섀도 2종) + 프로스트 blur 45px |
| 포커스 | 색 없음(흑·백) | **Accent Yellow 2px 아웃라인** |
| 속박스 최대폭 | 사이트에 없음 → 1920px | **1792px** (`max-w-screen-3xl`, 컨테이너 단계 400~1792px) |
| 굵기 55 / 57 | 파일명 | **`@font-face` 굵기 값** (Ndot-Regular 55, Ndot-Bold 57) |
| 한국어 | 해당 없음 | **`lang="ko"`는 굵기 400 강제**(100 금지) |
| 헤더 64px, 셀 355px, `--color-dark/light` | 사이트 토큰 | **Hydrogen 템플릿 기본값**(확인 필요) |
| 버튼 높이 | 40px | 확인된 높이 **40 / 44 / 56px** |
| 대문자 | 항상 대문자 | `.uppercase` **유틸리티를 붙인 곳에서만**(확인 필요) |
| 섹션 사이 간격 | 없음(밴드 연속) | **세로 패딩 80~256px** 사용(최대 `md:pt-64`, `3xl:pb-60` = 240) |

### D0.4 CSS 전수 재검증 결과 【추가】
> `CDeSFfHM.css`(약 1,600개 규칙)를 스크립트로 파싱해 이 문서의 수치와 하나씩 대조했다. 어긋난 값은 본문에서 고쳤고, 빠져 있던 값은 추가했다.

| # | 항목 | 이전 문서 | CSS 검증 결과 | 반영 |
|---|------|-----------|---------------|------|
| 1 | 간격 토큰 | 23개 값 | `6 · 28 · 36 · 44 · 128 · 208px` 누락. `192 · 240 · 256`은 실재(`md:pt-64`, `3xl:pb-60`) | D3.1 |
| 2 | 좌우 거터 | “요소별 확인 필요” | `px-4 → xs:px-6 → md:px-10 → xl:px-16` 패턴 확인(16→24→40→64) | D3.1 |
| 3 | disabled | `opacity .4` | `disabled:opacity-30` = **.3** | A3.2 · D5.1 |
| 4 | 플레이스홀더 | `greyscale-600`(대비 2.7:1) | 원본은 600 · 800 · 900 혼용. AA를 위해 **800** 채택 | D5.2 |
| 5 | 대소문자 | “확인 필요” | `type-category` · `type-logo` · `type-callout` = **uppercase**, `type-product-name` = **lowercase**, `*-cs` 변형 = 변환 없음 | D2.2 · D2.4 |
| 6 | 입력창 글자 | 없음 | `type-text-field`(LatteraMonoLL 16px / 1.2rem / 자간 −0.04em) 추가. −0.04em은 **이 클래스에서만** 확인 | D2.2 |
| 7 | 모바일 4컬럼 | “4컬럼(모바일)” | 근거 없음 → 삭제. 12컬럼 체계 + 카드 행 폭 계산식을 **표로 정리** | B3.2 · D4.5 |
| 8 | `0.5px` 헤어라인 | 있음 | CSS에 없음 → 삭제. `3px`(`border-[3px]`)는 확인 | D3.2 |
| 9 | hover `(hover:hover)` | 원본 값처럼 서술 | 원본에는 없음 → **프로젝트 추가 규칙**으로 명시 | D5.1 |
| 10 | `ndot-display-xl → xxl` (xl 이상) | 있음 | 근거 없음(`lg · 2xl · 3xl`에서 30px 재지정뿐) → 삭제 | D2.3 |
| 11 | 굵기 100 | “얇게 사용” | `NType82-Regular`의 `@font-face`는 400 하나뿐 → 100은 **같은 글리프**로 렌더될 수 있음 | D2.1 |
| 12 | 반경 | 0 / 4 / 8 | `2px`(`rounded-sm`) · `6px`(`rounded-md`) · `9999px`(`rounded-full`) 존재. 사용처 미확인 | D3.2 · D10 |
| 13 | 그림자 | 2종 | `shadow`, `shadow-lg`, `ring-1`(검정 .15) 존재. 미채택 사유 명시 | D3.3 |
| 14 | 색 | 캠페인색 4개 | `#F5F5F5 · #999999 · #B3B3B3 · #EBEBEB · #27D4E0 · #595A5A0D` 추가 확인, 별칭 6종 정리 | D1.1b · D1.4 |
| 15 | 전환 시간 | `.1 / .15 / .2 / .5s` | `.3s` · `.22s` · `ease-out(0,0,.2,1)` · 지연 `.1 / .5s` 추가 | D7 |
| 16 | 대비 수치 | 700 = 3.7, 900 = 7.0 | 재계산: **3.6 / 6.9** (다른 값은 일치) | D1.1 |
| 17 | 미디어 쿼리 단위 | rem 또는 px | 원본은 **px** → px로 통일 | B3.3 |
| 18 | 8px 그리드 | DoD에 잔존 | 간격은 4px 기반 → 문구 정정 | §5 |

**검증 결과 일치한 값**: Greyscale·Accent RGB 17개, 타입 스케일(Ndot · NType82 · Mono) 크기·굵기·행간, 한국어 굵기 400 강제, 컨테이너 단계(400~1792px, 914 포함), `max-w-screen-3xl` 1792px, z-index 0~50, `--shadow-sm` · `--shadow-float`, 블러 45px, 모션 이징 `cubic-bezier(.4,0,.2,1)`, 포커스 노랑 2px, `lg:max-w-[65ch]` · `[85ch]`.

---

## D1. 색상 토큰

### D1.1 Greyscale · Accent (MUST)

| 토큰 | RGB 채널 | HEX | 용도 |
|------|----------|-----|------|
| `--greyscale-white` | 255 255 255 | `#FFFFFF` | 페이지 배경, 어두운 면 위 텍스트 |
| `--greyscale-100` | 244 244 244 | `#F4F4F4` | 연한 면 배경, `theme-color` |
| `--greyscale-200` | 216 217 217 | `#D8D9D9` | 구분선, 연한 채움 |
| `--greyscale-300` | 203 204 204 | `#CBCCCC` | 테두리 |
| `--greyscale-400` | 190 192 192 | `#BEC0C0` | 비활성 요소 |
| `--greyscale-default` | 177 179 179 | `#B1B3B3` | 스크롤바 썸, 장식 |
| `--greyscale-600` | 155 157 157 | `#9B9D9D` | 플레이스홀더 (**텍스트 본문 금지**: 대비 2.7:1) |
| `--greyscale-700` | 133 135 135 | `#858787` | 보조 아이콘 (**흰 배경 텍스트 금지**: 대비 3.6:1) |
| `--greyscale-800` | 111 112 112 | `#6F7070` | 보조 텍스트 하한 (대비 5.0:1) |
| `--greyscale-900` | 89 90 90 | `#595A5A` | 보조 텍스트, 어두운 틴트 (대비 6.9:1) |
| `--greyscale-1000` | 60 60 60 | `#3C3C3C` | 진한 면, 다크 프로스트 |
| `--greyscale-black` | 4 4 4 | `#040404` | 기본 텍스트, 어두운 버튼 |
| `--greyscale-dm-light` | 24 24 24 | `#181818` | 다크 모드 표면 |
| `--greyscale-dm-dark` | 4 4 4 | `#040404` | 다크 모드 배경 |
| `--accent-red` | 200 16 46 | `#C8102E` | 알림·오류·강조 텍스트 (흰 글자와 대비 5.9:1) |
| `--accent-yellow` | 255 199 0 | `#FFC700` | 포커스 링, 강조 CTA, 다크 모드 포인트 (hover `#F4E300`) |
| `--accent-blue` | 0 47 108 | `#002F6C` | 보조 강조 (사용처 확인 필요) |
| `--color-border` | — | `#E5E7EB` | 기본 테두리 (사이트 리셋 값) |

> 대비 수치는 흰 배경 기준으로 계산한 값이다. `--greyscale-100`(`#F4F4F4`) 면 위에서는 800이 **4.5:1**로 AA 하한이므로, 연한 면 위의 보조 텍스트는 **900**을 쓴다【추가】.

```css
:root {
  --greyscale-white: 255 255 255;
  --greyscale-100: 244 244 244;
  --greyscale-200: 216 217 217;
  --greyscale-300: 203 204 204;
  --greyscale-400: 190 192 192;
  --greyscale-default: 177 179 179;
  --greyscale-600: 155 157 157;
  --greyscale-700: 133 135 135;
  --greyscale-800: 111 112 112;
  --greyscale-900: 89 90 90;
  --greyscale-1000: 60 60 60;
  --greyscale-black: 4 4 4;
  --greyscale-dm-light: 24 24 24;
  --greyscale-dm-dark: 4 4 4;
  --accent-red: 200 16 46;
  --accent-yellow: 255 199 0;
  --accent-blue: 0 47 108;
  --color-border: #e5e7eb;
  --color-accent-yellow-hover: #f4e300;
}
```

### D1.1b 별칭 · 일회성 색 【추가】
원본 CSS는 같은 색에 별칭 클래스를 여러 개 둔다. **프로젝트에서는 왼쪽 정식 토큰 이름만 쓴다.**

| 정식 토큰 | 원본 별칭 | 비고 |
|-----------|-----------|------|
| `--greyscale-white` | `pure-white` | |
| `--greyscale-black` | `pure-black` | `#040404`. 원본의 순수 `#000`은 Hydrogen 템플릿·`bg-black/60` 등에만 있다 |
| `--greyscale-100` | `grey-lightest` | |
| `--greyscale-200` | `grey-lighter` | |
| `--greyscale-default` | `grey-official` | |
| `--greyscale-900` | `grey-darker` | 다크 모드에서는 일부 요소가 흰색으로 덮어쓴다(D1.2) |

원본에 **일회성으로만** 나오는 `#hex`(토큰화하지 않는다, 필요하면 사용자 승인 후 추가):
`#F5F5F5` · `#999999` · `#B3B3B3` · `#EBEBEB`(배경), `#595A5A0D`(= `greyscale-900 / .05`와 같은 틴트), `#006479`·`#27D4E0`(SVG fill), `#FF42AD`·`#FFEE00`·`#C6102E`(캠페인 배경).

### D1.2 시맨틱 토큰 (MUST)

```css
:root,
.light {
  --color-bg: rgb(var(--greyscale-white));
  --color-surface: rgb(var(--greyscale-100));
  --color-text: rgb(var(--greyscale-black));
  --color-text-muted: rgb(var(--greyscale-900));
  --color-on-media: rgb(var(--greyscale-white));
  --color-signal: rgb(var(--accent-red));
  --color-focus: rgb(var(--greyscale-black));      /* 밝은 배경 */
}
.dark {
  --color-bg: rgb(var(--greyscale-dm-dark));
  --color-surface: rgb(var(--greyscale-dm-light));
  --color-text: rgb(var(--greyscale-white));
  --color-text-muted: rgb(var(--greyscale-200));
  --color-focus: rgb(var(--accent-yellow));         /* 어두운 배경 */
}
```
- 화면에서는 **시맨틱 토큰**을 참조한다. Primitive(`--greyscale-*`)는 투명도·틴트 조합에만 직접 쓴다.
- 다크 모드 전환은 `html`(또는 `body`)에 `.dark` / `.light` 클래스를 붙이는 방식이다. 기본값과 토글 방식은 확인 필요(D10).
- 【추가】 원본의 다크 규칙은 `:is(.dark *):not(:is(.light, .light *))` 형태다. 즉 **조상에 `.dark`가 있어도 더 가까운 조상에 `.light`가 있으면 라이트로 되돌아간다.** `.dark` 안의 라이트 영역(`.light`)을 지원하려면 같은 구조를 쓴다. 로고·이미지는 `dark:block` / `dark:hidden` 쌍으로 라이트·다크 변형을 교체한다.
- 【추가】 원본에 존재하는 `dark:` 변형(라이트와의 1:1 짝은 HTML이 없어 확정 불가): 텍스트 `white · 200 · 600 · default · accent-yellow · black`, 테두리 `white · 800 · 900 · 100/.4 · default/.25`, 배경 `dm-dark · dm-light · black · white · 700 · 900 · 1000 · accent-yellow`. 확정된 덮어쓰기는 **`grey-darker`(900) 텍스트·테두리 → white** 하나뿐이다.

### D1.3 투명도 조합 (원본에서 확인된 값) 【수정】
| 용도 | 값 |
|------|----|
| 오버레이(배경 딤) | `rgb(0 0 0 / .2)`(Hydrogen `.overlay`), `rgb(0 0 0 / .6)`(`bg-black/60`), 다크 `rgb(0 0 0 / .8)`, 라이트 오버레이 `rgb(255 255 255 / .5)` |
| 사진 위 텍스트 보호 | `linear-gradient(to top, rgb(var(--greyscale-black) / .6), transparent)` |
| 검정 면 | `greyscale-black / .05 · .15 · .8 · .9`, 다크 `/ .2 · .7`, `dm-dark / .5` |
| 흰 면 | `rgb(255 255 255 / .9)`(`bg-white/90`), `greyscale-white / .05 · .08 · .1 · .2 · .4 · .6 · .8` |
| 회색 틴트 | `greyscale-900 / .05 · .4 · .6`, `greyscale-100 / .1 · .25 · .6`, `greyscale-200 / .5`, `greyscale-1000 / .6` |
| 텍스트 | 라이트 `black / .4 · .8`, `900 / .5`, 다크 `white / .5 · .6 · .8` |
| 테두리 | `default / .1`(라이트), `default / .25` · `100 / .4`(다크) |
| 링(hairline) | `ring-1`, 색 `black / .15`(라이트), `white / .2`(다크) |
| 프로스트 면 | 위 회색·흰 틴트 + `backdrop-filter: blur(45px)`. 이름: `frost-grey-intense`(900/.6) · `frost-grey-low`(900/.05) · `frost-white-intense`(white/.8) · `frost-white-low`(white/.05) · `frost-1000-60` · `frost-900-60` · `frost-900-05` · `frost-200-50` · `frost-100-60` · `frost-100-10` · `frost-white-80` · `frost-white-08` |

### D1.4 사용 규칙 (MUST)
- **Accent Yellow 포커스 링은 어두운 배경·미디어 위에서만** 쓴다. 흰 배경 위 노랑 링은 대비가 약 1.6:1이라 기준(3:1)에 못 미치므로 **밝은 배경에서는 `--greyscale-black` 링**을 쓴다.
- Accent Red 위의 텍스트는 흰색만 쓴다.
- 원본에는 제품 컬러웨이·캠페인용 색(`#FF42AD`, `#FFEE00`, `#006479`, `#C6102E`, `#27D4E0` 등)이 있다. 이는 **특정 캠페인 섹션 전용**이므로 사용자 승인 없이 전역 토큰으로 만들지 않는다. 전체 목록은 D1.1b.
- 원본의 `*-950/90` 색 오버레이(red · blue · green · orange · cyan · pink)는 브레이크포인트마다 색이 달라, **디버그 표시용**으로 보인다. 쓰지 않는다.
- 흰 배경 위 텍스트에는 `--greyscale-800` 이하로 밝은 회색을 쓰지 않는다(AA).
- 【추가】 **Accent 사용처(CSS 확인)**: Red = 텍스트 · 테두리 · 배경 · **오류 아웃라인**(`outline-accent-red`) / Yellow = 포커스 아웃라인·테두리, 배경(CTA), 다크 텍스트, hover `#F4E300` / Blue = **배경(`bg-accent-blue`)에서만** 확인(텍스트·테두리 사용 없음).
- 【추가】 **텍스트 선택(`::selection`)**: 배경 `--greyscale-900`, 글자 `#FFF`(= `--greyscale-white`). 전역으로 둔다.

---

## D2. 타이포그래피

### D2.1 서체와 파일 (MUST)

| 계열 | `@font-face` 이름 | 굵기 값 | 역할 |
|------|-------------------|---------|------|
| Ndot | `Ndot-Regular` | **55** | 제품명 · 로고 · 디스플레이 |
| Ndot | `Ndot-Bold` | **57** | Ndot 헤딩 (`ndot-heading-*`, `ndot-display-xl`) |
| NType82 | `NType82-Regular` | 400 | 본문 · 헤드라인(CSS에서 굵기 `100`을 지정. 단 `@font-face`가 400 하나뿐이라 100도 같은 글리프로 렌더될 수 있다 — 사이트 값 그대로 재현하되 시각 차이는 확인 필요) |
| NType82 | `NType82-Headline` | 400 | 헤드라인 전용 |
| LatteraMonoLL | `LatteraMonoLL` | 400 | 라벨 · 콜아웃 · 캡션 |
| Geist / Geist Mono (Variable) | `Geist Variable`, `Geist Mono Variable` | 100~900 | 원본에 로드되어 있으나 사용처 확인 필요. **기본 미사용** |

- 위 서체는 **상용·자체 제작**이다. 폰트 파일은 사용자가 제공한 것을 `assets/fonts/`에 두고 `@font-face`로 선언한다. **원본 CDN 직접 링크·무단 다운로드 금지.** 파일이 없으면 폴백으로 구현하고 파일 제공을 요청한다.
- `@font-face`는 `font-display: swap`, 첫 화면에 쓰이는 파일만 `preload`.
- 세 계열 모두 **한글 글리프가 없을 수 있다.** 스택에 한글 폴백을 포함한다.
- **굵기는 `@font-face`에 선언한 값과 일치**시킨다(Ndot-Regular `55`, Ndot-Bold `57`). 다르면 브라우저가 굵기를 합성해 모양이 깨진다.

```css
:root {
  --font-ndot: "Ndot-Regular", "Silkscreen", ui-monospace, monospace;
  --font-ndot-bold: "Ndot-Bold", "Ndot-Regular", ui-monospace, monospace;
  --font-ntype: "NType82-Regular", "Helvetica Neue", "Pretendard", "Noto Sans KR", sans-serif;
  --font-ntype-headline: "NType82-Headline", "NType82-Regular", "Pretendard", "Noto Sans KR", sans-serif;
  --font-mono: "LatteraMonoLL", "IBM Plex Mono", ui-monospace, monospace;
}
```
> 폴백에 적은 이름은 **로컬에 있을 때만** 쓰이는 대체 후보이며, 외부에서 불러오라는 뜻이 아니다.

### D2.2 타입 스케일 (MUST)
> 모든 값은 원본 CSS의 유틸리티 정의에서 가져온 것이다. 크기는 rem(1rem = 16px), 행간은 단위 없는 배수.

**Ndot (제품명 · 디스플레이)**

| 토큰 | 크기 | 굵기 | 행간 | 용도 |
|------|------|------|------|------|
| `ndot-display-xxxl` | 60px / 3.75rem | 55 | 1 | 초대형 디스플레이 |
| `ndot-display-xxl` | 40px / 2.5rem | 55 | 1 | 대형 디스플레이 |
| `ndot-display-xl` | 30px / 1.875rem | 57 | 1 | 디스플레이 |
| `ndot-heading-lg` | 20px / 1.25rem | 57 | 1 | 헤딩 |
| `ndot-heading-md` | 18px / 1.125rem | 57 | 1 | 헤딩 |
| `ndot-heading-sm` | 16px / 1rem | 57 | 1 | 헤딩 |
| `ndot-heading-xs` | 14px / 0.875rem | 57 | 1 | 헤딩 |
| `type-category` | 40px / 2.5rem | 400 | 1 (2.5rem) | 카테고리 라벨 |
| `type-logo` | 20px / 1.25rem | 55 | 1.35rem | 로고 텍스트 |
| `type-product-name` | 20px / 1.25rem | 55 | 1.25rem | 제품명 |

**NType82 (에디토리얼)**

| 토큰 | 크기 | 굵기 | 행간 | 용도 |
|------|------|------|------|------|
| `ntype-display-xxl` | 60px / 3.75rem | 400 | 1 | 디스플레이 |
| `ntype-display-xl` | 48px / 3rem | 400 | 1 | 디스플레이 |
| `ntype-display-lg` | 40px / 2.5rem | 400 | 1 | 디스플레이 |
| `ntype-heading-xl` | 32px / 2rem | 400 | 1 | 헤딩 |
| `ntype-heading-lg` | 24px / 1.5rem | 400 | 1.1 | 헤딩 |
| `ntype-heading-md` | 20px / 1.25rem | 400 | 1.2 | 헤딩 |
| `type-title` (≥768px) | 32px / 2rem | **100** | 2.2rem | 섹션 타이틀 |
| `type-headline` | 24px / 1.5rem | **100** | 1.65rem | 얇은 에디토리얼 헤드라인 |
| `ntype-subheading-lg` | 18px / 1.125rem | 400 | 1.4 | 서브헤딩 |
| `ntype-subheading-md` | 16px / 1rem | 400 | 1.4 | 서브헤딩 |
| `ntype-subheading-sm` | 14px / 0.875rem | 400 | 1.4 | 서브헤딩 |
| `body-lg` | 20px / 1.25rem | 400 | 1.2 | 큰 본문 |
| `body` | 16px / 1rem | 400 | 1.4rem | 일반 본문 |
| `body-md` | 16px / 1rem | 400 | 1.3 | 본문 |
| `body-sm` | 14px / 0.875rem | 400 | 1.4 | 작은 본문 |

**LatteraMonoLL (라벨)**

| 토큰 | 크기 | 굵기 | 행간 | 용도 |
|------|------|------|------|------|
| `mono-lg` | 16px / 1rem | 400 | 1.25 | 큰 라벨 |
| `mono-md` | 14px / 0.875rem | 400 | 1.25 | 라벨 |
| `mono-sm` | 12px / 0.75rem | 400 | 1.25 | 작은 라벨 |
| `mono-xs` | 11px / 0.6875rem | 400 | 1.25 | 최소 라벨 |
| `type-callout` | 11px / 0.6875rem | 400 | 0.75625rem | 콜아웃 |
| `type-text-field` 【추가】 | 16px / 1rem | 400 | 1.2rem | 입력창 값 (자간 `-0.04em`) |

- **본문 색**: `type-body`는 다크 모드(`.dark`)에서 글자색이 `--greyscale-white`로 바뀐다【추가】.
- **text-transform (CSS 확인)** 【수정】: `type-category` · `type-logo` · `type-callout` = **`uppercase`**, `type-product-name` = **`lowercase`**. 각각의 `-cs` 변형(`type-category-cs`, `type-logo-cs`, `type-product-name-cs`, `type-callout-cs`)은 **변환 없음**(원문 표기 유지용). 한국어에는 변환이 의미 없으므로 `-cs` 쪽을 쓴다.
- **자간**: `tracking-widest` `0.1em`, `tracking-wide` `0.025em`, 입력 글자 `type-text-field`의 `-0.04em`이 확인된다. `0.1em`·`0.025em`이 어느 라벨에 붙는지는 확인 필요(D10-6).
- 원본에는 위 외에 Tailwind 기본 크기(`text-2xl` 24px · `3xl` 30px · `4xl` 36px · `5xl` 48px · `6xl` 60px)와 임의값(`2rem` · `2.7rem`(`xl`) · `5rem` · `6rem`(`md`·`lg`) · `9vw`(`lg`) · `9px` · `10px` · `12px`)이 쓰인다. 프로젝트에서는 **위 토큰 표의 값만** 쓴다. 히어로 초대형 텍스트(`2.7rem` / `5rem` / `6rem` / `9vw`)는 필요한 위치를 사용자에게 확인한 뒤 토큰으로 추가하고, **9px·10px는 최소 크기(11px) 규칙에 따라 쓰지 않는다**【수정】.

### D2.3 반응형 크기 (SHOULD, 확인된 승급 패턴)
모바일 기본값에서 화면이 커지면 한 단계 키운다.

| 모바일 | 승급 | 시점 |
|--------|------|------|
| `ntype-display-lg` 40 | `ntype-display-xl` 48 | `md` 이상 |
| `ntype-heading-lg` 24 | `ntype-heading-xl` 32 | `md` 이상 |
| `type-headline` 24 | `type-title` 32 | `md` 이상 |
| `ntype-subheading-md` 16 | `ntype-subheading-lg` 18 | `lg` 이상 |
| `mono-sm` 12 | `mono-md` 14 → `mono-lg` 16 | `lg` 이상 (`mono-lg`는 `2xl`에서도 재지정) |

- 【수정】 이전 판의 “`ndot-display-xl` 30 → `xxl` 40 (`xl` 이상)”은 CSS 근거가 없어 삭제했다. 원본은 `lg · 2xl · 3xl`에서 `ndot-display-xl`(30px)을 **다시 지정**할 뿐이다. `ndot-display-xxl`(40px)·`xxxl`(60px)은 브레이크포인트 접두사 없이 쓰인다.
- 【수정】 `ntype-display-lg`(40)·`xl`(48)은 `md`에서 올리는 패턴과 `xl`에서 40으로 되돌리는 변형이 모두 있다. 요소별로 다르므로 **한 방향으로 단정하지 않는다.**

### D2.4 사용 규칙 (MUST)
- 서체 역할을 섞지 않는다: **제품명=Ndot, 헤드라인·본문=NType82, 라벨=LatteraMonoLL**. Ndot을 본문에, NType82를 라벨에 쓰지 않는다.
- **굵기 100(얇은 헤드라인)은 `lang="ko"` 텍스트에서 쓰지 않는다.** 원본이 한국어·중국어에 굵기 400을 강제하므로 같은 규칙을 적용한다. 일본어·아랍어는 300.

```css
.type-headline, .type-title { font-family: var(--font-ntype); font-weight: 100; }
.type-headline :lang(ko), .type-title :lang(ko),
.type-headline :lang(zh), .type-title :lang(zh) { font-weight: 400; }
.type-headline :lang(ja), .type-headline :lang(ar) { font-weight: 300; }
```
- 대소문자는 **D2.2의 text-transform 확인값**을 따른다(category·logo·callout = 대문자, product-name = 소문자). 그 외 영문 라벨에 `.uppercase`를 붙이는 위치는 확인 필요(D10-6). 소스 텍스트는 원문 표기를 유지하고 한국어에는 변환을 적용하지 않는다【수정】.
- 최소 크기는 `mono-xs`(11px). 이보다 작은 글자를 만들지 않는다. 본문은 16px 이상(14px `body-sm`은 보조 정보에 한함).

---

## D3. 박스 수치 (크기 · 패딩 · 마진 · 반경 · 테두리 · 그림자)

### D3.1 간격 토큰 (MUST) 【수정】
원본이 쓰는 값만 정의한다(4px 기반 스케일, CSS 전수 검증). **이름은 px 값과 같다.**

```css
:root {
  /* 컴포넌트 내부 */
  --space-2: 2px;   --space-4: 4px;   --space-6: 6px;   --space-8: 8px;
  --space-10: 10px; --space-12: 12px; --space-14: 14px; --space-16: 16px;
  --space-20: 20px; --space-24: 24px; --space-28: 28px;
  /* 거터·그룹 */
  --space-32: 32px; --space-36: 36px; --space-40: 40px; --space-44: 44px;
  --space-48: 48px; --space-56: 56px; --space-64: 64px;
  /* 섹션 세로 */
  --space-80: 80px;   --space-96: 96px;   --space-112: 112px; --space-120: 120px;
  --space-128: 128px; --space-144: 144px; --space-160: 160px;
  /* 대형 섹션 (md 이상) */
  --space-192: 192px; --space-208: 208px; --space-240: 240px; --space-256: 256px;
}
```
- `6 · 28 · 36 · 44 · 128 · 208`은 이전 판에서 빠졌던 값이다【추가】.
- 원본의 일회성 값(`3px` · `18px` · `29px` · `45px` · `67px` · `90px`)은 **토큰으로 만들지 않는다.** 가장 가까운 토큰을 쓴다.

| 용도 | 값 (원본에서 확인) |
|------|--------------------|
| 페이지 좌우 패딩 (거터) | `px-4`(16) → `xs`(400) `px-6`(24) → `md`(768) `px-10`(40) → `xl`(1280) `px-16`(64). **패턴 확인됨** 【수정】. (`md`·`lg`의 `px-8`(32)은 일부 요소의 변형) |
| 요소 간격 `gap` | 기본 `8 / 12 / 16 / 24 / 40`. 큰 그룹 `32 / 48 / 56 / 64 / 80 / 96`(`lg` 이상 `64 / 96 / 144`, `2xl`은 `240`까지) |
| 섹션 세로 패딩 | 기본 `80 · 96 · 112 · 120 · 128 · 144 · 160`, `md` 이상 `112 · 144 · 256`, `lg` 이상 `80 · 208 · 256`, `xl` `120 · 160`, `3xl` `240` 【수정】 |
| 섹션 외곽 여백 | CMS 변수 `--wrapper-pt / pb / mt / mb` 및 `-md` 변형으로 주입 |
| 가로·세로 패딩 (`px-*` / `py-*` 전체) | 가로 `4 / 6 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 64`, 세로 `2 / 4 / 6 / 8 / 12 / 14 / 20 / 24 / 40`. 컨트롤에 한정된 값인지는 HTML이 없어 확인 불가 |

- 섹션 패딩은 값을 하드코딩하지 않고 **변수로 주입**한다(원본 방식).
- 변수에는 **위 토큰 값만** 넣는다(`--wrapper-pt: var(--space-144)`처럼). 토큰에 없는 값이 필요하면 사용자에게 확인한다.

```css
.section {
  padding-top: var(--wrapper-pt, 0px);
  padding-bottom: var(--wrapper-pb, 0px);
}
@media (min-width: 768px) {
  .section {
    padding-top: var(--wrapper-pt-md, var(--wrapper-pt, 0px));
    padding-bottom: var(--wrapper-pb-md, var(--wrapper-pb, 0px));
  }
}
```

### D3.2 반경 · 테두리 (MUST) 【수정】

```css
:root {
  --radius-none: 0;
  --radius-sm: 4px;     /* 태그·칩·작은 UI (확인 필요: 실제 적용처) */
  --radius-md: 8px;     /* 카드·이미지 프레임·패널 */
  --radius-full: 9999px; /* 정원(1:1) 요소 전용: 점·라디오·원형 아이콘 (확인 필요: 사용처) */
  --border-default: 1px solid var(--color-border);
  --border-strong: 2px solid rgb(var(--greyscale-black));
}
```
- 원본 CSS에 있는 반경: `0` · `2px`(`rounded-sm`) · `4px`(`rounded`, `rounded-[4px]`) · `6px`(`rounded-md`) · `8px`(`rounded-lg`, `lg:rounded-lg`, 하단만 `rounded-b-lg`) · `9999px`(`rounded-full`). **프로젝트는 `0 / 4 / 8`을 기본으로 하고, `2px` · `6px`는 사용처가 확인될 때까지 쓰지 않는다.**
- `--radius-full`은 **정원형 요소에만** 쓴다. 가로로 긴 `pill` 버튼·칩은 금지(D10-12에서 사용처 확인). 스크롤바 썸은 `999px`.
- 테두리는 1px이 기본, 밑줄·탭 강조는 `border-b-2`(2px), 좌측 강조선은 `border-l-2`(2px), 강조 박스 `border-[3px]`(3px, 사용처 확인 필요). 이전 판의 `0.5px` 상단 헤어라인은 CSS에서 확인되지 않아 **삭제**했다.
- **선택 상태(라디오·체크 등)**: `outline: 1px solid`, 색은 라이트 `greyscale-black` / 다크 `greyscale-white`.
- 테두리 색(원본): `#E5E7EB`(기본), `greyscale-100 · 200 · 300 · 900 · black`, `default / .1`, 오류 `accent-red`, 포커스 `accent-yellow`. 다크는 D1.2.

### D3.3 그림자 · 프로스트 (MUST) 【수정】

```css
:root {
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-float: 0 0 25px -5px rgb(0 0 0 / 0.3), 0 0 10px -6px rgb(0 0 0 / 0.3);
  --ring-hairline: 0 0 0 1px rgb(var(--greyscale-black) / 0.15);   /* 다크: greyscale-white / 0.2 */
  --frost-blur: blur(45px);
}
.frost { backdrop-filter: var(--frost-blur); -webkit-backdrop-filter: var(--frost-blur); }
```
- 그림자는 **`--shadow-sm`, `--shadow-float`** 2종 + 1px 헤어라인 링 `--ring-hairline`만 쓴다. 장바구니 어사이드(Hydrogen 템플릿)는 `0 0 50px rgb(0 0 0 / .3)`을 쓰지만 템플릿 값이므로 `--shadow-float`로 통일한다.
- 원본에는 Tailwind 기본 `shadow`(`0 1px 3px`, `0 1px 2px -1px`, 검정 .1)와 `shadow-lg`(`0 10px 15px -3px`, `0 4px 6px -4px`, 검정 .1)도 있다. 사용처가 확인되지 않아 **채택하지 않는다**【추가】.
- **프로스트(글라스)**: 반투명 배경 + `backdrop-filter: blur(45px)`. 헤더·네비·패널·검색창 포커스 상태에 쓴다(배경 알파는 D1.3).

### D3.4 크기 토큰 【수정】
```css
:root {
  --inner-max-width: 1792px;     /* 속박스 (D4) */
  --header-height: 64px;         /* Hydrogen 템플릿 기본값. 원본에 72px(h-[72px])도 있어 확인 필요 */
  --aside-width: 400px;          /* 장바구니·검색 패널, 확인 필요 */
  --control-sm: 40px;            /* 확인된 컨트롤 높이 */
  --control-md: 44px;
  --control-lg: 56px;
  --measure-sm: 50ch;            /* 텍스트 줄 길이 (max-w-[50ch]) */
  --measure-md: 65ch;            /* 본문 (max-w-[65ch]) */
  --measure-lg: 85ch;            /* lg 이상 본문 (lg:max-w-[85ch]) */
}
```
- 컨트롤 높이: `h-10`(40), `h-11`(44), `h-14`(56)가 기본이고 `h-9`(36), `h-12`(48)도 있다. 36·48은 용도 미확인이라 토큰에 넣지 않는다【수정】.
- 아이콘·정사각 크기(`size-*`): `12 · 14 · 16 · 20 · 24 · 28 · 32px`(Tailwind `size-3 … size-8`) + 임의값 `18 · 50 · 72 · 108 · 124 · 128px`. 프로젝트 아이콘 토큰은 A4.2의 `16 / 20 / 24 / 32px`를 유지한다.
- 높이 관련: 풀스크린은 `100svh` / `100dvh`(`h-svh`, `h-dvh`, `h-[90dvh]`, `min-h-svh`), 원본은 `100vh`(`h-screen`)도 혼용한다. **프로젝트는 `svh` / `dvh`만 쓴다**(B3.2). 최소 높이 `min-h-[280px]` · `min-h-[57px]` · `min-h-12`(48) 등은 요소별 값이라 확인 필요.
- 텍스트 외 `max-width` 확인값: `20 · 24 · 28 · 32 · 36 · 42 · 48 · 56 · 72rem`(Tailwind `max-w-xs … 6xl`), `380 · 420 · 560 · 650 · 800 · 1000 · 1200px`. 필요하면 해당 요소를 지정해 확인한다.

### D3.5 비율 (aspect-ratio) 【수정】
확인된 값: `1 / 1`, `3 / 4`, `4 / 3`, `11 / 7`, `16 / 10`, `16 / 9`, `9 / 16`(세로 영상), `12 / 9`(`md`), 와이드 배너 `2960 / 860`. 모바일은 `1 / 1` → `md`에서 `16 / 9`·`12 / 9`, `lg`에서 `16 / 9`·`4 / 3`·`1 / 1`로 바뀌는 패턴이 쓰인다. `md:aspect-auto`로 비율을 해제하는 경우도 있다.

### D3.6 z-index · 브레이크포인트 (MUST)
```css
:root {
  --z-base: 0;  --z-raised: 10;  --z-dropdown: 20; --z-sticky: 30;
  --z-overlay: 40; --z-modal: 50; --z-toast: 60;
}
```
- 원본에는 `z-[31]`(sticky 바로 위 레이어)도 있다. 필요하면 `calc(var(--z-sticky) + 1)`로 표현하고 새 토큰을 만들지 않는다【추가】.
- 브레이크포인트는 A2.1을 따른다: `400 / 640 / 768 / 1024 / 1280 / 1536 / 1792px`.

### D3.7 박스별 요약표 (MUST)

| 박스 | 크기 | 패딩 | 반경 | 테두리 / 그림자 | 배경 / 글자 |
|------|------|------|------|-----------------|-------------|
| 겉박스 `header` | 높이 `64px`(확인 필요), sticky | 속박스 내부 | 0 | 하단 1px (확인 필요) | `--color-bg` 또는 프로스트 |
| 겉박스 `section` | 높이 콘텐츠 기준 | 세로 `--wrapper-pt/pb` | 0 | 없음 | `--color-bg` / 미디어 |
| 겉박스 `footer` | 콘텐츠 기준 | 세로 `48~96px` (확인 필요) | 0 | 없음 | 어두운 면 가능 |
| `.inner-box` | `max-width 1792px` | 좌우 `16/24/40/64` | 0 | 없음 | 투명 |
| 카드 / 이미지 프레임 | 비율 D3.5 | `16` | `8px` | 1px 또는 없음 | `--color-surface` |
| 버튼 | 높이 `40/44/56` | 가로 `16/24` | D5 | 없음 | D5 |
| 입력창 | 높이 `44` 이상 | 가로 `16` | `4~8px` (확인 필요) | 1px | `--color-bg` |
| 플로팅 패널 | 폭 `≤400px` | `16~24` | `8px` | `--shadow-float` | 프로스트/`--color-bg` |

### D3.8 마진 (원본 확인값과 프로젝트 규칙) 【추가】
원본 CSS의 마진 유틸리티를 전수 조사한 결과다. **본 프로젝트는 A1.4에 따라 마진을 `margin-inline: auto`와 섹션 외곽 여백 변수에만 쓰고, 나머지 간격은 `gap` · `padding`으로 만든다.** 아래 값은 원본이 쓰는 값의 기록이며 대부분 **채택하지 않는다.**

| 구분 | 원본 값 (px) | 프로젝트 |
|------|--------------|----------|
| 중앙 정렬 | `mx-auto`(`md` · `lg` · `2xl`에서 재지정, `xl`은 `0`) | **채택** — `.inner-box`의 `margin-inline: auto` |
| 섹션 외곽 | `mt/mb-[var(--wrapper-mt/mb, 0px)]`, `md:`는 `--wrapper-mt-md / mb-md` | **채택** (`--wrapper-mt/mb`) |
| `margin-top` | 기본 `0 · 2 · 4 · 6 · 8 · 12 · 16 · 24 · 32 · 40 · 48 · 64 · 96 · 144 · 160`, `md` `12 · 144 · 256`, `xl` `40 · 48 · 64 · 96 · 160`, `2xl` `40 · 192`, `3xl` `80` | 미채택 (`gap` / `padding`으로 대체) |
| `margin-bottom` | 기본 `4 · 8 · 10 · 12 · 16 · 24 · 32 · 40 · 44 · 48 · 56 · 80 · 96 · 144`, `md` `40 · 48 · 144 · 256`, `xl` `16` | 미채택 |
| `margin-block` (`my`) | `8 · 16 · 32 · 80 · 96`, `md` `144` | 미채택 |
| `margin-left / right` | `auto`(좌·우 밀어내기), `8`, 음수 `-2 · -8 · -40` | `auto`만 필요 시 허용(예: 헤더 우측 정렬은 `margin-inline-start: auto`) |
| 음수 마진 | `mt` `-4 · -24 · -32 · -80`, `-100svh`, `mb` `-2 · -8 · -29`, `md` `-32`, `xl · 2xl` `-36`, `3xl` `-45`, `mx` `-8 · -16` | **금지** — 겹침·블리드 연출은 `position` + `transform` 또는 `padding`으로 하고, 필요하면 사용자 확인 |
| 마진 초기화 | `m-0`, 리셋에서 `blockquote · dl · dd · h1~h6 · hr · figure · p · pre · fieldset`의 `margin: 0`, `body { margin: 0 }` | **채택** (`reset.css`) |

- 위 값 중 `-29` · `-36` · `-45`처럼 4px 스케일에서 벗어난 값은 **일회성**이다. 토큰으로 만들지 않는다.
- 요소 간 세로 간격은 `gap`, 섹션 세로 여백은 `padding-block`(D3.1)으로 만든다. 마진 상쇄가 생기는 구조를 만들지 않는다.

### D3.9 전역 리셋 기준 (`reset.css`) 【추가】
원본 CSS 앞부분(Tailwind 기본 리셋)에서 확인된 값이다. 프로젝트의 `css/base/reset.css`는 아래를 기준으로 한다. 색은 토큰만 쓴다.

```css
*, *::before, *::after { box-sizing: border-box; border: 0 solid var(--color-border); }
html {
  -webkit-text-size-adjust: 100%;
  tab-size: 4;
  line-height: 1.5;
  -webkit-tap-highlight-color: transparent;
}
body { margin: 0; line-height: inherit; }
h1, h2, h3, h4, h5, h6 { font-size: inherit; font-weight: inherit; }
blockquote, dl, dd, h1, h2, h3, h4, h5, h6, hr, figure, p, pre, fieldset { margin: 0; }
ol, ul, menu { margin: 0; padding: 0; list-style: none; }
a { color: inherit; text-decoration: inherit; }
img, svg, video, canvas, audio, iframe, embed, object { display: block; vertical-align: middle; }
img, video { max-width: 100%; height: auto; }
button, input, optgroup, select, textarea {
  font: inherit; letter-spacing: inherit; color: inherit; margin: 0; padding: 0;
}
button, select { text-transform: none; }
button, [role="button"] { cursor: pointer; }
:disabled { cursor: default; }
textarea { resize: vertical; }
select { appearance: none; }
[hidden]:where(:not([hidden="until-found"])) { display: none; }
::selection { background-color: rgb(var(--greyscale-900)); color: rgb(var(--greyscale-white)); }
```
- 원본 `html`의 기본 폰트 스택은 `ui-sans-serif, system-ui, sans-serif …`이다. 프로젝트는 D2.1의 역할별 폰트 변수를 쓰고 `body`에 `--font-ntype`을 지정한다.
- 원본의 `input::placeholder` 기본색은 `#9CA3AF`(Tailwind 회색)이며 사이트 토큰이 아니다. 프로젝트는 D5.2(`greyscale-800`)를 따른다.
- 원본 `button`에는 별도의 `border-radius`·배경이 없다(`background-color: transparent`). 버튼 스타일은 D5의 변형 클래스가 만든다.

---

## D4. 레이아웃 구조 규칙 (사용자 지정)

> 디자인은 타겟 사이트와 같게 하되, **내부 레이아웃은 아래 단순화된 박스 구조로만** 만든다.

### D4.1 3단 박스 구조 (MUST)

```
겉박스  >  속박스(.inner-box)  >  파티션 박스
(전폭)     (max-width, 중앙정렬)   (flex 분할)   >  내용박스(필요 시 Grid)
```

| 단계 | 이름 | 역할 |
|------|------|------|
| 1 | **겉박스** | `header`, `main > section`, `footer`. **전폭(100%)**. 배경색·배경 미디어·세로 패딩을 담당한다. |
| 2 | **속박스** `.inner-box` | 겉박스 안의 **콘텐츠 폭 제한**. `max-width` + 중앙 정렬 + 좌우 패딩. |
| 3 | **파티션 박스** `.partition-box` | 속박스 안을 **나누는 flex 박스**. |
| (4) | 내용박스 `.content-box` | 파티션 안의 실제 콘텐츠. **필요한 경우에만 Grid 적용**. |

### D4.2 전체 문서 구조 (MUST)

```html
<body>
  <header class="site-header">…</header>

  <main>
    <section class="section">…</section>
    <section class="section">…</section>
  </main>

  <footer class="site-footer">…</footer>
</body>
```
- `body`의 직계 자식은 **`header`, `main`, `footer` 세 개**뿐이다.
- `main`의 직계 자식은 **`section`만** 둔다. `main`과 `body`에는 시각 스타일(배경·패딩)을 주지 않는다.
- 겉박스는 `header` · `section` · `footer`이며, 각각 **직계 자식으로 `.inner-box` 하나**를 가진다. (풀블리드 미디어는 D6)

### D4.3 속박스 `.inner-box` (MUST)
- 이름은 **`.inner-box`로 일원화**한다. `.container`, `.wrapper`, `.inner`, `.wrap` 등 다른 이름 금지.
- `max-width`를 적용하고 **중앙 정렬**한다.
- 타겟 사이트에 **max-width가 적용되어 있다**(`max-w-screen-3xl` = **1792px**, 컨테이너 단계 `400 / 640 / 768 / 914 / 1024 / 1280 / 1536 / 1792px`). 따라서 사용자 규칙의 1920px 기본값 대신 **`1792px`** 를 쓴다. (사이트 값이 확인되지 않을 때만 1920px)
- 좌우 패딩은 D3.1의 거터 값(`16 / 24 / 40 / 64`)을 따른다.
- 【추가】 `1792px`는 **패딩을 포함한 폭**이다(`box-sizing: border-box`). 그래서 `xl` 이상에서 실제 콘텐츠 폭은 `1792 − 64×2 = 1664px`다.
- 【추가】 원본의 `.container`는 `400 / 640 / 768 / 914 / 1024 / 1280 / 1536 / 1792px`로 **단계별 최대폭이 계단식으로 바뀌고**(`width:100%` + 브레이크포인트별 `max-width`), 중앙 정렬은 별도 `mx-auto`로 한다. `.inner-box`는 이 계단식을 쓰지 않고 **`width: 100%` + `max-width: 1792px` 하나**로 단순화한다(사용자 규칙: max-width 적용 중앙정렬).
- `.inner-box`에는 배경색·테두리·반경·그림자를 주지 않는다(겉박스·내용박스 담당).

```css
:root { --inner-padding-inline: var(--space-16); }
@media (min-width: 400px)  { :root { --inner-padding-inline: var(--space-24); } }
@media (min-width: 768px)  { :root { --inner-padding-inline: var(--space-40); } }
@media (min-width: 1280px) { :root { --inner-padding-inline: var(--space-64); } }

.inner-box {
  width: 100%;
  max-width: var(--inner-max-width);   /* 1792px */
  margin-inline: auto;
  padding-inline: var(--inner-padding-inline);
}
```

### D4.4 파티션 박스 `.partition-box` (MUST)
- **기본은 flex**(`display: flex`)다.
- **줄바꿈이 필요한 내용**일 때만 `flex-wrap: wrap`을 적용한다(수정자 `.partition-box--wrap`). 줄바꿈이 없는 파티션에 `wrap`을 붙이지 않는다.
- **파티션 박스를 Grid로 만들지 않는다.** (`display: grid` 금지)
- 모바일 퍼스트: 기본은 세로(`flex-direction: column`), **`min-width: 768px`에서 가로(`row`)로 전환**한다(사이트의 레이아웃 전환점과 동일).
- 간격은 `gap`으로만 준다(기본 `--space-16`, 넓은 그룹 `--space-24` / `--space-40`). 자식에는 `min-width: 0`을 주어 넘침을 막는다.
- 정렬·분배는 수정자로 표현한다: `--between`, `--center`, `--end`, `--stretch`.

```css
.partition-box {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
}
.partition-box > * { min-width: 0; }
.partition-box--wrap { flex-wrap: wrap; }
.partition-box--between { justify-content: space-between; }
.partition-box--center  { align-items: center; }

@media (min-width: 768px) {
  .partition-box { flex-direction: row; }
}
```

### D4.5 내용박스 `.content-box`와 n-up 폭 (MUST)
- 파티션 박스의 직계 자식. 개별 콘텐츠를 담는다.
- **Grid는 여기서만** 허용한다. 예: 한 내용박스 안에서 아이콘+텍스트를 2열로 정렬할 때.
- 원본은 12컬럼 Grid지만, **줄바꿈되는 카드 행은 원본도 이미 `flex-wrap` + 폭 계산식**(`calc((100% - 간격합) / n)`)으로 만든다. 같은 방식을 쓴다.
- 한 줄에 놓는 개수(`--cols`)는 화면에 따라 바꾼다. 원본의 확인된 패턴: **모바일 2 → `sm` 2~3 → `md` 3~5 → `xl` 3~4**【수정】.
- 【추가】 원본의 **폭 계산식**(CSS 확인). 공식은 `calc((100% - (n−1) × gap) / n)`와 같다.

| 한 줄 개수 | 원본 값 | gap | 시점 |
|-----------|---------|-----|------|
| 2 | `calc(50% - 8px)` · `calc(50% - 6px)` · `calc(50% - 4px)` | 16 · 12 · 8 | 기본 |
| 3 | `calc((100% - 32px) / 3)` | 16 | `md` |
| 4 | `calc((100% - 48px) / 4)` | 16 | `md` |
| 5 | `calc((100% - 64px) / 5)` | 16 | `md` |

  `calc(33.3333% - 8px)`(`lg`), `calc(25% - 8px)` · `calc(50% - 8px)`(`xl`)처럼 12컬럼 분수형도 있다. 이런 비율 분할은 flex 비율(`flex: 7 1 0` 등)로 만든다.

```css
.partition-box--cells { flex-direction: row; flex-wrap: wrap; --cols: 2; --cell-gap: var(--space-16); gap: var(--cell-gap); }
.partition-box--cells > .content-box {
  flex: 0 0 calc((100% - (var(--cols) - 1) * var(--cell-gap)) / var(--cols));
}
@media (min-width: 768px)  { .partition-box--cells { --cols: 3; } }
@media (min-width: 1280px) { .partition-box--cells { --cols: 4; } }
```
> 비율형 분할(예: 7:5)이 필요하면 `flex: 7 1 0` / `flex: 5 1 0`처럼 **flex 비율**로 나눈다. 12컬럼 Grid 문법(`col-span`)은 쓰지 않는다.

### D4.6 적용 예시 (MUST 형태)

```html
<section class="section section--category">
  <div class="inner-box">
    <div class="partition-box partition-box--cells">
      <div class="content-box">…카드…</div>
      <div class="content-box">…카드…</div>
      <div class="content-box">…카드…</div>
    </div>
  </div>
</section>
```

### D4.7 금지 (MUST NOT)
- 겉박스를 `.inner-box` **없이** 사용하거나, `.inner-box`를 **중첩**하는 것
- `.inner-box` 바로 아래에 파티션 박스 없이 콘텐츠를 직접 배치하는 것(분할이 필요 없는 단일 블록도 파티션 박스 1개로 감싼다)
- 박스 단계를 **임의로 추가**(파티션 안의 파티션 중첩 2단 이상)하는 것 — 중첩이 필요하면 내용박스 안에서 해결한다
- 파티션 박스에 `display: grid`, `float`, 절대 위치 레이아웃 사용

---

## D5. 컴포넌트 · 상태

### D5.1 상태 규칙 (MUST) 【수정】

| 상태 | 표현 |
|------|------|
| hover (일반) | 배경 투명도 변화(`/5`, `/60`, `/80`) 또는 흑↔백 반전, 또는 `opacity: .7 → 1` (`hover:opacity-70`) |
| hover (accent) | `#FFC700` → `#F4E300` |
| hover (카드 이미지) | `transform: scale(1.03)` · `scale(1.05)`(`lg:group-hover:scale-105`), 일부 `scale(1.1)`. 원본은 **`lg` 이상**에서 쓴다 |
| hover (목록) | 한 항목에 hover 시 나머지 `opacity: .6` (`lg` 이상, `:has(> :hover)`) |
| focus-visible | `outline: 2px solid`. **원본은 배경과 무관하게 `accent-yellow`**. `outline-offset`은 `2px` · `4px` · 내부 요소 `-2px`가 모두 쓰인다. 프로젝트 색 규칙은 D1.4(밝은 배경 검정 / 어두운 배경 노랑) |
| focus (입력) | 테두리 `greyscale-900`, 또는 `focus-visible:border-accent-yellow` |
| focus-within (검색창) | 배경 `greyscale-white / .8` + blur 프로스트 |
| selected (라디오·체크) | `outline: 1px solid` 라이트 `greyscale-black` / 다크 `greyscale-white` |
| disabled | `opacity: .3`(원본 `disabled:opacity-30`) + `cursor: not-allowed` |
| 로딩 | `pulse`(2s, `cubic-bezier(.4,0,.6,1)`, 무한, 불투명도 .5 — 스켈레톤) · `spin`(1s, linear, 무한 — 스피너) |
| 오류 | 텍스트 `--accent-red` + 아이콘 + 필드 아래 메시지, 필드 아웃라인 `accent-red` (색에만 의존하지 않는다) |

- `outline: none`은 쓰지 않는다. 쓸 때는 `outline: 2px solid transparent`처럼 **투명 아웃라인으로 대체**한다(원본 `focus:outline-none`과 같은 방식, `outline-offset: 2px`).
- 호버 효과는 터치 기기에 의존하지 않는다. 【수정】 **`@media (hover: hover)`는 원본 CSS에 없다.** 터치 오작동을 막기 위한 **프로젝트 추가 규칙**이므로 hover 규칙은 이 쿼리 안에 둔다.
- 포커스 링 색이 원본(배경 무관 노랑)과 다른 이유는 흰 배경에서 노랑 링의 대비가 약 1.6:1이기 때문이다. 원본과 똑같이 하길 원하면 사용자 확인(D10-13).

### D5.2 컴포넌트 명세

| 컴포넌트 | 박스 | 서체 | 색 | 비고 |
|----------|------|------|----|------|
| **button (solid-dark)** | 높이 `40/44/56` · 가로 `16/24` | `mono-sm`~`mono-md` | `greyscale-black` 배경 / white | hover 반전 또는 투명도 |
| **button (solid-light)** | 동일 | 동일 | white 배경 / black (다크 모드용) | hover `white/80` |
| **button (accent)** | 동일 | 동일 | `accent-yellow` 배경 / black | hover `#F4E300` |
| **button (ghost)** | 동일 | 동일 | 투명 / `--color-text` | hover `greyscale-900/5` 틴트 |
| **header** | 높이 64px(확인 필요) | 네비 `mono-sm` | `--color-bg` 또는 프로스트 | sticky, `--z-sticky`. 로고 `type-logo` |
| **card** | 패딩 16 · 반경 8 · 이미지 비율 D3.5 | 제목 `type-product-name`, 설명 `body-sm` | `--color-surface` | 이미지 `object-fit: cover` |
| **tag / chip** | 패딩 `4~8 / 8~16` · 반경 4 | `mono-sm` | 투명 / `--color-text` | 1px 테두리 (확인 필요) |
| **input** | 높이 44+ · 패딩 가로 16 | 입력값 `type-text-field`(LatteraMonoLL 16px, 자간 −0.04em) | 플레이스홀더 **`greyscale-800`**(AA 4.97:1). 다크 `greyscale-default` | 라벨이 플레이스홀더를 대신하지 않는다(A3.3). 원본은 **플로팅 라벨**: 비어 있을 땐 16px `NType82` 원문 표기(`normal-case`), 포커스 시 12px LatteraMonoLL 대문자로 바뀌며 `top 8px · left 16px`에서 `−16px` 위로 올라가고 배경 `greyscale-100` · 가로 패딩 `4px` |
| **overlay** | 전체 화면 · `--z-overlay` | — | `black / .2`(Hydrogen) 또는 `black / .6` | 열림 `opacity .4s` |
| **side panel (장바구니·검색)** | 폭 `400px` | — | `--color-bg` | 우측에서 슬라이드 `.2s ease-in-out`, `--shadow-float` |
| **footer** | 세로 패딩 큼 | `mono-sm` 링크 | 밝은/어두운 면 (확인 필요) | 링크 그룹은 파티션 `--wrap` |

---

## D6. 이미지 · 영상 (미디어 밴드)

- **풀블리드 처리**: 미디어는 **겉박스(`section`)** 가 배경으로 가지고, 텍스트 오버레이는 **`.inner-box` 안 파티션 박스**에 둔다. 미디어를 `.inner-box` 안에 넣지 않는다.
- 풀블리드 미디어는 **반경 0**, 카드형 이미지는 **반경 8px**.
- 비율은 D3.5. 이미지는 `object-fit: cover`, `width/height` 또는 `aspect-ratio`를 반드시 지정한다.
- 사진 위 텍스트: 하단 정렬 + `--color-on-media` + **검정 그라디언트 오버레이**(`to top`, `greyscale-black / .6 → transparent`)로 대비를 확보한다.
- 데스크톱에서 사진 위 텍스트가 배경에 묻힐 때 `mix-blend-mode: difference`를 쓰는 패턴이 있다(`md` 이상, SHOULD NOT — 접근성 대비 확인 후에만).
- **LQIP(저화질 선로딩)**: 이미지 컨테이너에 `.lqip` 클래스를 두고 로딩 전 블러 이미지를 깔았다가 교체하는 방식이다. 구현할 경우 `loading="lazy"` + 작은 placeholder 배경을 쓴다(SHOULD).
  - 【추가】 원본 값: `::before`에 `background-image: var(--lqip)`, `filter: blur(24px)`, `inset: -15%`, `background-size: cover`. 투명 변형은 `blur(15px)`, `inset: 0`. 이미지는 `opacity .4s ease-out`으로 나타나고, 로딩 중(`data-pending`)에는 `opacity: 0`. 모바일(`<768px`)은 `--lqip-mobile`을 쓴다.
- 영상(히어로·캠페인): `muted` + `playsinline` + `poster` 필수. 자동 재생 시 **일시정지 수단**을 제공하고, `prefers-reduced-motion: reduce`에서는 자동 재생하지 않는다.
- 이미지 안에 텍스트를 굽지 않는다. 장식 이미지는 `alt=""`.

```css
.section--media { position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: flex-end; }
.section--media > .media { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.section--media::after { content: ""; position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(to top, rgb(var(--greyscale-black) / .6), transparent); }
.section--media > .inner-box { position: relative; z-index: 1; padding-block: var(--space-32); color: var(--color-on-media); }
```

---

## D7. 모션 · 스크롤

- 전환 시간: **`.1s` / `.15s` / `.2s` / `.22s` / `.3s` / `.4s`(오버레이·LQIP) / `.5s`**(지연 `.1s` / `.5s`), 이징 `cubic-bezier(.4, 0, .2, 1)`(ease-in-out), 이미지 페이드는 `cubic-bezier(0, 0, .2, 1)`(ease-out). 속성은 명시한다(`opacity`, `transform`, `color`, `background-color`, `border-color`). `transition: all` 금지. 【수정】 (원본에도 `transition-all`이 있으나 프로젝트는 금지)
- 카드 hover 확대는 `transform: scale(1.03 ~ 1.05)`(원본에는 `1.1`도 있으나 카드에는 1.05까지만 쓴다).
- 【추가】 **스크롤바**: 원본 `.custom-scroll`은 `scrollbar-width: thin`, `scrollbar-color: #B1B3B3 transparent`, 웹킷 폭 `10px`, 트랙 투명, 썸 `#B1B3B3`(= `--greyscale-default`) · 반경 `999px`다. 숨김은 `.hide-scrollbar`(`scrollbar-width: none`). 모달·드로어가 열릴 때 본문 잠금은 `.no-scroll`(`width: 100%; overflow: hidden; padding-right: var(--scrollbar-width)`)로 하고 `body`에 `--scrollbar-width`를 둔다(B4.6).
- 【추가】 `scroll-behavior: smooth`(`scroll-smooth`)와 앵커 오프셋용 `scroll-margin`(`.25 / 1.25rem`)이 쓰인다.
- 【추가】 `@property --fade-top`, `--fade-bottom`, `--band`, `--waveform-low / mid / high`는 **특정 섹션(스크롤 페이드·오디오 파형) 전용**이다. 사용자가 지시할 때만 구현한다.
- 사이트 전체에 **`prefers-reduced-motion: reduce`** 를 적용한다. 원본은 일부 요소의 `transition`만 끄지만, 본 프로젝트는 B3.6의 전역 규칙을 따라 **애니메이션과 자동 재생도 함께 줄인다.**
- 원본은 **Lenis**(스무스 스크롤 라이브러리)를 쓴다. 외부 라이브러리이므로 **승인 없이 추가하지 않는다**(C4). 기본은 CSS(`scroll-behavior: smooth` + reduced-motion 해제)로 처리한다.
- 스크롤 고정(핀) 섹션(`position: sticky` + `height: calc(100vh + hold)`) 같은 스크롤 연출은 **사용자가 지시할 때만** 구현한다.

---

## D8. 참고: 메인 페이지 섹션 맵 (구조 예시)

> 텍스트는 구조 참고용이며, 실제 문구는 사용자 지시를 따른다.

| # | 섹션 | 겉박스 | 파티션 구성 (예시) |
|---|------|--------|--------------------|
| 1 | 히어로 | `section--media` (영상) | 하단: 제품 라벨(Ndot) · 헤드라인 · 버튼 |
| 2 | Shop by category | `section` | 제목 / 카테고리 링크 4개(`--cells`) |
| 3 | 캠페인 밴드 | `section--media` | 헤드라인 + 링크 버튼 |
| 4 | Going pink? | `section` | 제목 / 제품 3개(`--cells`) |
| 5 | Pack your sound | `section` | 제목·설명 / 제품 카드 2개(이미지 4:3 + 제품명 + 설명 + 버튼) |
| 6 | 캠페인 밴드 2 | `section--media` | 라벨 + 헤드라인 + 버튼 |
| 7 | Join the community | `section` | 제목·설명 / 이메일 입력 + 가입 버튼 + 약관 문구 |
| 8 | 푸터 | `footer` | 링크 그룹 3~4개(`--wrap`) + 스토어·언어·동의 설정 |

---

## D9. 체크리스트 (타겟 사이트)

- [ ] `body > header + main + footer`, `main > section`만 존재한다
- [ ] 모든 겉박스 안에 `.inner-box`가 **하나** 있고 `max-width: 1792px`로 중앙 정렬된다
- [ ] 파티션 박스가 **flex**이며 `display: grid`를 쓰지 않았다
- [ ] `flex-wrap`은 줄바꿈이 필요한 파티션에만 적용했다
- [ ] 색은 D1 토큰만 쓰고 소스에 `#hex` 직접 값이 없다
- [ ] Accent는 신호용으로만 쓰고, 포커스 링 색이 배경에 맞게(밝은 배경 검정 / 어두운 배경 노랑) 바뀐다
- [ ] 다크 모드(`.dark` / `.light`)에서 텍스트 대비가 유지된다
- [ ] 반경은 0 / 4 / 8px만, 그림자는 `--shadow-sm`·`--shadow-float`만 쓴다. pill이 없다
- [ ] 서체 역할이 지켜졌다(Ndot=제품명, NType82=헤드라인·본문, LatteraMonoLL=라벨)
- [ ] `lang="ko"` 텍스트에 굵기 100을 쓰지 않았다. 폰트 굵기가 `@font-face` 값과 일치한다
- [ ] 타입 스케일 외의 크기, 임의 굵기(500/600/700)가 없다. 9px·10px 글자가 없다
- [ ] `type-category` · `type-logo` · `type-callout`은 대문자, `type-product-name`은 소문자이며 한국어에는 `-cs`(변환 없음)를 쓴다
- [ ] 플레이스홀더는 `greyscale-800`, disabled는 `opacity: .3`이다
- [ ] `.inner-box` 폭 1792px는 패딩을 포함하며(`border-box`), 계단식 `.container`를 쓰지 않았다
- [ ] 카드 행 폭이 D4.5의 계산식(`calc((100% - (n-1) × gap) / n)`)으로 만들어졌다
- [ ] 간격이 D3.1 토큰만 사용한다. 섹션 패딩이 변수로 주입된다
- [ ] 컨트롤 높이 40/44/56px, 터치 영역 44px 이상
- [ ] 미디어 밴드는 겉박스 배경, 텍스트는 `.inner-box` 안에 있다
- [ ] 폰트 파일을 외부 CDN에서 직접 불러오지 않았다

## D10. 확인 필요 항목 (사용자에게 확인 후 확정) 【수정】

> 이번 재검증으로 **CSS만으로 풀린 항목은 `✔`**, 여전히 HTML·사용자 확인이 필요한 항목은 `?`로 표시했다.

1. `?` **메인 페이지 HTML**: 받은 HTML 2개(`낫싱사이트.zip` 포함)는 빈 페이지와 서비스워커 iframe이다. 브라우저에서 kr.nothing.tech를 “다른 이름으로 저장 → 웹페이지, 완전”으로 저장한 HTML을 받으면 요소별 클래스 매핑(헤더·버튼·카드 등)을 확정할 수 있다.
2. `?` **폰트 파일**: Ndot / NType82 / LatteraMonoLL 파일 보유 여부와 라이선스
3. `?` **속박스가 실제로 적용되는 요소**: `max-w-screen-3xl`(1792px)이 어느 섹션에 걸리는지. (좌우 패딩 패턴 16→24→40→64는 `✔` 확인, 요소별 적용만 `?`)
4. `?` **버튼·칩·입력창**의 실제 반경(4px / 8px)과 높이(40 / 44 / 56px 중 기본값)
5. `?` **헤더**: 실제 높이(템플릿 64px, 원본에 `h-[72px]`도 있음), sticky 여부, 프로스트·투명 처리
6. `?` **`.uppercase` 클래스가 붙는 위치**와 자간 `0.1em` · `0.025em` 적용처. (`✔` 대소문자 기본값은 D2.2, 입력 글자 −0.04em도 확인)
7. `?` **Geist / Geist Mono** 사용 여부
8. `?` `#000`과 `#040404`의 혼용 기준 (이 문서는 `#040404`로 통일)
9. `?` **다크 모드**: 기본값, 토글 방식(OS 설정 / 수동). (`✔` 선택자 구조는 `:is(.dark *):not(:is(.light, .light *))` 확인, 미디어 쿼리 `prefers-color-scheme`은 CSS에 없음 → 수동 토글로 추정)
10. `?` 히어로 초대형 텍스트(`2.7rem` / `5rem` / `6rem` / `9vw`) 사용처. (`✔` `--accent-blue`는 **배경(`bg-accent-blue`)에서만** 쓰임)
11. `?` 푸터 배경(밝음 / 어두움)과 세로 패딩
12. `?` **`rounded-full`(9999px) · `rounded-sm`(2px) · `rounded-md`(6px)** 의 사용처. 정원형만인지, pill 형태도 있는지 확인 후 A1.5 · D3.2 · C4의 pill 금지 문구를 확정한다
13. `?` **포커스 링 색**: 원본은 배경과 무관하게 `accent-yellow`다. 프로젝트는 AA(3:1)를 위해 밝은 배경에서 검정을 쓴다. 원본 그대로를 원하는지 확인
14. `?` **대형 섹션 세로 패딩**(`208 · 240 · 256px`)이 쓰이는 섹션과 `--wrapper-pt/pb`에 주입되는 실제 값
15. `?` **플레이스홀더 색**: 원본은 `greyscale-600 · 800 · 900`이 혼용된다. 프로젝트는 AA를 위해 `800`으로 통일했다. 요소별 원본 값이 필요하면 확인

# 5. Definition of Done (최종 체크리스트)

### 디자인
- [ ] 모든 값이 토큰 기반이다 (하드코딩 없음)
- [ ] 명도 대비 AA 통과, 색상에만 의존한 정보 전달 없음
- [ ] 4px 기반 간격 토큰(D3.1)·타입 스케일(D2.2) 준수【수정】
- [ ] 모든 상태(hover/focus/active/disabled/loading/error/empty) 구현

### 개발
- [ ] 시맨틱 HTML, 제목 위계 정상, 인라인 스타일/이벤트 없음
- [ ] BEM·네이밍 규칙 준수, `!important`·id 선택자 없음
- [ ] 전역 변수 없음, 모듈 구조 유지, 매직 넘버 없음
- [ ] 이벤트 위임·캐싱 적용, `innerHTML` 위험 사용 없음
- [ ] 에러 처리 및 로딩/실패 UI 구현

### 품질
- [ ] 콘솔 에러·경고 0건
- [ ] 375 / 768 / 1280px에서 정상, 가로 스크롤 없음
- [ ] 키보드 단독 조작 가능, 포커스 표시 명확
- [ ] `prefers-reduced-motion` 대응
- [ ] 이미지 최적화(크기·포맷·alt·lazy) 완료
- [ ] Lighthouse 목표치(각 90+) 충족

### 타겟 사이트 (Nothing KR) 【추가】
- [ ] D9 체크리스트 전 항목 통과
- [ ] D10 확인 필요 항목을 임의로 확정하지 않았다

---

## 부록. 규약 변경 절차
1. 규약 변경이 필요하면 **변경 사유와 영향 범위**를 먼저 제안한다.
2. 사용자 승인 후 본 문서를 수정한다.
3. 수정 이력은 아래에 기록한다.

| 날짜 | 변경 내용 | 사유 |
|------|-----------|------|
| 2026-11-02 | 최초 작성 | 프로젝트 규약 수립 |
| 2026-11-02 | PART D 추가, A1.2~A1.5·A2.2·A2.3·A3.2·B3.2·C1·C4 수정 | 타겟 사이트(kr.nothing.tech) 디자인 및 박스 구조 반영 |
| 2026-11-02 | 사이트 CSS 직접 분석 반영: PART D 전면 개정, A1.2~A1.6·A2.1~A2.3·A3.2·B3.2 재수정 | 외부 자료 기반 추정값 정정(색상·다크모드·반경·그림자·컨테이너 1792px·한국어 굵기 등) |
| 2026-11-02 | CSS 전수 재검증(`낫싱사이트.zip`): D0.4 신설, D1.1b·D4.5 표 추가, D1.3·D3.1~D3.6·D5.1·D10 개정, A1.4·A1.5·A3.2·B3.2·B3.3·§5 정정 | 이전 판 수치 18건 정정·보강(간격 토큰 누락, disabled .3, 대소문자, 모바일 4컬럼 삭제, 0.5px 삭제, hover 쿼리 출처, 대비 수치 등). ZIP의 HTML은 여전히 빈 페이지 |
