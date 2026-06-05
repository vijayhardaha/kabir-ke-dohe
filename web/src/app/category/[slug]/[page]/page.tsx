import type { JSX } from 'react';

import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ArchiveListing } from '@/components/features/ArchiveListing';
import { Container } from '@/components/layout/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageLayout } from '@/components/layout/PageLayout';
import { getCategoryBySlug } from '@/constants/categories';
import { getCategoryBySlug as getCategoryFromDb, getCouplets } from '@/lib/server/couplets';
import { validatePageParam } from '@/lib/server/page-utils';

/**
 * Props for the paginated category page.
 *
 * @type {CategoryPageProps}
 * @property {Promise<{ slug: string; page: string }>} params - Route parameters containing category slug and page number.
 * @property {Promise<Record<string, string | string[] | undefined>>} searchParams - URL search parameters for sorting.
 */
interface CategoryPageProps {
  params: Promise<{ slug: string; page: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Paginated category page — handles `/category/xyz/2`, `/category/xyz/3`, etc.
 * Redirects to `/category/xyz` when page is 1 or invalid.
 *
 * @param {CategoryPageProps} props - Component props.
 * @param {Promise<{ slug: string; page: string }>} props.params - Route parameters containing category slug and page number.
 * @param {Promise<Record<string, string | string[] | undefined>>} props.searchParams - URL search parameters for sorting.
 *
 * @returns {Promise<JSX.Element>} The paginated category couplets listing page.
 */
export default async function CategoryPage({ params, searchParams }: CategoryPageProps): Promise<JSX.Element> {
  const { slug, page: pageStr } = await params;
  const sp = await searchParams;
  const page = validatePageParam(pageStr, `/category/${slug}`, sp);
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

        <PageHeader title={category.name} description={category.description ?? undefined} />
        <ArchiveListing
          posts={posts}
          pagination={pagination}
          baseUrl={`/category/${slug}`}
          emptyMessage={`No couplets found in ${category.name}.`}
          currentSortBy={sortBy}
          currentSortOrder={sortOrder}
        />
      </Container>
    </PageLayout>
  );
}
