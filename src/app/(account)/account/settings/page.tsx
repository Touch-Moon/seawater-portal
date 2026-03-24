'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export default function SettingsPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [profileSaved, setProfileSaved] = useState(false)
  const [profileLoading, setProfileLoading] = useState(false)

  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [pwError, setPwError] = useState('')
  const [pwSaved, setPwSaved] = useState(false)
  const [pwLoading, setPwLoading] = useState(false)

  const [newsletter, setNewsletter] = useState(true)
  const [breakingNews, setBreakingNews] = useState(false)
  const [notifSaved, setNotifSaved] = useState(false)

  // 실제 유저 데이터 로드
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return
      const nickname =
        data.user.user_metadata?.nickname ??
        data.user.user_metadata?.full_name ??
        data.user.email?.split('@')[0] ??
        ''
      setName(nickname)
      setEmail(data.user.email ?? '')
    })
  }, [])

  // Profile save — Supabase updateUser
  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileLoading(true)
    const { error } = await supabase.auth.updateUser({
      data: { nickname: name, full_name: name },
    })
    setProfileLoading(false)
    if (!error) {
      setProfileSaved(true)
      setTimeout(() => setProfileSaved(false), 3000)
    }
  }

  // Password save
  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwError('')
    if (newPw.length < 8) {
      setPwError('New password must be at least 8 characters.')
      return
    }
    if (newPw !== confirmPw) {
      setPwError('New passwords do not match.')
      return
    }
    setPwLoading(true)
    const { error } = await supabase.auth.updateUser({ password: newPw })
    setPwLoading(false)
    if (error) {
      setPwError(error.message)
      return
    }
    setCurrentPw('')
    setNewPw('')
    setConfirmPw('')
    setPwSaved(true)
    setTimeout(() => setPwSaved(false), 3000)
  }

  // Notifications save
  const handleNotifSave = (e: React.FormEvent) => {
    e.preventDefault()
    setNotifSaved(true)
    setTimeout(() => setNotifSaved(false), 3000)
  }

  return (
    <>
      {/* Profile Information */}
      <div className="account-card">
        <h2 className="account-card__title">Profile Information</h2>
        <form aria-label="Edit profile" onSubmit={handleProfileSave}>
          <div className="settings-section">
            <div className="settings-field">
              <label className="settings-field__label" htmlFor="settings-name">
                Full Name
              </label>
              <input
                id="settings-name"
                type="text"
                className="settings-field__input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
            <div className="settings-field">
              <label className="settings-field__label" htmlFor="settings-email">
                Email Address
              </label>
              <input
                id="settings-email"
                type="email"
                className="settings-field__input"
                value={email}
                readOnly
                disabled
                autoComplete="email"
              />
              <p className="settings-field__hint">
                Email cannot be changed here. Contact support if needed.
              </p>
            </div>

            {profileSaved && (
              <div className="settings-toast" role="status">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Profile updated successfully.
              </div>
            )}

            <div>
              <button type="submit" className="btn btn--primary" disabled={profileLoading}>
                {profileLoading ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <span className="auth-card__spinner" style={{ width: '16px', height: '16px' }} aria-hidden="true" />
                    Saving…
                  </span>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Change Password */}
      <div className="account-card">
        <h2 className="account-card__title">Change Password</h2>
        <form aria-label="Change password" onSubmit={handlePasswordSave}>
          <div className="settings-section">
            <div className="settings-field">
              <label className="settings-field__label" htmlFor="settings-current-pw">
                Current Password
              </label>
              <input
                id="settings-current-pw"
                type="password"
                className="settings-field__input"
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                autoComplete="current-password"
                placeholder="Enter current password"
              />
            </div>
            <div className="settings-field">
              <label className="settings-field__label" htmlFor="settings-new-pw">
                New Password
              </label>
              <input
                id="settings-new-pw"
                type="password"
                className="settings-field__input"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                autoComplete="new-password"
                placeholder="Min. 8 characters"
              />
            </div>
            <div className="settings-field">
              <label className="settings-field__label" htmlFor="settings-confirm-pw">
                Confirm New Password
              </label>
              <input
                id="settings-confirm-pw"
                type="password"
                className="settings-field__input"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                autoComplete="new-password"
                placeholder="Repeat new password"
              />
            </div>

            {pwError && (
              <p style={{ fontSize: '13px', color: '#e8192c', margin: 0 }} role="alert">
                {pwError}
              </p>
            )}

            {pwSaved && (
              <div className="settings-toast" role="status">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Password changed successfully.
              </div>
            )}

            <div>
              <button
                type="submit"
                className="btn btn--primary"
                disabled={pwLoading}
                style={{ minWidth: '140px' }}
              >
                {pwLoading ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <span className="auth-card__spinner" style={{ width: '16px', height: '16px' }} aria-hidden="true" />
                    Saving…
                  </span>
                ) : (
                  'Update Password'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Notifications */}
      <div className="account-card">
        <h2 className="account-card__title">Notifications</h2>
        <form aria-label="Notification preferences" onSubmit={handleNotifSave}>
          <div className="settings-section">
            <div className="settings-toggle-row">
              <div className="settings-toggle-row__info">
                <p className="settings-toggle-row__label">Weekly Newsletter</p>
                <p className="settings-toggle-row__desc">Get the week&apos;s top stories delivered to your inbox.</p>
              </div>
              <label className="toggle-switch" aria-label="Weekly newsletter">
                <input
                  type="checkbox"
                  checked={newsletter}
                  onChange={(e) => setNewsletter(e.target.checked)}
                />
                <span className="toggle-switch__track" />
              </label>
            </div>

            <div className="settings-toggle-row">
              <div className="settings-toggle-row__info">
                <p className="settings-toggle-row__label">Breaking News Alerts</p>
                <p className="settings-toggle-row__desc">Receive email alerts for major local stories.</p>
              </div>
              <label className="toggle-switch" aria-label="Breaking news alerts">
                <input
                  type="checkbox"
                  checked={breakingNews}
                  onChange={(e) => setBreakingNews(e.target.checked)}
                />
                <span className="toggle-switch__track" />
              </label>
            </div>

            {notifSaved && (
              <div className="settings-toast" role="status">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Notification preferences saved.
              </div>
            )}

            <div>
              <button type="submit" className="btn btn--primary">
                Save Preferences
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="account-card">
        <h2 className="account-card__title" style={{ color: '#e8192c' }}>Danger Zone</h2>
        <div className="settings-section">
          <div className="settings-toggle-row">
            <div className="settings-toggle-row__info">
              <p className="settings-toggle-row__label">Delete Account</p>
              <p className="settings-toggle-row__desc">
                Permanently delete your account and all saved data. This action cannot be undone.
              </p>
            </div>
            <button
              type="button"
              className="btn btn--danger btn--sm"
              onClick={() => alert('Demo mode — account deletion is disabled.')}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
