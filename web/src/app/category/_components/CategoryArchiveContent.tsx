import type { JSX } from 'react';

import { webPageSchema } from '@vijayhardaha/schema-builder';
import { JsonLd } from '@vijayhardaha/schema-builder/react';
import { notFound } from 'next/navigation';

import { ArchiveListing } from '@/components/features/ArchiveListing';
import { Container } from '@/components/layout/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageLayout } from '@/components/layout/PageLayout';
import { ArchiveSidebar } from '@/components/widgets/ArchiveSidebar';
import { getCategoryBySlug } from '@/constants/categories';
import { fetchCategoryBySlug, getCouplets } from '@/lib/server/couplets';
import type { GetCoupletsOptions } from '@/lib/server/couplets';
import { globalSchema } from '@/lib/utils/schema';
import { siteUrl } from '@/lib/utils/seo';

/**
 * Props for the CategoryArchiveContent component.
 *
 * @type {CategoryArchiveContentProps}
 * @property {string} slug - Category slug.
 * @property {number} page - Current page number.
 * @property {{ sortBy: string; sortOrder: string }} sort - Sort parameters.
 */
interface CategoryArchiveContentProps {
  slug: string;
  page: number;
  sort: { sortBy: string; sortOrder: string };
}

/**
 * Shared category archive content used by both the base and paginated routes.
 * Validates the slug, fetches the category and couplets, and renders the full page layout.
 *
 * @param {CategoryArchiveContentProps} props - Component props.
 *
 * @returns {Promise<JSX.Element>} The category archive page content.
 */
export async function CategoryArchiveContent({ slug, page, sort }: CategoryArchiveContentProps): Promise<JSX.Element> {
  // Validate slug against predefined categories first
  if (!getCategoryBySlug(slug)) {
    notFound();
  }

  const category = await fetchCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const rootUrl = siteUrl();
  const categorySchema = [
    ...globalSchema(),
    webPageSchema({ rootUrl, path: `category/${slug}` }, { name: `${category.name} — Kabir Ke Dohe` }),
  ];

  const { posts, pagination } = await getCouplets({
    page,
    perPage: 10,
    category: slug,
    sortBy: sort.sortBy as GetCoupletsOptions['sortBy'],
    sortOrder: sort.sortOrder as GetCoupletsOptions['sortOrder'],
  });

  return (
    <>
      <JsonLd data={categorySchema} />
      <PageLayout>
        <Container>
          <PageHeader title={category.name} description={category.description ?? undefined} />
          <ArchiveListing
            posts={posts}
            pagination={pagination}
            baseUrl={`/category/${slug}`}
            emptyMessage={`No couplets found in ${category.name}.`}
            currentSortBy={sort.sortBy}
            currentSortOrder={sort.sortOrder}
            showSidebar
            sidebar={<ArchiveSidebar />}
          />
        </Container>
      </PageLayout>
    </>
  );
}
