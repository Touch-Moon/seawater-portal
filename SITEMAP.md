# SteinbachOnline Renewal — Sitemap & Information Architecture

> 원본 사이트(steinbachonline.com) 분석 후, 프로페셔널하게 재설계한 IA 문서.
> PROJECT_TEMPLATE.md의 URL 구조를 기반으로 하되, 실제 분석 결과를 반영.

---

## 원본 사이트 문제점

| 문제 | 예시 |
|------|------|
| **플랫 URL** — 계층 없음 | `/local-news`, `/national-news`, `/ag-news` 가 루트에 흩어짐 |
| **페이지 타이틀 비직관적** | "Home Page - SteinbachOnline.com - Local news, Weather, Sports, Free Classifieds and Job Listings for Steinbach, Manitoba" |
| **`/features/*` 잡탕** | Games, Webcam, Road Reports, Program Guide, Newsletter가 같은 `/features/` 아래 |
| **라디오 URL 비일관** | `/am1250`, `/mix96`, `/country107` — 패턴 없는 루트 페이지 |
| **Jobs 별도 시스템** | `/regions/steinbach` (LocalJobShop), `/listings/{id}` — 메인과 분리 |
| **Classifieds 미구현** | HelloGoodBuy, Garage Sales 링크가 `/`로 리다이렉트 |
| **이벤트 URL** | `/events/192721` — 숫자 ID, SEO 불리 |
| **총 35+ 고정 페이지** | 많은 페이지가 단순 카테고리 필터인데 각각 독립 URL |

---

## 리뉴얼 사이트맵

### 설계 원칙
1. **계층적 URL** — 관련 페이지를 그룹핑 (`/news/local`, `/news/sports`)
2. **SEO 최적화** — slug 기반 URL, 명확한 title 태그
3. **10페이지 이내** — 핵심 페이지만 유지, 나머지는 탭/필터로 통합
4. **멀티사이트 대응** — 모든 URL이 10개 사이트에서 동일하게 작동

---

### 페이지 트리

```
/                                 Home
│
├── /news                         News (목록 + 카테고리 탭)
│   ├── ?category=local           └─ 탭: Local
│   ├── ?category=national        └─ 탭: National
│   ├── ?category=sports          └─ 탭: Sports
│   ├── ?category=ag-news         └─ 탭: Ag News
│   ├── ?category=community       └─ 탭: Community
│   ├── ?category=funeral         └─ 탭: Funeral Announcements
│   └── /news/[slug]              News Detail (기사 상세)
│
├── /weather                      Weather
│   └── /weather/radar            └─ Radar (Leaflet 지도)
│
├── /events                       Events (캘린더 + 리스트)
│   └── /events/[slug]            Event Detail
│
├── /listen                       Listen (라디오 3채널 통합)
│
├── /directory                    Business Directory (P2)
│
├── /classifieds                  Classifieds / Jobs (P2)
│
└── [Footer-only pages]
    ├── /about                    About / Team
    ├── /contact                  Contact
    ├── /privacy                  Privacy Policy
    └── /terms                    Terms of Use
```

---

### 페이지별 상세

#### 1. Home `/` (P0)
| 섹션 | 컴포넌트 | 데이터 소스 |
|------|----------|------------|
| 검색바 | `SearchBar` | — |
| 퀵메뉴 | `QuickMenu` | static |
| 광고 배너 | `AdBanner` | static |
| 라이브 라디오 | `LivePanel` | `radio.ts` |
| 뉴스 패널 | `NewsPanel` (탭 6개) | `rss.ts` / Supabase |
| 로그인 | `LoginPanel` | — |
| 광고 카드 | `AdCard` | static |
| 날씨 위젯 | `WeatherWidget` | `weather.ts` (WeatherAPI) |
| 콘테스트 | `ContestPanel` | static images |
| 이벤트 위젯 | `EventsPanel` | Supabase / RSS |

**Title:** `SteinbachOnline — Local News, Weather & Events`

---

#### 2. News `/news` (P0)
| 섹션 | 설명 |
|------|------|
| 카테고리 탭 바 | `Top News` / `Local` / `National` / `Sports` / `Ag News` / `Community` / `Funeral` |
| 뉴스 그리드 | 카드 레이아웃 (이미지 + 제목 + 요약 + 날짜) |
| 페이지네이션 | prev/next + 페이지 번호 |
| 사이드바 | 날씨 위젯, 인기 기사, 광고 |

