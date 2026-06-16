import { z } from 'zod';

import { supabase } from '@/lib/server/supabase';
import { sanitizeTitle, createGetHandler, parseQueryParams } from '@/lib/server/utils';

/**
 * Default parameter values for the API.
 */
const DEFAULT_PARAMS = {
  search_query: '',
  search_content: false,
  tags: '',
  category: '',
  is_popular: false,
  is_featured: false,
  sort_by: 'number',
  sort_order: 'asc',
  page: 1,
  per_page: 10,
  pagination: true,
} as const;

/**
 * Zod schema for validating query parameters.
 */
const QuerySchema = z.object({
  search_query: z.string().optional().default(DEFAULT_PARAMS.search_query),
  search_content: z.coerce.boolean().optional().default(DEFAULT_PARAMS.search_content),
  tags: z.string().optional().default(DEFAULT_PARAMS.tags),
  category: z.string().optional().default(DEFAULT_PARAMS.category),
  is_popular: z.coerce.boolean().optional().default(DEFAULT_PARAMS.is_popular),
  is_featured: z.coerce.boolean().optional().default(DEFAULT_PARAMS.is_featured),
  sort_by: z
    .string()
    .optional()
    .default(DEFAULT_PARAMS.sort_by)
    .refine((val) => ['number', 'popular', 'featured', 'text_en', 'text_hi'].includes(val), {
      message: "Invalid sort_by value. Allowed values: 'number', 'popular', 'featured', 'text_en', 'text_hi'",
    }),
  sort_order: z
    .string()
    .optional()
    .default(DEFAULT_PARAMS.sort_order)
    .refine((val) => ['asc', 'desc'].includes(val), {
      message: "Invalid sort_order value. Allowed values: 'asc', 'desc'",
    }),
  page: z.coerce.number().int().positive().optional().default(DEFAULT_PARAMS.page),
  per_page: z.coerce.number().int().positive().max(100).optional().default(DEFAULT_PARAMS.per_page),
  pagination: z.coerce.boolean().optional().default(DEFAULT_PARAMS.pagination),
});

/**
 * Type for validated query parameters.
 */
type QueryParams = z.infer<typeof QuerySchema>;

/**
 * Type for transformed post data.
 *
 * @type {Post}
 * @property {number} number - Post number.
 * @property {string} slug - URL-friendly slug.
 * @property {string} text_hi - Hindi text.
 * @property {string} text_en - English text.
 * @property {string | null} meaning_hi - Hindi meaning.
 * @property {string | null} meaning_en - English meaning.
 * @property {{ name: string; slug: string } | null} category - Category info.
 * @property {Array<{ slug: string; name: string }>} tags - Tags array.
 * @property {string} created_at - Creation timestamp.
 * @property {string} updated_at - Update timestamp.
 */
interface Post {
  number: number;
  slug: string;
  text_hi: string;
  text_en: string;
  meaning_hi: string | null;
  meaning_en: string | null;
  category: { name: string; slug: string } | null;
  tags: Array<{ slug: string; name: string }>;
  created_at: string;
  updated_at: string;
}

/**
 * Transform a database row to post format.
 *
 * @param {Record<string, unknown>} row - The database row to transform.
 *
 * @returns {Post} The transformed post object.
 */
function transformPost(row: Record<string, unknown>): Post {
  const tags = Array.isArray(row.tags)
    ? (row.tags as Array<{ slug: string; name: string }>).map((t) => ({
        name: String(t.name ?? ''),
        slug: String(t.slug ?? ''),
      }))
    : [];

  const category = row.category as { name: unknown; slug: unknown } | null;
  const transformedCategory = category
    ? { name: String(category.name ?? ''), slug: String(category.slug ?? '') }
    : null;

  return {
    number: row.post_number as number,
    slug: row.slug as string,
    text_hi: row.text_hi as string,
    text_en: row.text_en as string,
    meaning_hi: row.meaning_hi as string | null,
    meaning_en: row.meaning_en as string | null,
    category: transformedCategory,
    tags,
    created_at: (row.created_at as string) || '',
    updated_at: (row.updated_at as string) || '',
  };
}

/**
 * Fetches posts from Supabase using the RPC function.
 *
 * @param {QueryParams} params - The query parameters for fetching posts.
 *
 * @returns {Promise<{ posts: Post[]; total: number }>} The fetched posts and total count.
 */
async function fetchPosts(params: QueryParams): Promise<{ posts: Post[]; total: number }> {
  const searchTrimmed = params.search_query?.trim() || '';
  const tagsTrimmed = params.tags?.trim() || '';
  const categoryTrimmed = params.category?.trim() || '';

  const tagsSlugified = tagsTrimmed
    ? tagsTrimmed
        .split(',')
        .map((t) => sanitizeTitle(t.trim()))
        .filter(Boolean)
        .join(',')
    : '';

  const categorySlugified = categoryTrimmed ? sanitizeTitle(categoryTrimmed) : '';

  const orderMapper: Record<string, string> = {
    number: 'post_number',
    popular: 'is_popular',
    featured: 'is_featured',
    text_en: 'text_en',
    text_hi: 'text_hi',
  };

  const filters = {
    search_query: searchTrimmed || null,
    search_content: params.search_content || false,
    tags: tagsSlugified || null,
    category: categorySlugified || null,
    is_popular: params.is_popular || false,
    is_featured: params.is_featured || false,
    sort_by: orderMapper[params.sort_by] || 'post_number',
    sort_order: params.sort_order || 'asc',
    page: params.page || 1,
    per_page: params.per_page || 10,
    pagination: params.pagination !== false,
  };

  // RPC: `get_couplets_for_api(filters jsonb)` — defined in supabase/migrations/
  // Returns paginated posts with total_count, category, and tags relationships
  const { data, error } = await supabase.rpc('get_couplets_for_api', { filters });

  if (error) {
    throw new Error(`Failed to fetch posts: ${error.message}`);
  }

  if (!data || data.length === 0) {
    return { posts: [], total: 0 };
  }

  const total = data[0]?.total_count || 0;
  const posts = data.map(transformPost);

  return { posts, total };
}

/**
 * Handle API request and return formatted response.
 *
 * @param {QueryParams} params - The query parameters for the request.
 *
 * @returns {Promise<{ posts: Post[]; total: number; totalPages: number; page: number; per_page: number; pagination: boolean }>} The formatted response.
 */
async function handleRequest(
  params: QueryParams
): Promise<{ posts: Post[]; total: number; totalPages: number; page: number; per_page: number; pagination: boolean }> {
  const { posts, total } = await fetchPosts(params);

  return {
    posts,
    total,
    totalPages: params.pagination ? Math.ceil(total / params.per_page) : 1,
    page: params.page,
    per_page: params.per_page,
    pagination: params.pagination,
  };
}

/** Edge runtime configuration for the API route. */
export const runtime = 'edge';

/** GET route handler for the posts API. */
export const GET = createGetHandler(
  (searchParams) => parseQueryParams(searchParams, DEFAULT_PARAMS, QuerySchema) as QueryParams,
  handleRequest,
  'Failed to fetch posts'
);
