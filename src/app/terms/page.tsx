import ListPageLayout from '@/components/layout/ListPageLayout'
import SidebarPanels from '@/components/layout/SidebarPanels'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Use — SteinbachOnline',
  description: 'Terms and conditions for using SteinbachOnline. Please read these terms carefully before using our website.',
}

export default function TermsPage() {
  return (
    <ListPageLayout
      sidebar={<SidebarPanels desktop />}
      mobileSidebar={<SidebarPanels />}
    >
      <div className="static-page">
        <div className="static-page__header">
          <h1 className="static-page__title">Terms of Use</h1>
          <p className="static-page__subtitle">Please read these terms carefully</p>
        </div>

        <div className="static-page__body">
          <p>
            These Terms of Use (&quot;Terms&quot;) govern your access to and use of steinbachonline.com
            (&quot;the Site&quot;), operated by Golden West Broadcasting Ltd. (&quot;we,&quot; &quot;us,&quot;
            or &quot;our&quot;). By accessing or using the Site, you agree to be bound by these Terms.
          </p>

          <h2>Use of the Site</h2>
          <p>
            You may use the Site for lawful purposes only. You agree not to use the Site in any way that
            violates applicable laws, regulations, or these Terms. You must not attempt to gain unauthorized
            access to any part of the Site, its servers, or any connected systems.
          </p>

          <h2>Intellectual Property</h2>
          <p>
            All content on this Site, including text, graphics, logos, images, audio, video, and software,
            is the property of Golden West Broadcasting Ltd. or its content suppliers and is protected by
            Canadian and international copyright laws. You may not reproduce, distribute, modify, or create
            derivative works from any content without our prior written consent.
          </p>

          <h2>User Submissions</h2>
          <p>
            By submitting content to SteinbachOnline (including news tips, event listings, classified ads,
            and comments), you grant us a non-exclusive, royalty-free, perpetual license to use, reproduce,
            modify, publish, and distribute such content in any media. You represent that you own or have
            the necessary rights to submit such content.
          </p>

          <h2>News Content</h2>
          <p>
            We strive to provide accurate and up-to-date news content. However, we do not guarantee the
            accuracy, completeness, or timeliness of any information on the Site. News content is provided
            for general informational purposes only and should not be relied upon as the sole basis for
            making decisions.
          </p>

          <h2>Third-Party Links</h2>
          <p>
            The Site may contain links to third-party websites. These links are provided for convenience
            only. We do not endorse or assume responsibility for the content, privacy policies, or practices
            of any third-party websites. Access to third-party sites is at your own risk.
          </p>

          <h2>Advertising</h2>
          <p>
            The Site displays advertisements from third-party advertisers. We are not responsible for the
            content, accuracy, or opinions expressed in advertisements. Inclusion of an advertisement on the
            Site does not constitute endorsement of the advertised product, service, or company.
          </p>

          <h2>Disclaimer of Warranties</h2>
          <p>
            The Site is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any
            kind, either express or implied. We do not warrant that the Site will be uninterrupted,
            error-free, or free of viruses or other harmful components. To the fullest extent permitted
            by law, we disclaim all warranties.
          </p>

          <h2>Limitation of Liability</h2>
          <p>
            In no event shall Golden West Broadcasting Ltd., its officers, directors, employees, or agents
            be liable for any indirect, incidental, special, consequential, or punitive damages arising
            from your use of the Site. Our total liability for any claim arising from the use of the Site
            shall not exceed the amount you paid to access the Site (if any).
          </p>

          <h2>Governing Law</h2>
          <p>
            These Terms are governed by the laws of the Province of Manitoba and the federal laws of Canada
            applicable therein. Any disputes arising from these Terms shall be subject to the exclusive
            jurisdiction of the courts of Manitoba.
          </p>

          <h2>Changes to These Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. Changes will be effective immediately
            upon posting to the Site. Your continued use of the Site after any changes constitutes
            acceptance of the new Terms.
          </p>

          <h2>Contact</h2>
          <p>
            If you have questions about these Terms, please contact us at{' '}
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
