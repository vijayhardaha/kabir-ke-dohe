import type { JSX } from 'react';

import { parseSortParams, validatePageParam } from '@/lib/server/page-utils';

import { CategoryArchiveContent } from '../../_components/CategoryArchiveContent';

/**
 * Props for the paginated category page.
 *
 * @type {CategoryPageProps}
 * @property {Promise<{ slug: string; page: string }>} params - Route parameters containing category slug and page number.
 * @property {Promise<Record<string, string | string[] | undefined>>} searchParams - URL search parameters for sorting.
 */
interface CategoryPageProps {
  params: Promise<{ slug: string; page: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Paginated category page — handles `/category/xyz/2`, `/category/xyz/3`, etc.
 * Redirects to `/category/xyz` when page is 1 or invalid.
 *
 * @param {CategoryPageProps} props - Component props.
 *
 * @returns {Promise<JSX.Element>} The paginated category couplets listing page.
 */
export default async function CategoryPage({ params, searchParams }: CategoryPageProps): Promise<JSX.Element> {
  const { slug, page: pageStr } = await params;
  const sp = await searchParams;
  const page = validatePageParam(pageStr, `/category/${slug}`, sp);
  const sort = parseSortParams(sp);

  return <CategoryArchiveContent slug={slug} page={page} sort={sort} />;
}
