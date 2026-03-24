'use client'

import { useState } from 'react'
import Link from 'next/link'

type SavedArticle = {
  id: number
  slug: string
  title: string
  category: string
  date: string
  author: string
}

const MOCK_SAVED: SavedArticle[] = [
  { id: 1, slug: 'steinbach-city-council-approves-new-recreation-centre', title: 'Steinbach City Council Approves New Recreation Centre', category: 'Local News', date: 'March 22, 2026', author: 'Staff Reporter' },
  { id: 2, slug: 'manitoba-hydro-announces-rate-increase', title: 'Manitoba Hydro Announces 4.5% Rate Increase for 2026', category: 'National', date: 'March 20, 2026', author: 'Canadian Press' },
  { id: 3, slug: 'se-mb-bisons-win-provincial-championship', title: 'SE MB Bisons Win Provincial Championship in Overtime Thriller', category: 'Sports', date: 'March 18, 2026', author: 'Sports Desk' },
  { id: 4, slug: 'spring-flooding-outlook-for-red-river', title: 'Spring Flooding Outlook for the Red River Valley Released', category: 'Local News', date: 'March 15, 2026', author: 'Staff Reporter' },
  { id: 5, slug: 'local-farm-family-recognized-for-sustainable-practices', title: 'Local Farm Family Recognized for Sustainable Agricultural Practices', category: 'Ag News', date: 'March 12, 2026', author: 'Ag Desk' },
  { id: 6, slug: 'steinbach-community-garden-expansion', title: 'Steinbach Community Garden to Expand with Federal Funding', category: 'Community', date: 'March 10, 2026', author: 'Staff Reporter' },
  { id: 7, slug: 'new-business-roundup-march-2026', title: 'New Business Roundup: 5 Openings Coming to Steinbach This Spring', category: 'Local News', date: 'March 8, 2026', author: 'Business Desk' },
  { id: 8, slug: 'provs-junior-hockey-playoff-preview', title: 'Provs Junior Hockey: Complete Playoff Preview and Predictions', category: 'Sports', date: 'March 5, 2026', author: 'Sports Desk' },
  { id: 9, slug: 'rc-cardinal-high-school-graduation-2026', title: 'RC Cardinal High School Sets Date for 2026 Graduation Ceremony', category: 'Community', date: 'March 3, 2026', author: 'Staff Reporter' },
  { id: 10, slug: 'manitoba-budget-2026-local-impact', title: "Manitoba 2026 Budget: What It Means for Steinbach Residents", category: 'National', date: 'February 28, 2026', author: 'Canadian Press' },
  { id: 11, slug: 'easter-events-steinbach-2026', title: '10 Easter Events Happening in Steinbach This Weekend', category: 'Community', date: 'February 25, 2026', author: 'Staff Reporter' },
  { id: 12, slug: 'golden-west-radio-50th-anniversary', title: 'Golden West Radio Celebrates 50 Years of Local Broadcasting', category: 'Sponsored', date: 'February 20, 2026', author: 'Staff Reporter' },
]

const CATEGORY_COLORS: Record<string, string> = {
  'Local News': '#4aabf7',
  'National': '#8e54e9',
  'Sports': '#e91e8c',
  'Ag News': '#18bc9c',
  'Community': '#ffb300',
  'Sponsored': '#9e9e9e',
}

export default function SavedPage() {
  const [saved, setSaved] = useState<SavedArticle[]>(MOCK_SAVED)

  const handleRemove = (id: number) => {
    setSaved((prev) => prev.filter((a) => a.id !== id))
  }

  return (
    <div className="account-card">
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        paddingBottom: '16px',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <h1 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
          Saved Articles
          <span style={{ fontSize: '13px', fontWeight: 400, color: 'var(--color-text-tertiary)', marginLeft: '8px' }}>
            ({saved.length})
          </span>
        </h1>

        {saved.length > 0 && (
          <button
            type="button"
            className="btn btn--secondary btn--sm"
            onClick={() => {
              if (confirm('Remove all saved articles?')) setSaved([])
            }}
          >
            Clear All
          </button>
        )}
      </div>

      {saved.length === 0 ? (
        <div className="saved-list__empty">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" >
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
          </svg>
          <p>No saved articles yet.</p>
          <Link href="/news" className="btn btn--primary btn--sm">
            Browse News
          </Link>
        </div>
      ) : (
        <ul className="saved-list" aria-label="Saved articles">
          {saved.map((article) => (
            <li key={article.id} className="saved-list__item">
              {/* Thumb placeholder */}
              <div className="saved-list__thumb" aria-hidden="true">
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: 'var(--color-bg-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.3 }} >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                </div>
              </div>

              <div className="saved-list__info">
                <p
                  className="saved-list__category"
                  style={{ color: CATEGORY_COLORS[article.category] ?? 'var(--color-text-tertiary)' }}
                >
                  {article.category}
                </p>
                <Link href={`/news/${article.slug}`} className="saved-list__title">
                  {article.title}
                </Link>
                <p className="saved-list__meta">
                  {article.date} · {article.author}
                </p>
              </div>

              <button
                type="button"
                className="saved-list__remove"
                onClick={() => handleRemove(article.id)}
                aria-label={`Remove "${article.title}" from saved`}
              >
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
