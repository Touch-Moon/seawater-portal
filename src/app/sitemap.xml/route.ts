import { NextResponse } from 'next/server'
import { fetchRssFeed } from '@/lib/rss'
import { getEvents } from '@/lib/supabase/queries'

export const revalidate = 3600 // 1 hour

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://steinbachonline.com'

type SitemapEntry = {
  url: string
  lastModified?: string
  changeFrequency?: string
  priority?: number
}

const staticRoutes: SitemapEntry[] = [
  { url: BASE_URL, changeFrequency: 'hourly', priority: 1.0 },
  { url: `${BASE_URL}/news`, changeFrequency: 'hourly', priority: 0.9 },
  { url: `${BASE_URL}/weather`, changeFrequency: 'hourly', priority: 0.8 },
  { url: `${BASE_URL}/weather/radar`, changeFrequency: 'always', priority: 0.6 },
  { url: `${BASE_URL}/events`, changeFrequency: 'daily', priority: 0.8 },
  { url: `${BASE_URL}/listen`, changeFrequency: 'weekly', priority: 0.7 },
  { url: `${BASE_URL}/directory`, changeFrequency: 'weekly', priority: 0.7 },
  { url: `${BASE_URL}/classifieds`, changeFrequency: 'daily', priority: 0.7 },
  { url: `${BASE_URL}/about`, changeFrequency: 'monthly', priority: 0.5 },
  { url: `${BASE_URL}/contact`, changeFrequency: 'monthly', priority: 0.5 },
  { url: `${BASE_URL}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
  { url: `${BASE_URL}/terms`, changeFrequency: 'yearly', priority: 0.3 },
]

function toXmlEntry(entry: SitemapEntry): string {
  const now = new Date().toISOString()
  return `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified ?? now}</lastmod>
    <changefreq>${entry.changeFrequency ?? 'weekly'}</changefreq>
    <priority>${entry.priority ?? 0.5}</priority>
  </url>`
}

export async function GET() {
  const entries: SitemapEntry[] = [...staticRoutes]

  // RSS news slugs (top 100)
  try {
    const articles = await fetchRssFeed('local-news', 100)
    for (const a of articles) {
      if (!a.slug) continue
      entries.push({
        url: `${BASE_URL}/news/${a.slug}`,
        lastModified: a.published_at ? new Date(a.published_at).toISOString() : undefined,
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    }
  } catch {
    // RSS unavailable — skip
  }

  // Supabase events (top 50)
  try {
    const events = await getEvents(50)
    for (const e of events) {
      if (!e.slug) continue
      entries.push({
        url: `${BASE_URL}/events/${e.slug}`,
        lastModified: e.start_date ? new Date(e.start_date).toISOString() : undefined,
        changeFrequency: 'weekly',
        priority: 0.6,
      })
    }
  } catch {
    // Supabase unavailable — skip
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(toXmlEntry).join('\n')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
