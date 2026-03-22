# SteinbachOnline Renewal — 기획 문서

> 이 파일은 개발 시작 전 Claude와 대화를 통해 채워나가는 기획 문서입니다.
> 모든 섹션이 확정된 후 개발을 시작하세요.

---

## 0. 진행 방식

이 문서를 Claude에게 제공하면, Claude는 비어있는 항목을 하나씩 질문해서 함께 채워나갑니다.
모든 항목이 채워지면 그때 개발을 시작합니다.

**Claude에게 전달할 첫 메시지 예시:**
> "PROJECT_TEMPLATE.md 파일을 읽고, 비어있는 항목을 순서대로 질문해서 기획을 완성해줘."

---

## 1. 프로젝트 정의

- **프로젝트명:** SteinbachOnline Renewal
- **한 줄 설명:** 캐나다 지역 뉴스 포털 사이트 10개를 위한 모던 리디자인 (steinbachonline.com 기준 템플릿)
- **목적:** 포트폴리오
- **타겟 유저:** 캐나다 소도시 주민 (지역 뉴스, 날씨, 이벤트, 라디오를 소비하는 커뮤니티 유저)
- **레퍼런스 사이트:**
  - URL: https://www.daum.net/ → 참고할 점: 포털 레이아웃 구조 (뉴스 섹션 탭, 사이드바 날씨 위젯, 카테고리별 콘텐츠 블록, 다크모드)
  - URL: https://www.naver.com/ → 참고할 점: 모바일 퍼스트 UX, 실시간 뉴스 피드, 깔끔한 카드 레이아웃, 서비스 아이콘 네비게이션
  - URL: https://steinbachonline.com/ → 참고할 점: 현재 기능 구조 및 콘텐츠 타입 (그대로 유지할 기능의 베이스라인)
- **참고하지 않을 것:**
  - Daum/Naver의 쇼핑, 웹툰, 게임 등 대형 포털 전용 기능
  - 과도한 광고 배치 (현재 사이트의 배너 광고 범람 패턴)
  - Daum의 복잡한 다중 뉴스 소스 탭 구조 (지역 포털에는 과다)

---

## 2. 스코프 확정

### 페이지 목록
개발할 페이지를 모두 나열하고, 각 페이지의 주요 섹션을 정의합니다.

| 페이지 | URL | 주요 섹션 | 우선순위 |
|--------|-----|-----------|---------|
| 홈 | `/` | 히어로 뉴스, 뉴스 피드(탭), 날씨 위젯, 이벤트 프리뷰, 피처 링크, 라디오 플레이어 | P0 |
| 뉴스 목록 | `/news` | 카테고리 필터(Local/Sports/Community), 뉴스 카드 그리드, 페이지네이션 | P0 |
| 뉴스 상세 | `/news/[slug]` | 아티클 본문, 관련 기사, 소셜 공유, 댓글 영역 | P0 |
| 날씨 | `/weather` | 현재 날씨, 시간별 예보, 주간 예보, 경보/주의보 | P1 |
| 이벤트 | `/events` | 이벤트 캘린더, 이벤트 카드 리스트, 카테고리 필터 | P1 |
| 이벤트 상세 | `/events/[slug]` | 이벤트 정보, 지도, 등록 링크 | P1 |
| 라디오/Listen | `/listen` | 라이브 스트리밍 플레이어, 프로그램 스케줄, 최근 방송 | P1 |
| 피처 페이지 | `/features/[slug]` | 각 피처별 커스텀 콘텐츠 (Road Reports, Adoptables 등) | P2 |
| 비즈니스 디렉토리 | `/directory` | 비즈니스 검색, 카테고리 브라우징, 비즈니스 카드 | P2 |
| 구인/구직 | `/classifieds` | 구인 목록, 카테고리 필터, 상세 보기 | P2 |

### 포함하지 않는 것
(나중에 "이거 추가해줘"를 방지하기 위해 명시적으로 제외 항목을 기록)
- 사용자 회원가입/로그인 시스템
- 댓글 기능 (v2 고려)
- 구인/구직 등록 폼 (읽기 전용 목록만)
- 실시간 채팅/포럼
- 쇼핑/이커머스 기능
- 멀티테넌트 관리 대시보드 (10개 사이트 관리용)

### 추후 v2 고려 항목
(지금 당장은 아니지만 나중에 추가할 수 있는 것들)
- 댓글 시스템 (Supabase Realtime 활용)
- 푸시 알림 (Breaking News)
- 멀티테넌트 CMS 대시보드
- 구인/구직 등록 폼
- 광고 관리 시스템
- PWA / 네이티브 앱 변환

---

## 3. 기술 스택

