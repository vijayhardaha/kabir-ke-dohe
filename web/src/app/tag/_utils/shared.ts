import type { Metadata } from 'next';

import { getTagBySlug } from '@/lib/server/couplets';
import { buildMetadata } from '@/lib/utils/meta';

/**
 * Props for the base tag archive page.
 *
 * @type {TagPageProps}
 * @property {Promise<{ slug: string }>} params - Route parameters containing the tag slug.
 * @property {Promise<Record<string, string | string[] | undefined>>} searchParams - URL search parameters for pagination and sorting.
 */
export interface TagPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Props for the paginated tag archive page.
 *
 * @type {TagPaginatedPageProps}
 * @property {Promise<{ slug: string; page: string }>} params - Route parameters containing tag slug and page number.
 * @property {Promise<Record<string, string | string[] | undefined>>} searchParams - URL search parameters for sorting.
 */
export interface TagPaginatedPageProps {
  params: Promise<{ slug: string; page: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Generate metadata for tag pages — used by both base and paginated routes.
 *
 * @param {{ params: Promise<{ slug: string }> }} props - Route params with slug.
 *
 * @returns {Promise<Metadata>} The metadata object.
 */
export async function generateTagMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);
  const name = tag?.name ?? slug;

  return buildMetadata({
    title: `${name} — Tag`,
    description:
      tag?.meta_description
      ?? `Browse Kabir ke Dohe tagged with "${name}": Explore spiritual wisdom and life lessons on ${name}, सरल Hindi and English meanings के साथ। Read more here.`,
    path: `tag/${slug}`,
  });
}
