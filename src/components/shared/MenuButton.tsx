'use client'

import { useState } from 'react'
import SidePanel from './SidePanel'

export default function MenuButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        className="page__hero__action-btn"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <line x1="3" y1="5.5"  x2="21" y2="5.5"  stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="3" y1="12"   x2="21" y2="12"   stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="3" y1="18.5" x2="21" y2="18.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      <SidePanel open={open} onClose={() => setOpen(false)} />
    </>
  )
}
