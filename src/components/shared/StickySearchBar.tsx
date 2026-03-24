'use client'

import { useState, useEffect, useRef } from 'react'
import SearchBar from './SearchBar'
import Link from 'next/link'
import MenuButton from './MenuButton'

export default function StickySearchBar() {
  const [visible, setVisible] = useState(false)
  const ticking = useRef(false)

  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return
      ticking.current = true

      requestAnimationFrame(() => {
        const homeEl = document.querySelector('.home')
        if (homeEl) {
          const rect = homeEl.getBoundingClientRect()
          setVisible(rect.top <= 0)
        }
        ticking.current = false
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className={`sticky-search-bar${visible ? ' sticky-search-bar--visible' : ''}`}
      aria-hidden={!visible}
    >
      <div className="sticky-search-bar__bar">
        <SearchBar />
        <div className="page__hero__actions">
          <MenuButton />
        </div>
      </div>
    </div>
  )
}
