import { webPageSchema, breadcrumbSchema } from '@vijayhardaha/schema-builder';

import { buildSeoTitle } from '@/lib/utils/meta';
import { buildKeywords, globalSchema } from '@/lib/utils/schema';
import { siteUrl } from '@/lib/utils/seo';

// ── Types ─────────────────────────────────────────────────────────────────

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
 * @property {string} [breadcrumbLabel] - Override label used in the breadcrumb.
 *   Defaults to `seoTitle` when omitted.
 */
export interface PageConfig {
  seoTitle: string;
  seoDescription: string;
  seoPath: string;
  seoKeywords: string[];
  /** Override label used in the breadcrumb (defaults to seoTitle). */
  breadcrumbLabel?: string;
}

// ── Schema builder ─────────────────────────────────────────────────────────

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
 *
 * @example
 * const schema = buildPageSchema({
 *   seoTitle: 'Privacy Policy',
 *   seoDescription: '…',
 *   seoPath: 'privacy',
 *   seoKeywords: ['privacy policy'],
 * });
 */
export function buildPageSchema(config: PageConfig): Record<string, unknown>[] {
  const rootUrl = siteUrl();
  const { seoTitle, seoDescription, seoPath, seoKeywords, breadcrumbLabel } = config;

  return [
    ...globalSchema(),
    webPageSchema(
      { rootUrl, path: seoPath },
      {
        name: buildSeoTitle(seoTitle, true),
        description: seoDescription,
        keywords: buildKeywords(seoKeywords),
      }
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
