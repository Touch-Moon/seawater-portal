'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

// Mock auth state — replace with real auth later
const MOCK_USER = null as { name: string; email: string; avatar?: string } | null
// const MOCK_USER = { name: 'Moon', email: 'mooncreative@naver.com' }

const QUICK_LINKS = [
  { icon: '/ico-news.svg',      label: 'News',      href: '/news' },
  { icon: '/ico-weather.svg',   label: 'Weather',   href: '/weather' },
  { icon: '/ico-event.svg',     label: 'Events',    href: '/events' },
  { icon: '/ico-listen.svg',    label: 'Listen',    href: '/listen' },
  { icon: '/ico-local.svg',     label: 'Directory', href: '/directory' },
  { icon: '/ico-shopping.svg',  label: 'Buy & Sell',href: '/classifieds' },
  { icon: '/ico-sports.svg',    label: 'Sports',    href: '/news/sports' },
  { icon: '/ico-funeral.svg',   label: 'Funeral',   href: '/funeral' },
  { icon: '/ico-sponsored.svg',   label: 'Sponsored', href: '/sponsored' },
  { icon: '/ico-national.svg',    label: 'National',  href: '/news/national' },
  { icon: '/ico-agriculture.svg', label: 'Ag News',   href: '/news/ag' },
  { icon: '/ico-community.svg',   label: 'Community', href: '/news/community' },
]

interface SidePanelProps {
  open: boolean
  onClose: () => void
}

