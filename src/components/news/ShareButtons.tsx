'use client'

import { useState } from 'react'

interface ShareButtonsProps {
  title: string
  slug: string
}

export default function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const url = typeof window !== 'undefined'
    ? `${window.location.origin}/news/${slug}`
    : `/news/${slug}`

  /** Web Share API (모바일 네이티브 공유 시트) → fallback: 새 탭 */
  async function handleShare(platform: 'facebook' | 'x' | 'email') {
    // 모바일: Web Share API 우선 시도
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
        return
      } catch {
        // 사용자 취소 or 실패 → fallback
      }
    }

    // Desktop fallback: 팝업 창 (600×500, 화면 중앙)
    const w = 600
    const h = 500
    const left = Math.round(screen.width / 2 - w / 2)
    const top = Math.round(screen.height / 2 - h / 2)
    const features = `width=${w},height=${h},left=${left},top=${top},toolbar=no,menubar=no`

    switch (platform) {
      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          'share', features,
        )
        break
      case 'x':
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
          'share', features,
        )
        break
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`
        break
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  return (
    <div className="article__share">
      <span className="article__share-label">Share</span>

      {/* Facebook */}
      <button
        type="button"
        className="article__share-btn"
        onClick={() => handleShare('facebook')}
        aria-label="Share on Facebook"
      >
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      </button>

      {/* X (Twitter) */}
      <button
        type="button"
        className="article__share-btn"
        onClick={() => handleShare('x')}
        aria-label="Share on X"
      >
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </button>

      {/* Email */}
      <button
        type="button"
        className="article__share-btn"
        onClick={() => handleShare('email')}
        aria-label="Share via email"
      >
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      </button>

      {/* Copy link */}
      <button
        type="button"
        className={`article__share-btn${copied ? ' article__share-btn--copied' : ''}`}
        onClick={handleCopy}
        aria-label={copied ? 'Link copied' : 'Copy link'}
      >
        {copied ? (
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        )}
      </button>
    </div>
  )
}
