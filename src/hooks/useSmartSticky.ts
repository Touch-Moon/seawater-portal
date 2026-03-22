'use client'

import { useEffect, useRef } from 'react'

/**
 * Smart sticky sidebar:
 *  - Scroll DOWN → element slides toward viewport bottom, then sticks there
 *  - Scroll UP   → element slides toward viewport top (below header), then sticks there
 *
 * Algorithm: position:sticky + dynamically shift `top` by scroll delta,
 * clamped between [topOffset, vh - elHeight].
 */
export function useSmartSticky<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Measure header height dynamically, minus 16px gap
    const GAP = 16
    const getTopOffset = () =>
      ((document.querySelector('.header') as HTMLElement | null)?.offsetHeight ?? 0) - GAP

    let topOffset = getTopOffset()
    let stickyTop = topOffset
    let prevScrollY = window.scrollY

    // Apply initial sticky
    el.style.position = 'sticky'
    el.style.top = `${topOffset}px`
    el.style.alignSelf = 'flex-start'

    function onScroll() {
      const scrollY = window.scrollY
      const delta = scrollY - prevScrollY
      prevScrollY = scrollY
      if (delta === 0) return

      topOffset = getTopOffset()
      const elH = el!.offsetHeight
      const vh = window.innerHeight
      const bottomBound = vh - elH - GAP // top value when el bottom == viewport bottom - 16px

      if (delta > 0) {
        // Scrolling down → decrease top (slide toward bottom)
        stickyTop = Math.max(bottomBound, stickyTop - delta)
      } else {
        // Scrolling up → increase top (slide toward top)
        stickyTop = Math.min(topOffset, stickyTop + Math.abs(delta))
      }

      el!.style.top = `${stickyTop}px`
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', () => {
      topOffset = getTopOffset()
      stickyTop = topOffset
      el.style.top = `${topOffset}px`
    })

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return ref
}
