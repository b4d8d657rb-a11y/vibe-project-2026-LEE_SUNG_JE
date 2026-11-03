# 작업 이력 및 다음 작업 인계

## 완료된 작업: 헤더 햄버거 메뉴 및 브랜드 로고 SVG 교체

### 요청 사항
- `header__menu-mark` 클래스에 들어간 기존 스타일/요소를 빼고 `images`의 `hbg.svg` 이미지로 교체.
- `header__brand` 클래스에 들어간 텍스트를 빼고 `images`의 `logo.svg` 이미지로 교체.

### 구현 상태
- `index.html`:
  - 햄버거 버튼 안의 빈 span 태그 대신 `<img class="header__menu-mark" src="images/d/hbg.svg" alt="" aria-hidden="true" width="16" height="16">` 적용.
  - 브랜드 링크 안의 텍스트("NOTHING ®") 대신 `<img class="header__brand-logo" src="images/d/logo.svg" alt="NOTHING" width="106" height="14">` 적용.
- `css/layout/header.css`:
  - `.header__menu-mark`에서 CSS 가상 요소(`::before`, `::after`)를 제거하고 16×16px 아이콘 크기로 변경.
  - `.header__brand`에서 텍스트 전용 타이포그래피 스타일을 정리하고 로고 이미지 래퍼로 스타일링, `.header__brand-logo`에 높이 14px(`height: 14px; width: auto;`) 지정.

### 변경 파일
- `index.html`
- `css/layout/header.css`
- `task-history/task.md`

## 완료된 작업: CTA 버튼 화살표 아이콘 main.svg 교체

### 요청 사항
- `.button__arrow` 요소를 `images` 폴더의 `main.svg` 이미지로 교체.

### 구현 상태
- `index.html`: 히어로 섹션 CTA 버튼의 텍스트 기호(`<span>›</span>`)를 `<img class="button__arrow" src="images/d/main.svg" alt="" aria-hidden="true" width="16" height="16">`로 교체.
- `css/components/button.css`: `.button__arrow`를 16×16px 아이콘 크기(`--icon-size-sm`)와 `flex-shrink: 0`, 세로 정렬(`vertical-align: middle`)로 스타일 최적화.

### 변경 파일
- `index.html`
- `css/components/button.css`
- `task-history/task.md`

## 완료된 작업: 카테고리 카드 화살표 아이콘 card.svg 교체

### 요청 사항
- `.category-card__arrow` 요소를 `images` 폴더의 `card.svg` 이미지로 교체.

### 구현 상태
- `index.html`: 4개 카테고리 카드(이어폰, 헤드폰, 스마트폰, CMF)의 텍스트 화살표(`<span>&gt;</span>`)를 `<img class="category-card__arrow" src="images/d/card.svg" alt="" aria-hidden="true" width="16" height="16">`로 교체.
- `css/components/card.css`: `.category-card__arrow`를 16×16px 아이콘 크기(`--icon-size-sm`)와 `flex-shrink: 0`, 세로 정렬(`vertical-align: middle`)로 스타일 최적화.

### 변경 파일
- `index.html`
- `css/components/card.css`
- `task-history/task.md`

## 완료된 작업: 카테고리별 쇼핑 섹션 신규 구현

### 요청 사항
- 첫 번째 페이지와 동일한 전체 화면(100svh)을 채우는 박스를 만들고, 제공된 데스크톱/태블릿/모바일 스크린샷과 같이 `main > section`을 구성하여 페이지를 생성.
- 상단 메뉴 등 고정 요소는 그대로 두고 별도의 박스로 구성된 새로운 요소만 구현.
- 제공된 데스크톱, 태블릿, 모바일 스크린샷 분석을 통한 세부 요구사항 반영.

### 구현 상태
- `index.html`: `main` 요소의 직계 자식으로 `section.section--category.light`를 추가하고 D4 박스 규약(`section > .inner-box > .partition-box > .content-box`)을 준수하여 마크업 구성.
- 4대 카테고리 카드(이어폰, 헤드폰, 스마트폰, CMF) 구성 및 저장소 내 정규 1000×1000 제품 이미지 매핑:
  - 이어폰: `images/d/nothing-dt-1.jpg`
  - 헤드폰: `images/d/nothing-dt-4.jpg`
  - 스마트폰: `images/d/nothing-dt-18.jpg`
  - CMF: `images/d/nothing-dt-17.jpg`
