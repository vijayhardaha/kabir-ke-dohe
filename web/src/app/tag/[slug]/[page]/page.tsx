import type { JSX } from 'react';

import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ArchiveListing } from '@/components/features/ArchiveListing';
import { Container } from '@/components/layout/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageLayout } from '@/components/layout/PageLayout';
import { getTagBySlug as getTagFromDb, getCouplets } from '@/lib/server/couplets';
import { validatePageParam } from '@/lib/server/page-utils';

/**
 * Props for the paginated tag page.
 *
 * @type {TagPageProps}
 * @property {Promise<{ slug: string; page: string }>} params - Route parameters containing tag slug and page number.
 * @property {Promise<Record<string, string | string[] | undefined>>} searchParams - URL search parameters for sorting.
 */
interface TagPageProps {
  params: Promise<{ slug: string; page: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Paginated tag page — handles `/tag/xyz/2`, `/tag/xyz/3`, etc.
 * Redirects to `/tag/xyz` when page is 1 or invalid.
 *
 * @param {TagPageProps} props - Component props.
 * @param {Promise<{ slug: string; page: string }>} props.params - Route parameters containing tag slug and page number.
 * @param {Promise<Record<string, string | string[] | undefined>>} props.searchParams - URL search parameters for sorting.
 *
 * @returns {Promise<JSX.Element>} The paginated tag couplets listing page.
 */
export default async function TagPage({ params, searchParams }: TagPageProps): Promise<JSX.Element> {
  const { slug, page: pageStr } = await params;
  const sp = await searchParams;
  const page = validatePageParam(pageStr, `/tag/${slug}`, sp);
  const sortBy = typeof sp.sort_by === 'string' ? sp.sort_by : 'number';
  const sortOrder = typeof sp.sort_order === 'string' ? sp.sort_order : 'asc';
  const perPage = 10;

  const tag = await getTagFromDb(slug);

  if (!tag) {
    notFound();
  }

  const tagName = tag.name;

  const { posts, pagination } = await getCouplets({
    page,
    perPage,
    tag: slug,
    sortBy: sortBy as 'number' | 'text_en' | 'text_hi',
    sortOrder: sortOrder as 'asc' | 'desc',
  });

  return (
    <PageLayout>
      <Container>
        {/* Back link */}
        <Link
          href="/tags"
          className="text-muted-foreground hover:text-primary mb-6 inline-flex items-center gap-1 text-sm font-semibold no-underline transition-colors duration-200"
        >
          &larr; Back to Tags
        </Link>

        <PageHeader title={tagName} description={`Couplets tagged with "${tagName}"`} />
        <ArchiveListing
          posts={posts}
          pagination={pagination}
          baseUrl={`/tag/${slug}`}
          emptyMessage={`No couplets found with the tag "${tagName}".`}
          currentSortBy={sortBy}
          currentSortOrder={sortOrder}
        />
      </Container>
    </PageLayout>
  );
}
