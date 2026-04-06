import Link from 'next/link'

const CHANNELS = [
  {
    id: 'am1250',
    logo: '/logo-am1250-light.svg',
    alt: 'AM 1250 Radio',
    href: '/listen/am1250',
    bg: '#1a4bb5',
  },
  {
    id: 'mix967',
    logo: '/logo-mix967-light.svg',
    alt: 'MIX 96.7 FM',
    href: '/listen/mix967',
    bg: '#1565d8',
  },
  {
    id: 'country1077',
    logo: '/logo-country107-light.svg',
    alt: 'Country 107.7',
    href: '/listen/country1077',
    bg: '#1a1a1a',
  },
  {
    id: 'podcastville',
    logo: '/radio4-podcastville.svg',
    alt: 'Podcastville',
    href: '/listen/podcastville',
    bg: '#3b1a5c',
  },
]

export default function ListenPanel() {
  return (
    <div className="listen-panel panel">

      {/* ── Header ── */}
      <div className="listen-panel__header">
        <Link href="/listen" className="listen-panel__title-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <span className="listen-panel__icon" aria-hidden="true">
            <img src="/icon-listen.svg" width={40} height={40} alt="" />
          </span>
          <div className="listen-panel__title-link">
            Listen
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" >
              <path d="M7 4l5 5-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </Link>
      </div>

      {/* ── 2×2 channel grid ── */}
      <div className="listen-panel__grid">
        {CHANNELS.map((ch) => (
          <Link
            key={ch.id}
            href={ch.href}
            className="listen-panel__tile"
            style={{ backgroundColor: ch.bg }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="listen-panel__logo"
              src={ch.logo}
              alt={ch.alt}
              loading="lazy"
            />
          </Link>
        ))}
      </div>

    </div>
  )
}
