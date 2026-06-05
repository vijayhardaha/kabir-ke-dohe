import { Crimson_Pro, Jost, Noto_Sans_Devanagari } from 'next/font/google';

/**
 * Primary sans-serif font for body text.
 */
const sansFont = Jost({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-body',
  display: 'swap',
  preload: true,
});

/**
 * Display font for headings.
 */
const headingFont = Crimson_Pro({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-anton',
  display: 'swap',
  preload: true,
});

/**
 * Hindi text support, acts as fallback for Devanagari glyphs.
 */
const devanagariFont = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  weight: ['400', '500', '600', '700'],
  style: ['normal'],
  variable: '--font-noto-sans',
  display: 'swap',
  preload: true,
});

/**
 * Concatenated class names string to apply all font variables to the <html> element.
 *
 * @type {string}
 */
export const fontClassNames: string = `${sansFont.variable} ${headingFont.variable} ${devanagariFont.variable}`;
