import { Instrument_Serif, Google_Sans, Hind } from 'next/font/google';

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
 * Hindi text support, acts as fallback for Devanagari glyphs.
 */
const devanagariFont = Hind({
  subsets: ['devanagari'],
  weight: ['400', '500', '600', '700'],
  style: ['normal'],
  variable: '--font-hindi-var',
  display: 'swap',
  preload: true,
});

/**
 * Concatenated class names string to apply all font variables to the <html> element.
 *
 * @type {string}
 */
export const fontClassNames: string = `${sansFont.variable} ${headingFont.variable} ${devanagariFont.variable}`;
