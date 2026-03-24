'use client'

import { useEffect, useRef } from 'react'

/**
 * Smart sticky sidebar:
 *  - 사이드바 높이 ≤ 뷰포트 가용 높이 → 항상 상단(topOffset)에 고정
 *  - 사이드바 높이 > 뷰포트 가용 높이 → 스마트 스크롤:
 *      Scroll DOWN → 뷰포트 하단까지 슬라이드 후 고정
 *      Scroll UP   → 헤더 바로 아래까지 슬라이드 후 고정
 *
 * Algorithm: position:sticky + dynamically shift `top` by scroll delta,
 * clamped between [topOffset, vh - elHeight].
 */
export function useSmartSticky<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Measure sticky header height dynamically + gap
    const GAP = 16
    const getTopOffset = () => {
      // sticky header 높이 (항상 화면 상단에 고정)
      const header =
        (document.querySelector('.list-page__head') as HTMLElement | null) ??
        (document.querySelector('.header') as HTMLElement | null)
      const headerH = header?.offsetHeight ?? 0

      // QuickMenu는 sticky가 아니므로 현재 뷰포트 내에 보이는 높이만 계산
      const quickMenu = document.querySelector('.quick-menu__bar') as HTMLElement | null
      let quickMenuVisibleH = 0
      if (quickMenu) {
        const rect = quickMenu.getBoundingClientRect()
        // 헤더 아래부터 실제로 보이는 바 높이만 계산 (패딩/위치 포함 안 함)
        // rect.bottom - max(rect.top, headerH) = 실제 보이는 bar 높이
        quickMenuVisibleH = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, headerH))
      }

      return headerH + quickMenuVisibleH + GAP
    }

    let topOffset = getTopOffset()
    let stickyTop = topOffset
    let prevScrollY = window.scrollY

    // Mobile (<672px): no sticky
    const applySticky = () => window.innerWidth >= 672

    if (!applySticky()) return

    // Apply initial sticky
    el.style.position = 'sticky'
    el.style.top = `${topOffset}px`
    el.style.alignSelf = 'flex-start'

    /** 사이드바가 뷰포트에 다 들어오는지 여부 */
    const fitsInViewport = () => {
      const elH = el!.offsetHeight
      const vh = window.innerHeight
      return elH <= vh - getTopOffset()
    }

    function onScroll() {
      if (!applySticky()) {
        el!.style.position = ''
        el!.style.top = ''
        el!.style.alignSelf = ''
        return
      }

      // 사이드바가 뷰포트에 다 들어오면 JS 개입 없이 CSS sticky에 맡김
      if (fitsInViewport()) {
        topOffset = getTopOffset()
        stickyTop = topOffset
        prevScrollY = window.scrollY
        el!.style.top = `${stickyTop}px`
        return
      }

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

    function onResize() {
      topOffset = getTopOffset()
      stickyTop = topOffset
      prevScrollY = window.scrollY
      if (applySticky()) {
        el!.style.position = 'sticky'
        el!.style.top = `${topOffset}px`
        el!.style.alignSelf = 'flex-start'
      } else {
        el!.style.position = ''
        el!.style.top = ''
        el!.style.alignSelf = ''
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return ref
}
