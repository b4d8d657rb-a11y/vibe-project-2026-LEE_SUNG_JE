# 작업 이력 및 프로젝트 인계 문서 (Task History)

본 문서는 프로젝트의 전체 진행 내역과 현재 구현 상태, 에셋 매핑 및 규칙 준수 사항을 총괄 기록하여 다음 작업 시 중복 작업 없이 연속적인 개발이 가능하도록 관리하는 문서입니다.

---

## 1. 현재 구현 구조 및 페이지 구성 요약

* 기술 스택: HTML5, CSS3, Vanilla JavaScript (ES2022+), BEM 네이밍
* 레이아웃 규칙: `spec-kit/agents.md`의 **D4 3단 박스 구조** (`겉박스 > .inner-box > .partition-box > .content-box`) 철저 준수
* 페이지 전체 구조 (`index.html`):
  * **고정 헤더 (`site-header`)**:
    * 햄버거 버튼 (`header__menu-button`): `images/d/hbg.svg` 적용
    * 브랜드 로고 (`header__brand`): `images/d/logo.svg` 적용
    * 풀스크린 슬라이드 메뉴 오버레이 (`site-menu`): 키보드 트랩, ESC 닫기, 스크롤 잠금, 카테고리 링크 및 푸터 링크 구성
  * **좌측 고정 인디케이터 (`hero-indicator`)**
  * **메인 콘텐츠 (`main#main-content`)**:
    1. **섹션 1 - 히어로 섹션 (`section.section--hero.dark`)**:
       * 배경 동영상: `images/d/main_video.mp4` (`autoplay loop muted playsinline`)
       * 메인 전체에 걸친 도트 그리드 배경 레이어와 텍스트 레이어
       * 콘텐츠: "HEADPHONE (1) PRO" 제품 라벨, "스튜디오급 정밀함을 담은, 역대 가장 진보한 헤드폰." 타이틀
       * CTA 버튼: "자세히 보기" + `images/d/main.svg` 화살표
    2. **섹션 2 - 카테고리별 쇼핑 섹션 (`section.section--category.light`)**:
       * 콘텐츠 높이에 맞춘 밝은 연회색 배경(`--greyscale-100`); 도트 패턴은 메인 공통 배경 사용
       * 헤더: "카테고리별 쇼핑" 타이틀 (데스크톱 중앙 정렬, 태블릿/모바일 좌측 정렬)
       * 4대 제품 카테고리 카드 (`.category-grid`):
         * 이어폰: `images/d/nothing-dt-1.jpg` + "이어폰" 링크 + `images/d/card.svg`
         * 헤드폰: `images/d/nothing-dt-4.jpg` + "헤드폰" 링크 + `images/d/card.svg`
         * 스마트폰: `images/d/nothing-dt-18.jpg` + "스마트폰" 링크 + `images/d/card.svg`
         * CMF: `images/d/nothing-dt-17.jpg` + "CMF" 링크 + `images/d/card.svg`
       * 반응형: 데스크톱 4열 균등 배치, 태블릿 3.2개 노출 가로 스크롤, 모바일 2.2개 노출 가로 스크롤 (스크롤바 숨김)
    3. **섹션 3 - 캠페인 앰배서더 V 섹션 (`section.section--campaign.dark`)**:
       * 전체 화면(100svh), 배경 동영상: `images/d/main_2.mp4` (`autoplay loop muted playsinline`)
       * 오버레이: 가독성 확보용 그라디언트 비네팅(`::before`); 도트 패턴은 메인 공통 배경 사용
       * 타이틀: "Headphone (1) Pro의" (에디토리얼 세리프 폰트), "새로운 글로벌 브랜드 앰배서더 V와 함께한", "촬영 현장" 3줄 헤딩
       * CTA 버튼 (`.campaign__action-box`): 화면 우측 하단(`bottom: 20px; right: 30px;`), 흰색 버튼 "캠페인 보기" + `images/d/main.svg` 화살표
    4. **섹션 4 - "핑크로 가볼까요?" 제품 섹션 (`section.section--pink.light`)**:
       * 전체 화면(100svh), 밝은 연회색 배경(`--greyscale-100`); 도트 패턴은 메인 공통 배경 사용
       * 헤더: "핑크로 가볼까요?" 타이틀 (D4 박스 규약 준수)
       * 3대 핑크 에디션 제품 카드 (`.pink-card`):
         * HEADPHONE (A): `images/d/nothing-dt-14.jpg` (1080×1080) + "HEADPHONE (A)" 모노스페이스 밑줄 링크 + `images/d/card.svg`
         * PHONE (4A) PRO: `images/d/nothing-dt-5.jpg` (2000×1500) + "PHONE (4A) PRO" 모노스페이스 밑줄 링크 + `images/d/card.svg`
         * EAR (3A): `images/d/nothing-dt-7.jpg` (2000×1500) + "EAR (3A)" 모노스페이스 밑줄 링크 + `images/d/card.svg`
       * 반응형 레이아웃:
         * 데스크톱 (`> 1024px`): 12컬럼 비대칭 스태거드 그리드 (좌측 5열 헤드폰 1:1, 우측 상단 5열 스마트폰 4:3, 우측 하단 4열 이어폰 4:3)
         * 태블릿 (`768px - 1024px`): 1:1 정사각 카드 2.3개 노출 가로 스크롤 캐러셀 (스크롤바 숨김)
         * 모바일 (`<= 767px`): 1:1 정사각 카드 1개 + 다음 카드 힌트 노출 가로 스크롤 캐러셀 (clamp 폭)
  * **푸터 (`site-footer`)**: NOTHING ® 브랜드 표기

