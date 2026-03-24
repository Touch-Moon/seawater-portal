import type { Metadata } from 'next'
import ListPageLayout from '@/components/layout/ListPageLayout'
import SidebarPanels from '@/components/layout/SidebarPanels'
import ListenChannels from '@/components/listen/ListenChannels'

export const metadata: Metadata = {
  title: 'Listen — SteinbachOnline',
  description: 'Live radio streaming from Golden West Broadcasting. AM 1250, MIX 96.7, and Country 107.7.',
}

export default function ListenPage() {
  return (
    <ListPageLayout
      sidebar={<SidebarPanels desktop />}
      mobileSidebar={<SidebarPanels />}
    >
      <ListenChannels />
    </ListPageLayout>
  )
}
