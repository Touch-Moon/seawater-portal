'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)

    if (authError) {
      setError('Incorrect email or password. Please try again.')
      return
    }

    router.push(redirect)
    router.refresh()
  }

  return (
    <>
      <h1 className="auth-card__title">Sign In</h1>
      <p className="auth-card__subtitle">Welcome back to SteinbachOnline</p>

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

      <form className="auth-card__form" aria-label="Sign in" onSubmit={handleSubmit} noValidate>
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
          <div className="auth-card__label-row">
            <label className="auth-card__label" htmlFor="password">Password</label>
            <Link href="/forgot-password" className="auth-card__forgot">Forgot password?</Link>
          </div>
          <div className="auth-card__input-wrap">
            <input
              id="password"
              className="auth-card__input"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
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
        </div>

        {/* Submit */}
        <button
          type="submit"
          className={`auth-card__submit${loading ? ' auth-card__submit--loading' : ''}`}
          disabled={loading}
        >
          {loading ? (
            <span className="auth-card__spinner" aria-label="Signing in…" />
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <p className="auth-card__switch">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="auth-card__switch-link">Create one</Link>
      </p>
    </>
  )
}
