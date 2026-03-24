import Image from 'next/image'
import Link from 'next/link'
import ListPageLayout from '@/components/layout/ListPageLayout'
import SidebarPanels from '@/components/layout/SidebarPanels'
import WeatherWidget from '@/components/home/WeatherWidget'
import ContestPanel from '@/components/home/ContestPanel'
import AdCard from '@/components/home/AdCard'
import EventsPanel from '@/components/home/EventsPanel'
import JobsPanel from '@/components/home/JobsPanel'
import NewsCard from '@/components/news/NewsCard'
import RefreshNewsButton from '@/components/news/RefreshNewsButton'
import MoreButton from '@/components/news/MoreButton'
import NewsAdBanner from '@/components/home/NewsAdBanner'
import ClassifiedsPreview from '@/components/home/ClassifiedsPreview'
import TodayNewsPanel from '@/components/news/TodayNewsPanel'
import { fetchRssFeed, type RssArticle } from '@/lib/rss'
import type { Metadata } from 'next'

export const revalidate = 60

/** content_html 제거 — RSC 페이로드 경량화 */
function strip(articles: RssArticle[]): RssArticle[] {
  return articles.map(a => ({ ...a, content_html: '' }))
}

// cat param → RSS feed key + 표시 타이틀
const CAT_CONFIG: Record<string, { feed: Parameters<typeof fetchRssFeed>[0]; title: string }> = {
  'local-news':    { feed: 'local-news',    title: 'Local News' },
  'national-news': { feed: 'national-news', title: 'National News' },
  'sports':        { feed: 'local-sports',  title: 'Sports' },
  'ag-news':       { feed: 'ag-news',       title: 'Agriculture News' },
  'ag':            { feed: 'ag-news',       title: 'Agriculture News' },
  'community':     { feed: 'community',     title: 'Community' },
  'sponsored':     { feed: 'sponsored',     title: 'Sponsored' },
  'funeral':       { feed: 'funeral-announcements', title: 'Funeral Announcements' },
  'national':      { feed: 'national-news', title: 'National News' },
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>
}): Promise<Metadata> {
  const { cat } = await searchParams
  const catConfig = cat ? CAT_CONFIG[cat] ?? null : null
  const title = catConfig ? `${catConfig.title} — SteinbachOnline` : 'News — SteinbachOnline'
  return { title }
}

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>
}) {
  const { cat } = await searchParams
  const catConfig = cat ? CAT_CONFIG[cat] ?? null : null

  // 카테고리 모드: 해당 feed 단독 fetch
  // 기본 모드: local-news + national + sports 병렬 fetch
  const [rawLocal, rawNational, rawSports] = catConfig
    ? await Promise.all([
        fetchRssFeed(catConfig.feed, 12),
        Promise.resolve([] as RssArticle[]),
        Promise.resolve([] as RssArticle[]),
      ])
    : await Promise.all([
        fetchRssFeed('local-news', 12),
        fetchRssFeed('national-news', 8),
        fetchRssFeed('local-sports', 8),
      ])

  // content_html 스트립 — RSC 페이로드 경량화
  const localArticles = strip(rawLocal)
  const nationalArticles = strip(rawNational)
  const sportsArticles = strip(rawSports)

  const [featured, ...all] = localArticles
  const rest = all.slice(0, 8)                                        // desktop grid 8개
  const mobileAll = featured ? [featured, ...rest] : rest             // 모바일: featured 포함 전체
  const gridArticles = mobileAll.slice(0, 2)                          // 모바일 grid 2개 (2col 1row)
  const listArticles = mobileAll.slice(2, 9)                          // 모바일 list 최대 7개

  const usedSlugs = new Set(localArticles.slice(0, 9).map(a => a.slug))
  const todayNews = [...nationalArticles, ...sportsArticles]
    .filter(a => !usedSlugs.has(a.slug))
    .slice(0, 8)

  const pageTitle = catConfig ? catConfig.title.toUpperCase() : 'TOP NEWS'
  const isFuneral = cat === 'funeral'

  return (
    <ListPageLayout
      sidebar={<SidebarPanels desktop />}
      newsMode
    >
      <div className={`news-list${isFuneral ? ' news-list--funeral' : ''}`}>
        <div className="news-list__title-wrap">
          <h1 className="news-list__title">{pageTitle}</h1>
        </div>

        {/* Empty state */}
        {localArticles.length === 0 && (
          <div className="news-list__empty">
            <p className="news-list__empty-text">No articles available at this time.</p>
          </div>
        )}

        {/* ── Funeral layout: portrait 1:1 grid ── */}
        {isFuneral && localArticles.length > 0 && (
          <div className="funeral-grid">
            {localArticles.map((article) => (
              <Link key={article.slug} href={`/news/${article.slug}`} className="funeral-card">
                <div className="funeral-card__portrait">
                  {article.featured_image ? (
                    <Image
                      src={article.featured_image}
                      alt={article.title}
                      fill
                      sizes="(max-width: 671px) 45vw, (max-width: 980px) 30vw, 160px"
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      className="funeral-card__placeholder"
                      src="/ico-person-placeholder.svg"
                      alt=""
                      aria-hidden="true"
                    />
                  )}
                </div>
                <div className="funeral-card__info">
                  <span className="funeral-card__name">{article.title}</span>
                  <span className="funeral-card__summary">{article.summary}</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* ── Default news layout ── */}
        {!isFuneral && (
          <>
            {/* Featured — 태블릿+ 전용 (모바일에서 숨김) */}
            {featured && (
              <NewsCard article={featured} variant="featured" />
            )}

            {/* Grid — 태블릿+: 2col 8개 / 모바일: grid 2개 + list 최대 7개 */}
            {(rest.length > 0 || featured) && (
              <>
                {/* 태블릿+ 2col grid (모바일에서 숨김) */}
                <div className="news-list__grid news-list__grid--desktop">
                  {rest.map((article) => (
                    <NewsCard key={article.slug} article={article} variant="grid" />
                  ))}
                </div>

                {/* 모바일 전용: list 6개 (grid 위) */}
                {listArticles.length > 0 && (
                  <ul className="news-list__mobile-list news-panel__list">
                    {listArticles.map((article) => (
                      <li key={article.slug} className="news-panel__list-item">
                        <Link href={`/news/${article.slug}`} className="news-panel__list-link">
                          {article.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}

                {/* 모바일 전용: 2col grid 2개 */}
                <div className="news-panel__grid news-panel__grid--news-mobile">
                  {gridArticles.map((article) => (
                    <Link key={article.slug} href={`/news/${article.slug}`} className="news-panel__card">
                      <div className="news-panel__thumb-wrap">
                        {article.featured_image ? (
                          <Image
                            className="news-panel__thumb"
                            src={article.featured_image}
                            alt={article.title}
                            fill
                            sizes="(max-width: 671px) 45vw, 200px"
                            style={{ objectFit: 'cover' }}
                          />
                        ) : (
                          <div className="news-panel__thumb" style={{ background: 'var(--color-bg-tertiary)', width: '100%', height: '100%' }} />
                        )}
                      </div>
                      <div className="news-panel__card-info">
                        <p className="news-panel__card-title">{article.title}</p>
                        <span className="news-panel__card-source">{article.author}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {isFuneral ? <MoreButton /> : <RefreshNewsButton />}
      </div>

      <WeatherWidget mobile />
      <ContestPanel mobile />
      <TodayNewsPanel articles={todayNews} />
      <AdCard mobile />
      <NewsAdBanner />
      <ClassifiedsPreview />
      <EventsPanel mobile />
      <JobsPanel mobile />
      <NewsAdBanner />
    </ListPageLayout>
  )
}
