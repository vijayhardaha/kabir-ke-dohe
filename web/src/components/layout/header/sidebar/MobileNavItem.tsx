'use client';

import { useState, type JSX } from 'react';

import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils/cn';

import { DesktopNavLink } from '../DesktopNavLink';

/**
 * Props for the MobileNavItem component.
 *
 * @type {MobileNavItemProps}
 * @property {{ href: string; label: string; children?: Array<{ href: string; label: string }> }} link - The nav link data.
 * @property {string} pathname - Current URL pathname for active state detection.
 * @property {() => void} onItemClick - Callback fired when a leaf item is clicked.
 */
interface MobileNavItemProps {
  link: { href: string; label: string; children?: Array<{ href: string; label: string }> };
  pathname: string;
  onItemClick: () => void;
}

/**
 * A single mobile navigation item, supporting submenu toggle.
 * Items with children show a chevron icon that expands/collapses sub-items.
 *
 * @param {MobileNavItemProps} props - Component props.
 *
 * @returns {JSX.Element} Mobile nav item component.
 */
export function MobileNavItem({ link, pathname, onItemClick }: MobileNavItemProps): JSX.Element {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const hasChildren = !!link.children?.length;
  const isActive =
    pathname === link.href
    || (link.href !== '/' && pathname.startsWith(link.href))
    || (hasChildren && (link.children?.some((child) => pathname === child.href) ?? false));

  /**
   * Toggles the submenu open/closed.
   */
  function toggleSubmenu(): void {
    setSubmenuOpen((prev) => !prev);
  }

  return (
    <li>
      <div className="border-border flex items-center justify-between border-b">
        <DesktopNavLink
          href={link.href}
          label={link.label}
          isActive={isActive}
          base="block w-full py-3 text-sm font-medium"
          active="text-primary"
          inactive="text-muted-foreground"
          onClick={onItemClick}
        />
        {hasChildren && (
          <button
            onClick={toggleSubmenu}
            className="text-muted-foreground hover:text-primary flex h-8 w-8 cursor-pointer items-center justify-center transition-colors duration-200"
            aria-label={submenuOpen ? `Collapse ${link.label} submenu` : `Expand ${link.label} submenu`}
            aria-expanded={submenuOpen}
          >
            <ChevronDown size={14} className={cn('transition-transform duration-200', submenuOpen && 'rotate-180')} />
          </button>
        )}
      </div>

      {/* Submenu items */}
      {hasChildren && submenuOpen && (
        <ul className="mt-3 flex flex-col gap-1 pl-4">
          {link.children?.map((child) => {
            const isChildActive = pathname === child.href;
            return (
              <li key={child.href}>
                <DesktopNavLink
                  href={child.href}
                  label={child.label}
                  isActive={isChildActive}
                  base="border-border block w-full border-b py-1.5 text-sm"
                  active="text-primary font-semibold"
                  inactive="text-muted-foreground"
                  onClick={onItemClick}
                />
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}
