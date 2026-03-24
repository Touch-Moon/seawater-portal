'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email) {
      setError('Please enter your email address.')
      return
    }
    setLoading(true)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/account/settings`,
    })
    setLoading(false)

    if (authError) {
      setError(authError.message)
      return
    }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="auth-card__success">
        <div className="auth-card__success-icon">
          <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="auth-card__title">Check your email</h1>
        <p className="auth-card__subtitle">
          We&apos;ve sent a password reset link to <strong>{email}</strong>.
          The link expires in 15 minutes.
        </p>
        <Link
          href="/login"
          className="auth-card__submit"
          style={{ display: 'block', textAlign: 'center', textDecoration: 'none', lineHeight: '48px' }}
        >
          Back to Sign In
        </Link>
        <p className="auth-card__switch" style={{ marginTop: 16 }}>
          Didn&apos;t receive it?{' '}
          <button
            type="button"
            className="auth-card__switch-link"
            onClick={() => { setSubmitted(false); setEmail('') }}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit' }}
          >
            Try again
          </button>
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="auth-card__icon-header">
        <div className="auth-card__icon-circle">
          <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
      </div>

      <h1 className="auth-card__title">Forgot password?</h1>
      <p className="auth-card__subtitle">
        Enter your email and we&apos;ll send you a reset link.
      </p>

      {error && (
        <div className="auth-card__error" role="alert">
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="16" r="1" fill="currentColor" />
          </svg>
          {error}
        </div>
      )}

      <form className="auth-card__form" aria-label="Reset password" onSubmit={handleSubmit} noValidate>
        <div className="auth-card__field">
          <label className="auth-card__label" htmlFor="email">Email</label>
          <input
            id="email"
            className="auth-card__input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </div>

        <button
          type="submit"
          className={`auth-card__submit${loading ? ' auth-card__submit--loading' : ''}`}
          disabled={loading}
        >
          {loading ? <span className="auth-card__spinner" aria-label="Sending…" /> : 'Send Reset Link'}
        </button>
      </form>

      <p className="auth-card__switch">
        Remember your password?{' '}
        <Link href="/login" className="auth-card__switch-link">Sign in</Link>
      </p>
    </>
  )
}
