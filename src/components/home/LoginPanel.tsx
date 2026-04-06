'use client'

import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPanel() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const router = useRouter()
  // 클라이언트는 useEffect 내부에서 한 번만 생성 — render마다 재생성 방지
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null)

  useEffect(() => {
    // Supabase 환경변수 미설정 시 조용히 종료 (콘솔 에러 방지)
    if (!isSupabaseConfigured()) return

    const supabase = createClient()
    supabaseRef.current = supabase

    const resolveUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const name =
            user.user_metadata?.nickname ??
            user.user_metadata?.full_name ??
            user.email?.split('@')[0] ??
            'User'
          setUser({ name, email: user.email ?? '' })
        } else {
          setUser(null)
        }
      } catch {
        // 네트워크 오류 또는 프로젝트 일시정지 — 비로그인 상태로 폴백
        setUser(null)
      }
    }
    resolveUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'USER_UPDATED') {
        // 프로필 업데이트 시 서버에서 최신 메타데이터 재조회
        await resolveUser()
        return
      }
      // 토큰 갱신 실패 (Supabase 프로젝트 일시정지 등) → 비로그인 처리
      if (event === 'TOKEN_REFRESH_FAILED') {
        setUser(null)
        return
      }
      if (session?.user) {
        const name =
          session.user.user_metadata?.nickname ??
          session.user.user_metadata?.full_name ??
          session.user.email?.split('@')[0] ??
          'User'
        setUser({ name, email: session.user.email ?? '' })
      } else {
        setUser(null)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    if (supabaseRef.current) {
      await supabaseRef.current.auth.signOut()
    }
    router.push('/')
    router.refresh()
  }

  // ── 로그인 상태 ──────────────────────────────────────────────
  if (user) {
    return (
      <div className="login-panel login-panel--logged-in">

        {/* 상단: 프로필 + 로그아웃 */}
        <div className="login-panel__top">
          <Link href="/account" className="login-panel__profile">
            <span className="login-panel__avatar">
              {user.name.charAt(0).toUpperCase()}
            </span>
            <span className="login-panel__name">{user.name}</span>
          </Link>
          <button className="login-panel__signout" onClick={handleSignOut}>
            Sign out
          </button>
        </div>

        {/* 구분선 */}
        <div className="login-panel__sep" aria-hidden="true" />

        {/* 하단: 단축 메뉴 */}
        <nav className="login-panel__menu" aria-label="Account menu">
          <Link href="/account" className="login-panel__menu-item">
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" >
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/>
              <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            <span>Account</span>
          </Link>
          <Link href="/account/saved" className="login-panel__menu-item">
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" >
              <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.8"/>
              <path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            <span>Article</span>
          </Link>
          <Link href="/account/settings" className="login-panel__menu-item">
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" >
              <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Setting</span>
          </Link>
        </nav>

      </div>
    )
  }

  // ── 비로그인 상태 ─────────────────────────────────────────────
  return (
    <div className="login-panel">
      <Link href="/login" className="login-panel__btn">
        Sign In
      </Link>
      <div className="login-panel__links">
        <Link href="/forgot-password" className="login-panel__link">
          Find Account
        </Link>
        <span className="login-panel__divider" aria-hidden="true" />
        <Link href="/signup" className="login-panel__link">
          Create Account
        </Link>
      </div>
    </div>
  )
}
