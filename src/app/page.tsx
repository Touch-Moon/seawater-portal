import SearchBar from '@/components/shared/SearchBar'
import QuickMenu from '@/components/home/QuickMenu'
import AdBanner from '@/components/home/AdBanner'
import LoginPanel from '@/components/home/LoginPanel'
import LivePanel from '@/components/home/LivePanel'
import AdCard from '@/components/home/AdCard'
import NewsPanel from '@/components/home/NewsPanel'
import NewsAdBanner from '@/components/home/NewsAdBanner'
import ClassifiedsPreview from '@/components/home/ClassifiedsPreview'
import ContestPanel from '@/components/home/ContestPanel'
import WeatherWidget from '@/components/home/WeatherWidget'
import EventsPanel from '@/components/home/EventsPanel'
import JobsPanel from '@/components/home/JobsPanel'
import SmartStickyCol from '@/components/layout/SmartStickyCol'
import StickySearchBar from '@/components/shared/StickySearchBar'
import MenuButton from '@/components/shared/MenuButton'
import { fetchRssFeed, fetchExternalRss, EXTERNAL_RSS_SOURCES } from '@/lib/rss'
import { getTrendingArticles } from '@/lib/supabase/queries'
import type { RssArticle } from '@/lib/rss'

export const revalidate = 300

