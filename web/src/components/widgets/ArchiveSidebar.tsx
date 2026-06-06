import type { JSX } from 'react';

import { getPopularCoupletsForWidget, getTagsByPostCount } from '@/lib/server/couplets';

import { CategoriesWidget } from './CategoriesWidget';
import { PopularCoupletsWidget } from './PopularCoupletsWidget';
import { SearchWidget } from './SearchWidget';
import { TagCloudWidget } from './TagCloudWidget';

/**
 * Archive sidebar containing search, categories, tag cloud, and popular couplets widgets.
 * Fetches its own data as a server component.
 *
 * @returns {Promise<JSX.Element>} Archive sidebar component
 */
export async function ArchiveSidebar(): Promise<JSX.Element> {
  const [tags, popularCouplets] = await Promise.all([getTagsByPostCount(12), getPopularCoupletsForWidget(6)]);

  return (
    <aside className="flex flex-col gap-8">
      <SearchWidget />
      <CategoriesWidget />
      <TagCloudWidget tags={tags} />
      <PopularCoupletsWidget couplets={popularCouplets} />
    </aside>
  );
}
