/**
 * Radio Streaming — Golden West Broadcasting
 *
 * steinbachonline.com 3개 채널:
 *   AM 1250 (CHSM) / MIX 96.7 (CILT) / Country 107.7 (CJXR)
 *
 * 스트리밍 콘솔: goldenweststreaming.com/{callsign}/console/
 * Now Playing RDS: goldenweststreaming.com/rds/tmp/{CALLSIGN}.html
 *
 * 사용법:
 *   import { RADIO_CHANNELS, fetchNowPlaying } from '@/lib/radio';
 */

// ——— 채널 설정 ———

export interface RadioChannel {
  id: string;
  name: string;
  callsign: string;       // CRTC call sign (CHSM, CILT, CJXR)
  frequency: string;
  tagline: string;
  consoleUrl: string;     // 스트리밍 콘솔 (팝업 or iframe)
  rdsUrl: string;         // Now Playing HTML (파싱 대상)
  logoLight: string;      // /public/ 경로 (라이트 모드)
  logoDark: string;       // /public/ 경로 (다크 모드)
  color: string;          // 채널 브랜드 컬러
}

export const RADIO_CHANNELS: RadioChannel[] = [
  {
    id: 'am1250',
    name: 'AM 1250',
    callsign: 'CHSM',
    frequency: 'AM 1250',
    tagline: 'Steinbach Radio',
    consoleUrl: 'https://goldenweststreaming.com/chsm/console/',
    rdsUrl: 'https://www.goldenweststreaming.com/rds/tmp/CHSM.html',
    logoLight: '/radio1-light.svg',
    logoDark: '/radio1-dark.svg',
    color: '#1a3a6b',
  },
  {
    id: 'mix96',
    name: 'MIX 96.7',
    callsign: 'CILT',
    frequency: 'FM 96.7',
    tagline: "Steinbach's Best Mix",
    consoleUrl: 'https://goldenweststreaming.com/cilt/console/',
    rdsUrl: 'https://www.goldenweststreaming.com/rds/tmp/CILT.html',
    logoLight: '/radio2-light.svg',
    logoDark: '/radio2-dark.svg',
    color: '#e91e8c',
  },
  {
    id: 'country107',
    name: 'Country 107.7',
    callsign: 'CJXR',
    frequency: 'FM 107.7',
    tagline: "Manitoba's Country",
    consoleUrl: 'https://goldenweststreaming.com/cjxr/console/',
    rdsUrl: 'https://www.goldenweststreaming.com/rds/tmp/CJXR.html',
    logoLight: '/radio3-light.svg',
    logoDark: '/radio3-dark.svg',
    color: '#2d8c3c',
  },
];

// ——— Now Playing (RDS) ———

export interface NowPlaying {
  artist: string;
  title: string;
  channelId: string;
}

/**
 * Golden West RDS 페이지에서 현재 재생 중인 곡 정보 파싱
 *
 * RDS HTML 구조 (예시):
 *   <body>Artist Name - Song Title</body>
 *   또는 더 복잡한 HTML 래핑
 *
 * 클라이언트 사이드에서 폴링 (30초 간격 권장):
 *   setInterval(() => fetchNowPlaying('am1250'), 30_000)
 *
 * NOTE: CORS 정책으로 클라이언트에서 직접 fetch 불가능할 수 있음.
 *       → Next.js API Route로 프록시 필요 (아래 getRdsProxyUrl 참고)
 *
 * @param channelId  RADIO_CHANNELS[].id (e.g. 'am1250')
 */
export async function fetchNowPlaying(
  channelId: string,
): Promise<NowPlaying | null> {
  const channel = RADIO_CHANNELS.find((ch) => ch.id === channelId);
  if (!channel) return null;

  try {
    const res = await fetch(channel.rdsUrl, {
      cache: 'no-store', // 항상 최신
    });

    if (!res.ok) return null;

    const html = await res.text();
    return parseRdsHtml(html, channelId);
  } catch {
    console.error(`[Radio] RDS fetch failed: ${channelId}`);
    return null;
  }
}

/** RDS HTML → NowPlaying */
function parseRdsHtml(html: string, channelId: string): NowPlaying {
  // <style>…</style>, <script>…</script> 블록 제거 → 나머지 태그 제거 → 엔티티 디코딩
  const text = html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/\{[^}]*\}/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // "Artist - Title" 패턴 분리
  const dashIndex = text.indexOf(' - ');
  if (dashIndex > 0) {
    return {
      artist: text.slice(0, dashIndex).trim(),
      title: text.slice(dashIndex + 3).trim(),
      channelId,
    };
  }

  // 대시 없으면 전체를 title로
  return {
    artist: '',
    title: text || 'Unknown',
    channelId,
  };
}

// ——— API Route 프록시 ———

/**
 * Next.js API Route 프록시 경로
 *
 * CORS 우회용. 연동 시 아래 API Route 생성 필요:
 *   src/app/api/radio/now-playing/route.ts
 *
 * 프록시 구현 예시:
 * ```ts
 * // src/app/api/radio/now-playing/route.ts
 * import { NextRequest, NextResponse } from 'next/server';
 * import { fetchNowPlaying } from '@/lib/radio';
 *
 * export async function GET(req: NextRequest) {
 *   const channelId = req.nextUrl.searchParams.get('channel') || 'am1250';
 *   const data = await fetchNowPlaying(channelId);
 *   return NextResponse.json(data, {
 *     headers: { 'Cache-Control': 'no-cache, no-store' },
 *   });
 * }
 * ```
 *
 * 클라이언트에서:
 *   fetch('/api/radio/now-playing?channel=am1250')
 */
export function getRdsProxyUrl(channelId: string): string {
  return `/api/radio/now-playing?channel=${channelId}`;
}

// ——— 유틸 ———

/** 채널 ID로 채널 객체 조회 */
export function getChannel(channelId: string): RadioChannel | undefined {
  return RADIO_CHANNELS.find((ch) => ch.id === channelId);
}

/** 콘솔 팝업 윈도우 열기 (클라이언트 전용) */
export function openStreamPopup(channelId: string): void {
  const channel = getChannel(channelId);
  if (!channel || typeof window === 'undefined') return;

  window.open(
    channel.consoleUrl,
    `radio-${channelId}`,
    'width=400,height=600,scrollbars=no,resizable=yes',
  );
}
