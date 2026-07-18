/**
 * @module fetcher - Data fetching helpers for site scripts.
 *
 * Each function returns typed data from Supabase. The calling script is
 * responsible for writing results to `data.json`.
 */

import type { SupabaseClient } from '@supabase/supabase-js';

import type { PostSnapshot, CategoryWithCount, TagWithCount } from './types';

const PAGE_SIZE = 1000;

/**
 * Fetch all published posts in paginated batches.
 *
 * @param {SupabaseClient} supabase - The Supabase client instance.
 *
 * @returns {Promise<PostSnapshot[]>} All published PostSnapshot records.
 */
export async function fetchAllPublishedPosts(supabase: SupabaseClient): Promise<PostSnapshot[]> {
  const all: PostSnapshot[] = [];
  let page = 0;

  for (;;) {
    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, error } = await supabase
      .from('posts')
      .select(
        `id, slug, identifier, post_number, post_order, text_hi, text_en,
         meaning_hi, meaning_en, core_message_hi, core_message_en,
         is_popular, is_featured, view_count, post_status,
         category:categories(name, slug),
         tags:post_tags(tag:tags(id, name, slug))`
      )
      .eq('post_status', 'publish')
      .order('post_order', { ascending: true })
      .range(from, to);

    if (error) {
      console.error(`Failed to fetch posts (page ${page}): ${error.message}`);
      break;
    }

    if (!data || data.length === 0) break;

    all.push(...(data as unknown as PostSnapshot[]));
    page++;

    if (data.length < PAGE_SIZE) break;
  }

  return all;
}

/**
 * Fetch all categories that have at least one published post.
 *
 * @param {SupabaseClient} supabase - The Supabase client instance.
 *
 * @returns {Promise<CategoryWithCount[]>} Category records with published post counts.
 */
export async function fetchCategoriesWithCounts(supabase: SupabaseClient): Promise<CategoryWithCount[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('id, slug, name, description, posts!inner(post_status)')
    .eq('posts.post_status', 'publish')
    .order('name', { ascending: true });

  if (error) {
    console.error(`Failed to fetch categories: ${error.message}`);
    return [];
  }

  return ((data ?? []) as unknown as Array<{
    id: string;
    slug: string;
    name: string;
    description: string | null;
    posts: Array<unknown>;
  }>).map((cat) => ({
    id: cat.id,
    slug: cat.slug,
    name: cat.name,
    description: cat.description,
    post_count: cat.posts.length,
  }));
}

/**
 * Fetch all tags that have at least one published post mapping.
 *
 * @param {SupabaseClient} supabase - The Supabase client instance.
 *
 * @returns {Promise<TagWithCount[]>} Tag records with published post counts.
 */
export async function fetchTagsWithCounts(supabase: SupabaseClient): Promise<TagWithCount[]> {
  const { data, error } = await supabase
    .from('tags')
    .select('id, slug, name, post_tags!inner(post:posts!inner(post_status))')
    .eq('post_tags.post.post_status', 'publish')
    .order('name', { ascending: true });

  if (error) {
    console.error(`Failed to fetch tags: ${error.message}`);
    return [];
  }

  return ((data ?? []) as unknown as Array<{
    id: string;
    slug: string;
    name: string;
    post_tags: Array<unknown>;
  }>).map((tag) => ({
    id: tag.id,
    slug: tag.slug,
    name: tag.name,
    post_count: tag.post_tags.length,
  }));
}

/**
 * Get the count of published posts, optionally filtered by popular or featured flags.
 *
 * @param {SupabaseClient} supabase - The Supabase client instance.
 * @param {{ isPopular?: boolean; isFeatured?: boolean }} [filters] - Optional boolean filters.
 *
 * @returns {Promise<number>} The matching post count, or zero on error.
 */
export async function getPublishedPostCount(
  supabase: SupabaseClient,
  filters?: { isPopular?: boolean; isFeatured?: boolean }
): Promise<number> {
  let query = supabase
    .from('posts')
    .select('id', { count: 'exact', head: true })
    .eq('post_status', 'publish');

  if (filters?.isPopular) {
    query = query.eq('is_popular', true);
  }

  if (filters?.isFeatured) {
    query = query.eq('is_featured', true);
  }

  const { count, error } = await query;

  if (error) {
    console.error(`Failed to get post count: ${error.message}`);
    return 0;
  }

  return count ?? 0;
}
