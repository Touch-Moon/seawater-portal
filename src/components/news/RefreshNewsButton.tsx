'use client'

import { useRouter } from 'next/navigation'

export default function RefreshNewsButton() {
  const router = useRouter()

  return (
    <button
      type="button"
      className="news-list__refresh-btn"
      onClick={() => router.refresh()}
      aria-label="Refresh news"
    >
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" >
        <path
          d="M23 4v6h-6M1 20v-6h6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Update <span>News</span>
    </button>
  )
}
