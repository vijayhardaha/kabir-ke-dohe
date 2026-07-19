import type { JSX } from 'react';

import { webPageSchema } from '@vijayhardaha/schema-builder';
import type { Metadata } from 'next';

import { ArchivePageLayout } from '@/app/couplets/_components/ArchivePageLayout';
import { getCouplets } from '@/lib/server/couplets';
import { parseSortParams, validatePageParam } from '@/lib/server/page-utils';
import { buildMetadata } from '@/lib/utils/meta';
import { buildKeywords, globalSchema } from '@/lib/utils/schema';
import { siteUrl } from '@/lib/utils/seo';

// ── SEO ───────────────────────────────────────────────────────────────────

const SEO_PATH = 'search';
const SEO_KEYWORDS = ['search couplets', 'find dohas', 'paginated'];

const ROOT_URL = siteUrl();
const PAGE_SCHEMA = [
  ...globalSchema(),
  webPageSchema(
    { rootUrl: ROOT_URL, path: SEO_PATH },
    { name: 'Search — Kabir Ke Dohe', keywords: buildKeywords(SEO_KEYWORDS) }
  ),
];

/** SEO metadata for the page. */
export const metadata: Metadata = {
  ...buildMetadata({ title: 'Search', description: 'Find couplets by keyword, theme, or meaning.', path: SEO_PATH }),
  robots: { index: false, follow: false },
};

/**
 * Props for the paginated search results page.
 *
 * @type {SearchPageProps}
 * @property {Promise<{ page: string }>} params - Route parameters containing the page number.
 * @property {Promise<Record<string, string | string[] | undefined>>} searchParams - URL search parameters including search query and filters.
 */
interface SearchPageProps {
  params: Promise<{ page: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Paginated search page — handles `/search/2`, `/search/3`, etc.
 *
 * @param {SearchPageProps} props - Component props.
 * @param {Promise<{ page: string }>} props.params - Route parameters containing the page number.
 * @param {Promise<Record<string, string | string[] | undefined>>} props.searchParams - URL search parameters.
 *
 * @returns {Promise<JSX.Element>} The paginated search results page.
 */
export default async function SearchPage({ params, searchParams }: SearchPageProps): Promise<JSX.Element> {
  const { page: pageStr } = await params;
  const sp = await searchParams;
  const page = validatePageParam(pageStr, '/search', sp);

  const query = typeof sp.q === 'string' ? sp.q.trim() : '';
  const { sortBy, sortOrder, perPage } = parseSortParams(sp);

  const { posts, pagination } = await getCouplets({ page, perPage, searchQuery: query, sortBy, sortOrder });

  const title = query ? `Search results for "${query}" — Page ${page}` : `Search — Page ${page}`;

  return (
    <ArchivePageLayout
      pageSchema={PAGE_SCHEMA}
      pageTitle={title}
      pageDescription="Find couplets by keyword, theme, or meaning"
      posts={posts}
      pagination={pagination}
      baseUrl="/search"
      currentSortBy={sortBy}
      currentSortOrder={sortOrder}
      showSidebar={false}
    />
  );
}
