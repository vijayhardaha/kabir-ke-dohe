import type { JSX } from 'react';

import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ArchiveListing } from '@/components/features/ArchiveListing';
import { Container } from '@/components/layout/Container';
import { PageLayout } from '@/components/layout/PageLayout';
import { getCategoryBySlug } from '@/constants/categories';
import { getCategoryBySlug as getCategoryFromDb, getCouplets } from '@/lib/server/couplets';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Category page that displays a paginated, filtered list of couplets for a given category.
 *
 * @param {CategoryPageProps} props - Component props
 * @param {Promise<{ slug: string }>} props.params - Route parameters containing the category slug.
 * @param {Promise<Record<string, string | string[] | undefined>>} props.searchParams - URL search parameters for pagination and sorting.
 *
 * @returns {Promise<JSX.Element>} The category-specific couplets listing page.
 */
export default async function CategoryPage({ params, searchParams }: CategoryPageProps): Promise<JSX.Element> {
  const { slug } = await params;
  const sp = await searchParams;
  const page = typeof sp.page === 'string' ? Math.max(1, parseInt(sp.page, 10) || 1) : 1;
  const sortBy = typeof sp.sort_by === 'string' ? sp.sort_by : 'number';
  const sortOrder = typeof sp.sort_order === 'string' ? sp.sort_order : 'asc';
  const perPage = 10;

  // Validate slug against predefined categories first
  if (!getCategoryBySlug(slug)) {
    notFound();
  }

  const category = await getCategoryFromDb(slug);

  if (!category) {
    notFound();
  }

  const { posts, pagination } = await getCouplets({
    page,
    perPage,
    category: slug,
    sortBy: sortBy as 'number' | 'text_en' | 'text_hi',
    sortOrder: sortOrder as 'asc' | 'desc',
  });

  return (
    <PageLayout>
      <Container>
        {/* Back link */}
        <Link
          href="/couplets"
          className="text-muted-foreground hover:text-primary mb-6 inline-flex items-center gap-1 text-sm font-semibold no-underline transition-colors duration-200"
        >
          &larr; Back to Couplets
        </Link>

        <ArchiveListing
          posts={posts}
          pagination={pagination}
          baseUrl={`/category/${slug}`}
          title={category.name}
          description={category.description ?? undefined}
          emptyMessage={`No couplets found in ${category.name}.`}
          currentSortBy={sortBy}
          currentSortOrder={sortOrder}
        />
      </Container>
    </PageLayout>
  );
}
