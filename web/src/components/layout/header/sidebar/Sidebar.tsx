'use client';

import { useEffect, useRef, type JSX } from 'react';

import { cn } from '@/lib/utils/cn';

import { SidebarBody } from './SidebarBody';
import { SidebarFooter } from './SidebarFooter';
import { SidebarHeader } from './SidebarHeader';
import { SidebarPanel } from './SidebarPanel';

/**
 * Props for the Sidebar component.
 *
 * @type {SidebarProps}
 * @property {boolean} open - Whether the sidebar is open.
 * @property {() => void} onClose - Callback fired when the sidebar should close.
 * @property {string} pathname - Current URL pathname for active state detection.
 */
interface SidebarProps {
  open: boolean;
  onClose: () => void;
  pathname: string;
}

/**
 * Mobile sidebar with overlay, header, body, and footer sections.
 * Handles body scroll lock and escape key dismissal internally.
 *
 * @param {SidebarProps} props - Component props.
 *
 * @returns {JSX.Element} Sidebar component.
 */
export function Sidebar({ open, onClose, pathname }: SidebarProps): JSX.Element {
  const sidebarRef = useRef<HTMLDivElement>(null);

  // ---- Lock body scroll when sidebar is open ----
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // ---- Close on Escape key ----
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={onClose}
      />

      {/* Sidebar panel */}
      <SidebarPanel ref={sidebarRef} open={open}>
        <SidebarHeader onClose={onClose} />
        <SidebarBody pathname={pathname} onItemClick={onClose} />
        <SidebarFooter />
      </SidebarPanel>
    </>
  );
}
