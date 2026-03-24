'use client'

import { useState } from 'react'
import Link from 'next/link'

/* ── Page data ── */
interface SitemapNode {
  path: string
  label: string
  priority: 'P0' | 'P1' | 'P2' | 'footer'
  status: 'done' | 'in-progress' | 'planned'
  description: string
  dataSources?: string[]
  children?: SitemapNode[]
  query?: boolean          // tab / query param page (not a real route)
  consolidatedFrom?: string[]  // original URLs merged into this
}

const SITEMAP: SitemapNode[] = [
  {
    path: '/',
    label: 'Home',
    priority: 'P0',
    status: 'done',
    description: 'Portal homepage — search, quick menu, news, weather, events, radio',
    dataSources: ['rss.ts', 'weather.ts', 'radio.ts', 'Supabase'],
  },
  {
    path: '/news',
    label: 'News',
    priority: 'P0',
    status: 'planned',
    description: 'News listing with category tabs — 7 categories unified into one page',
    dataSources: ['rss.ts', 'Supabase'],
    consolidatedFrom: [
      '/local-news',
      '/national-news',
      '/local-sports',
      '/ag-news',
      '/community',
      '/sponsored',
      '/funeral-announcements',
    ],
    children: [
      { path: '/news?category=local', label: 'Local', priority: 'P0', status: 'planned', description: 'Local news tab', query: true },
      { path: '/news?category=national', label: 'National', priority: 'P0', status: 'planned', description: 'National news tab', query: true },
      { path: '/news?category=sports', label: 'Sports', priority: 'P0', status: 'planned', description: 'Sports news tab', query: true },
      { path: '/news?category=ag-news', label: 'Ag News', priority: 'P0', status: 'planned', description: 'Agriculture news tab', query: true },
      { path: '/news?category=community', label: 'Community', priority: 'P0', status: 'planned', description: 'Community news tab', query: true },
      { path: '/news?category=funeral', label: 'Funeral', priority: 'P0', status: 'planned', description: 'Funeral announcements tab', query: true },
      { path: '/news/[slug]', label: 'Article Detail', priority: 'P0', status: 'planned', description: 'Individual news article page' },
    ],
  },
  {
    path: '/weather',
    label: 'Weather',
    priority: 'P1',
    status: 'planned',
    description: 'Current weather, hourly & 7-day forecast, alerts',
    dataSources: ['weather.ts', 'radar.ts (EC Alerts)'],
    children: [
      { path: '/weather/radar', label: 'Radar', priority: 'P1', status: 'planned', description: 'Leaflet map with MSC GeoMet WMS radar layer', dataSources: ['radar.ts (MSC GeoMet)'] },
    ],
  },
  {
    path: '/events',
    label: 'Events',
    priority: 'P1',
    status: 'planned',
    description: 'Calendar view + event listing with category filters',
    dataSources: ['Supabase'],
    children: [
      { path: '/events/[slug]', label: 'Event Detail', priority: 'P1', status: 'planned', description: 'Individual event page with date, time, location' },
    ],
  },
  {
    path: '/listen',
    label: 'Listen',
    priority: 'P1',
    status: 'planned',
    description: '3 radio channels unified — AM 1250, MIX 96.7, Country 107.7',
    dataSources: ['radio.ts', 'API Route (CORS proxy)'],
    consolidatedFrom: ['/am1250', '/mix96', '/country107', '/streaming', '/features/am1250-program-guide'],
  },
  {
    path: '/directory',
    label: 'Business Directory',
    priority: 'P2',
    status: 'planned',
    description: 'Local business search and category browsing',
    dataSources: ['Supabase'],
  },
  {
    path: '/classifieds',
    label: 'Classifieds',
    priority: 'P2',
    status: 'planned',
    description: 'Jobs, For Sale, Garage Sales — 3 sources unified',
    dataSources: ['Supabase'],
    consolidatedFrom: ['/regions/steinbach (LocalJobShop)', 'HelloGoodBuy', 'Garage Sales'],
    children: [
      { path: '/classifieds?tab=jobs', label: 'Jobs', priority: 'P2', status: 'planned', description: 'Job listings tab', query: true },
      { path: '/classifieds?tab=for-sale', label: 'For Sale', priority: 'P2', status: 'planned', description: 'Items for sale tab', query: true },
      { path: '/classifieds?tab=garage-sales', label: 'Garage Sales', priority: 'P2', status: 'planned', description: 'Garage sales tab', query: true },
    ],
  },
  {
    path: '/about',
    label: 'About',
    priority: 'footer',
    status: 'planned',
    description: 'About the team and station',
  },
  {
    path: '/contact',
    label: 'Contact',
    priority: 'footer',
    status: 'planned',
    description: 'Contact form and info',
  },
  {
    path: '/privacy',
    label: 'Privacy Policy',
    priority: 'footer',
    status: 'planned',
    description: 'Privacy policy page',
  },
  {
    path: '/terms',
    label: 'Terms of Use',
    priority: 'footer',
    status: 'planned',
    description: 'Terms and conditions',
  },
]

