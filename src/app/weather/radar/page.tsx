import Link from 'next/link'
import dynamic from 'next/dynamic'
import { fetchWeatherAlerts, EC_ALERTS } from '@/lib/radar'
import WeatherAlerts from '@/components/weather/WeatherAlerts'
import RadarPageClient from '@/components/weather/RadarPageClient'
import type { Metadata } from 'next'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Weather Radar — SteinbachOnline',
  description: 'Live precipitation radar map for Steinbach and Southeast Manitoba. Powered by Environment Canada MSC GeoMet.',
}

export default async function RadarPage() {
  const alerts = await fetchWeatherAlerts(EC_ALERTS.STEINBACH_FEED)

  return (
    <main id="main-content" className="radar-page">
      {/* ── Header bar ── */}
      <div className="radar-page__header">
        <div className="radar-page__left">
          <Link href="/" className="radar-page__logo" aria-label="SteinbachOnline Home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/ico-logo-brandcolor.svg" alt="" height={24} aria-hidden="true" className="radar-page__logo-dark" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/ico-logo-brandcolor-light.svg" alt="" height={24} aria-hidden="true" className="radar-page__logo-light" />
          </Link>
          <div className="radar-page__divider" />
          <h1 className="radar-page__title">Radar</h1>
        </div>

        <Link href="/weather" className="radar-page__close" aria-label="Close radar">
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </Link>
      </div>

      {/* ── Alerts (if any) ── */}
      {alerts.length > 0 && (
        <div className="radar-page__alerts">
          <WeatherAlerts alerts={alerts} />
        </div>
      )}

      {/* ── Map (client-only) ── */}
      <RadarPageClient />
    </main>
  )
}
