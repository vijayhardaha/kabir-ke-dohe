import type { Metadata } from 'next';

import { fetchCategoryBySlug } from '@/lib/server/couplets';
import { buildMetadata } from '@/lib/utils/meta';

/**
 * Props for the base category archive page.
 *
 * @type {CategoryPageProps}
 * @property {Promise<{ slug: string }>} params - Route parameters containing the category slug.
 * @property {Promise<Record<string, string | string[] | undefined>>} searchParams - URL search parameters for pagination and sorting.
 */
export interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Props for the paginated category archive page.
 *
 * @type {CategoryPaginatedPageProps}
 * @property {Promise<{ slug: string; page: string }>} params - Route parameters containing category slug and page number.
 * @property {Promise<Record<string, string | string[] | undefined>>} searchParams - URL search parameters for sorting.
 */
export interface CategoryPaginatedPageProps {
  params: Promise<{ slug: string; page: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Generate metadata for category pages — used by both base and paginated routes.
 *
 * @param {{ params: Promise<{ slug: string }> }} props - Route params with slug.
 *
 * @returns {Promise<Metadata>} The metadata object.
 */
export async function generateCategoryMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = await fetchCategoryBySlug(slug);
  const name = category?.name ?? slug;

  return buildMetadata({
    title: `${name} Couplets`,
    description:
      category?.meta_description ?? `Browse Kabir's dohas in the ${name} category — spiritual wisdom and life lessons.`,
    path: `category/${slug}`,
  });
}
