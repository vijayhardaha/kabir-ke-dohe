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
 * Capitalizes the first letter in a word, preserving leading non-letter characters (e.g. parentheses).
 *
 * @param {string} word - The word to capitalize.
 *
 * @returns {string} The word with its first alphabetic character uppercased.
 *
 * @example
 * capitalizeWord("(the"); // "(The"
 * @example
 * capitalizeWord("hello"); // "Hello"
 */
function capitalizeWord(word: string): string {
  const match = word.match(/[a-zA-Z]/);
  if (!match) return word;
  const idx = match.index!;
  return word.slice(0, idx) + word[idx].toUpperCase() + word.slice(idx + 1);
}

/**
 * Converts a string to sentence case (first letter uppercase, rest lowercase).
 *
 * @param {string} str - The string to convert to sentence case.
 *
 * @returns {string} The string in sentence case format.
 *
 * @example
 * toSentenceCase("HELLO WORLD"); // "Hello World"
 * @example
 * toSentenceCase("heLLo"); // "Hello"
 * @example
 * toSentenceCase("जागृति (the Wake-up Call)"); // "जागृति (The Wake-up Call)"
 */
export function toSentenceCase(str: string): string {
  if (!str) return str;

  const lowercaseWords = new Set(['of', 'vs', 'and', 'the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'by', 'with']);

  return str
    .replace(/&/g, 'and')
    .toLowerCase()
    .split(/\s+/)
    .map((word, index) => {
      // Strip leading/trailing non-letters for lowercase word matching (e.g. "(the" → "the").
      const strippedWord = word.replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, '');
      const startsWithLetter = /^[a-zA-Z]/.test(word);

      // Only apply lowercase-word rule when the word starts with a letter
      // (skip for parenthetical prefixes like "(the").
      if (index > 0 && startsWithLetter && strippedWord && lowercaseWords.has(strippedWord)) {
        return word;
      }

      return capitalizeWord(word);
    })
    .join(' ');
}
