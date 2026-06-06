'use client';

import type { JSX, ReactNode } from 'react';

import Link from 'next/link';

import { cn } from '@/lib/utils/cn';

/**
 * Props for the DesktopNavLink component.
 *
 * @type {DesktopNavLinkProps}
 * @property {string} href - Link destination.
 * @property {string} label - Link text.
 * @property {boolean} isActive - Whether this link matches the current route.
 * @property {string} base - Base classes applied in both states.
 * @property {string} active - Additional classes when isActive is true.
 * @property {string} inactive - Additional classes when isActive is false.
 * @property {ReactNode} [children] - Optional icon or suffix rendered after the label.
 * @property {() => void} [onClick] - Optional click handler (used by mobile nav to close sidebar).
 */
interface DesktopNavLinkProps {
  href: string;
  label: string;
  isActive: boolean;
  base: string;
  active: string;
  inactive: string;
  children?: ReactNode;
  onClick?: () => void;
}

/**
 * Shared navigation link component (used in both desktop and mobile nav).
 * Reduces repetitive `cn()` patterns by accepting
 * base, active, and inactive class strings as props.
 *
 * @param {DesktopNavLinkProps} props - Component props.
 *
 * @returns {JSX.Element} Nav link.
 */
export function DesktopNavLink({
  href,
  label,
  isActive,
  base,
  active,
  inactive,
  children,
  onClick,
}: DesktopNavLinkProps): JSX.Element {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn('no-underline transition-colors duration-200', base, isActive ? active : inactive)}
    >
      {label}
      {children}
    </Link>
  );
}
