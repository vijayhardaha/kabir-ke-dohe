import type { JSX } from 'react';

/**
 * A social media share button rendered as an anchor link.
 *
 * @param {{ href: string; label: string; children: JSX.Element }} props - Button props.
 * @param {string} props.href - The share URL to open.
 * @param {string} props.label - Accessible label for the button.
 * @param {JSX.Element} props.children - SVG path elements for the icon.
 *
 * @returns {JSX.Element} A styled share button link.
 */
export function ShareButton({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: JSX.Element;
}): JSX.Element {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground inline-flex size-10 items-center justify-center transition-colors"
      aria-label={label}
    >
      <span className="flex items-center justify-center" aria-hidden="true">
        {children}
      </span>
    </a>
  );
}
