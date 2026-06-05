import latinize from 'latinize';
import slugify from 'slugify';

/**
 * Converts arbitrary text into a normalized slug using configurable word separators.
 *
 * @param {string} string - Source text that may include accents and symbols.
 * @param {string} [separator] - Replacement character inserted between slug segments.
 *
 * @returns {string} Lowercase slug stripped to URL-safe characters.
 *
 * @example
 * sanitize("Hello World!"); // "hello-world"
 * @example
 * sanitize("Hello World!", "_"); // "hello_world"
 */
function sanitize(string: string, separator: string = '-'): string {
  // Transliterate before slugging so accented characters produce stable ASCII output.
  return slugify(latinize(string), { lower: true, replacement: separator, strict: true, trim: true });
}

/**
 * Converts title-like text into a URL-friendly kebab-case slug representation.
 *
 * @param {string} string - Title text that will become part of route paths.
 *
 * @returns {string} Sanitized kebab-case slug for URL and identifier usage.
 *
 * @example
 * sanitizeTitle("My Blog Post"); // "my-blog-post"
 * @example
 * sanitizeTitle("  Spaces  "); // "spaces"
 */
export function sanitizeTitle(string: string): string {
  return sanitize(string, '-');
}

/**
 * Converts a string to sentence case (first letter uppercase, rest lowercase).
 *
 * @param {string} str - The string to convert to sentence case.
 *
 * @returns {string} The string in sentence case format.
 *
 * @example
 * toSentenceCase("HELLO WORLD"); // "Hello world"
 * @example
 * toSentenceCase("heLLo"); // "Hello"
 */
export function toSentenceCase(str: string): string {
  if (!str) return str;

  const lowercaseWords = new Set(['of', 'vs', 'and', 'the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'by', 'with']);

  return str
    .replace(/&/g, 'and')
    .toLowerCase()
    .split(/\s+/)
    .map((word, index) => {
      if (index > 0 && lowercaseWords.has(word)) {
        return word;
      }

      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}
