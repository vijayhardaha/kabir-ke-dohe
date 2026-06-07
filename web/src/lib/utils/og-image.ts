/**
 * Generates the public Supabase Storage URL for a couplet's OG image.
 *
 * The image file name matches the couplet slug (e.g. `balihari-guru-....webp`),
 * stored in the `couplet-images` bucket. Images are uploaded as optimised WebP,
 * so the extension is hard-coded to `.webp`.
 *
 * Returns `null` when the environment variable is not set so callers can
 * fall back gracefully.
 *
 * @param {string} slug - The couplet slug used as the file name (without extension).
 *
 * @returns {string | null} The full public URL, or `null` if `NEXT_PUBLIC_SUPABASE_URL` is not set.
 *
 * @example
 * const url = getOgImageUrl('balihari-guru-aapno');
 * // → "https://xxx.supabase.co/storage/v1/object/public/couplet-images/balihari-guru-aapno.webp"
 */
export function getOgImageUrl(slug: string): string | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!supabaseUrl) {
    return null;
  }

  return `${supabaseUrl}/storage/v1/object/public/couplet-images/${slug}.webp`;
}
