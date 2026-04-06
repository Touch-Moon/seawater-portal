import Image from 'next/image'
import Link from 'next/link'
import { format, parseISO, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns'
import ListPageLayout from '@/components/layout/ListPageLayout'
import SidebarPanels from '@/components/layout/SidebarPanels'
import type { Metadata } from 'next'
import type { Event } from '@/types'
import { getEvents } from '@/lib/supabase/queries'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Events — SteinbachOnline',
  description: 'Upcoming community events in Steinbach and Southeast Manitoba.',
}

// ── Mock events (fallback when Supabase is empty) ──
function generateMockEvents(): Event[] {
  const now = new Date()
  const base = now.toISOString().split('T')[0]

  const mockData = [
    { title: 'Walking', location: 'Pat Porter Active Living Centre', time: '08:30', cat: 'fitness' },
    { title: 'FLK Tai Chi', location: 'Steinbach United Church', time: '10:00', cat: 'fitness' },
    { title: 'English Conversation Class', location: 'Emmanuel Evangelical Free Church', time: '10:00', cat: 'education' },
    { title: 'Adult Daytime Pickleball', location: 'Niverville Community Resource & Recreation', time: '10:00', cat: 'sports' },
    { title: 'Cards', location: 'Pat Porter Active Living Centre', time: '13:00', cat: 'social' },
    { title: 'Beginner Pickleball', location: 'Pat Porter Active Living Centre', time: '14:00', cat: 'sports' },
    { title: 'Junior Builders (Ages 5-8)', location: 'Jake Epp Library MPR', time: '16:30', cat: 'kids' },
    { title: 'Junior Builders (Ages 9-12)', location: 'Jake Epp Library MPR', time: '17:30', cat: 'kids' },
    { title: 'Exploring Artists Ages 5-7', location: 'Niverville Community Resource & Recreation', time: '17:30', cat: 'kids' },
    { title: "New Horizon's Community Supper", location: "New Horizon's Community Centre, Grunthal", time: '18:00', cat: 'social' },
    { title: 'Steinbach Chamber Mixer', location: 'Smitty\'s Restaurant', time: '11:30', cat: 'business' },
    { title: 'Badminton Night', location: 'Steinbach Regional Secondary School', time: '19:00', cat: 'sports' },
    { title: 'Family Board Game Night', location: 'Jake Epp Library', time: '18:30', cat: 'social' },
    { title: 'Yoga in the Park', location: 'A.D. Chicken Park', time: '09:00', cat: 'fitness' },
    { title: 'Spring Craft Fair', location: 'Steinbach Cultural Arts Centre', time: '10:00', cat: 'community' },
    { title: 'Book Club Meeting', location: 'Jake Epp Library', time: '19:00', cat: 'education' },
  ]

  return mockData.map((m, i) => {
    const dayOffset = Math.floor(i / 4)
    const d = new Date(now)
    d.setDate(d.getDate() + dayOffset)
    const dateStr = d.toISOString().split('T')[0]

    return {
      id: `mock-${i}`,
      slug: m.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, ''),
      title: m.title,
      description: `Join us for ${m.title} at ${m.location}. Open to everyone in the community.`,
      location: m.location,
      start_date: `${dateStr}T${m.time}:00`,
      category: m.cat,
      site_id: 'steinbach',
      created_at: base,
    }
  })
}

// ── Helpers ──
const EVENT_COLORS: Record<string, string> = {
  fitness: '#4aabf7',
  sports: '#ff6600',
  education: '#34a853',
  kids: '#8e54e9',
  social: '#e8192c',
  business: '#ffb300',
  community: '#4aabf7',
}

function getEventColor(category: string): string {
  return EVENT_COLORS[category] ?? '#4aabf7'
}

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export default async function EventsPage() {
  let events = await getEvents(50)

  // Fallback to mock if Supabase is empty
  if (events.length === 0) {
    events = generateMockEvents()
  }

  const now = new Date()
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)
  const allDays = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const firstDow = getDay(monthStart)

  // Group events by date
  const eventsByDate = new Map<string, Event[]>()
  for (const ev of events) {
    const dateKey = ev.start_date.split('T')[0]
    if (!eventsByDate.has(dateKey)) eventsByDate.set(dateKey, [])
    eventsByDate.get(dateKey)!.push(ev)
  }

  // Calendar cells
  const prevMonthDays = new Date(now.getFullYear(), now.getMonth(), 0).getDate()
  type Cell = { day: number; type: 'prev' | 'curr' | 'next'; dateKey?: string }
  const cells: Cell[] = []
  for (let i = firstDow - 1; i >= 0; i--) cells.push({ day: prevMonthDays - i, type: 'prev' })
  for (const d of allDays) {
    const dk = format(d, 'yyyy-MM-dd')
    cells.push({ day: d.getDate(), type: 'curr', dateKey: dk })
  }
  const trailing = cells.length % 7
  if (trailing !== 0) {
    for (let d = 1; d <= 7 - trailing; d++) cells.push({ day: d, type: 'next' })
  }

  const todayStr = format(now, 'yyyy-MM-dd')
  const monthLabel = format(now, 'MMMM yyyy')

  return (
    <ListPageLayout
      sidebar={<SidebarPanels desktop />}
      mobileSidebar={<SidebarPanels />}
    >
      <div className="events-list">
        {/* ── Header ── */}
        <div className="page-header">
          <div className="page-header__icon" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon-event.svg" width={40} height={40} alt="" />
          </div>
          <h1 className="page-header__title">Events</h1>
        </div>

        {/* ── Calendar ── */}
        <div className="events-list__calendar">
          <div className="events-list__cal-header">
            <span className="events-list__cal-month">{monthLabel}</span>
          </div>
          <div className="events-list__cal-grid">
            {DAY_LABELS.map((l, i) => (
              <span key={`h-${i}`} className="events-list__cal-head">{l}</span>
            ))}
            {cells.map((c, i) => {
              const hasEvents = c.dateKey ? eventsByDate.has(c.dateKey) : false
              const isToday = c.type === 'curr' && c.dateKey === todayStr
              return (
                <span
                  key={i}
                  className={[
                    'events-list__cal-day',
                    c.type !== 'curr' ? 'events-list__cal-day--muted' : '',
                    isToday ? 'events-list__cal-day--today' : '',
                  ].filter(Boolean).join(' ')}
                >
                  {c.day}
                  {hasEvents && <span className="events-list__cal-dot" />}
                </span>
              )
            })}
          </div>
        </div>

        {/* ── Upcoming events list ── */}
        <div className="events-list__upcoming">
          <h2 className="events-list__section-title">Upcoming Events</h2>

          {events.length === 0 ? (
            <p className="events-list__empty">No upcoming events at this time.</p>
          ) : (
            <ul className="events-list__items">
              {events.map((ev) => {
                const evDate = parseISO(ev.start_date)
                const dayLabel = isSameDay(evDate, now) ? 'Today' : format(evDate, 'EEE, MMM d')
                const timeLabel = format(evDate, 'h:mm a')
                const color = getEventColor(ev.category)

                return (
                  <li key={ev.id} className="events-list__item">
                    <Link href={`/events/${ev.slug}`} className="events-list__item-link">
                      <span className="events-list__item-bar" style={{ background: color }} />
                      <div className="events-list__item-body">
                        <span className="events-list__item-title">{ev.title}</span>
                        <span className="events-list__item-meta">
                          {dayLabel} · {timeLabel}
                        </span>
                        <span className="events-list__item-location">{ev.location}</span>
                      </div>
                      <svg aria-hidden="true" className="events-list__item-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </ListPageLayout>
  )
}
