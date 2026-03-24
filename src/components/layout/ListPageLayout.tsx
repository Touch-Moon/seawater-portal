import type { ReactNode } from 'react'
import { Suspense } from 'react'
import SmartStickyCol from '@/components/layout/SmartStickyCol'
import QuickMenu from '@/components/home/QuickMenu'
import ListPageHeader from '@/components/layout/ListPageHeader'

interface ListPageLayoutProps {
  /** Sidebar content */
  sidebar?: ReactNode
  /** Sidebar content duplicated for mobile (below main) */
  mobileSidebar?: ReactNode
  /** Main content */
  children: ReactNode
  /** News page: QuickMenu 카테고리 탭 모드 */
  newsMode?: boolean
}

export default function ListPageLayout({ sidebar, mobileSidebar, children, newsMode }: ListPageLayoutProps) {
  return (
    <main id="main-content" className="list-page">
      {/* ── Sticky header ── */}
      <ListPageHeader />

      {/* ── QuickMenu ── */}
      <Suspense fallback={null}>
        <QuickMenu newsMode={newsMode} />
      </Suspense>

      {/* ── Body ── */}
      <div className="list-page__body">
        <div className="list-page__inner">
          <SmartStickyCol as="div" className="list-page__main">
            {children}

            {/* 모바일 전용: main 하단에 사이드바 패널 표시 */}
            {mobileSidebar && (
              <div className="list-page__mobile-sidebar">
                {mobileSidebar}
              </div>
            )}
          </SmartStickyCol>

          {sidebar && (
            <SmartStickyCol className="list-page__sidebar">
              {sidebar}
            </SmartStickyCol>
          )}
        </div>
      </div>
    </main>
  )
}
