import Link from 'next/link'
import { fetchWeatherFull } from '@/lib/weather'
import { fetchWeatherAlerts, EC_ALERTS } from '@/lib/radar'
import ListPageLayout from '@/components/layout/ListPageLayout'
import SidebarPanels from '@/components/layout/SidebarPanels'
import WeatherCurrent from '@/components/weather/WeatherCurrent'
import WeatherHourly from '@/components/weather/WeatherHourly'
import WeatherDaily from '@/components/weather/WeatherDaily'
import WeatherAlerts from '@/components/weather/WeatherAlerts'
import type { Metadata } from 'next'

export const revalidate = 300

const LOCATION = 'Steinbach, Manitoba'

export const metadata: Metadata = {
  title: 'Weather — SteinbachOnline',
  description: 'Current weather conditions, hourly and 3-day forecast for Steinbach, Manitoba.',
}

export default async function WeatherPage() {
  const [weather, alerts] = await Promise.all([
    fetchWeatherFull(LOCATION),
    fetchWeatherAlerts(EC_ALERTS.STEINBACH_FEED),
  ])

  if (!weather) {
    return (
      <ListPageLayout
        sidebar={<SidebarPanels desktop />}
        mobileSidebar={<SidebarPanels />}
      >
        <div className="weather-page">
          <div className="weather-page__empty">
            <p>Weather data is currently unavailable.</p>
            <Link href="/">Return Home</Link>
          </div>
        </div>
      </ListPageLayout>
    )
  }

  // Get today's remaining hours (from current hour onward)
  const currentHour = parseInt(weather.localTime.split(' ')[1]?.split(':')[0] ?? '0', 10)
  const todayHours = weather.days[0]?.hours.filter((h) => {
    const hr = parseInt(h.time.split(':')[0], 10)
    return hr >= currentHour
  }) ?? []
  // Append tomorrow's early hours to fill 24h
  const tomorrowHours = weather.days[1]?.hours.slice(0, 24 - todayHours.length) ?? []
  const next24Hours = [...todayHours, ...tomorrowHours]

  return (
    <ListPageLayout
      sidebar={<SidebarPanels desktop />}
      mobileSidebar={<SidebarPanels />}
    >
      <div className="weather-page">
        {/* Alerts (if any) */}
        <WeatherAlerts alerts={alerts} />

        {/* Header + Current conditions */}
        <div className="weather-page__current-card">
          <div className="page-header">
            <div className="page-header__icon" aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icon-weather.svg" width={40} height={40} alt="" />
            </div>
            <h1 className="page-header__title">Weather</h1>
          </div>
          <WeatherCurrent weather={weather} />
        </div>

        {/* Hourly forecast (next 24h) */}
        <WeatherHourly hours={next24Hours} />

        {/* 3-day forecast */}
        <WeatherDaily days={weather.days} />

        {/* Radar link */}
        <div className="weather-page__radar-link">
          <Link href="/weather/radar" className="weather-page__radar-btn">
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" />
              <path d="M12 2v4" />
            </svg>
            View Radar Map
          </Link>
        </div>
      </div>
    </ListPageLayout>
  )
}
