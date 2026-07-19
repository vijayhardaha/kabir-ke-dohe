import type { JSX } from 'react';

import { TaxonomyArchiveContent } from '@/components/common/TaxonomyArchiveContent';
import { fetchCategoryBySlug } from '@/lib/server/couplets';
import type { SortBy, SortOrder } from '@/types';

/**
 * Shared category archive content used by both the base and paginated routes.
 *
 * @param {{ slug: string; page: number; sort: { sortBy: SortBy; sortOrder: SortOrder } }} props - Component props.
 *
 * @returns {Promise<JSX.Element>} The category archive page content.
 */
export async function ArchiveContent({
  slug,
  page,
  sort,
}: {
  slug: string;
  page: number;
  sort: { sortBy: SortBy; sortOrder: SortOrder };
}): Promise<JSX.Element> {
  return (
    <TaxonomyArchiveContent
      slug={slug}
      page={page}
      sort={sort}
      fetchEntity={async () => {
        const cat = await fetchCategoryBySlug(slug);
        return cat ? { name: cat.name, description: cat.description, meta_description: cat.meta_description } : null;
      }}
      filterField="category"
      schemaPath="category"
      breadcrumbParent={{ name: 'Categories', path: 'categories' }}
      getEmptyMessage={(name) => `No couplets found in ${name}.`}
      getPageHeader={(name, description) => ({ title: name, description: description ?? undefined })}
    />
  );
}
