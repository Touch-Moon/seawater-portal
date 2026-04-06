// ============================================================
//  WeatherAPI (api.weatherapi.com) 연동
//  공식 문서: https://www.weatherapi.com/docs/
//  ISR: 5분마다 캐시 갱신 (revalidate: 300)
// ============================================================

export interface WeatherResult {
  city:      string
  condition: string
  icon:      string   // Basmilius SVG path
  temp:      number   // °C, rounded
  high:      number
  low:       number
}

// ── WeatherAPI 날씨 코드 → Basmilius 아이콘 이름 매핑 ──
// 전체 코드표: https://www.weatherapi.com/docs/weather_conditions.json
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

// ── /weather 대시보드 페이지용 전체 날씨 데이터 ──

export interface HourForecast {
  time:         string   // 'HH:mm' 형식
  temp:         number
  condition:    string
  icon:         string
  chanceOfRain: number
  windKph:      number
  humidity:     number
  feelsLike:    number
  isDay:        boolean
}

export interface DayForecast {
  date:         string   // 'YYYY-MM-DD' 형식
  dayOfWeek:    string   // 'Mon', 'Tue' 등 요일 약어
  condition:    string
  icon:         string
  high:         number
  low:          number
  chanceOfRain: number
  avgHumidity:  number
  maxWindKph:   number
  sunrise:      string
  sunset:       string
  hours:        HourForecast[]
}

export interface WeatherFull {
  city:        string
  region:      string
  country:     string
  localTime:   string
  condition:   string
  icon:        string
  temp:        number
  feelsLike:   number
  high:        number
  low:         number
  humidity:    number
  windKph:     number
  windDir:     string
  pressureMb:  number
  uvIndex:     number
  visKm:       number
  isDay:       boolean
  days:        DayForecast[]
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export async function fetchWeatherFull(location: string): Promise<WeatherFull | null> {
  const key = process.env.WEATHER_API_KEY
  if (!key) return null

  try {
    const res = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${encodeURIComponent(location)}&days=3&aqi=no`,
      { next: { revalidate: 300 } },
    )
    if (!res.ok) return null

    const data = await res.json()
    const cur = data.current
    const todayDay = data.forecast.forecastday[0].day

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const days: DayForecast[] = data.forecast.forecastday.map((fd: any) => {
      const d = new Date(fd.date + 'T12:00:00')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const hours: HourForecast[] = fd.hour.map((h: any) => ({
        time:         h.time.split(' ')[1]?.slice(0, 5) ?? h.time,
        temp:         Math.round(h.temp_c),
        condition:    h.condition.text,
        icon:         getWeatherIcon(h.condition.code, h.is_day === 1),
        chanceOfRain: h.chance_of_rain,
        windKph:      Math.round(h.wind_kph),
        humidity:     h.humidity,
        feelsLike:    Math.round(h.feelslike_c),
        isDay:        h.is_day === 1,
      }))

      return {
        date:         fd.date,
        dayOfWeek:    DAY_NAMES[d.getDay()],
        condition:    fd.day.condition.text,
        icon:         getWeatherIcon(fd.day.condition.code, true),
        high:         Math.round(fd.day.maxtemp_c),
        low:          Math.round(fd.day.mintemp_c),
        chanceOfRain: fd.day.daily_chance_of_rain,
        avgHumidity:  fd.day.avghumidity,
        maxWindKph:   Math.round(fd.day.maxwind_kph),
        sunrise:      fd.astro.sunrise,
        sunset:       fd.astro.sunset,
        hours,
      }
    })

    return {
      city:       data.location.name,
      region:     data.location.region,
      country:    data.location.country,
      localTime:  data.location.localtime,
      condition:  cur.condition.text,
      icon:       getWeatherIcon(cur.condition.code, cur.is_day === 1),
      temp:       Math.round(cur.temp_c),
      feelsLike:  Math.round(cur.feelslike_c),
      high:       Math.round(todayDay.maxtemp_c),
      low:        Math.round(todayDay.mintemp_c),
      humidity:   cur.humidity,
      windKph:    Math.round(cur.wind_kph),
      windDir:    cur.wind_dir,
      pressureMb: cur.pressure_mb,
      uvIndex:    cur.uv,
      visKm:      cur.vis_km,
      isDay:      cur.is_day === 1,
      days,
    }
  } catch {
    return null
  }
}

export async function fetchWeather(location: string): Promise<WeatherResult | null> {
  const key = process.env.WEATHER_API_KEY
  if (!key) return null

  try {
    const res = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${encodeURIComponent(location)}&days=1&aqi=no`,
      { next: { revalidate: 300 } },
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
