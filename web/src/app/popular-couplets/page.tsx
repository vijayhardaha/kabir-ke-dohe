import type { JSX } from 'react';

import { BaseArchivePage } from '@/components/common/BaseArchivePage';

import { PAGE_CONFIG } from './_config';

export { metadata } from './_config';

/**
 * Popular couplets archive page — paginated listing filtered by popularity.
 *
 * @param {{ searchParams: Promise<Record<string, string | string[] | undefined>> }} props - Component props.
 * @param {Promise<Record<string, string | string[] | undefined>>} props.searchParams - URL search parameters for sorting and pagination.
 *
 * @returns {Promise<JSX.Element>} The popular couplets page.
 */
export default async function PopularCoupletsPage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<JSX.Element> {
  return (
    <BaseArchivePage searchParams={props.searchParams} config={PAGE_CONFIG} baseUrl="/popular-couplets" hasFilter />
  );
}
