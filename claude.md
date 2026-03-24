# SteinbachOnline Renewal — Claude Work Guide

## Project Overview
Redesign of 10 Canadian local news portal sites (portfolio). Template built against steinbachonline.com.

## Planning Document
- Always read `PROJECT_TEMPLATE.md` before starting work
- Do not add features not in the spec (prevent scope creep)

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Styling:** SCSS + BEM
- **Animation:** Framer Motion
- **Backend:** Supabase (PostgreSQL)
- **Deploy:** Vercel
- **Theme:** next-themes (dark/light toggle, default: dark)
- **Date:** date-fns

## Code Rules

### Language
- Responses/explanations: Korean (한국어)
- Code / variables / commits: English
- All UI text, labels, placeholders: English only — no Korean anywhere in the UI
- Explanations: short and clear, key points only

### Components
- Server Component first, `'use client'` only when needed
- File names: PascalCase (`HeroNews.tsx`)
- No CSS Modules — use global SCSS with BEM class names
- Props types defined separately in `types/`

### Styling — SCSS + BEM
- **SCSS only** (no Tailwind, no CSS Modules)
- All component styles live in `src/styles/` as partials, imported via `globals.scss`
- **BEM naming:** `.block`, `.block__element`, `.block--modifier`
- Mobile first: `min-width` media queries
- Dark/light: CSS variable token system (`_variables.scss`)
- Color tokens: CSS custom properties in `_variables.scss` (do not hardcode colors)
- SCSS variables (`$breakpoint-md`, `$gradient-search`, etc.) for SCSS-only use

### SCSS File Structure
```
src/styles/
  _variables.scss        ← CSS custom props + SCSS vars
  _reset.scss            ← CSS reset + base typography
  globals.scss           ← entry point (@use all partials) + .page, .page__hero
  layout/
    _header.scss         ← .header, .header__logo, .header__nav ...
    _navigation.scss     ← .navigation, .navigation__link--active ...
  components/
    _search-bar.scss     ← .search-bar, .search-bar__wrapper--focused ...
    _settings-button.scss
    _theme-toggle.scss
    _virtual-keyboard.scss ← draggable QWERTY overlay
```

### Data
- Supabase queries centralized in `lib/supabase/queries.ts`
- Multi-site: `NEXT_PUBLIC_SITE_KEY` env var filters by `site_key` column
- Use ISR: news/events revalidate 60–300s

### Folder Structure
```
src/
├── app/           → page routes
├── components/
│   ├── layout/    → Header, Footer, Sidebar, Navigation
│   ├── home/      → HeroNews, NewsFeed, WeatherWidget
│   ├── news/      → NewsCard, NewsList, CategoryFilter
│   ├── weather/   → WeatherCurrent, WeatherForecast
│   ├── events/    → EventCard, EventCalendar
│   ├── listen/    → RadioPlayer, ProgramSchedule
│   └── shared/    → Button, Card, Badge, Modal, Skeleton, ThemeToggle, SettingsButton
├── lib/supabase/  → client, server, queries
├── hooks/         → useTheme, useWeather, useRadioPlayer
├── types/         → TypeScript interfaces
└── styles/        → globals.scss + partials
```

## Development Priority
1. **P0:** Home, News list, News detail
2. **P1:** Weather, Events, Radio
3. **P2:** Features, Directory, Classifieds

## References
- **Daum (daum.net):** Portal layout, news tabs, sidebar weather, dark mode
- **Naver (naver.com):** Mobile UX, card layout
- **steinbachonline.com:** Existing feature baseline

## Not Referenced
- Daum/Naver shopping, webtoon, gaming features
- Excessive ad placement
- Complex multi-source news tabs

## Multi-site
- 10 sites managed via `SiteConfig` table
- Only logo, colors, radio URL, weather location differ per site
- 100% shared codebase

## Done Criteria
- `next build` 0 errors
- Mobile (375px) / Tablet (768px) / Desktop (1280px) verified
- Dark/light toggle working
- Lighthouse Performance 90+ / Accessibility 90+
- console.error 0

## Progress

