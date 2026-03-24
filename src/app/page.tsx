import { Suspense } from 'react'
import SearchBar from '@/components/shared/SearchBar'
import QuickMenu from '@/components/home/QuickMenu'
import AdBanner from '@/components/home/AdBanner'
import LoginPanel from '@/components/home/LoginPanel'
import LivePanel from '@/components/home/LivePanel'
import AdCard from '@/components/home/AdCard'
import NewsAdBanner from '@/components/home/NewsAdBanner'
import ClassifiedsPreview from '@/components/home/ClassifiedsPreview'
import ContestPanel from '@/components/home/ContestPanel'
import WeatherWidget from '@/components/home/WeatherWidget'
import EventsPanel from '@/components/home/EventsPanel'
import JobsPanel from '@/components/home/JobsPanel'
import SidebarPanels from '@/components/layout/SidebarPanels'
import SmartStickyCol from '@/components/layout/SmartStickyCol'
import StickySearchBar from '@/components/shared/StickySearchBar'
import MenuButton from '@/components/shared/MenuButton'
import NewsPanelSkeleton from '@/components/home/NewsPanelSkeleton'
import {
  TopNewsPanelFetcher,
  LocalNewsPanelFetcher,
  NationalNewsPanelFetcher,
  SportsPanelFetcher,
  AgNewsPanelFetcher,
  CommunityPanelFetcher,
  SponsoredPanelFetcher,
} from '@/components/home/NewsPanelFetcher'

// 각 패널이 독립적으로 fetch하므로 페이지 자체는 revalidate 불필요
// 개별 fetch의 ISR(60s)이 캐시를 관리함
export const revalidate = 60

export default function Home() {
  return (
    <main id="main-content" className="page">

      {/* ── Sticky SearchBar clone ── */}
      <StickySearchBar />

      {/* ── Hero: SearchBar + action buttons ── */}
      <div className="page__hero">
        <div className="page__hero__bar">
          <SearchBar />
          <div className="page__hero__actions">
            <MenuButton />
          </div>
        </div>
      </div>

      {/* ── Quick menu pill bar ── */}
      <QuickMenu />

      {/* ── Home 2-column grid ── */}
      <section className="home">
        <div className="home__inner">

          {/* Left 768px — main content */}
          <SmartStickyCol className="home__main">
            <AdBanner />
            <LivePanel />

            {/* Top News — 메인 패널, 가장 먼저 스트리밍 */}
            <Suspense fallback={<NewsPanelSkeleton />}>
              <TopNewsPanelFetcher />
            </Suspense>

            <WeatherWidget mobile />
            <NewsAdBanner />
            <ClassifiedsPreview />
            <ContestPanel mobile />
            <AdCard mobile />

            <Suspense fallback={<NewsPanelSkeleton />}>
              <LocalNewsPanelFetcher />
            </Suspense>

            <EventsPanel mobile />

            <Suspense fallback={<NewsPanelSkeleton />}>
              <NationalNewsPanelFetcher />
            </Suspense>

            <JobsPanel mobile />

            <Suspense fallback={<NewsPanelSkeleton />}>
              <SponsoredPanelFetcher />
            </Suspense>

            <Suspense fallback={<NewsPanelSkeleton />}>
              <SportsPanelFetcher />
            </Suspense>

            <Suspense fallback={<NewsPanelSkeleton />}>
              <AgNewsPanelFetcher />
            </Suspense>

            <Suspense fallback={<NewsPanelSkeleton />}>
              <CommunityPanelFetcher />
            </Suspense>
          </SmartStickyCol>

          {/* Right 384px — sidebar */}
          <SmartStickyCol className="home__sidebar">
            <LoginPanel />
            <SidebarPanels desktop />
          </SmartStickyCol>

        </div>
      </section>

    </main>
  )
}
