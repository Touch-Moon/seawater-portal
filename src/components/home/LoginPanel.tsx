import Link from 'next/link'

// LoginPanel — right column card (login/account)
// Server Component

export default function LoginPanel() {
  return (
    <div className="login-panel">
      <Link href="/login" className="login-panel__btn">
        Sign In
      </Link>
      <div className="login-panel__links">
        <Link href="/find-account" className="login-panel__link">
          Find Account
        </Link>
        <span className="login-panel__divider" aria-hidden="true" />
        <Link href="/register" className="login-panel__link">
          Create Account
        </Link>
      </div>
    </div>
  )
}
