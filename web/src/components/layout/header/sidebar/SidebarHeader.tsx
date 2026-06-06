'use client';

import type { JSX } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { SidebarCloseButton } from './SidebarCloseButton';
import { SidebarHeaderBar } from './SidebarHeaderBar';

/**
 * Props for the SidebarHeader component.
 *
 * @type {SidebarHeaderProps}
 * @property {() => void} onClose - Callback fired when the close button is clicked.
 */
interface SidebarHeaderProps {
  onClose: () => void;
}

/**
 * Mobile sidebar header with logo and close button.
 *
 * @param {SidebarHeaderProps} props - Component props.
 *
 * @returns {JSX.Element} Sidebar header component.
 */
export function SidebarHeader({ onClose }: SidebarHeaderProps): JSX.Element {
  return (
    <SidebarHeaderBar>
      <Link href="/" className="flex shrink-0 items-center no-underline" onClick={onClose}>
        <Image
          src="/logo.svg"
          alt="Kabir Dohe Hub"
          width={140}
          height={32}
          className="h-8 w-auto brightness-0 invert"
          priority
        />
      </Link>
      <SidebarCloseButton onClose={onClose} />
    </SidebarHeaderBar>
  );
}