export default async function Home() {

  // ── RSS feeds (parallel fetch, ISR 300s) ──────────────────────────────
  // 페이지네이션 기준: default 12/page, thumb 8/page, sports 9/page
  const [
    localNewsArticles,   // Top News (48 = 4p×12) + Local tab + Local panel (6p×8)
    sportsArticles,      // Sports: 36 = 4p×9
    sponsoredArticles,   // Sponsored: 32 = 4p×8
    agArticles,          // Ag News: 48 = 4p×12
    communityArticles,   // Community: 32 = 4p×8
    bbcArticles,         // BBC World (최대 30)
    guardianArticles,    // Guardian World (보조)
    trendingAllRaw,      // Supabase views DESC — 전체 (메인 NewsPanel용)
    trendingLocalRaw,    // local-news trending (Local News 패널용)
    trendingSportsRaw,   // sports trending (Sports 패널용)
    trendingCommunityRaw,// community trending (Community 패널용)
  ] = await Promise.all([
    fetchRssFeed('local-news',                               48),
    fetchRssFeed('local-sports',                             36),
    fetchRssFeed('sponsored',                                32),
    fetchRssFeed('ag-news',                                  48),
    fetchRssFeed('community',                                32),
    fetchExternalRss(EXTERNAL_RSS_SOURCES['bbc-world'],      32, 'BBC News'),
    fetchExternalRss(EXTERNAL_RSS_SOURCES['guardian-world'],  8, 'The Guardian'),
    getTrendingArticles({ limit: 36 }),                          // 메인 패널: 전 카테고리 상위 36
    getTrendingArticles({ category: 'local-news', limit: 32 }), // Local: 4p×8
    getTrendingArticles({ category: 'sports',     limit: 27 }), // Sports: 3p×9
    getTrendingArticles({ category: 'community',  limit: 24 }), // Community: 3p×8
  ])

  // content_html 제거 — 홈페이지 컴포넌트는 본문 HTML 불필요.
  // 692KB → ~80KB 로 RSC 페이로드 축소 (브라우저 무한 로딩 방지)
  const strip = (articles: RssArticle[]): RssArticle[] =>
    articles.map(a => ({ ...a, content_html: '' }))

  // Supabase articles → RssArticle 형태 변환 (views DESC 정렬 유지)
  const toTrending = (raw: typeof trendingAllRaw): RssArticle[] =>
    raw.map(a => ({
      title:          a.title,
      link:           `https://steinbachonline.com/articles/${a.slug}`,
      slug:           a.slug,
      published_at:   a.published_at,
      author:         a.author,
      featured_image: a.featured_image ?? null,
      summary:        a.summary,
      category:       a.category,
      content_html:   '',
    }))

  // RSS 피드 배열 content_html 제거
  const localNewsArticlesClean  = strip(localNewsArticles)
  const sportsArticlesClean     = strip(sportsArticles)
  const sponsoredArticlesClean  = strip(sponsoredArticles)
  const agArticlesClean         = strip(agArticles)
  const communityArticlesClean  = strip(communityArticles)

  // 각 카테고리별 trending 변환 (카테고리 전용 쿼리이므로 필터 불필요)
  const trendingArticles  = toTrending(trendingAllRaw)      // 메인 패널 (전 카테고리 혼합)
  const trendingLocal     = toTrending(trendingLocalRaw)    // Local News 패널
  const trendingSports    = toTrending(trendingSportsRaw)   // Sports 패널
  const trendingCommunity = toTrending(trendingCommunityRaw)// Community 패널
  // national / sponsored / ag-news 는 Supabase seed 없음 → hash sort fallback 사용

  // BBC + Guardian 합쳐서 32개 (중복 제거, Guardian 이미지 401 → null → picsum fallback)
  const bbcLinks = new Set(bbcArticles.map(a => a.link))
  const internationalArticles = strip([
    ...bbcArticles,
    ...guardianArticles
      .filter(a => !bbcLinks.has(a.link))
      .map(a => ({ ...a, featured_image: null })),
  ].slice(0, 32))

  return (
    <main className="page">

      {/* ── Sticky SearchBar clone ── */}
      <StickySearchBar />

      {/* ── Hero: SearchBar + action buttons ── */}
      <div className="page__hero">
        <div className="page__hero__bar">
          <SearchBar />
          <div className="page__hero__actions">
            <button type="button" className="page__hero__action-btn" aria-label="Subscribe">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/ico-subscription.svg" alt="" width={20} height={24} aria-hidden="true" />
            </button>
            <MenuButton />
          </div>
        </div>
      </div>

      {/* ── Quick menu pill bar ── */}
      <QuickMenu />

      {/* ── Home 2-column grid ── */}
      <section className="home">
        <div className="home__inner">

          {/* Left 768px — main content */}
          <SmartStickyCol className="home__main">
            <AdBanner />
            <LivePanel />

            {/* Top News — 탭(Local/National/Sports/Ag/Community) + 드롭다운(Top/Latest/Trending) */}
            <NewsPanel
              articles={localNewsArticlesClean}
              categoryArticles={{
                top:       localNewsArticlesClean,
                local:     localNewsArticlesClean,
                national:  internationalArticles,
                sports:    sportsArticlesClean,
                ag:        agArticlesClean,
                community: communityArticlesClean,
                trending:  trendingArticles,
              }}
            />

            <NewsAdBanner />
            <ClassifiedsPreview />

            <NewsPanel
              title="Local News"
              titleHref="/news/local"
              icon="/ico-local.svg"
              showCategoryTabs={false}
              variant="local"
              articles={localNewsArticlesClean}
              categoryArticles={{ trending: trendingLocal }}
            />
            <NewsPanel
              title="National"
              titleHref="/news/national"
              icon="/ico-national.svg"
              showCategoryTabs={false}
              variant="national"
              articles={internationalArticles}
              // national Supabase seed 없음 → hash sort fallback
            />
            <NewsPanel
              title="Sponsored"
              titleHref="/sponsored"
              icon="/ico-sponsored.svg"
              showCategoryTabs={false}
              variant="sponsored"
              articles={sponsoredArticlesClean}
              // sponsored Supabase seed 없음 → hash sort fallback
            />
            <NewsPanel
              title="Sports"
              titleHref="/news/sports"
              icon="/ico-sports.svg"
              showCategoryTabs={false}
              variant="sports"
              articles={sportsArticlesClean}
              categoryArticles={{ trending: trendingSports }}
            />
            <NewsPanel
              title="Ag News"
              titleHref="/news/ag"
              icon="/ico-agriculture.svg"
              showCategoryTabs={false}
              articles={agArticlesClean}
              // ag-news Supabase seed 없음 → hash sort fallback
            />
            <NewsPanel
              title="Community"
              titleHref="/news/community"
              icon="/ico-community.svg"
              showCategoryTabs={false}
              variant="community"
              articles={communityArticlesClean}
              categoryArticles={{ trending: trendingCommunity }}
            />
            {/* NewsAdBanner2 … */}
          </SmartStickyCol>

          {/* Right 384px — sidebar */}
          <SmartStickyCol className="home__sidebar">
            <LoginPanel />
            <AdCard />
            <WeatherWidget />
            <ContestPanel />
            <EventsPanel />
            <JobsPanel />
            {/* … */}
          </SmartStickyCol>

        </div>
      </section>

    </main>
  )
}
