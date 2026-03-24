'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

// ── Mock events — source: steinbachonline.com/events (replace with Supabase later) ──
interface MockEvent {
  month: number
  day: number
  time: string
  title: string
  location: string
  color: string
}

const _now = new Date()
const _m   = _now.getMonth() + 1
const _d   = _now.getDate()

const MOCK_EVENTS: MockEvent[] = [
  { month: _m, day: _d, time: '8:30 AM',  title: 'Walking',                      location: 'Pat Porter Active Living Centre',              color: '#4aabf7' },
  { month: _m, day: _d, time: '10:00 AM', title: 'FLK Tai Chi',                  location: 'Steinbach United Church',                     color: '#8e54e9' },
  { month: _m, day: _d, time: '10:00 AM', title: 'English Conversation Class',    location: 'Emmanuel Evangelical Free Church',            color: '#34a853' },
  { month: _m, day: _d, time: '10:00 AM', title: 'Adult Daytime Pickleball',      location: 'Niverville Community Resource & Recreation',  color: '#ff6600' },
  { month: _m, day: _d, time: '1:00 PM',  title: 'Cards',                         location: 'Pat Porter Active Living Centre',             color: '#e8192c' },
  { month: _m, day: _d, time: '2:00 PM',  title: 'Beginner Pickleball',           location: 'Pat Porter Active Living Centre',            color: '#ffb300' },
  { month: _m, day: _d, time: '4:30 PM',  title: 'Junior Builders (Ages 5-8)',    location: 'Jake Epp Library MPR',                       color: '#4aabf7' },
  { month: _m, day: _d, time: '5:30 PM',  title: 'Junior Builders (Ages 9-12)',   location: 'Jake Epp Library MPR',                       color: '#8e54e9' },
  { month: _m, day: _d, time: '5:30 PM',  title: 'Exploring Artists Ages 5-7',    location: 'Niverville Community Resource & Recreation', color: '#34a853' },
  { month: _m, day: _d, time: '6:00 PM',  title: "New Horizon's Community Supper", location: "New Horizon's Community Centre, Grunthal",  color: '#e8192c' },
]

const EXPANDED_MAX  = 6
const DAY_LABELS    = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const DAY_SHORT     = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

// ── Slot item — 펼친 list 와 동일한 마크업/클래스 ──
function SlotItem({ event }: { event: MockEvent }) {
  return (
    <li className="events-panel__event-item">
      <span className="events-panel__event-bar" style={{ background: event.color }} />
      <span className="events-panel__event-info">
        <span className="events-panel__event-title">{event.title}</span>
        <span className="events-panel__event-meta">{event.time} · {event.location}</span>
      </span>
    </li>
  )
}

