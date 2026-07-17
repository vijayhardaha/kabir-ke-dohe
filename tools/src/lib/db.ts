import { SupabaseClient } from '@supabase/supabase-js';

const DELETE_CHUNK_SIZE = 100;

/**
 * Represents a post record from the database.
 *
 * @type {DbPost}
 * @property {string} slug - Post slug.
 * @property {string} identifier - Post identifier.
 * @property {string} text_hi - Hindi text.
 * @property {string} text_en - English text.
 * @property {string} [meaning_hi] - Hindi meaning.
 * @property {string} [meaning_en] - English meaning.
 * @property {string} [interpretation_hi] - Hindi interpretation.
 * @property {string} [interpretation_en] - English interpretation.
 * @property {string} [philosophical_analysis_hi] - Hindi philosophical analysis.
 * @property {string} [philosophical_analysis_en] - English philosophical analysis.
 * @property {string} [practical_example_hi] - Hindi practical example.
 * @property {string} [practical_example_en] - English practical example.
 * @property {string} [practice_guidance_hi] - Hindi practice guidance.
 * @property {string} [practice_guidance_en] - English practice guidance.
 * @property {string} [core_message_hi] - Hindi core message.
 * @property {string} [core_message_en] - English core message.
 * @property {string} [reflection_questions_hi] - Hindi reflection questions.
 * @property {string} [reflection_questions_en] - English reflection questions.
 * @property {number} post_number - Post number.
 * @property {number} post_order - Post order.
 * @property {string} post_status - Post status.
 * @property {string} [category_id] - Category ID.
 * @property {boolean} is_popular - Is popular flag.
 * @property {boolean} is_featured - Is featured flag.
 */
export interface DbPost {
  slug: string;
  identifier: string;
  text_hi: string;
  text_en: string;
  meaning_hi?: string;
  meaning_en?: string;
  interpretation_hi?: string;
  interpretation_en?: string;
  philosophical_analysis_hi?: string;
  philosophical_analysis_en?: string;
  practical_example_hi?: string;
  practical_example_en?: string;
  practice_guidance_hi?: string;
  practice_guidance_en?: string;
  core_message_hi?: string;
  core_message_en?: string;
  reflection_questions_hi?: string;
  reflection_questions_en?: string;
  post_number: number;
  post_order: number;
  post_status: string;
  category_id?: string;
  is_popular: boolean;
  is_featured: boolean;
}

/**
 * Represents a tag record from the database.
 *
 * @type {DbTag}
 * @property {string} name - Tag name.
 * @property {string} slug - Tag slug.
 */
export interface DbTag {
  name: string;
  slug: string;
}

/**
 * Represents a category record from the database.
 *
 * @type {DbCategory}
 * @property {string} name - Category name.
 * @property {string} slug - Category slug.
 */
export interface DbCategory {
  name: string;
  slug: string;
  description?: string;
  meta_description?: string;
}

/**
 * Represents a post-tag mapping record for the junction table.
 *
 * @type {PostTagMapping}
 * @property {string} post_id - Post ID.
 * @property {string} tag_id - Tag ID.
 */
export interface PostTagMapping {
  post_id: string;
  tag_id: string;
}

/**
 * Upserts multiple posts into the database using identifier as the conflict key.
 *
 * @param {SupabaseClient} supabase - The Supabase client instance.
 * @param {DbPost[]} posts - The array of posts to upsert.
 *
 * @returns {Promise<{ data: { id: string; identifier: string }[]; count: number | null }>} The upserted posts and count.
 *
 * @example
 * const result = await upsertPosts(supabase, [{ identifier: "K001", text_hi: "..." }]);
 *
 * @throws {Error} Throws when the upsert operation fails.
 */
export async function upsertPosts(
  supabase: SupabaseClient,
  posts: DbPost[]
): Promise<{ data: { id: string; identifier: string }[]; count: number | null }> {
  const { data, error, count } = await supabase
    .from('posts')
    .upsert(posts, { onConflict: 'identifier', count: 'exact' })
    .select('id, identifier');

  if (error) {
    throw new Error('Failed to upsert posts: ' + error.message);
  }

  return { data, count };
}

