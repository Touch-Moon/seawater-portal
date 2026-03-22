'use client'

import { useRef, useEffect } from 'react'

/**
 * Enables mouse-drag horizontal scrolling on a container.
 * - mousedown on element starts drag
 * - mousemove / mouseup bound to window so drag works even outside the element
 * - touch devices scroll natively, no interference
 */
export function useDragScroll<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null)
  const state = useRef({
    isDown: false,
    startX: 0,
    scrollLeft: 0,
    moved: false,
  })

  useEffect(() => {
    const el = ref.current
    if (!el) return

    function onMouseDown(e: MouseEvent) {
      if (e.button !== 0) return
      state.current.isDown = true
      state.current.moved = false
      state.current.startX = e.pageX
      state.current.scrollLeft = el!.scrollLeft
      el!.style.cursor = 'grabbing'
      el!.style.userSelect = 'none'
    }

    function onMouseMove(e: MouseEvent) {
      if (!state.current.isDown) return
      e.preventDefault()
      const dx = e.pageX - state.current.startX
      el!.scrollLeft = state.current.scrollLeft - dx * 1.2
      if (Math.abs(dx) > 4) state.current.moved = true
    }

    function onMouseUp() {
      if (!state.current.isDown) return
      state.current.isDown = false
      el!.style.cursor = ''
      el!.style.userSelect = ''
    }

    // Click on element — block if it was a drag
    function onClick(e: MouseEvent) {
      if (state.current.moved) {
        e.preventDefault()
        e.stopPropagation()
        state.current.moved = false
      }
    }

    // mousedown on element, move/up on window (survives leaving the element)
    el.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    el.addEventListener('click', onClick, true)

    return () => {
      el.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      el.removeEventListener('click', onClick, true)
    }
  }, [])

  return ref
}
