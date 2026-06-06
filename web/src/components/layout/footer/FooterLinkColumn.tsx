import type { JSX } from 'react';

import Link from 'next/link';

/**
 * A single link entry for the footer column.
 *
 * @type {FooterLinkItem}
 * @property {string} href - Link destination.
 * @property {string} label - Link text.
 */
interface FooterLinkItem {
  href: string;
  label: string;
}

/**
 * Props for the FooterLinkColumn component.
 *
 * @type {FooterLinkColumnProps}
 * @property {string} title - Column heading text.
 * @property {FooterLinkItem[]} links - Array of link items.
 */
interface FooterLinkColumnProps {
  title: string;
  links: readonly FooterLinkItem[] | FooterLinkItem[];
}

/**
 * Reusable footer link column with heading and list of links.
 *
 * @param {FooterLinkColumnProps} props - Component props.
 *
 * @returns {JSX.Element} Footer link column.
 */
export function FooterLinkColumn({ title, links }: FooterLinkColumnProps): JSX.Element {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold tracking-wider uppercase">{title}</h3>
      <ul className="flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-secondary-foreground/70 text-sm no-underline transition-colors duration-200 hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
