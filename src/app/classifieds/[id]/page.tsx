import { notFound } from 'next/navigation'
import Link from 'next/link'
import ListPageLayout from '@/components/layout/ListPageLayout'
import SidebarPanels from '@/components/layout/SidebarPanels'
import { MOCK_CLASSIFIEDS } from '@/lib/classifieds-mock'
import type { ClassifiedListItem } from '@/lib/classifieds-mock'
import type { Metadata } from 'next'

export const revalidate = 60

// ── Dynamic metadata ──
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const item = findItem(id)

  if (!item) return { title: 'Listing Not Found' }

  return {
    title: `${item.title} — Buy & Sell — SteinbachOnline`,
    description: item.description?.slice(0, 160) ?? item.title,
  }
}

function findItem(id: string): ClassifiedListItem | undefined {
  return MOCK_CLASSIFIEDS.find(i => i.id === id)
}

function getRelatedItems(item: ClassifiedListItem): ClassifiedListItem[] {
  return MOCK_CLASSIFIEDS
    .filter(i => i.id !== item.id && i.category === item.category)
    .slice(0, 4)
}

export default async function ClassifiedDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const item = findItem(id)

  if (!item) notFound()

  const related = getRelatedItems(item)
  const categoryLabel = item.category === 'for-sale' ? 'For Sale' : 'Free'
  const isFree = item.price === 'FREE'

  return (
    <ListPageLayout
      sidebar={<SidebarPanels desktop />}
      mobileSidebar={<SidebarPanels />}
    >
      <div className="classified-detail">
        {/* ── Back link ── */}
        <Link href="/classifieds" className="classified-detail__back">
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          All Listings
        </Link>

        {/* ── Header ── */}
        <div className="classified-detail__header">
          <span className={`classified-detail__badge${isFree ? ' classified-detail__badge--free' : ''}`}>
            {categoryLabel}
          </span>
          <h1 className="classified-detail__title">{item.title}</h1>
        </div>

        {/* ── Hero image ── */}
        <div className="classified-detail__hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.image} alt={item.title} />
        </div>

        {/* ── Price + Info ── */}
        <div className="classified-detail__info">
          <div className="classified-detail__price-row">
            <div className="classified-detail__price">
              {item.originalPrice && (
                <span className="classified-detail__price-original">{item.originalPrice}</span>
              )}
              <span className="classified-detail__price-current">
                {item.discount && (
                  <span className="classified-detail__price-discount">{item.discount}</span>
                )}
                {item.price}
              </span>
            </div>
          </div>

          <div className="classified-detail__meta-rows">
            <div className="classified-detail__meta-row">
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <div>
                <span className="classified-detail__meta-label">Location</span>
                <span className="classified-detail__meta-value">{item.location}</span>
              </div>
            </div>

            <div className="classified-detail__meta-row">
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>
              <div>
                <span className="classified-detail__meta-label">Posted</span>
                <span className="classified-detail__meta-value">{item.date}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Description ── */}
        {item.description && (
          <div className="classified-detail__body">
            <h2 className="classified-detail__section-title">Description</h2>
            <p className="classified-detail__desc">{item.description}</p>
          </div>
        )}

        {/* ── Contact CTA ── */}
        <div className="classified-detail__cta">
          <button type="button" className="classified-detail__cta-btn">
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            Contact Seller
          </button>
        </div>
      </div>

      {/* ── Related listings ── */}
      {related.length > 0 && (
        <div className="classified-related">
          <h2 className="classified-related__title">More {categoryLabel} Listings</h2>
          <div className="classified-related__grid">
            {related.map(r => (
              <Link
                key={r.id}
                href={`/classifieds/${r.id}`}
                className="classified-related__card"
              >
                <div className="classified-related__thumb">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={r.image} alt="" loading="lazy" />
                </div>
                <div className="classified-related__info">
                  <span className="classified-related__name">{r.title}</span>
                  <span className="classified-related__price">{r.price}</span>
                  <span className="classified-related__meta">{r.location} · {r.date}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </ListPageLayout>
  )
}
