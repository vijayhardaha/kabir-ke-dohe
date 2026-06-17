import type { JSX } from 'react';

import { JsonLd } from '@vijayhardaha/schema-builder/react';

import { ArchiveListing } from '@/components/features/ArchiveListing';
import { Container } from '@/components/layout/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageLayout } from '@/components/layout/PageLayout';
import { ArchiveSidebar } from '@/components/widgets/ArchiveSidebar';
import type { Post, PaginationMeta } from '@/types';

// ── Props ─────────────────────────────────────────────────────────────────

interface ArchivePageLayoutProps {
  pageSchema: Record<string, unknown>[];
  pageTitle: string;
  pageDescription: string;
  posts: Post[];
  pagination: PaginationMeta;
  baseUrl: string;
  currentSortBy: string;
  currentSortOrder: string;
  showSidebar?: boolean;
  searchForm?: JSX.Element;
}

/**
 * Reusable page layout for all archive listing pages (couplets,
 * popular-couplets, featured-couplets, and search).
 *
 * Renders the JSON-LD schema, PageHeader, optional search form,
 * ArchiveListing, and sidebar.
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
