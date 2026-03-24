/**
 * Weather Radar — Environment Canada MSC GeoMet WMS
 *
 * 완전 무료, API 키 불필요.
 * steinbachonline.com/radar 와 동일한 데이터 소스.
 *
 * 사용법:
 *   Leaflet 지도에 WMS 타일 레이어로 오버레이
 *   import { RADAR_CONFIG, getRadarWmsUrl } from '@/lib/radar';
 *
 * 참고:
 *   https://eccc-msc.github.io/open-data/msc-geomet/readme_en/
 *   https://geo.weather.gc.ca/geomet?service=WMS&request=GetCapabilities
 *
 * 필요 패키지 (연동 시 설치):
 *   npm install leaflet react-leaflet
 *   npm install -D @types/leaflet
 */

// ——— WMS 설정 ———

export const GEOMET_BASE = 'https://geo.weather.gc.ca/geomet';

/** WMS 레이어 목록 — 레이더 페이지에서 사용 */
export const WMS_LAYERS = {
  /** 1km 강수 레이더 (Rain Rate Intensity) — steinbachonline.com 사용 레이어 */
  RADAR_RAIN: 'RADAR_1KM_RRAI',
  /** 1km 눈 레이더 (Snow Rate) */
  RADAR_SNOW: 'RADAR_1KM_RSNO',
  /** 레이더 커버리지 */
  RADAR_COVERAGE: 'RADAR_COVERAGE_RRAI.INV',
} as const;

/** Steinbach 중심 좌표 */
export const STEINBACH_CENTER = {
  lat: 49.5260,
  lng: -96.6839,
  zoom: 7,
} as const;

/** Manitoba 지역 뷰 바운드 */
export const MANITOBA_BOUNDS = {
  southWest: { lat: 48.0, lng: -101.0 },
  northEast: { lat: 52.0, lng: -93.0 },
} as const;

// ——— WMS 타일 URL 헬퍼 ———

export interface RadarWmsParams {
  layer?: keyof typeof WMS_LAYERS;
  time?: string; // ISO 8601, e.g. '2026-03-19T16:00:00Z'
  width?: number;
  height?: number;
}

/**
 * Leaflet WMS 레이어에 전달할 설정 객체 반환
 *
 * 사용 예시 (react-leaflet):
 * ```tsx
 * import { WMSTileLayer } from 'react-leaflet';
 * import { getRadarWmsConfig } from '@/lib/radar';
 *
 * const config = getRadarWmsConfig();
 * <WMSTileLayer url={config.url} {...config.options} />
 * ```
 */
export function getRadarWmsConfig(params?: RadarWmsParams) {
  const layer = params?.layer
    ? WMS_LAYERS[params.layer]
    : WMS_LAYERS.RADAR_RAIN;

  return {
    url: GEOMET_BASE,
    options: {
      service: 'WMS',
      request: 'GetMap',
      layers: layer,
      styles: '',
      format: 'image/png',
      transparent: true,
      version: '1.3.0',
      crs: 'EPSG:3857',
      ...(params?.time ? { time: params.time } : {}),
    },
  };
}

/**
 * GetCapabilities URL — 사용 가능한 시간 범위 등 메타 조회용
 */
export function getCapabilitiesUrl(): string {
  return `${GEOMET_BASE}?service=WMS&version=1.3.0&request=GetCapabilities&layers=${WMS_LAYERS.RADAR_RAIN}`;
}

// ——— 날씨 경보 (Weather Alerts) ———

/** Environment Canada ATOM 피드 — Manitoba 날씨 경보 */
export const EC_ALERTS = {
  /** Manitoba 전체 경보 ATOM 피드 */
  MANITOBA_FEED: 'https://weather.gc.ca/rss/battleboard/mb_e.xml',
  /** Steinbach / Southeast MB 경보 */
  STEINBACH_FEED: 'https://weather.gc.ca/rss/city/mb-24_e.xml',
} as const;

export interface WeatherAlert {
  title: string;
  summary: string;
  link: string;
  published: string;
  category: string; // 'warning' | 'watch' | 'advisory' | 'statement'
}

/**
 * Environment Canada 날씨 경보 ATOM 피드 파싱
 *
 * ISR 300초로 캐시. 연동 시 WeatherWidget이나 Header에 경보 배지 표시 가능.
 *
 * @param feedUrl EC_ALERTS 중 하나 (기본: STEINBACH_FEED)
 */
export async function fetchWeatherAlerts(
  feedUrl: string = EC_ALERTS.STEINBACH_FEED,
): Promise<WeatherAlert[]> {
  const res = await fetch(feedUrl, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    return [];
  }

  const xml = await res.text();
  return parseAlertAtom(xml);
}

/** ATOM XML → WeatherAlert[] */
function parseAlertAtom(xml: string): WeatherAlert[] {
  const alerts: WeatherAlert[] = [];
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let match: RegExpExecArray | null;

  while ((match = entryRegex.exec(xml)) !== null) {
    const block = match[1];
    const title = getTag(block, 'title');

    // 'No watches or warnings' 같은 항목 제외
    if (title.toLowerCase().includes('no watches') || title.toLowerCase().includes('no warnings')) {
      continue;
    }

    alerts.push({
      title,
      summary: getTag(block, 'summary'),
      link: getAttr(block, 'link', 'href'),
      published: getTag(block, 'updated') || getTag(block, 'published'),
      category: getAttr(block, 'category', 'term') || classifyAlert(title),
    });
  }

  return alerts;
}

function getTag(block: string, tag: string): string {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return m ? m[1].trim() : '';
}

function getAttr(block: string, tag: string, attr: string): string {
  const m = block.match(new RegExp(`<${tag}[^>]*${attr}=["']([^"']+)["']`, 'i'));
  return m ? m[1] : '';
}

function classifyAlert(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('warning')) return 'warning';
  if (t.includes('watch')) return 'watch';
  if (t.includes('advisory')) return 'advisory';
  return 'statement';
}
