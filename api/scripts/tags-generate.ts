#!/usr/bin/env bun
/**
 * Tags Generate Script
 *
 * Fetches all tag names with their published post counts from the Supabase
 * database and writes them to `api/scripts/output/data/tags.txt` in a
 * `name: count` format, sorted alphabetically.
 *
 * Usage:
 *   bun run tags:generate
 *   NODE_ENV=production bun run tags:generate
 */

import fs from 'fs/promises';
import path from 'path';

import ora from 'ora';

import { loadScriptEnv } from './lib/env';
import { createSupabaseClient } from './lib/supabase';

/**
 * Main function that fetches tags with post counts and writes them to a file.
 */
async function main(): Promise<void> {
  const env = loadScriptEnv();
  const supabase = createSupabaseClient(env);

  /* ── 1. Fetch tags with post count ── */
  const spinner = ora('Fetching tags from database…').start();

  const { data, error } = await supabase
    .from('tags')
    .select('name, post_tags!inner(post:posts!inner(post_status))')
    .eq('post_tags.post.post_status', 'publish')
    .order('name', { ascending: true });

  if (error) {
    spinner.fail(`Failed to fetch tags: ${error.message}`);
    process.exit(1);
  }

  const tags = (data ?? []) as Array<Record<string, unknown>>;
  spinner.succeed(`Fetched ${tags.length} tags`);

  /* ── 2. Build content ── */
  const savingSpinner = ora('Writing tags file…').start();

  const lines = tags.map((tag) => `${String(tag.name)}: ${Array.isArray(tag.post_tags) ? tag.post_tags.length : 0}`);
  const content = lines.join('\n');

  /* ── 3. Write to file ── */
  const outputDir = path.resolve(import.meta.dirname, 'output', 'data');
  const outputPath = path.join(outputDir, 'tags.txt');

  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(outputPath, content + '\n', 'utf-8');

  savingSpinner.succeed(`Wrote ${tags.length} tags to ${outputPath}`);
}

main().catch((error) => {
  console.error('Error:', error instanceof Error ? error.message : String(error));
  process.exit(1);
});
