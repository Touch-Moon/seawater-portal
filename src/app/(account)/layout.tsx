'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import ListPageHeader from '@/components/layout/ListPageHeader'

type UserInfo = {
  name: string
  email: string
}

const NAV_LINKS = [
  {
    href: '/account',
    label: 'Profile',
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
  {
    href: '/account/saved',
    label: 'Saved Articles',
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
      </svg>
    ),
  },
  {
    href: '/account/settings',
    label: 'Settings',
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
  },
]

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<UserInfo | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return
      const name =
        data.user.user_metadata?.full_name ??
        data.user.user_metadata?.nickname ??
        data.user.email?.split('@')[0] ??
        'User'
      setUser({ name, email: data.user.email ?? '' })
    })
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const initial = user
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <>
      <ListPageHeader />

      <div className="account-layout">
      {/* Sidebar */}
      <nav className="account-nav" aria-label="Account navigation">
        {/* User info (desktop only) */}
        <div className="account-nav__user">
          <div className="account-nav__avatar" aria-hidden="true">{initial}</div>
          <div className="account-nav__user-info">
            <p className="account-nav__user-name">{user?.name ?? '—'}</p>
            <p className="account-nav__user-email">{user?.email ?? ''}</p>
          </div>
        </div>

        {NAV_LINKS.map((link) => {
          const isActive =
            link.href === '/account'
              ? pathname === '/account'
              : pathname.startsWith(link.href)
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`account-nav__link${isActive ? ' account-nav__link--active' : ''}`}
            >
              {link.icon}
              {link.label}
            </Link>
          )
        })}

        <div className="account-nav__divider" />

        <button
          type="button"
          className="account-nav__link account-nav__link--danger"
          onClick={handleSignOut}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
          Sign Out
        </button>
      </nav>

      {/* Main content */}
      <main id="main-content" className="account-main">
        {children}
      </main>
    </div>
    </>
  )
}
