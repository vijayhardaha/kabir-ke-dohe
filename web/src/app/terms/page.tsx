import type { JSX } from 'react';

import { JsonLd } from '@vijayhardaha/schema-builder/react';

import { Container } from '@/components/layout/Container';
import { ContactSection, LegalSection } from '@/components/layout/LegalSection';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageLayout } from '@/components/layout/PageLayout';

import { PAGE_SCHEMA } from './_config';

export { metadata } from './_config';

/**
 * Terms and conditions page outlining rules, disclaimers, and usage guidelines.
 *
 * @returns {JSX.Element} Terms and conditions page
 */
export default function TermsPage(): JSX.Element {
  return (
    <>
      <JsonLd data={PAGE_SCHEMA} />
      <PageLayout>
        <Container>
          <PageHeader title="Terms &amp; Conditions" description="Last updated: June 5, 2026" />

          <div className="mt-10 space-y-6 leading-relaxed">
            <LegalSection title="1. Acceptance of Terms">
              <p>
                By accessing or using Kabir Dohe Hub (&ldquo;the Website&rdquo;), you agree to be bound by these Terms
                &amp; Conditions. If you do not agree, please do not use the Website.
              </p>
            </LegalSection>

            <LegalSection title="2. Content Usage">
              <p>
                All content on the Website — including couplets, translations, interpretations, and commentary — is
                provided for educational, spiritual, and personal enrichment purposes. You may:
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-6">
                <li>Read, share, and reference the couplets for non-commercial purposes</li>
                <li>Link to the Website or individual couplet pages</li>
              </ul>
              <p className="mt-2">
                You may <strong>not</strong> reproduce, distribute, or modify substantial portions of the content for
                commercial use without prior written permission.
              </p>
            </LegalSection>

            <LegalSection title="3. Accuracy of Content">
              <p>
                We strive to ensure the translations and interpretations of Kabir&rsquo;s dohas are accurate and
                faithful to the original texts. However, we make no warranties regarding the completeness, reliability,
                or accuracy of the content. The couplets and their meanings are presented for contemplative and
                educational purposes.
              </p>
            </LegalSection>

            <LegalSection title="4. Intellectual Property">
              <p>
                The Kabir couplets themselves are part of the public domain. The specific translations, commentary,
                website design, and original written content are the intellectual property of Kabir Dohe Hub unless
                otherwise attributed.
              </p>
            </LegalSection>

            <LegalSection title="5. User Conduct">
              <p>When using the Website, you agree not to:</p>
              <ul className="mt-2 list-disc space-y-1 pl-6">
                <li>Use the site for any unlawful purpose</li>
                <li>Attempt to disrupt or compromise the Website&rsquo;s functionality</li>
                <li>Scrape, harvest, or systematically extract content without permission</li>
              </ul>
            </LegalSection>

            <LegalSection title="6. Disclaimer of Warranties">
              <p>
                The Website is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. We make no
                representations or warranties of any kind, express or implied, regarding the operation or availability
                of the Website.
              </p>
            </LegalSection>

            <LegalSection title="7. Limitation of Liability">
              <p>
                Kabir Dohe Hub shall not be liable for any direct, indirect, incidental, or consequential damages
                arising from your use of or inability to use the Website.
              </p>
            </LegalSection>

            <LegalSection title="8. Third-Party Links">
              <p>
                The Website may contain links to third-party websites (e.g., Wikipedia). We are not responsible for the
                content, privacy policies, or practices of these external sites.
              </p>
            </LegalSection>

            <LegalSection title="9. Changes to Terms">
              <p>
                We reserve the right to modify these Terms at any time. Changes will be posted on this page with an
                updated date. Continued use of the Website after changes constitutes acceptance of the new terms.
              </p>
            </LegalSection>

            <LegalSection title="10. Governing Law">
              <p>
                These Terms shall be governed by and construed in accordance with the laws of India, without regard to
                its conflict of law provisions.
              </p>
            </LegalSection>

            <ContactSection />
          </div>
        </Container>
      </PageLayout>
    </>
  );
}
