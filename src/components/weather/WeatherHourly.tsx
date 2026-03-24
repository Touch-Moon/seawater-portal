'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import type { HourForecast } from '@/lib/weather'

interface WeatherHourlyProps {
  hours: HourForecast[]
}

export default function WeatherHourly({ hours }: WeatherHourlyProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 1)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    checkScroll()
    el.addEventListener('scroll', checkScroll, { passive: true })
    window.addEventListener('resize', checkScroll)
    return () => {
      el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [checkScroll])

  function scroll(dir: 'left' | 'right') {
    scrollRef.current?.scrollBy({
      left: dir === 'left' ? -240 : 240,
      behavior: 'smooth',
    })
  }

  return (
    <div className="weather-hourly">
      <h2 className="weather-hourly__title">Hourly Forecast</h2>

      <div className="weather-hourly__scroll-wrap">
        {canScrollLeft && (
          <button
            type="button"
            className="weather-hourly__nav-btn weather-hourly__nav-btn--left"
            onClick={() => scroll('left')}
            aria-label="Scroll left"
          >
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        <div className="weather-hourly__scroll" ref={scrollRef}>
          {hours.map((h) => (
            <div key={h.time} className="weather-hourly__item">
              <span className="weather-hourly__time">{h.time}</span>
              <Image
                src={h.icon}
                alt={h.condition}
                width={40}
                height={40}
                unoptimized
                className="weather-hourly__icon"
              />
              <span className="weather-hourly__temp">{h.temp}°</span>
              {h.chanceOfRain > 0 && (
                <span className="weather-hourly__rain">{h.chanceOfRain}%</span>
              )}
            </div>
          ))}
        </div>

        {canScrollRight && (
          <button
            type="button"
            className="weather-hourly__nav-btn weather-hourly__nav-btn--right"
            onClick={() => scroll('right')}
            aria-label="Scroll right"
          >
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
