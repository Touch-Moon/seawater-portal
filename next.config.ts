import type { NextConfig } from 'next'

// ── 보안 헤더 — Vercel 배포 기준 ──
const securityHeaders = [
  // 클릭재킹 방지: 동일 오리진 iframe만 허용
  { key: 'X-Frame-Options',           value: 'SAMEORIGIN' },
  // MIME 스니핑 방지
  { key: 'X-Content-Type-Options',    value: 'nosniff' },
  // Referrer 정보 최소화
  { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
  // 권한 정책: 불필요한 API 차단
  { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=()' },
  // XSS 필터 강제 활성 (구형 브라우저 호환)
  { key: 'X-XSS-Protection',         value: '1; mode=block' },
  // HTTPS 강제 (Vercel은 자동 적용, 명시적 선언으로 보강)
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
]

const nextConfig: NextConfig = {
  reactCompiler: false,

  // 개발 배지 숨김 — 빌드 오류 시에만 표시
  devIndicators: false,

  turbopack: {
    root: process.cwd(),
  },

  // ── 보안 헤더 적용 ──
  async headers() {
    return [
      {
        // 모든 라우트에 적용
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },

  images: {
    // AVIF 우선, WebP 폴백 — 동일 이미지 대비 30-50% 더 작음
    formats: ['image/avif', 'image/webp'],
    // 최소 캐시 TTL 1시간 (기본값 60s보다 길게)
    minimumCacheTTL: 3600,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qylvbmkkuhcijcncaige.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.weatherapi.com',
        pathname: '/weather/**',
      },
      {
        // RSS 기사 이미지 CDN (steinbachonline.com)
        protocol: 'https',
        hostname: 'dht7q8fif4gks.cloudfront.net',
        pathname: '/**',
      },
      {
        // 기사 콘텐츠 이미지 (Golden West S3)
        protocol: 'https',
        hostname: 'golden-west-content.s3.amazonaws.com',
        pathname: '/**',
      },
      {
        // 배너/프로필 이미지 CDN
        protocol: 'https',
        hostname: 'd3355vjhs3bhr1.cloudfront.net',
        pathname: '/**',
      },
      {
        // BBC News 이미지 CDN
        protocol: 'https',
        hostname: 'ichef.bbci.co.uk',
        pathname: '/**',
      },
      {
        // The Guardian 이미지 CDN (i.guim.co.uk / media.guim.co.uk 둘 다 사용)
        protocol: 'https',
        hostname: 'i.guim.co.uk',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.guim.co.uk',
        pathname: '/**',
      },
    ],
  },

}

export default nextConfig
