import type { JSX } from 'react';

import { breadcrumbSchema, collectionPageSchema } from '@vijayhardaha/schema-builder';
import { JsonLd } from '@vijayhardaha/schema-builder/react';
import { notFound } from 'next/navigation';

import { ArchiveListing } from '@/components/features/ArchiveListing';
import { Container } from '@/components/layout/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageLayout } from '@/components/layout/PageLayout';
import { ArchiveSidebar } from '@/components/widgets/ArchiveSidebar';
import { fetchCategoryBySlug, getCouplets } from '@/lib/server/couplets';
import { globalSchema } from '@/lib/utils/schema';
import { siteUrl } from '@/lib/utils/seo';
import type { SortBy, SortOrder } from '@/types';

// ── Props ─────────────────────────────────────────────────────────────────

/**
 * Props for the ArchiveContent component.
 *
 * @type {ArchiveContentProps}
 * @property {string} slug - Category slug.
 * @property {number} page - Current page number.
 * @property {{ sortBy: SortBy; sortOrder: SortOrder }} sort - Sort parameters.
 */
interface ArchiveContentProps {
  slug: string;
  page: number;
  sort: { sortBy: SortBy; sortOrder: SortOrder };
}

/**
 * Shared category archive content used by both the base and paginated routes.
 * Validates the slug against the database, fetches the category and couplets, and renders the full page layout.
 *
 * @param {ArchiveContentProps} props - Component props.
 *
 * @returns {Promise<JSX.Element>} The category archive page content.
 */
export async function ArchiveContent({ slug, page, sort }: ArchiveContentProps): Promise<JSX.Element> {
  // Validate slug against the database
  const category = await fetchCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const rootUrl = siteUrl();

  const { posts, pagination } = await getCouplets({
    page,
    perPage: 10,
    category: slug,
    sortBy: sort.sortBy,
    sortOrder: sort.sortOrder,
  });

  const itemListElement = posts.map((post, idx) => ({
    '@type': 'ListItem',
    position: (page - 1) * 10 + idx + 1,
    url: `${rootUrl}/couplet/${post.slug}`,
    name: post.text_hi.slice(0, 120),
  }));

  const categorySchema = [
    ...globalSchema(),
    collectionPageSchema(
      { rootUrl, path: `category/${slug}` },
      {
        name: `${category.name} — Kabir Ke Dohe`,
        description: category.description ?? `${category.name} couplets from Kabir's teachings.`,
        mainEntity: { '@type': 'ItemList', numberOfItems: pagination.total, itemListElement },
      }
    ),
    breadcrumbSchema({
      rootUrl,
      items: [
        { name: 'Home', path: '' },
        { name: 'Categories', path: 'categories' },
        { name: category.name, path: `category/${slug}` },
      ],
    }),
  ];

  return (
    <>
      <JsonLd data={categorySchema} />
      <PageLayout>
        <Container>
          {/* ═══════════════ PAGE HEADER ═══════════════ */}
          <PageHeader title={category.name} description={category.description ?? undefined} />

          {/* ═══════════════ COUPLET LISTING ═══════════════ */}
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
