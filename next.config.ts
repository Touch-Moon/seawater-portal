import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactCompiler: false,

  // Hide dev badge — only show on build errors
  devIndicators: false,

  turbopack: {
    root: process.cwd(),
  },

  images: {
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