export default function SidePanel({ open, onClose }: SidePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  const user = MOCK_USER

  return (
    <>
      {/* Backdrop */}
      <div
        className={`side-panel__backdrop${open ? ' side-panel__backdrop--visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className={`side-panel${open ? ' side-panel--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        {/* Header — close button */}
        <div className="side-panel__header">
          <button
            type="button"
            className="side-panel__close-btn"
            onClick={onClose}
            aria-label="Close menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Profile area */}
        <div className="side-panel__profile">
          {user ? (
            <>
              <div className="side-panel__avatar">
                {user.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatar} alt="" width={32} height={32} />
                ) : (
                  <svg width="32" height="32" viewBox="0 0 56 56" fill="none" aria-hidden="true">
                    <circle cx="28" cy="28" r="28" fill="var(--color-bg-tertiary)" />
                    <circle cx="28" cy="22" r="9" fill="var(--color-text-tertiary)" />
                    <ellipse cx="28" cy="44" rx="16" ry="12" fill="var(--color-text-tertiary)" />
                  </svg>
                )}
              </div>
              <div className="side-panel__user-info">
                <span className="side-panel__user-name">{user.name}</span>
                <span className="side-panel__user-email">{user.email}</span>
              </div>
            </>
          ) : (
            <>
              <div className="side-panel__avatar">
                <svg width="32" height="32" viewBox="0 0 56 56" fill="none" aria-hidden="true">
                  <circle cx="28" cy="28" r="28" fill="var(--color-bg-tertiary)" />
                  <circle cx="28" cy="22" r="9" fill="var(--color-text-tertiary)" />
                  <ellipse cx="28" cy="44" rx="16" ry="12" fill="var(--color-text-tertiary)" />
                </svg>
              </div>
              <span className="side-panel__login-prompt">Sign in</span>
            </>
          )}
        </div>

        {/* Tabs */}
        <div className="side-panel__tabs">
          <button type="button" className="side-panel__tab side-panel__tab--active">Advertise with Us</button>
          <span className="side-panel__tab-divider" />
          <button type="button" className="side-panel__tab">Submit News</button>
        </div>

        {/* Quick links grid */}
        <div className="side-panel__grid">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="side-panel__grid-item"
              onClick={onClose}
            >
              <span className="side-panel__grid-icon">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={link.icon} width={56} height={56} alt="" aria-hidden="true" />
              </span>
              <span className="side-panel__grid-label">{link.label}</span>
            </Link>
          ))}
        </div>

        {/* Notice bar — hidden until content is ready */}
        {/* <div className="side-panel__notice">
          <span className="side-panel__notice-label">Notice</span>
          <span className="side-panel__notice-text">SteinbachOnline app update ...</span>
        </div> */}

        {/* Listen — radio channel 2×2 grid */}
        <div className="side-panel__listen side-panel__listen--flat side-panel__listen--radio">
          <div className="side-panel__listen-header">
            <span className="side-panel__listen-title">Listen</span>
          </div>
          <div className="side-panel__listen-grid">
            {[
              { id: 'am1250',      logo: '/radio1-light.svg',        alt: 'AM 1250',       bg: '#1a4bb5' },
              { id: 'mix967',      logo: '/radio2-light.svg',        alt: 'MIX 96.7',      bg: '#1565d8' },
              { id: 'country1077', logo: '/radio3-light.svg',        alt: 'Country 107.7', bg: '#1a1a1a' },
              { id: 'podcast',     logo: '/radio4-podcastville.svg', alt: 'Podcastville',  bg: '#3b1a5c' },
            ].map((ch) => (
              <a
                key={ch.id}
                href={`/listen/${ch.id}`}
                className="side-panel__listen-tile"
                style={{ backgroundColor: ch.bg }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="side-panel__listen-logo" src={ch.logo} alt={ch.alt} loading="lazy" />
              </a>
            ))}
          </div>
        </div>

        {/* Panel 2 — Featured */}
        <div className="side-panel__listen side-panel__listen--flat">
          <div className="side-panel__listen-header">
            <span className="side-panel__listen-title">Featured</span>
          </div>
          <div className="side-panel__listen-grid side-panel__listen-grid--col1">
            {[
              { id: 'ljs',  logo: '/logo-ljs.svg',          alt: 'Local Job Search', bg: '#ffffff', href: '#' },
              { id: 'gsj',  logo: '/logo-gsj.svg',          alt: 'Garage Sale',      bg: '#18bc9c', href: '#' },
              { id: 'hgb',  logo: '/logo-hellogoodbuy.svg', alt: 'HelloGoodBuy',     bg: '#ffffff', href: 'https://hellogoodbuy.ca' },
            ].map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="side-panel__listen-tile"
                style={{ backgroundColor: item.bg }}
                target="_blank"
                rel="noopener noreferrer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="side-panel__listen-logo" src={item.logo} alt={item.alt} loading="lazy" />
              </a>
            ))}
          </div>
        </div>

        {/* Connect — 4×2 icon grid */}
        <div className="side-panel__listen side-panel__listen--flat side-panel__listen--connect">
          <div className="side-panel__listen-header">
            <span className="side-panel__listen-title">Connect</span>
          </div>
          <div className="side-panel__connect-grid">
            {/* Row 1 — Social */}
            <a href="#" className="side-panel__connect-btn" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a href="#" className="side-panel__connect-btn" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
              </svg>
            </a>
            <a href="#" className="side-panel__connect-btn" aria-label="X" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="#" className="side-panel__connect-btn" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" fill="currentColor"/>
                <path d="M9.75 15.02 15.5 12 9.75 8.98z" fill="var(--color-bg-primary)"/>
              </svg>
            </a>
            {/* Row 2 — Site links */}
            <a href="/app" className="side-panel__connect-btn" aria-label="App Store" target="_blank" rel="noopener noreferrer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M5.474 20.2993L4.872 21.2413C4.66639 21.5907 4.33134 21.8449 3.93951 21.9488C3.54769 22.0527 3.1307 21.9979 2.779 21.7963C2.60529 21.6978 2.45286 21.5658 2.33052 21.4079C2.20818 21.2501 2.11837 21.0695 2.06629 20.8767C2.0142 20.6839 2.00088 20.4827 2.0271 20.2847C2.05331 20.0867 2.11854 19.8959 2.219 19.7233L2.6 19.1653C2.747 18.9573 3.108 18.5973 3.83 18.6653C3.83 18.6653 5.53 18.8483 5.653 19.7233C5.653 19.7233 5.67 20.0113 5.474 20.2993ZM22.468 14.1713H18.853C18.607 14.1553 18.5 14.0683 18.457 14.0173L18.455 14.0123L15 8.41233C14.62 7.83633 14.016 9.30933 14.016 9.30933C13.295 10.9513 14.118 12.8183 14.406 13.3823L19.128 21.2393C19.3336 21.5887 19.6687 21.8429 20.0605 21.9468C20.4523 22.0507 20.8693 21.9959 21.221 21.7943C21.3947 21.6958 21.5471 21.5638 21.6695 21.4059C21.7918 21.2481 21.8816 21.0675 21.9337 20.8747C21.9858 20.6819 21.9991 20.4807 21.9729 20.2827C21.9467 20.0847 21.8815 19.8939 21.781 19.7213L20.438 17.4153C20.412 17.3593 20.366 17.2083 20.642 17.2073H22.468C23.314 17.2073 24 16.5273 24 15.6893C24 14.8513 23.314 14.1713 22.468 14.1713ZM13.764 16.2353C13.764 16.2353 13.957 17.2073 13.21 17.2073H1.532C0.686 17.2073 0 16.5273 0 15.6893C0 14.8513 0.686 14.1713 1.532 14.1713H4.967C5.522 14.1393 5.653 13.8223 5.653 13.8223L5.656 13.8243L10.14 6.13033C10.1649 6.0821 10.1779 6.02861 10.1779 5.97433C10.1779 5.92005 10.1649 5.86656 10.14 5.81833L8.66 3.27733C8.55954 3.10473 8.49431 2.91392 8.4681 2.71593C8.44188 2.51795 8.4552 2.31674 8.50729 2.12394C8.55937 1.93114 8.64918 1.75059 8.77152 1.59274C8.89386 1.43488 9.04629 1.30287 9.22 1.20433C9.57179 1.00244 9.98902 0.947488 10.3811 1.0514C10.7731 1.15532 11.1084 1.40971 11.314 1.75933L12 2.93833L12.685 1.76133C12.8906 1.41198 13.2257 1.15778 13.6175 1.05388C14.0093 0.949977 14.4263 1.00476 14.778 1.20633C14.9518 1.30479 15.1043 1.43674 15.2268 1.59455C15.3492 1.75237 15.4391 1.93291 15.4913 2.12571C15.5435 2.31852 15.5569 2.51976 15.5307 2.71778C15.5046 2.9158 15.4394 3.10667 15.339 3.27933L9.1 13.9863C9.073 14.0513 9.065 14.1533 9.268 14.1713H11.314C11.314 14.1713 13.47 14.2413 13.764 16.2353Z"/>
              </svg>
            </a>
            <a href="/contact" className="side-panel__connect-btn" aria-label="Contact us">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </a>
            <a href="/submit-news" className="side-panel__connect-btn" aria-label="Submit News">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
            </a>
            <a href="/about" className="side-panel__connect-btn" aria-label="Meet the Team">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Spacer pushes footer to bottom */}
        <div className="side-panel__spacer" />

        {/* Footer */}
        <div className="side-panel__footer">
          <button type="button" className="side-panel__footer-btn">
            <span className="side-panel__footer-text-size">A<sup>+</sup></span>
          </button>
          <button type="button" className="side-panel__footer-btn">
            <span>{user ? 'Sign Out' : 'Sign In'}</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              {user ? (
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              ) : (
                <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              )}
            </svg>
          </button>
        </div>
      </div>
    </>
  )
}