- `css/components/card.css`: BEM 기반 `category-card` 컴포넌트 신규 작성 (정사각 1:1 미디어, 8px 라운드, 밑줄 링크 및 호버 시 이미지 1.04 확대 인터랙션, reduced-motion 지원).
- `css/main.css`: 컴포넌트 순서에 맞춰 `@import url("./components/card.css");` 등록.
- `css/pages/home.css`:
  - `section--category`: 밝은 그레이 배경(`--greyscale-100`) 및 130px/80px 도트 그리드 오버레이 적용.
  - 데스크톱(1025px 이상): 제목 중앙 정렬, 4개 카드 균등 4열 배치(갭 8px).
  - 태블릿(1024px 이하): 제목 좌측 정렬, 가로 스크롤 캐러셀 구성(카드 폭 약 305px, 3.2개 노출, 스크롤바 숨김).
  - 모바일(767px 이하): 제목 좌측 정렬, 가로 스크롤 캐러셀 구성(카드 폭 clamp(240px, 46vw, 342px), 약 2.2개 노출).

### 변경 파일
- `index.html`
- `css/main.css`
- `css/components/card.css`
- `css/pages/home.css`
- `task-history/task.md`

## 완료된 작업: 반응형 전체 메뉴 오버레이

- 스크린샷처럼 데스크톱에서 어두운 블러 배경 위 중앙에 세로형 메뉴 패널을 두고, 작은 화면에서는 화면 너비를 채우도록 반응형 처리했다.
- 카테고리, CMF / NOTHING OS 5.0 서명, 하단 ACCOUNT·지원·COMMUNITY·회사 소개 링크를 구성했다.
- 햄버거 버튼으로 열고, X·ESC·메뉴 링크로 닫으며, 패널 슬라이드 전환과 reduced-motion 설정을 지원한다.
- 메뉴가 열린 동안 스크롤을 잠그고 배경을 inert 처리하며 포커스를 메뉴 안에서 순환시키고, 닫힌 뒤 트랜지션이 끝나면 배경 상호작용을 복원한다.
- React는 README의 Vanilla JS 기술 스택에 맞지 않아 `js/main.js` 모듈을 사용했다.

## 완료된 작업: 스크린샷 기반 반응형 히어로 보정

- 제공된 데스크톱·태블릿·모바일 스크린샷을 참고해 히어로의 배경 패턴과 문구 배치를 보정.
- 데스크톱 기본 스타일 다음에 태블릿(1024px 이하), 모바일(767px 이하) 미디어 쿼리를 둠.
- 뷰포트 높이를 채우고, 가로 넘침이 없으며, 헤더와 인디케이터가 고정됨.

## 후속 변경: 히어로 제품 이미지 제거

- 사용자 요청에 따라 페이지에서 제품 이미지 요소를 제거.
- CTA가 제거된 이미지 ID를 가리키지 않도록 기존 히어로 섹션으로 연결.
- 제품 이미지 전용 CSS와 패턴 오버레이를 정리.

## 후속 변경: 히어로 배경 영상 추가

- 사용자가 선택한 D6 규약에 따라 `.main-video`를 히어로 `section` 배경으로 배치하고 히어로 콘텐츠 위에 겹쳐 표시.
- YouTube 임베드를 저장소의 `images/d/main_video.mp4`로 교체하고, 포스터 이미지·음소거·인라인·반복 재생을 설정.
- 영상 컨트롤을 감추고 영상 클릭을 차단.
- 감소된 동작 설정에서는 자동재생을 끄고, 키보드 포커스 시 이용 가능한 영상 재생/일시정지 버튼을 제공.
- 도트 패턴을 `main` 전체를 덮는 스크롤 레이어로 이동하고, 카테고리 섹션의 중복 패턴을 제거.

## 다음 작업 시작 시

새 작업을 시작하기 전에 이 파일을 읽고, 현재 구현과 변경 요청을 대조해 이미 완료된 작업을 반복하지 않는다. 프로젝트 규칙과 충돌하는 경우에는 `README.md`와 `spec-kit/agents.md`를 우선 확인한다. 이 파일은 이후 작업이 완료될 때 현재 상태에 맞춰 갱신한다.