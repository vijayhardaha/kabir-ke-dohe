import type { JSX } from 'react';

import { JsonLd } from '@vijayhardaha/schema-builder/react';

import { ArchiveListing } from '@/components/features/ArchiveListing';
import { Container } from '@/components/layout/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageLayout } from '@/components/layout/PageLayout';
import { ArchiveSidebar } from '@/components/widgets/ArchiveSidebar';
import type { Post, PaginationMeta, SortBy, SortOrder } from '@/types';

// ── Props ─────────────────────────────────────────────────────────────────

interface ArchivePageLayoutProps {
  pageSchema: Record<string, unknown>[];
  pageTitle: string;
  pageDescription: string;
  posts: Post[];
  pagination: PaginationMeta;
  baseUrl: string;
  currentSortBy: SortBy;
  currentSortOrder: SortOrder;
  showSidebar?: boolean;
  searchForm?: JSX.Element;
}

/**
 * Reusable page layout for all archive listing pages (couplets,
 * popular-couplets, featured-couplets, and search).
 *
 * Renders the JSON-LD schema, PageHeader, optional search form,
 * ArchiveListing, and sidebar.
 *
 * @param {ArchivePageLayoutProps} props - Component props.
 * @param {Record<string, unknown>[]} props.pageSchema - JSON-LD schema array.
 * @param {string} props.pageTitle - Page header title.
 * @param {string} props.pageDescription - Page header description.
 * @param {Post[]} props.posts - List of posts to display.
 * @param {PaginationMeta} props.pagination - Pagination metadata.
 * @param {string} props.baseUrl - Base URL for pagination links.
 * @param {SortBy} props.currentSortBy - Current sort-by field.
 * @param {SortOrder} props.currentSortOrder - Current sort order.
 * @param {boolean} [props.showSidebar] - Whether to show the sidebar.
 * @param {JSX.Element} [props.searchForm] - Optional search form element.
 *
 * @returns {JSX.Element} The archive page layout.
 */
export function ArchivePageLayout({
  pageSchema,
  pageTitle,
  pageDescription,
  posts,
  pagination,
  baseUrl,
  currentSortBy,
  currentSortOrder,
  showSidebar = true,
  searchForm,
}: ArchivePageLayoutProps): JSX.Element {
  return (
    <>
      {/* ── JSON‑LD schema ── */}
      <JsonLd data={pageSchema} />

      <PageLayout>
        <Container>
          {/* ═══════════════ PAGE HEADER ═══════════════ */}
          <PageHeader title={pageTitle} description={pageDescription} />

          {/* ── Search form (only shown on search pages) ── */}
          {searchForm && <div className="mb-8">{searchForm}</div>}

          {/* ═══════════════ ARCHIVE LISTING ═══════════════ */}
          <ArchiveListing
            posts={posts}
            pagination={pagination}
            baseUrl={baseUrl}
            currentSortBy={currentSortBy}
            currentSortOrder={currentSortOrder}
            showSidebar={showSidebar}
            sidebar={showSidebar ? <ArchiveSidebar /> : undefined}
          />
        </Container>
      </PageLayout>
    </>
  );
}
