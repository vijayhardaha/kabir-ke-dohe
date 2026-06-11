'use client';

import type { JSX } from 'react';

import { RiCloseLine } from 'react-icons/ri';

/**
 * Props for the SidebarCloseButton component.
 *
 * @type {SidebarCloseButtonProps}
 * @property {() => void} onClose - Callback fired when the button is clicked.
 */
interface SidebarCloseButtonProps {
  onClose: () => void;
}

/**
 * Close button for the mobile sidebar with icon and hover effect.
 *
 * @param {SidebarCloseButtonProps} props - Component props.
 *
 * @returns {JSX.Element} Close button component.
 */
export function SidebarCloseButton({ onClose }: SidebarCloseButtonProps): JSX.Element {
  return (
    <button
      onClick={onClose}
      className="text-primary-foreground flex h-10 w-10 cursor-pointer items-center justify-center transition-colors duration-200 hover:bg-black/15"
      aria-label="Close menu"
    >
      <RiCloseLine size={22} />
    </button>
  );
}
