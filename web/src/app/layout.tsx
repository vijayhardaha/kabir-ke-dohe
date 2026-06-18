import type { JSX, ReactNode } from 'react';

import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata } from 'next';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import { VercelAnalytics } from '@/components/shared/VercelAnalytics';
import { GOOGLE_ANALYTICS_ID, SITE_METADATA } from '@/constants/seo';
import { fontClassNames } from '@/lib/utils/fonts';
import '@/styles/globals.css';

/**
 * Global metadata for the application.
 */
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
          className="bg-primary text-primary-foreground fixed top-0 left-0 z-100 -translate-y-full px-4 py-2 text-sm font-semibold no-underline transition-transform duration-200 focus:translate-y-0"
        >
          Skip to content
        </a>

        <div className="flex min-h-screen flex-col">
          {/* ═══════════════ HEADER ═══════════════ */}
          <Header />
          <main id="main-content" className="flex-1" tabIndex={-1}>
            {/* ═══════════════ PAGE CONTENT ═══════════════ */}
            {children}
          </main>
          {/* ═══════════════ FOOTER ═══════════════ */}
          <Footer />
        </div>

        {/* ═══════════════ SCROLL TO TOP ═══════════════ */}
        <ScrollToTop />

        {process.env.NODE_ENV === 'production' && (
          <>
            <GoogleAnalytics gaId={GOOGLE_ANALYTICS_ID} />
            <VercelAnalytics />
          </>
        )}
      </body>
    </html>
  );
}
