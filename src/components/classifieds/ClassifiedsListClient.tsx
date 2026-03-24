'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { ClassifiedListItem } from '@/lib/classifieds-mock'

const TABS = ['All', 'For Sale', 'Free'] as const
type Tab = typeof TABS[number]

const ITEMS_PER_PAGE = 12

interface ClassifiedsListClientProps {
  items: ClassifiedListItem[]
}

export default function ClassifiedsListClient({ items }: ClassifiedsListClientProps) {
  const [activeTab, setActiveTab] = useState<Tab>('All')
  const [page, setPage] = useState(0)

  const filtered = activeTab === 'All'
    ? items
    : items.filter(i =>
        activeTab === 'For Sale' ? i.category === 'for-sale' : i.category === 'free'
      )

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const paged = filtered.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE)

  function handleTabChange(tab: Tab) {
    setActiveTab(tab)
    setPage(0)
  }

  return (
    <>
      {/* Tabs */}
      <div className="classifieds-list__tabs">
        {TABS.map(tab => (
          <button
            key={tab}
            type="button"
            className={`classifieds-list__tab${activeTab === tab ? ' classifieds-list__tab--active' : ''}`}
            onClick={() => handleTabChange(tab)}
          >
            {tab}
            <span className="classifieds-list__tab-count">
              {tab === 'All'
                ? items.length
                : tab === 'For Sale'
                  ? items.filter(i => i.category === 'for-sale').length
                  : items.filter(i => i.category === 'free').length}
            </span>
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="classifieds-list__grid">
        {paged.map(item => (
          <Link
            key={item.id}
            href={`/classifieds/${item.id}`}
            className="classifieds-list__card"
          >
            <div className="classifieds-list__thumb" aria-hidden="true">
              <Image src={item.image} alt={item.title} width={300} height={200} loading="lazy" />
            </div>
            <div className="classifieds-list__info">
              <span className="classifieds-list__card-title">{item.title}</span>
              <div className="classifieds-list__card-price">
                {item.originalPrice && (
                  <span className="classifieds-list__card-price-original">{item.originalPrice}</span>
                )}
                <span className="classifieds-list__card-price-current">
                  {item.discount && (
                    <span className="classifieds-list__card-price-discount">{item.discount}</span>
                  )}
                  {item.price}
                </span>
              </div>
              <span className="classifieds-list__card-meta">{item.location} · {item.date}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="classifieds-list__pagination">
          <button
            type="button"
            className="classifieds-list__page-btn"
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            aria-label="Previous page"
          >
            <svg aria-hidden="true" width="8" height="14" viewBox="0 0 8 14" fill="none" >
              <path d="M7 1L1 7l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div className="classifieds-list__page-numbers">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                type="button"
                className={`classifieds-list__page-num${page === i ? ' classifieds-list__page-num--active' : ''}`}
                onClick={() => setPage(i)}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="classifieds-list__page-btn"
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            aria-label="Next page"
          >
            <svg aria-hidden="true" width="8" height="14" viewBox="0 0 8 14" fill="none" >
              <path d="M1 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      )}
    </>
  )
}
