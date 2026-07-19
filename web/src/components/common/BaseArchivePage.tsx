import type { JSX } from 'react';

import { ArchiveContent } from '@/app/couplets/_components/ArchiveContent';
import { getCouplets } from '@/lib/server/couplets';
import { handlePageRedirect, parseSortParams } from '@/lib/server/page-utils';
import { buildArchivePageSchema } from '@/lib/utils/schema';
import type { ArchivePageConfig } from '@/lib/utils/schema';

/**
 * Props for the BaseArchivePage component.
 *
 * @type {BaseArchivePageProps}
 * @property {Promise<Record<string, string | string[] | undefined>>} searchParams - URL search parameters.
 * @property {ArchivePageConfig} config - Archive page configuration (SEO, filter, etc.).
 * @property {string} baseUrl - Base URL path for pagination links.
 * @property {boolean} [hasFilter] - Whether to apply the config's filter to the query.
 */
export interface BaseArchivePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
  config: ArchivePageConfig;
  baseUrl: string;
  hasFilter?: boolean;
}

/**
 * Reusable base (page 1) archive page for couplets, featured, and popular routes.
 *
 * @param {BaseArchivePageProps} props - Component props.
 *
 * @returns {Promise<JSX.Element>} The base archive page.
 */
export async function BaseArchivePage({
  searchParams,
  config,
  baseUrl,
  hasFilter = false,
}: BaseArchivePageProps): Promise<JSX.Element> {
  const params = await searchParams;
  handlePageRedirect(params, baseUrl);
  const { sortBy, sortOrder, perPage } = parseSortParams(params);

  const query = hasFilter
    ? { page: 1, perPage, ...config.filter, sortBy, sortOrder }
    : { page: 1, perPage, sortBy, sortOrder };
  const { posts, pagination } = await getCouplets(query);

  const pageSchema = buildArchivePageSchema(config, { posts, pagination, page: 1, perPage });

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
