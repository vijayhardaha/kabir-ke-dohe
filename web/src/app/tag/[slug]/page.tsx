import type { JSX } from 'react';

import { handlePageRedirect, parseSortParams } from '@/lib/server/page-utils';

import { ArchiveContent } from '../_components/ArchiveContent';
import { generateTagMetadata, type TagPageProps } from '../_utils/shared';

// ── Metadata ──────────────────────────────────────────────────────────────

export const generateMetadata = generateTagMetadata;

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

  return <ArchiveContent slug={slug} page={1} sort={sort} />;
}
