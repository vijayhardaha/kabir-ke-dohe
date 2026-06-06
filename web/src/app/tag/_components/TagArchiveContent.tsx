import type { JSX } from 'react';

import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ArchiveListing } from '@/components/features/ArchiveListing';
import { Container } from '@/components/layout/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageLayout } from '@/components/layout/PageLayout';
import { ArchiveSidebar } from '@/components/widgets/ArchiveSidebar';
import { getTagBySlug, getCouplets } from '@/lib/server/couplets';
import type { GetCoupletsOptions } from '@/lib/server/couplets';

/**
 * Props for the TagArchiveContent component.
 *
 * @type {TagArchiveContentProps}
 * @property {string} slug - Tag slug.
 * @property {number} page - Current page number.
 * @property {{ sortBy: string; sortOrder: string }} sort - Sort parameters.
 */
interface TagArchiveContentProps {
  slug: string;
  page: number;
  sort: { sortBy: string; sortOrder: string };
}

/**
 * Shared tag archive content used by both the base and paginated routes.
 * Fetches the tag and couplets, and renders the full page layout.
 *
 * @param {TagArchiveContentProps} props - Component props.
 *
 * @returns {Promise<JSX.Element>} The tag archive page content.
 */
export async function TagArchiveContent({ slug, page, sort }: TagArchiveContentProps): Promise<JSX.Element> {
  const tag = await getTagBySlug(slug);

  if (!tag) {
    notFound();
  }

  const tagName = tag.name;

  const { posts, pagination } = await getCouplets({
    page,
    perPage: 10,
    tag: slug,
    sortBy: sort.sortBy as GetCoupletsOptions['sortBy'],
    sortOrder: sort.sortOrder as GetCoupletsOptions['sortOrder'],
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
          currentSortBy={sort.sortBy}
          currentSortOrder={sort.sortOrder}
          showSidebar
          sidebar={<ArchiveSidebar />}
        />
      </Container>
    </PageLayout>
  );
}