**원본 7개 별도 페이지** → **1개 페이지 + 탭 필터로 통합**

| 원본 URL | 리뉴얼 |
|----------|--------|
| `/local-news` | `/news?category=local` |
| `/national-news` | `/news?category=national` |
| `/local-sports` | `/news?category=sports` |
| `/ag-news` | `/news?category=ag-news` |
| `/community` | `/news?category=community` |
| `/sponsored` | `/news?category=sponsored` |
| `/funeral-announcements` | `/news?category=funeral` |

**Title:** `News — SteinbachOnline` / `Local News — SteinbachOnline`

---

#### 3. News Detail `/news/[slug]` (P0)
| 섹션 | 설명 |
|------|------|
| 기사 헤더 | 카테고리 뱃지, 제목, 작성자, 날짜 |
| 기사 본문 | 이미지 + HTML 콘텐츠 |
| 소셜 공유 | Facebook, X, 링크 복사 |
| 관련 기사 | 같은 카테고리 최신 4개 |

**원본:** `/articles/{slug}` → **리뉴얼:** `/news/{slug}`

**Title:** `{기사제목} — SteinbachOnline`

---

#### 4. Weather `/weather` (P1)
| 섹션 | 데이터 소스 |
|------|------------|
| 현재 날씨 (대형) | WeatherAPI |
| 시간별 예보 (12h) | WeatherAPI |
| 주간 예보 (7일) | WeatherAPI |
| 날씨 경보/특보 | Environment Canada ATOM (`radar.ts`) |
| 레이더 링크 | → `/weather/radar` |

**원본 2페이지** `/weather` + `/radar` → **유지** (레이더는 서브페이지)

**Title:** `Weather — SteinbachOnline`

---

#### 5. Weather Radar `/weather/radar` (P1)
| 섹션 | 데이터 소스 |
|------|------------|
| Leaflet 전체화면 지도 | MSC GeoMet WMS (`radar.ts`) |
| 레이어 토글 | 강수 / 눈 |
| 타임라인 슬라이더 | 최근 2시간 애니메이션 |

**Title:** `Weather Radar — SteinbachOnline`

---

#### 6. Events `/events` (P1)
| 섹션 | 설명 |
|------|------|
| 미니 캘린더 | 월별 그리드, 이벤트 있는 날 dot 표시 |
| 이벤트 리스트 | 날짜별 그룹핑, 시간 + 제목 + 장소 |
| 카테고리 필터 | 스포츠, 커뮤니티, 교육 등 |

**Title:** `Events — SteinbachOnline`

---

#### 7. Event Detail `/events/[slug]` (P1)
| 섹션 | 설명 |
|------|------|
| 이벤트 정보 | 제목, 날짜/시간, 장소, 설명 |
| 위치 지도 | 정적 맵 또는 외부 링크 |
| 관련 이벤트 | 같은 날짜 다른 이벤트 |

**원본:** `/events/192721` (ID) → **리뉴얼:** `/events/{slug}` (SEO slug)

**Title:** `{이벤트명} — Events — SteinbachOnline`

---

#### 8. Listen `/listen` (P1)
| 섹션 | 설명 |
|------|------|
| 채널 선택 (3개) | AM 1250 / MIX 96.7 / Country 107.7 |
| Now Playing | RDS 데이터 (30s 폴링) |
| 스트리밍 플레이어 | 팝업 콘솔 or 임베드 |
| 프로그램 가이드 | 요일별 스케줄 |

**원본 5개 페이지** → **1개 통합 페이지**

| 원본 URL | 리뉴얼 |
|----------|--------|
| `/am1250` | `/listen` (기본 채널) |
| `/mix96` | `/listen?channel=mix96` |
| `/country107` | `/listen?channel=country107` |
| `/streaming` | `/listen` (통합) |
| `/features/am1250-program-guide` | `/listen` (프로그램 가이드 탭) |

**Title:** `Listen — SteinbachOnline`

---