| 항목 | 선택 | 이유 |
|------|------|------|
| 프레임워크 | Next.js 15 (App Router) | SSR/SSG 하이브리드, SEO 최적화, 뉴스 사이트에 필수적인 성능 |
| 스타일링 | CSS Modules | 컴포넌트 스코프 스타일링, 세밀한 제어, 번들 사이즈 최적화 |
| 애니메이션 | Framer Motion | 페이지 트랜지션, 카드 애니메이션, 모달 등 |
| 데이터/백엔드 | Supabase (PostgreSQL) | 이미 MCP 연결됨, 실시간 기능, Row Level Security |
| 인증 | 없음 (v1) | 포트폴리오 목적, 읽기 전용 |
| 배포 | Vercel | Next.js 네이티브 지원, Edge Functions, ISR |
| 기타 라이브러리 | date-fns (날짜), next-themes (다크모드), @supabase/ssr |

---

## 4. 아키텍처 결정

### URL 구조
(개발 전 확정 — 나중에 바꾸면 navigation 전체 수정 필요)
```
/                           → 홈
/news                       → 뉴스 목록
/news/[slug]                → 뉴스 상세
/news/category/[category]   → 카테고리별 뉴스
/weather                    → 날씨
/events                     → 이벤트 목록
/events/[slug]              → 이벤트 상세
/listen                     → 라디오/Listen
/features/[slug]            → 피처 페이지
/directory                  → 비즈니스 디렉토리
/classifieds                → 구인/구직
```

### 폴더 구조
```
src/
├── app/
│   ├── layout.tsx              → 루트 레이아웃 (ThemeProvider, Header, Footer)
│   ├── page.tsx                → 홈
│   ├── news/
│   │   ├── page.tsx            → 뉴스 목록
│   │   ├── [slug]/page.tsx     → 뉴스 상세
│   │   └── category/[category]/page.tsx
│   ├── weather/page.tsx
│   ├── events/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── listen/page.tsx
│   ├── features/[slug]/page.tsx
│   ├── directory/page.tsx
│   └── classifieds/page.tsx
├── components/
│   ├── layout/                 → Header, Footer, Sidebar, Navigation
│   ├── home/                   → HeroNews, NewsFeed, WeatherWidget, EventPreview
│   ├── news/                   → NewsCard, NewsList, CategoryFilter
│   ├── weather/                → WeatherCurrent, WeatherForecast, WeatherAlert
│   ├── events/                 → EventCard, EventCalendar
│   ├── listen/                 → RadioPlayer, ProgramSchedule
│   └── shared/                 → Button, Card, Badge, Modal, Skeleton, ThemeToggle
├── lib/
│   ├── supabase/
│   │   ├── client.ts           → Supabase 클라이언트
│   │   ├── server.ts           → 서버 컴포넌트용
│   │   └── queries.ts          → 데이터 쿼리 함수
│   ├── utils.ts                → 유틸리티 함수
│   └── constants.ts            → 상수 (사이트 설정, 카테고리 등)
├── hooks/                      → useTheme, useWeather, useRadioPlayer
├── types/                      → TypeScript 타입 정의
└── styles/
    ├── globals.css              → CSS 변수, 리셋, 다크/라이트 토큰
    └── variables.css            → 디자인 토큰 (색상, 타이포, 간격)
```

### 네이밍 컨벤션
- 컴포넌트 파일: PascalCase (e.g. `HeroNews.tsx`)
- CSS Module 파일: PascalCase.module.css (e.g. `HeroNews.module.css`)
- CSS Module 클래스: camelCase, component-scoped (e.g. `.heroTitle`)
- 이미지: `steinbach-{용도}-{설명}.{ext}`
- 데이터 파일: camelCase (e.g. `siteConfig.ts`)
- 훅: camelCase, use 접두사 (e.g. `useWeather.ts`)

---

## 5. 컴포넌트 계획

### 공유 컴포넌트 (shared)
여러 페이지에서 재사용될 컴포넌트를 미리 정의합니다.

| 컴포넌트 | 용도 | props |
|---------|------|-------|
| Button | 범용 버튼 | `variant: 'primary' \| 'secondary' \| 'ghost'`, `size`, `href?` |
| Card | 콘텐츠 카드 래퍼 | `children`, `hoverable?`, `className?` |
| Badge | 카테고리/태그 라벨 | `label`, `color`, `size` |
| Modal | 오버레이 모달 | `isOpen`, `onClose`, `children` |
| Skeleton | 로딩 플레이스홀더 | `width`, `height`, `variant` |
| ThemeToggle | 다크/라이트 전환 | 없음 (내부 상태) |
| NewsCard | 뉴스 카드 (썸네일+제목) | `article: Article`, `variant: 'large' \| 'small' \| 'horizontal'` |
| SectionHeader | 섹션 타이틀 + "더보기" 링크 | `title`, `href?`, `tabs?: Tab[]` |
| SearchBar | 검색 입력 | `placeholder`, `onSearch` |

