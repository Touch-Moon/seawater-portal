/**
 * NewsPanelFetcher — Server Component wrapper for NewsPanel
 *
 * page.tsx에서 Suspense로 감싸 스트리밍 렌더링에 사용.
 * 각 패널이 독립적으로 데이터를 fetch하므로 전체 페이지가
 * 가장 느린 API를 기다릴 필요가 없음.
 */

import NewsPanel, { type CategoryArticles } from './NewsPanel'
import { fetchRssFeed, fetchExternalRss, EXTERNAL_RSS_SOURCES, type RssArticle } from '@/lib/rss'
import { getTrendingArticles } from '@/lib/supabase/queries'

const strip = (articles: RssArticle[]): RssArticle[] =>
  articles.map(a => ({ ...a, content_html: '' }))

const toTrending = (raw: Awaited<ReturnType<typeof getTrendingArticles>>): RssArticle[] =>
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

// ── Main Top News Panel (탭 6개 + 드롭다운) ─────────────────
export async function TopNewsPanelFetcher() {
  const [
    localNews,
    sportsNews,
    sponsoredNews,
    agNews,
    communityNews,
    bbcNews,
    guardianNews,
    trendingAll,
  ] = await Promise.all([
    fetchRssFeed('local-news',                              48),
    fetchRssFeed('local-sports',                            36),
    fetchRssFeed('sponsored',                               32),
    fetchRssFeed('ag-news',                                 48),
    fetchRssFeed('community',                               32),
    fetchExternalRss(EXTERNAL_RSS_SOURCES['bbc-world'],     32, 'BBC News'),
    fetchExternalRss(EXTERNAL_RSS_SOURCES['guardian-world'], 8, 'The Guardian'),
    getTrendingArticles({ limit: 36 }),
  ])

  const bbcLinks = new Set(bbcNews.map(a => a.link))
  const internationalArticles = strip([
    ...bbcNews,
    ...guardianNews
      .filter(a => !bbcLinks.has(a.link))
      .map(a => ({ ...a, featured_image: null })),
  ].slice(0, 32))

  const categoryArticles: CategoryArticles = {
    top:       strip(localNews),
    local:     strip(localNews),
    national:  internationalArticles,
    sports:    strip(sportsNews),
    ag:        strip(agNews),
    community: strip(communityNews),
    trending:  toTrending(trendingAll),
  }

  return (
    <NewsPanel
      articles={strip(localNews)}
      categoryArticles={categoryArticles}
      priority
    />
  )
}

// ── Local News Panel ─────────────────────────────────────────
export async function LocalNewsPanelFetcher() {
  const [articles, trendingRaw] = await Promise.all([
    fetchRssFeed('local-news', 48),
    getTrendingArticles({ category: 'local-news', limit: 32 }),
  ])

  return (
    <NewsPanel
      title="Local News"
      titleHref="/news/local"
      icon="/icon-local.svg"
      showCategoryTabs={false}
      variant="local"
      articles={strip(articles)}
      categoryArticles={{ trending: toTrending(trendingRaw) }}
    />
  )
}

// ── National News Panel ──────────────────────────────────────
export async function NationalNewsPanelFetcher() {
  const [bbc, guardian] = await Promise.all([
    fetchExternalRss(EXTERNAL_RSS_SOURCES['bbc-world'],     32, 'BBC News'),
    fetchExternalRss(EXTERNAL_RSS_SOURCES['guardian-world'], 8, 'The Guardian'),
  ])

  const bbcLinks = new Set(bbc.map(a => a.link))
  const international = strip([
    ...bbc,
    ...guardian
      .filter(a => !bbcLinks.has(a.link))
      .map(a => ({ ...a, featured_image: null })),
  ].slice(0, 32))

  return (
    <NewsPanel
      title="National"
      titleHref="/news/national"
      icon="/icon-national.svg"
      showCategoryTabs={false}
      variant="national"
      articles={international}
    />
  )
}

// ── Sports Panel ─────────────────────────────────────────────
export async function SportsPanelFetcher() {
  const [articles, trendingRaw] = await Promise.all([
    fetchRssFeed('local-sports', 36),
    getTrendingArticles({ category: 'sports', limit: 27 }),
  ])

  return (
    <NewsPanel
      title="Sports"
      titleHref="/news/sports"
      icon="/icon-sports.svg"
      showCategoryTabs={false}
      variant="sports"
      articles={strip(articles)}
      categoryArticles={{ trending: toTrending(trendingRaw) }}
    />
  )
}

// ── Ag News Panel ────────────────────────────────────────────
export async function AgNewsPanelFetcher() {
  const articles = await fetchRssFeed('ag-news', 48)

  return (
    <NewsPanel
      title="Ag News"
      titleHref="/news/ag"
      icon="/icon-ag-news.svg"
      showCategoryTabs={false}
      articles={strip(articles)}
    />
  )
}

// ── Community Panel ──────────────────────────────────────────
export async function CommunityPanelFetcher() {
  const [articles, trendingRaw] = await Promise.all([
    fetchRssFeed('community', 32),
    getTrendingArticles({ category: 'community', limit: 24 }),
  ])

  return (
    <NewsPanel
      title="Community"
      titleHref="/news/community"
      icon="/icon-community.svg"
      showCategoryTabs={false}
      variant="community"
      articles={strip(articles)}
      categoryArticles={{ trending: toTrending(trendingRaw) }}
    />
  )
}

// ── Sponsored Panel ──────────────────────────────────────────
export async function SponsoredPanelFetcher() {
  const articles = await fetchRssFeed('sponsored', 32)

  return (
    <NewsPanel
      title="Sponsored"
      titleHref="/sponsored"
      icon="/icon-sponsored.svg"
      showCategoryTabs={false}
      variant="sponsored"
      articles={strip(articles)}
    />
  )
}
