import type { JSX } from 'react';

import Link from 'next/link';

import { Container } from '@/components/layout/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageLayout } from '@/components/layout/PageLayout';

/**
 * Terms and conditions page outlining rules, disclaimers, and usage guidelines.
 *
 * @returns {JSX.Element} Terms and conditions page
 */
export default function TermsPage(): JSX.Element {
  return (
    <PageLayout>
      <Container>
        <PageHeader title="Terms &amp; Conditions" description="Last updated: June 5, 2026" />

        <div className="text-foreground/80 mt-10 space-y-6 leading-relaxed">
          <section>
            <h2 className="text-foreground mb-3 text-xl font-semibold">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Kabir Dohe Hub (&ldquo;the Website&rdquo;), you agree to be bound by these Terms
              &amp; Conditions. If you do not agree, please do not use the Website.
            </p>
          </section>

          <section>
            <h2 className="text-foreground mb-3 text-xl font-semibold">2. Content Usage</h2>
            <p>
              All content on the Website — including couplets, translations, interpretations, and commentary — is
              provided for educational, spiritual, and personal enrichment purposes. You may:
            </p>
            <ul className="text-muted-foreground mt-2 list-disc space-y-1 pl-6">
              <li>Read, share, and reference the couplets for non-commercial purposes</li>
              <li>Link to the Website or individual couplet pages</li>
            </ul>
            <p className="mt-2">
              You may <strong>not</strong> reproduce, distribute, or modify substantial portions of the content for
              commercial use without prior written permission.
            </p>
          </section>

          <section>
            <h2 className="text-foreground mb-3 text-xl font-semibold">3. Accuracy of Content</h2>
            <p>
              We strive to ensure the translations and interpretations of Kabir&rsquo;s dohas are accurate and faithful
              to the original texts. However, we make no warranties regarding the completeness, reliability, or accuracy
              of the content. The couplets and their meanings are presented for contemplative and educational purposes.
            </p>
          </section>

          <section>
            <h2 className="text-foreground mb-3 text-xl font-semibold">4. Intellectual Property</h2>
            <p>
              The Kabir couplets themselves are part of the public domain. The specific translations, commentary,
              website design, and original written content are the intellectual property of Kabir Dohe Hub unless
              otherwise attributed.
            </p>
          </section>

          <section>
            <h2 className="text-foreground mb-3 text-xl font-semibold">5. User Conduct</h2>
            <p>When using the Website, you agree not to:</p>
            <ul className="text-muted-foreground mt-2 list-disc space-y-1 pl-6">
              <li>Use the site for any unlawful purpose</li>
              <li>Attempt to disrupt or compromise the Website&rsquo;s functionality</li>
              <li>Scrape, harvest, or systematically extract content without permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-foreground mb-3 text-xl font-semibold">6. Disclaimer of Warranties</h2>
            <p>
              The Website is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. We make no
              representations or warranties of any kind, express or implied, regarding the operation or availability of
              the Website.
            </p>
          </section>

          <section>
            <h2 className="text-foreground mb-3 text-xl font-semibold">7. Limitation of Liability</h2>
            <p>
              Kabir Dohe Hub shall not be liable for any direct, indirect, incidental, or consequential damages arising
              from your use of or inability to use the Website.
            </p>
          </section>

          <section>
            <h2 className="text-foreground mb-3 text-xl font-semibold">8. Third-Party Links</h2>
            <p>
              The Website may contain links to third-party websites (e.g., Wikipedia). We are not responsible for the
              content, privacy policies, or practices of these external sites.
            </p>
          </section>

          <section>
            <h2 className="text-foreground mb-3 text-xl font-semibold">9. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Changes will be posted on this page with an
              updated date. Continued use of the Website after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-foreground mb-3 text-xl font-semibold">10. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India, without regard to its
              conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-foreground mb-3 text-xl font-semibold">11. Contact</h2>
            <p>
              For questions about these Terms, please reach out through our{' '}
              <Link
                href="/"
                className="text-primary underline decoration-transparent transition-colors duration-200 hover:decoration-current"
              >
                contact page
              </Link>
              .
            </p>
          </section>
        </div>
      </Container>
    </PageLayout>
  );
}
