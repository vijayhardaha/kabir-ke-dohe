#!/usr/bin/env bun
/**
 * ======================================================================
 * Sitemap Path Generator
 * ======================================================================
 * Purpose: Fetch all posts, categories, and tags from Supabase (using
 *          production environment variables) and generate a sorted list
 *          of all dynamic page URLs for the sitemap.
 *
 * Output:  Writes one URL per line to `web/public/paths.txt`.
 *          Each line is a full absolute URL starting with the site domain.
 *
 * Usage:
 *          bun run generate:paths                               (dev, uses local env)
 *          bun --env-file=.env.production run generate:paths     (production)
 *
 * Env:     Requires NEXT_PUBLIC_SUPABASE_URL and
 *          NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY to be set
 *          in the referenced .env file.
 *          Bun's `--env-file` flag loads the variables before the
 *          script runs.
 * ======================================================================
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

import { createClient } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// Type interfaces for Supabase query results
// ---------------------------------------------------------------------------

/** A published post row — slug only is needed for sitemap generation. */
interface PostSlug {
  slug: string;
}

/** A category row with its published posts for computing pagination counts. */
interface CategoryWithPosts {
  slug: string;
  posts: { post_status: string }[];
}

/** A tag row with its published post mappings for computing pagination counts. */
interface TagWithPosts {
  slug: string;
  post_tags: { post: { post_status: string } }[];
}

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const SITE_URL = 'https://kabirdohehub.vercel.app';
const PER_PAGE = 10;

// ---------------------------------------------------------------------------
// Supabase client
// ---------------------------------------------------------------------------

/**
 * Resolves the configured Supabase project URL from the environment.
 *
 * @returns {string} Supabase project URL.
 *
 * @throws {Error} When NEXT_PUBLIC_SUPABASE_URL environment variable is missing.
 */
function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable.');
  }

  return url;
}

/**
 * Resolves the configured Supabase publishable key from the environment.
 *
 * @returns {string} Supabase publishable key.
 *
 * @throws {Error} When NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY environment variable is missing.
 */
function getSupabaseKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
  if (!key) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY environment variable.');
  }

  return key;
}

/**
 * Creates a Supabase client with session persistence disabled.
 *
 * @returns {ReturnType<typeof createClient>} Supabase client instance.
 */