/**
 * Upserts multiple tags into the database using slug as the conflict key.
 *
 * @param {SupabaseClient} supabase - The Supabase client instance.
 * @param {DbTag[]} tags - The array of tags to upsert.
 *
 * @returns {Promise<{ data: { id: string; slug: string }[]; count: number | null }>} The upserted tags and count.
 *
 * @example
 * const result = await upsertTags(supabase, [{ name: "Bhakti", slug: "bhakti" }]);
 *
 * @throws {Error} Throws when the upsert operation fails.
 */
export async function upsertTags(
  supabase: SupabaseClient,
  tags: DbTag[]
): Promise<{ data: { id: string; slug: string }[]; count: number | null }> {
  const { data, error, count } = await supabase
    .from('tags')
    .upsert(tags, { onConflict: 'slug', count: 'exact' })
    .select('id, slug');

  if (error) {
    throw new Error('Failed to upsert tags: ' + error.message);
  }

  return { data, count };
}

/**
 * Upserts multiple categories into the database using slug as the conflict key.
 *
 * @param {SupabaseClient} supabase - The Supabase client instance.
 * @param {DbCategory[]} categories - The array of categories to upsert.
 *
 * @returns {Promise<{ data: { id: string; slug: string }[]; count: number | null }>} The upserted categories and count.
 *
 * @throws {Error} Throws when the upsert operation fails.
 */
export async function upsertCategories(
  supabase: SupabaseClient,
  categories: DbCategory[]
): Promise<{
  data: { id: string; slug: string; description?: string; meta_description?: string }[];
  count: number | null;
}> {
  const { data, error, count } = await supabase
    .from('categories')
    .upsert(categories, { onConflict: 'slug', count: 'exact' })
    .select('id, slug, description, meta_description');

  if (error) {
    throw new Error('Failed to upsert categories: ' + error.message);
  }

  return { data, count };
}

/**
 * Upserts multiple post-tag mappings into the junction table.
 *
 * @param {SupabaseClient} supabase - The Supabase client instance.
 * @param {PostTagMapping[]} mappings - The array of post-tag mappings to upsert.
 *
 * @returns {Promise<{ data: PostTagMapping[]; count: number | null }>} The upserted mappings and count.
 *
 * @example
 * const result = await upsertPostTags(supabase, [{ post_id: "p1", tag_id: "t1" }]);
 *
 * @throws {Error} Throws when the upsert operation fails.
 */
export async function upsertPostTags(
  supabase: SupabaseClient,
  mappings: PostTagMapping[]
): Promise<{ data: PostTagMapping[]; count: number | null }> {
  const { data, error, count } = await supabase
    .from('post_tags')
    .upsert(mappings, { onConflict: 'post_id,tag_id' })
    .select();

  if (error) {
    throw new Error('Failed to upsert post_tags: ' + error.message);
  }

  return { data, count };
}

/**
 * Clears all post-tag mappings for a given set of post identifiers.
 *
 * Fetches the post IDs for the given identifiers, then deletes all associated
 * rows from the post_tags junction table. This is run before re-upserting
 * post-tag mappings to ensure stale associations are removed.
 *
 * @param {SupabaseClient} supabase - The Supabase client instance.
 * @param {string[]} identifiers - The post identifiers whose mappings should be cleared.
 * @param {number} [chunkSize] - Chunk size for batched deletes.
 *
 * @returns {Promise<number>} The number of deleted mappings.
 *
 * @throws {Error} Throws when any delete operation fails.
 */
export async function clearPostTagsForPosts(
  supabase: SupabaseClient,
  identifiers: string[],
  chunkSize: number = DELETE_CHUNK_SIZE
): Promise<number> {
  let deletedCount = 0;

  for (let i = 0; i < identifiers.length; i += chunkSize) {
    const batch = identifiers.slice(i, i + chunkSize);

    // Fetch post IDs for this batch of identifiers

    const { data: posts } = await supabase.from('posts').select('id').in('identifier', batch);

    if (!posts || posts.length === 0) continue;

    const postIds = posts.map((p: { id: string }) => p.id);

    for (let j = 0; j < postIds.length; j += chunkSize) {
      const idBatch = postIds.slice(j, j + chunkSize);

      const { error, count } = await supabase.from('post_tags').delete({ count: 'exact' }).in('post_id', idBatch);

      if (error) {
        throw new Error(`Failed to clear post-tag mappings: ${error.message}`);
      }

      deletedCount += count ?? 0;
    }
  }

  return deletedCount;
}

