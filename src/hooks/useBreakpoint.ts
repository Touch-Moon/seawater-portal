'use client'

import { useState, useEffect } from 'react'

// ── Breakpoints (matches $breakpoint-* in _variables.scss) ──
export const BREAKPOINTS = {
  sm: 480,   // $breakpoint-sm
  md: 768,   // $breakpoint-md
  lg: 1168,  // $breakpoint-lg  ← desktop max-width
} as const

export type BreakpointKey = keyof typeof BREAKPOINTS

interface Breakpoint {
  width: number
  isMobile: boolean    // < 480px
  isTablet: boolean    // 480–1167px
  isDesktop: boolean   // ≥ 1168px
  /** true when ≥ given breakpoint */
  isAbove: (bp: BreakpointKey) => boolean
  /** true when < given breakpoint */
  isBelow: (bp: BreakpointKey) => boolean
}

function getBreakpoint(width: number): Breakpoint {
  return {
    width,
    isMobile:  width < BREAKPOINTS.sm,
    isTablet:  width >= BREAKPOINTS.sm && width < BREAKPOINTS.lg,
    isDesktop: width >= BREAKPOINTS.lg,
    isAbove:   (bp) => width >= BREAKPOINTS[bp],
    isBelow:   (bp) => width < BREAKPOINTS[bp],
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
