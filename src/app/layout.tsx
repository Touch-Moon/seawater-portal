import type { Metadata } from 'next'
import Providers from './providers'
import SettingsButton from '@/components/shared/SettingsButton'
import Footer from '@/components/layout/Footer'
import '@/styles/globals.scss'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://steinbachonline.com'),
  title: 'SteinbachOnline — Local News, Weather & Events',
  description: 'Your source for local news, weather, events, and community information in Steinbach, Manitoba.',
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
