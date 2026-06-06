import type { JSX } from 'react';

import { parseSortParams, validatePageParam } from '@/lib/server/page-utils';

import { TagArchiveContent } from '../../_components/TagArchiveContent';

/**
 * Props for the paginated tag page.
 *
 * @type {TagPageProps}
 * @property {Promise<{ slug: string; page: string }>} params - Route parameters containing tag slug and page number.
 * @property {Promise<Record<string, string | string[] | undefined>>} searchParams - URL search parameters for sorting.
 */
interface TagPageProps {
  params: Promise<{ slug: string; page: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Paginated tag page — handles `/tag/xyz/2`, `/tag/xyz/3`, etc.
 * Redirects to `/tag/xyz` when page is 1 or invalid.
 *
 * @param {TagPageProps} props - Component props.
 *
 * @returns {Promise<JSX.Element>} The paginated tag couplets listing page.
 */
export default async function TagPage({ params, searchParams }: TagPageProps): Promise<JSX.Element> {
  const { slug, page: pageStr } = await params;
  const sp = await searchParams;
  const page = validatePageParam(pageStr, `/tag/${slug}`, sp);
  const sort = parseSortParams(sp);

  return <TagArchiveContent slug={slug} page={page} sort={sort} />;
}
