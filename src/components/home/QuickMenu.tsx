'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useDragScroll } from '@/hooks/useDragScroll'
import { useBreakpoint } from '@/hooks/useBreakpoint'

// QuickMenu href → news?cat= 매핑
// 값은 cat 쿼리 파라미터에 사용되는 모든 alias를 포함
const NEWS_CAT_MAP: Record<string, string[]> = {
  '/local-news':    ['local-news'],
  '/national-news': ['national-news', 'national'],
  '/sports':        ['sports'],
  '/ag-news':       ['ag-news', 'ag'],
  '/community':     ['community'],
  '/sponsored':     ['sponsored'],
}

interface QuickMenuItem {
  label: string
  icon: React.ReactNode
  href: string
  gradient: string
}

interface ListenChannel {
  id: string
  title: string
  subtitle: string
  href: string
  thumb: string // placeholder gradient
  live: boolean
}

// ── Visible bar items ──
const BAR_ITEMS: QuickMenuItem[] = [
  {
    label: 'News',
    href: '/news',
    gradient: 'linear-gradient(180deg, #4aabf7, #6c80f0)',
    icon: (<img src="/icon-news.svg" width={24} height={24} alt="" aria-hidden="true" />),
  },
  {
    label: 'Local',
    href: '/local-news',
    gradient: 'linear-gradient(180deg, #6c80f0, #8e54e9)',
    icon: (<img src="/icon-local.svg" width={24} height={24} alt="" aria-hidden="true" />),
  },
  {
    label: 'National',
    href: '/national-news',
    gradient: 'linear-gradient(180deg, #8e54e9, #bb3be9)',
    icon: (<img src="/icon-national.svg" width={24} height={24} alt="" aria-hidden="true" />),
  },
  {
    label: 'Sponsored',
    href: '/sponsored',
    gradient: 'linear-gradient(180deg, #bb3be9, #e91e8c)',
    icon: (<img src="/icon-sponsored.svg" width={24} height={24} alt="" aria-hidden="true" />),
  },
  {
    label: 'Sports',
    href: '/sports',
    gradient: 'linear-gradient(180deg, #e91e8c, #f46a49)',
    icon: (<img src="/icon-sports.svg" width={24} height={24} alt="" aria-hidden="true" />),
  },
  {
    label: 'Agriculture',
    href: '/ag-news',
    gradient: 'linear-gradient(180deg, #f46a49, #ffb300)',
    icon: (<img src="/icon-ag-news.svg" width={24} height={24} alt="" aria-hidden="true" />),
  },
  {
    label: 'Community',
    href: '/community',
    gradient: 'linear-gradient(180deg, #ffb300, #e96da0)',
    icon: (<img src="/icon-community.svg" width={24} height={24} alt="" aria-hidden="true" />),
  },
]

// ── Additional items (previously in "..." panel, now inline) ──
const EXTRA_ITEMS: QuickMenuItem[] = []

const ALL_ITEMS = [...BAR_ITEMS, ...EXTRA_ITEMS]

// ── Listen panel channels ──
const LISTEN_CHANNELS: ListenChannel[] = [
  {
    id: 'ch1',
    title: 'Steinbach Online Radio',
    subtitle: 'Local News & Talk',
    href: '/listen/radio',
    thumb: '/logo-am1250-dark.svg',
    live: true,
  },
  {
    id: 'ch2',
    title: 'Community Voices',
    subtitle: 'Weekdays 9:00 AM',
    href: '/listen/community',
    thumb: '/logo-mix967-dark.svg',
    live: true,
  },
  {
    id: 'ch3',
    title: 'Farm & Country',
    subtitle: 'Agriculture & Rural Life',
    href: '/listen/farm',
    thumb: '/logo-country107-dark.svg',
    live: false,
  },
]

type PanelType = null | 'more' | 'listen'

