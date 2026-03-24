import NewsCard from '@/components/news/NewsCard'
import type { RssArticle } from '@/lib/rss'

interface TodayNewsPanelProps {
  articles: RssArticle[]
}

export default function TodayNewsPanel({ articles }: TodayNewsPanelProps) {
  if (articles.length === 0) return null

  return (
    <div className="today-news">
      <div className="today-news__title-wrap">
        <h2 className="today-news__title">Today&apos;s News</h2>
      </div>

      {articles.map((article) => (
        <NewsCard key={article.slug} article={article} variant="list" />
      ))}
    </div>
  )
}
