'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name || !email || !password || !confirm) {
      setError('Please fill in all fields.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (!agreed) {
      setError('Please agree to the Terms of Service.')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/account`,
      },
    })
    setLoading(false)

    if (authError) {
      setError(authError.message)
      return
    }
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="auth-card__success">
        <div className="auth-card__success-icon">
          <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" >
            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="auth-card__title">Account created!</h1>
        <p className="auth-card__subtitle">
          We&apos;ve sent a confirmation email to <strong>{email}</strong>.
          Check your inbox to activate your account.
        </p>
        <Link href="/login" className="auth-card__submit" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', lineHeight: '48px' }}>
          Back to Sign In
        </Link>
      </div>
    )
  }

  return (
    <>
      <h1 className="auth-card__title">Create Account</h1>
      <p className="auth-card__subtitle">Join SteinbachOnline for free</p>

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

      <form className="auth-card__form" aria-label="Sign up" onSubmit={handleSubmit} noValidate>
        {/* Full name */}
        <div className="auth-card__field">
          <label className="auth-card__label" htmlFor="name">Full Name</label>
          <input
            id="name"
            className="auth-card__input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Smith"
            autoComplete="name"
            required
          />
        </div>

        {/* Email */}
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

        {/* Password */}
        <div className="auth-card__field">
          <label className="auth-card__label" htmlFor="password">Password</label>
          <div className="auth-card__input-wrap">
            <input
              id="password"
              className="auth-card__input"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              className="auth-card__eye-btn"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          {/* Password strength indicator */}
          {password.length > 0 && (
            <div className="auth-card__strength">
              <div className={`auth-card__strength-bar auth-card__strength-bar--${password.length < 8 ? 'weak' : password.length < 12 ? 'medium' : 'strong'}`} />
              <span className="auth-card__strength-label">
                {password.length < 8 ? 'Too short' : password.length < 12 ? 'Good' : 'Strong'}
              </span>
            </div>
          )}
        </div>

        {/* Confirm password */}
        <div className="auth-card__field">
          <label className="auth-card__label" htmlFor="confirm">Confirm Password</label>
          <input
            id="confirm"
            className={`auth-card__input${confirm && confirm !== password ? ' auth-card__input--error' : ''}`}
            type={showPassword ? 'text' : 'password'}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Repeat password"
            autoComplete="new-password"
            required
          />
          {confirm && confirm !== password && (
            <span className="auth-card__field-error">Passwords do not match</span>
          )}
        </div>

        {/* Terms */}
        <label className="auth-card__checkbox-row">
          <input
            type="checkbox"
            className="auth-card__checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <span className="auth-card__checkbox-label">
            I agree to the{' '}
            <Link href="/terms" className="auth-card__switch-link">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy" className="auth-card__switch-link">Privacy Policy</Link>
          </span>
        </label>

        <button
          type="submit"
          className={`auth-card__submit${loading ? ' auth-card__submit--loading' : ''}`}
          disabled={loading}
        >
          {loading ? <span className="auth-card__spinner" aria-label="Creating account…" /> : 'Create Account'}
        </button>
      </form>

      <p className="auth-card__switch">
        Already have an account?{' '}
        <Link href="/login" className="auth-card__switch-link">Sign in</Link>
      </p>
    </>
  )
}