### Completed
- [x] Project planning doc (`PROJECT_TEMPLATE.md`)
- [x] Reference research — Daum/Naver style confirmed
- [x] `CLAUDE.md` work guide
- [x] Next.js 15 project init — `create-next-app`, folder structure
- [x] Packages — framer-motion, next-themes, @supabase/ssr, @supabase/supabase-js, date-fns, sass
- [x] Design tokens & global styles — `_variables.scss` (Daum-style light/dark), `globals.scss`
- [x] Supabase client — `client.ts`, `server.ts` (portal schema), `queries.ts`
- [x] TypeScript types — `types/index.ts`
- [x] Supabase DB schema — `portal` schema, 7 tables
- [x] Seed data — 8 articles, 5 events, 1 weather, 5 features, 10 site configs
- [x] `next.config.ts` — image domains, Turbopack root, devIndicators off
- [x] **SCSS + BEM migration** — all components converted from CSS Modules to global SCSS BEM
- [x] **Header** — sticky, logo, ThemeToggle utility
- [x] **Navigation** — desktop category nav + mobile hamburger overlay (scroll-lock-nav pattern)
- [x] **SearchBar** — Daum-style gradient border pill, cancel button, virtual keyboard trigger, icon buttons (52×52)
- [x] **VirtualKeyboard** — draggable QWERTY overlay, `createPortal` to body, `backdrop-filter: blur(24px)`, light/dark styling
- [x] **ThemeToggle** — sun/moon, SSR-safe
- [x] **SettingsButton** — gear button, settings panel (Text Size + Appearance), outside-click & Escape close, System theme fix (`enableSystem: true`)
- [x] **Border-radius tokens** — updated to Daum reference values (2/6/8/10/12/28px)
- [x] **page__hero layout** — hamburger menu button (absolute left) + SearchBar (centered), `position: relative`
- [x] Default theme: dark
- [x] **QuickMenu** — horizontal pill bar (News/Weather/Events/Listen + `...`), Listen panel (radio thumbnails), More panel (grid), responsive scroll on mobile
- [x] **QuickMenu responsive** — mobile: full horizontal scroll, tablet+: 4 items + `...` panel
- [x] **QuickMenu icon gradients** — search bar gradient colors distributed across menu items
- [x] **Listen panel** — 3 radio channel cards (16:9 thumb, logo SVGs, Play badge, channel info)
- [x] **Hamburger button responsive** — all sizes: `position: absolute; right: 8px`; mobile: top-right above search; tablet+: vertically centered with search
- [x] **SearchBar border** — `padding: 1px` (reduced from 2px), focused: `1.5px`
- [x] **Light mode body** — `--color-bg-primary: #f2f4f7`
- [x] **Layout system** — `--max-width: 1168px`, `useBreakpoint` hook (sm/md/lg), homepage 2-col: left 768px + gap 16px + right 384px
- [x] **Home 2-column grid** — `.home__main` 768px / `.home__sidebar` 384px / gap 16px, `layout/_home.scss`, desktop ≥ 1168px grid, mobile single-column stack
- [x] **AdBanner** — left column first card, `_ad-banner.scss`, height 130px
- [x] **LoginPanel** — right column first card, `_login-panel.scss`, height 130px, Sign In btn `--color-site-primary`
- [x] **LivePanel** — left column, 3채널 카드 (16:9, Play badge `#ff4e33`, play triangle red), `_live-panel.scss`
- [x] **AdCard** — right column, Google Ad 336×280 Large Rectangle, `_ad-card.scss`
- [x] **NewsPanel** — left column, 탭 헤더 UI (아이콘 `/ico-news.svg` + News link + 카테고리 탭 6개), `_news-panel.scss`
- [x] **NewsPanel 콘텐츠** — 왼쪽 2×2 이미지 그리드(167px×2, gap 16px) + 오른쪽 텍스트 리스트(8개, ellipsis 1줄), Breaking 뱃지
- [x] **NewsPanel 푸터** — prev/next 원형 버튼(40px, ::after border) + "Top News More" + 페이지 카운터 (1/4)
- [x] **NewsAdBanner** — left column, Google Fluid Responsive Ad (728×90 기준, width:100% height:90px), `_news-ad-banner.scss`
- [x] **ContestPanel** — right sidebar, 슬롯머신 2-col(160×80, gap 16px) 자동 로테이션(3초), 다운버튼 토글 시 전체 리스트 펼침/닫힘, 실제 이미지 7개 (steinbachonline.com CloudFront CDN), `_contest.scss`
- [x] **WeatherWidget** — right sidebar, Daum 스타일 compact 카드 (아이콘 52px + 도시명 + 날씨상태 + 현재기온 + 최저/최고), Basmilius SVG 아이콘, `_weather-widget.scss`
- [x] **WeatherAPI 연동** — `src/lib/weather.ts` (fetchWeather, getWeatherIcon, WEATHER_FALLBACK), WeatherWidget → async Server Component, ISR 300s, `WEATHER_API_KEY` 환경변수 대기 중
- [x] **EventsPanel** — 우측 사이드바 캘린더 위젯, ContestPanel 스타일 3개씩 롤링, 펼침 시 최대 6개 + 미니 캘린더 그리드, `_events-panel.scss`
- [x] **다크모드 body bg** — `--color-bg-primary: #131416`
- [x] **Basmilius Weather Icons** — `/public/weather/` 다운로드 완료 (fill/line/monochrome, SVG animated 236개 each)
- [x] **전역 `.panel` 클래스** — `globals.scss`에 카드 공통 베이스 스타일 (padding:24px, border-radius:20px, light/dark 대응)
- [x] **IA 분석** — steinbachonline.com 35+ 페이지 → 10페이지 재설계, `SITEMAP.md` 작성
- [x] **데이터 소스 준비** — `rss.ts` (8 카테고리), `radar.ts` (MSC GeoMet + EC Alerts), `radio.ts` (3채널 Golden West)
- [x] **`/sitemap` 비주얼 페이지** — 트리 구조 IA 뷰어, priority/status 표시, 접힘 토글, 제거된 페이지 목록
- [x] **레이아웃 템플릿 설계** — `ListPageLayout` / `DetailPageLayout` / `StaticPageLayout` 3종 구조 확정
- [x] **EventsPanel 롤링 버그 수정** — `__event-item`에 `min-height: $slot-item-h(36px)` 추가 → 슬롯 창 아래 다음 그룹 첫 아이템 노출 현상 수정
- [x] **ico-down-arrow 라이트모드 버그** — `events-panel__down-btn`, `events-panel__footer-more`, `contest__down-btn` img에 `[data-theme='light'] filter: invert(1)` 추가 (SVG stroke="white" 하드코딩)
- [x] **ClassifiedsPreview** — Buy & Sell 패널, 2×3 카드 그리드, 탭(For Sale/Jobs/Vehicles), prev/next 페이지네이션, mock 18개, `ico-shopping.svg`, `_classifieds-preview.scss`
- [x] **NewsPanel variants** — `variant` prop 추가: sports / community / local / national / sponsored. Sports: 좌(350×170 featured + 4 list) + 우(4×133×77 thumb). Community: 4-col grid. Local/National/Sponsored: list-thumb 2-col
- [x] **NewsPanel 아이콘 교체** — Ag News(`ico-agriculture.svg`), Community(`ico-community.svg`), Sports(`ico-sports.svg`), Local(`ico-local.svg`), National(`ico-national.svg`), Sponsored(`ico-sponsored.svg`)
- [x] **SidePanel 전면 개편** — 오른쪽 슬라이드 패널 완성
  - Quick links grid: 12개 (News/Weather/Events/Listen/Directory/Buy&Sell/Sports/Funeral/Sponsored/National/AgNews/Community), 아이콘 48×48
  - Listen 패널 (--radio): 2×2 라디오 채널 타일, 높이 72px, 로고 64px
  - Featured 패널 (--flat, 1×3): LocalJobShop(`#fff`)/GarageSale(`#18bc9c`)/HelloGoodBuy(`#fff`) — 높이 64px, 로고 32px
  - Connect 패널 (4×2): Row1=Facebook/Instagram/X/YouTube, Row2=AppStore/ContactUs/SubmitNews/MeetTheTeam
  - Tabs: "Advertise with Us" / "Submit News"
  - z-index: 1100 (> SettingsButton 1000)
  - 라이트모드: grid bg `#fff`, connect-btn bg `#fff`
- [x] **홈페이지 데스크탑 1차 완료** ✅
- [x] **JobsPanel** — 우측 사이드바, Local Job Shop 연동 mock 10개, 펼침 토글(5→10개), `_jobs-panel.scss`
  - 헤더: "Jobs >" 링크 + `__down-btn` (margin-left: auto로 우측 고정)
  - 리스트: `__item:first-child` padding-top 0, highlight dot badge(`#f4492e`), `__type` 12px tertiary
  - 푸터: `justify-content: flex-end`, "Powered by Local Job Shop" 11px tertiary
