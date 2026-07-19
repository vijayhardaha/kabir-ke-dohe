import type { JSX } from 'react';

import { BaseArchivePage } from '@/components/common/BaseArchivePage';

import { PAGE_CONFIG } from './_config';

export { metadata } from './_config';

/**
 * Featured couplets archive page — paginated listing filtered by featured status.
 *
 * @param {{ searchParams: Promise<Record<string, string | string[] | undefined>> }} props - Component props.
 * @param {Promise<Record<string, string | string[] | undefined>>} props.searchParams - URL search parameters for sorting and pagination.
 *
 * @returns {Promise<JSX.Element>} The featured couplets page.
 */
export default async function FeaturedCoupletsPage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<JSX.Element> {
  return (
    <BaseArchivePage searchParams={props.searchParams} config={PAGE_CONFIG} baseUrl="/featured-couplets" hasFilter />
  );
}
