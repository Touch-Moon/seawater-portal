import Link from 'next/link'
import ListPageLayout from '@/components/layout/ListPageLayout'
import SidebarPanels from '@/components/layout/SidebarPanels'
import { getBusinesses } from '@/lib/supabase/queries'
import type { Metadata } from 'next'
import type { Business } from '@/types'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Business Directory — SteinbachOnline',
  description: 'Find local businesses in Steinbach and Southeast Manitoba.',
}

// ── Mock businesses ──
function generateMockBusinesses(): Business[] {
  const mocks = [
    { name: 'Steinbach Credit Union', category: 'finance', description: 'Full-service financial institution serving Southeast Manitoba.', address: '294 Main St, Steinbach, MB', phone: '204-326-3495', website: 'https://scu.mb.ca' },
    { name: 'Clearspring Centre', category: 'shopping', description: 'Steinbach\'s premier shopping destination with over 50 stores.', address: '25 PTH 12 N, Steinbach, MB', phone: '204-326-5545', website: 'https://clearspringcentre.com' },
    { name: 'Pat Porter Active Living Centre', category: 'recreation', description: 'Community recreation facility with pool, gym, and meeting rooms.', address: '10 Brandt St, Steinbach, MB', phone: '204-346-6366' },
    { name: 'Jake Epp Library', category: 'education', description: 'Public library offering books, programs, and community events.', address: '255 Elmdale St, Steinbach, MB', phone: '204-326-6841', website: 'https://jakepplibrary.com' },
    { name: 'Smitty\'s Family Restaurant', category: 'restaurant', description: 'Family dining with a wide menu of Canadian comfort food.', address: '145 PTH 12 N, Steinbach, MB', phone: '204-326-9498' },
    { name: 'Steinbach Automotive', category: 'automotive', description: 'Full-service auto repair and maintenance shop.', address: '380 Main St, Steinbach, MB', phone: '204-326-1234' },
    { name: 'Mennonite Heritage Village', category: 'tourism', description: 'Museum and heritage park celebrating Mennonite history and culture.', address: '231 PTH 12 N, Steinbach, MB', phone: '204-326-9661', website: 'https://mennoniteheritagevillage.com' },
    { name: 'Steinbach Fly-In Golf Club', category: 'recreation', description: '18-hole golf course open to the public.', address: 'Hwy 52, Steinbach, MB', phone: '204-326-3444' },
    { name: 'Southeast Chiropractic', category: 'health', description: 'Chiropractic care and wellness services.', address: '116 PTH 12 N, Steinbach, MB', phone: '204-326-1888' },
    { name: 'DeLuca\'s Chicken & Pizza', category: 'restaurant', description: 'Local favourite for chicken and pizza since 1982.', address: '226 Main St, Steinbach, MB', phone: '204-326-3636' },
    { name: 'Steinbach Home Hardware', category: 'shopping', description: 'Hardware, building supplies, and home improvement.', address: '198 PTH 12 N, Steinbach, MB', phone: '204-326-9901' },
    { name: 'Prairie Rose School Division', category: 'education', description: 'Public school division serving Steinbach and surrounding area.', address: '45 Main St, Steinbach, MB', phone: '204-326-6471' },
    { name: 'Birchwood Dental', category: 'health', description: 'General and cosmetic dentistry for the whole family.', address: '332 Main St, Steinbach, MB', phone: '204-326-2121' },
    { name: 'Steinbach Dodge Chrysler', category: 'automotive', description: 'New and used vehicle sales, service, and parts.', address: '555 PTH 12 N, Steinbach, MB', phone: '204-326-4461' },
    { name: 'A.D. Couriers', category: 'services', description: 'Same-day delivery and courier services in Southeast Manitoba.', address: '60 Industrial Dr, Steinbach, MB', phone: '204-326-4040' },
    { name: 'Golden West Broadcasting', category: 'media', description: 'Local radio stations: AM 1250, MIX 96.7, Country 107.7.', address: '32 Brandt St, Steinbach, MB', phone: '204-326-3737', website: 'https://goldenwestradio.com' },
  ]

  return mocks.map((m, i) => ({
    id: `mock-${i}`,
    name: m.name,
    category: m.category,
    description: m.description,
    address: m.address,
    phone: m.phone,
    website: m.website,
    site_id: 'steinbach',
  }))
}

const CATEGORY_LABELS: Record<string, string> = {
  finance: 'Finance',
  shopping: 'Shopping',
  recreation: 'Recreation',
  education: 'Education',
  restaurant: 'Restaurants',
  automotive: 'Automotive',
  tourism: 'Tourism',
  health: 'Health',
  services: 'Services',
  media: 'Media',
}

const CATEGORY_ORDER = [
  'restaurant', 'shopping', 'health', 'automotive',
  'finance', 'recreation', 'education', 'tourism',
  'services', 'media',
]

export default async function DirectoryPage() {
  let businesses = await getBusinesses()

  if (businesses.length === 0) {
    businesses = generateMockBusinesses()
  }

  // Group by category
  const grouped = new Map<string, Business[]>()
  for (const b of businesses) {
    if (!grouped.has(b.category)) grouped.set(b.category, [])
    grouped.get(b.category)!.push(b)
  }

  // Sort categories
  const sortedCategories = CATEGORY_ORDER.filter(c => grouped.has(c))
  // Add any remaining categories not in the order list
  for (const c of grouped.keys()) {
    if (!sortedCategories.includes(c)) sortedCategories.push(c)
  }

  return (
    <ListPageLayout
      sidebar={<SidebarPanels desktop />}
      mobileSidebar={<SidebarPanels />}
    >
      <div className="directory">
        {/* Header */}
        <div className="page-header">
          <div className="page-header__icon" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/ico-local.svg" width={40} height={40} alt="" />
          </div>
          <h1 className="page-header__title">Directory</h1>
        </div>

        {/* Category sections */}
        {sortedCategories.map((cat) => {
          const items = grouped.get(cat)!
          const label = CATEGORY_LABELS[cat] ?? cat

          return (
            <div key={cat} className="directory__section">
              <h2 className="directory__section-title">{label}</h2>
              <ul className="directory__list">
                {items.map((b) => (
                  <li key={b.id} className="directory__item">
                    <div className="directory__item-body">
                      <span className="directory__item-name">{b.name}</span>
                      <span className="directory__item-desc">{b.description}</span>
                      <div className="directory__item-meta">
                        <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <span>{b.address}</span>
                      </div>
                      {b.phone && (
                        <div className="directory__item-meta">
                          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                          </svg>
                          <a href={`tel:${b.phone}`} className="directory__item-phone">{b.phone}</a>
                        </div>
                      )}
                    </div>
                    {b.website && (
                      <a
                        href={b.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="directory__item-link"
                        aria-label={`Visit ${b.name} website (opens in new tab)`}
                      >
                        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" x2="21" y1="14" y2="3" />
                        </svg>
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </ListPageLayout>
  )
}
