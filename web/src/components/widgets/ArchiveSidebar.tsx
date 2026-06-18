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
    <aside className="sticky top-10 flex flex-col gap-8">
      {/* ── Search widget ── */}
      <SearchWidget />
      {/* ── Categories widget ── */}
      <CategoriesWidget />
      {/* ── Tag cloud widget ── */}
      <TagCloudWidget tags={tags} />
      {/* ── Popular couplets widget ── */}
      <PopularCoupletsWidget couplets={popularCouplets} />
    </aside>
  );
}
