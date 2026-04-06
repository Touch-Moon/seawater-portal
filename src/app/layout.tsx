import type { Metadata, Viewport } from 'next'
import Providers from './providers'
import SettingsButton from '@/components/shared/SettingsButton'
import Footer from '@/components/layout/Footer'
import '@/styles/globals.scss'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://steinbachonline.com'

export const viewport: Viewport = {
  // 다크 테마 기본값에 맞춘 브라우저 UI 컬러
  themeColor: [
    { media: '(prefers-color-scheme: dark)',  color: '#131416' },
    { media: '(prefers-color-scheme: light)', color: '#f2f4f7' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:  'SteinbachOnline — Local News, Weather & Events',
    template: '%s | SteinbachOnline',
  },
  description: 'Your source for local news, weather, events, and community information in Steinbach, Manitoba.',
  keywords: [
    'Steinbach', 'Manitoba', 'local news', 'weather', 'events',
    'community', 'sports', 'agriculture', 'classifieds', 'radio',
  ],
  authors: [{ name: 'SteinbachOnline' }],
  creator: 'SteinbachOnline',
  openGraph: {
    type:        'website',
    locale:      'en_CA',
    url:         SITE_URL,
    siteName:    'SteinbachOnline',
    title:       'SteinbachOnline — Local News, Weather & Events',
    description: 'Your source for local news, weather, events, and community information in Steinbach, Manitoba.',
  },
  twitter: {
    card:        'summary_large_image',
    title:       'SteinbachOnline — Local News, Weather & Events',
    description: 'Your source for local news, weather, events, and community information in Steinbach, Manitoba.',
  },
  robots: {
    index:  true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  manifest: '/site.webmanifest',
  icons: {
    // next-themes가 data-theme 속성을 제어하므로 JS 렌더 후 테마 확정
    // — 브라우저 기본 파비콘은 다크 버전, 라이트 버전은 SVG media query로 대응
    icon: [
      { url: '/favicon-dark.svg',  media: '(prefers-color-scheme: dark)',  type: 'image/svg+xml' },
      { url: '/favicon-light.svg', media: '(prefers-color-scheme: light)', type: 'image/svg+xml' },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <a href="#main-content" className="skip-nav">
          Skip to main content
        </a>
        <Providers>
          {children}
          <Footer />
          <SettingsButton />
        </Providers>
      </body>
    </html>
  )
}
