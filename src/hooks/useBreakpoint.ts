'use client'

import { useState, useEffect } from 'react'

// ── Breakpoints (matches $breakpoint-* in _variables.scss) ──
export const BREAKPOINTS = {
  md:    672,   // $breakpoint-md     ← small tablet start
  mdLg:  981,   // $breakpoint-md-lg  ← large tablet start
  lg:    1200,  // $breakpoint-lg     ← desktop start
} as const

export type BreakpointKey = keyof typeof BREAKPOINTS

interface Breakpoint {
  width: number
  isMobile: boolean        // < 672px
  isSmallTablet: boolean   // 672–980px
  isLargeTablet: boolean   // 981–1199px
  isTablet: boolean        // 672–1199px
  isDesktop: boolean       // ≥ 1200px
  /** true when ≥ given breakpoint */
  isAbove: (bp: BreakpointKey) => boolean
  /** true when < given breakpoint */
  isBelow: (bp: BreakpointKey) => boolean
}

function getBreakpoint(width: number): Breakpoint {
  return {
    width,
    isMobile:      width < BREAKPOINTS.md,
    isSmallTablet: width >= BREAKPOINTS.md && width < BREAKPOINTS.mdLg,
    isLargeTablet: width >= BREAKPOINTS.mdLg && width < BREAKPOINTS.lg,
    isTablet:      width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
    isDesktop:     width >= BREAKPOINTS.lg,
    isAbove:       (bp) => width >= BREAKPOINTS[bp],
    isBelow:       (bp) => width < BREAKPOINTS[bp],
  }
}

/**
 * useBreakpoint
 *
 * Returns current viewport breakpoint info.
 * SSR-safe: returns desktop defaults on server, hydrates after mount.
 *
 * @example
 * const { isDesktop, isBelow } = useBreakpoint()
 * if (isBelow('md')) { ... }  // mobile-only logic
 */
export function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>(() =>
    // SSR-safe default (desktop)
    getBreakpoint(BREAKPOINTS.lg)
  )

  useEffect(() => {
    function handleResize() {
      setBp(getBreakpoint(window.innerWidth))
    }

    // Set accurate value immediately after mount
    handleResize()

    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return bp
}
