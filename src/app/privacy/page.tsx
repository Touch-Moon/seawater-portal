import ListPageLayout from '@/components/layout/ListPageLayout'
import SidebarPanels from '@/components/layout/SidebarPanels'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — SteinbachOnline',
  description: 'Privacy policy for SteinbachOnline. Learn how we collect, use, and protect your personal information.',
}

export default function PrivacyPage() {
  return (
    <ListPageLayout
      sidebar={<SidebarPanels desktop />}
      mobileSidebar={<SidebarPanels />}
    >
      <div className="static-page">
        <div className="static-page__header">
          <h1 className="static-page__title">Privacy Policy</h1>
          <p className="static-page__subtitle">How we handle your information</p>
        </div>

        <div className="static-page__body">
          <p>
            SteinbachOnline (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when
            you visit our website steinbachonline.com.
          </p>

          <h2>Information We Collect</h2>
          <h3>Automatically Collected Information</h3>
          <p>
            When you visit our site, we automatically collect certain information about your device, including
            your IP address, browser type, operating system, referring URLs, and pages viewed. This data helps
            us understand how visitors use our site and improve the user experience.
          </p>

          <h3>Information You Provide</h3>
          <p>
            We may collect personal information that you voluntarily provide, such as your name and email
            address when you subscribe to our newsletter, submit a contact form, or submit a news tip.
          </p>

          <h2>How We Use Your Information</h2>
          <ul>
            <li>Deliver and improve our news content and services</li>
            <li>Send newsletters and updates you have subscribed to</li>
            <li>Respond to your inquiries and requests</li>
            <li>Analyze website usage to improve user experience</li>
            <li>Display relevant advertising</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2>Cookies and Tracking</h2>
          <p>
            We use cookies and similar tracking technologies to enhance your browsing experience. Cookies are
            small data files stored on your device. You can control cookie settings through your browser
            preferences. Disabling cookies may affect some site functionality.
          </p>
          <p>
            We use Google Analytics to analyze website traffic. Google Analytics uses cookies to collect
            anonymous usage data. You can opt out of Google Analytics by installing the{' '}
            <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
              Google Analytics Opt-out Browser Add-on
              <span className="sr-only">(opens in new tab)</span>
            </a>.
          </p>

          <h2>Third-Party Advertising</h2>
          <p>
            We may display advertisements from third-party ad networks. These networks may use cookies and
            similar technologies to serve ads based on your browsing activity. We do not control these
            third-party cookies.
          </p>

          <h2>Data Sharing</h2>
          <p>
            We do not sell, trade, or rent your personal information to third parties. We may share
            information with trusted service providers who assist in operating our website, conducting our
            business, or serving our users, so long as those parties agree to keep this information
            confidential.
          </p>

          <h2>Data Security</h2>
          <p>
            We implement reasonable security measures to protect your personal information. However, no
            method of transmission over the Internet or electronic storage is 100% secure, and we cannot
            guarantee absolute security.
          </p>

          <h2>Children&apos;s Privacy</h2>
          <p>
            Our website is not intended for children under 13 years of age. We do not knowingly collect
            personal information from children under 13. If you believe we have collected information from
            a child under 13, please contact us immediately.
          </p>

          <h2>Your Rights</h2>
          <p>
            You have the right to access, correct, or delete your personal information. To exercise these
            rights, please contact us using the information provided on our Contact page.
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Changes will be posted on this page with
            an updated revision date. We encourage you to review this policy periodically.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us at{' '}
            <a href="mailto:news@steinbachonline.com">news@steinbachonline.com</a> or
            call <a href="tel:204-326-3737">204-326-3737</a>.
          </p>
        </div>

        <div className="static-page__updated">
          Last updated: March 2026
        </div>
      </div>
    </ListPageLayout>
  )
}
