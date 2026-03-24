'use client'

import { useSidePanel } from '@/context/SidePanelContext'

export default function MenuButton() {
  const { openPanel } = useSidePanel()

  return (
    <button
      type="button"
      className="page__hero__action-btn"
      aria-label="Open menu"
      onClick={openPanel}
    >
      <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" >
        <line x1="3" y1="5.5"  x2="21" y2="5.5"  stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="3" y1="12"   x2="21" y2="12"   stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="3" y1="18.5" x2="21" y2="18.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </button>
  )
}
