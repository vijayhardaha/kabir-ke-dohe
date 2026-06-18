import {
  breadcrumbSchema,
  personSchema,
  organizationSchema,
  webPageSchema,
  webSiteSchema,
} from '@vijayhardaha/schema-builder';

import { SITE_CONFIG } from '@/constants/seo';
import { siteUrl } from '@/lib/utils/seo';
import type { Post, PaginationMeta } from '@/types';

/** Default keywords used across all pages. */
export const BASE_KEYWORDS = [
  'Kabir Das',
  'Sant Kabir',
  'Kabir ke dohe',
  'Kabir dohas',
  'Kabir couplets',
  'Hindi poetry',
  'spiritual wisdom',
  'Indian philosophy',
  'Kabir teachings',
];

/**
 * Build a deduplicated, filtered keywords string from BASE_KEYWORDS and
 * page-specific extra keywords.
 *
 * Empty/falsy entries are filtered out. Duplicates (including those already
 * present in BASE_KEYWORDS) are removed. Returns a comma-separated string
 * suitable for schema `keywords` fields.
 *
 * @param {string[]} extra - Page-specific keywords to append.
 *
 * @returns {string} A comma-separated keywords string.
 *
 * @example
 * buildKeywords(['popular couplets', 'famous Kabir dohe'])
 * // → "Kabir Das, Sant Kabir, …, popular couplets, famous Kabir dohe"
 */
export function buildKeywords(extra: string[]): string {
  return [...new Set([...BASE_KEYWORDS, ...extra.filter(Boolean)])].join(', ');
}

/**
 * Build the global Schema.org entities that appear on every page.
 *
 * Includes Person, Organization, and WebSite entities.
 *
 * @returns {Record<string, unknown>[]} An array of schema objects for global use.
 */
export function globalSchema(): Record<string, unknown>[] {
  const rootUrl = siteUrl();
  const commonOptions = { rootUrl };

  return [
    personSchema(commonOptions),
    organizationSchema(commonOptions, { ...SITE_CONFIG.organization }),
    webSiteSchema(commonOptions, {
      name: SITE_CONFIG.organization.name,
      alternateName: SITE_CONFIG.name,
      description: SITE_CONFIG.description,
    }),
  ];
}

// ---------------------------------------------------------------------------
// Inline helpers (mirrors @vijayhardaha/schema-builder internals)
// ---------------------------------------------------------------------------

/**
 * Build a schema.org `@id` from a URL and a suffix.
 *
 * @param {string} url - The base URL.
 * @param {string} suffix - The suffix to append after `#`.
 *
 * @returns {string} The constructed ID string.
 */
function buildId(url: string, suffix: string): string {
  const normalized = url.endsWith('/') ? url.slice(0, -1) : url;
  return `${normalized}#${suffix}`;
}

/**
 * Deeply merge two plain objects, returning a new object.
 *
 * @param {Record<string, unknown>} target - The base object.
 * @param {Record<string, unknown>} source - The override object.
 *
 * @returns {Record<string, unknown>} A new merged object.
 */
function mergeDeep(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
  const output = { ...target };

  for (const key of Object.keys(source)) {
    const targetValue = target[key];
    const sourceValue = source[key];

    if (
      sourceValue !== null
      && typeof sourceValue === 'object'
      && !Array.isArray(sourceValue)
      && targetValue !== null
      && typeof targetValue === 'object'
      && !Array.isArray(targetValue)
    ) {
      output[key] = mergeDeep(targetValue as Record<string, unknown>, sourceValue as Record<string, unknown>);
    } else {
      output[key] = sourceValue;
    }
  }

  return output;
}

// ---------------------------------------------------------------------------
// CollectionPage schema (for archive / listing pages)
// ---------------------------------------------------------------------------

/**
 * Options for building a Schema.org CollectionPage entity.
 *
 * @typedef {object} CollectionPageOptions
 * @property {string} rootUrl - The site's root URL.
 * @property {string} path - URL path for this collection page.
 */
export type CollectionPageOptions = { rootUrl: string; path: string };

/**
 * Build a Schema.org CollectionPage entity with an embedded ItemList.
 *
 * Provides structured data for archive / listing pages such as
 * /couplets, /category/{slug}, /tag/{slug}, /popular-couplets, etc.
 *
 * The `overrides` object should include `name`, `description`, and optionally a
 * `mainEntity` with `numberOfItems` and `itemListElement` (array of
 * `{ position, url, name }` objects).
 *
 * @param {CollectionPageOptions} options - Root URL and path.
 * @param {Record<string, unknown>} [overrides] - Property overrides (name, description, mainEntity, etc.).
 *
 * @returns {Record<string, unknown>} A CollectionPage schema entity.
 *
 * @example
 * collectionPageSchema(
 *   { rootUrl: 'https://example.com', path: 'couplets' },
 *   {
 *     name: "Kabir's Couplets",
 *     description: 'All couplets',
 *     mainEntity: {
 *       '@type': 'ItemList',
 *       numberOfItems: 100,
 *       itemListElement: [
 *         { '@type': 'ListItem', position: 1, url: '...', name: '...' },
 *       ],
 *     },
 *   }
 * )
 */
