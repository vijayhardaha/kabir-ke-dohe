import {
  breadcrumbSchema,
  collectionPageSchema,
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
