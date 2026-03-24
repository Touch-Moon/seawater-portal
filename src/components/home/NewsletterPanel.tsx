'use client'

import { useState, FormEvent } from 'react'

interface NewsletterPanelProps {
  mobile?: boolean
  desktop?: boolean
}

export default function NewsletterPanel({ mobile, desktop }: NewsletterPanelProps) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    // TODO: wire up to real newsletter API
    setSubmitted(true)
  }

  const modifiers = [
    mobile  ? 'newsletter-panel--mobile'  : '',
    desktop ? 'newsletter-panel--desktop' : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={`newsletter-panel panel${modifiers ? ` ${modifiers}` : ''}`}>
      {/* Icon + heading */}
      <div className="newsletter-panel__header">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="newsletter-panel__icon" src="/ico-mail-subscription.svg" alt="" width={40} height={40} aria-hidden="true" />
        <div className="newsletter-panel__heading">
          <span className="newsletter-panel__title">Daily Newsletter</span>
          <span className="newsletter-panel__subtitle">Top local stories in your inbox</span>
        </div>
      </div>

      {submitted ? (
        <div className="newsletter-panel__success" role="status">
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" >
            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>You&apos;re subscribed!</span>
        </div>
      ) : (
        <form className="newsletter-panel__form" onSubmit={handleSubmit}>
          <input
            className="newsletter-panel__input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            aria-label="Email address"
            required
          />
          <button type="submit" className="newsletter-panel__btn">
            Subscribe
          </button>
        </form>
      )}

      <p className="newsletter-panel__note">Free · No spam · Unsubscribe anytime</p>
    </div>
  )
}