export function collectionPageSchema(
  options: CollectionPageOptions,
  overrides?: Record<string, unknown>
): Record<string, unknown> {
  const rootUrl = options.rootUrl.replace(/\/$/, '');
  const canonicalUrl = `${rootUrl}/${options.path}`.replace(/([^:])\/+/g, '$1/');
  const webSiteID = buildId(rootUrl, 'website');
  const orgId = buildId(rootUrl, 'organization');
  const personID = buildId(rootUrl, 'person');

  const schema: Record<string, unknown> = {
    '@type': 'CollectionPage',
    '@id': buildId(canonicalUrl, 'collectionpage'),
    identifier: canonicalUrl,
    name: '',
    description: '',
    url: canonicalUrl,
    inLanguage: 'en',
    isPartOf: { '@id': webSiteID },
    publisher: { '@id': orgId },
    author: { '@id': personID },
    copyrightHolder: { '@id': personID },
    copyrightYear: new Date().getFullYear(),
    dateModified: new Date().toISOString(),
  };

  return mergeDeep(schema, overrides ?? {});
}

// ---------------------------------------------------------------------------
// BlogPosting schema (for single couplet pages)
// ---------------------------------------------------------------------------

/**
 * Options for building a Schema.org BlogPosting entity.
 *
 * @typedef {object} BlogPostingOptions
 * @property {string} rootUrl - The site's root URL.
 * @property {string} path - URL path for this page.
 */
export type BlogPostingOptions = { rootUrl: string; path: string };

/**
 * Build a Schema.org BlogPosting entity for a single couplet page.
 *
 * Provides structured data for /couplet/{slug} pages, including headline,
 * description, image, author, dates, and publisher.
 *
 * The `overrides` object should include `headline`, `description`, `datePublished`,
 * `dateModified`, and optionally `image` and `author`.
 *
 * @param {BlogPostingOptions} options - Root URL and path.
 * @param {Record<string, unknown>} [overrides] - Property overrides (headline, description, image, etc.).
 *
 * @returns {Record<string, unknown>} A BlogPosting schema entity.
 *
 * @example
 * blogPostingSchema(
 *   { rootUrl: 'https://example.com', path: 'couplet/my-slug' },
 *   {
 *     headline: 'दोहे का शीर्षक',
 *     description: 'Description text',
 *     image: 'https://example.com/image.jpg',
 *     datePublished: '2024-01-01T00:00:00Z',
 *     dateModified: '2024-01-02T00:00:00Z',
 *     author: { '@type': 'Person', name: 'Sant Kabir Das' },
 *   }
 * )
 */
export function blogPostingSchema(
  options: BlogPostingOptions,
  overrides?: Record<string, unknown>
): Record<string, unknown> {
  const rootUrl = options.rootUrl.replace(/\/$/, '');
  const canonicalUrl = `${rootUrl}/${options.path}`.replace(/([^:])\/+/g, '$1/');
  const orgId = buildId(rootUrl, 'organization');

  const schema: Record<string, unknown> = {
    '@type': 'BlogPosting',
    '@id': buildId(canonicalUrl, 'blogposting'),
    identifier: canonicalUrl,
    headline: '',
    description: '',
    url: canonicalUrl,
    inLanguage: 'en',
    author: { '@type': 'Person', name: 'Sant Kabir Das' },
    publisher: { '@id': orgId },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    image: '',
  };

  return mergeDeep(schema, overrides ?? {});
}

// ---------------------------------------------------------------------------
// Archive page schema builder (for paginated couplet listings)
// ---------------------------------------------------------------------------

/**
 * Per-page configuration for an archive listing.
 *
 * @type {ArchivePageConfig}
 * @property {string} seoTitle - Meta title for the archive page.
 * @property {string} seoDescription - Meta description for the page.
 * @property {string} seoPath - URL path segment for the archive.
 * @property {string[]} seoKeywords - Page-specific keywords merged with BASE_KEYWORDS.
 * @property {{ isPopular?: boolean; isFeatured?: boolean }} [filter] - Optional filter passed to getCouplets.
 * @property {string} breadcrumbLabel - Label used in the breadcrumb.
 * @property {string} pageTitle - Page header title (Hindi + English).
 * @property {string} pageDescription - Page header description (Hindi + English).
 */
