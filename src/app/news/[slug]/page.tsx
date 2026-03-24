import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { fetchArticleBySlug } from '@/lib/rss'
import ListPageLayout from '@/components/layout/ListPageLayout'
import SidebarPanels from '@/components/layout/SidebarPanels'
import NewsCard from '@/components/news/NewsCard'
import ShareButtons from '@/components/news/ShareButtons'
import type { Metadata } from 'next'

export const revalidate = 300

// ── Category display names ──
const CATEGORY_LABELS: Record<string, string> = {
  'local-news': 'Local News',
  'national-news': 'National News',
  sports: 'Sports',
  'ag-news': 'Agriculture',
  community: 'Community',
  sponsored: 'Sponsored',
  funeral: 'Funeral',
  all: 'News',
}

// ── Dynamic metadata ──
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const { article } = await fetchArticleBySlug(slug)

  if (!article) {
    return { title: 'Article Not Found' }
  }

  return {
    title: article.title,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      type: 'article',
      publishedTime: article.published_at,
      authors: article.author ? [article.author] : undefined,
      images: article.featured_image ? [article.featured_image] : undefined,
    },
  }
}

// ── Page component ──
export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { article, related } = await fetchArticleBySlug(slug)

  if (!article) notFound()

  const categoryLabel = CATEGORY_LABELS[article.category] ?? article.category
  const categoryHref =
    article.category === 'all'
      ? '/news'
      : `/news?cat=${article.category}`

  const publishDate = (() => {
    try {
      return format(new Date(article.published_at), 'MMMM d, yyyy · h:mm a')
    } catch {
      return article.published_at
    }
  })()

  return (
    <ListPageLayout
      sidebar={<SidebarPanels desktop />}
      mobileSidebar={<SidebarPanels />}
    >

      {/* ── Article ── */}
      <article className="article">

        {/* Header */}
        <div className="article__header">
          <Link href={categoryHref} className="article__category">
            {categoryLabel}
          </Link>
          <h1 className="article__title">{article.title}</h1>
          <div className="article__meta">
            {article.author && (
              <>
                <span className="article__author">{article.author}</span>
                <span className="article__dot" aria-hidden="true" />
              </>
            )}
            <time className="article__date" dateTime={article.published_at}>
              {publishDate}
            </time>
          </div>
        </div>

        {/* Hero image */}
        {article.featured_image && (
          <div className="article__hero">
            <Image
              src={article.featured_image}
              alt={article.title}
              fill
              priority
              sizes="(max-width: 671px) 100vw, (max-width: 1199px) 65vw, 720px"
              style={{ objectFit: 'cover' }}
            />
          </div>
        )}

        {/* Body — dangerouslySetInnerHTML for RSS HTML content */}
        <div
          className="article__body"
          dangerouslySetInnerHTML={{ __html: article.content_html }}
        />

        {/* Footer — share */}
        <div className="article__footer">
          <ShareButtons title={article.title} slug={article.slug} />
        </div>
      </article>

      {/* ── Related articles ── */}
      {related.length > 0 && (
        <div className="article-related">
          <h2 className="article-related__title">Related Articles</h2>
          <div className="article-related__list">
            {related.map((a) => (
              <NewsCard key={a.slug} article={a} variant="list" />
            ))}
          </div>
        </div>
      )}

    </ListPageLayout>
  )
}
