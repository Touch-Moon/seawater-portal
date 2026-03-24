'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

const BANNERS = [
  { id: 1, src: 'https://d3355vjhs3bhr1.cloudfront.net/fit-in/200x100/2023-09/2023-09_RoadReports-KalTire_Feature.png',             alt: 'Road Reports',      href: '#' },
  { id: 2, src: 'https://d3355vjhs3bhr1.cloudfront.net/fit-in/200x100/2024-12/2024-12-09_Games-FeatureLink.jpg',                    alt: 'Games',             href: '#' },
  { id: 3, src: 'https://d3355vjhs3bhr1.cloudfront.net/fit-in/200x100/2024-07/Newsletter-feature-banner-Steinbach-online-v1.2.jpg', alt: 'Newsletter',        href: '#' },
  { id: 4, src: 'https://d3355vjhs3bhr1.cloudfront.net/fit-in/200x100/2023-05/STOL%202023-02_LiveWebcam_GiantHeader.png',           alt: 'Live Webcam',       href: '#' },
  { id: 5, src: 'https://d3355vjhs3bhr1.cloudfront.net/fit-in/200x100/2024-07/2024-FeelGoodFridays-Feature.jpg',                    alt: 'Feel Good Fridays', href: '#' },
  { id: 6, src: 'https://d3355vjhs3bhr1.cloudfront.net/fit-in/200x100/2022-06/2022-STOLcontestscountry107-feature.jpg',             alt: 'Country 107',       href: '#' },
  { id: 7, src: 'https://d3355vjhs3bhr1.cloudfront.net/fit-in/200x100/2022-06/2022-STOLcontestsmix-feature.jpg',                    alt: 'Mix Contests',      href: '#' },
]

const N = BANNERS.length

// 태블릿(672~1199px): 사이드바 300px → 1개씩
// 모바일(<672px) + 데스크탑(≥1200px): 2개씩
function getStep() {
  if (typeof window === 'undefined') return 2
  const w = window.innerWidth
  return w >= 672 && w <= 1199 ? 1 : 2
}

export default function ContestPanel({ mobile, desktop }: { mobile?: boolean; desktop?: boolean } = {}) {
  const [startIdx, setStartIdx]     = useState(0)
  const [sliding, setSliding]       = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [step, setStep]             = useState(2)
  const intervalRef                 = useRef<ReturnType<typeof setInterval> | null>(null)
  const isHoveredRef                = useRef(false)
  const isExpandedRef               = useRef(false)
  const stepRef                     = useRef(2)

  // step 초기화 + resize 대응
  useEffect(() => {
    const update = () => {
      const s = getStep()
      stepRef.current = s
      setStep(s)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // isExpanded ref 동기화
  useEffect(() => {
    isExpandedRef.current = isExpanded
    if (isExpanded) stopInterval()
    else startInterval()
  }, [isExpanded])

  function startInterval() {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    intervalRef.current = setInterval(() => {
      if (!isHoveredRef.current && !isExpandedRef.current) {
        setSliding(true)
      }
    }, 3000)
  }

  function stopInterval() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  // 컴포넌트 마운트 시 인터벌 시작
  useEffect(() => {
    startInterval()
    return () => stopInterval()
  }, [])

  const handleMouseEnter = () => {
    isHoveredRef.current = true
    stopInterval()
  }

  const handleMouseLeave = () => {
    isHoveredRef.current = false
    if (!isExpandedRef.current) startInterval()
  }

  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName !== 'transform' || e.target !== e.currentTarget) return
    setStartIdx(prev => (prev + stepRef.current) % N)
    setSliding(false)
  }

  const cur = step === 1
    ? [BANNERS[startIdx % N]]
    : [BANNERS[startIdx % N], BANNERS[(startIdx + 1) % N]]
  const nxt = step === 1
    ? [BANNERS[(startIdx + 1) % N]]
    : [BANNERS[(startIdx + 2) % N], BANNERS[(startIdx + 3) % N]]

  return (
    <div
      className={`contest${mobile ? ' contest--mobile' : ''}${desktop ? ' contest--desktop' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >

      {/* ── Header ── */}
      <div className="contest__header">
        <a href="#" className="contest__title-wrap">
          <div className="contest__title-link">
            Contest
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 18 18" fill="none" >
              <path d="M7 4l5 5-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </a>

        <button
          type="button"
          className={`contest__down-btn${isExpanded ? ' contest__down-btn--open' : ''}`}
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
          onClick={() => setIsExpanded(v => !v)}
        >
          <img src="/ico-down-arrow.svg" width={16} height={16} alt="" aria-hidden="true" />
        </button>
      </div>

      {/* ── Slot machine (collapsed) ── */}
      <div className={`contest__body${isExpanded ? ' contest__body--hidden' : ''}`}>
        <div className={`contest__slot-window${step === 1 ? ' contest__slot-window--single' : ''}`}>
          <div
            className={`contest__slot-track${sliding ? ' contest__slot-track--sliding' : ''}`}
            onTransitionEnd={handleTransitionEnd}
          >
            <div className="contest__slot-row">
              {cur.map((b, i) => (
                <a key={`cur-${i}`} href={b.href} className="contest__banner">
                  <Image className="contest__banner-img" src={b.src} alt={b.alt} width={160} height={80} loading="lazy" />
                </a>
              ))}
            </div>
            <div className="contest__slot-row">
              {nxt.map((b, i) => (
                <a key={`nxt-${i}`} href={b.href} className="contest__banner">
                  <Image className="contest__banner-img" src={b.src} alt={b.alt} width={160} height={80} loading="lazy" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Expanded list (all banners) ── */}
      <div className={`contest__list${isExpanded ? ' contest__list--open' : ''}`}>
        <div className="contest__list-grid">
          {BANNERS.map((b) => (
            <a key={b.id} href={b.href} className="contest__banner">
              <Image className="contest__banner-img" src={b.src} alt={b.alt} width={160} height={80} loading="lazy" />
            </a>
          ))}
        </div>
      </div>

    </div>
  )
}
