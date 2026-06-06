import 'server-only';

import type { Category, CoupletRef, Tag, TagRef, Post, CoupletsResponse } from '@/types';

import { getSupabase } from './supabase';

/**
 * Raw post shape returned by Supabase, used internally before normalisation.
 * Extends {@link Post} but overrides `category` and `tags` with their nested join shapes.
 *
 * @type {SupabasePost}
 * @property {{ name: string; slug: string } | null} category - Joined category data, or null when unassigned.
 * @property {Array<{ tag: { id: string; name: string; slug: string } }>} tags - Joined tags via the post_tags pivot table.
 */
interface SupabasePost extends Omit<Post, 'category' | 'tags'> {
  category: { name: string; slug: string } | null;
  tags: Array<{ tag: { id: string; name: string; slug: string } }>;
}

/**
 * Raw category shape returned by Supabase, used internally.
 *
 * @type {SupabaseCategory}
 * @property {string} id - Unique identifier
 * @property {string} slug - URL‑friendly slug
 * @property {string} name - Display name
 * @property {string | null} description - Category description
 * @property {string | null} meta_description - SEO meta description
 * @property {string} created_at - ISO creation timestamp
 * @property {string} updated_at - ISO last update timestamp
 * @property {Array<Record<string, unknown>>} posts - Related posts (used for count)
 */
interface SupabaseCategory {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
  posts: Array<Record<string, unknown>>;
}

/**
 * Options for the {@link getCouplets} function.
 * All properties are optional; sensible defaults apply when omitted.
 *
 * @interface GetCoupletsOptions
 * @property {number} [page=1] - Page number (1‑based).
 * @property {number} [perPage=10] - Items per page.
 * @property {string} [category] - Filter by category slug.
 * @property {string} [tag] - Filter by tag slug.
 * @property {boolean} [isFeatured] - Filter to featured posts only.
 * @property {boolean} [isPopular] - Filter to popular posts only.
 * @property {string} [searchQuery] - Search keyword to filter by search_text column.
 * @property {'number' | 'text_en' | 'text_hi'} [sortBy='number'] - Sort field.
 * @property {'asc' | 'desc'} [sortOrder='asc'] - Sort direction.
 */
