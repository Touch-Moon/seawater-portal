'use client'

import { useState, useEffect, useCallback } from 'react'

// ── 브레이크포인트 (_variables.scss의 $breakpoint-* 값과 동기화) ──
export const BREAKPOINTS = {
  md:    672,   // $breakpoint-md   ← 소형 태블릿 시작
  mdLg:  981,   // $breakpoint-md-lg ← 대형 태블릿 시작
  lg:    1200,  // $breakpoint-lg   ← 데스크탑 시작
} as const

export type BreakpointKey = keyof typeof BREAKPOINTS

interface Breakpoint {
  width: number
  isMobile: boolean        // < 672px
  isSmallTablet: boolean   // 672–980px
  isLargeTablet: boolean   // 981–1199px
  isTablet: boolean        // 672–1199px
  isDesktop: boolean       // ≥ 1200px
  /** 지정 브레이크포인트 이상이면 true */
  isAbove: (bp: BreakpointKey) => boolean
  /** 지정 브레이크포인트 미만이면 true */
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
 * 현재 뷰포트 브레이크포인트 정보를 반환한다.
 * SSR 안전: 서버에서는 데스크탑 기본값을 반환하고 마운트 후 정확한 값으로 수화한다.
 *
 * @example
 * const { isDesktop, isBelow } = useBreakpoint()
 * if (isBelow('md')) { ... }  // 모바일 전용 분기
 */
export function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>(() =>
    // SSR 기본값: 데스크탑 너비로 초기화
    getBreakpoint(BREAKPOINTS.lg)
  )

  const handleResize = useCallback(() => {
    setBp(getBreakpoint(window.innerWidth))
  }, [])

  useEffect(() => {
    // 마운트 직후 실제 뷰포트 너비로 즉시 갱신
    handleResize()

    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [handleResize])

  return bp
}
