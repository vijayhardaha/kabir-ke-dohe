'use client';

import type { JSX } from 'react';

import { RiMenu3Line } from 'react-icons/ri';

/**
 * Props for the MobileToggle component.
 *
 * @type {MobileToggleProps}
 * @property {boolean} open - Whether the mobile sidebar is currently open.
 * @property {() => void} onToggle - Callback fired when the toggle button is clicked.
 */
interface MobileToggleProps {
  open: boolean;
  onToggle: () => void;
}

/**
 * Mobile hamburger menu toggle button displayed in the header.
 * Visible only on small screens (`md:hidden`).
 *
 * @param {MobileToggleProps} props - Component props.
 *
 * @returns {JSX.Element} Mobile toggle button.
 */
export function MobileToggle({ open, onToggle }: MobileToggleProps): JSX.Element {
  return (
    <button
      onClick={onToggle}
      className="text-primary-foreground flex h-9 w-9 cursor-pointer items-center justify-center transition-colors duration-200 hover:bg-black/15 md:hidden"
      aria-label={open ? 'Close menu' : 'Open menu'}
    >
      <RiMenu3Line size={22} />
    </button>
  );
}
