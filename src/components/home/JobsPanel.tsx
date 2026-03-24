'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Job {
  id: number
  title: string
  type: string
  href: string
  highlight?: boolean
}

const MOCK_JOBS: Job[] = [
  {
    id: 1,
    title: 'Seed Cleaner, Bulk Shipper/Receiver',
    type: 'Full-time · Agriculture · Labour',
    href: 'https://localjobshop.ca/listings/250565',
    highlight: true,
  },
  {
    id: 2,
    title: 'Sales Associate',
    type: 'Full-time · Sales',
    href: 'https://localjobshop.ca/listings/251137',
  },
  {
    id: 3,
    title: 'Journeyman Industrial Refrigeration Mechanic',
    type: 'Full-time · Manufacturing',
    href: 'https://localjobshop.ca/listings/251148',
  },
  {
    id: 4,
    title: 'Sanitation — Night Shift',
    type: 'Full-time · Hourly · Labour',
    href: 'https://localjobshop.ca/listings/251147',
  },
  {
    id: 5,
    title: 'Automotive Mechanic',
    type: 'Full-time · Skilled Trades · Permanent',
    href: 'https://localjobshop.ca/listings/251151',
  },
  {
    id: 6,
    title: 'Class 1 Driver — Regional Routes',
    type: 'Full-time · Transportation · Permanent',
    href: 'https://localjobshop.ca/listings/251200',
  },
  {
    id: 7,
    title: 'Early Childhood Educator (ECE)',
    type: 'Full-time · Education · Permanent',
    href: 'https://localjobshop.ca/listings/251210',
  },
  {
    id: 8,
    title: 'Retail Store Manager',
    type: 'Full-time · Retail · Management',
    href: 'https://localjobshop.ca/listings/251220',
  },
  {
    id: 9,
    title: 'Welder — CWB Certified',
    type: 'Full-time · Skilled Trades · Permanent',
    href: 'https://localjobshop.ca/listings/251230',
  },
  {
    id: 10,
    title: 'Registered Nurse — Home Care',
    type: 'Full-time · Healthcare · Permanent',
    href: 'https://localjobshop.ca/listings/251240',
  },
]

const INITIAL_COUNT = 5

export default function JobsPanel({ mobile, desktop }: { mobile?: boolean; desktop?: boolean } = {}) {
  const [isExpanded, setIsExpanded] = useState(false)

  const visibleJobs = isExpanded ? MOCK_JOBS : MOCK_JOBS.slice(0, INITIAL_COUNT)

  return (
    <div className={`jobs-panel panel${mobile ? ' jobs-panel--mobile' : ''}${desktop ? ' jobs-panel--desktop' : ''}`}>

      {/* ── Header ── */}
      <div className="jobs-panel__header">
        <Link href="/jobs" className="jobs-panel__title-wrap">
          <div className="jobs-panel__title-link">
            Jobs
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 18 18" fill="none" >
              <path d="M7 4l5 5-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </Link>
        <button
          type="button"
          className={`jobs-panel__down-btn${isExpanded ? ' jobs-panel__down-btn--open' : ''}`}
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
          onClick={() => setIsExpanded(v => !v)}
        >
          <img src="/ico-down-arrow.svg" width={16} height={16} alt="" aria-hidden="true" />
        </button>
      </div>

      {/* ── Job list ── */}
      <ul className="jobs-panel__list">
        {visibleJobs.map(job => (
          <li key={job.id} className={`jobs-panel__item${job.highlight ? ' jobs-panel__item--highlight' : ''}`}>
            <Link href={job.href} target="_blank" rel="noopener" className="jobs-panel__link">
              <div className="jobs-panel__link-main">
                <span className="jobs-panel__title">{job.title}</span>
                <span className="jobs-panel__type">{job.type}</span>
              </div>
              {job.highlight && (
                <span className="jobs-panel__badge" aria-label="Featured" />
              )}
              <span className="sr-only">(opens in new tab)</span>
            </Link>
          </li>
        ))}
      </ul>

      {/* ── Footer ── */}
      <div className="jobs-panel__footer">
        <span className="jobs-panel__powered">
          Powered by&nbsp;<strong>Local Job Shop</strong>
        </span>
      </div>

    </div>
  )
}
