import Link from 'next/link'
import Image from 'next/image'

// LivePanel — left column: 3 live channel cards
// Same card design as quick-menu__panel--listen
// Server Component

const CHANNELS = [
  {
    id: 'ch1',
    title: 'Steinbach Online Radio',
    subtitle: 'Local News & Talk',
    href: '/listen/radio',
    thumb: '/logo-am1250-dark.svg',
    live: true,
  },
  {
    id: 'ch2',
    title: 'Community Voices',
    subtitle: 'Weekdays 9:00 AM',
    href: '/listen/community',
    thumb: '/logo-mix967-dark.svg',
    live: true,
  },
  {
    id: 'ch3',
    title: 'Farm & Country',
    subtitle: 'Agriculture & Rural Life',
    href: '/listen/farm',
    thumb: '/logo-country107-dark.svg',
    live: false,
  },
]

export default function LivePanel() {
  return (
    <div className="live-panel">
      <div className="live-panel__grid">
        {CHANNELS.map((ch) => (
          <Link key={ch.id} href={ch.href} className="live-panel__card">

            {/* Thumbnail */}
            <div className="live-panel__thumb">
              <Image
                src={ch.thumb}
                alt={ch.title}
                className="live-panel__img"
                width={240}
                height={135}
              />

              {/* Play overlay — red, shows on hover */}
              <span className="live-panel__play" aria-hidden="true">
                <svg aria-hidden="true" width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="20" r="20" fill="rgba(0,0,0,0.45)" />
                  <path d="M17 13l12 7-12 7V13z" fill="#ff2d2d" />
                </svg>
              </span>

              {/* LIVE / Play badge — bottom left */}
              <span className="live-panel__live">
                <svg aria-hidden="true" width="10" height="10" viewBox="0 0 10 10" fill="none" >
                  <path d="M3 2l7 3.5L3 9V2z" fill="currentColor" />
                </svg>
                Play
              </span>
            </div>


          </Link>
        ))}
      </div>
    </div>
  )
}
