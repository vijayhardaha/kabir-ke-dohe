#!/usr/bin/env bun
/**
 * ======================================================================
 * Data Fetcher
 * ======================================================================
 * Purpose: Fetch all posts, categories, and tags from Supabase and write
 *          them to `data.json` for use by downstream scripts (paths, llms.txt).
 *
 * Output:  `scripts/data.json` — a JSON snapshot of all site content.
 *
 * Usage:
 *   bun run fetch:data                                     (dev, local env)
 *   bun --env-file=.env.production run fetch:data          (production)
 *
 * Env:  Requires NEXT_PUBLIC_SUPABASE_URL and
 *       NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY to be set.
 * ======================================================================
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

import { createSupabaseClient } from './utils/supabase';
import {
  fetchAllPublishedPosts,
  fetchCategoriesWithCounts,
  fetchTagsWithCounts,
  getPublishedPostCount,
} from './utils/fetcher';
import type { SiteData } from './utils/types';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.resolve(__dirname, 'data.json');

/**
 * Orchestrate the data fetch: create the Supabase client, pull posts,
 * categories, tags, and counts concurrently, then write the result to
 * `data.json` for downstream scripts.
 *
 * @returns {Promise<void>} Resolves when data.json has been written.
 */
async function main(): Promise<void> {
  console.log('Fetching site data from Supabase...\n');

  // 1. Create Supabase client
  const supabase = createSupabaseClient();

  // 2. Fetch all data concurrently
  const [posts, categories, tags, totalCount, popularCount, featuredCount] = await Promise.all([
    fetchAllPublishedPosts(supabase),
    fetchCategoriesWithCounts(supabase),
    fetchTagsWithCounts(supabase),
    getPublishedPostCount(supabase),
    getPublishedPostCount(supabase, { isPopular: true }),
    getPublishedPostCount(supabase, { isFeatured: true }),
  ]);

  console.log(`  → ${posts.length} published posts`);
  console.log(`  → ${categories.length} categories`);
  console.log(`  → ${tags.length} tags`);
  console.log(`  → ${popularCount} popular`);
  console.log(`  → ${featuredCount} featured`);

  // 3. Build the site data object
  const siteData: SiteData = {
    posts,
    categories,
    tags,
    totalCount,
    popularCount,
    featuredCount,
    fetchedAt: new Date().toISOString(),
  };

  // 4. Write to data.json
  fs.writeFileSync(DATA_FILE, JSON.stringify(siteData, null, 2), 'utf-8');
  console.log(`\nData written to ${DATA_FILE}`);
}

main().catch((err) => {
  console.error('❌ Script failed:', err);
  process.exit(1);
});
