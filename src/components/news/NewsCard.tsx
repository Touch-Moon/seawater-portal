import Link from 'next/link'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import type { RssArticle } from '@/lib/rss'

interface NewsCardProps {
  article: RssArticle
  variant?: 'featured' | 'grid' | 'list'
  breaking?: boolean
}

function formatDate(dateStr: string): string {
  try {
    const raw = formatDistanceToNow(new Date(dateStr), { addSuffix: true })
    return raw
      .replace(/^about /, '')
      .replace(' minutes', ' mins')
      .replace(' minute', ' min')
      .replace(' hours', ' hrs')
      .replace(' hour', ' hr')
      .replace(' months', ' mos')
      .replace(' month', ' mo')
      .replace(' years', ' yrs')
      .replace(' year', ' yr')
  } catch {
    return dateStr
  }
}

export default function NewsCard({ article, variant = 'grid', breaking = false }: NewsCardProps) {
  const href = `/news/${article.slug}`

  if (variant === 'list') {
    return (
      <Link href={href} className="news-card news-card--list">
        {/* Text body */}
        <div className="news-card__body news-card__body--list">
          {breaking && <span className="news-card__breaking">BREAKING</span>}
          <span className="news-card__title news-card__title--list">{article.title}</span>
          {article.summary && (
            <span className="news-card__desc--list">{article.summary}</span>
          )}
          <span className="news-card__source--list">
            {article.author && `${article.author} · `}{formatDate(article.published_at)}
          </span>
        </div>

        {/* Thumbnail */}
        <div className="news-card__thumb news-card__thumb--list">
          {article.featured_image ? (
            <Image
              src={article.featured_image}
              alt={article.title}
              fill
              sizes="164px"
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div className="news-card__thumb-placeholder" />
          )}
        </div>
      </Link>
    )
  }

  if (variant === 'featured') {
    return (
      <Link href={href} className="news-card news-card--featured">
        {/* Large thumbnail */}
        <div className="news-card__thumb news-card__thumb--featured">
          {article.featured_image ? (
            <Image
              src={article.featured_image}
              alt={article.title}
              fill
              priority
              sizes="(max-width: 671px) 100vw, 520px"
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div className="news-card__thumb-placeholder" />
          )}
        </div>

        {/* Text body */}
        <div className="news-card__body news-card__body--featured">
          {breaking && <span className="news-card__breaking">BREAKING</span>}
          <span className="news-card__title news-card__title--featured">{article.title}</span>
          {article.summary && (
            <span className="news-card__summary">{article.summary}</span>
          )}
          <div className="news-card__meta">
            {article.author && (
              <>
                <span className="news-card__source">{article.author}</span>
                <span className="news-card__dot" aria-hidden="true" />
              </>
            )}
            <span className="news-card__date">{formatDate(article.published_at)}</span>
          </div>
        </div>
      </Link>
    )
  }

  // variant === 'grid'
  return (
    <Link href={href} className="news-card news-card--grid">
      {/* Small thumbnail */}
      <div className="news-card__thumb news-card__thumb--grid">
        {article.featured_image ? (
          <Image
            src={article.featured_image}
            alt={article.title}
            fill
            sizes="120px"
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div className="news-card__thumb-placeholder" />
        )}
      </div>

      {/* Text body */}
      <div className="news-card__body">
        {breaking && <span className="news-card__breaking">BREAKING</span>}
        <span className="news-card__title">{article.title}</span>
        <div className="news-card__meta">
          {article.author && (
            <>
              <span className="news-card__source">{article.author}</span>
              <span className="news-card__dot" aria-hidden="true" />
            </>
          )}
          <span className="news-card__date">{formatDate(article.published_at)}</span>
        </div>
      </div>
    </Link>
  )
}
