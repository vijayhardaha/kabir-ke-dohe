import type { JSX, ReactNode } from 'react';

import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata } from 'next';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { GOOGLE_ANALYTICS_ID, SITE_METADATA } from '@/constants/seo';
import { fontClassNames } from '@/lib/utils/fonts';

import './globals.css';

/**
 * Metadata for the application.
 */
export const metadata: Metadata = SITE_METADATA;

/**
 * Root layout component for the application.
 *
 * @param {{ children: ReactNode }} props - The props for the RootLayout component.
 *
 * @returns {JSX.Element} The root layout structure.
 */
const RootLayout = ({ children }: { children: ReactNode }): JSX.Element => {
  return (
    <html lang="en">
      <head>
        <GoogleAnalytics gaId={GOOGLE_ANALYTICS_ID} />
      </head>
      <body className={fontClassNames}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 py-12">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
