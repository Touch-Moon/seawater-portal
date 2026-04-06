'use client'

import { useState, useRef, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import VirtualKeyboard from './VirtualKeyboard'

export default function SearchBar({
  placeholder = '',
}: {
  placeholder?: string
}) {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [showKeyboard, setShowKeyboard] = useState(false)
  const [mounted, setMounted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { resolvedTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  // SSR-safe: use dark (default) until mounted to avoid hydration mismatch
  const isLight = mounted && resolvedTheme === 'light'
  const logoBrand = isLight ? '/logo-brandcolor-light.svg' : '/logo-brandcolor-dark.svg'
  const logoColorful = isLight ? '/logo-colorful-light.svg' : '/logo-colorful-dark.svg'

  const handleCancel = () => setQuery('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  // VirtualKeyboard callbacks
  const handleVKInput = (char: string) => setQuery((q) => q + char)
  const handleVKBackspace = () => setQuery((q) => q.slice(0, -1))
  const handleVKSubmit = () => {
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <section className="search-bar__section">
      <form
        className={`search-bar__wrapper${isFocused ? ' search-bar__wrapper--focused' : ''}`}
        onSubmit={handleSubmit}
        role="search"
      >
        <div className="search-bar__inner">
          {/* Logo — colorful fades out on focus to reveal brand color */}
          <button type="button" className="search-bar__logo-btn" aria-label="SteinbachOnline">
            <span className="search-bar__logo-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="search-bar__logo-brand" src={logoBrand} alt="" width={126} height={24} aria-hidden="true" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className={`search-bar__logo-colorful${isFocused ? ' search-bar__logo-colorful--out' : ''}`} src={logoColorful} alt="" width={126} height={24} aria-hidden="true" />
            </span>
          </button>

          {/* Input */}
          <input
            ref={inputRef}
            className="search-bar__input"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            aria-label="Search"
            autoComplete="off"
          />

          {/* Cancel button — visible when input has text */}
          {query && (
            <button
              type="button"
              className="search-bar__cancel-btn"
              onClick={handleCancel}
              aria-label="Clear search"
            >
              <svg aria-hidden="true" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" >
                <path fillRule="evenodd" clipRule="evenodd" d="M14 5C9.029 5 5 9.0294 5 14C5 18.9706 9.029 23 14 23C18.971 23 23 18.9706 23 14C23 9.0294 18.971 5 14 5ZM16.121 17.5355C16.511 17.9261 17.145 17.9261 17.535 17.5355C17.925 17.145 17.926 16.5117 17.535 16.1213L15.414 14L17.535 11.8787C17.926 11.4881 17.926 10.855 17.535 10.4645C17.145 10.0739 16.511 10.0739 16.121 10.4645L14 12.5858L11.878 10.4645C11.488 10.074 10.855 10.0743 10.464 10.4645C10.074 10.855 10.074 11.4881 10.464 11.8787L12.585 14L10.464 16.1213C10.074 16.5118 10.074 17.145 10.464 17.5355C10.855 17.9261 11.488 17.9261 11.878 17.5355L14 15.4142L16.121 17.5355Z" fill="currentColor" fillOpacity="0.32" />
              </svg>
            </button>
          )}

          {/* Keyboard + Search — grouped, gap 0 */}
          <div className="search-bar__btn-group">
            <button
              type="button"
              className="search-bar__icon-btn search-bar__icon-btn--keyboard"
              onClick={() => setShowKeyboard((v) => !v)}
              aria-label={showKeyboard ? 'Close keyboard' : 'Open virtual keyboard'}
              aria-pressed={showKeyboard}
            >
              <svg aria-hidden="true" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" >
                <path d="M22 6.5H6C3.79086 6.5 2 8.29086 2 10.5V17.5C2 19.7091 3.79086 21.5 6 21.5H22C24.2091 21.5 26 19.7091 26 17.5V10.5C26 8.29086 24.2091 6.5 22 6.5Z" stroke="currentColor" strokeOpacity="0.72" strokeWidth="2" />
                <path d="M7.5 9.5H6.5C6.22386 9.5 6 9.72386 6 10V11C6 11.2761 6.22386 11.5 6.5 11.5H7.5C7.77614 11.5 8 11.2761 8 11V10C8 9.72386 7.77614 9.5 7.5 9.5Z" fill="currentColor" fillOpacity="0.72" />
                <path d="M11 9.5H10C9.72386 9.5 9.5 9.72386 9.5 10V11C9.5 11.2761 9.72386 11.5 10 11.5H11C11.2761 11.5 11.5 11.2761 11.5 11V10C11.5 9.72386 11.2761 9.5 11 9.5Z" fill="currentColor" fillOpacity="0.72" />
                <path d="M14.5 9.5H13.5C13.2239 9.5 13 9.72386 13 10V11C13 11.2761 13.2239 11.5 13.5 11.5H14.5C14.7761 11.5 15 11.2761 15 11V10C15 9.72386 14.7761 9.5 14.5 9.5Z" fill="currentColor" fillOpacity="0.72" />
                <path d="M18 9.5H17C16.7239 9.5 16.5 9.72386 16.5 10V11C16.5 11.2761 16.7239 11.5 17 11.5H18C18.2761 11.5 18.5 11.2761 18.5 11V10C18.5 9.72386 18.2761 9.5 18 9.5Z" fill="currentColor" fillOpacity="0.72" />
                <path d="M21.5 9.5H20.5C20.2239 9.5 20 9.72386 20 10V11C20 11.2761 20.2239 11.5 20.5 11.5H21.5C21.7761 11.5 22 11.2761 22 11V10C22 9.72386 21.7761 9.5 21.5 9.5Z" fill="currentColor" fillOpacity="0.72" />
                <path d="M7.5 13H6.5C6.22386 13 6 13.2239 6 13.5V14.5C6 14.7761 6.22386 15 6.5 15H7.5C7.77614 15 8 14.7761 8 14.5V13.5C8 13.2239 7.77614 13 7.5 13Z" fill="currentColor" fillOpacity="0.72" />
                <path d="M11 13H10C9.72386 13 9.5 13.2239 9.5 13.5V14.5C9.5 14.7761 9.72386 15 10 15H11C11.2761 15 11.5 14.7761 11.5 14.5V13.5C11.5 13.2239 11.2761 13 11 13Z" fill="currentColor" fillOpacity="0.72" />
                <path d="M14.5 13H13.5C13.2239 13 13 13.2239 13 13.5V14.5C13 14.7761 13.2239 15 13.5 15H14.5C14.7761 15 15 14.7761 15 14.5V13.5C15 13.2239 14.7761 13 14.5 13Z" fill="currentColor" fillOpacity="0.72" />
                <path d="M18 13H17C16.7239 13 16.5 13.2239 16.5 13.5V14.5C16.5 14.7761 16.7239 15 17 15H18C18.2761 15 18.5 14.7761 18.5 14.5V13.5C18.5 13.2239 18.2761 13 18 13Z" fill="currentColor" fillOpacity="0.72" />
                <path d="M21.5 13H20.5C20.2239 13 20 13.2239 20 13.5V14.5C20 14.7761 20.2239 15 20.5 15H21.5C21.7761 15 22 14.7761 22 14.5V13.5C22 13.2239 21.7761 13 21.5 13Z" fill="currentColor" fillOpacity="0.72" />
                <path d="M7.5 16.5H6.5C6.22386 16.5 6 16.7239 6 17V18C6 18.2761 6.22386 18.5 6.5 18.5H7.5C7.77614 18.5 8 18.2761 8 18V17C8 16.7239 7.77614 16.5 7.5 16.5Z" fill="currentColor" fillOpacity="0.72" />
                <path d="M18 16.5H10C9.72386 16.5 9.5 16.7239 9.5 17V18C9.5 18.2761 9.72386 18.5 10 18.5H18C18.2761 18.5 18.5 18.2761 18.5 18V17C18.5 16.7239 18.2761 16.5 18 16.5Z" fill="currentColor" fillOpacity="0.72" />
                <path d="M21.5 16.5H20.5C20.2239 16.5 20 16.7239 20 17V18C20 18.2761 20.2239 18.5 20.5 18.5H21.5C21.7761 18.5 22 18.2761 22 18V17C22 16.7239 21.7761 16.5 21.5 16.5Z" fill="currentColor" fillOpacity="0.72" />
              </svg>
            </button>

            {/* Search submit */}
            <button type="submit" className="search-bar__icon-btn" aria-label="Search">
              <svg aria-hidden="true" width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" >
                <path d="M11.8424 2C17.2782 2 21.6848 6.40664 21.6848 11.8424C21.6848 14.063 20.9474 16.1107 19.7067 17.7575L26.5964 24.6472C27.1345 25.1852 27.1345 26.0584 26.5964 26.5964C26.0584 27.1345 25.1852 27.1345 24.6472 26.5964L17.7575 19.7067C16.1107 20.9474 14.063 21.6848 11.8424 21.6848C6.40664 21.6848 2 17.2782 2 11.8424C2 6.40664 6.40664 2 11.8424 2ZM11.8424 4.75666C7.92867 4.75666 4.75666 7.92867 4.75666 11.8424C4.75666 15.7561 7.92867 18.9281 11.8424 18.9281C15.7561 18.9281 18.9281 15.7561 18.9281 11.8424C18.9281 7.92867 15.7561 4.75666 11.8424 4.75666Z" fill="currentColor" />
              </svg>
            </button>
          </div>
        </div>
      </form>
      {showKeyboard && (
        <VirtualKeyboard
          onInput={handleVKInput}
          onBackspace={handleVKBackspace}
          onSubmit={handleVKSubmit}
          onClose={() => setShowKeyboard(false)}
        />
      )}
    </section>
  )
}
