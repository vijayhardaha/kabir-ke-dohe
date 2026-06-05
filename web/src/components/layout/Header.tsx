'use client';

import { useEffect, useRef, useState, type JSX } from 'react';

import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiMenu, HiX } from 'react-icons/hi';

import { MAIN_MENU } from '@/constants/navigation';
import { cn } from '@/lib/utils/cn';

import { Container } from './Container';

/**
 * Header component with auto‑hide on scroll down and reveal on scroll up.
 * Sticky positioned with a smooth slide transition.
 *
 * @returns {JSX.Element} Header component
 */
export function Header(): JSX.Element {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;

          // Only react after scrolling past a threshold
          if (currentY > 50) {
            if (currentY > lastScrollY.current) {
              // Scrolling down — hide header
              setHidden(true);
            } else {
              // Scrolling up — show header
              setHidden(false);
            }
          } else {
            // At the top — always show
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

  return (
    <header
      className={cn(
        // Layout
        'sticky top-0 z-50',
        // Colors — primary bg, primary-foreground text
        'bg-primary text-primary-foreground',
        // Slide animation
        'transition-transform duration-300',
        // Hidden state — slide up out of view
        hidden ? '-translate-y-full' : 'translate-y-0'
      )}
    >
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="flex shrink-0 items-center text-white no-underline">
          <Image src="/logo.svg" alt="Kabir Dohe Hub" width={140} height={32} className="h-8 w-auto" priority />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden h-full md:block" aria-label="Main menu">
          <ul className="flex h-full items-stretch gap-2">
            {MAIN_MENU.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              const hasChildren = !!link.children?.length;

              return (
                <li key={link.href} className="group relative flex h-full items-center">
                  <Link
                    href={link.href}
                    className={cn(
                      'inline-flex items-center gap-1 px-3 py-2 text-sm font-semibold tracking-wide uppercase no-underline transition-colors duration-200',
                      isActive
                        ? 'text-primary-foreground bg-black/15'
                        : 'text-primary-foreground hover:text-primary-foreground hover:bg-black/15'
                    )}
                  >
                    {link.label}
                    {hasChildren && (
                      <ChevronDown
                        size={14}
                        className="transition-transform duration-200 group-hover:rotate-180"
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                  {/* Dropdown */}
                  {hasChildren && (
                    <div className="absolute top-full right-0 z-40 hidden w-max min-w-105 bg-white shadow-lg group-hover:block">
                      <ul className="grid grid-cols-3 gap-1 p-2">
                        {link.children?.map((child) => {
                          const isChildActive = pathname === child.href;
                          return (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                className={cn(
                                  'block rounded px-3 py-1.5 text-sm font-medium no-underline transition-colors duration-200',
                                  isChildActive ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'
                                )}
                              >
                                {child.label}
                              </Link>
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

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-primary-foreground transition-colors duration-200 hover:bg-black/15 active:bg-black/15 md:hidden"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </Container>

      {/* Mobile nav */}
      <div
        className={cn(
          // Layout and animation
          'grid transition-all duration-300',
          // Responsive
          'md:hidden',
          // Open/close state
          menuOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        )}
      >
        <div className="border-primary-foreground/10 overflow-hidden border-t">
          <Container className="flex flex-col gap-2 py-4">
            {MAIN_MENU.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              const hasChildren = !!link.children?.length;

              return (
                <div key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => (!hasChildren ? setMenuOpen(false) : undefined)}
                    className={cn(
                      'flex w-full items-center gap-1 text-sm font-semibold tracking-wide whitespace-nowrap uppercase no-underline transition-colors duration-200',
                      isActive
                        ? 'text-primary-foreground bg-black/15'
                        : 'text-primary-foreground/80 hover:text-primary-foreground hover:bg-black/15'
                    )}
                  >
                    {link.label}
                    {hasChildren && <ChevronDown size={14} aria-hidden="true" />}
                  </Link>
                  {/* Mobile submenu */}
                  {hasChildren && (
                    <div className="border-primary-foreground/10 mt-1 ml-4 flex flex-col gap-1 border-l pl-3">
                      {link.children?.map((child) => {
                        const isChildActive = pathname === child.href;
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setMenuOpen(false)}
                            className={cn(
                              'block py-1 text-sm whitespace-nowrap no-underline transition-colors duration-200',
                              isChildActive
                                ? 'text-primary-foreground font-semibold'
                                : 'text-primary-foreground/70 hover:text-primary-foreground'
                            )}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </Container>
        </div>
      </div>
    </header>
  );
}
