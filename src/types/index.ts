// 뉴스 기사
export interface Article {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  category: 'local-news' | 'sports' | 'community' | 'business';
  featured_image?: string;
  author: string;
  published_at: string;
  is_featured: boolean;
  is_breaking: boolean;
  site_id: string;
  created_at: string;
  updated_at: string;
}

// 이벤트
export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  location: string;
  start_date: string;
  end_date?: string;
  image?: string;
  category: string;
  external_url?: string;
  site_id: string;
  created_at: string;
}

// 날씨 (캐시)
export interface WeatherData {
  id: string;
  site_id: string;
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  wind_speed: number;
  forecast_hourly: HourlyForecast[];
  forecast_weekly: DailyForecast[];
  updated_at: string;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  condition: string;
  icon: string;
}

export interface DailyForecast {
  date: string;
  max_temp: number;
  min_temp: number;
  condition: string;
  icon: string;
}

// 피처
export interface Feature {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon?: string;
  content: string;
  is_active: boolean;
  site_id: string;
}

// 사이트 설정 (멀티테넌트)
export interface SiteConfig {
  id: string;
  site_key: string;
  name: string;
  tagline: string;
  domain: string;
  logo_url: string;
  primary_color: string;
  radio_stream_url?: string;
  weather_location: string;
  created_at: string;
}

// 비즈니스 디렉토리
export interface Business {
  id: string;
  name: string;
  category: string;
  description: string;
  address: string;
  phone?: string;
  website?: string;
  image?: string;
  site_id: string;
}

// 구인/구직
export interface Classified {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  company: string;
  location: string;
  salary_range?: string;
  external_url?: string;
  site_id: string;
  created_at: string;
}
