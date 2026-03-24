import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main id="main-content" className="auth-layout">
      {/* Logo */}
      <div className="auth-layout__logo-wrap">
        <Link href="/" className="auth-layout__logo" aria-label="SteinbachOnline Home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/ico-logo-brandcolor.svg" alt="SteinbachOnline" width={160} height={30} />
        </Link>
      </div>

      {/* Card */}
      <div className="auth-layout__card">
        {children}
      </div>

      {/* Footer */}
      <p className="auth-layout__footer">
        &copy; {new Date().getFullYear()} SteinbachOnline · Powered by{' '}
        <a href="https://goldenwestbroadcasting.com" target="_blank" rel="noopener noreferrer">
          Golden West Broadcasting
          <span className="sr-only">(opens in new tab)</span>
        </a>
      </p>
    </main>
  )
}