---

## 2. 상세 작업 히스토리 (역순)

### [2026-11-04] 컬렉션 슬라이더 자동 넘김
* **요청 사항**: 컬렉션의 이미지가 3초마다 자동으로 스와이프되도록 구성.
* **구현 상태**:
  * 주요 제품 이미지와 제품 갤러리 모두 3초 간격 자동 넘김을 적용하고, 사용자가 조작해도 자동 전환이 계속되도록 설정.
  * `prefers-reduced-motion` 설정이 활성화되면 자동 재생을 비활성화.
* **수정 파일**: `js/modules/collection-slider.js`, `task-history/task.md`

### [2026-11-04] 컬렉션 탐색 버튼에 main.svg 적용
* **요청 사항**: 첨부한 네 컬렉션 탐색 버튼의 화살표 영역에 `main.svg` 아이콘 적용.
* **구현 상태**:
  * 주요 제품 슬라이더와 제품 갤러리의 이전/다음 버튼 아이콘을 `images/d/main.svg`로 교체.
  * 이전 버튼 아이콘은 좌우 반전하고, 기본은 검정·호버 시 흰색으로 표시.
* **수정 파일**: `index.html`, `css/pages/collection.css`, `task-history/task.md`

### [2026-11-04] 전체 화면 메뉴 전환 복원
* **요청 사항**: 아코디언 방식 변경 이전의 메뉴 동작으로 복원.
* **구현 상태**:
  * `css/layout/header.css`: 메뉴를 뷰포트 전체를 덮는 오버레이와 상하 슬라이드 패널로 복원하고, 기기별 닫힘 전환 시간을 유지.
  * `js/main.js`: 메뉴가 열린 동안 페이지 스크롤 잠금, 배경 inert, 키보드 포커스 트랩을 다시 적용.
* **수정 파일**: `css/layout/header.css`, `js/main.js`, `task-history/task.md`

### [2026-11-04] 헤더 메뉴를 아코디언 드롭다운으로 변경
* **요청 사항**: 메뉴의 기존 위아래 슬라이드 전환을 아코디언 방식 표시/숨기기로 변경하고, 메뉴 내부 효과는 유지.
* **구현 상태**:
  * `css/layout/header.css`: 전체 화면 오버레이 대신 헤더 아래에서 펼쳐지는 메뉴로 바꾸고, `grid-template-rows`로 높이를 애니메이션. 기존 메뉴 패널 색상·블러·항목 호버 효과를 유지하고 기기별 닫힘 시간을 유지.
  * `js/main.js`: 닫힘 완료를 아코디언 전환 이벤트로 감지하고 모달 전용 페이지 스크롤 잠금·배경 inert·포커스 트랩을 제거. 메뉴 토글, Escape 닫기, 링크 이동 시 닫기, 접근성 속성은 유지.
