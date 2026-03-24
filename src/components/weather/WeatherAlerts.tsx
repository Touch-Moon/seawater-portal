import type { WeatherAlert } from '@/lib/radar'

interface WeatherAlertsProps {
  alerts: WeatherAlert[]
}

const ALERT_COLORS: Record<string, string> = {
  warning:   'weather-alerts__item--warning',
  watch:     'weather-alerts__item--watch',
  advisory:  'weather-alerts__item--advisory',
  statement: 'weather-alerts__item--statement',
}

export default function WeatherAlerts({ alerts }: WeatherAlertsProps) {
  if (alerts.length === 0) return null

  return (
    <div className="weather-alerts">
      <h2 className="weather-alerts__title">
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </svg>
        Weather Alerts
      </h2>

      <div className="weather-alerts__list">
        {alerts.map((alert, i) => (
          <a
            key={i}
            href={alert.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`weather-alerts__item ${ALERT_COLORS[alert.category] ?? ''}`}
          >
            <span className="weather-alerts__badge">{alert.category}</span>
            <span className="weather-alerts__text">{alert.title}</span>
            <span className="sr-only">(opens in new tab)</span>
          </a>
        ))}
      </div>
    </div>
  )
}
