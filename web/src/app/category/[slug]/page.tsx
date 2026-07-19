import type { JSX } from 'react';

import { handlePageRedirect, parseSortParams } from '@/lib/server/page-utils';

import { ArchiveContent } from '../_components/ArchiveContent';
import { generateCategoryMetadata, type CategoryPageProps } from '../_utils/shared';

// ── Metadata ──────────────────────────────────────────────────────────────

export const generateMetadata = generateCategoryMetadata;

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

  return <ArchiveContent slug={slug} page={1} sort={sort} />;
}
