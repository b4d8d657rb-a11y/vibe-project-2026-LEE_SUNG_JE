# PRD — Nothing Tech 기반 이커머스 쇼케이스 웹앱

## 프로젝트 개요
- **벤치마킹 대상**: https://kr.nothing.tech/
- **목적**: 낫싱 코리아 웹사이트의 하드웨어 감성과 미니멀리즘을 반영한 이커머스 쇼케이스 웹앱 구현
- **기술 스택**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, Framer Motion, Zustand

## 1. 제품 요구사항

### 1.1 프로젝트 목표
미니멀리즘과 테크 감성이 결합된 브랜드 경험을 제공하고, 제품 탐색부터 구매까지 원활한 이커머스 경험을 구현한다.

### 1.2 대상 사용자
테크 감성, 독창적인 디자인, 미니멀리즘을 선호하는 얼리어답터 및 MZ세대.

### 1.3 브랜드 및 UI/UX 정체성
- **하드웨어 투명성 시각화**: 제품의 독특한 하드웨어 조형미를 모션과 고해상도 그래픽으로 표현한다.
- **그리드 중심 레이아웃**: 대담하고 정갈한 비대칭 그리드로 시각적 질서를 구축한다.
- **타이포그래피 미학**: Dot Matrix 폰트와 산세리프 폰트의 대비를 통해 스포티한 감성을 연출한다.

### 1.4 정보 구조 및 주요 사용자 흐름
- **글로벌 네비게이션**
  - Phone: 제품 라인업 및 스펙
  - Audio: 이어폰 라인업 및 사운드 스펙
  - Accessories: 케이스, 충전기 등
  - Community: 소식 및 뉴스레터
- **메인 화면**
  - 최신 제품을 강조하는 Hero Section
  - 제품 라인업을 탐색하는 Product Grid
  - 브랜드 철학을 전달하는 Brand Story / Philosophy
  - 주요 기능과 스펙을 보여주는 Interactive Spec Section
- **구매 흐름**
  - 우측 Quick View Drawer
  - 장바구니 및 미니멀 결제 페이지

## 2. 프런트엔드 요구사항

### 2.1 디자인 토큰

#### 컬러 팔레트
- Background Main: `#000000` (Pitch Black)
- Background Sub: `#F4F4F4` (Off White)
- Accent Red: `#D71920` (Nothing Red)
- Text Primary: `#FFFFFF` / `#000000`
- Text Muted: `#888888`

#### 타이포그래피
- Primary: NDS (Dot Matrix 커스텀 폰트)
- Secondary: Sans-Serif (Pretendard / Inter)

### 2.2 컴포넌트 아키텍처 및 기능 명세

- **헤더 및 GNB (`Header.tsx`)**
  - 스크롤 하강 시 숨기고, 상단으로 돌아올 때 노출되는 스티키 애니메이션
  - 모바일 풀스크린 드롭다운 메뉴
- **히어로 섹션 (`HeroSection.tsx`)**
  - 반응형 대형 텍스트 오버레이와 최적화된 배경 그래픽(WebP / AVIF)
  - CTA 버튼 호버 반전 효과
- **인터랙티브 스펙 카드 (`SpecGrid.tsx`)**
  - CSS Grid 기반 비대칭 카드 배치
  - 호버 시 내부 회로/스펙 이미지 확대 애니메이션
- **미니 장바구니 드로어 (`CartDrawer.tsx`)**
  - Zustand와 연동한 실시간 장바구니 담기 및 수량 조절
  - 우측에서 슬라이드되는 오버레이

### 2.3 제안 프로젝트 구조

```text
src/
├── app/
│   ├── layout.tsx (Global GNB, Footer, Font Provider)
│   ├── page.tsx (Hero, Product Showcase Grid, Sticky CTA)
│   └── [product]/page.tsx (Dynamic Product Detail Page)
├── components/
│   ├── common/ (Button, DotText, Header, Footer)
│   ├── home/ (HeroBanner, SpecGrid, BrandStory)
│   └── checkout/ (MiniCart, CheckoutDrawer)
└── styles/
    └── globals.css (Dot matrix utilities, custom scrollbar)
```
