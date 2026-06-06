import type { JSX, ReactNode } from 'react';

import Link from 'next/link';

/**
 * Props for the LegalSection component.
 *
 * @type {LegalSectionProps}
 * @property {string} title - Section heading text.
 * @property {ReactNode} children - Section content.
 */
interface LegalSectionProps {
  title: string;
  children: ReactNode;
}

/**
 * Reusable legal section wrapper with consistent heading and spacing.
 * Used by privacy policy and terms & conditions pages.
 *
 * @param {LegalSectionProps} props - Component props.
 *
 * @returns {JSX.Element} A legal section with styled heading.
 */
export function LegalSection({ title, children }: LegalSectionProps): JSX.Element {
  return (
    <section>
      <h2 className="text-foreground mb-3 text-xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

/**
 * Shared contact section for legal pages.
 * Provides a consistent closing section with a link to the contact page.
 *
 * @returns {JSX.Element} Contact section component.
 */
export function ContactSection(): JSX.Element {
  return (
    <section>
      <h2 className="text-foreground mb-3 text-xl font-semibold">{'Contact'}</h2>
      <p>
        If you have questions, please reach out through our{' '}
        <Link
          href="/"
          className="text-primary underline decoration-transparent transition-colors duration-200 hover:decoration-current"
        >
          contact page
        </Link>
        .
      </p>
    </section>
  );
}