export default function EventsPanel({ mobile, desktop }: { mobile?: boolean; desktop?: boolean } = {}) {
  const [expanded,   setExpanded]   = useState(false)
  const [startIdx,   setStartIdx]   = useState(0)
  const [sliding,    setSliding]    = useState(false)

  const intervalRef    = useRef<ReturnType<typeof setInterval> | null>(null)
  const isHoveredRef   = useRef(false)
  const isExpandedRef  = useRef(false)

  // ── Calendar date setup ──
  const today      = new Date()
  const year       = today.getFullYear()
  const month      = today.getMonth()
  const date       = today.getDate()
  const dayName    = DAY_LABELS[today.getDay()]
  const monthLabel = today.toLocaleString('en-US', { month: 'long' })
  const dateStr    = `${monthLabel.slice(0, 3)} ${date}`

  // ── Calendar grid ──
  const firstDow    = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrev  = new Date(year, month, 0).getDate()
  type Cell = { day: number; type: 'prev' | 'curr' | 'next' }
  const cells: Cell[] = []
  for (let i = firstDow - 1; i >= 0; i--) cells.push({ day: daysInPrev - i, type: 'prev' })
  for (let d = 1; d <= daysInMonth; d++)   cells.push({ day: d, type: 'curr' })
  const trailing = cells.length % 7
  if (trailing !== 0) for (let d = 1; d <= 7 - trailing; d++) cells.push({ day: d, type: 'next' })

  // ── Events for today ──
  const allTodayEvents = MOCK_EVENTS.filter(e => e.month === month + 1 && e.day === date)
  const eventDays      = new Set(MOCK_EVENTS.filter(e => e.month === month + 1).map(e => e.day))
  const N              = allTodayEvents.length

  // ── Rolling interval (ContestPanel 동일 패턴) ──
  function startInterval() {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    intervalRef.current = setInterval(() => {
      if (!isHoveredRef.current && !isExpandedRef.current) setSliding(true)
    }, 3000)
  }
  function stopInterval() {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
  }

  useEffect(() => {
    startInterval()
    return () => stopInterval()
  }, [])

  useEffect(() => {
    isExpandedRef.current = expanded
    if (expanded) stopInterval()
    else startInterval()
  }, [expanded])

  const handleMouseEnter = () => { isHoveredRef.current = true;  stopInterval() }
  const handleMouseLeave = () => {
    isHoveredRef.current = false
    if (!isExpandedRef.current) startInterval()
  }

  const STEP = 3  // 한 번에 롤링되는 아이템 수

  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName !== 'transform' || e.target !== e.currentTarget) return
    setStartIdx(prev => (prev + STEP) % N)
    setSliding(false)
  }

  // 현재 3개 + 다음 3개
  const curItems = N > 0 ? Array.from({ length: STEP }, (_, i) => allTodayEvents[(startIdx + i) % N]) : []
  const nxtItems = N > 0 ? Array.from({ length: STEP }, (_, i) => allTodayEvents[(startIdx + STEP + i) % N]) : []

  return (
    <div
      className={`events-panel panel${mobile ? ' events-panel--mobile' : ''}${desktop ? ' events-panel--desktop' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="events-panel__inner">

        {/* ── Header: date + down-btn ── */}
        <div className="events-panel__left">
          <div className="events-panel__header">
            <Link href="/events" className="events-panel__date-wrap">
              <span className="events-panel__big-date">{dateStr}</span>
              <span className="events-panel__day-name">{dayName}</span>
            </Link>
            <button
              type="button"
              className={`events-panel__down-btn${expanded ? ' events-panel__down-btn--open' : ''}`}
              aria-label={expanded ? 'Collapse' : 'Expand'}
              onClick={() => setExpanded(v => !v)}
            >
              <img src="/ico-down-arrow.svg" width={16} height={16} alt="" aria-hidden="true" />
            </button>
          </div>

          {/* ── Collapsed: slot machine rolling (3개씩) ── */}
          <div className={`events-panel__body${expanded ? ' events-panel__body--hidden' : ''}`}>
            {curItems.length > 0 && (
              <div className="events-panel__slot-window">
                <div
                  className={`events-panel__slot-track${sliding ? ' events-panel__slot-track--sliding' : ''}`}
                  onTransitionEnd={handleTransitionEnd}
                >
                  {/* 현재 3개 */}
                  <ul className="events-panel__today-events events-panel__slot-group">
                    {curItems.map((e, i) => <SlotItem key={`cur-${i}`} event={e} />)}
                  </ul>
                  {/* 다음 3개 */}
                  <ul className="events-panel__today-events events-panel__slot-group">
                    {nxtItems.map((e, i) => <SlotItem key={`nxt-${i}`} event={e} />)}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* ── Expanded: full list ── */}
          <div className={`events-panel__list${expanded ? ' events-panel__list--open' : ''}`}>
            <ul className="events-panel__today-events">
              {allTodayEvents.slice(0, EXPANDED_MAX).map((e) => (
                <li key={`${e.month}-${e.day}-${e.time}-${e.title}`} className="events-panel__event-item">
                  <span className="events-panel__event-bar" style={{ background: e.color }} />
                  <span className="events-panel__event-info">
                    <span className="events-panel__event-title">{e.title}</span>
                    <span className="events-panel__event-meta">{e.time} · {e.location}</span>
                  </span>
                </li>
              ))}
            </ul>

            {/* View all events link */}
            <Link href="/events" className="events-panel__tab">
              View all events
              <img src="/ico-gotolink-right-arrow.svg" width={14} height={14} alt="" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* ── Calendar (expanded only) ── */}
        {expanded && (
          <div className="events-panel__cal">
            <div className="events-panel__cal-month">{monthLabel} {year}</div>
            <div className="events-panel__cal-grid">
              {DAY_SHORT.map((d, i) => (
                <span key={d + i} className={`events-panel__cal-dow${i === 0 ? ' events-panel__cal-dow--sun' : ''}`}>
                  {d}
                </span>
              ))}
              {cells.map((cell, idx) => {
                const isToday  = cell.type === 'curr' && cell.day === date
                const isSun    = idx % 7 === 0
                const hasEvent = cell.type === 'curr' && eventDays.has(cell.day)
                const cls = [
                  'events-panel__cal-day',
                  cell.type !== 'curr'          ? 'events-panel__cal-day--other' : '',
                  isToday                       ? 'events-panel__cal-day--today' : '',
                  isSun && cell.type === 'curr' ? 'events-panel__cal-day--sun'   : '',
                ].filter(Boolean).join(' ')
                return (
                  <span key={idx} className={cls}>
                    {cell.day}
                    {hasEvent && !isToday && <span className="events-panel__cal-dot" />}
                  </span>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Footer: expand/collapse toggle ── */}
        {/* <div className="events-panel__footer">
          <button
            className={`events-panel__footer-more${expanded ? ' events-panel__footer-more--open' : ''}`}
            onClick={() => setExpanded(v => !v)}
            aria-expanded={expanded}
          >
            {expanded ? 'Less' : 'More events'}
            <img src="/ico-down-arrow.svg" width={14} height={14} alt="" aria-hidden="true" />
          </button>
        </div> */}

      </div>
    </div>
  )
}
