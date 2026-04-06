import ListPageLayout from '@/components/layout/ListPageLayout'
import SidebarPanels from '@/components/layout/SidebarPanels'
import ClassifiedsListClient from '@/components/classifieds/ClassifiedsListClient'
import { getClassifieds } from '@/lib/supabase/queries'
import { MOCK_CLASSIFIEDS } from '@/lib/classifieds-mock'
import type { ClassifiedListItem } from '@/lib/classifieds-mock'
import type { Metadata } from 'next'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Buy & Sell — SteinbachOnline',
  description: 'Browse classifieds: items for sale, free stuff, and more in Steinbach & area.',
}

export default async function ClassifiedsPage() {
  const dbItems = await getClassifieds()

  let items: ClassifiedListItem[]
  if (dbItems.length > 0) {
    items = dbItems.map(c => ({
      id: c.id,
      title: c.title,
      category: (c.category === 'free' ? 'free' : 'for-sale') as 'for-sale' | 'free',
      price: c.salary_range ?? 'Contact',
      location: c.location,
      date: new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      image: '',
    }))
  } else {
    items = MOCK_CLASSIFIEDS
  }

  return (
    <ListPageLayout
      sidebar={<SidebarPanels desktop />}
      mobileSidebar={<SidebarPanels />}
    >
      <div className="classifieds-list">
        {/* Header */}
        <div className="page-header">
          <div className="page-header__icon" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon-shopping.svg" width={40} height={40} alt="" />
          </div>
          <h1 className="page-header__title">Buy &amp; Sell</h1>
        </div>

        {/* Client: tabs + grid + pagination */}
        <ClassifiedsListClient items={items} />
      </div>
    </ListPageLayout>
  )
}
