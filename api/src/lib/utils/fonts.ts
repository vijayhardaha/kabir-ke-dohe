import { Google_Sans, Instrument_Serif, Google_Sans_Code } from 'next/font/google';

/**
 * Primary sans-serif font for body text.
 */
const sansFont = Google_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-sans-var',
  display: 'swap',
  preload: true,
  adjustFontFallback: false,
});

/**
 * Display font for headings.
 */
const headingFont = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-heading-var',
  display: 'swap',
  preload: true,
});

/**
 * Monospace font for code blocks and inline code.
 */
const monoFont = Google_Sans_Code({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-mono-var',
  display: 'swap',
  preload: true,
  adjustFontFallback: false,
});

/**
 * Concatenated class names string to apply all font variables to the <body> element.
 *
 * @type {string}
 */
export const fontClassNames: string = `${sansFont.variable} ${headingFont.variable} ${monoFont.variable}`;
