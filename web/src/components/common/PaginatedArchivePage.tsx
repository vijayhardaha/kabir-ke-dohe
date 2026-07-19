import type { JSX } from 'react';

import { ArchiveContent } from '@/app/couplets/_components/ArchiveContent';
import { getCouplets } from '@/lib/server/couplets';
import { parseSortParams, validatePageParam } from '@/lib/server/page-utils';
import { buildArchivePageSchema } from '@/lib/utils/schema';
import type { ArchivePageConfig } from '@/lib/utils/schema';

/**
 * Props for the PaginatedArchivePage component.
 *
 * @type {PaginatedArchivePageProps}
 * @property {Promise<{ page: string }>} params - Route parameters containing the page number.
 * @property {Promise<Record<string, string | string[] | undefined>>} searchParams - URL search parameters.
 * @property {ArchivePageConfig} config - Archive page configuration (SEO, filter, etc.).
 * @property {string} baseUrl - Base URL path for pagination links.
 * @property {boolean} [hasFilter] - Whether to apply the config's filter to the query.
 */
export interface PaginatedArchivePageProps {
  params: Promise<{ page: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
  config: ArchivePageConfig;
  baseUrl: string;
  hasFilter?: boolean;
}

/**
 * Reusable paginated archive page for couplets, featured, and popular routes.
 *
 * @param {PaginatedArchivePageProps} props - Component props.
 *
 * @returns {Promise<JSX.Element>} The paginated archive page.
 */
export async function PaginatedArchivePage({
  params,
  searchParams,
  config,
  baseUrl,
  hasFilter = false,
}: PaginatedArchivePageProps): Promise<JSX.Element> {
  const { page: pageStr } = await params;
  const sp = await searchParams;
  const page = validatePageParam(pageStr, baseUrl, sp);
  const { sortBy, sortOrder, perPage } = parseSortParams(sp);

  const query = hasFilter
    ? { page, perPage, ...config.filter, sortBy, sortOrder }
    : { page, perPage, sortBy, sortOrder };
  const { posts, pagination } = await getCouplets(query);

  const pageSchema = buildArchivePageSchema(config, { posts, pagination, page, perPage, extraKeywords: ['paginated'] });

  return (
    <ArchiveContent
      pageSchema={pageSchema}
      pageTitle={config.pageTitle}
      pageDescription={config.pageDescription}
      posts={posts}
      pagination={pagination}
      baseUrl={baseUrl}
      currentSortBy={sortBy}
      currentSortOrder={sortOrder}
    />
  );
}
