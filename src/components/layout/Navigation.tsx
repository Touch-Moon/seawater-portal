'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { href: '/',            label: 'Home' },
  { href: '/news',        label: 'News' },
  { href: '/weather',     label: 'Weather' },
  { href: '/events',      label: 'Events' },
  { href: '/listen',      label: 'Listen' },
  { href: '/features',    label: 'Features' },
  { href: '/directory',   label: 'Directory' },
  { href: '/classifieds', label: 'Classifieds' },
]

export default function Navigation() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)

  const toggleMenu = useCallback(() => setMenuOpen((prev) => !prev), [])
  const closeMenu  = useCallback(() => setMenuOpen(false), [])

  // Scroll lock (skill: scroll-lock-nav)
  useEffect(() => {
    if (!menuOpen) return

    let startY = 0
    const savedY = window.scrollY
    let rafId: number

    const enforcePosition = () => {
      if (window.scrollY !== savedY) window.scrollTo(0, savedY)
      rafId = requestAnimationFrame(enforcePosition)
    }
    rafId = requestAnimationFrame(enforcePosition)

    const onWheel      = (e: WheelEvent)   => { e.preventDefault() }
    const onTouchStart = (e: TouchEvent)   => { startY = e.touches[0].clientY }
    const onTouchMove  = (e: TouchEvent)   => {
      if (!e.cancelable) return
      const deltaY = Math.abs(e.touches[0].clientY - startY)
      if (deltaY < 10) return
      if (navRef.current?.contains(e.target as Node) &&
          navRef.current.scrollHeight > navRef.current.clientHeight) return
      e.preventDefault()
    }
    const onKeyDown = (e: KeyboardEvent) => {
      const scrollKeys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ']
      const tag = (e.target as HTMLElement).tagName
      if (['INPUT', 'TEXTAREA', 'BUTTON', 'A'].includes(tag)) return
      if (scrollKeys.includes(e.key)) e.preventDefault()
    }

    document.addEventListener('wheel',      onWheel      as EventListener, { passive: false, capture: true })
    document.addEventListener('touchstart',  onTouchStart as EventListener, { passive: true })
    document.addEventListener('touchmove',   onTouchMove  as EventListener, { passive: false })
    window.addEventListener('keydown', onKeyDown)

    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener('wheel',     onWheel      as EventListener, { capture: true })
      document.removeEventListener('touchstart', onTouchStart as EventListener)
      document.removeEventListener('touchmove',  onTouchMove  as EventListener)
      window.removeEventListener('keydown', onKeyDown)

      // 2-frame compositor flush
      document.documentElement.style.overflowY = 'hidden'
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.documentElement.style.overflowY = ''
          window.scrollTo(0, savedY)
        })
      })
    }
  }, [menuOpen])

  useEffect(() => { closeMenu() }, [pathname, closeMenu])

  return (
    <nav className="navigation" aria-label="Main navigation">
      <div className="navigation__inner">
        {/* Desktop links */}
        <ul className="navigation__desktop-links" role="list">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`navigation__link${isActive ? ' navigation__link--active' : ''}`}
                >
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Hamburger */}
        <button
          className={`navigation__hamburger${menuOpen ? ' navigation__hamburger--open' : ''}`}
          onClick={toggleMenu}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-overlay"
        >
          <span className="navigation__bar" />
          <span className="navigation__bar" />
          <span className="navigation__bar" />
        </button>
      </div>

      {/* Mobile overlay */}
      {menuOpen && (
        <>
          <div className="navigation__backdrop" onClick={closeMenu} aria-hidden="true" />
          <div
            ref={navRef}
            id="mobile-nav-overlay"
            className="navigation__overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <ul className="navigation__overlay-links" role="list">
              {NAV_LINKS.map(({ href, label }) => {
                const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={`navigation__overlay-link${isActive ? ' navigation__overlay-link--active' : ''}`}
                      onClick={closeMenu}
                    >
                      {label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </>
      )}
    </nav>
  )
}
