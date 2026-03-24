'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { RADIO_CHANNELS, getRdsProxyUrl } from '@/lib/radio'
import type { RadioChannel, NowPlaying } from '@/lib/radio'

const POLL_INTERVAL = 30_000

export default function ListenChannels() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [nowPlaying, setNowPlaying] = useState<Record<string, NowPlaying>>({})
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Poll now-playing for all channels
  const fetchAll = useCallback(async () => {
    const results = await Promise.allSettled(
      RADIO_CHANNELS.map(async (ch) => {
        const res = await fetch(getRdsProxyUrl(ch.id))
        if (!res.ok) return null
        return res.json() as Promise<NowPlaying | null>
      }),
    )

    setNowPlaying((prev) => {
      const next = { ...prev }
      results.forEach((r, i) => {
        if (r.status === 'fulfilled' && r.value) {
          next[RADIO_CHANNELS[i].id] = r.value
        }
      })
      return next
    })
  }, [])

  useEffect(() => {
    fetchAll()
    intervalRef.current = setInterval(fetchAll, POLL_INTERVAL)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [fetchAll])

  function handlePlay(ch: RadioChannel) {
    if (activeId === ch.id) {
      setActiveId(null)
    } else {
      setActiveId(ch.id)
    }
  }

  return (
    <div className="listen">
      {/* Header + Channels in one card */}
      <div className="listen__panel">
        <div className="page-header">
          <div className="page-header__icon" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/ico-listen.svg" width={40} height={40} alt="" />
          </div>
          <h1 className="page-header__title">Listen</h1>
        </div>

        <div className="listen__channels">
          {RADIO_CHANNELS.map((ch) => {
          const isActive = activeId === ch.id
          const np = nowPlaying[ch.id]

          return (
            <div
              key={ch.id}
              className={`listen__card${isActive ? ' listen__card--active' : ''}`}
            >
              {/* Top row: head (left) + now-playing (right) */}
              <div className="listen__card-top">
                <div className="listen__card-head">
                  <div className="listen__card-logo">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="listen__card-logo-dark"
                      src={ch.logoDark}
                      alt={ch.name}
                      width={64}
                      height={64}
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="listen__card-logo-light"
                      src={ch.logoLight || ch.logoDark}
                      alt=""
                      width={64}
                      height={64}
                      aria-hidden="true"
                    />
                  </div>
                  <div className="listen__card-info">
                    <span className="listen__card-name">{ch.name}</span>
                    <span className="listen__card-freq">{ch.frequency}</span>
                    <span className="listen__card-tagline">{ch.tagline}</span>
                  </div>
                </div>

                <div className="listen__now-playing" aria-live="polite">
                  <span className="listen__np-label">
                    <span className="listen__np-dot" />
                    Now Playing
                  </span>
                  {np ? (
                    <span className="listen__np-track">
                      {np.artist ? `${np.artist} — ${np.title}` : np.title}
                    </span>
                  ) : (
                    <span className="listen__np-track listen__np-track--empty">
                      Fetching...
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="listen__card-actions">
                <button
                  type="button"
                  className={`listen__play-btn${isActive ? ' listen__play-btn--active' : ''}`}
                  onClick={() => handlePlay(ch)}
                  style={{ '--channel-color': ch.color } as React.CSSProperties}
                >
                  {isActive ? (
                    <>
                      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="6" y="4" width="4" height="16" rx="1" />
                        <rect x="14" y="4" width="4" height="16" rx="1" />
                      </svg>
                      Pause
                    </>
                  ) : (
                    <>
                      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      Listen Live
                    </>
                  )}
                </button>
                <a
                  href={ch.consoleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="listen__popup-btn"
                >
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" x2="21" y1="14" y2="3" />
                  </svg>
                  Open Player
                  <span className="sr-only">(opens in new tab)</span>
                </a>
              </div>

              {/* Inline player (iframe) */}
              {isActive && (
                <div className="listen__player">
                  <iframe
                    src={ch.consoleUrl}
                    title={`${ch.name} Player`}
                    className="listen__iframe"
                    allow="autoplay"
                  />
                </div>
              )}
            </div>
          )
        })}
        </div>
      </div>

      {/* About section */}
      <div className="listen__about">
        <h2 className="listen__about-title">About Golden West Broadcasting</h2>
        <p className="listen__about-desc">
          Golden West Broadcasting serves Southeast Manitoba with three radio stations
          providing local news, music, and community content. Tune in live online or
          through your radio.
        </p>
      </div>
    </div>
  )
}
