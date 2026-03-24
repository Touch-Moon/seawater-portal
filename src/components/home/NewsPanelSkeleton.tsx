/**
 * NewsPanelSkeleton — Suspense fallback for NewsPanel
 * 실제 패널 레이아웃(.panel)을 재사용해 shimmer placeholder 표시
 */
export default function NewsPanelSkeleton() {
  return (
    <div className="panel">
      {/* Header */}
      <div className="sk-panel__header">
        <div className="sk sk--xl sk-panel__icon" />
        <div className="sk sk--pill sk-panel__title" />
      </div>
      {/* Grid 2×2 */}
      <div className="sk-grid" style={{ marginTop: 16 }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="sk-grid__card">
            <div className="sk sk-grid__thumb" />
            <div className="sk sk--pill sk-grid__line" />
            <div className="sk sk--pill sk-grid__line sk-grid__line--short" />
          </div>
        ))}
      </div>
      {/* List rows */}
      <div className="sk-list" style={{ marginTop: 8 }}>
        {[0, 1, 2, 3, 4, 5].map(i => (
          <div key={i} className="sk-list__item">
            <div className="sk sk--pill sk-list__line" style={{ width: `${75 + (i % 3) * 8}%` }} />
          </div>
        ))}
      </div>
    </div>
  )
}
