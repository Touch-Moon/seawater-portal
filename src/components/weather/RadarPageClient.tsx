'use client'

import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'

const RadarMap = dynamic(() => import('./RadarMap'), {
  ssr: false,
  loading: () => (
    <div className="radar-map radar-map--loading">
      <div className="radar-map__container radar-map__container--skeleton">
        <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="radar-map__spinner">
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
        <span>Loading radar map…</span>
      </div>
    </div>
  ),
})

export default function RadarPageClient() {
  const { resolvedTheme } = useTheme()

  return <RadarMap theme={resolvedTheme} />
}
