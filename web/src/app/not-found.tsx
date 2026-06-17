import type { JSX } from 'react';

import { webPageSchema } from '@vijayhardaha/schema-builder';
import { JsonLd } from '@vijayhardaha/schema-builder/react';
import type { Metadata } from 'next';

import { Container } from '@/components/layout/Container';
import { PageLayout } from '@/components/layout/PageLayout';
import { ButtonLink } from '@/components/ui/Button';
import { buildMetadata } from '@/lib/utils/meta';
import { globalSchema } from '@/lib/utils/schema';
import { siteUrl } from '@/lib/utils/seo';

/** SEO metadata for the page. */
export const metadata: Metadata = buildMetadata({
  title: '404 - Page Not Found',
  description: 'The requested page could not be found.',
  path: '404',
});

// ── Schema (JSON-LD) ──────────────────────────────────────────────────────

const rootUrl = siteUrl();
const notFoundSchema = [
  ...globalSchema(),
  webPageSchema(
    { rootUrl, path: '404' },
    { name: 'Page Not Found — Kabir Ke Dohe', description: 'The requested page could not be found.' }
  ),
];

/**
 * Custom 404 page displayed when a route does not match any known page.
 *
 * @returns {JSX.Element} The 404 not-found page.
 */
export default function NotFound(): JSX.Element {
  return (
    <>
      <JsonLd data={notFoundSchema} />
      <PageLayout>
        <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
          <p className="text-primary text-8xl font-bold">404</p>
          <h1 className="text-foreground mt-4 text-2xl">Page Not Found</h1>
          <p className="text-muted-foreground mt-2 max-w-md">
            The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved.
          </p>
          <div className="mt-8">
            <ButtonLink variant="primary" size="lg" href="/">
              Back to Home
            </ButtonLink>
          </div>
        </Container>
      </PageLayout>
    </>
  );
}
