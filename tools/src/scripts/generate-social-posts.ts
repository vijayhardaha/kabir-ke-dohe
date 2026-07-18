#!/usr/bin/env bun
/**
 * Generates social media post markdown files for each published couplet.
 *
 * Reads from `dist/data/couplets.json` and outputs styled markdown files
 * in `dist/social-posts/`.
 *
 * Usage:
 *   bun run social-posts:generate
 */

import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { formatCoupletText } from '../lib/string';
import type { CoupletEntry } from '../types';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Creates markdown content for a social media post.
 *
 * @param {CoupletEntry} entry - The couplet entry containing all data.
 *
 * @returns {string} Markdown content for the social media post.
 */
function buildSocialPost(entry: CoupletEntry): string {
  const coupletLines = formatCoupletText(entry.text);
  const tags = ['#कबीर', '#कबीरदोहे', '#spiritual', '#wisdom'];

  const sections: string[] = [];
  sections.push(coupletLines);
  sections.push('\n➖➖➖\n');
  sections.push('✨ अर्थ: ⤵\n');
  sections.push(entry.meaning || '[यहां दोहे का अर्थ लिखें]');
  sections.push('\n➖➖➖\n');
  sections.push('🌾 वास्तविक जीवन उदाहरण: ⤵\n');
  sections.push(
    entry.practical_example || '[यहां दोहे के संदेश से जुड़ा एक वास्तविक जीवन का उदाहरण लिखें जो पाठकों को प्रेरित करे]'
  );
  sections.push('\n➖➖➖\n');
  sections.push('🔥 संदेश: ⤵\n');
  sections.push(entry.core_message || '[यहां दोहे का मुख्य संदेश लिखें]');
  sections.push('\n➖➖➖\n');
  sections.push('— संत कबीरदास साहेब जी');
  sections.push('');
  sections.push(tags.join(' '));
  sections.push('');

  return sections.join('\n');
}

async function main(): Promise<void> {
  const dataPath = resolve(__dirname, '..', '..', 'dist', 'data', 'couplets.json');
  const raw = await readFile(dataPath, 'utf-8');
  const couplets = JSON.parse(raw) as Record<string, CoupletEntry>;

  const outputDir = resolve(__dirname, '..', '..', 'dist', 'social-posts');
  await mkdir(outputDir, { recursive: true });

  const entries = Object.entries(couplets);
  let generated = 0;

  for (const [slug, entry] of entries) {
    const content = buildSocialPost(entry);
    const outputPath = resolve(outputDir, `${slug}.md`);
    await writeFile(outputPath, content, 'utf-8');
    generated++;
  }

  console.log(`Generated ${generated} social post markdown files in ${outputDir}`);
}

main().catch((error: Error) => {
  console.error('Error:', error.message);
  process.exit(1);
});