export interface GetCoupletsOptions {
  page?: number;
  perPage?: number;
  category?: string;
  tag?: string;
  isFeatured?: boolean;
  isPopular?: boolean;
  searchQuery?: string;
  sortBy?: 'number' | 'text_en' | 'text_hi';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Fetch a paginated list of published posts with optional filtering and sorting.
 *
 * @param {GetCoupletsOptions} [options] - Query options.
 *
 * @returns {Promise<CoupletsResponse>} Paginated posts with metadata.
 */
export async function getCouplets(options: GetCoupletsOptions = {}): Promise<CoupletsResponse> {
  const {
    page = 1,
    perPage = 10,
    category,
    tag,
    isFeatured,
    isPopular,
    searchQuery,
    sortBy = 'number',
    sortOrder = 'asc',
  } = options;
  const supabase = getSupabase();

  const sortColumnMap: Record<string, string> = { number: 'post_order', text_en: 'text_en', text_hi: 'text_hi' };

  const sortColumn = sortColumnMap[sortBy] || 'post_order';

  const categorySelect = category ? 'category:categories!inner(name, slug)' : 'category:categories(name, slug)';

  const tagsSelect = tag
    ? 'tags:post_tags(tag:tags(id, name, slug)), filter_tags:post_tags!inner(tag:tags!inner(slug))'
    : 'tags:post_tags(tag:tags(id, name, slug))';

  let query = supabase
    .from('posts')
    .select(`*, ${categorySelect}, ${tagsSelect}`, { count: 'exact' })
    .eq('post_status', 'publish')
    .order(sortColumn, { ascending: sortOrder === 'asc' });

  if (category) {
    query = query.eq('category.slug', category);
  }

  if (tag) {
    query = query.eq('filter_tags.tag.slug', tag);
  }

  if (isFeatured) {
    query = query.eq('is_featured', true);
  }

  if (isPopular) {
    query = query.eq('is_popular', true);
  }

  if (searchQuery) {
    query = query.ilike('search_text', `%${searchQuery}%`);
  }

  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  const { data, error, count } = await query.range(from, to);

  if (error) {
    throw new Error(`Failed to fetch couplets: ${error.message}`);
  }

  const posts = ((data ?? []) as unknown as SupabasePost[]).map(normalizePost);
  const total = count ?? 0;

  return { posts, pagination: { page, perPage, total, totalPages: Math.ceil(total / perPage) } };
}

/**
 * Fetch related couplets that share the same category or tags as the current post.
 *
 * @param {string | null} categorySlug - Slug of the current post's category, or null.
 * @param {string[]} tagSlugs - Slugs of the current post's tags.
 * @param {string} excludeSlug - Slug of the current post to exclude.
 * @param {number} [limit] - Maximum number of related couplets to return.
 *
 * @returns {Promise<Array<{ slug: string; text_hi: string; tags: TagRef[] }>>}
 *   Related couplets with slug, Hindi text, and their tags.
 */
export async function getRelatedCouplets(
  categorySlug: string | null,
  tagSlugs: string[],
  excludeSlug: string,
  limit: number = 4
): Promise<Array<{ slug: string; text_hi: string; tags: TagRef[] }>> {
  const supabase = getSupabase();
  const seen = new Set<string>();
  const related: Array<{ slug: string; text_hi: string; tags: TagRef[] }> = [];

  const pushResult = (row: { slug: string; text_hi: string; tags: TagRef[] }): void => {
    if (row.slug === excludeSlug) return;
    if (seen.has(row.slug)) return;
    seen.add(row.slug);
    related.push(row);
  };

  /**
   * Pushes query results into the related list, normalizing tag shapes.
   *
   * @param {Array<{ slug: string; text_hi: string; tags: Array<{ tag: TagRef }> }> | null} data - Raw query rows with nested tag shape, or null.
   */
  const collectResults = (
    data: Array<{ slug: string; text_hi: string; tags: Array<{ tag: TagRef }> }> | null
  ): void => {
    for (const row of data ?? []) {
      pushResult({ slug: row.slug, text_hi: row.text_hi, tags: row.tags.map((t) => t.tag) });
    }
  };

  /**
   * Processes a supabase query response — throws on error, otherwise collects results.
   *
   * @param {Array<{ slug: string; text_hi: string; tags: Array<{ tag: TagRef }> }> | null} data - Raw query rows with nested tag shape, or null.
   * @param {unknown} error - Supabase error object, null on success.
   *
   * @throws {Error} When the Supabase query fails.
   */
  const processQuery = (
    data: Array<{ slug: string; text_hi: string; tags: Array<{ tag: TagRef }> }> | null,
    error: unknown
  ): void => {
    if (error) {
      throw new Error(`Failed to fetch related couplets: ${(error as { message: string }).message}`);
    }
    collectResults(data);
  };

  // 1. Collect posts from the same category
  if (categorySlug) {
    const { data, error } = await supabase
      .from('posts')
      .select('slug, text_hi, tags:post_tags(tag:tags(id, name, slug)), category:categories!inner(slug)')
      .eq('post_status', 'publish')
      .eq('category.slug', categorySlug)
      .neq('slug', excludeSlug)
      .limit(limit)
      .order('post_order', { ascending: true });

    processQuery(data as Array<{ slug: string; text_hi: string; tags: Array<{ tag: TagRef }> }>, error);
  }

  // 2. Fill remaining slots with posts sharing a tag (first 3 tags max)
  if (related.length < limit && tagSlugs.length > 0) {
    for (const tagSlug of tagSlugs.slice(0, 3)) {
      if (related.length >= limit) break;

      const { data, error } = await supabase
        .from('posts')
        .select(
          'slug, text_hi, tags:post_tags(tag:tags(id, name, slug)), filter_tags:post_tags!inner(tag:tags!inner(slug))'
        )
        .eq('post_status', 'publish')
        .eq('filter_tags.tag.slug', tagSlug)
        .limit(limit - related.length)
        .order('post_order', { ascending: true });

      processQuery(data as Array<{ slug: string; text_hi: string; tags: Array<{ tag: TagRef }> }>, error);
    }
  }

  return related.slice(0, limit);
}

/**
 * Fetches a single adjacent couplet relative to a given post_order.
 *
 * @param {'prev' | 'next'} direction - Direction relative to the current post.
 * @param {number} postOrder - The post_order of the current couplet.
 *
 * @returns {Promise<CoupletRef | null>} The adjacent couplet, or null at the boundary.
 */
async function fetchAdjacentCouplet(direction: 'prev' | 'next', postOrder: number): Promise<CoupletRef | null> {
  const supabase = getSupabase();

  const comparator = direction === 'prev' ? 'lt' : 'gt';
  const ascending = direction === 'prev' ? false : true;

  const { data, error } = await supabase
    .from('posts')
    .select('slug, text_hi')
    .eq('post_status', 'publish')
    .filter('post_order', comparator, postOrder)
    .order('post_order', { ascending })
    .limit(1);

  if (error) {
    throw new Error(`Failed to fetch ${direction} couplet: ${error.message}`);
  }

  return (data?.[0] as CoupletRef | undefined) ?? null;
}

/**
 * Fetch the previous and next published couplets adjacent to the given post order.
 *
 * @param {number} postOrder - The post_order of the current couplet.
 *
 * @returns {Promise<{ prev: CoupletRef | null; next: CoupletRef | null }>}
 *   Adjacent couplets with slug and Hindi text, or null when at a boundary.
 */
export async function getAdjacentCouplets(
  postOrder: number
): Promise<{ prev: CoupletRef | null; next: CoupletRef | null }> {
  const [prev, next] = await Promise.all([
    fetchAdjacentCouplet('prev', postOrder),
    fetchAdjacentCouplet('next', postOrder),
  ]);

  return { prev, next };
}

/**
 * Fetch a single published post by its URL slug.
 *
 * @param {string} slug - The URL slug of the couplet.
 *
 * @returns {Promise<Post | null>} The matched post, or null when not found.
 */
export async function getCoupletBySlug(slug: string): Promise<Post | null> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('posts')
    .select('*, category:categories(name, slug), tags:post_tags(tag:tags(id, name, slug))')
    .eq('slug', slug)
    .eq('post_status', 'publish')
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Failed to fetch couplet: ${error.message}`);
  }

  return normalizePost(data as unknown as SupabasePost);
}

/**
 * Fetch all categories that have at least one published post, with post counts.
 *
 * @returns {Promise<(Category & { post_count: number })[]>} Categories with their published‑post counts.
 */
export async function getCategories(): Promise<(Category & { post_count: number })[]> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('categories')
    .select('*, posts!inner(post_status)')
    .eq('posts.post_status', 'publish')
    .order('name', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }

  return ((data ?? []) as unknown as SupabaseCategory[]).map((cat) => ({
    id: cat.id,
    slug: cat.slug,
    name: cat.name,
    description: cat.description,
    meta_description: cat.meta_description,
    created_at: cat.created_at,
    updated_at: cat.updated_at,
    post_count: Array.isArray(cat.posts) ? cat.posts.length : 0,
  }));
}

/**
 * Fetches couplets filtered by a partial options object.
 * Shared helper for homepage widget functions.
 *
 * @param {Partial<GetCoupletsOptions>} filter - Filter options to apply.
 * @param {number} limit - Maximum number of posts to return.
 *
 * @returns {Promise<Post[]>} Filtered list of posts.
 */
async function fetchFilteredCouplets(filter: Partial<GetCoupletsOptions>, limit: number): Promise<Post[]> {
  const { posts } = await getCouplets({ ...filter, perPage: limit });
  return posts;
}

/**
 * Fetch featured posts for display on the homepage.
 *
 * @param {number} [limit] - Maximum number of posts to return.
 *
 * @returns {Promise<Post[]>} List of featured posts.
 */
export async function getFeaturedCouplets(limit: number = 6): Promise<Post[]> {
  return fetchFilteredCouplets({ isFeatured: true }, limit);
}

/**
 * Fetch popular posts for display on the homepage.
 *
 * @param {number} [limit] - Maximum number of posts to return.
 *
 * @returns {Promise<Post[]>} List of popular posts.
 */
export async function getPopularCouplets(limit: number = 4): Promise<Post[]> {
  return fetchFilteredCouplets({ isPopular: true }, limit);
}

/**
 * Fetch the most recently added posts for the homepage.
 *
 * @param {number} [limit] - Maximum number of posts to return.
 *
 * @returns {Promise<Post[]>} List of latest posts.
 */
export async function getLatestCouplets(limit: number = 6): Promise<Post[]> {
  return fetchFilteredCouplets({}, limit);
}

/**
 * Normalizes raw tag data with post_tags relationship into typed Tag with post_count.
 *
 * @param {Array<Tag & { post_tags: Array<{ post: Record<string, unknown> }> }>} raw - Raw tags from Supabase.
 *
 * @returns {Array<Tag & { post_count: number }>} Normalized tags with post counts.
 */
function normalizeTagCounts(
  raw: Array<Tag & { post_tags: Array<{ post: Record<string, unknown> }> }>
): Array<Tag & { post_count: number }> {
  return raw.map((t) => ({
    id: t.id,
    slug: t.slug,
    name: t.name,
    meta_description: t.meta_description,
    created_at: t.created_at,
    updated_at: t.updated_at,
    post_count: Array.isArray(t.post_tags) ? t.post_tags.length : 0,
  }));
}

/**
 * Fetches all tags with published post counts, sorted by name.
 * Shared query used by both {@link getTags} and {@link getTagsByPostCount}.
 *
 * @returns {Promise<(Tag & { post_count: number })[]>} Tags with their published‑post counts.
 */
async function fetchAllTagsWithCounts(): Promise<(Tag & { post_count: number })[]> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('tags')
    .select('*, post_tags!inner(post:posts!inner(post_status))')
    .eq('post_tags.post.post_status', 'publish')
    .order('name', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch tags: ${error.message}`);
  }

  return normalizeTagCounts((data ?? []) as Array<Tag & { post_tags: Array<{ post: { post_status: string } }> }>);
}