* **수정 파일**: `css/layout/header.css`, `js/main.js`, `task-history/task.md`

### [2026-11-04] 푸터 링크 호버 효과 적용
* **요청 사항**: 푸터 회사 소개, 플랫폼, 법률, 소셜 링크에 링크 및 호버 색상 효과 적용.
* **구현 상태**:
  * 회사 소개 제목을 `#community`로 연결되는 앵커로 변경.
  * 플랫폼·법률·소셜 항목은 기존 앵커를 유지하고, 네 영역 링크에 호버 시 `rgb(89 90 90)` 색상 적용.
* **수정 파일**: `index.html`, `css/layout/footer.css`, `task-history/task.md`

### [2026-11-04] 푸터 설정 메뉴를 도트 패턴 위에 배치
* **요청 사항**: 도트 패턴이 푸터 설정 메뉴 영역에 겹칠 때 메뉴 아래에 보이도록 조정.
* **구현 상태**:
  * `css/layout/footer.css`: 푸터 섹션 전체가 아닌 `footer__settings`만 도트 레이어 아래에 두고, 제목·플랫폼·하단 링크는 패턴 위에 유지. 불필요한 부모 transform stacking context를 피하도록 푸터 본문 중앙 배치를 inset과 auto margin으로 구성.
* **수정 파일**: `css/layout/footer.css`, `task-history/task.md`

### [2026-11-04] 메인 도트 패턴을 공통 배경으로 통합
* **요청 사항**: 섹션별 도트 패턴을 제거하고 메인 전체 배경으로 통합해 스크롤에 따라 움직이도록 구성.
* **구현 상태**:
  * `index.html`: 도트 패턴 요소를 `body`의 첫 번째 자식으로 이동하고, `main` 내부의 패턴 전용 섹션은 제거.
  * `css/pages/home.css`: 패턴을 뷰포트에 고정된 한 화면 높이(`100svh`) 레이어로 두어 스크롤 중에도 따라오게 하고, 도트 간격을 192px로 넓힘. `pointer-events: none`으로 콘텐츠 조작을 방해하지 않음.
  * 개별 섹션과 푸터의 자체 도트 패턴은 제거하고, 캠페인 섹션의 그라디언트 오버레이는 유지.
* **검증 결과**:
  * 브라우저에서 데스크톱, 태블릿, 모바일 폭에서 공통 배경을 확인.
  * 페이지 스크롤 시 메인 배경 레이어가 메인 콘텐츠와 함께 이동하고, 메인 섹션에 개별 도트 패턴이 없는 것 확인.
* **수정 파일**: `index.html`, `css/pages/home.css`, `task-history/task.md`

### [2026-11-04] 메뉴 닫기 후 스크롤 헤더 동작 복구
* **요청 사항**: 메뉴를 닫은 뒤 데스크톱 스크롤 방향에 따른 헤더 숨김/표시가 작동하지 않는 문제 수정.
* **원인 및 수정**:
  * 메뉴 닫기 시 마우스 클릭으로 복귀된 햄버거 버튼에 포커스가 남아 `header.contains(document.activeElement)` 조건이 계속 숨김을 막음.
  * 키보드 조작에 필요한 포커스 보호는 `:focus-visible`인 경우에만 적용.
* **검증 결과**:
  * 메뉴를 연 뒤 닫고 위로 스크롤하면 헤더 표시, 아래로 스크롤하면 다시 숨김 확인.
  * JS 구문 검사 및 에디터 진단 오류 없음.
* **수정 파일**: `js/modules/header-scroll.js`, `task-history/task.md`

