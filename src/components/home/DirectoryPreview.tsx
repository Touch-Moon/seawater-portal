import Link from 'next/link'
import { getBusinesses } from '@/lib/supabase/queries'

// Fallback mock data if Supabase returns empty
const MOCK_BUSINESSES = [
  {
    id: '1',
    name: "Smitty's Family Restaurant",
    category: 'Restaurants',
    description: 'Family dining with a wide menu of Canadian comfort food.',
    address: '145 PTH 12 N, Steinbach, MB',
    phone: '204-326-9498',
    website: undefined,
    image: undefined,
    site_id: 'steinbachonline',
  },
  {
    id: '2',
    name: 'Clearspring Centre',
    category: 'Shopping',
    description: "Steinbach's premier shopping destination with over 50 stores.",
    address: '25 PTH 12 N, Steinbach, MB',
    phone: '204-326-5545',
    website: 'https://clearspringcentre.com',
    image: undefined,
    site_id: 'steinbachonline',
  },
  {
    id: '3',
    name: 'Steinbach Home Hardware',
    category: 'Home & Garden',
    description: 'Hardware, building supplies, and home improvement.',
    address: '198 PTH 12 N, Steinbach, MB',
    phone: '204-326-9901',
    website: undefined,
    image: undefined,
    site_id: 'steinbachonline',
  },
]

interface DirectoryPreviewProps {
  mobile?: boolean
  desktop?: boolean
}

export default async function DirectoryPreview({ mobile, desktop }: DirectoryPreviewProps) {
  const dbBusinesses = await getBusinesses()
  const businesses = (dbBusinesses.length > 0 ? dbBusinesses : MOCK_BUSINESSES).slice(0, 3)

  const modifiers = [
    mobile  ? 'directory-preview--mobile'  : '',
    desktop ? 'directory-preview--desktop' : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={`directory-preview panel${modifiers ? ` ${modifiers}` : ''}`}>
      {/* Header */}
      <div className="directory-preview__header">
        <div className="directory-preview__title-wrap">
          <Link href="/directory" className="directory-preview__title-link">
            Directory
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" >
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Business list */}
      <ul className="directory-preview__list">
        {businesses.map((biz) => (
          <li key={biz.id} className="directory-preview__item">
            <Link href="/directory" className="directory-preview__link">
              <div className="directory-preview__icon" aria-hidden="true">
                {/* First letter avatar */}
                <span>{biz.name.charAt(0)}</span>
              </div>
              <div className="directory-preview__info">
                <span className="directory-preview__name">{biz.name}</span>
                <span className="directory-preview__category">{biz.category}</span>
                {biz.phone && (
                  <span className="directory-preview__phone">{biz.phone}</span>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="directory-preview__footer">
        <Link href="/directory" className="directory-preview__view-all">
          View Directory
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" >
            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
