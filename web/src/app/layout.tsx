import type { JSX, ReactNode } from 'react';

import type { Metadata } from 'next';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import { SITE_METADATA } from '@/constants/seo';
import { fontClassNames } from '@/lib/utils/fonts';

import './globals.css';

export const metadata: Metadata = SITE_METADATA;

/**
 * Root layout — applies font variables to <html> via fontClassNames.
 * Adds a skip-to-content link for accessibility and a scroll-to-top button.
 *
 * @param {{ children: ReactNode }} props - Component props
 *
 * @returns {JSX.Element} Root layout component
 */
export default function RootLayout({ children }: { children: ReactNode }): JSX.Element {
  return (
    <html lang="en" className={fontClassNames}>
      <body className="font-sans">
        {/* Skip to content link — visible on focus for keyboard users */}
        <a
          href="#main-content"
          className="bg-primary text-primary-foreground fixed top-0 left-0 z-[100] -translate-y-full px-4 py-2 text-sm font-semibold no-underline transition-transform duration-200 focus:translate-y-0"
        >
          Skip to content
        </a>

        <div className="flex min-h-screen flex-col">
          <Header />
          <main id="main-content" className="flex-1" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </div>

        <ScrollToTop />
      </body>
    </html>
  );
}