### [2026-11-04] 스크롤 헤더에서 메뉴 전체 화면 전환 복구
* **요청 사항**: 메뉴를 열고 닫을 때 내려오고 올라가는 모션이 보이지 않는 문제 수정.
* **원인 및 수정**:
  * 스크롤 숨김을 위한 헤더 `transform`이 열린 메뉴의 `position: fixed` 기준 블록이 되어 오버레이 높이를 헤더 높이로 제한.
  * 데스크톱 메뉴가 열린 동안 헤더 `transform`과 전환을 해제해 메뉴가 뷰포트 전체 기준으로 배치되도록 수정.
* **검증 결과**:
  * 브라우저에서 열린 메뉴 오버레이 높이가 뷰포트 전체인 것 확인.
  * 패널이 화면 위쪽에서 내려오고, 닫을 때 위로 올라간 뒤 메뉴 상태가 정리되는 것 확인.
* **수정 파일**: `css/layout/header.css`, `task-history/task.md`

### [2026-11-04] 데스크톱 스크롤 방향에 따른 헤더 표시
* **요청 사항**: 데스크톱에서 아래로 스크롤하면 상단 메뉴를 숨기고, 위로 스크롤하면 다시 표시.
* **구현 상태**:
  * `js/modules/header-scroll.js`: requestAnimationFrame으로 스크롤 방향을 확인하고, 메뉴가 열렸거나 헤더에 포커스가 있을 때는 항상 표시.
  * `css/layout/header.css`: 1025px 이상 미디어쿼리에서 헤더 슬라이드 전환을 적용. 모바일·태블릿 레이아웃은 기존대로 고정.
  * `js/main.js`: 헤더 스크롤 모듈 초기화.
* **검증 결과**:
  * 데스크톱에서 아래 스크롤 시 숨김, 위 스크롤 시 표시 확인.
  * 메뉴를 연 상태에서 헤더가 계속 표시되는 것 확인.
  * 태블릿·모바일에서는 스크롤 방향과 관계없이 헤더가 표시되는 것 확인.
  * JS 구문 및 에디터 진단 오류 없음.
* **수정 파일**: `css/layout/header.css`, `js/main.js`, `js/modules/header-scroll.js`, `task-history/task.md`

### [2026-11-04] 사운드 섹션 하단 패딩 조정
* **요청 사항**: 사운드 섹션 하단 패딩을 100px로 조정.
* **구현 상태**:
  * `css/pages/home.css`: `.section--sound`의 하단 패딩을 100px로 변경하고, 기존 상단 패딩과 반응형 설정은 유지.
* **수정 파일**: `css/pages/home.css`, `task-history/task.md`

### [2026-11-04] 카테고리 섹션 높이를 콘텐츠에 맞게 조정
* **요청 사항**: 카테고리 섹션이 다른 섹션보다 화면을 과도하게 차지해 비율을 조화롭게 조정.
* **구현 상태**:
  * `css/pages/home.css`: `.section--category`의 `min-height: 100svh`를 제거해 제목·카드·여백 기반 높이로 표시되도록 변경.
  * 기존 반응형 카드 폭과 내부 간격은 유지.
* **수정 파일**: `css/pages/home.css`, `task-history/task.md`

### [2026-11-04] 컬렉션 Swiper 섹션 및 데스크톱 드래그 구현
* **요청 사항**:
  * 데스크톱에서 좌우로 스와이프할 수 있는 Swiper 컬렉션 구현.
  * 오른쪽 제품 카드 8장과 왼쪽 큰 이미지 3장을 각각 슬라이드로 구성.
  * 기존 제품 이미지를 재사용.
* **구현 상태**:
  * `index.html`: 카테고리 섹션 바로 다음에 D4 박스 구조를 따르는 컬렉션 섹션 배치. 오른쪽 8개 카드와 왼쪽 3장 슬라이더를 별도로 구성.
  * `css/pages/collection.css`: 반응형 카드 배치, 이미지 비율, 슬라이더 탐색 버튼 및 키보드 포커스 스타일 정의.
  * Swiper 11.2.10의 브라우저 번들과 CSS를 로컬 `js/vendor/`, `css/vendor/`에 포함해 CDN 없이 동작하도록 구성하고 MIT 라이선스를 보존.
  * `js/modules/collection-slider.js`: 두 Swiper의 드래그·버튼 탐색을 초기화하고 모션 감소 설정에서는 전환 시간을 0으로 처리.