#### 9. Directory `/directory` (P2)
| 섹션 | 설명 |
|------|------|
| 검색 | 비즈니스명 / 카테고리 검색 |
| 카테고리 그리드 | 음식, 쇼핑, 서비스 등 |
| 비즈니스 카드 | 이름, 주소, 전화, 웹사이트 |

**Title:** `Business Directory — SteinbachOnline`

---

#### 10. Classifieds `/classifieds` (P2)
| 섹션 | 설명 |
|------|------|
| 탭 | Jobs / For Sale / Garage Sales |
| 리스트 | 카드 그리드 (제목, 회사/위치, 날짜) |
| 필터 | 카테고리, 정렬 |

**원본 3개 분산** → **1개 통합**

| 원본 | 리뉴얼 |
|------|--------|
| `/regions/steinbach` (LocalJobShop) | `/classifieds?tab=jobs` |
| HelloGoodBuy (미구현) | `/classifieds?tab=for-sale` |
| Garage Sales (미구현) | `/classifieds?tab=garage-sales` |

**Title:** `Classifieds — SteinbachOnline`

---

#### Footer 페이지 (정적)

| 페이지 | URL | 원본 |
|--------|-----|------|
| About / Team | `/about` | `/team` |
| Contact | `/contact` | `/contact` |
| Privacy | `/privacy` | `/privacy-policy` |
| Terms | `/terms` | `/terms` |

**제거된 원본 페이지:**

| 원본 URL | 사유 |
|----------|------|
| `/app` | 포트폴리오 — 앱 다운로드 불필요 |
| `/advertise` | 포트폴리오 — 광고 영업 불필요 |
| `/submit-news` | 포트폴리오 — 뉴스 제보 폼 불필요 |
| `/rss` | 개발자용, 일반 유저 불필요 |
| `/contest-rules` | 콘테스트 기능 없음 |
| `/journalistic-standards` | 포트폴리오 — 불필요 |
| `/features/games` | 외부 게임 임베드 — 스코프 외 |
| `/features/live-webcam` | YouTube 임베드 — 스코프 외 |
| `/features/road-reports-and-cancellations` | 특화 피처 — P2 이후 |
| `/features/daily-news` | 뉴스레터 구독 — v2 고려 |
| `/contests/*` | 콘테스트 시스템 — 스코프 외 |
| `/tags/*`, `/regions/*` | SEO 태그 — URL 리다이렉트 |

---

## 요약: 원본 vs 리뉴얼

| | 원본 (steinbachonline.com) | 리뉴얼 |
|---|---|---|
| **고정 페이지** | 35+ | **10** |
| **뉴스 카테고리** | 7개 별도 URL | 1개 페이지 + 탭 |
| **라디오** | 5개 분산 페이지 | 1개 통합 페이지 |
| **URL 계층** | 플랫 (전부 루트) | 계층적 (`/news/`, `/events/`) |
| **Title 패턴** | 전 페이지 동일 (비직관적) | `{페이지명} — SteinbachOnline` |
| **이벤트 URL** | `/events/192721` (ID) | `/events/{slug}` (SEO) |
| **기사 URL** | `/articles/{slug}` | `/news/{slug}` |
| **Classifieds** | 3곳 분산 (일부 미구현) | 1개 통합 + 탭 |

---

## Next.js App Router 경로

```
src/app/
├── layout.tsx                    → 루트 레이아웃
├── page.tsx                      → Home
├── news/
│   ├── page.tsx                  → News (카테고리 탭)
│   └── [slug]/page.tsx           → News Detail
├── weather/
│   ├── page.tsx                  → Weather
│   └── radar/page.tsx            → Weather Radar
├── events/
│   ├── page.tsx                  → Events
│   └── [slug]/page.tsx           → Event Detail
├── listen/
│   └── page.tsx                  → Listen (3채널 통합)
├── directory/
│   └── page.tsx                  → Business Directory (P2)
├── classifieds/
│   └── page.tsx                  → Classifieds (P2)
├── about/page.tsx                → About / Team
├── contact/page.tsx              → Contact
├── privacy/page.tsx              → Privacy Policy
├── terms/page.tsx                → Terms of Use
└── api/
    └── radio/
        └── now-playing/route.ts  → RDS 프록시 (CORS 우회)
```
