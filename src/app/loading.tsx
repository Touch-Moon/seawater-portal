// ============================================
//  Homepage skeleton shimmer — loading.tsx
//  실제 페이지의 layout 클래스를 그대로 사용하여
//  레이아웃이 100% 일치하도록 함
// ============================================

export default function HomeLoading() {
  return (
    <main className="page">

      {/* ── Hero — .page__hero 실제 클래스 사용 ── */}
      <div className="page__hero">
        <div className="page__hero__bar">
          <div className="search-bar__section">
            <div className="sk sk-search" />
          </div>
        </div>
      </div>

      {/* ── Quick menu — .quick-menu 실제 wrapper 클래스 사용 ── */}
      <nav className="quick-menu" aria-hidden="true">
        <div className="sk-quick">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="sk-quick__item">
              <div className="sk sk-quick__icon" />
              <div className="sk sk-quick__label" />
            </div>
          ))}
        </div>
      </nav>

      {/* ── 2-column body — .home, .home__inner 실제 클래스 사용 ── */}
      <section className="home">
        <div className="home__inner">

          {/* Left column — .home__main */}
          <div className="home__main">

            {/* AdBanner */}
            <div className="sk sk-banner" />

            {/* LivePanel */}
            <div className="panel">
              <div className="sk-panel__header">
                <div className="sk sk-panel__icon" />
                <div className="sk sk-panel__title" />
              </div>
              <div className="sk-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="sk-grid__card">
                    <div className="sk sk-grid__thumb" />
                    <div className="sk sk-grid__line" style={{ width: '80%' }} />
                  </div>
                ))}
              </div>
            </div>

            {/* NewsPanel (Top News) */}
            <div className="panel">
              <div className="sk-panel__header">
                <div className="sk sk-panel__icon" />
                <div className="sk sk-panel__title" style={{ width: 80 }} />
              </div>
              <div className="sk-grid">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="sk-grid__card">
                    <div className="sk sk-grid__thumb" />
                    <div className="sk sk-grid__line" style={{ width: '90%' }} />
                    <div className="sk sk-grid__line sk-grid__line--short" />
                  </div>
                ))}
              </div>
              <div className="sk-list">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="sk-list__item">
                    <div className="sk sk-list__line" />
                  </div>
                ))}
              </div>
            </div>

            {/* NewsAdBanner */}
            <div className="sk sk-banner" style={{ height: 90 }} />

            {/* ClassifiedsPreview */}
            <div className="panel">
              <div className="sk-panel__header">
                <div className="sk sk-panel__icon" />
                <div className="sk sk-panel__title" style={{ width: 100 }} />
              </div>
              <div className="sk-grid">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="sk-grid__card">
                    <div className="sk sk-grid__thumb" />
                    <div className="sk sk-grid__line" style={{ width: '90%' }} />
                    <div className="sk sk-grid__line sk-grid__line--short" />
                  </div>
                ))}
              </div>
            </div>

            {/* Additional news panels ×2 */}
            {Array.from({ length: 2 }).map((_, idx) => (
              <div key={idx} className="panel">
                <div className="sk-panel__header">
                  <div className="sk sk-panel__icon" />
                  <div className="sk sk-panel__title" />
                </div>
                <div className="sk-list">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="sk-list__item">
                      <div className="sk sk-list__line" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right column — .home__sidebar */}
          <div className="home__sidebar">

            {/* LoginPanel */}
            <div className="sk sk-banner" />

            {/* AdCard */}
            <div className="sk-sidebar-card" style={{ padding: 0, height: 280 }}>
              <div className="sk" style={{ width: '100%', height: '100%', borderRadius: 'var(--radius-xl)' }} />
            </div>

            {/* WeatherWidget */}
            <div className="sk-sidebar-card">
              <div className="sk-sidebar-row">
                <div className="sk sk-sidebar-row__icon" />
                <div className="sk-sidebar-row__lines">
                  <div className="sk sk-sidebar-row__line" />
                  <div className="sk sk-sidebar-row__line" />
                </div>
              </div>
            </div>

            {/* ContestPanel */}
            <div className="sk-sidebar-card">
              <div className="sk-panel__header">
                <div className="sk sk-panel__icon" style={{ width: 32, height: 32 }} />
                <div className="sk sk-panel__title" style={{ width: 80 }} />
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
                <div className="sk" style={{ flex: 1, height: 80, borderRadius: 'var(--radius-md)' }} />
                <div className="sk" style={{ flex: 1, height: 80, borderRadius: 'var(--radius-md)' }} />
              </div>
            </div>

            {/* EventsPanel */}
            <div className="sk-sidebar-card">
              <div className="sk-panel__header">
                <div className="sk sk-panel__icon" style={{ width: 32, height: 32 }} />
                <div className="sk sk-panel__title" style={{ width: 100 }} />
              </div>
              <div className="sk-list" style={{ marginTop: 8 }}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="sk-list__item">
                    <div className="sk sk-list__line" />
                  </div>
                ))}
              </div>
            </div>

            {/* JobsPanel */}
            <div className="sk-sidebar-card">
              <div className="sk-panel__header">
                <div className="sk sk-panel__icon" style={{ width: 32, height: 32 }} />
                <div className="sk sk-panel__title" style={{ width: 60 }} />
              </div>
              <div className="sk-list" style={{ marginTop: 8 }}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="sk-list__item">
                    <div className="sk sk-list__line" />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

    </main>
  )
}
