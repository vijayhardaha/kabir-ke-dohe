import type { JSX } from 'react';

import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ArchiveListing } from '@/components/features/ArchiveListing';
import { Container } from '@/components/layout/Container';
import { PageLayout } from '@/components/layout/PageLayout';
import { getTagBySlug as getTagFromDb, getCouplets } from '@/lib/server/couplets';

interface TagPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Tag page that displays a paginated, filtered list of couplets for a given tag.
 *
 * @param {TagPageProps} props - Component props
 * @param {Promise<{ slug: string }>} props.params - Route parameters containing the tag slug.
 * @param {Promise<Record<string, string | string[] | undefined>>} props.searchParams - URL search parameters for pagination and sorting.
 *
 * @returns {Promise<JSX.Element>} The tag-specific couplets listing page.
 */
export default async function TagPage({ params, searchParams }: TagPageProps): Promise<JSX.Element> {
  const { slug } = await params;
  const sp = await searchParams;
  const page = typeof sp.page === 'string' ? Math.max(1, parseInt(sp.page, 10) || 1) : 1;
  const sortBy = typeof sp.sort_by === 'string' ? sp.sort_by : 'number';
  const sortOrder = typeof sp.sort_order === 'string' ? sp.sort_order : 'asc';
  const perPage = 10;

  const tag = await getTagFromDb(slug);

  if (!tag) {
    notFound();
  }

  // Use tag name from DB for the page title
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

        <ArchiveListing
          posts={posts}
          pagination={pagination}
          baseUrl={`/tag/${slug}`}
          title={tagName}
          description={`Couplets tagged with "${tagName}"`}
          emptyMessage={`No couplets found with the tag "${tagName}".`}
          currentSortBy={sortBy}
          currentSortOrder={sortOrder}
        />
      </Container>
    </PageLayout>
  );
}
