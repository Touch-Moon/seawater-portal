import Link from 'next/link'
import Image from 'next/image'
import ListPageLayout from '@/components/layout/ListPageLayout'
import SidebarPanels from '@/components/layout/SidebarPanels'
import { searchArticles } from '@/lib/rss'
import type { Metadata } from 'next'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Search — SteinbachOnline',
}

function strip<T extends { content_html: string }>(items: T[]): T[] {
  return items.map(a => ({ ...a, content_html: '' }))
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const query = q?.trim() ?? ''
  const results = query ? strip(await searchArticles(query, 30)) : []

  return (
    <ListPageLayout
      sidebar={<SidebarPanels desktop />}
    >
      <div className="search-results">
        {/* Header */}
        <div className="search-results__header">
          {query ? (
            <>
              <h1 className="search-results__title">
                Search results for &ldquo;{query}&rdquo;
              </h1>
              <span className="search-results__count">
                {results.length} {results.length === 1 ? 'result' : 'results'}
              </span>
            </>
          ) : (
            <h1 className="search-results__title">Search</h1>
          )}
        </div>

        {/* Empty states */}
        {query && results.length === 0 && (
          <div className="search-results__empty">
            <p className="search-results__empty-text">
              No results found for &ldquo;{query}&rdquo;
            </p>
            <p className="search-results__empty-hint">
              Try different keywords or check your spelling.
            </p>
          </div>
        )}

        {!query && (
          <div className="search-results__empty">
            <p className="search-results__empty-text">
              Enter a search term to find news articles.
            </p>
          </div>
        )}

        {/* Results — News category */}
        {results.length > 0 && (
          <div className="search-results__section">
            <div className="search-results__section-header">
              <span className="search-results__section-icon">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icon-news.svg" width={28} height={28} alt="" aria-hidden="true" />
              </span>
              <h2 className="search-results__section-title">News</h2>
            </div>

            <div className="search-results__list">
              {results.map((article) => (
                <Link
                  key={article.slug}
                  href={`/news/${article.slug}`}
                  className="search-results__item"
                >
                  <div className="search-results__item-body">
                    <span className="search-results__item-title">{article.title}</span>
                    {article.summary && (
                      <span className="search-results__item-summary">{article.summary}</span>
                    )}
                    <span className="search-results__item-meta">
                      {article.author && `${article.author} · `}
                      {article.category.replace(/-/g, ' ')}
                    </span>
                  </div>
                  <div className="search-results__item-thumb">
                    {article.featured_image ? (
                      <Image
                        src={article.featured_image}
                        alt={article.title}
                        fill
                        sizes="120px"
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="search-results__item-thumb-placeholder" />
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </ListPageLayout>
  )
}
