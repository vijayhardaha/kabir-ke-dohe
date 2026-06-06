'use client';

import type { JSX, ReactNode } from 'react';

/**
 * Props for the SidebarHeaderBar component.
 *
 * @type {SidebarHeaderBarProps}
 * @property {ReactNode} children - Content rendered inside the bar (logo + close button).
 */
interface SidebarHeaderBarProps {
  children: ReactNode;
}

/**
 * Sidebar header bar container with primary background and flex layout.
 *
 * @param {SidebarHeaderBarProps} props - Component props.
 *
 * @returns {JSX.Element} Sidebar header bar.
 */
export function SidebarHeaderBar({ children }: SidebarHeaderBarProps): JSX.Element {
  return (
    <div className="bg-primary text-primary-foreground flex h-20 shrink-0 items-center justify-between px-8">
      {children}
    </div>
  );
}