/**
 * Deletes stale records from a table that are NOT in the provided set of values to keep.
 *
 * Fetches all existing values for the given key column, computes the diff
 * against the incoming values, and deletes stale records in chunks to avoid
 * PostgREST URL length limits (16KB).
 *
 * For the `categories` table, this function first explicitly nullifies
 * `category_id` references in the `posts` table before deleting. This avoids
 * the `ON DELETE SET NULL` cascade operation which can hit Supabase's
 * `statement_timeout` (30s) when thousands of posts reference a category.
 *
 * @param {SupabaseClient} supabase - The Supabase client instance.
 * @param {string} table - The table name.
 * @param {string} keyColumn - The key column to filter on (e.g. 'slug', 'identifier').
 * @param {string[]} valuesToKeep - The incoming values that should be retained.
 * @param {number} [chunkSize] - Chunk size for batched deletes.
 *
 * @returns {Promise<number>} The number of deleted records.
 *
 * @throws {Error} Throws when any delete operation fails.
 */
export async function deleteStaleRecords(
  supabase: SupabaseClient,
  table: 'categories' | 'tags' | 'posts',
  keyColumn: 'slug' | 'identifier',
  valuesToKeep: string[],
  chunkSize: number = DELETE_CHUNK_SIZE
): Promise<number> {
  const { data: existing } = await supabase.from(table).select(keyColumn);

  if (!existing || existing.length === 0) return 0;

  const existingValues = existing.map((r: Record<string, string>) => r[keyColumn]);
  const staleValues = existingValues.filter((v) => !valuesToKeep.includes(v));

  if (staleValues.length === 0) return 0;

  // For categories, first nullify references in posts to avoid the slow
  // ON DELETE SET NULL cascade that can hit Supabase's statement_timeout (30s).
  if (table === 'categories') {
    await nullifyCategoryPostReferences(supabase, staleValues, chunkSize, keyColumn);
  }

  let deletedCount = 0;

  for (let i = 0; i < staleValues.length; i += chunkSize) {
    const batch = staleValues.slice(i, i + chunkSize);

    const { error, count } = await supabase.from(table).delete({ count: 'exact' }).in(keyColumn, batch);

    if (error) {
      throw new Error(`Failed to delete stale ${table} records: ${error.message}`);
    }

    deletedCount += count ?? 0;
  }

  return deletedCount;
}

/**
 * Nullifies `category_id` on posts that reference stale categories.
 *
 * Before deleting stale categories, this function updates the posts table
 * to set `category_id = NULL` for any post referencing a stale category.
 * Each stale category is processed individually to keep every UPDATE
 * statement small (a few dozen rows at most), avoiding Supabase's
 * 30-second `statement_timeout`.
 *
 * @param {SupabaseClient} supabase - The Supabase client instance.
 * @param {string[]} staleSlugs - The slugs of the stale categories to remove references for.
 * @param {number} _chunkSize - Unused (kept for API compatibility with the caller).
 * @param {string} keyColumn - The key column used to identify categories ('slug' or 'identifier').
 *
 * @throws {Error} Throws when any update operation fails.
 */
async function nullifyCategoryPostReferences(
  supabase: SupabaseClient,
  staleSlugs: string[],
  _chunkSize: number,
  keyColumn: string
): Promise<void> {
  for (const slug of staleSlugs) {
    const { data: staleCats } = await supabase.from('categories').select('id').eq(keyColumn, slug);

    if (!staleCats || staleCats.length === 0) continue;

    const { error } = await supabase.from('posts').update({ category_id: null }).eq('category_id', staleCats[0].id);

    if (error) {
      throw new Error(`Failed to nullify category references in posts: ${error.message}`);
    }
  }
}
