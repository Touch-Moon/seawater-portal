import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import ListPageLayout from '@/components/layout/ListPageLayout'
import SidebarPanels from '@/components/layout/SidebarPanels'
import { getEventBySlug, getEvents } from '@/lib/supabase/queries'
import type { Metadata } from 'next'
import type { Event } from '@/types'

export const revalidate = 60

// ── Mock events (same as list page, for fallback) ──
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
    const d = new Date(now)
    d.setDate(d.getDate() + Math.floor(i / 4))
    const dateStr = d.toISOString().split('T')[0]

    return {
      id: `mock-${i}`,
      slug: m.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, ''),
      title: m.title,
      description: `Join us for ${m.title} at ${m.location}. Open to everyone in the community. Come enjoy a wonderful time with friends and neighbors in the Steinbach area.`,
      location: m.location,
      start_date: `${dateStr}T${m.time}:00`,
      category: m.cat,
      site_id: 'steinbach',
      created_at: base,
    }
  })
}

const CATEGORY_LABELS: Record<string, string> = {
  fitness: 'Fitness',
  sports: 'Sports',
  education: 'Education',
  kids: 'Kids',
  social: 'Social',
  business: 'Business',
  community: 'Community',
}

const EVENT_COLORS: Record<string, string> = {
  fitness: '#4aabf7',
  sports: '#ff6600',
  education: '#34a853',
  kids: '#8e54e9',
  social: '#e8192c',
  business: '#ffb300',
  community: '#4aabf7',
}

// ── Dynamic metadata ──
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const event = await findEvent(slug)

  if (!event) return { title: 'Event Not Found' }

  return {
    title: `${event.title} — SteinbachOnline Events`,
    description: event.description?.slice(0, 160),
  }
}

async function findEvent(slug: string): Promise<Event | null> {
  // Try Supabase first
  const event = await getEventBySlug(slug)
  if (event) return event

  // Fallback to mock
  const mocks = generateMockEvents()
  return mocks.find(e => e.slug === slug) ?? null
}

async function findRelatedEvents(event: Event): Promise<Event[]> {
  // Try Supabase
  let events = await getEvents(20)
  if (events.length === 0) events = generateMockEvents()

  return events
    .filter(e => e.id !== event.id)
    .slice(0, 4)
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const event = await findEvent(slug)

  if (!event) notFound()

  const related = await findRelatedEvents(event)
  const evDate = parseISO(event.start_date)
  const dateStr = format(evDate, 'EEEE, MMMM d, yyyy')
  const timeStr = format(evDate, 'h:mm a')
  const categoryLabel = CATEGORY_LABELS[event.category] ?? event.category
  const color = EVENT_COLORS[event.category] ?? '#4aabf7'

  return (
    <ListPageLayout
      sidebar={<SidebarPanels desktop />}
      mobileSidebar={<SidebarPanels />}
    >
      <div className="event-detail">
        {/* ── Back link ── */}
        <Link href="/events" className="event-detail__back">
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          All Events
        </Link>

        {/* ── Header ── */}
        <div className="event-detail__header">
          <span className="event-detail__badge" style={{ background: color }}>
            {categoryLabel}
          </span>
          <h1 className="event-detail__title">{event.title}</h1>
        </div>

        {/* ── Info cards ── */}
        <div className="event-detail__info">
          <div className="event-detail__info-row">
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            <div>
              <span className="event-detail__info-label">Date</span>
              <span className="event-detail__info-value">{dateStr}</span>
            </div>
          </div>

          <div className="event-detail__info-row">
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <div>
              <span className="event-detail__info-label">Time</span>
              <span className="event-detail__info-value">{timeStr}</span>
            </div>
          </div>

          <div className="event-detail__info-row">
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <div>
              <span className="event-detail__info-label">Location</span>
              <span className="event-detail__info-value">{event.location}</span>
            </div>
          </div>
        </div>

        {/* ── Description ── */}
        {event.description && (
          <div className="event-detail__body">
            <h2 className="event-detail__section-title">About This Event</h2>
            <p className="event-detail__desc">{event.description}</p>
          </div>
        )}

        {/* ── External link ── */}
        {event.external_url && (
          <a
            href={event.external_url}
            target="_blank"
            rel="noopener noreferrer"
            className="event-detail__external"
          >
            Visit Event Page
            <span className="sr-only">(opens in new tab)</span>
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" x2="21" y1="14" y2="3" />
            </svg>
          </a>
        )}
      </div>

      {/* ── Related events ── */}
      {related.length > 0 && (
        <div className="event-related">
          <h2 className="event-related__title">More Events</h2>
          <ul className="event-related__list">
            {related.map((ev) => {
              const d = parseISO(ev.start_date)
              const evColor = EVENT_COLORS[ev.category] ?? '#4aabf7'
              return (
                <li key={ev.id} className="event-related__item">
                  <Link href={`/events/${ev.slug}`} className="event-related__link">
                    <span className="event-related__bar" style={{ background: evColor }} />
                    <div className="event-related__body">
                      <span className="event-related__name">{ev.title}</span>
                      <span className="event-related__meta">
                        {format(d, 'EEE, MMM d')} · {format(d, 'h:mm a')}
                      </span>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </ListPageLayout>
  )
}