/**
 * Fetch all tags that have at least one published post, with post counts.
 *
 * @returns {Promise<(Tag & { post_count: number })[]>} Tags with their published‑post counts.
 */
export async function getTags(): Promise<(Tag & { post_count: number })[]> {
  return fetchAllTagsWithCounts();
}

/**
 * Generic helper to fetch a single record by slug, returning null when not found.
 * Handles the PGRST116 not-found error code and throws on other errors.
 *
 * @template T - The expected return type.
 *
 * @param {string} table - The Supabase table name.
 * @param {string} slug - The URL slug to match.
 * @param {string} entityName - Human-readable entity name for error messages.
 *
 * @returns {Promise<T | null>} The matched record, or null when not found.
 */
async function fetchBySlug<T>(table: string, slug: string, entityName: string): Promise<T | null> {
  const supabase = getSupabase();

  const { data, error } = await supabase.from(table).select('*').eq('slug', slug).single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Failed to fetch ${entityName}: ${error.message}`);
  }

  return data as unknown as T;
}

/**
 * Fetch a single tag by its URL slug.
 *
 * @param {string} slug - The URL slug of the tag.
 *
 * @returns {Promise<Tag | null>} The matched tag, or null when not found.
 */
export async function getTagBySlug(slug: string): Promise<Tag | null> {
  return fetchBySlug<Tag>('tags', slug, 'tag');
}

/**
 * Fetch a single category by its URL slug from the database.
 *
 * This is the async DB version. For the predefined constant lookup
 * use the sync {@link import('@/constants/categories').getCategoryBySlug} instead.
 *
 * @param {string} slug - The URL slug of the category.
 *
 * @returns {Promise<Category | null>} The matched category, or null when not found.
 */
export async function fetchCategoryBySlug(slug: string): Promise<Category | null> {
  return fetchBySlug<Category>('categories', slug, 'category');
}

/**
 * Fetch the top N tags sorted by post count (descending) for the tag cloud widget.
 *
 * @param {number} [limit] - Maximum number of tags to return.
 *
 * @returns {Promise<(Tag & { post_count: number })[]>} Tags with their published-post counts, sorted by count descending.
 */
export async function getTagsByPostCount(limit: number = 12): Promise<(Tag & { post_count: number })[]> {
  const tags = await fetchAllTagsWithCounts();

  // Sort by post_count descending and take top N
  return tags.sort((a, b) => b.post_count - a.post_count).slice(0, limit);
}

/**
 * Fetch popular couplets sorted by view_count (desc) and post_order (asc) for the widget.
 *
 * @param {number} [limit] - Maximum number of couplets to return.
 *
 * @returns {Promise<Post[]>} List of popular couplets.
 */
export async function getPopularCoupletsForWidget(limit: number = 6): Promise<Post[]> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('posts')
    .select('*, category:categories(name, slug), tags:post_tags(tag:tags(id, name, slug))')
    .eq('post_status', 'publish')
    .is('is_popular', true)
    .order('view_count', { ascending: false })
    .order('post_order', { ascending: true })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch popular couplets for widget: ${error.message}`);
  }

  return ((data ?? []) as unknown as SupabasePost[]).map(normalizePost);
}

