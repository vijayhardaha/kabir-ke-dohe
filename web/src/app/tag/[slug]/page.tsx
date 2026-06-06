import type { JSX } from 'react';

import { handlePageRedirect, parseSortParams } from '@/lib/server/page-utils';

import { TagArchiveContent } from '../_components/TagArchiveContent';

/**
 * Props for the tag page.
 *
 * @type {TagPageProps}
 * @property {Promise<{ slug: string }>} params - Route parameters containing the tag slug.
 * @property {Promise<Record<string, string | string[] | undefined>>} searchParams - URL search parameters for pagination and sorting.
 */
interface TagPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Tag page that displays a paginated, filtered list of couplets for a given tag.
 *
 * @param {TagPageProps} props - Component props
 *
 * @returns {Promise<JSX.Element>} The tag-specific couplets listing page.
 */
export default async function TagPage({ params, searchParams }: TagPageProps): Promise<JSX.Element> {
  const { slug } = await params;
  const sp = await searchParams;
  handlePageRedirect(sp, `/tag/${slug}`);
  const sort = parseSortParams(sp);

  return <TagArchiveContent slug={slug} page={1} sort={sort} />;
}
