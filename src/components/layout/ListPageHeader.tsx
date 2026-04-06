'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSidePanel } from '@/context/SidePanelContext'

export default function ListPageHeader() {
  const [searchOpen, setSearchOpen] = useState(false)
  const { openPanel } = useSidePanel()
  const inputRef = useRef<HTMLInputElement>(null)
  const searchBtnRef = useRef<HTMLButtonElement>(null)
  const pathname = usePathname()

  // Show share button only on slug (detail) pages
  const isSlugPage = /^\/(news|events)\/[^/]+$/.test(pathname)

  const handleShare = useCallback(async () => {
    const url = window.location.href
    const title = document.title

    if (navigator.share) {
      try {
        await navigator.share({ title, url })
      } catch {
        // User cancelled or share failed — ignore
      }
    } else {
      await navigator.clipboard.writeText(url)
      // TODO: optional toast notification
    }
  }, [])

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [searchOpen])

  useEffect(() => {
    if (!searchOpen) return

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setSearchOpen(false)
        searchBtnRef.current?.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [searchOpen])

  return (
    <>
      <div className="list-page__head">
        <div className="list-page__head-inner">
          {/* Logo */}
          <Link href="/" className="list-page__logo" aria-label="SteinbachOnline Home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="list-page__logo-brand list-page__logo-brand--dark"
              src="/logo-brandcolor-dark.svg"
              alt=""
              width={0}
              height={32}
              aria-hidden="true"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="list-page__logo-brand list-page__logo-brand--light"
              src="/logo-brandcolor-light.svg"
              alt=""
              width={0}
              height={32}
              aria-hidden="true"
            />
          </Link>

          {/* Right action buttons */}
          <div className="list-page__actions">
            {/* Subscribe — hidden on mobile */}
            <a href="/subscription" className="list-page__subscribe-btn list-page__hide-mobile" aria-label="Subscribe">
              Subscribe
            </a>

            {/* Share — slug pages only */}
            {isSlugPage && (
              <button type="button" className="list-page__icon-btn" aria-label="Share" onClick={handleShare}>
                <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}

            {/* Search */}
            <button
              ref={searchBtnRef}
              type="button"
              className="list-page__icon-btn"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
            >
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            {/* Menu — hidden on mobile */}
            <button
              type="button"
              className="list-page__icon-btn list-page__hide-mobile"
              aria-label="Open menu"
              onClick={openPanel}
            >
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" >
                <line x1="3" y1="5.5" x2="21" y2="5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="3" y1="18.5" x2="21" y2="18.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Search overlay + backdrop — outside __head to escape stacking context */}
      {searchOpen && (
        <>
          <div
            className="list-page__search-backdrop"
            onClick={() => { setSearchOpen(false); searchBtnRef.current?.focus() }}
          />
          <div className="list-page__search-overlay">
            <div className="list-page__search-outer">
            <div className="list-page__search-inner">
              <input
                ref={inputRef}
                type="text"
                className="list-page__search-input"
                placeholder="Search or enter URL"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const q = (e.target as HTMLInputElement).value.trim()
                    if (q) window.location.href = `/search?q=${encodeURIComponent(q)}`
                  }
                }}
              />
              <button
                type="button"
                className="list-page__search-submit"
                aria-label="Search"
                onClick={() => {
                  const q = inputRef.current?.value.trim()
                  if (q) window.location.href = `/search?q=${encodeURIComponent(q)}`
                }}
              >
                <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                  <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
