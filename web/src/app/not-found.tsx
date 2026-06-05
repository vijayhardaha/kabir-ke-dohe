import type { JSX } from 'react';

import { Container } from '@/components/layout/Container';
import { PageLayout } from '@/components/layout/PageLayout';
import { ButtonLink } from '@/components/ui/Button';

/**
 * Custom 404 page displayed when a route does not match any known page.
 *
 * @returns {JSX.Element} The 404 not-found page.
 */
export default function NotFound(): JSX.Element {
  return (
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
  );
}
