import { type JSX, type ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

/**
 * Layout container that constrains content to a max‑width and applies
 * consistent horizontal padding.
 *
 * @param {{ children: ReactNode; className?: string }} props - Component props
 * @param {ReactNode} props.children - Child content to render inside the container
 * @param {string} [props.className] - Additional CSS classes
 *
 * @returns {JSX.Element} Container component
 */
export function Container({ children, className }: { children: ReactNode; className?: string }): JSX.Element {
  return (
    <div
      className={cn(
        // Layout
        'mx-auto max-w-7xl px-4',
        // Responsive
        'md:px-6',
        // Extensible
        className
      )}
    >
      {children}
    </div>
  );
}
