import type { JSX } from 'react';

import { breadcrumbSchema } from '@vijayhardaha/schema-builder';
import { JsonLd } from '@vijayhardaha/schema-builder/react';
import { notFound } from 'next/navigation';

import { ArchiveListing } from '@/components/features/ArchiveListing';
import { Container } from '@/components/layout/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageLayout } from '@/components/layout/PageLayout';
import { ArchiveSidebar } from '@/components/widgets/ArchiveSidebar';
import { getTagBySlug, getCouplets } from '@/lib/server/couplets';
import type { GetCoupletsOptions } from '@/lib/server/couplets';
import { globalSchema, collectionPageSchema } from '@/lib/utils/schema';
import { siteUrl } from '@/lib/utils/seo';

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

  const rootUrl = siteUrl();

  const { posts, pagination } = await getCouplets({
    page,
    perPage: 10,
    tag: slug,
    sortBy: sort.sortBy as GetCoupletsOptions['sortBy'],
    sortOrder: sort.sortOrder as GetCoupletsOptions['sortOrder'],
  });

  const itemListElement = posts.map((post, idx) => ({
    '@type': 'ListItem',
    position: (page - 1) * 10 + idx + 1,
    url: `${rootUrl}/couplet/${post.slug}`,
    name: post.text_hi.slice(0, 120),
  }));

  const tagSchema = [
    ...globalSchema(),
    collectionPageSchema(
      { rootUrl, path: `tag/${slug}` },
      {
        name: `${tagName} — Kabir Ke Dohe`,
        description: `Couplets tagged with "${tagName}" from Kabir's teachings.`,
        mainEntity: { '@type': 'ItemList', numberOfItems: pagination.total, itemListElement },
      }
    ),
    breadcrumbSchema({
      rootUrl,
      items: [
        { name: 'Home', path: '' },
        { name: 'Tags', path: 'tags' },
        { name: tagName, path: `tag/${slug}` },
      ],
    }),
  ];

  return (
    <>
      <JsonLd data={tagSchema} />
      <PageLayout>
        <Container>
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
    </>
  );
}
