/**
 * Converts text to a URL-friendly slug format.
 *
 * @param {string} text - The text to slugify.
 *
 * @returns {string} The slugified string in lowercase with hyphens.
 *
 * @example
 * slugifyText("Hello World"); // "hello-world"
 * @example
 * slugifyText("Philosophy"); // "philosophy"
 * @example
 * slugifyText("Spiritual & Devotional"); // "spiritual-devotional"
 * @example
 * slugifyText("  Hello World  "); // "hello-world"
 * @example
 * slugifyText("Hello    World"); // "hello-world"
 * @example
 * slugifyText("Hello--World"); // "hello-world"
 * @example
 * slugifyText("hello_world"); // "hello-world"
 */
export function slugifyText(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s_-]/g, '')
    .replace(/[-_]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .join('-');
}
