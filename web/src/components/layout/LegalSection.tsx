import type { JSX, ReactNode } from 'react';

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
 * Provides a consistent closing section with links to social media.
 *
 * @returns {JSX.Element} Contact section component.
 */
export function ContactSection(): JSX.Element {
  return (
    <section>
      <h2 className="text-foreground mb-3 text-xl font-semibold">{'Contact'}</h2>
      <p>
        If you have questions, feel free to reach out through our social media channels —{' '}
        <a
          href="https://www.facebook.com/kabirkedohe.official"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline decoration-transparent transition-colors duration-200 hover:decoration-current"
        >
          Facebook
        </a>{' '}
        or{' '}
        <a
          href="https://www.instagram.com/kabirkedohe.official"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline decoration-transparent transition-colors duration-200 hover:decoration-current"
        >
          Instagram
        </a>
        .
      </p>
    </section>
  );
}
