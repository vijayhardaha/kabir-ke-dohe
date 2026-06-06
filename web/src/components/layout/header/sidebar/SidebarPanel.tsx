'use client';

import type { JSX, ReactNode, RefObject } from 'react';

import { cn } from '@/lib/utils/cn';

/**
 * Props for the SidebarPanel component.
 *
 * @type {SidebarPanelProps}
 * @property {boolean} open - Whether the panel is visible (slides in from right).
 * @property {RefObject<HTMLDivElement | null>} ref - Ref for the panel element.
 * @property {ReactNode} children - Panel content (header, body, footer).
 */
interface SidebarPanelProps {
  open: boolean;
  ref: RefObject<HTMLDivElement | null>;
  children: ReactNode;
}

/**
 * Mobile sidebar panel with slide-in animation, dialog role, and a11y attributes.
 *
 * @param {SidebarPanelProps} props - Component props.
 *
 * @returns {JSX.Element} Sidebar panel component.
 */
export function SidebarPanel({ open, ref, children }: SidebarPanelProps): JSX.Element {
  return (
    <div
      ref={ref}
      className={cn(
        'fixed top-0 right-0 z-50 flex h-full w-full max-w-sm flex-col bg-white shadow-xl transition-transform duration-300 ease-in-out md:hidden',
        open ? 'translate-x-0' : 'translate-x-full'
      )}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
    >
      {children}
    </div>
  );
}
