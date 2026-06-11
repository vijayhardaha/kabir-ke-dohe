import { JetBrains_Mono } from 'next/font/google';
import localFont from 'next/font/local';

/**
 * Primary sans-serif font for body text — Zodiak (self-hosted).
 */
const sansFont = localFont({
  src: [
    { path: '../../../public/fonts/Zodiak-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../../../public/fonts/Zodiak-Italic.woff2', weight: '400', style: 'italic' },
    { path: '../../../public/fonts/Zodiak-Bold.woff2', weight: '700', style: 'normal' },
    { path: '../../../public/fonts/Zodiak-BoldItalic.woff2', weight: '700', style: 'italic' },
  ],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
});

/**
 * Monospace font for code blocks and inline code.
 */
const monoFont = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-mono',
  display: 'swap',
  preload: true,
});

/**
 * Concatenated class names string to apply all font variables to the <body> element.
 *
 * @type {string}
 */
export const fontClassNames: string = `${sansFont.variable} ${monoFont.variable}`;