export default function QuickMenu({ newsMode }: { newsMode?: boolean } = {}) {
  const [activePanel, setActivePanel] = useState<PanelType>(null)
  const [showScrollHint, setShowScrollHint] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const listenBtnRef = useRef<HTMLButtonElement>(null)
  const moreBtnRef = useRef<HTMLButtonElement>(null)
  const dragScrollRef = useDragScroll<HTMLDivElement>()
  const { isAbove } = useBreakpoint()
  const isTabletUp = isAbove('lg') // ≥ 1168px: show "..." panel mode (desktop only)
  const searchParams = useSearchParams()
  const currentCat = newsMode ? (searchParams.get('cat') ?? '') : null

  function getHref(item: QuickMenuItem): string {
    if (item.href === '/news') return '/news'
    const cats = NEWS_CAT_MAP[item.href]
    return cats ? `/news?cat=${cats[0]}` : item.href
  }

  function isItemActive(item: QuickMenuItem): boolean {
    if (!newsMode) return false
    if (item.href === '/news') return currentCat === ''
    const cats = NEWS_CAT_MAP[item.href]
    return cats ? cats.includes(currentCat ?? '') : false
  }

  // scroll-hint-wrap: bar에 가로 스크롤이 생길 때만 표시
  useEffect(() => {
    const bar = dragScrollRef.current
    if (!bar) return

    const check = () => setShowScrollHint(bar.scrollWidth > bar.clientWidth)

    check()
    window.addEventListener('resize', check)
    bar.addEventListener('scroll', check)
    return () => {
      window.removeEventListener('resize', check)
      bar.removeEventListener('scroll', check)
    }
  }, [])

  function togglePanel(type: 'more' | 'listen') {
    setActivePanel((prev) => (prev === type ? null : type))
  }

  useEffect(() => {
    if (!activePanel) return

    function handleClick(e: MouseEvent) {
      const target = e.target as Node
      if (
        panelRef.current?.contains(target) ||
        listenBtnRef.current?.contains(target) ||
        moreBtnRef.current?.contains(target)
      ) return
      setActivePanel(null)
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setActivePanel(null)
    }

    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [activePanel])

  return (
    <nav className="quick-menu" aria-label="Quick menu">
      {/* Horizontal scroll hint icon — mobile only */}
      <span className="quick-menu__scroll-hint" aria-hidden="true">
        <svg aria-hidden="true" width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path fillRule="evenodd" clipRule="evenodd" d="M17.293 4.2928C17.684 3.9024 18.317 3.9024 18.707 4.2928L22.687 8.2742C22.857 8.4359 22.972 8.6565 22.995 8.9041C22.998 8.9368 23 8.9697 23 9.0028C23 9.2678 22.895 9.5224 22.707 9.7098L18.707 13.7069C18.316 14.0972 17.683 14.0973 17.293 13.7069C16.903 13.3163 16.903 12.6832 17.293 12.2928L19.587 9.9998H7C6.448 9.9998 6 9.5521 6 8.9998C6 8.4475 6.448 7.9998 7 7.9998H19.585L17.293 5.7069C16.903 5.3163 16.903 4.6832 17.293 4.2928Z" fill="currentColor" />
          <path fillRule="evenodd" clipRule="evenodd" d="M11.707 23.7069C11.316 24.0973 10.683 24.0973 10.293 23.7069L6.313 19.7255C6.143 19.5638 6.028 19.3432 6.005 19.0956C6.002 19.0629 6 19.03 6 18.9969C6 18.7319 6.105 18.4773 6.293 18.2899L10.293 14.2928C10.684 13.9025 11.317 13.9024 11.707 14.2928C12.097 14.6834 12.097 15.3165 11.707 15.7069L9.41299 17.9999H22C22.552 17.9999 23 18.4476 23 18.9999C23 19.5522 22.552 19.9999 22 19.9999H9.41499L11.707 22.2928C12.097 22.6834 12.097 23.3165 11.707 23.7069Z" fill="currentColor" />
        </svg>
      </span>

      {/* Gradient fade + scroll hint button — bar에 가로 스크롤이 있을 때만 표시 */}
      <div className={`quick-menu__scroll-hint-wrap${showScrollHint ? ' quick-menu__scroll-hint-wrap--visible' : ''}`}>
        <button
          type="button"
          className="quick-menu__scroll-hint-btn"
          aria-label="Scroll navigation"
        >
          <img src="/icon-scroll-hint.svg" width={28} height={28} alt="" aria-hidden="true" />
        </button>
      </div>

      <div className="quick-menu__bar" ref={dragScrollRef}>
        {/* BAR_ITEMS: always visible */}
        {BAR_ITEMS.map((item) => (
          <Link key={item.href} href={getHref(item)} className={`quick-menu__item${isItemActive(item) ? ' quick-menu__item--active' : ''}`}>
            <span className="quick-menu__icon" style={{ background: item.gradient }}>
              {item.icon}
            </span>
            <span className="quick-menu__label">{item.label}</span>
          </Link>
        ))}

        {/* EXTRA_ITEMS: visible on mobile + small tablet scroll, hidden on desktop+ */}
        {EXTRA_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={getHref(item)}
            className="quick-menu__item quick-menu__item--extra"
          >
            <span className="quick-menu__icon" style={{ background: item.gradient }}>
              {item.icon}
            </span>
            <span className="quick-menu__label">{item.label}</span>
          </Link>
        ))}

        {/* More button: desktop only (JS-gated via useBreakpoint) */}
        {isTabletUp && (
        <button
          ref={moreBtnRef}
          type="button"
          className={`quick-menu__item quick-menu__item--toggle quick-menu__item--more-btn${activePanel === 'more' ? ' quick-menu__item--active' : ''}`}
          aria-label={activePanel === 'more' ? 'Close menu' : 'More'}
          aria-expanded={activePanel === 'more'}
          onClick={() => togglePanel('more')}
        >
          <span className="quick-menu__toggle-icon">
            {activePanel === 'more' ? (
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" >
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" >
                <circle cx="5" cy="12" r="2.2" fill="currentColor" />
                <circle cx="12" cy="12" r="2.2" fill="currentColor" />
                <circle cx="19" cy="12" r="2.2" fill="currentColor" />
              </svg>
            )}
          </span>
        </button>
        )}
      </div>

      {/* More panel: tablet+ only (JS-gated via useBreakpoint) */}
      {isTabletUp && activePanel === 'more' && (
        <div className="quick-menu__panel" ref={panelRef}>
          <div className="quick-menu__panel-grid">
            {EXTRA_ITEMS.map((item) => (
              <Link key={item.href} href={getHref(item)} className="quick-menu__panel-item">
                <span className="quick-menu__icon" style={{ background: item.gradient }}>
                  {item.icon}
                </span>
                <span className="quick-menu__label">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Listen panel ── */}
      {activePanel === 'listen' && (
        <div className="quick-menu__panel quick-menu__panel--listen" ref={panelRef}>
          <div className="quick-menu__listen-grid">
            {LISTEN_CHANNELS.map((ch) => (
              <a key={ch.id} href={ch.href} className="quick-menu__listen-card">
                <div className="quick-menu__listen-thumb">
                  <img
                    src={ch.thumb}
                    alt={ch.title}
                    className="quick-menu__listen-img"
                  />
                  {/* Play icon overlay */}
                  <span className="quick-menu__listen-play" aria-hidden="true">
                    <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="12" fill="rgba(0,0,0,0.45)" />
                      <path d="M10 8l6 4-6 4V8z" fill="#ffffff" />
                    </svg>
                  </span>
                  <span className="quick-menu__listen-live">
                    <svg aria-hidden="true" width="10" height="10" viewBox="0 0 10 10" fill="none" >
                      <path d="M2 1.5l6 3.5-6 3.5V1.5z" fill="currentColor" />
                    </svg>
                    Play
                  </span>
                </div>
                <div className="quick-menu__listen-info">
                  <span className="quick-menu__listen-title">{ch.title}</span>
                  <span className="quick-menu__listen-subtitle">{ch.subtitle}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
