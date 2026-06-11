'use client';

import { useEffect, useState, type JSX } from 'react';

import { RiArrowUpLine } from 'react-icons/ri';

import { cn } from '@/lib/utils/cn';

/**
 * Scroll-to-top button that appears when the user scrolls down past a threshold.
 * Clicking scrolls smoothly to the top of the page.
 *
 * @returns {JSX.Element} Scroll to top button component
 */
export function ScrollToTop(): JSX.Element {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /**
   * Scrolls to the top of the page with smooth behavior.
   */
  const scrollToTop = (): void => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={cn(
        'fixed right-6 bottom-6 z-40 flex h-11 w-11 cursor-pointer items-center justify-center',
        'bg-secondary text-secondary-foreground',
        'hover:bg-primary hover:text-primary-foreground',
        'transition-all duration-300',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      )}
    >
      <RiArrowUpLine size={20} />
    </button>
  );
}
