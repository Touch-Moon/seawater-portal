import Image from 'next/image'
import type { DayForecast } from '@/lib/weather'

interface WeatherDailyProps {
  days: DayForecast[]
}

export default function WeatherDaily({ days }: WeatherDailyProps) {
  return (
    <div className="weather-daily">
      <div className="weather-daily__list">
        {days.map((day, i) => (
          <div key={day.date} className="weather-daily__card">
            <div className="weather-daily__header">
              <span className="weather-daily__day">
                {i === 0 ? 'Today' : day.dayOfWeek}
              </span>
              <span className="weather-daily__date">{day.date.slice(5)}</span>
            </div>

            <Image
              src={day.icon}
              alt={day.condition}
              width={56}
              height={56}
              unoptimized
              className="weather-daily__icon"
            />

            <div className="weather-daily__condition">{day.condition}</div>

            <div className="weather-daily__temps">
              <span className="weather-daily__high">{day.high}°</span>
              <span className="weather-daily__separator">/</span>
              <span className="weather-daily__low">{day.low}°</span>
            </div>

            <div className="weather-daily__details">
              {day.chanceOfRain > 0 && (
                <div className="weather-daily__detail">
                  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" opacity="0.6">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                  </svg>
                  <span>{day.chanceOfRain}%</span>
                </div>
              )}
              <div className="weather-daily__detail">
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
                  <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
                  <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
                </svg>
                <span>{day.maxWindKph} km/h</span>
              </div>
            </div>

            <div className="weather-daily__astro">
              <div className="weather-daily__astro-item">
                <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2" />
                </svg>
                <span>{day.sunrise}</span>
              </div>
              <div className="weather-daily__astro-item">
                <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 10V2" />
                  <path d="m16 6-4 4-4-4" />
                </svg>
                <span>{day.sunset}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
