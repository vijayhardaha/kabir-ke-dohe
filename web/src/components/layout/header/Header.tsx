'use client';

import { useCallback, useEffect, useRef, useState, type JSX } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Container } from '@/components/layout/Container';
import { cn } from '@/lib/utils/cn';

import { DesktopNav } from './DesktopNav';
import { MobileToggle } from './MobileToggle';
import { SearchIcon } from './SearchIcon';
import { Sidebar } from './sidebar/Sidebar';

/**
 * Header component with auto‑hide on scroll down and reveal on scroll up.
 * Sticky positioned with a smooth slide transition.
 * Mobile menu opens as a full-height sidebar with header, body, and footer sections.
 *
 * @returns {JSX.Element} Header component
 */
export function Header(): JSX.Element {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  // ---- Scroll hide/show logic ----
  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;

          if (currentY > 50) {
            if (currentY > lastScrollY.current) {
              setHidden(true);
            } else {
              setHidden(false);
            }
          } else {
            setHidden(false);
          }

          lastScrollY.current = currentY;
          ticking.current = false;
        });

        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /**
   * Closes the mobile sidebar.
   */
  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  return (
    <>
      <header
        className={cn(
          // Layout
          'sticky top-0 z-20',
          // Colors — primary bg, primary-foreground text
          'bg-primary text-primary-foreground',
          // Slide animation
          'transition-transform duration-300',
          // Hidden state — slide up out of view
          hidden ? '-translate-y-full' : 'translate-y-0'
        )}
      >
        <Container>
          <div className="flex h-20 items-center justify-between gap-3">
            <Link href="/" className="flex shrink-0 items-center text-white no-underline">
              <Image src="/logo.svg" alt="Kabir Dohe Hub" width={140} height={32} className="h-8 w-auto" priority />
            </Link>

            {/* Desktop nav */}
            <DesktopNav pathname={pathname} />

            {/* Search icon + mobile toggle */}
            <div className="flex items-center gap-2">
              <SearchIcon />
              <MobileToggle open={menuOpen} onToggle={() => setMenuOpen(!menuOpen)} />
            </div>
          </div>
        </Container>
      </header>

      {/* Mobile sidebar */}
      <Sidebar open={menuOpen} onClose={closeMenu} pathname={pathname} />
    </>
  );
}
