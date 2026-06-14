import type { JSX } from 'react';

import type { Metadata } from 'next';

import { getTagBySlug } from '@/lib/server/couplets';
import { handlePageRedirect, parseSortParams } from '@/lib/server/page-utils';
import { buildMetadata } from '@/lib/utils/meta';

import { TagArchiveContent } from '../_components/TagArchiveContent';

/**
 * Generate metadata for the tag page.
 *
 * @param {{ params: Promise<{ slug: string }> }} props - Route params
 *
 * @returns {Promise<Metadata>} The metadata object.
 */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);
  const name = tag?.name ?? slug;

  return buildMetadata({
    title: `${name} — Tag`,
    description:
      tag?.meta_description ?? `Browse Kabir's dohas tagged with "${name}" — spiritual wisdom and life lessons.`,
    path: `tag/${slug}`,
  });
}

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