- [x] **EventsPanel footer 주석처리** — "More events / Less" 토글 버튼 비활성화 (추후 재검토)
- [x] **홈페이지 데스크탑 1.1차 완료** ✅
- [x] **Supabase seed 확충** — sports 29개, community 26개, local-news 25개 (각 패널 3페이지 이상 보장)
- [x] **getTrendingArticles 카테고리별 쿼리** — 전체 top-N 후 필터 방식 → 카테고리별 독립 쿼리로 변경 (`options?: { limit?, category? }`)
- [x] **Top News vs Latest News 차별화** — 배열 회전 전략(`slice(n/3)`) 으로 두 정렬이 서로 다른 기사 세트를 보임
- [x] **`content_html` RSC 페이로드 스트립** — 홈 컴포넌트는 본문 HTML 불필요 → `strip()` 헬퍼로 서버에서 제거, 692KB → 308KB
- [x] **`reactCompiler: false`** — `reactCompiler: true`가 dev 모드에서 `document.readyState = 'complete'` 를 무한 차단하는 버그 확인 → 비활성화. (프로덕션 빌드는 정상 작동 확인)
- [x] **홈페이지 데스크탑 1.2차 완료** ✅
- [x] **SidePanelContext** — `src/context/SidePanelContext.tsx` 생성, `Providers`에서 `SidePanel` 단 한 번 렌더, `MenuButton`은 `useSidePanel().openPanel()` 호출만 → DOM 중복 제거
- [x] **SidePanel 탭 active 동적화** — `useState<'advertise'|'submit'>` 추가, 하드코딩 제거
- [x] **About 페이지 팀 사진** — steinbachonline.com/team 실제 12명 데이터로 교체, CloudFront CDN에서 200×200px PNG 다운로드 → `/public/team/`, 4-col grid (min-width: 981px)
- [x] **About 페이지 Contact 블록** — Contact Information + Send Us a Message 폼 섹션 하단 추가
- [x] **DirectoryPreview** — 우측 사이드바, Supabase `businesses` 상위 3개 (없으면 mock fallback), 알파벳 아이콘 + 이름/카테고리/전화, "View Directory →" 링크, `_directory-preview.scss`
- [x] **NewsletterPanel** — 우측 사이드바, 이메일 입력 + Subscribe 버튼 (`--color-site-primary`), 제출 시 성공 상태, `_newsletter-panel.scss`
- [x] **홈페이지 완성** ✅ — 모든 사이드바 패널 포함
- [x] **Layout Templates 3종** — `ListPageLayout`, `DetailPageLayout`, `StaticPageLayout` + 각 SCSS 완성
- [x] **Static Pages** — `/about`, `/contact`, `/privacy`, `/terms` 완성 (`StaticPageLayout`)
- [x] **`/news`** — `ListPageLayout` + RSS 직접 fetch, 카테고리 필터, featured hero 레이아웃
- [x] **`/news/[slug]`** — `DetailPageLayout` + 기사 본문, 관련 기사 사이드바
- [x] **`/weather`** — WeatherAPI 현재 날씨 + 시간별/일별 예보 대시보드
- [x] **`/weather/radar`** — MSC GeoMet WMS + Leaflet 지도
- [x] **`/events`** — Supabase `events` 캘린더 + 목록 (`ListPageLayout`)
- [x] **`/events/[slug]`** — 이벤트 상세 (`DetailPageLayout`)
- [x] **`/listen`** — 3채널 라디오 플레이어 + Now Playing 폴링 (`ListPageLayout`)
- [x] **`/directory`** — Supabase `businesses` 카테고리별 목록 (`ListPageLayout`)
- [x] **`/classifieds`** — Supabase `classifieds` 3-col 그리드, All/For Sale/Free 탭 (`ListPageLayout`)
- [x] **`sitemap.ts`** — XML 자동 생성, 정적 12개 + RSS 뉴스 100개 + Supabase 이벤트 50개 동적 포함
- [x] **OG Image per route** — root + `/news` + `/weather` + `/events` (edge runtime `ImageResponse`, 1200×630)
- [x] **`robots.ts`** — `userAgent: *`, allow `/`, disallow `/api/` + `/search?*`, sitemap URL 포함
- [x] **`not-found.tsx`** — 404 페이지, 그라데이션 "404" 코드 + 홈/뉴스 버튼, `_not-found.scss`
- [x] **`.env.example`** — Supabase / WeatherAPI / SiteKey / SiteURL 환경변수 문서화
- [x] **Auth UI 데모** — `/login`, `/signup`, `/forgot-password` (`(auth)` route group, `auth-layout`)
  - `layout.tsx`: 로고 + 카드 + 푸터 공통 레이아웃
  - `login/page.tsx`: 이메일/비밀번호, show/hide, Remember me, 시뮬레이션 로딩/에러
  - `signup/page.tsx`: 이름/이메일/비밀번호/확인, 강도 바, 약관 체크박스, 성공 상태
  - `forgot-password/page.tsx`: 이메일, 자물쇠 아이콘 헤더, 성공 상태(이메일 발송 확인)
  - `_auth.scss`: 완전한 BEM 스타일 (`auth-layout`, `auth-card`, 스피너 애니메이션)
- [x] **SidePanel Sign In → `/login` 링크** — `<button>` → `<Link href="/login">` 교체
- [x] **`/sitemap` 충돌 수정** — `app/sitemap.ts` default export 제거, `app/sitemap.xml/route.ts` route handler로 XML 서빙, `/ia` 비주얼 IA 뷰어 페이지 유지
- [x] **멤버쉽 페이지** — `(account)` route group, `_account.scss` 완성
  - `layout.tsx`: 사이드바 nav (아바타, Profile/Saved/Settings/Sign Out), mobile horizontal scroll
  - `/account`: 프로필 카드 (아바타+이름+이메일+플랜), Overview 통계 (저장 수/댓글/뉴스레터), 최근 저장 기사 2×2 그리드
  - `/account/settings`: Profile 정보 수정, 비밀번호 변경 (강도/일치 검증), 알림 토글 (iOS 스타일), Danger Zone (계정 삭제 demo)
  - `/account/saved`: 저장 기사 전체 목록, 개별 X 버튼 제거, Clear All, Empty state
  - mock 데이터 12개 기사, 실제 Supabase 연동은 배포 시 교체
- [x] **실제 Supabase Auth 연동** — UI 데모 → 실제 인증으로 전환
  - `src/proxy.ts`: 세션 갱신 + `/account/*` 미인증 시 `/login?redirect=` 리디렉트, 로그인 상태에서 `/login·/signup` 접근 시 홈 리디렉트 (Next.js 16 신규 convention)
  - `login/page.tsx`: `signInWithPassword()` → `router.push(redirect)` + `router.refresh()`
  - `signup/page.tsx`: `signUp()` → 이메일 확인 화면 (emailRedirectTo: `/account`)
  - `forgot-password/page.tsx`: `resetPasswordForEmail()` → 성공 화면 (redirectTo: `/account/settings`)
  - `(account)/layout.tsx`: `supabase.auth.getUser()` + `onAuthStateChange()` → 실제 이름/이메일 표시, Sign Out 핸들러
  - `(account)/account/page.tsx`: 실제 세션에서 이름·이메일·가입일 읽기 (`date-fns format`)
  - `SidePanel.tsx`: `onAuthStateChange()` 구독 → 로그인 상태에 따라 Sign In/Out 동적 전환, Sign Out 핸들러
