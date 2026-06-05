import { type JSX, type ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

/**
 * PageLayout component that wraps page content with default vertical padding.
 * Use className to override or extend padding per page.
 *
 * @param {{ children: ReactNode; className?: string }} props - Component props
 * @param {ReactNode} props.children - Page content
 * @param {string} [props.className] - Additional CSS classes (overrides default padding)
 *
 * @returns {JSX.Element} PageLayout component
 */
export function PageLayout({ children, className }: { children: ReactNode; className?: string }): JSX.Element {
  return (
    <div
      className={cn(
        // Default vertical padding
        'py-12',
        // Extensible — pass e.g. "pt-0" to remove top padding
        className
      )}
    >
      {children}
    </div>
  );
}