### 페이지별 컴포넌트
각 페이지에서만 쓰이는 컴포넌트를 정의합니다.

| 페이지 | 컴포넌트 | 설명 |
|--------|---------|------|
| 홈 | HeroNews | 대형 피처 뉴스 + 사이드 뉴스 리스트 (Daum 뉴스 섹션 참고) |
| 홈 | NewsFeedTabs | 탭별 뉴스 피드 (주요뉴스/Local/Sports/Community) |
| 홈 | WeatherWidget | 사이드바 날씨 위젯 (현재 온도, 아이콘, 간단 예보) |
| 홈 | EventPreview | 다가오는 이벤트 미니 리스트 |
| 홈 | FeatureLinks | 피처 링크 그리드 (Road Reports, Adoptables 등) |
| 홈 | RadioMiniPlayer | 라디오 미니 플레이어 (헤더 또는 사이드바) |
| 홈 | AnnouncementBanner | 상단 공지 배너 (슬라이드) |
| 날씨 | WeatherHourly | 시간별 예보 차트/리스트 |
| 날씨 | WeatherWeekly | 주간 예보 카드 |
| 라디오 | RadioFullPlayer | 풀사이즈 라디오 플레이어 |
| 라디오 | ProgramSchedule | 방송 프로그램 스케줄표 |

---

## 6. 데이터 구조

### Supabase 테이블 스키마

```ts
// 뉴스 기사
export interface Article {
  id: string
  slug: string
  title: string
  summary: string
  content: string           // HTML or Markdown
  category: 'local-news' | 'sports' | 'community' | 'business'
  featured_image?: string
  author: string
  published_at: string      // ISO datetime
  is_featured: boolean
  is_breaking: boolean
  site_id: string           // 멀티사이트 구분
  created_at: string
  updated_at: string
}

// 이벤트
export interface Event {
  id: string
  slug: string
  title: string
  description: string
  location: string
  start_date: string
  end_date?: string
  image?: string
  category: string
  external_url?: string
  site_id: string
  created_at: string
}

// 날씨 (캐시)
export interface WeatherData {
  id: string
  site_id: string
  temperature: number
  condition: string         // 'sunny' | 'cloudy' | 'rain' | 'snow' | ...
  icon: string
  humidity: number
  wind_speed: number
  forecast_hourly: object   // JSON
  forecast_weekly: object   // JSON
  updated_at: string
}

// 피처
export interface Feature {
  id: string
  slug: string
  title: string
  description: string
  icon?: string
  content: string
  is_active: boolean
  site_id: string
}

// 사이트 설정 (멀티테넌트)
export interface SiteConfig {
  id: string
  site_key: string          // 'steinbachonline' | 'cochranenow' | ...
  name: string              // 'SteinbachOnline.com'
  tagline: string
  domain: string
  logo_url: string
  primary_color: string
  radio_stream_url?: string
  weather_location: string  // 날씨 API 위치 파라미터
  created_at: string
}

// 비즈니스 디렉토리
export interface Business {
  id: string
  name: string
  category: string
  description: string
  address: string
  phone?: string
  website?: string
  image?: string
  site_id: string
}
```

### 외부 데이터 (API / DB)
- 사용할 외부 데이터 소스: Supabase (PostgreSQL), 날씨 API (OpenWeatherMap or WeatherAPI)
- 연동 방식: Supabase Client SDK (@supabase/ssr), REST API (날씨)
- 환경변수 목록:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `WEATHER_API_KEY`
  - `NEXT_PUBLIC_SITE_KEY` (멀티사이트 구분: 'steinbachonline')

---

## 7. 이미지 & 에셋 계획

### 이미지 목록
개발 전에 필요한 이미지를 모두 나열합니다. (없으면 AI 생성 or placeholder 사용)

| 용도 | 파일명 | 해상도 | 비율 | 준비 방법 |
|------|--------|--------|------|---------|
| 사이트 로고 | steinbach-logo.svg | 벡터 | - | 현재 사이트에서 가져오기 or 새로 디자인 |
| 뉴스 썸네일 | 동적 (DB) | 800×450 | 16:9 | Supabase Storage / placeholder |
| 이벤트 이미지 | 동적 (DB) | 600×400 | 3:2 | Supabase Storage / placeholder |
| 날씨 아이콘 세트 | weather-icons/ | 64×64 | 1:1 | SVG 아이콘 세트 (커스텀 or 오픈소스) |
| 카테고리 아이콘 | category-icons/ | 48×48 | 1:1 | SVG |
| OG 이미지 | steinbach-og.png | 1200×630 | - | AI 생성 or 디자인 |
| Favicon | favicon.ico | 32×32 | 1:1 | 로고 기반 |
| 피처 배너 | 동적 (DB) | 400×200 | 2:1 | 각 피처별 배너 이미지 |

