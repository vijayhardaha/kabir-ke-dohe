import type { JSX } from 'react';

import Link from 'next/link';

import { Container } from '@/components/layout/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageLayout } from '@/components/layout/PageLayout';

/**
 * Privacy policy page explaining data collection, usage, and user rights.
 *
 * @returns {JSX.Element} Privacy policy page
 */
export default function PrivacyPage(): JSX.Element {
  return (
    <PageLayout>
      <Container>
        <PageHeader title="Privacy Policy" description="Last updated: June 5, 2026" />

        <div className="text-foreground/80 mt-10 space-y-6 leading-relaxed">
          <section>
            <h2 className="text-foreground mb-3 text-xl font-semibold">1. Introduction</h2>
            <p>
              Kabir Dohe Hub (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting your
              privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when
              you visit our website.
            </p>
          </section>

          <section>
            <h2 className="text-foreground mb-3 text-xl font-semibold">2. Information We Collect</h2>
            <p>We collect minimal information necessary to provide and improve our service:</p>
            <ul className="text-muted-foreground mt-2 list-disc space-y-1 pl-6">
              <li>
                <strong className="text-foreground">Usage Data:</strong> Anonymous page views and interaction data
                collected via cookies or similar technologies to understand how our site is used.
              </li>
              <li>
                <strong className="text-foreground">Device Information:</strong> Browser type, operating system, and
                referring URLs — standard data sent by your browser.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-foreground mb-3 text-xl font-semibold">3. How We Use Your Information</h2>
            <p>The information we collect helps us to:</p>
            <ul className="text-muted-foreground mt-2 list-disc space-y-1 pl-6">
              <li>Operate, maintain, and improve our website</li>
              <li>Analyze usage patterns to enhance user experience</li>
              <li>Detect and prevent technical issues or abuse</li>
            </ul>
          </section>

          <section>
            <h2 className="text-foreground mb-3 text-xl font-semibold">4. Cookies</h2>
            <p>
              We may use essential cookies required for the basic functioning of the site. We do not use tracking
              cookies for advertising purposes. You can control cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-foreground mb-3 text-xl font-semibold">5. Third-Party Services</h2>
            <p>
              We do not sell, trade, or transfer your personal information to third parties. We may share anonymous,
              aggregate data with analytics providers to understand site usage. These providers are contractually bound
              to protect your data.
            </p>
          </section>

          <section>
            <h2 className="text-foreground mb-3 text-xl font-semibold">6. Data Security</h2>
            <p>
              We implement reasonable security measures to protect your information. However, no method of transmission
              over the Internet is completely secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-foreground mb-3 text-xl font-semibold">7. Your Rights</h2>
            <p>Depending on your jurisdiction, you may have the right to:</p>
            <ul className="text-muted-foreground mt-2 list-disc space-y-1 pl-6">
              <li>Access the personal data we hold about you</li>
              <li>Request correction or deletion of your data</li>
              <li>Opt out of analytics tracking</li>
            </ul>
          </section>

          <section>
            <h2 className="text-foreground mb-3 text-xl font-semibold">8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
              policy on this page with an updated date.
            </p>
          </section>

          <section>
            <h2 className="text-foreground mb-3 text-xl font-semibold">9. Contact</h2>
            <p>
              If you have questions about this Privacy Policy, please reach out through our{' '}
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
