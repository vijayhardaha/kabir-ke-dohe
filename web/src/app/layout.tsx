import type { JSX, ReactNode } from 'react';

import type { Metadata } from 'next';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { fontClassNames } from '@/lib/utils/fonts';
import { siteMetadata } from '@/lib/utils/seo';

import './globals.css';

export const metadata: Metadata = siteMetadata;

/**
 * Root layout — applies font variables to <html> via fontClassNames.
 *
 * @param {{ children: ReactNode }} props - Component props
 *
 * @returns {JSX.Element} Root layout component
 */
export default function RootLayout({ children }: { children: ReactNode }): JSX.Element {
  return (
    <html lang="en" className={fontClassNames}>
      <body className="font-sans">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
