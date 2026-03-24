import Image from 'next/image'
import ListPageLayout from '@/components/layout/ListPageLayout'
import SidebarPanels from '@/components/layout/SidebarPanels'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us — SteinbachOnline',
  description: 'Learn about SteinbachOnline and the team behind your local news source in Steinbach, Manitoba.',
}

const TEAM = [
  { name: 'Corny Rempel',       photo: '/team/corny-rempel.png' },
  { name: 'Carly Koop',         photo: '/team/carly-koop.png' },
  { name: 'Kenton Dyck',        photo: '/team/kenton-dyck.png' },
  { name: 'Shannon Dueck',      photo: '/team/shannon-dueck.png' },
  { name: 'Adi Loewen',         photo: '/team/adi-loewen.png' },
  { name: 'Judy Peters',        photo: '/team/judy-peters.png' },
  { name: 'Dave Anthony',       photo: '/team/dave-anthony.png' },
  { name: 'Darci Wilkinson',    photo: '/team/darci-wilkinson.png' },
  { name: 'Afton Berg',         photo: '/team/afton-berg.png' },
  { name: 'Cosette Bott',       photo: '/team/cosette-bott.png' },
  { name: 'Trev Schellenberg',  photo: '/team/trev-schellenberg.png' },
  { name: 'Chris Sumner',       photo: '/team/chris-sumner.png' },
]

export default function AboutPage() {
  return (
    <ListPageLayout
      sidebar={<SidebarPanels desktop />}
      mobileSidebar={<SidebarPanels />}
    >
      <div className="static-page">
        <div className="static-page__header">
          <h1 className="static-page__title">About SteinbachOnline</h1>
          <p className="static-page__subtitle">Your trusted local news source since 1999</p>
        </div>

        <div className="static-page__body">
          <p>
            SteinbachOnline is Southeast Manitoba&apos;s leading online news source, serving the communities
            of Steinbach, Mitchell, Grunthal, Niverville, and the surrounding region. We are part of the
            Golden West Broadcasting family of media properties, connecting communities across Manitoba.
          </p>
          <p>
            Our media platforms connect with thousands of Manitobans in the Southeast every day. Daily
            on AM 1250, MIX 96.7, and Country 107.7, you&apos;ll hear the best music, all the local
            information you need to know, and conversations with local influencers that are shaping
            the area&apos;s growth. Our team is dedicated to celebrating everything that makes Steinbach
            a terrific place to live, work, and play.
          </p>

          <h2>What We Cover</h2>
          <ul>
            <li><strong>Local News</strong> — Breaking news and stories from Steinbach and Southeast Manitoba</li>
            <li><strong>Sports</strong> — Coverage of local teams, leagues, and sporting events</li>
            <li><strong>Weather</strong> — Current conditions, forecasts, and radar for the region</li>
            <li><strong>Events</strong> — Community events, meetings, and activities calendar</li>
            <li><strong>Business Directory</strong> — Local businesses and services</li>
            <li><strong>Classifieds</strong> — Buy, sell, and find items in your community</li>
          </ul>

          <h2>Golden West Broadcasting</h2>
          <p>
            Golden West Broadcasting Ltd. is a Manitoba-based media company operating radio stations and
            digital news platforms across the province. Founded in the 1950s, Golden West began expansion
            into rural communities with CHSM (AM 1250) in Steinbach in 1964, and later re-entered the
            FM market in 1998 with CILT-FM (MIX 96.7). Today our Steinbach stations include AM 1250,
            MIX 96.7, and Country 107.7, led by President Brett Baranoski and COO Carter Fehr.
          </p>

          <h2 id="accessibility">Accessibility</h2>
          <p>
            SteinbachOnline is committed to ensuring digital accessibility for people of all abilities.
            We continually improve the user experience for everyone by applying relevant accessibility
            standards. Our site supports screen readers, keyboard navigation, and adjustable text sizes.
            If you experience any difficulty accessing our content, please contact us.
          </p>
        </div>

        {/* Team section */}
        <div className="static-page__section">
          <h2 className="static-page__section-title">Meet the Team</h2>
          <div className="static-page__team-grid">
            {TEAM.map(member => (
              <div key={member.name} className="static-page__team-card">
                <div className="static-page__team-avatar">
                  <Image
                    src={member.photo}
                    alt={member.name}
                    width={120}
                    height={120}
                    style={{ objectFit: 'cover', objectPosition: 'top center' }}
                  />
                </div>
                <span className="static-page__team-name">{member.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact info */}
        <div className="static-page__section">
          <h2 className="static-page__section-title">Contact Information</h2>
          <div className="static-page__contact-info">
            <div className="static-page__contact-row">
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <div className="static-page__contact-detail">
                <span className="static-page__contact-label">Address</span>
                <span className="static-page__contact-value">32 Brandt St, Steinbach, MB R5G 1X2</span>
              </div>
            </div>
            <div className="static-page__contact-row">
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <div className="static-page__contact-detail">
                <span className="static-page__contact-label">Phone</span>
                <span className="static-page__contact-value">
                  <a href="tel:204-326-3737">204-326-3737</a>
                </span>
              </div>
            </div>
            <div className="static-page__contact-row">
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <div className="static-page__contact-detail">
                <span className="static-page__contact-label">Email</span>
                <span className="static-page__contact-value">
                  <a href="mailto:news@steinbachonline.com">news@steinbachonline.com</a>
                </span>
              </div>
            </div>
            <div className="static-page__contact-row">
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <div className="static-page__contact-detail">
                <span className="static-page__contact-label">Office Hours</span>
                <span className="static-page__contact-value">Monday – Friday, 8:30 AM – 5:00 PM CST</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact form */}
        <div className="static-page__section">
          <h2 className="static-page__section-title">Send Us a Message</h2>
          <form className="static-page__form" aria-label="Send us a message" action="#" method="POST">
            <div className="static-page__field">
              <label className="static-page__label" htmlFor="about-contact-name">Name</label>
              <input className="static-page__input" type="text" id="about-contact-name" name="name" placeholder="Your full name" autoComplete="name" />
            </div>
            <div className="static-page__field">
              <label className="static-page__label" htmlFor="about-contact-email">Email</label>
              <input className="static-page__input" type="email" id="about-contact-email" name="email" placeholder="your@email.com" autoComplete="email" />
            </div>
            <div className="static-page__field">
              <label className="static-page__label" htmlFor="about-contact-subject">Subject</label>
              <input className="static-page__input" type="text" id="about-contact-subject" name="subject" placeholder="What is this about?" />
            </div>
            <div className="static-page__field">
              <label className="static-page__label" htmlFor="about-contact-message">Message</label>
              <textarea className="static-page__textarea" id="about-contact-message" name="message" placeholder="Your message..." />
            </div>
            <button type="submit" className="static-page__submit">
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
              Send Message
            </button>
          </form>
        </div>
      </div>
    </ListPageLayout>
  )
}
