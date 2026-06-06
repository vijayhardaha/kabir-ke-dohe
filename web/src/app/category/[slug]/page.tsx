import type { JSX } from 'react';

import { handlePageRedirect, parseSortParams } from '@/lib/server/page-utils';

import { CategoryArchiveContent } from '../_components/CategoryArchiveContent';

/**
 * Props for the category page.
 *
 * @type {CategoryPageProps}
 * @property {Promise<{ slug: string }>} params - Route parameters containing the category slug.
 * @property {Promise<Record<string, string | string[] | undefined>>} searchParams - URL search parameters for pagination and sorting.
 */
interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Category page that displays a paginated, filtered list of couplets for a given category.
 *
 * @param {CategoryPageProps} props - Component props
 *
 * @returns {Promise<JSX.Element>} The category-specific couplets listing page.
 */
export default async function CategoryPage({ params, searchParams }: CategoryPageProps): Promise<JSX.Element> {
  const { slug } = await params;
  const sp = await searchParams;
  handlePageRedirect(sp, `/category/${slug}`);
  const sort = parseSortParams(sp);

  return <CategoryArchiveContent slug={slug} page={1} sort={sort} />;
}
