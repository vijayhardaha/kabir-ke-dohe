import type { JSX } from 'react';

import { breadcrumbSchema, collectionPageSchema } from '@vijayhardaha/schema-builder';
import { JsonLd } from '@vijayhardaha/schema-builder/react';
import { notFound } from 'next/navigation';

import { ArchiveListing } from '@/components/features/ArchiveListing';
import { Container } from '@/components/layout/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageLayout } from '@/components/layout/PageLayout';
import { ArchiveSidebar } from '@/components/widgets/ArchiveSidebar';
import { getCouplets } from '@/lib/server/couplets';
import { globalSchema } from '@/lib/utils/schema';
import { siteUrl } from '@/lib/utils/seo';
import type { SortBy, SortOrder } from '@/types';

/**
 * Props for the TaxonomyArchiveContent component.
 *
 * @type {TaxonomyArchiveContentProps}
 * @property {string} slug - Taxonomy term slug.
 * @property {number} page - Current page number.
 * @property {{ sortBy: SortBy; sortOrder: SortOrder }} sort - Sort parameters.
 * @property {() => Promise<{ name: string; description: string | null; meta_description: string | null } | null>} fetchEntity - Function to fetch the taxonomy entity.
 * @property {'category' | 'tag'} filterField - Supabase filter column name.
 * @property {string} schemaPath - URL path prefix for schema (e.g. "category", "tag").
 * @property {{ name: string; path: string }} breadcrumbParent - Parent breadcrumb item.
 * @property {(name: string) => string} getEmptyMessage - Generates empty state message.
 * @property {(name: string, description: string | null) => { title: string; description: string | undefined }} getPageHeader - Generates page header props.
 */
export interface TaxonomyArchiveContentProps {
  slug: string;
  page: number;
  sort: { sortBy: SortBy; sortOrder: SortOrder };
  fetchEntity: () => Promise<{ name: string; description: string | null; meta_description: string | null } | null>;
  filterField: 'category' | 'tag';
  schemaPath: string;
  breadcrumbParent: { name: string; path: string };
  getEmptyMessage: (name: string) => string;
  getPageHeader: (name: string, description: string | null) => { title: string; description: string | undefined };
}

/**
 * Shared content component for taxonomy (category/tag) archive pages.
 *
 * @param {TaxonomyArchiveContentProps} props - Component props.
 *
 * @returns {Promise<JSX.Element>} The taxonomy archive page content.
 */
export async function TaxonomyArchiveContent({
  slug,
  page,
  sort,
  fetchEntity,
  filterField,
  schemaPath,
  breadcrumbParent,
  getEmptyMessage,
  getPageHeader,
}: TaxonomyArchiveContentProps): Promise<JSX.Element> {
  const entity = await fetchEntity();

  if (!entity) {
    notFound();
  }

  const rootUrl = siteUrl();

  const filter = filterField === 'category' ? { category: slug } : { tag: slug };
  const { posts, pagination } = await getCouplets({
    page,
    perPage: 10,
    ...filter,
    sortBy: sort.sortBy,
    sortOrder: sort.sortOrder,
  });

  const itemListElement = posts.map((post, idx) => ({
    '@type': 'ListItem',
    position: (page - 1) * 10 + idx + 1,
    url: `${rootUrl}/couplet/${post.slug}`,
    name: post.text_hi.slice(0, 120),
  }));

  const schema = [
    ...globalSchema(),
    collectionPageSchema(
      { rootUrl, path: `${schemaPath}/${slug}` },
      {
        name: `${entity.name} — Kabir Ke Dohe`,
        description: entity.description ?? `${entity.name} couplets from Kabir's teachings.`,
        mainEntity: { '@type': 'ItemList', numberOfItems: pagination.total, itemListElement },
      }
    ),
    breadcrumbSchema({
      rootUrl,
      items: [
        { name: 'Home', path: '' },
        { name: breadcrumbParent.name, path: breadcrumbParent.path },
        { name: entity.name, path: `${schemaPath}/${slug}` },
      ],
    }),
  ];

  const { title, description } = getPageHeader(entity.name, entity.description);

  return (
    <>
      <JsonLd data={schema} />
      <PageLayout>
        <Container>
          <PageHeader title={title} description={description} />
          <ArchiveListing
            posts={posts}
            pagination={pagination}
            baseUrl={`/${schemaPath}/${slug}`}
            emptyMessage={getEmptyMessage(entity.name)}
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
