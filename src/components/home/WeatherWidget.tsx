// WeatherWidget — Server Component (ISR 5분)
import Link from 'next/link'
import Image from 'next/image'
import { fetchWeather, WEATHER_FALLBACK } from '@/lib/weather'

const LOCATION = process.env.NEXT_PUBLIC_SITE_KEY === 'steinbachonline'
  ? 'Steinbach, Manitoba'
  : 'Steinbach, Manitoba'   // TODO: SiteConfig.weather_location 으로 교체

export default async function WeatherWidget({ mobile, desktop }: { mobile?: boolean; desktop?: boolean } = {}) {
  const weather = await fetchWeather(LOCATION) ?? WEATHER_FALLBACK
  const { city, condition, icon, temp, high, low } = weather

  return (
    <Link
      href="/weather"
      className={`weather-widget${mobile ? ' weather-widget--mobile' : ''}${desktop ? ' weather-widget--desktop' : ''}`}
    >

      {/* Left: icon */}
      <div className="weather-widget__icon">
        <Image src={icon} alt={condition} width={52} height={52} unoptimized />
      </div>

      {/* Center: city + condition */}
      <div className="weather-widget__info">
        <p className="weather-widget__main">
          <span className="weather-widget__city">{city}</span>
        </p>
        <p className="weather-widget__condition">{condition}</p>
      </div>

      {/* Right: current temp + high/low */}
      <div className="weather-widget__temp">
        <span className="weather-widget__current">{temp}°</span>
        <span className="weather-widget__range">{low}° / {high}°</span>
      </div>

    </Link>
  )
}