### 이미지 해상도 계산 공식
- 컨테이너 너비 × 컬럼 비율 = 표시 너비
- 레티나 대응: 표시 너비 × 2
- aspect-ratio에 따라 높이 계산
- Next.js `Image` 컴포넌트의 `sizes` prop 활용하여 반응형 이미지 최적화

---

## 8. 완료 기준 (Definition of Done)

개발 중에도 이 기준을 보면서 작업합니다.

### 필수
- [ ] `next build` 에러 0개
- [ ] 모든 페이지 링크 동작 확인
- [ ] 모바일(375px) / 태블릿(768px) / 데스크탑(1280px) 레이아웃 확인
- [ ] 이미지 alt 텍스트 전수 확인
- [ ] console.error 0개 (인증 에러 제외)
- [ ] 다크/라이트 모드 토글 정상 동작
- [ ] Supabase 데이터 연동 정상 동작
- [ ] Lighthouse Performance 90+ / Accessibility 90+

### 타겟 브라우저
- [ ] Chrome (최신)
- [ ] Safari (최신)
- [ ] 모바일 Safari (iOS)
- [ ] Firefox (최신)

### 선택
- [ ] WCAG AA 콘트라스트 기준
- [ ] `prefers-reduced-motion` 대응
- [ ] `prefers-color-scheme` 대응 (시스템 다크모드 자동 감지)
- [ ] OG 이미지 / 메타태그 설정
- [ ] 라디오 스트리밍 플레이어 정상 동작

---

## 9. 작업 규칙

> Claude와 협업 시 지켜야 할 규칙을 여기에 기록합니다.

- 응답 언어: 한국어
- 코드 언어: 영어
- 커밋 메시지 언어: 영어
- 설명은 짧고 간단 명료하지만 핵심을 놓치지 않기
- CSS Modules 사용 시 BEM 대신 camelCase 클래스명
- 컴포넌트는 가능한 Server Component 우선, 필요할 때만 'use client'
- 모바일 퍼스트로 스타일링 (min-width 미디어쿼리)
- 다크/라이트 모드는 CSS 변수 기반 토큰 시스템

---

## 10. 멀티사이트 전략

> 이 프로젝트는 10개 사이트를 하나의 코드베이스로 관리합니다.

### 대상 사이트
| 사이트 | 도메인 | 지역 |
|--------|--------|------|
| SteinbachOnline | steinbachonline.com | Steinbach, Manitoba |
| CochraneNow | cochranenow.com | Cochrane, Alberta |
| HighRiver Online | highriveronline.com | High River, Alberta |
| Classic 107 | classic107.com | (라디오 중심) |
| Central Alberta Online | centralalbertaonline.com | Central Alberta |
| Discover Moose Jaw | discovermoosejaw.com | Moose Jaw, Saskatchewan |
| CHVN Radio | chvnradio.com | (라디오 중심) |
| Discover Westman | discoverwestman.com | Westman, Manitoba |
| Okotoks Online | okotoksonline.com | Okotoks, Alberta |
| Discover Humboldt | discoverhumboldt.com | Humboldt, Saskatchewan |

### 차별화 포인트 (사이트별)
- `SiteConfig` 테이블에서 로고, 색상, 라디오 스트림 URL, 날씨 위치 등을 관리
- `NEXT_PUBLIC_SITE_KEY` 환경변수로 사이트 구분
- 공통 컴포넌트/레이아웃은 100% 동일, 데이터만 다르게 주입

---

## 체크리스트 — 개발 시작 전 확인

- [x] 섹션 1 (프로젝트 정의) 완료
- [x] 섹션 2 (스코프) 완료 — 추가 페이지 없음 확인
- [x] 섹션 3 (기술 스택) 완료
- [x] 섹션 4 (아키텍처) 완료 — URL 구조 확정
- [x] 섹션 5 (컴포넌트) 완료
- [x] 섹션 6 (데이터 구조) 완료
- [x] 섹션 7 (이미지 목록) 완료
- [x] 섹션 8 (완료 기준) 확인
- [x] 섹션 9 (작업 규칙) 확인
- [x] 섹션 10 (멀티사이트 전략) 확인
- [x] **위 항목 모두 체크 후 개발 시작**
