import type { JSX } from 'react';

import { TaxonomyArchiveContent } from '@/components/common/TaxonomyArchiveContent';
import { getTagBySlug } from '@/lib/server/couplets';
import type { SortBy, SortOrder } from '@/types';

/**
 * Shared tag archive content used by both the base and paginated routes.
 *
 * @param {{ slug: string; page: number; sort: { sortBy: SortBy; sortOrder: SortOrder } }} props - Component props.
 *
 * @returns {Promise<JSX.Element>} The tag archive page content.
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
        const tag = await getTagBySlug(slug);
        return tag
          ? { name: tag.name, description: tag.meta_description, meta_description: tag.meta_description }
          : null;
      }}
      filterField="tag"
      schemaPath="tag"
      breadcrumbParent={{ name: 'Tags', path: 'tags' }}
      getEmptyMessage={(name) => `No couplets found with the tag "${name}".`}
      getPageHeader={(name) => ({ title: name, description: `Couplets tagged with "${name}"` })}
    />
  );
}
