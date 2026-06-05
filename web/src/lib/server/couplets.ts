import 'server-only';

import type { Category, Tag, Post, CoupletsResponse } from '@/types';

import { getSupabase } from './supabase';

/**
 * Raw post shape returned by Supabase, used internally before normalisation.
 *
 * @type {SupabasePost}
 * @property {string} id - Unique identifier
 * @property {number} post_number - Sequential couplet number
 * @property {number} post_order - Display ordering position
 * @property {string} slug - URL‑friendly unique slug
 * @property {string} identifier - External reference identifier
 * @property {string} text_hi - Hindi couplet text (Devanagari)
 * @property {string} text_en - English transliteration
 * @property {string | null} meaning_hi - Hindi meaning
 * @property {string | null} meaning_en - English meaning
 * @property {string | null} interpretation_hi - Hindi interpretation
 * @property {string | null} interpretation_en - English interpretation
 * @property {string | null} philosophical_analysis_hi - Hindi philosophical analysis
 * @property {string | null} philosophical_analysis_en - English philosophical analysis
 * @property {string | null} practical_example_hi - Hindi practical example
 * @property {string | null} practical_example_en - English practical example
 * @property {string | null} practice_guidance_hi - Hindi practice guidance
 * @property {string | null} practice_guidance_en - English practice guidance
 * @property {string | null} core_message_hi - Hindi core message
 * @property {string | null} core_message_en - English core message
 * @property {string | null} reflection_questions_hi - Hindi reflection questions
 * @property {string | null} reflection_questions_en - English reflection questions
 * @property {{ name: string; slug: string } | null} category - Category reference object
 * @property {Array<{ tag: { id: string; name: string; slug: string } }>} tags - Tag relationship objects
 * @property {boolean} is_popular - Popular flag
 * @property {boolean} is_featured - Featured flag
 * @property {number} view_count - Total view count
 * @property {string} post_status - Publication status
 * @property {string} created_at - ISO creation timestamp
 * @property {string} updated_at - ISO last update timestamp
 */
interface SupabasePost {
  id: string;
  post_number: number;
  post_order: number;
  slug: string;
  identifier: string;
  text_hi: string;
  text_en: string;
  meaning_hi: string | null;
  meaning_en: string | null;
  interpretation_hi: string | null;
  interpretation_en: string | null;
  philosophical_analysis_hi: string | null;
  philosophical_analysis_en: string | null;
  practical_example_hi: string | null;
  practical_example_en: string | null;
  practice_guidance_hi: string | null;
  practice_guidance_en: string | null;
  core_message_hi: string | null;
  core_message_en: string | null;
  reflection_questions_hi: string | null;
  reflection_questions_en: string | null;
  category: { name: string; slug: string } | null;
  tags: Array<{ tag: { id: string; name: string; slug: string } }>;
  is_popular: boolean;
  is_featured: boolean;
  view_count: number;
  post_status: string;
  created_at: string;
  updated_at: string;
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
    sortBy = 'number',
    sortOrder = 'asc',
  } = options;
  const supabase = getSupabase();

  const sortColumnMap: Record<string, string> = { number: 'post_order', text_en: 'text_en', text_hi: 'text_hi' };

  const sortColumn = sortColumnMap[sortBy] || 'post_order';

  const categorySelect = category ? 'category:categories!inner(name, slug)' : 'category:categories(name, slug)';

  const tagsSelect = tag
    ? 'tags:post_tags!inner(tag:tags!inner(id, name, slug))'
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
    query = query.eq('tags.tag.slug', tag);
  }

  if (isFeatured) {
    query = query.eq('is_featured', true);
  }

  if (isPopular) {
    query = query.eq('is_popular', true);
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
 * Fetch featured posts for display on the homepage.
 *
 * @param {number} [limit] - Maximum number of posts to return.
 *
 * @returns {Promise<Post[]>} List of featured posts.
 */
export async function getFeaturedCouplets(limit = 6): Promise<Post[]> {
  const { posts } = await getCouplets({ isFeatured: true, perPage: limit });
  return posts;
}

/**
 * Fetch popular posts for display on the homepage.
 *
 * @param {number} [limit] - Maximum number of posts to return.
 *
 * @returns {Promise<Post[]>} List of popular posts.
 */
export async function getPopularCouplets(limit = 4): Promise<Post[]> {
  const { posts } = await getCouplets({ isPopular: true, perPage: limit });
  return posts;
}

/**
 * Fetch the most recently added posts for the homepage.
 *
 * @param {number} [limit] - Maximum number of posts to return.
 *
 * @returns {Promise<Post[]>} List of latest posts.
 */
export async function getLatestCouplets(limit = 6): Promise<Post[]> {
  const { posts } = await getCouplets({ perPage: limit });
  return posts;
}

/**
 * Fetch all tags that have at least one published post, with post counts.
 *
 * @returns {Promise<(Tag & { post_count: number })[]>} Tags with their published‑post counts.
 */
export async function getTags(): Promise<(Tag & { post_count: number })[]> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('tags')
    .select('*, post_tags!inner(post:posts!inner(post_status))')
    .eq('post_tags.post.post_status', 'publish')
    .order('name', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch tags: ${error.message}`);
  }

  return ((data ?? []) as unknown as Array<Tag & { post_tags: Array<{ post: { post_status: string } }> }>).map((t) => ({
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
 * Fetch a single tag by its URL slug.
 *
 * @param {string} slug - The URL slug of the tag.
 *
 * @returns {Promise<Tag | null>} The matched tag, or null when not found.
 */
export async function getTagBySlug(slug: string): Promise<Tag | null> {
  const supabase = getSupabase();

  const { data, error } = await supabase.from('tags').select('*').eq('slug', slug).single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Failed to fetch tag: ${error.message}`);
  }

  return data as unknown as Tag;
}

/**
 * Fetch a single category by its URL slug.
 *
 * @param {string} slug - The URL slug of the category.
 *
 * @returns {Promise<Category | null>} The matched category, or null when not found.
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = getSupabase();

  const { data, error } = await supabase.from('categories').select('*').eq('slug', slug).single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Failed to fetch category: ${error.message}`);
  }

  return data as unknown as Category;
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
    tags: raw.tags.map((t) => t.tag),
    is_popular: raw.is_popular,
    is_featured: raw.is_featured,
    view_count: raw.view_count,
    post_status: raw.post_status,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
  };
}
