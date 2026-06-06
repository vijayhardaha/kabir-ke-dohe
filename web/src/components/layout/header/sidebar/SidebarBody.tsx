'use client';

import type { JSX } from 'react';

import { MAIN_MENU } from '@/constants/navigation';

import { MobileNavItem } from './MobileNavItem';

/**
 * Props for the SidebarBody component.
 *
 * @type {SidebarBodyProps}
 * @property {string} pathname - Current URL pathname for active state detection.
 * @property {() => void} onItemClick - Callback fired when a nav item is clicked.
 */
interface SidebarBodyProps {
  pathname: string;
  onItemClick: () => void;
}

/**
 * Mobile sidebar body with scrollable navigation list.
 *
 * @param {SidebarBodyProps} props - Component props.
 *
 * @returns {JSX.Element} Sidebar body component.
 */
export function SidebarBody({ pathname, onItemClick }: SidebarBodyProps): JSX.Element {
  return (
    <div className="flex-1 overflow-y-auto px-8 py-6">
      <nav aria-label="Mobile navigation">
        <ul className="flex flex-col gap-1">
          {MAIN_MENU.map((link) => (
            <MobileNavItem key={link.href} link={link} pathname={pathname} onItemClick={onItemClick} />
          ))}
        </ul>
      </nav>
    </div>
  );
}