* **검증 결과**:
  * 데스크톱에서 오른쪽 드래그와 왼쪽 탐색 버튼 동작 확인.
  * 375px / 768px / 1280px에서 반응형 배치와 가로 넘침 없음 확인.
  * 11개 이미지 로드 성공, 브라우저 오류 없음.
* **수정 파일**: `index.html`, `css/main.css`, `css/pages/collection.css`, `js/main.js`, `js/modules/collection-slider.js`, Swiper 로컬 번들·스타일·라이선스

### [2026-11-04] "핑크로 가볼까요?" 신규 섹션 구현 (파트 4)
* **요청 사항**:
  * 첫 번째 페이지와 동일한 전체 화면(100svh)을 채우는 `main > section` 생성.
  * 상단 메뉴 등 고정 요소는 그대로 두고 별도 박스로 구성된 신규 요소만 구현.
  * 제공된 이미지(데스크톱 `e1.png`, 태블릿 `e2.png`, 모바일 `e3.png`)를 정밀 분석하여 요구사항 반영.
  * 이미지는 `images/` 폴더 내 에셋 사용.
* **구현 상태**:
  * `index.html`: `section.section--pink.light` 추가 (D4 규약: `section > .inner-box > .partition-box > .content-box`).
  * `css/components/card.css`: 신규 `.pink-card` 컴포넌트 추가 (8px 라운드, LatteraMonoLL 모노스페이스 대문자 라벨, 밑줄 오프셋, `card.svg` 화살표 아이콘, 호버 확대 모션).
  * `css/pages/home.css`:
    * 80px × 80px 도트 그리드 배경 레이어 (`--pink-dot-pattern`).
    * 데스크톱 (`> 1024px`): 12컬럼 비대칭 스태거드 그리드 (좌측 헤드폰, 우측 상단 스마트폰, 우측 하단 이어폰).
    * 태블릿 (`768px - 1024px`): 1:1 정사각 카드 2.3개 노출 가로 스크롤 캐러셀.
    * 모바일 (`<= 767px`): 1:1 정사각 카드 1개 + 다음 카드 노출 가로 스크롤 캐러셀.
* **수정 파일**: `index.html`, `css/components/card.css`, `css/pages/home.css`, `task-history/task.md`

### [2026-11-04] 캠페인 CTA 버튼 위치 조정
* **요청 사항**: `.campaign__action-box` 상자가 위로 올라와 있어 `bottom: 20px; right: 30px;`로 위치 조정.
* **구현 상태**:
  * `.partition-box--campaign`에 있던 `position: relative`를 해제하여 버튼 상자가 텍스트 콘텐츠 바로 아래에 종속되지 않고 풀스크린 섹션 및 이너 박스를 기준으로 배치되도록 수정.
  * `.campaign__action-box`에 `position: absolute; right: 30px; bottom: 20px;` 지정 및 모바일 오버라이드 정리.
* **수정 파일**: `css/pages/home.css`

### [2026-11-04] 텍스트 및 인코딩 무결성 복구
* **요청 사항**: 편집 과정에서 발생한 한글 텍스트 깨짐 손상 복구.
* **구현 상태**:
  * `index.html` 전체를 순수 UTF-8로 재작성하여 헤더(내비게이션 링크, 접근성 라벨), 히어로 섹션(타이틀, 버튼), 카테고리 섹션(제목, 4대 제품명), 캠페인 섹션(3줄 카피, 버튼), 푸터의 한글 및 특수기호를 100% 정상 복구.
* **수정 파일**: `index.html`

### [2026-11-04] 캠페인 앰배서더 V 동영상 배경 섹션 구현 (파트 3)
* **요청 사항**:
  * 첫 번째 페이지와 동일한 전체 화면(100svh)을 채우는 `main > section` 생성.
  * 배경으로 `images/d/main_2.mp4` 동영상 자동 재생(`autoplay loop muted playsinline`).
  * 제공된 이미지(`m2.png`)를 분석하여 좌측 중앙 3줄 타이틀과 우측 하단 "캠페인 보기 >" CTA 버튼 구현.
