import { cleanPath } from './seo';

/**
 * Generates the public Supabase Storage URL for a couplet's featured image.
 *
 * The image file name matches the couplet slug, stored in the `couplet-images`
 * bucket as optimised WebP.
 *
 * Returns `null` when the environment variable is not set so callers can
 * fall back gracefully.
 *
 * @param {string} slug - The couplet slug used as the file name (without extension).
 *
 * @returns {string | null} The full public URL, or `null` if `NEXT_PUBLIC_SUPABASE_URL` is not set.
 *
 * @example
 * const url = getFeaturedImageUrl('balihari-guru-aapno');
 * // → "https://xxx.supabase.co/storage/v1/object/public/couplet-images/balihari-guru-aapno.webp"
 */
export function getFeaturedImageUrl(slug: string): string | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!supabaseUrl) {
    return null;
  }

  const cleanSlug = cleanPath(slug);

  return `${supabaseUrl}/storage/v1/object/public/couplet-images/${cleanSlug}.webp`;
}

/**
 * Resolves the Open Graph image URL for a given page path.
 *
 * Returns a path-specific OG image when available, or `null` to let callers
 * fall back to the site-wide default OG image.
 *
 * Current path mappings:
 *   - `couplet/{slug}` → per-couplet image from Supabase Storage
 *
 * Future path types can be added here without changing callers.
 *
 * @param {string} path - The page path (e.g. `"couplet/balihari-guru"`, `"about"`).
 *
 * @returns {string | null} The OG image URL, or `null` if no custom image is
 *   configured for the given path.
 *
 * @example
 * getOgImageUrl('couplet/balihari-guru-aapno')
 * // → "https://xxx.supabase.co/storage/v1/object/public/couplet-images/balihari-guru-aapno.webp"
 *
 * getOgImageUrl('about')   // → null  (uses site-wide default)
 * getOgImageUrl('')        // → null
 */
export function getOgImageUrl(path: string): string | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!supabaseUrl) {
    return null;
  }

  const clean = cleanPath(path);

  // Couplet pages: return per-couplet OG image from Supabase Storage
  if (clean.startsWith('couplet/')) {
    const slug = cleanPath(clean.replace(/^couplet\//, ''));
    return `${supabaseUrl}/storage/v1/object/public/couplet-images/${slug}.webp`;
  }

  // Future: add other path-specific OG images here
  // e.g.: if (clean.startsWith('category/')) { ... }
  // e.g.: if (clean.startsWith('tag/')) { ... }

  return null;
}
