#!/usr/bin/env bun
/**
 * Build llms.txt from cached data.json.
 * Output: public/llms.txt
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

import type { SiteData } from './utils/types';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.resolve(__dirname, 'data.json');
const OUTPUT_FILE = path.resolve(__dirname, '..', 'public', 'llms.txt');
const SITE_URL = 'https://kabirdohehub.vercel.app';

/**
 * Assemble the llms.txt markdown content from a cached site snapshot.
 *
 * @param {SiteData} data - The cached site snapshot from data.json.
 *
 * @returns {string} The complete llms.txt markdown document.
 */
function buildLlmstxt(data: SiteData): string {
  const lines: string[] = [];

  lines.push('# Kabir Dohe Hub');
  lines.push('');
  lines.push(
    '> Sant Kabir Das (1398-1518) was a 15th-century Indian mystic poet '
      + 'and saint. His dohas (couplets) offer timeless wisdom on spirituality, '
      + 'social harmony, and inner transformation.'
  );
  lines.push('');
  lines.push(
    'This site hosts '
      + data.totalCount
      + ' couplets organised into '
      + data.categories.length
      + ' categories and '
      + data.tags.length
      + ' tags. Each couplet includes Hindi text, English transliteration, '
      + 'meaning, interpretation, philosophical analysis, and practical guidance.'
  );
  lines.push('');

  lines.push('## Sitemaps');
  lines.push('');
  lines.push('[XML Sitemap](' + SITE_URL + '/sitemap.xml): Includes all crawlable and indexable pages.');
  lines.push('');

  lines.push('## Pages');
  lines.push('');
  lines.push('- ' + SITE_URL + '/ (Home)');
  {
    const pages = Math.ceil(data.totalCount / 10);
    lines.push(
      '- '
        + SITE_URL
        + '/couplets -- All couplets ('
        + data.totalCount
        + ' couplets, '
        + pages
        + (pages > 1 ? ' pages)' : ' page)')
    );
  }
  {
    const pages = Math.ceil(data.popularCount / 10);
    lines.push(
      '- '
        + SITE_URL
        + '/popular-couplets -- Popular couplets ('
        + data.popularCount
        + ' couplets, '
        + pages
        + (pages > 1 ? ' pages)' : ' page)')
    );
  }
  {
    const pages = Math.ceil(data.featuredCount / 10);
    lines.push(
      '- '
        + SITE_URL
        + '/featured-couplets -- Featured couplets ('
        + data.featuredCount
        + ' couplets, '
        + pages
        + (pages > 1 ? ' pages)' : ' page)')
    );
  }
  lines.push('- ' + SITE_URL + '/categories -- Browse categories (' + data.categories.length + ')');
  lines.push('- ' + SITE_URL + '/tags -- Browse tags (' + data.tags.length + ')');
  lines.push('- ' + SITE_URL + '/search -- Full-text search');
  lines.push('- ' + SITE_URL + '/about -- About Kabir Das');
  lines.push('- ' + SITE_URL + '/privacy');
  lines.push('- ' + SITE_URL + '/terms');
  lines.push('');

  lines.push('## Categories (' + data.categories.length + ')');
  for (const cat of data.categories) {
    const pages = Math.ceil(cat.post_count / 10);
    lines.push(
      '- '
        + SITE_URL
        + '/category/'
        + cat.slug
        + ' -- '
        + cat.name
        + ' ('
        + cat.post_count
        + ' couplets, '
        + pages
        + (pages > 1 ? ' pages)' : ' page)')
    );
  }
  lines.push('');

  lines.push('## Tags (' + data.tags.length + ')');
  for (const tag of data.tags) {
    const pages = Math.ceil(tag.post_count / 10);
    lines.push(
      '- '
        + SITE_URL
        + '/tag/'
        + tag.slug
        + ' -- '
        + tag.name
        + ' ('
        + tag.post_count
        + ' couplets, '
        + pages
        + (pages > 1 ? ' pages)' : ' page)')
    );
  }
  lines.push('');

  lines.push('## Navigation');
  lines.push('- **All Dohe** -- /couplets');
  lines.push('- **Popular Dohe** -- /popular-couplets');
  lines.push('- **Featured Dohe** -- /featured-couplets');
  lines.push('- **Categories** -- /categories (dropdown with all links)');
  lines.push('- **About Kabir** -- /about');
  lines.push('');

  lines.push('## Kabir Couplets (' + data.posts.length + ' couplets)');
  lines.push('');
  for (const post of data.posts) {
    lines.push('- **' + post.text_hi + '**');
    lines.push('  - English: ' + post.text_en);
    lines.push('  - URL: ' + SITE_URL + '/couplet/' + post.slug);
    lines.push('');
  }

  lines.push('## URL Patterns');
  lines.push('- ' + SITE_URL + '/couplet/{slug}');
  lines.push('- ' + SITE_URL + '/category/{slug}/{page}');
  lines.push('- ' + SITE_URL + '/tag/{slug}/{page}');
  lines.push('- ' + SITE_URL + '/couplets/{page}');
  lines.push('- ' + SITE_URL + '/popular-couplets/{page}');
  lines.push('- ' + SITE_URL + '/featured-couplets/{page}');
  lines.push('');

  lines.push('---');
  lines.push('');
  lines.push('Generated at: ' + data.fetchedAt);
  lines.push('Total couplets: ' + data.totalCount);

  return lines.join('\n');
}

/**
 * Entry point: read data.json, generate llms.txt, and write it to public/.
 *
 * @returns {Promise<void>} Resolves when public/llms.txt has been written.
 */
async function main(): Promise<void> {
  if (!fs.existsSync(DATA_FILE)) {
    console.error('data.json not found. Run fetch:data first.');
    process.exit(1);
  }

  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  const data: SiteData = JSON.parse(raw);

  console.log('Building llms.txt from ' + data.posts.length + ' posts, ' + data.categories.length + ' categories...');

  const content = buildLlmstxt(data);
  fs.writeFileSync(OUTPUT_FILE, content, 'utf-8');

  console.log('llms.txt written to ' + OUTPUT_FILE + ' (' + content.length + ' bytes)');
}

main().catch(function (err) {
  console.error('Script failed:', err);
  process.exit(1);
});
