import type { JSX } from 'react';

import { BaseArchivePage } from '@/components/common/BaseArchivePage';

import { PAGE_CONFIG } from './_config';

export { metadata } from './_config';

/**
 * All couplets archive page — paginated listing of published couplets.
 *
 * @param {{ searchParams: Promise<Record<string, string | string[] | undefined>> }} props - Component props.
 * @param {Promise<Record<string, string | string[] | undefined>>} props.searchParams - URL search parameters for sorting and pagination.
 *
 * @returns {Promise<JSX.Element>} The archive page.
 */
export default async function CoupletsPage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<JSX.Element> {
  return <BaseArchivePage searchParams={props.searchParams} config={PAGE_CONFIG} baseUrl="/couplets" />;
}
