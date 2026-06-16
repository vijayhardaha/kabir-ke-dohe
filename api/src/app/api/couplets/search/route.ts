import { z } from 'zod';

import { supabase } from '@/lib/server/supabase';
import { createGetHandler, parseQueryParams } from '@/lib/server/utils';

/**
 * Default parameter values for the search API.
 */
const DEFAULT_PARAMS = { search_query: '', page: 1, per_page: 10 } as const;

/**
 * Zod schema for validating search query parameters.
 */
const SearchQuerySchema = z.object({
  search_query: z.string().optional().default(DEFAULT_PARAMS.search_query),
  page: z.coerce.number().int().positive().optional().default(DEFAULT_PARAMS.page),
  per_page: z.coerce.number().int().positive().max(100).optional().default(DEFAULT_PARAMS.per_page),
});

/**
 * Type for validated search query parameters.
 */
type SearchQueryParams = z.infer<typeof SearchQuerySchema>;

/**
 * Searches couplets by text in search_text column.
 *
 * @param {SearchQueryParams} params - The search query parameters.
 *
 * @returns {Promise<{ posts: string[] }>} Array of matching text_hi strings.
 */
async function handleRequest(params: SearchQueryParams): Promise<{ posts: string[] }> {
  const searchTerm = params.search_query?.trim() || '';
  const offset = (params.page - 1) * params.per_page;

  let query = supabase.from('posts').select('text_hi');

  if (searchTerm) {
    query = query.ilike('search_text', `%${searchTerm}%`);
  }

  const { data, error } = await query.range(offset, offset + params.per_page - 1);

  if (error) {
    throw new Error(`Search failed: ${error.message}`);
  }

  const posts: string[] = (data ?? []).map((row) => row.text_hi);

  return { posts };
}

/** Edge runtime configuration for the search route. */
export const runtime = 'edge';

/**
 * GET route handler for the search API.
 * Searches couplets by text in text_hi and text_en columns.
 */
export const GET = createGetHandler(
  (searchParams) => parseQueryParams(searchParams, DEFAULT_PARAMS, SearchQuerySchema) as SearchQueryParams,
  handleRequest
);
