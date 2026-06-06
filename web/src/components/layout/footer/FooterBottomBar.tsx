import type { JSX } from 'react';

import Link from 'next/link';

import { Container } from '@/components/layout/Container';

/**
 * Footer bottom bar with copyright and legal links.
 *
 * @returns {JSX.Element} Footer bottom bar component.
 */
export function FooterBottomBar(): JSX.Element {
  const currentYear = new Date().getFullYear();

  return (
    <div className="border-t border-white/10">
      <Container className="py-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-secondary-foreground/60 text-sm">
            &copy; {currentYear} Kabir Dohe Hub. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="text-secondary-foreground/60 text-sm no-underline transition-colors duration-200 hover:text-white"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-secondary-foreground/60 text-sm no-underline transition-colors duration-200 hover:text-white"
            >
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
        <p className="text-secondary-foreground/50 mt-4 text-left text-xs">
          Built and actively maintained by{' '}
          <a
            href="https://github.com/vijayhardaha"
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary-foreground/60 underline transition-colors duration-200 hover:text-white"
          >
            Vijay Hardaha
          </a>
        </p>
      </Container>
    </div>
  );
}
