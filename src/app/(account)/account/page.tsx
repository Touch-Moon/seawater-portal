'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'

type UserInfo = {
  name: string
  email: string
  joinedDate: string
}

const MOCK_RECENT_SAVED = [
  { slug: 'steinbach-city-council-approves-new-recreation-centre', title: 'Steinbach City Council Approves New Recreation Centre', category: 'Local News', date: 'March 22, 2026' },
  { slug: 'manitoba-hydro-announces-rate-increase', title: 'Manitoba Hydro Announces 4.5% Rate Increase for 2026', category: 'National', date: 'March 20, 2026' },
  { slug: 'se-mb-bisons-win-provincial-championship', title: 'SE MB Bisons Win Provincial Championship in Overtime Thriller', category: 'Sports', date: 'March 18, 2026' },
  { slug: 'spring-flooding-outlook-for-red-river', title: 'Spring Flooding Outlook for the Red River Valley Released', category: 'Local News', date: 'March 15, 2026' },
]

export default function AccountPage() {
  const [user, setUser] = useState<UserInfo | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return
      const name =
        data.user.user_metadata?.nickname ??
        data.user.user_metadata?.full_name ??
        data.user.email?.split('@')[0] ??
        'User'
      const joinedDate = data.user.created_at
        ? format(new Date(data.user.created_at), 'MMMM yyyy')
        : '—'
      setUser({ name, email: data.user.email ?? '', joinedDate })
    })
  }, [])

  const initial = user
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <>
      {/* Profile hero */}
      <div className="account-card">
        <div className="account-profile">
          <div className="account-profile__avatar" aria-hidden="true">{initial}</div>
          <div className="account-profile__info">
            <h1 className="account-profile__name">{user?.name ?? '—'}</h1>
            <p className="account-profile__email">{user?.email ?? ''}</p>
            <span className="account-profile__badge">
              <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
                <path d="M12 2L3 7l9 5 9-5-9-5zM3 17l9 5 9-5M3 12l9 5 9-5" />
              </svg>
              Free Member{user?.joinedDate ? ` · Since ${user.joinedDate}` : ''}
            </span>
          </div>
          <div className="account-profile__actions">
            <Link href="/account/settings" className="btn btn--secondary btn--sm">
              Edit Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="account-card">
        <h2 className="account-card__title">Overview</h2>
        <div className="account-stats">
          <div className="account-stats__item">
            <p className="account-stats__value">12</p>
            <p className="account-stats__label">Saved Articles</p>
          </div>
          <div className="account-stats__item">
            <p className="account-stats__value">3</p>
            <p className="account-stats__label">Comments</p>
          </div>
          <div className="account-stats__item">
            <p className="account-stats__value">
              <span style={{ color: '#18bc9c', fontSize: '20px' }}>✓</span>
            </p>
            <p className="account-stats__label">Newsletter</p>
          </div>
        </div>
      </div>

      {/* Recently saved */}
      <div className="account-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
            Recently Saved
          </h2>
          <Link href="/account/saved" className="btn btn--secondary btn--sm">
            View All
          </Link>
        </div>
        <div className="account-saved-grid">
          {MOCK_RECENT_SAVED.map((article) => (
            <Link key={article.slug} href={`/news/${article.slug}`} className="account-article-card">
              <div className="account-article-card__thumb">
                <div style={{ width: '100%', height: '100%', background: 'var(--color-bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.3 }} >
                    <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" />
                  </svg>
                </div>
              </div>
              <p className="account-article-card__category">{article.category}</p>
              <p className="account-article-card__title">{article.title}</p>
              <p className="account-article-card__meta">{article.date}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