* **구현 상태**:
  * `index.html`: `section.section--campaign.dark` 추가 및 D4 박스 규약 준수.
  * `css/pages/home.css`: 100svh 뷰포트 높이, 동영상 전체 화면 커버(`object-fit: cover`), 비네팅 및 도트 패턴 레이어, 반응형 타이포그래피 구현.
* **수정 파일**: `index.html`, `css/pages/home.css`

### [2026-11-03] 헤더 메뉴 및 브랜드 로고 SVG 교체
* **요청 사항**:
  * `header__menu-mark` 요소를 `images/d/hbg.svg`로 교체.
  * `header__brand` 텍스트를 `images/d/logo.svg`로 교체.
* **구현 상태**:
  * `index.html`: 햄버거 버튼과 브랜드 링크 내부에 정규 SVG 이미지 태그 적용.
  * `css/layout/header.css`: CSS 가상 요소(`::before`, `::after`) 선 그리기를 제거하고 16×16px 아이콘 크기로 조정, `.header__brand-logo` 높이 14px로 정렬.
* **수정 파일**: `index.html`, `css/layout/header.css`

### [2026-11-03] CTA 버튼 및 카드 화살표 SVG 교체
* **요청 사항**:
  * `.button__arrow`를 `images/d/main.svg`로 교체.
  * `.category-card__arrow`를 `images/d/card.svg`로 교체.
* **구현 상태**:
  * 텍스트 기호(`›`, `>`)를 각각 지정된 16×16px 정규 SVG 이미지로 교체하고 `css/components/button.css`, `css/components/card.css`에서 정렬 스타일 최적화.
* **수정 파일**: `index.html`, `css/components/button.css`, `css/components/card.css`

### [2026-11-03] 카테고리별 쇼핑 섹션 신규 구현 (파트 2)
* **요청 사항**:
  * 전체 화면을 채우는 2번째 섹션 생성 (`main > section`).
  * 데스크톱, 태블릿, 모바일 스크린샷(`d1.png`, `d2.png`, `d3.png`) 분석을 반영한 레이아웃 구현.
* **구현 상태**:
  * `index.html`: `section.section--category.light` 추가.
  * `css/components/card.css`: 신규 카드 컴포넌트(1:1 정사각 미디어, 8px 라운드, 밑줄 링크, 호버 시 1.04 배율 확대) 작성 및 `main.css` 등록.
  * `css/pages/home.css`: 데스크톱 4열 그리드, 태블릿 3.2개 노출 가로 스크롤, 모바일 2.2개 노출 가로 스크롤 구현.
* **수정 파일**: `index.html`, `css/main.css`, `css/components/card.css`, `css/pages/home.css`

### [2026-11-03] 반응형 전체 메뉴 오버레이 (파트 1)
* **구현 상태**: 햄버거 버튼 클릭 시 화면 전체를 덮는 드로어 메뉴 구현. 슬라이드 애니메이션, 배경 블러, ESC 키 및 배경 클릭 닫기, 스크롤 잠금 적용.
* **수정 파일**: `index.html`, `css/layout/header.css`, `js/main.js`

### [2026-11-03] 히어로 섹션 및 배경 동영상 구성
* **구현 상태**: `images/d/main_video.mp4`를 배경으로 배치하고, D6 규약에 따라 비디오 컨트롤 숨김, 키보드 접근성 토글 제공, 텍스트 레이어 배치.
* **수정 파일**: `index.html`, `css/pages/home.css`, `js/main.js`

---

## 3. 에셋 및 미디어 매핑 표

