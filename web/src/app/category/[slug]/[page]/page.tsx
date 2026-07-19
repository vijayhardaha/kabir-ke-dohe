import type { JSX } from 'react';

import { parseSortParams, validatePageParam } from '@/lib/server/page-utils';

import { ArchiveContent } from '../../_components/ArchiveContent';
import { generateCategoryMetadata, type CategoryPaginatedPageProps } from '../../_utils/shared';

// ── Metadata ──────────────────────────────────────────────────────────────

export const generateMetadata = generateCategoryMetadata;

/**
 * Paginated category page — handles `/category/xyz/2`, `/category/xyz/3`, etc.
 * Redirects to `/category/xyz` when page is 1 or invalid.
 *
 * @param {CategoryPaginatedPageProps} props - Component props.
 *
 * @returns {Promise<JSX.Element>} The paginated category couplets listing page.
 */
export default async function CategoryPage({ params, searchParams }: CategoryPaginatedPageProps): Promise<JSX.Element> {
  const { slug, page: pageStr } = await params;
  const sp = await searchParams;
  const page = validatePageParam(pageStr, `/category/${slug}`, sp);
  const sort = parseSortParams(sp);

  return <ArchiveContent slug={slug} page={page} sort={sort} />;
}
