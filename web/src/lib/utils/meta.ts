import type { Metadata } from 'next';

import { SITE_CONFIG, SITE_METADATA } from '@/constants/seo';
import { siteUrl, getPermaLink } from '@/lib/utils/seo';

import { getOgImageUrl } from './og-image';

/**
 * Props for generating metadata, including title, description, and path for SEO.
 *
 * @type {SeoProps}
 * @property {string} title - Page title
 * @property {string} description - Page description
 * @property {string} [path] - URL slug to generate the canonical URL
 * @property {boolean} [postfix] - Whether to append the site name postfix
 */
export interface SeoProps {
  title: string;
  description: string;
  path?: string;
  postfix?: boolean;
}

/**
 * A generic object type with string keys and any values.
 *
 * @type {AnyObject}
 */
type AnyObject = Record<string, unknown>;

/**
 * Determine whether a value is a plain object (not null and not an array).
 *
 * @param {unknown} value - Value to test.
 *
 * @returns {value is AnyObject} True when the value is a plain object.
 *
 * @example
 * isPlainObject({}) // true
 * isPlainObject([]) // false
 * isPlainObject(null) // false
 */
const isPlainObject = (value: unknown): value is AnyObject => {
  return value !== null && typeof value === 'object' && !Array.isArray(value) && value.constructor === Object;
};

/**
 * Deeply merge two plain objects producing a new object.
 *
 * Behavior:
 * - Arrays from the source replace arrays on the target.
 * - Plain nested objects are merged recursively.
 * - Primitive values from the source override the target.
 *
 * @param {Record<string, unknown>} target - The target object to merge into.
 * @param {Record<string, unknown>} source - The source object with values to merge.
 *
 * @returns {Record<string, unknown>} A new object resulting from merging source into target.
 */
const mergeDeep = (target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> => {
  const output = { ...target };

  if (isPlainObject(target) && isPlainObject(source)) {
    Object.keys(source).forEach((key) => {
      const targetValue = target[key];
      const sourceValue = source[key];

      if (Array.isArray(sourceValue)) {
        output[key] = sourceValue;
      } else if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
        output[key] = mergeDeep(targetValue, sourceValue);
      } else {
        output[key] = sourceValue;
      }
    });
  }

  return output;
};

/**
 * Build a consistent SEO title by appending the configured postfix.
 *
 * @param {string} title - The page-specific title.
 * @param {boolean} postfix - Whether to append the site name postfix.
 *
 * @returns {string} The resulting SEO title, or the site default when title is empty.
 *
 * @example
 * buildSeoTitle('About', true) // -> 'About | Tools by Vijay Hardaha'
 */
const buildSeoTitle = (title: string = '', postfix: boolean): string => {
  if (!title) return SITE_CONFIG.title;
  if (!postfix) return title;
  return [title, '—', SITE_CONFIG.name].join(' ');
};

/**
 * Generate a complete metadata object for SEO, Open Graph, and Twitter cards.
 *
 * @param {SeoProps} params - The parameters object containing optional title, description and path.
 * @param {string} [params.title] - Page title to include in SEO metadata.
 * @param {string} [params.description] - Page description for SEO and social cards.
 * @param {string} [params.path] - URL slug to generate the canonical URL.
 * @param {boolean} [params.postfix] - Whether to append the site name postfix.
 *
 * @returns {Metadata} A metadata object suitable for Next.js metadata and social sharing.
 *
 * @example
 * const meta = buildMetadata({ title: 'About', description: 'About page', path: 'about' });
 */
export const buildMetadata = ({ title = '', description = '', path = '', postfix = true }: SeoProps): Metadata => {
  const canonical = path ? getPermaLink(path) : siteUrl();
  const titleAndDescription = { title: buildSeoTitle(title, postfix), description: description || '' };

  let images = {};
  if (path.startsWith('couplet/') || path.startsWith('/couplet/')) {
    const ogImage = getOgImageUrl(path || '/');
    const ogImageMeta = {
      url: ogImage,
      secureUrl: ogImage,
      width: 1200,
      height: 630,
      alt: titleAndDescription.title,
      type: 'image/png',
    };
    images = { images: ogImageMeta };
  }

  const newMetadata = mergeDeep(SITE_METADATA as Record<string, unknown>, {
    ...titleAndDescription,
    metadataBase: new URL(siteUrl()),
    alternates: { canonical },
    openGraph: { ...titleAndDescription, url: canonical, ...images },
    twitter: { ...titleAndDescription, ...images },
  });

  return newMetadata as Metadata;
};