export interface ArchivePageConfig {
  seoTitle: string;
  seoDescription: string;
  seoPath: string;
  seoKeywords: string[];
  filter?: { isPopular?: boolean; isFeatured?: boolean };
  breadcrumbLabel: string;
  pageTitle: string;
  pageDescription: string;
}

/**
 * Data required to build the archive page schema.
 *
 * @type {ArchiveSchemaData}
 * @property {Post[]} posts - List of posts for the current page.
 * @property {PaginationMeta} pagination - Pagination metadata.
 * @property {number} page - Current page number (1-based).
 * @property {number} perPage - Number of items per page.
 * @property {string[]} [extraKeywords] - Extra keywords appended for paginated pages (e.g. 'paginated').
 */
export interface ArchiveSchemaData {
  posts: Post[];
  pagination: PaginationMeta;
  page: number;
  perPage: number;
  extraKeywords?: string[];
}

/**
 * Build the full schema array (global + collectionPage + breadcrumb) for an
 * archive listing page.
 *
 * @param {ArchivePageConfig} config - Per-page configuration for the archive.
 * @param {ArchiveSchemaData} data - Posts, pagination, and page data.
 *
 * @returns {Record<string, unknown>[]} An array of schema-org entities for
 *   JSON-LD rendering.
 */
export function buildArchivePageSchema(config: ArchivePageConfig, data: ArchiveSchemaData): Record<string, unknown>[] {
  const rootUrl = siteUrl();
  const { posts, pagination, page, perPage } = data;

  const itemListElement = posts.map((post, idx) => ({
    '@type': 'ListItem',
    position: (page - 1) * perPage + idx + 1,
    url: `${rootUrl}/couplet/${post.slug}`,
    name: post.text_hi.slice(0, 120),
  }));

  return [
    ...globalSchema(),
    collectionPageSchema(
      { rootUrl, path: config.seoPath },
      {
        name: `${config.seoTitle} — Kabir Ke Dohe`,
        description: config.seoDescription,
        keywords: buildKeywords([...config.seoKeywords, ...(data.extraKeywords ?? [])]),
        mainEntity: { '@type': 'ItemList', numberOfItems: pagination.total, itemListElement },
      }
    ),
    breadcrumbSchema({
      rootUrl,
      items: [
        { name: 'Home', path: '' },
        { name: config.breadcrumbLabel, path: config.seoPath },
      ],
    }),
  ];
}

// ---------------------------------------------------------------------------
// Static page schema builder (for categories, tags, privacy, terms, etc.)
// ---------------------------------------------------------------------------

/**
 * Per‑page SEO configuration for static pages (categories, tags, privacy, terms, etc.).
 *
 * Each instance provides all the data needed to generate the page's metadata,
 * JSON‑LD schema, and breadcrumb without repeating boilerplate per page.
 *
 * @interface PageConfig
 * @property {string} seoTitle - Meta title for the page.
 * @property {string} seoDescription - Meta description for the page.
 * @property {string} seoPath - URL path segment (e.g. `"categories"`, `"privacy"`).
 * @property {string[]} seoKeywords - Page‑specific keywords merged with BASE_KEYWORDS.
 * @property {string} [breadcrumbLabel] - Override label used in the breadcrumb. Defaults to `seoTitle` when omitted.
 */
export interface PageConfig {
  seoTitle: string;
  seoDescription: string;
  seoPath: string;
  seoKeywords: string[];
  breadcrumbLabel?: string;
}

/**
 * Build the full schema array (global + webPage + breadcrumb) for a static page.
 *
 * Consolidates the repeated pattern found across categories, tags, privacy, and
 * terms pages into a single callable. Each page defines its own {@link PageConfig}
 * and passes it here.
 *
 * @param {PageConfig} config - Page SEO and breadcrumb configuration.
 *
 * @returns {Record<string, unknown>[]} An array of schema‑org entities ready for
 *   `JsonLd`.
 */
export function buildPageSchema(config: PageConfig): Record<string, unknown>[] {
  const rootUrl = siteUrl();
  const { seoTitle, seoDescription, seoPath, seoKeywords, breadcrumbLabel } = config;

  return [
    ...globalSchema(),
    webPageSchema(
      { rootUrl, path: seoPath },
      { name: `${seoTitle} — Kabir Ke Dohe`, description: seoDescription, keywords: buildKeywords(seoKeywords) }
    ),
    breadcrumbSchema({
      rootUrl,
      items: [
        { name: 'Home', path: '' },
        { name: breadcrumbLabel ?? seoTitle, path: seoPath },
      ],
    }),
  ];
}