/* ── API Routes ── */
const API_ROUTES = [
  { path: '/api/radio/now-playing', label: 'Radio Now Playing', description: 'CORS proxy for Golden West RDS data' },
]

/* ── Priority config ── */
const PRIORITY_CONFIG = {
  P0: { label: 'P0 — Core', color: '#ff4e33' },
  P1: { label: 'P1 — Important', color: '#ffb300' },
  P2: { label: 'P2 — Later', color: '#4aabf7' },
  footer: { label: 'Footer', color: '#808080' },
}

const STATUS_CONFIG = {
  done: { label: 'Done', icon: '✓' },
  'in-progress': { label: 'In Progress', icon: '◐' },
  planned: { label: 'Planned', icon: '○' },
}

/* ── Component ── */
function SitemapCard({ node, depth = 0 }: { node: SitemapNode; depth?: number }) {
  const [expanded, setExpanded] = useState(depth === 0)
  const hasChildren = node.children && node.children.length > 0
  const priorityCfg = PRIORITY_CONFIG[node.priority]
  const statusCfg = STATUS_CONFIG[node.status]

  return (
    <div className={`sitemap__card sitemap__card--depth-${depth} sitemap__card--${node.status}`}>
      <div className="sitemap__card-header" onClick={() => hasChildren && setExpanded(!expanded)}>
        <div className="sitemap__card-left">
          {hasChildren && (
            <span className={`sitemap__toggle ${expanded ? 'sitemap__toggle--open' : ''}`}>
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          )}
          <span className={`sitemap__status sitemap__status--${node.status}`} title={statusCfg.label}>
            {statusCfg.icon}
          </span>
          <span className="sitemap__path">{node.path}</span>
          <span className="sitemap__label">{node.label}</span>
          {node.query && <span className="sitemap__badge sitemap__badge--tab">Tab</span>}
        </div>
        <div className="sitemap__card-right">
          <span className="sitemap__priority" style={{ '--priority-color': priorityCfg.color } as React.CSSProperties}>
            {priorityCfg.label}
          </span>
        </div>
      </div>

      <div className="sitemap__card-body">
        <p className="sitemap__desc">{node.description}</p>

        {node.dataSources && node.dataSources.length > 0 && (
          <div className="sitemap__meta">
            <span className="sitemap__meta-label">Data:</span>
            {node.dataSources.map((ds) => (
              <span key={ds} className="sitemap__badge sitemap__badge--data">{ds}</span>
            ))}
          </div>
        )}

        {node.consolidatedFrom && node.consolidatedFrom.length > 0 && (
          <div className="sitemap__meta">
            <span className="sitemap__meta-label">Merged from:</span>
            <div className="sitemap__merged-list">
              {node.consolidatedFrom.map((url) => (
                <span key={url} className="sitemap__badge sitemap__badge--merged">{url}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {hasChildren && expanded && (
        <div className="sitemap__children">
          {node.children!.map((child) => (
            <SitemapCard key={child.path} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function SitemapPage() {
  const totalPages = SITEMAP.reduce((acc, node) => {
    let count = 1
    if (node.children) count += node.children.filter((c) => !c.query).length
    return acc + count
  }, 0)
  const totalTabs = SITEMAP.reduce((acc, node) => {
    if (node.children) acc += node.children.filter((c) => c.query).length
    return acc
  }, 0)
  const doneCount = SITEMAP.filter((n) => n.status === 'done').length

  return (
    <main className="page">
      <div className="sitemap">
        <div className="sitemap__inner">

          {/* ── Header ── */}
          <header className="sitemap__header">
            <Link href="/" className="sitemap__back">
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Home
            </Link>
            <h1 className="sitemap__title">Sitemap</h1>
            <p className="sitemap__subtitle">SteinbachOnline Renewal — Information Architecture</p>
          </header>

          {/* ── Stats ── */}
          <div className="sitemap__stats">
            <div className="sitemap__stat">
              <span className="sitemap__stat-value">{totalPages}</span>
              <span className="sitemap__stat-label">Pages</span>
            </div>
            <div className="sitemap__stat">
              <span className="sitemap__stat-value">{totalTabs}</span>
              <span className="sitemap__stat-label">Tabs</span>
            </div>
            <div className="sitemap__stat">
              <span className="sitemap__stat-value">{doneCount}/{SITEMAP.length}</span>
              <span className="sitemap__stat-label">Done</span>
            </div>
            <div className="sitemap__stat">
              <span className="sitemap__stat-value">35+</span>
              <span className="sitemap__stat-label">Original Pages</span>
            </div>
          </div>

          {/* ── Legend ── */}
          <div className="sitemap__legend">
            <div className="sitemap__legend-group">
              <span className="sitemap__legend-title">Priority</span>
              {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => (
                <span key={key} className="sitemap__legend-item">
                  <span className="sitemap__legend-dot" style={{ background: cfg.color }} />
                  {cfg.label}
                </span>
              ))}
            </div>
            <div className="sitemap__legend-group">
              <span className="sitemap__legend-title">Status</span>
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <span key={key} className="sitemap__legend-item">
                  <span className={`sitemap__status sitemap__status--${key}`}>{cfg.icon}</span>
                  {cfg.label}
                </span>
              ))}
            </div>
          </div>

          {/* ── Tree ── */}
          <section className="sitemap__tree">
            <h2 className="sitemap__section-title">Page Routes</h2>
            {SITEMAP.map((node) => (
              <SitemapCard key={node.path} node={node} />
            ))}
          </section>

          {/* ── API Routes ── */}
          <section className="sitemap__tree">
            <h2 className="sitemap__section-title">API Routes</h2>
            {API_ROUTES.map((route) => (
              <div key={route.path} className="sitemap__card sitemap__card--depth-0 sitemap__card--planned">
                <div className="sitemap__card-header">
                  <div className="sitemap__card-left">
                    <span className="sitemap__status sitemap__status--planned">○</span>
                    <span className="sitemap__path">{route.path}</span>
                    <span className="sitemap__label">{route.label}</span>
                    <span className="sitemap__badge sitemap__badge--api">API</span>
                  </div>
                </div>
                <div className="sitemap__card-body">
                  <p className="sitemap__desc">{route.description}</p>
                </div>
              </div>
            ))}
          </section>

          {/* ── Removed Pages ── */}
          <section className="sitemap__tree">
            <h2 className="sitemap__section-title">Removed from Original</h2>
            <div className="sitemap__removed">
              {[
                { url: '/app', reason: 'Portfolio — no app download needed' },
                { url: '/advertise', reason: 'Portfolio — no ad sales needed' },
                { url: '/submit-news', reason: 'Portfolio — no news submission form' },
                { url: '/rss', reason: 'Developer-only, not user-facing' },
                { url: '/contest-rules', reason: 'No contest feature' },
                { url: '/journalistic-standards', reason: 'Portfolio — not needed' },
                { url: '/features/games', reason: 'External game embed — out of scope' },
                { url: '/features/live-webcam', reason: 'YouTube embed — out of scope' },
                { url: '/features/road-reports', reason: 'Specialized feature — post-P2' },
                { url: '/features/daily-news', reason: 'Newsletter — v2 consideration' },
                { url: '/contests/*', reason: 'Contest system — out of scope' },
                { url: '/tags/*', reason: 'SEO tags — URL redirect' },
              ].map((item) => (
                <div key={item.url} className="sitemap__removed-item">
                  <span className="sitemap__removed-url">{item.url}</span>
                  <span className="sitemap__removed-reason">{item.reason}</span>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </main>
  )
}