/**
 * Normalise a raw Supabase post row into the application's Post type.
 *
 * @param {SupabasePost} raw - The raw database row.
 *
 * @returns {Post} A fully‑typed Post object.
 */
function normalizePost(raw: SupabasePost): Post {
  return {
    id: raw.id,
    post_number: raw.post_number,
    post_order: raw.post_order,
    slug: raw.slug,
    identifier: raw.identifier,
    text_hi: raw.text_hi,
    text_en: raw.text_en,
    meaning_hi: raw.meaning_hi,
    meaning_en: raw.meaning_en,
    interpretation_hi: raw.interpretation_hi,
    interpretation_en: raw.interpretation_en,
    philosophical_analysis_hi: raw.philosophical_analysis_hi,
    philosophical_analysis_en: raw.philosophical_analysis_en,
    practical_example_hi: raw.practical_example_hi,
    practical_example_en: raw.practical_example_en,
    practice_guidance_hi: raw.practice_guidance_hi,
    practice_guidance_en: raw.practice_guidance_en,
    core_message_hi: raw.core_message_hi,
    core_message_en: raw.core_message_en,
    reflection_questions_hi: raw.reflection_questions_hi,
    reflection_questions_en: raw.reflection_questions_en,
    category: raw.category ?? null,
    tags: raw.tags.map((t) => t.tag).filter((t): t is NonNullable<typeof t> => t !== null),
    is_popular: raw.is_popular,
    is_featured: raw.is_featured,
    view_count: raw.view_count,
    post_status: raw.post_status,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
  };
}
