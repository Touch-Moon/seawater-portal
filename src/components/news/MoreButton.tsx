'use client'

import { useRouter } from 'next/navigation'

export default function MoreButton() {
  const router = useRouter()

  return (
    <button
      type="button"
      className="news-list__refresh-btn"
      onClick={() => router.refresh()}
      aria-label="Load more"
    >
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" >
        <path
          d="M12 5v14M5 12l7 7 7-7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      More
    </button>
  )
}
