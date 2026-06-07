import type { JSX } from 'react';

import type { Metadata } from 'next';

import { getTagBySlug } from '@/lib/server/couplets';
import { parseSortParams, validatePageParam } from '@/lib/server/page-utils';
import { buildMetadata } from '@/lib/utils/meta';

import { TagArchiveContent } from '../../_components/TagArchiveContent';

/**
 * Generate metadata for paginated tag pages.
 *
 * @param {{ params: Promise<{ slug: string; page: string }> }} props - Route params
 *
 * @returns {Promise<Metadata>} The metadata object.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; page: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);
  const name = tag?.name ?? slug;

  return buildMetadata({
    title: `${name} — Tag`,
    description: `Browse Kabir's dohas tagged with "${name}" — spiritual wisdom and life lessons.`,
    path: `tag/${slug}`,
  });
}

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