| 구분 | 파일 경로 | 용도 | 적용 요소 |
|---|---|---|---|
| **동영상** | `images/d/main_video.mp4` | 히어로 배경 비디오 | `section--hero > .main-video` |
| **동영상** | `images/d/main_2.mp4` | 캠페인 앰배서더 V 배경 비디오 | `section--campaign > .campaign__video` |
| **SVG** | `images/d/hbg.svg` | 상단 헤더 햄버거 메뉴 아이콘 | `.header__menu-mark` |
| **SVG** | `images/d/logo.svg` | NOTHING 브랜드 로고 | `.header__brand-logo`, `.site-menu__brand` |
| **SVG** | `images/d/main.svg` | CTA 버튼 chevron 화살표 | `.button__arrow` (히어로 및 캠페인) |
| **SVG** | `images/d/card.svg` | 카테고리 카드 링크 chevron 화살표 | `.category-card__arrow` |
| **SVG** | `images/d/menu_1.svg` | 전체 메뉴 닫기(X) 아이콘 | `.site-menu__close-mark` |
| **이미지** | `images/d/nothing-dt-1.jpg` | 이어폰 카테고리 제품 이미지 (1000×1000) | 카테고리 카드 1 |
| **이미지** | `images/d/nothing-dt-4.jpg` | 헤드폰 카테고리 제품 이미지 (1000×1000) | 카테고리 카드 2 |
| **이미지** | `images/d/nothing-dt-18.jpg` | 스마트폰 카테고리 제품 이미지 (1000×1000) | 카테고리 카드 3 |
| **이미지** | `images/d/nothing-dt-17.jpg` | CMF 카테고리 제품 이미지 (1000×1000) | 카테고리 카드 4 |
| **이미지** | `images/d/nothing-dt-14.jpg` | HEADPHONE (A) 핑크 제품 이미지 (1080×1080) | 핑크 카드 1 |
| **이미지** | `images/d/nothing-dt-5.jpg` | PHONE (4A) PRO 핑크 제품 이미지 (2000×1500) | 핑크 카드 2 |
| **이미지** | `images/d/nothing-dt-7.jpg` | EAR (3A) 핑크 제품 이미지 (2000×1500) | 핑크 카드 3 |

---

## 4. 파일 구조 및 역할

```
├── index.html                 # 메인 단일 진입 페이지 (3개 풀스크린 섹션 구성)
├── README.md                  # 프로젝트 기본 안내
├── css/
│   ├── base/
│   │   ├── tokens.css         # Greyscale/Accent 색상, 간격, 타이포그래피 디자인 토큰
│   │   ├── reset.css          # 크로스 브라우징 리셋
│   │   └── typography.css     # 기본 서체 및 행간 정의
│   ├── layout/
│   │   ├── box.css            # D4 규약 박스 모델 (.inner-box, .partition-box, .content-box)
│   │   ├── header.css         # 상단 헤더 및 전체 슬라이드 메뉴 오버레이 스타일
│   │   └── footer.css         # 하단 기본 푸터 스타일
│   ├── components/
│   │   ├── button.css         # 재사용 CTA 버튼 컴포넌트
│   │   └── card.css           # 카테고리 제품 카드 컴포넌트
│   ├── pages/
│   │   └── home.css           # 히어로, 카테고리 쇼핑, 캠페인 V 섹션 전용 레이아웃/모션
│   ├── utilities.css          # 접근성 시각 숨김(.visually-hidden) 등 유틸리티
│   └── main.css               # CSS 진입점 (@import 번들링)
├── js/
│   └── main.js                # 메뉴 오버레이 인터랙션 및 비디오 재생 제어
└── task-history/
    └── task.md                # 전체 작업 이력 및 프로젝트 인계 문서 (본 파일)
```

---

## 5. 다음 작업 시작 시 필수 확인 사항

1. **작업 전 본 파일(`task-history/task.md`) 필독**: 이미 완료된 작업(헤더, 히어로, 카테고리 쇼핑, 캠페인 비디오 등)을 중복 작업하거나 덮어쓰지 않습니다.
2. **D4 박스 구조 유지**: 새 섹션을 추가할 때 반드시 `section > .inner-box > .partition-box > .content-box` 규칙을 따릅니다.
3. **고정 요소 유지**: 헤더, 메뉴, 인디케이터 등 기존 고정 요소는 별도 요청이 없는 한 임의 수정하지 않습니다.
4. **검증 가이드**: 구현이 에러 없이 완료된 경우, 불필요한 브라우저 스크린샷 캡처나 부가 테스트 스크립트 실행은 진행하지 않고 즉시 사용자에게 결과를 안내합니다.