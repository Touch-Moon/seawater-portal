// ============================================================
//  WeatherAPI (api.weatherapi.com) integration
//  Docs: https://www.weatherapi.com/docs/
//  ISR: 5분마다 갱신 (revalidate: 300)
// ============================================================

export interface WeatherResult {
  city:      string
  condition: string
  icon:      string   // Basmilius SVG path
  temp:      number   // °C, rounded
  high:      number
  low:       number
}

// ── WeatherAPI condition code → Basmilius icon name ──
// https://www.weatherapi.com/docs/weather_conditions.json
const ICON_MAP: Record<number, { day: string; night: string }> = {
  1000: { day: 'clear-day',                    night: 'clear-night' },
  1003: { day: 'partly-cloudy-day',             night: 'partly-cloudy-night' },
  1006: { day: 'cloudy',                        night: 'cloudy' },
  1009: { day: 'overcast-day',                  night: 'overcast-night' },
  1030: { day: 'mist',                          night: 'mist' },
  1063: { day: 'partly-cloudy-day-rain',        night: 'partly-cloudy-night-rain' },
  1066: { day: 'partly-cloudy-day-snow',        night: 'partly-cloudy-night-snow' },
  1069: { day: 'partly-cloudy-day-sleet',       night: 'partly-cloudy-night-sleet' },
  1072: { day: 'partly-cloudy-day-drizzle',     night: 'partly-cloudy-night-drizzle' },
  1087: { day: 'thunderstorms-day',             night: 'thunderstorms-night' },
  1114: { day: 'wind-snow',                     night: 'wind-snow' },
  1117: { day: 'snowstorm',                     night: 'snowstorm' },
  1135: { day: 'fog-day',                       night: 'fog-night' },
  1147: { day: 'fog-day',                       night: 'fog-night' },
  1150: { day: 'partly-cloudy-day-drizzle',     night: 'partly-cloudy-night-drizzle' },
  1153: { day: 'drizzle',                       night: 'drizzle' },
  1168: { day: 'sleet',                         night: 'sleet' },
  1171: { day: 'sleet',                         night: 'sleet' },
  1180: { day: 'partly-cloudy-day-rain',        night: 'partly-cloudy-night-rain' },
  1183: { day: 'drizzle',                       night: 'drizzle' },
  1186: { day: 'rain',                          night: 'rain' },
  1189: { day: 'rain',                          night: 'rain' },
  1192: { day: 'rain',                          night: 'rain' },
  1195: { day: 'rain',                          night: 'rain' },
  1198: { day: 'sleet',                         night: 'sleet' },
  1201: { day: 'sleet',                         night: 'sleet' },
  1204: { day: 'sleet',                         night: 'sleet' },
  1207: { day: 'sleet',                         night: 'sleet' },
  1210: { day: 'partly-cloudy-day-snow',        night: 'partly-cloudy-night-snow' },
  1213: { day: 'snow',                          night: 'snow' },
  1216: { day: 'snow',                          night: 'snow' },
  1219: { day: 'snow',                          night: 'snow' },
  1222: { day: 'snow',                          night: 'snow' },
  1225: { day: 'snow',                          night: 'snow' },
  1237: { day: 'hail',                          night: 'hail' },
  1240: { day: 'partly-cloudy-day-rain',        night: 'partly-cloudy-night-rain' },
  1243: { day: 'rain',                          night: 'rain' },
  1246: { day: 'rain',                          night: 'rain' },
  1249: { day: 'partly-cloudy-day-sleet',       night: 'partly-cloudy-night-sleet' },
  1252: { day: 'sleet',                         night: 'sleet' },
  1255: { day: 'partly-cloudy-day-snow',        night: 'partly-cloudy-night-snow' },
  1258: { day: 'snow',                          night: 'snow' },
  1261: { day: 'hail',                          night: 'hail' },
  1264: { day: 'hail',                          night: 'hail' },
  1273: { day: 'thunderstorms-day-rain',        night: 'thunderstorms-night-rain' },
  1276: { day: 'thunderstorms-day-rain',        night: 'thunderstorms-night-rain' },
  1279: { day: 'thunderstorms-day-snow',        night: 'thunderstorms-night-snow' },
  1282: { day: 'thunderstorms-day-snow',        night: 'thunderstorms-night-snow' },
}

export function getWeatherIcon(code: number, isDay: boolean): string {
  const entry = ICON_MAP[code]
  const name  = entry ? (isDay ? entry.day : entry.night) : 'partly-cloudy-day'
  return `/weather/fill/svg/${name}.svg`
}

export const WEATHER_FALLBACK: WeatherResult = {
  city:      'Steinbach',
  condition: 'Partly Cloudy',
  icon:      '/weather/fill/svg/partly-cloudy-day.svg',
  temp:      -2,
  high:       3,
  low:       -8,
}

export async function fetchWeather(location: string): Promise<WeatherResult | null> {
  const key = process.env.WEATHER_API_KEY
  if (!key) return null

  try {
    const res = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${encodeURIComponent(location)}&days=1&aqi=no`,
      { next: { revalidate: 300 } }   // ISR: 5분
    )
    if (!res.ok) return null

    const data = await res.json()
    const current  = data.current
    const forecast = data.forecast.forecastday[0].day

    return {
      city:      data.location.name,
      condition: current.condition.text,
      icon:      getWeatherIcon(current.condition.code, current.is_day === 1),
      temp:      Math.round(current.temp_c),
      high:      Math.round(forecast.maxtemp_c),
      low:       Math.round(forecast.mintemp_c),
    }
  } catch {
    return null
  }
}