- [x] **LoginPanel 로그인 상태 재디자인** — height 130px 고정
  - 상단: 아바타(그라데이션 40px 원형) + 이름 + Sign out 버튼
  - 하단: Account / Article / Setting 3-item 메뉴 (아이콘 20×20, 16px, #fff, space-between)
  - Setting 아이콘: gear SVG (톱니바퀴)
  - `USER_UPDATED` 이벤트 핸들러 → 프로필 수정 즉시 반영 (`resolveUser()` 재호출)
- [x] **`/account/settings` 실제 Supabase 연동** — MOCK 제거
  - `getUser()` → 실제 닉네임/이메일 로드
  - `updateUser({ data: { nickname, full_name } })` → 저장 시 Supabase 반영
  - `nickname` 우선 읽기로 LoginPanel / account/page / settings 전체 통일
- [x] **Subscribe 버튼 제거** — `page__hero__actions` + `StickySearchBar`에서 삭제
- [x] **`page__hero__actions` 레이아웃** — 버튼 1개 기준으로 수정
  - 672px~1199px: `width: 48px`, `justify-content: flex-end`
  - 1200px+: `width: 96px` (::before spacer와 대칭 유지, SearchBar 중앙 정렬)
- [x] **아바타 컬러 통일** — `login-panel__avatar`, `side-panel__avatar`, `account-nav__avatar`, `account-profile__avatar` 모두 `linear-gradient(135deg, #4aabf7, #8e54e9)` + `color: #fff` + `border-radius: 50%`
- [x] **SidePanel 아바타 이니셜** — SVG person 아이콘 제거, 로그인 시 이름 첫 글자 / 비로그인 시 `?` 표시 (40×40)
- [x] **SidePanel 뉴스레터 폼** — `side-panel__subscription-btn` 대신 `newsletter-panel__form` (이메일 입력 + Subscribe 버튼) 삽입
- [x] **account 레이아웃 헤더** — `ListPageHeader` (`list-page__head`) 최상단 추가
- [x] **Text Size 기능 구현** — Daum 방식 `zoom` 적용
  - `SettingsButton`: `data-text-size` 속성 → `body { zoom }` + `localStorage` 저장/복원
  - `SidePanel` A+ 버튼 → `FontSizeModal` (createPortal) 오픈
  - `FontSizeModal`: 미리보기 텍스트 + A 크기 버튼 3개 + Cancel/Apply (all English UI)
  - `globals.scss`: `body { zoom: 1.1 / 1.2 }` + fixed 요소 역보정 (`side-panel: 0.9091 / 0.8333`, `font-modal__backdrop: 0.9091 / 0.8333`)

### SearchBar Details
- Gradient border pill (`linear-gradient` wrapper + `padding: 1px`)
- Inner: `#18181b` dark / `#ffffff` light
- Input: `font-size: 20px`, `font-weight: 700`
- Cancel button: shows when `query` truthy
- Btn group: keyboard icon + search icon, `gap: 0`, `padding: 12px` (52×52 touch target)
- Keyboard icon toggles `VirtualKeyboard` component

### VirtualKeyboard Details
- `createPortal(…, document.body)` — avoids stacking context blocking `backdrop-filter`
- `translateZ(0)` in `@keyframes` — keeps GPU compositor layer alive after animation
- Drag: `mousedown` on handle → `window` `mousemove`/`mouseup`
- Initial position: bottom-right (`window.innerWidth - 540`, `window.innerHeight - 320`)
- Shift: one-shot toggle

### page__hero Layout
- `position: relative` on `.page__hero`
- `.page__hero__menu-btn`: `position: absolute; right: 8px`
  - Mobile: `top: 0; height: 48px` — above SearchBar
  - Tablet+: `top: 48px; height: 56px` — vertically aligned with SearchBar
- SearchBar `__section`:
  - Mobile: `padding: 48px 0 0 0; justify-content: flex-start`
  - Tablet (768px+): `padding: 48px 68px 0 16px; justify-content: center`
  - Desktop (1280px+): `padding: 48px 84px 0 16px`

### Layout System
- **Max-width:** `1168px` — desktop container default, CSS var `--max-width: 1168px`
- **Center:** `margin: 0 auto` on all section `__inner` wrappers
- **Homepage 2-column (desktop ≥ 1168px):**
  - Left (main content): `768px`
  - Right (sidebar): `384px`
  - Gap: `16px`
  - Formula: `768 + 16 + 384 = 1168px` (fills max-width exactly)
- **Breakpoints (SCSS vars + `useBreakpoint` hook):**
  - `$breakpoint-sm` / `sm`: `480px`
  - `$breakpoint-md` / `md`: `768px`
  - `$breakpoint-lg` / `lg`: `1168px`

### QuickMenu Details
- Bar items (always visible): News, Weather, Events, Listen
- Extra items (mobile scroll / tablet+ via `...` panel): Local Sports, Ag News, Funeral, Community, Sponsored, Local News, National News, Weather
- Mobile (`< 768px`): all items in horizontal scroll bar, no `...` button
- Tablet+ (`≥ 768px`): 4 bar items + `...` toggle, extra items in absolute panel (720px, `border-radius: 28px`, popup shadow)
- Listen toggle: opens 3-card radio panel (same position/style as `...` panel)
- Icon gradients: derived from search bar gradient `#4aabf7 → #8e54e9 → #e91e8c → #ffb300`
- Light mode item bg: `#ffffff`; dark: `--color-surface-secondary`
- Radio logo SVGs: `/public/radio1-dark.svg`, `radio2-dark.svg`, `radio3-dark.svg`

### 카드 공통 규칙 (필수 준수)
- `padding: 24px`
- `border-radius: 20px`
- 패널 간 `gap: 16px`
- 다크: `background: var(--color-surface-primary)`
- 라이트: `background: #fff`, `box-shadow: rgba(0,0,0,0.04) 0px 0px 4px 0px`
- `[data-theme='light'] & {}` 로 라이트모드 분기

### Site Primary Color
- CSS 변수: `--color-site-primary: #fee200`, `--color-site-primary-hover: #f5da00`, `--color-site-primary-text: #000`
- 사용처: LoginPanel Sign In 버튼, NewsPanel active 탭
- 사이트별 오버라이드: `_variables.scss`에서 값만 변경

### NewsPanel Details
- 헤더 1행: 아이콘(`/ico-news.svg`, 40×40) + `news-panel__title-wrap`(Link) + 탭 바
- `title-wrap` hover: `::after` `inset: -6px -8px`, `background: var(--color-bg-tertiary)`
- 탭: `height: 40px`, `font-size: 15px`, `border: 1px solid #ffffff14` (::after), `color: rgb(255 255 255 / 72%)`
- active 탭: `--color-site-primary` bg, `--color-site-primary-text` color, hover 변화 없음
- 카테고리: Top News(dropdown) / Local / National / Sports / Ag News / Community

### LivePanel Details
- 3채널 카드, `quick-menu__panel--listen` 디자인 동일
- `grid gap: 15px`, thumb `background: #fff` (dark) / `#f2f4f7` (light)
- Play badge: `background: #ff4e33`, play 삼각형: `#ff2d2d`
- 데이터: `LISTEN_CHANNELS` (QuickMenu와 동일)

### page.tsx 목표 컴포넌트 순서 (✅ 완료 / 🔲 미완)
```
page__hero (SearchBar + hamburger)    ✅
QuickMenu                             ✅
section.home
  home__main (768px)
    AdBanner         ← 130px          ✅
    LivePanel        ← 3채널           ✅
    NewsPanel        ← Top News 탭 6개 ✅ (mock data)
    NewsAdBanner     ← 728×90 fluid   ✅
    ClassifiedsPreview ← Buy & Sell, 탭+2×3 그리드        ✅ (mock data)
    SportsPanel      ← NewsPanel variant="sports"             ✅ (mock data)
    NewsAdBanner2    ← 두 번째 광고 배너 (728×90)            ✅
    AgNewsPanel      ← NewsPanel variant="ag", ico-agriculture ✅ (mock data)
    CommunityPanel   ← NewsPanel variant="community", ico-community ✅ (mock data)
    LocalPanel       ← NewsPanel variant="local"             ✅ (mock data)
    NationalPanel    ← NewsPanel variant="national"          ✅ (mock data)
    SponsoredPanel   ← NewsPanel variant="sponsored"         ✅ (mock data)
    ClassifiedsPreview ← Buy & Sell, 탭+2×3 그리드          ✅ (mock data)
  home__sidebar (384px)
    LoginPanel       ← 130px          ✅
    AdCard           ← 336×280        ✅
    WeatherWidget    ← compact 카드    ✅ (API 연동 완료)
    ContestPanel     ← 슬롯머신 토글   ✅
    EventsPanel      ← 캘린더 위젯     ✅ (mock data)
    DirectoryPreview ← 비즈니스 3개 카드 + "View All" 링크  ✅
    NewsletterPanel  ← 이메일 구독 CTA                      ✅
Footer               ← 글로벌 layout 컴포넌트               ✅ (정적)
```

### NewsPanel Details (추가)
- Body: 왼쪽 `__grid` (167px×2 col, gap 16px) + 오른쪽 `__list` (flex:1, min-width:0)
- `__grid`: 2×2 이미지 카드, thumb aspect-ratio 16/9, card-title 16px/20px, card-source 14px/17px
- `__list`: 8개 텍스트 아이템, 1줄 ellipsis (white-space:nowrap), padding은 `__list-link`에 부여(11px 0)
- `__badge`: Breaking 뱃지, `#e8192c`, height 18px, align-self:center
- `__footer`: prev/next 40px 원형 버튼(::after border), "Top News More" span + "1/4" 카운터
- `__body padding-top: 16px`, `__footer border-top: rgba(255,255,255,0.075)`
- 탭 라이트모드: bg #fff, border ::after rgba(0,0,0,0.075), active → site-primary 유지

### ContestPanel Details
- 파일: `src/components/home/ContestPanel.tsx`, `_contest.scss`
- 슬롯머신: `__slot-window` (width:100%, height:80px, overflow:hidden)
- `__slot-track`: 현재행+다음행 수직 스택, `--sliding` 시 `translateY(-80px)` 0.45s cubic-bezier
- `__slot-row`: display:flex, gap:16px (2개 배너 나란히)
- 배너: 160×80, border-radius:8px, `::after` border `rgba(255,255,255,0.08)`
- 다운 버튼: 34px 원형, 클릭 시 슬롯 정지 + `__list--open`으로 전체 배너 그리드 펼침
- 이미지: steinbachonline.com CloudFront CDN 7개 실제 이미지
- `ico-contest.svg`, `ico-down-arrow.svg` → `/public/`

### WeatherWidget Details
- 파일: `src/components/home/WeatherWidget.tsx`, `_weather-widget.scss`
- 구조: 아이콘(52px) + info(flex:1) + temp(right-align)
- 도시명 20px bold / 날씨상태 13px secondary / 현재기온 28px bold / 최저°/최고° 13px tertiary
- **Server Component (async)** — `fetchWeather()` 호출 + `?? WEATHER_FALLBACK`
- ✅ WeatherAPI 연동 완료 — API 키 발급 + `.env.local` 저장 + 실동작 확인

### WeatherAPI Integration
- 파일: `src/lib/weather.ts`
- `fetchWeather(location)`: `https://api.weatherapi.com/v1/forecast.json?key=…&q=…&days=1` — ISR `revalidate: 300`
- `WEATHER_API_KEY` 환경변수 없으면 → `WEATHER_FALLBACK` 반환 (에러 없음)
- `getWeatherIcon(code, isDay)`: WeatherAPI condition code → Basmilius SVG 경로 매핑 (50+ 코드)
- `WEATHER_FALLBACK`: city=Steinbach, condition=Partly Cloudy, temp=-2, high=3, low=-8
- 위치 하드코딩 `'Steinbach, Manitoba'` → TODO: Supabase `SiteConfig.weather_location`으로 교체
- ✅ **API 키 활성**: weatherapi.com 계정 (`buytouch@gmail.com`), Business Trial → Free 자동 전환 (04/02/2026)

### EventsPanel Details
- 파일: `src/components/home/EventsPanel.tsx`, `_events-panel.scss`
- `'use client'` — 롤링 애니메이션, 펼침 토글
- **구조 (column):** `__header` (날짜 + down-btn) → `__body` (슬롯 롤링, 접혔을 때) → `__list` (펼쳤을 때) → `__cal` (미니 캘린더, 펼쳤을 때) → `__footer` (More events 버튼)
- **MOCK_EVENTS**: 2026-03-19 실제 이벤트 10개 (steinbachonline.com/events)
- **롤링**: STEP=3씩, ContestPanel 동일 패턴 (`startInterval`/`stopInterval`, `isHoveredRef`, `isExpandedRef`)
- SCSS 변수: `$slot-item-h: 36px`, `$slot-gap: 8px`, `$slot-rows: 3`, `$slot-total: 124px`
- `__slot-window`: height `$slot-total`, overflow hidden
- `__slot-track--sliding`: `translateY(-$slot-total)` 0.45s cubic-bezier
- 펼침 시: `__list--open` (max 6개) + `__cal` 표시 + `__body--hidden`
- `__tab` (View all events → `/events` 링크): `news-panel__tab` 스타일
- `__footer-more` (More events / Less 토글): bold text button, `ico-down-arrow.svg` 회전
- `__down-btn` (헤더 우상단): `contest__down-btn` 스타일 (34px 원형)
- `__cal-dot`: 이벤트 있는 날짜에 dot 표시 (`--color-site-primary`)
- TODO: MOCK_EVENTS → Supabase `events` 테이블 연동

### ClassifiedsPreview Details
- 파일: `src/components/home/ClassifiedsPreview.tsx`, `_classifieds-preview.scss`
- `'use client'` — 탭 전환, 페이지네이션
- **헤더**: `panel__header` + `panel__title-wrap`(아이콘+타이틀 묶음) + `__tabs`
- **아이콘**: `/public/ico-shopping.svg` (빨간 그라데이션 쇼핑백 48×48)
- **탭**: For Sale / Jobs / Vehicles (NewsPanel 탭 동일 스타일)
- **그리드**: `grid-template-columns: 1fr 1fr`, `gap: 20px`, 6개 표시 (2×3)
- **카드**: `display: flex`, `gap: 10px`, `min-width: 0` (grid item ellipsis 필수)
  - `__thumb`: 162×108px, `border-radius: 8px`, bg placeholder
  - `__card-title`: 16px, 2줄 clamp (`-webkit-line-clamp: 2`)
  - `__card-price`: 14px bold
  - `__card-meta`: 12px tertiary, `padding-top: 4px`
- **푸터**: prev/next 40px 원형 버튼(::after border) + "Buy & Sell More" + "1/1" 카운터
- **데이터**: MOCK_ITEMS 18개 (For Sale 6 / Jobs 6 / Vehicles 6) → TODO: Supabase `classifieds` 연동
- **헬로굿바이(hellogoodbuy.ca) 연동 불가** — 403 봇 차단, API 없음

### ico-down-arrow 라이트모드 처리 패턴
- `/public/ico-down-arrow.svg`는 `stroke="white"` 하드코딩 → `<img>` 태그에서 currentColor 불가
- 라이트모드 처리: `[data-theme='light'] & img { filter: invert(1); }`
- 적용된 컴포넌트: `events-panel__down-btn`, `events-panel__footer-more`, `contest__down-btn`
- 다른 컴포넌트에 흰색 SVG `<img>` 추가 시 동일 패턴 적용 필요

### Basmilius Weather Icons
- 위치: `/public/weather/fill/svg/` (animated, 236개) ← 메인 사용
- `/public/weather/fill/svg-static/` (정적, 236개)
- `/public/weather/line/svg/` (라인 스타일, 236개)
- MIT 라이선스

### Page Build Todo List

레이아웃 템플릿 3종 + 독립 페이지 4종 + 인프라 순서로 진행.

#### ✅ Homepage Panels — 완료

| 상태 | 컴포넌트 | 위치 | 설명 | 데이터 소스 |
|---|---|---|---|---|
| ✅ | `ClassifiedsPreview` | home__main | Buy & Sell, 탭(For Sale/Jobs/Vehicles), 2×3 그리드 | mock → Supabase `classifieds` |
| ✅ | `DirectoryPreview` | home__sidebar | 로컬 비즈니스 3개 카드 + "View Directory" 링크 | Supabase `businesses` (mock fallback) |
| ✅ | `NewsletterPanel` | home__sidebar | 이메일 구독 CTA (입력 + 버튼), 정적 UI | static |
| ✅ | `Footer` | layout (global) | Notice 바 + 링크 + 소셜 아이콘 + Legal + 저작권 | static |

#### ✅ Layout Templates — 완료

| 상태 | 작업 | 파일 | 적용 페이지 |
|---|---|---|---|
| ✅ | `ListPageLayout` | `components/layout/ListPageLayout.tsx` + `_list-page.scss` | `/news`, `/events`, `/directory`, `/classifieds` |
| ✅ | `DetailPageLayout` | `components/layout/DetailPageLayout.tsx` + `_detail-page.scss` | `/news/[slug]`, `/events/[slug]` |
| ✅ | `StaticPageLayout` | `components/layout/StaticPageLayout.tsx` + `_static-page.scss` | `/about`, `/contact`, `/privacy`, `/terms` |

#### ✅ P0 — Core Pages — 완료

| 상태 | 페이지 | 레이아웃 | 데이터 소스 |
|---|---|---|---|
| ✅ | `/` Home | 독립 | weather.ts + RSS |
| ✅ | `/news` | `ListPageLayout` | `rss.ts` → RSS 직접 fetch |
| ✅ | `/news/[slug]` | `DetailPageLayout` | `rss.ts` (slug 기반 fetch) |

#### ✅ P1 — Important Pages — 완료

| 상태 | 페이지 | 레이아웃 | 데이터 소스 |
|---|---|---|---|
| ✅ | `/weather` | 독립 (대시보드형) | `weather.ts` (WeatherAPI) |
| ✅ | `/weather/radar` | 독립 (전체화면 지도) | `radar.ts` (MSC GeoMet WMS) + leaflet |
| ✅ | `/events` | `ListPageLayout` | Supabase `events` 테이블 |
| ✅ | `/events/[slug]` | `DetailPageLayout` | Supabase `events` 테이블 |
| ✅ | `/listen` | 독립 (미디어 플레이어) | `radio.ts` + `/api/radio/now-playing` |

#### ✅ P2 — Later Pages — 완료

| 상태 | 페이지 | 레이아웃 | 데이터 소스 |
|---|---|---|---|
| ✅ | `/directory` | `ListPageLayout` | Supabase `businesses` 테이블 |
| ✅ | `/classifieds` | `ListPageLayout` | Supabase `classifieds` 테이블 |

#### ✅ Static Footer Pages — 완료

`/about`, `/contact`, `/privacy`, `/terms` — 정적 텍스트 (`StaticPageLayout`)

#### 인프라 / 기타

| 상태 | 작업 |
|---|---|
| ✅ | `/api/radio/now-playing` — CORS 프록시 API Route |
| ✅ | RSS 직접 fetch (Option A) 결정 및 적용 |
| ✅ | `sitemap.ts` 충돌 해결 → `app/sitemap.xml/route.ts` route handler로 전환, `/ia` 비주얼 페이지 유지 |
| ✅ | OG Image — root `opengraph-image.tsx` + `/news`, `/weather`, `/events` 커스텀 |
| ✅ | `robots.ts` — crawl rules + sitemap URL |
| ✅ | `not-found.tsx` — 404 페이지 + `_not-found.scss` |
| ✅ | `.env.example` — 환경변수 문서화 |
| ✅ | Auth UI 데모 — `(auth)` route group: `/login`, `/signup`, `/forgot-password` |
| ✅ | SidePanel / LoginPanel Sign In → `/login` 링크 연결 |
| ✅ | 멤버쉽 페이지 구현 — `/account`, `/account/settings`, `/account/saved` (`(account)` route group) |
| 🔲 | Vercel 배포 + 환경변수 설정 (`NEXT_PUBLIC_SITE_URL`, `WEATHER_API_KEY`, Supabase keys) |
| 🔲 | Mac Mini Supabase keep-alive cron job |

### DirectoryPreview Details
- 파일: `src/components/home/DirectoryPreview.tsx`, `_directory-preview.scss`
- **Server Component (async)** — `getBusinesses()` 호출, 결과 없으면 `MOCK_BUSINESSES` fallback, `.slice(0, 3)`
- **구조**: `__header` (Directory > 링크) → `__list` (3개 `__item`) → `__footer` ("View Directory →")
- `__icon`: 40×40px 원형 알파벳 아이콘, `background: var(--color-bg-secondary)`
- `__name`: 15px medium, ellipsis / `__category`, `__phone`: 12px tertiary
- mobile/desktop prop 지원, 다크/라이트 대응

### NewsletterPanel Details
- 파일: `src/components/home/NewsletterPanel.tsx`, `_newsletter-panel.scss`
- `'use client'` — `useState(email)` + `useState(submitted)`
- **구조**: `__header` (그라데이션 아이콘 + title/subtitle) → `__form` (input + btn) → `__note`
- 아이콘: `linear-gradient(135deg, #4aabf7, #8e54e9)` 40px 박스
- 제출 후: `__success` 상태 표시 (파란 체크박스)
- `__btn`: `--color-site-primary` 배경, 100% 너비
- `__note`: "Free · No spam · Unsubscribe anytime" 11px tertiary 중앙정렬
- TODO: 실제 뉴스레터 API 연동

### Auth UI 데모 Details
- Route group: `src/app/(auth)/` — 공통 `layout.tsx` (로고 + 카드 + 푸터)
- `layout.tsx`: `auth-layout` 래퍼, 로고(`/ico-logo-brandcolor.svg`), `auth-layout__card` 안에 `children`, 저작권 푸터
- `login/page.tsx`: `'use client'`, 이메일+비밀번호, show/hide 눈 버튼, Remember me 체크박스, 1.2s 시뮬레이션, 6자 미만 → 에러, 성공 → `window.location.href = '/'`
- `signup/page.tsx`: `'use client'`, 이름+이메일+비밀번호+확인, 강도 바(weak/medium/strong), 확인 불일치 인라인 에러, 약관 체크박스, 1.4s 시뮬레이션, 성공 → 이메일 표시 화면
- `forgot-password/page.tsx`: `'use client'`, 이메일만, 자물쇠 아이콘 헤더, 1s 시뮬레이션, 성공 → 이메일 아이콘 + "Check your email" + Try again
- `_auth.scss`: `.auth-layout` (100dvh 중앙), `.auth-layout__card` (max-width 440px, surface bg, 라이트 shadow), `.auth-card` 모든 하위 BEM (`__title`, `__subtitle`, `__error`, `__form`, `__field`, `__label-row`, `__label`, `__forgot`, `__input-wrap`, `__input`, `__eye-btn`, `__field-error`, `__strength`, `__strength-bar--{weak,medium,strong}`, `__checkbox-row`, `__checkbox`, `__submit`, `__spinner`, `__switch`, `__switch-link`, `__success`, `__success-icon`), `@keyframes auth-spin`

### content_html Strip 패턴 (필수 유지)
- **이유:** RSS 기사의 `content_html`(전체 HTML 본문)이 RSC 페이로드에 포함되면 692KB+ 로 불어남
- **규칙:** `page.tsx`에서 RSS 배열을 NewsPanel에 전달하기 전 반드시 `strip()` 적용
- `strip()` 함수: `articles.map(a => ({ ...a, content_html: '' }))`
- `toTrending()` 함수: Supabase → RssArticle 변환 시 `content_html: ''` 하드코딩
- 홈페이지 기준 현재 페이로드: ~308KB (스트립 전 ~692KB)

### next.config.ts 주의사항
- **`reactCompiler: false`** — 반드시 유지. `true`로 변경 시 개발 서버에서 페이지 무한 로딩 발생
  - 원인: React Compiler가 dev 모드에서 `document.readyState = 'complete'` 이벤트를 차단
  - 프로덕션 빌드(`next build`)에서는 문제 없음, 개발 서버(`next dev`)에서만 발생
- **`devIndicators: false`** — Next.js 개발 배지 숨김 (유지)

### Next.js 16 Proxy (Middleware) 주의사항
- **Next.js 16에서 `middleware.ts` → `proxy.ts`로 convention 변경**
- 실제 auth 로직: `src/proxy.ts` (Supabase 세션 갱신 + `/account/*` 보호)
- `src/middleware.ts` → `src/middleware.ts.bak`으로 이름 변경 (충돌 방지)
- `middleware.ts` (루트) → `middleware.ts.bak`으로 이름 변경 (충돌 방지)
- Next.js 16은 `middleware.ts`와 `proxy.ts`가 동시에 존재하면 빌드 에러 발생
- `src/proxy.ts`만 남겨야 함

### Text Size (Zoom) 구현 상세
- **방식:** `body { zoom }` (Daum 동일) — 텍스트+레이아웃 전체 비율 확대
- **적용:** `globals.scss` — `:root[data-text-size='large'] body { zoom: 1.1 }`, `larger: 1.2`
- **fixed 요소 역보정:** zoom이 fixed 자식에도 상속되므로 side-panel + font-modal에 역보정 적용
  - `large`: `zoom: 0.9091` (1/1.1), `larger`: `zoom: 0.8333` (1/1.2)
- **SettingsButton:** `data-text-size` → `html` 속성 + `localStorage('text-size')` 저장
- **FontSizeModal:** `createPortal` → `document.body`, Esc 닫기, Cancel/Apply 버튼
- **공유:** SettingsButton + SidePanel A+ 버튼이 동일 `localStorage` 키 공유 → 양쪽 연동

### 아바타 공통 스타일 (필수 준수)
- `background: linear-gradient(135deg, #4aabf7, #8e54e9)`
- `color: #fff`
- `border-radius: 50%`
- 텍스트: 이름 첫 글자 대문자 (비로그인: `?`)
- 적용: `login-panel__avatar` (40px) / `side-panel__avatar` (40px) / `account-nav__avatar` (44px) / `account-profile__avatar` (72px)

### LoginPanel --logged-in 상세
- `height: 130px` 고정, `overflow: hidden`, `padding: 12px 20px`
- `__top`: 아바타 + 이름 (Link→/account) + Sign out 버튼
- `__sep`: `margin: 8px 0` 구분선
- `__menu`: `justify-content: space-between`, `padding-top: 4px`
- `__menu-item`: `flex-direction: row`, `gap: 6px`, `font-size: 16px`, `color: #fff`, icon `20×20`
- 라이트모드: `__menu-item color: var(--color-text-primary)`

### getTrendingArticles 사용법
- 카테고리별 trending: `getTrendingArticles({ category: 'sports', limit: 27 })`
- 전체 trending: `getTrendingArticles({ limit: 36 })`
- **주의:** 전체 limit으로 가져온 후 클라이언트에서 필터하면 각 카테고리가 충분한 trending 데이터를 못 받음

### Resume Message
> "Read CLAUDE.md and PROJECT_TEMPLATE.md, then continue from the next step."

---

## steinbachonline.com 데이터 소스 분석 (2026-03-19)

### 원본 사이트 기술 스택
- **Backend:** Ruby on Rails (monolith, SSR)
- **CSRF:** `authenticity_token` (Rails 표준)
- **Assets:** Sprockets (SHA fingerprinted)
- **Image CDN:** CloudFront (`dht7q8fif4gks.cloudfront.net`, `d3355vjhs3bhr1.cloudfront.net`)
- **Image Storage:** S3 (`golden-west-content.s3.amazonaws.com`)
- **Ads:** BroadStreet (`flux.broadstreet.ai`), Google Ad Manager
- **Analytics:** GA4 (`G-7JTYKR7V0J`)

### 외부 API / 데이터 소스 현황

| 소스 | 파일 | 상태 | 비고 |
|------|------|------|------|
| **WeatherAPI** | `src/lib/weather.ts` | ✅ 연동 완료 | API 키 활성, ISR 300s |
| **RSS 뉴스 피드** | `src/lib/rss.ts` | ✅ 연동 완료 | 8개 카테고리, ISR 60s, /news + 홈페이지 적용 |
| **MSC GeoMet WMS (레이더)** | `src/lib/radar.ts` | ✅ 연동 완료 | `/weather/radar` Leaflet 지도 적용 |
| **EC 날씨 경보 ATOM** | `src/lib/radar.ts` | ✅ 연동 완료 | `/weather` 경보 사이드바 적용 |
| **Golden West Streaming** | `src/lib/radio.ts` | ✅ 연동 완료 | `/listen` + `/api/radio/now-playing` 프록시 |
| **Vercel OG Image** | — | 🔲 미착수 | 배포 시 구현 |

### RSS 피드 엔드포인트
- `https://steinbachonline.com/rss/local-news`
- `https://steinbachonline.com/rss/national-news`
- `https://steinbachonline.com/rss/local-sports`
- `https://steinbachonline.com/rss/ag-news`
- `https://steinbachonline.com/rss/community`
- `https://steinbachonline.com/rss/sponsored`
- `https://steinbachonline.com/rss/funeral-announcements`
- `https://steinbachonline.com/rss/all` (3000+ items)

### RSS 아이템 구조
```
<title>      기사 제목
<link>       https://steinbachonline.com/articles/{slug}
<pubDate>    RFC 822 날짜
<dc:creator> 작성자
<description> CDATA HTML (첫 <img> = featured_image, 나머지 = 본문)
<guid>       link과 동일
```
- 카테고리 태그 없음 — 엔드포인트 URL로 구분

### 레이더 (MSC GeoMet)
- WMS 엔드포인트: `https://geo.weather.gc.ca/geomet`
- 레이어: `RADAR_1KM_RRAI` (1km 강수 레이더)
- 지도: Leaflet + WMS TileLayer
- 무료, API 키 불필요, 실시간 6분 간격 갱신

### 라디오 스트리밍 (Golden West)
- AM 1250 (CHSM): `https://goldenweststreaming.com/chsm/console/`
- MIX 96.7 (CILT): `https://goldenweststreaming.com/cilt/console/`
- Country 107.7 (CJXR): `https://goldenweststreaming.com/cjxr/console/`
- Now Playing RDS: `https://www.goldenweststreaming.com/rds/tmp/{CALLSIGN}.html`
- CORS 제한 → Next.js API Route 프록시 필요

### next.config.ts images.remotePatterns (업데이트됨)
- `qylvbmkkuhcijcncaige.supabase.co` — Supabase Storage
- `cdn.weatherapi.com` — WeatherAPI 아이콘
- `dht7q8fif4gks.cloudfront.net` — RSS 기사 이미지
- `golden-west-content.s3.amazonaws.com` — 콘텐츠 이미지
- `d3355vjhs3bhr1.cloudfront.net` — 배너/프로필 이미지

### 페이지별 데이터 소스 매핑

| 페이지 | 기본 데이터 | 사이드바 데이터 | ISR |
|--------|------------|--------------|-----|
| `/news` | `rss.ts` (카테고리별 fetch) | `weather.ts`, `rss.ts` (인기) | 60s |
| `/news/[slug]` | `rss.ts` (slug → 단건) | `rss.ts` (관련 기사 4개) | 300s |
| `/weather` | `weather.ts` (현재 + 7일) | `radar.ts` (EC 경보) | 300s |
| `/weather/radar` | `radar.ts` (MSC GeoMet WMS) | — | 실시간 |
| `/events` | Supabase `events` | `weather.ts` | 60s |
| `/events/[slug]` | Supabase `events` | Supabase `events` (관련) | 60s |
| `/listen` | `radio.ts` (채널 config) | `/api/radio/now-playing` (30s poll) | static |
| `/directory` | Supabase `businesses` | — | 3600s |
| `/classifieds` | Supabase `classifieds` | — | 60s |

### RSS fetch 전략 — ✅ Option A 결정 및 적용
- **Option A — RSS 직접 fetch:** `rss.ts`로 페이지 렌더 시 직접 fetch, ISR 60s
  - 홈페이지 + `/news` 페이지에 적용 완료
  - steinbachonline.com RSS 엔드포인트 직접 사용

### 연동 시 필요 패키지
- `leaflet` + `react-leaflet` + `@types/leaflet` — 레이더 지도
- (기존 설치 완료: framer-motion, next-themes, @supabase/ssr, date-fns, sass)

## Decision Log
- Tech stack: Next.js 15 + SCSS BEM + Supabase + Vercel (free tier)
- Base site: steinbachonline.com
- Design direction: Daum/Naver portal style (dark/light toggle)
- Backend: Supabase Free (instead of existing Rails backend)
- Purpose: Portfolio
- Multi-site: `NEXT_PUBLIC_SITE_KEY` + `SiteConfig` table
- Weather API: WeatherAPI (free 1M/mo) + Environment Canada MSC GeoMet (alerts)
- Design tokens: Daum/Korean portal standard (Primary #0052cc, Accent #ff6600)
- Weather icons: Basmilius Weather Icons (Lottie SVG) → custom at end
- Supabase project: Touch-Moon's Project (`qylvbmkkuhcijcncaige`, us-east-1)
- Buy & Sell 데이터: hellogoodbuy.ca 403 봇 차단 → Supabase mock 유지, 추후 Kijiji RSS 또는 사용자 직접 등록 검토
- Default theme: dark, System mode follows OS via `enableSystem: true`

## Supabase Schema
- **Schema:** `portal` (separate from public)
- **Tables:** site_configs, articles, events, weather_data, features, businesses, classifieds
- **site_key:** text column on all tables for multi-site filtering
- **client/server.ts:** `db: { schema: 'portal' }` option

## Reminders
- [ ] **At project end**: Set up Mac Mini Supabase keep-alive cron job
  - Method: `crontab -e` → `0 9 * * * curl -s "https://<PROJECT_ID>.supabase.co/rest/v1/articles?select=id&limit=1" -H "apikey: <ANON_KEY>" > /dev/null 2>&1`
