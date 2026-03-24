import Link from 'next/link'
import Navigation from './Navigation'
import ThemeToggle from '@/components/shared/ThemeToggle'

export default function Header() {
  return (
    <header className="header">
      <div className="header__top-bar">
        <div className="header__inner">
          <Link href="/" className="header__logo" aria-label="SteinbachOnline Home">
            <svg
              aria-hidden="true"
              className="header__logo-icon"
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="headerLogoGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%"   stopColor="#4776E6" />
                  <stop offset="50%"  stopColor="#8E54E9" />
                  <stop offset="100%" stopColor="#E91E8C" />
                </linearGradient>
              </defs>
              <text x="2" y="30" fontSize="30" fontWeight="800"
                fontFamily="-apple-system, BlinkMacSystemFont, sans-serif"
                fill="url(#headerLogoGrad)">
                S
              </text>
            </svg>
            <span className="header__logo-text">
              <span className="header__logo-main">Steinbach</span>
              <span className="header__logo-sub">Online</span>
            </span>
          </Link>

          <div className="header__utility">
            <ThemeToggle />
          </div>
        </div>
      </div>

      <Navigation />
    </header>
  )
}
