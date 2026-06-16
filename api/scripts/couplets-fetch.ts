/**
 * Fetch Couplets Script
 *
 * Fetches published couplets (slug, text_hi, meaning_hi, and post_number) from
 * the Supabase database and writes them to `api/scripts/output/data/couplets.json`
 * as a map: slug → { text, meaning, post_number }.
 *
 * Usage:
 *   bun run fetch:couplets        - Run in development mode
 *   bun run fetch:couplets:prod   - Run in production mode
 */

import fs from 'fs/promises';
import path from 'path';

import { loadScriptEnv } from './lib/env';
import { createSupabaseClient } from './lib/supabase';

/**
 * Represents a couplet entry fetched from the database.
 */
interface CoupletRow {
  slug: string;
  text_hi: string;
  meaning_hi: string | null;
  post_number: number;
}

/**
 * Represents a couplet entry in the output JSON file.
 */
interface CoupletEntry {
  text: string;
  meaning: string | null;
  post_number: number;
}

/**
 * Main function that fetches couplets and writes them to a JSON file.
 */
async function main(): Promise<void> {
  console.log('[fetch-couplets] Loading environment...');
  const env = loadScriptEnv();

  console.log('[fetch-couplets] Creating Supabase client...');
  const supabase = createSupabaseClient(env);

  console.log('[fetch-couplets] Fetching couplets from database...');
  const { data, error } = await supabase
    .from('posts')
    .select('slug, text_hi, meaning_hi, post_number')
    .eq('post_status', 'publish')
    .order('post_order', { ascending: true });

  if (error) {
    console.error('[fetch-couplets] Failed to fetch couplets:', error.message);
    process.exit(1);
  }

  const rows = data as CoupletRow[] | null;

  if (!rows || rows.length === 0) {
    console.error('[fetch-couplets] No couplets found in the database.');
    process.exit(1);
  }

  // Build map: slug → { text, meaning, post_number }
  const coupletsMap: Record<string, CoupletEntry> = {};
  for (const row of rows) {
    coupletsMap[row.slug] = { text: row.text_hi, meaning: row.meaning_hi ?? null, post_number: row.post_number };
  }

  // Write to file
  const outputDir = path.resolve(import.meta.dirname, 'output', 'data');
  const outputPath = path.join(outputDir, 'couplets.json');

  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(coupletsMap, null, 2), 'utf-8');

  console.log(`[fetch-couplets] Successfully wrote ${rows.length} couplets to ${outputPath}`);
}

main().catch((error) => {
  console.error('[fetch-couplets] Unexpected error:', error instanceof Error ? error.message : String(error));
  process.exit(1);
});
