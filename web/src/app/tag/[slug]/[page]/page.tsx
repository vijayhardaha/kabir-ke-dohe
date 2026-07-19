import type { JSX } from 'react';

import { parseSortParams, validatePageParam } from '@/lib/server/page-utils';

import { ArchiveContent } from '../../_components/ArchiveContent';
import { generateTagMetadata, type TagPaginatedPageProps } from '../../_utils/shared';

// ── Metadata ──────────────────────────────────────────────────────────────

export const generateMetadata = generateTagMetadata;

/**
 * Paginated tag page — handles `/tag/xyz/2`, `/tag/xyz/3`, etc.
 * Redirects to `/tag/xyz` when page is 1 or invalid.
 *
 * @param {TagPaginatedPageProps} props - Component props.
 *
 * @returns {Promise<JSX.Element>} The paginated tag couplets listing page.
 */
export default async function TagPage({ params, searchParams }: TagPaginatedPageProps): Promise<JSX.Element> {
  const { slug, page: pageStr } = await params;
  const sp = await searchParams;
  const page = validatePageParam(pageStr, `/tag/${slug}`, sp);
  const sort = parseSortParams(sp);

  return <ArchiveContent slug={slug} page={page} sort={sort} />;
}
