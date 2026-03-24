import ListPageLayout from '@/components/layout/ListPageLayout'
import SidebarPanels from '@/components/layout/SidebarPanels'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us — SteinbachOnline',
  description: 'Get in touch with the SteinbachOnline team. Reach us by phone, email, or visit our office in Steinbach, Manitoba.',
}

export default function ContactPage() {
  return (
    <ListPageLayout
      sidebar={<SidebarPanels desktop />}
      mobileSidebar={<SidebarPanels />}
    >
      <div className="static-page">
        <div className="static-page__header">
          <h1 className="static-page__title">Contact Us</h1>
          <p className="static-page__subtitle">We&apos;d love to hear from you</p>
        </div>

        <div className="static-page__body">
          <p>
            Have a news tip, event submission, question, or feedback? Reach out to us using the form
            below or through any of our contact channels. Our team typically responds within one business day.
          </p>
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
          <form className="static-page__form" aria-label="Contact form" action="#" method="POST">
            <div className="static-page__field">
              <label className="static-page__label" htmlFor="contact-name">Name</label>
              <input className="static-page__input" type="text" id="contact-name" name="name" placeholder="Your full name" />
            </div>
            <div className="static-page__field">
              <label className="static-page__label" htmlFor="contact-email">Email</label>
              <input className="static-page__input" type="email" id="contact-email" name="email" placeholder="your@email.com" />
            </div>
            <div className="static-page__field">
              <label className="static-page__label" htmlFor="contact-subject">Subject</label>
              <input className="static-page__input" type="text" id="contact-subject" name="subject" placeholder="What is this about?" />
            </div>
            <div className="static-page__field">
              <label className="static-page__label" htmlFor="contact-message">Message</label>
              <textarea className="static-page__textarea" id="contact-message" name="message" placeholder="Your message..." />
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
