'use client';

import type { JSX } from 'react';

import { RiArrowDropDownLine } from 'react-icons/ri';

import { MAIN_MENU } from '@/constants/navigation';

import { DesktopNavLink } from './DesktopNavLink';

/**
 * Props for the DesktopNav component.
 *
 * @type {DesktopNavProps}
 * @property {string} pathname - Current URL pathname for active state detection.
 */
interface DesktopNavProps {
  pathname: string;
}

/**
 * Desktop navigation menu with dropdown submenus.
 *
 * @param {DesktopNavProps} props - Component props.
 *
 * @returns {JSX.Element} Desktop navigation component.
 */
export function DesktopNav({ pathname }: DesktopNavProps): JSX.Element {
  return (
    <nav className="ml-auto hidden h-full md:block" aria-label="Main menu">
      <ul className="flex h-full items-stretch gap-1.5">
        {MAIN_MENU.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
          const hasChildren = !!link.children?.length;

          return (
            <li key={link.href} className="group relative flex h-full items-center">
              <DesktopNavLink
                href={link.href}
                label={link.label}
                isActive={isActive}
                base="inline-flex items-center gap-1 px-2 py-2 text-xs font-medium whitespace-nowrap uppercase lg:px-3 lg:text-sm"
                active="text-primary-foreground bg-black/15"
                inactive="text-primary-foreground hover:text-primary-foreground hover:bg-black/15"
              >
                {hasChildren && (
                  <RiArrowDropDownLine
                    size={20}
                    className="transition-transform duration-200 group-hover:rotate-180"
                    aria-hidden="true"
                  />
                )}
              </DesktopNavLink>
              {/* Dropdown */}
              {hasChildren && (
                <div className="absolute top-full right-0 z-40 hidden w-max min-w-105 bg-white shadow-lg group-hover:block">
                  <ul className="grid grid-cols-3 gap-1 p-2">
                    {link.children?.map((child) => {
                      const isChildActive = pathname === child.href;
                      return (
                        <li key={child.href}>
                          <DesktopNavLink
                            href={child.href}
                            label={child.label}
                            isActive={isChildActive}
                            base="block rounded px-3 py-1.5 text-sm font-medium"
                            active="text-primary"
                            inactive="text-foreground hover:text-primary"
                          />
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
