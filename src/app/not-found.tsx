import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 — Page Not Found · SteinbachOnline',
}

export default function NotFound() {
  return (
    <main id="main-content" className="not-found">
      <div className="not-found__inner">
        <div className="not-found__code">404</div>
        <h1 className="not-found__title">Page not found</h1>
        <p className="not-found__desc">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="not-found__links">
          <Link href="/" className="not-found__btn not-found__btn--primary">
            Go to Homepage
          </Link>
          <Link href="/news" className="not-found__btn not-found__btn--secondary">
            Browse News
          </Link>
        </div>
      </div>
    </main>
  )
}
