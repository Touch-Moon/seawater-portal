// WeatherWidget — Server Component (ISR 5분)
import { fetchWeather, WEATHER_FALLBACK } from '@/lib/weather'

const LOCATION = process.env.NEXT_PUBLIC_SITE_KEY === 'steinbachonline'
  ? 'Steinbach, Manitoba'
  : 'Steinbach, Manitoba'   // TODO: SiteConfig.weather_location 으로 교체

export default async function WeatherWidget() {
  const weather = await fetchWeather(LOCATION) ?? WEATHER_FALLBACK
  const { city, condition, icon, temp, high, low } = weather

  return (
    <div className="weather-widget">

      {/* Left: icon */}
      <div className="weather-widget__icon">
        <img src={icon} alt={condition} width={52} height={52} />
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

    </div>
  )
}
