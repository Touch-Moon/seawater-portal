import Link from 'next/link'

const NOTICE = {
  label: 'Notice',
  text: 'SteinbachOnline is your trusted source for local news in Steinbach, Manitoba.',
}

const PRIMARY_LINKS = [
  { label: 'About Us',   href: '/about' },
  { label: 'Contact',    href: '/contact' },
  { label: 'Advertise',  href: '/contact' },
  { label: 'Newsletter', href: '#newsletter' },
]

const SECONDARY_LINKS = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Use',   href: '/terms' },
  { label: 'Accessibility',  href: '/about#accessibility' },
  { label: 'Sitemap',        href: '/sitemap' },
]

const SOCIAL_LINKS = [
  {
    label: 'Facebook',
    href: 'https://facebook.com',
    icon: (
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" >
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: 'X (Twitter)',
    href: 'https://twitter.com',
    icon: (
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    icon: (
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
]

const MOBILE_PRIMARY = [
  { label: 'Sign In',      href: '#signin' },
  { label: 'My Account',   href: '#account' },
  { label: 'Desktop View', href: '#desktop' },
  { label: 'All News',     href: '/news' },
]

const MOBILE_SECONDARY_1 = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Use',   href: '/terms' },
  { label: 'Advertise',      href: '/contact' },
  { label: 'Contact',        href: '/contact' },
]

const MOBILE_SECONDARY_2 = [
  { label: 'Accessibility', href: '/about#accessibility' },
  { label: 'Sitemap',       href: '/sitemap' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer__inner">

        {/* ── Mobile layout (< 672px) ── */}
        <div className="footer__mobile">
          <nav className="footer__mobile-primary" aria-label="Primary footer links">
            {MOBILE_PRIMARY.map((link, i) => (
              <span key={link.label} className="footer__link-item">
                {i > 0 && <span className="footer__dot" aria-hidden="true">·</span>}
                <Link href={link.href} className="footer__mobile-primary-link">{link.label}</Link>
              </span>
            ))}
          </nav>
          <nav className="footer__mobile-secondary" aria-label="Secondary footer links">
            {MOBILE_SECONDARY_1.map((link, i) => (
              <span key={link.label} className="footer__link-item">
                {i > 0 && <span className="footer__dot" aria-hidden="true">·</span>}
                <Link href={link.href} className="footer__link footer__link--legal">{link.label}</Link>
              </span>
            ))}
          </nav>
          <nav className="footer__mobile-secondary" aria-label="Legal links">
            {MOBILE_SECONDARY_2.map((link, i) => (
              <span key={link.label} className="footer__link-item">
                {i > 0 && <span className="footer__dot" aria-hidden="true">·</span>}
                <Link href={link.href} className="footer__link footer__link--legal">{link.label}</Link>
              </span>
            ))}
          </nav>
          <p className="footer__copyright">© {year} SteinbachOnline</p>
        </div>

        {/* ── Tablet+ layout (≥ 672px) ── */}
        <div className="footer__desktop">
          {/* Notice bar */}
          <div className="footer__notice">
            <span className="footer__notice-label">{NOTICE.label}</span>
            <span className="footer__notice-text">{NOTICE.text}</span>
            <Link href="/news" className="footer__notice-more">
              All News
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none" >
                <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          <div className="footer__divider" />

          {/* Links + Social */}
          <div className="footer__links-row">
            <nav className="footer__links" aria-label="Primary footer links">
              {PRIMARY_LINKS.map((link, i) => (
                <span key={link.label} className="footer__link-item">
                  {i > 0 && <span className="footer__dot" aria-hidden="true">·</span>}
                  <Link href={link.href} className="footer__link">{link.label}</Link>
                </span>
              ))}
            </nav>
            <div className="footer__social" aria-label="Social media links">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="footer__social-btn"
                  aria-label={`${s.label} (opens in new tab)`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Legal links */}
          <nav className="footer__legal" aria-label="Legal links">
            {SECONDARY_LINKS.map((link, i) => (
              <span key={link.label} className="footer__link-item">
                {i > 0 && <span className="footer__dot" aria-hidden="true">·</span>}
                <Link href={link.href} className="footer__link footer__link--legal">{link.label}</Link>
              </span>
            ))}
          </nav>

          {/* Copyright */}
          <p className="footer__copyright">
            © {year} SteinbachOnline · Powered by{' '}
            <a
              href="https://goldenwest.ca"
              className="footer__copyright-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Golden West Broadcasting
              <span className="sr-only">(opens in new tab)</span>
            </a>
          </p>
        </div>

      </div>
    </footer>
  )
}
