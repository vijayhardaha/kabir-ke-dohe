/**
 * Generates a tags.txt file with all tag names and their published post counts.
 *
 * Usage: bun run scripts/generate-tags-txt.ts
 */

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  const { data, error } = await supabase
    .from('tags')
    .select('name, post_tags!inner(post:posts!inner(post_status))')
    .eq('post_tags.post.post_status', 'publish')
    .order('name', { ascending: true });

  if (error) {
    console.error('Failed to fetch tags:', error.message);
    process.exit(1);
  }

  const tags = (data ?? []) as Array<Record<string, unknown>>;

  const lines = tags.map((tag) => `${String(tag.name)}: ${Array.isArray(tag.post_tags) ? tag.post_tags.length : 0}`);
  const content = lines.join('\n');

  const outPath = resolve(__dirname, '..', 'tags.txt');
  writeFileSync(outPath, content + '\n', 'utf-8');

  console.log(`Wrote ${tags.length} tags to ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
