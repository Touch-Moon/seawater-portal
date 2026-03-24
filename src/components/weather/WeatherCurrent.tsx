import Image from 'next/image'
import type { WeatherFull } from '@/lib/weather'

interface WeatherCurrentProps {
  weather: WeatherFull
}

export default function WeatherCurrent({ weather }: WeatherCurrentProps) {
  const sunrise = weather.days[0]?.sunrise
  const sunset = weather.days[0]?.sunset

  return (
    <div className="weather-current">
      <div className="weather-current__summary">
        {/* ── Hero: big icon + temp ── */}
        <div className="weather-current__hero">
          <div className="weather-current__icon-wrap">
            <Image
              src={weather.icon}
              alt={weather.condition}
              width={120}
              height={120}
              unoptimized
            />
          </div>

          <div className="weather-current__main">
            <div className="weather-current__temp">{weather.temp}°</div>
            <div className="weather-current__condition">{weather.condition}</div>
            <div className="weather-current__range">
              H: {weather.high}° &nbsp; L: {weather.low}°
            </div>
          </div>
        </div>

        <div className="weather-current__location">
          <span className="weather-current__city">{weather.city}, {weather.region}</span>
          <span className="weather-current__time">
            {weather.localTime.split(' ')[1]}
          </span>
        </div>
      </div>

      {/* ── Stats grid ── */}
      <div className="weather-stats">
        <div className="weather-stats__card">
          <div className="weather-stats__icon">
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
            </svg>
          </div>
          <div className="weather-stats__info">
            <span className="weather-stats__label">Feels Like</span>
            <span className="weather-stats__value">{weather.feelsLike}°</span>
          </div>
        </div>

        <div className="weather-stats__card">
          <div className="weather-stats__icon">
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
            </svg>
          </div>
          <div className="weather-stats__info">
            <span className="weather-stats__label">Humidity</span>
            <span className="weather-stats__value">{weather.humidity}%</span>
          </div>
        </div>

        <div className="weather-stats__card">
          <div className="weather-stats__icon">
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
              <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
              <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
            </svg>
          </div>
          <div className="weather-stats__info">
            <span className="weather-stats__label">Wind</span>
            <span className="weather-stats__value">{weather.windKph} km/h {weather.windDir}</span>
          </div>
        </div>

        <div className="weather-stats__card">
          <div className="weather-stats__icon">
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="2" x2="12" y2="6" />
              <line x1="12" y1="18" x2="12" y2="22" />
              <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
              <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
              <line x1="2" y1="12" x2="6" y2="12" />
              <line x1="18" y1="12" x2="22" y2="12" />
              <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
              <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
            </svg>
          </div>
          <div className="weather-stats__info">
            <span className="weather-stats__label">UV Index</span>
            <span className="weather-stats__value">{weather.uvIndex}</span>
          </div>
        </div>

        <div className="weather-stats__card">
          <div className="weather-stats__icon">
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
          </div>
          <div className="weather-stats__info">
            <span className="weather-stats__label">Pressure</span>
            <span className="weather-stats__value">{weather.pressureMb} mb</span>
          </div>
        </div>

        <div className="weather-stats__card">
          <div className="weather-stats__icon">
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <div className="weather-stats__info">
            <span className="weather-stats__label">Visibility</span>
            <span className="weather-stats__value">{weather.visKm} km</span>
          </div>
        </div>

        <div className="weather-stats__card">
          <div className="weather-stats__icon">
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="m4.93 4.93 1.41 1.41" />
              <path d="m17.66 17.66 1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="m6.34 17.66-1.41 1.41" />
              <path d="m19.07 4.93-1.41 1.41" />
            </svg>
          </div>
          <div className="weather-stats__info">
            <span className="weather-stats__label">Sunrise</span>
            <span className="weather-stats__value">{sunrise}</span>
          </div>
        </div>

        <div className="weather-stats__card">
          <div className="weather-stats__icon">
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 10V2" />
              <path d="m4.93 10.22 1.41 1.41" />
              <path d="M2 18h2" />
              <path d="M20 18h2" />
              <path d="m19.07 10.22-1.41 1.41" />
              <path d="M22 22H2" />
              <path d="m16 6-4 4-4-4" />
              <path d="M16 18a4 4 0 0 0-8 0" />
            </svg>
          </div>
          <div className="weather-stats__info">
            <span className="weather-stats__label">Sunset</span>
            <span className="weather-stats__value">{sunset}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