function createSupabaseClient(): ReturnType<typeof createClient> {
  return createClient(getSupabaseUrl(), getSupabaseKey(), { auth: { persistSession: false } });
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Counts published posts matching optional popularity and feature filters.
 *
 * @param {ReturnType<typeof createSupabaseClient>} supabase - Supabase client used for queries.
 * @param {{ isPopular?: boolean; isFeatured?: boolean }} [filter] - Optional post filter criteria.
 * @param {boolean} [filter.isPopular] - Whether to filter for popular posts.
 * @param {boolean} [filter.isFeatured] - Whether to filter for featured posts.
 *
 * @returns {Promise<number>} Published post count.
 */
async function getPostCount(
  supabase: ReturnType<typeof createSupabaseClient>,
  filter?: { isPopular?: boolean; isFeatured?: boolean }
): Promise<number> {
  let query = supabase.from('posts').select('id', { count: 'exact', head: true }).eq('post_status', 'publish');

  if (filter?.isPopular) {
    query = query.eq('is_popular', true);
  }
  if (filter?.isFeatured) {
    query = query.eq('is_featured', true);
  }

  const { count, error } = await query;

  if (error) {
    console.error(`Failed to get post count: ${error.message}`);
    return 0;
  }

  return count ?? 0;
}

/**
 * Generates paginated archive URLs beyond the first page.
 *
 * @param {string} basePath - Relative archive path without page suffix.
 * @param {number} totalCount - Total item count for pagination.
 *
 * @returns {string[]} Absolute pagination URLs.
 */
function generatePaginationPaths(basePath: string, totalCount: number): string[] {
  if (totalCount <= 0) return [];

  const totalPages = Math.ceil(totalCount / PER_PAGE);
  const paths: string[] = [];

  for (let page = 2; page <= totalPages; page++) {
    paths.push(`${SITE_URL}${basePath}/${page}`);
  }

  return paths;
}

/**
 * Writes deduplicated and sorted sitemap URLs to the public paths file.
 *
 * @param {string[]} urls - Absolute sitemap URLs to persist.
 */
function writePathsFile(urls: string[]): void {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const outputDir = path.resolve(__dirname, '../public');
  const outputPath = path.join(outputDir, 'paths.txt');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Deduplicate and sort
  const sorted = [...new Set(urls)].sort();
  fs.writeFileSync(outputPath, sorted.join('\n') + '\n', 'utf-8');

  console.log(`✅ Wrote ${sorted.length} URLs to ${outputPath}`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

/**
 * Builds the sitemap path list and writes it to the public paths file.
 */
async function main(): Promise<void> {
  console.log('🔍 Fetching data from Supabase...');
  const supabase = createSupabaseClient();
  const allUrls: string[] = [];

  // 1. Fetch all published post slugs
  console.log('  → Fetching post slugs...');
  let allSlugs: string[] = [];
  let page = 0;
  const pageSize = 1000;

  while (true) {
    const from = page * pageSize;
    const to = from + pageSize - 1;

    const { data, error } = await supabase
      .from('posts')
      .select('slug')
      .eq('post_status', 'publish')
      .order('post_order', { ascending: true })
      .range(from, to);

    if (error) {
      console.error(`Failed to fetch post slugs: ${error.message}`);
      break;
    }

    if (!data || data.length === 0) break;

    allSlugs.push(...data.map((row: PostSlug) => row.slug));
    page++;

    if (data.length < pageSize) break;
  }

  console.log(`  → Found ${allSlugs.length} posts`);

  // Generate /couplet/{slug} URLs
  for (const slug of allSlugs) {
    allUrls.push(`${SITE_URL}/couplet/${slug}`);
  }

  // 2. Fetch all categories with post counts
  console.log('  → Fetching categories...');
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('slug, posts!inner(post_status)')
    .eq('posts.post_status', 'publish');

  if (catError) {
    console.error(`Failed to fetch categories: ${catError.message}`);
  } else {
    for (const cat of (categories ?? []) as CategoryWithPosts[]) {
      const count = Array.isArray(cat.posts) ? cat.posts.length : 0;
      allUrls.push(`${SITE_URL}/category/${cat.slug}`);
      const paginationPaths = generatePaginationPaths(`/category/${cat.slug}`, count);
      allUrls.push(...paginationPaths);
    }
    console.log(`  → Found ${categories?.length ?? 0} categories`);
  }

  // 3. Fetch all tags with post counts
  console.log('  → Fetching tags...');
  const { data: tags, error: tagError } = await supabase
    .from('tags')
    .select('slug, post_tags!inner(post:posts!inner(post_status))')
    .eq('post_tags.post.post_status', 'publish');

  if (tagError) {
    console.error(`Failed to fetch tags: ${tagError.message}`);
  } else {
    for (const tag of (tags ?? []) as TagWithPosts[]) {
      const count = Array.isArray(tag.post_tags) ? tag.post_tags.length : 0;
      allUrls.push(`${SITE_URL}/tag/${tag.slug}`);
      const paginationPaths = generatePaginationPaths(`/tag/${tag.slug}`, count);
      allUrls.push(...paginationPaths);
    }
    console.log(`  → Found ${tags?.length ?? 0} tags`);
  }

  // 4. Total post count for /couplets pagination
  console.log('  → Computing post counts for archive pages...');
  const totalPosts = await getPostCount(supabase);
  allUrls.push(`${SITE_URL}/couplets`);
  const coupletsPagination = generatePaginationPaths('/couplets', totalPosts);
  allUrls.push(...coupletsPagination);
  console.log(`  → ${totalPosts} total posts → ${coupletsPagination.length + 1} page(s)`);

  // 5. Popular couplets pagination
  const popularCount = await getPostCount(supabase, { isPopular: true });
  allUrls.push(`${SITE_URL}/popular-couplets`);
  const popularPagination = generatePaginationPaths('/popular-couplets', popularCount);
  allUrls.push(...popularPagination);
  console.log(`  → ${popularCount} popular posts → ${popularPagination.length + 1} page(s)`);

  // 6. Featured couplets pagination
  const featuredCount = await getPostCount(supabase, { isFeatured: true });
  allUrls.push(`${SITE_URL}/featured-couplets`);
  const featuredPagination = generatePaginationPaths('/featured-couplets', featuredCount);
  allUrls.push(...featuredPagination);
  console.log(`  → ${featuredCount} featured posts → ${featuredPagination.length + 1} page(s)`);

  // Write output
  writePathsFile(allUrls);
}

main().catch((err) => {
  console.error('❌ Script failed:', err);
  process.exit(1);
});
