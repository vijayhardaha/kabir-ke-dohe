#!/usr/bin/env bun
/**
 * Generates square OG-style images for couplets from data/couplets.json.
 *
 * Reads slug → text_hi pairs, renders each through the quote-card Handlebars
 * template, and outputs 1080×1080 JPEG images to dist/images/original-square/.
 *
 * Usage:
 *   bun run couplets:images:square --all               generate images for all couplets
 *   bun run couplets:images:square balihari-guru-...    generate for a single slug
 */

import { existsSync } from 'node:fs';
import { readFile, mkdir, readdir, stat } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import ora from 'ora';

import { generateVariants, generateSvgShades, getPalette } from '../lib/colors';
import type { CoupletEntry } from '../types';

const WEBSITE_URL = 'kabirdohehub.vercel.app';

const __dirname = dirname(fileURLToPath(import.meta.url));
const __filename = fileURLToPath(import.meta.url);

// Module-level spinner reference so the Ctrl+C handler can access it
let spinner: ReturnType<typeof ora> | null = null;

// Listen for raw Ctrl+C on stdin — works even when ora puts stdin in raw mode
// (which suppresses the SIGINT signal in favour of sending the raw byte).
process.stdin.on('data', (data: Buffer) => {
  if (data.length === 1 && data[0] === 3) {
    spinner?.stop();
    process.exit(0);
  }
});

async function main(): Promise<void> {
  /* ── 1. Parse CLI args ── */
  const args = process.argv.slice(2);
  const isAll = args.includes('--all');
  const slug = isAll ? null : args[0];
  const offsetIndex = args.indexOf('--offset');
  let offset = 0;

  if (isAll && offsetIndex !== -1) {
    const offsetStr = args[offsetIndex + 1];
    if (!offsetStr || isNaN(Number(offsetStr))) {
      console.error('Error: --offset value must be a valid number');
      process.exit(1);
    }
    offset = parseInt(offsetStr, 10);
    if (offset < 0) {
      console.error('Error: --offset value must be non-negative');
      process.exit(1);
    }
  }

  if (!isAll && !slug) {
    console.error('Usage: bun run couplets:images:square [--all [--offset N] | <slug>]');
    console.error();
    console.error('  --all               Generate images for every couplet in dist/data/couplets.json');
    console.error('  --offset N          Skip first N couplets (only with --all)');
    console.error('  <slug>              Generate image for a single couplet (e.g. balihari-guru-...)');
    process.exit(1);
  }

  if (isAll && offset > 0) {
    console.log(`[images-generate-square] Using offset: ${offset}`);
  }

  /* ── 2. Read couplets data ── */
  spinner = ora('Reading couplets data…').start();

  const dataPath = resolve(__dirname, '..', '..', 'dist', 'data', 'couplets.json');
  const raw = await readFile(dataPath, 'utf-8');
  const couplets = JSON.parse(raw) as Record<string, CoupletEntry>;
  const entries = Object.entries(couplets);

  if (entries.length === 0) {
    spinner.fail("No couplets found in dist/data/couplets.json. Run 'couplets:fetch' first.");
    return;
  }

  /* ── 3. Filter entries ── */
  let filtered = isAll ? entries : entries.filter(([s]) => s === slug);

  // Apply offset: skip first N records
  if (isAll && offset > 0) {
    const before = filtered.length;
    filtered = filtered.slice(offset);
    spinner.succeed(`Skipped first ${offset} couplets (${before} → ${filtered.length} remaining)`);
    spinner = ora(`Generating ${filtered.length} images...`).start();
  }

  if (filtered.length === 0) {
    spinner.fail(isAll ? `No couplets remaining after offset ${offset}.` : `No couplet found with slug "${slug}".`);
    process.exit(1);
  }

  /* ── 4. Read template & CSS ── */
  const templatePath = resolve(__dirname, '..', '..', 'templates/quote-card-square.hbs');
  const template = await readFile(templatePath, 'utf-8');

  const cssPath = resolve(__dirname, '..', '..', 'templates/card-square.css');
  const cssTemplate = await readFile(cssPath, 'utf-8');

  /* ── 5. Ensure output directory ── */
  const outputDir = resolve(__dirname, '..', '..', 'dist', 'images', 'social-media-posts');
  await mkdir(outputDir, { recursive: true });

  /* ── 6. Detect Chrome path ── */
  const chromePath = await findChromePath();
  if (chromePath) {
    spinner.text = `Using Chrome: ${chromePath}`;
  }

  /* ── 7. Import Puppeteer ── */
  const puppeteer = await import('puppeteer');

  spinner.text = 'Generating images…';

  /* ── 8. Batch process: 100 images at a time ── */
  const BATCH_SIZE = 20;
  let totalProcessed = 0;

  for (let batchStart = 0; batchStart < filtered.length; batchStart += BATCH_SIZE) {
    const batchEnd = Math.min(batchStart + BATCH_SIZE, filtered.length);
    const batch = filtered.slice(batchStart, batchEnd);

    // Build HTML with all couplets in batch
    const batchCards = batch
      .map(([_, entry], idx) => {
        const textWithBreaks = entry.text.replace(/(।|,)\s+/g, '$1\n');
        const palette = getPalette(entry.post_number);
        const variants = generateVariants(palette.background);
        const svgColors = generateSvgShades(palette.background);

        const cardHtml = template
          .replaceAll('{{couplet_text}}', textWithBreaks)
          .replaceAll('{{couplet_meaning}}', entry.meaning ?? '')
          .replaceAll('{{website_url}}', WEBSITE_URL)
          .replaceAll('{{svg_color_1}}', svgColors[0])
          .replaceAll('{{svg_color_2}}', svgColors[1])
          .replaceAll('{{svg_color_3}}', svgColors[2])
          .replaceAll('{{svg_color_4}}', svgColors[3])
          .replaceAll('{{svg_color_5}}', svgColors[4]);

        // Wrap in div with unique ID for selector and CSS variable injection
        return `<style>${cssTemplate}</style><div id="card-${idx}" style="width: 100%; --heading-color: ${variants.heading}; --description-color: ${variants.description}">${cardHtml}</div>`;
      })
      .join('');

    const batchHtml = `<html><head><style>body { display: flex; flex-direction: column; gap: 20px; margin: 0; width: 100% }</style></head><body>${batchCards}</body></html>`;

    // Launch browser once per batch
    const browser = await puppeteer.default.launch({
      executablePath: chromePath ?? undefined,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: BATCH_SIZE * 1200, deviceScaleFactor: 2 });
    await page.setContent(batchHtml);
    await page.waitForFunction(() => document.readyState === 'complete');
    await page.waitForNetworkIdle();

    // Screenshot each card sequentially in same session
    for (let idx = 0; idx < batch.length; idx++) {
      const [slug] = batch[idx];
      const output = resolve(outputDir, `${slug}.jpg`);

      try {
        // Wait for the element to appear in the DOM
        await page.waitForSelector(`#card-${idx}`);
        const element = await page.$(`#card-${idx}`);
        if (element) {
          await element.screenshot({ path: output, type: 'jpeg', quality: 100 });
        }
      } catch (error) {
        console.error(`Failed to generate ${slug}:`, (error as Error).message);
      }

      totalProcessed++;
      spinner.text = `Generating images… (${totalProcessed}/${filtered.length})`;
    }

    await browser.close();
  }

  spinner.succeed(`${totalProcessed} image(s) generated in dist/images/social-media-posts/`);
  process.exit(0);
}

/**
 * Scans a puppeteer Chrome cache directory for a valid Chrome executable.
 *
 * Looks inside the revision directories and checks known platform paths.
 *
 * @param {string} cacheDir - Path to the `chrome/` directory inside puppeteer's cache.
 *
 * @returns {Promise<string | null>} The path to the Chrome executable, or null if not found.
 */
export async function findChromeInCache(cacheDir: string): Promise<string | null> {
  if (!existsSync(cacheDir)) {
    return null;
  }

  try {
    const entries = await readdir(cacheDir, { withFileTypes: true });
    const revisions = entries
      .filter((e) => e.isDirectory())
      .map((e) => ({ name: e.name, dir: join(cacheDir, e.name) }));

    // Sort by revision number descending (latest first)
    revisions.sort((a, b) => b.name.localeCompare(a.name, undefined, { numeric: true }));

    for (const revision of revisions) {
      // Look for Chrome.app on macOS, or chrome on Linux/Windows
      const candidates = [
        join(
          revision.dir,
          'chrome-mac-arm64',
          'Google Chrome for Testing.app',
          'Contents',
          'MacOS',
          'Google Chrome for Testing'
        ),
        join(
          revision.dir,
          'chrome-mac-x64',
          'Google Chrome for Testing.app',
          'Contents',
          'MacOS',
          'Google Chrome for Testing'
        ),
        join(revision.dir, 'chrome-linux64', 'chrome'),
        join(revision.dir, 'chrome-win64', 'chrome.exe'),
      ];

      for (const candidate of candidates) {
        try {
          await stat(candidate);
          return candidate;
        } catch {
          // Candidate doesn't exist, try next
        }
      }
    }
  } catch {
    // Cache dir is unreadable or unexpected structure
  }

  return null;
}

/**
 * Finds the Chrome executable path.
 *
 * Checks in order:
 *  1. PUPPETEER_EXECUTABLE_PATH environment variable
 *  2. Local cache at   tools/.cache/puppeteer/chrome/  (project-local install)
 *  3. Global cache at  ~/.cache/puppeteer/chrome/     (system-wide install)
 *
 * @returns {Promise<string | null>} The path to the Chrome executable, or null if not found.
 */
export async function findChromePath(): Promise<string | null> {
  // 1. Explicit env var
  const envPath = process.env.PUPPETEER_EXECUTABLE_PATH;
  if (envPath && existsSync(envPath)) {
    return envPath;
  }

  // 2. Local cache (project-local puppeteer config)
  const localCache = resolve(__dirname, '..', '..', '.cache', 'puppeteer', 'chrome');
  const local = await findChromeInCache(localCache);
  if (local) return local;

  // 3. Global cache (~/.cache/puppeteer/chrome/)
  const homedir = process.env.HOME ?? process.env.USERPROFILE ?? process.env.HOMEPATH ?? '';
  const globalCache = resolve(homedir, '.cache/puppeteer/chrome');
  const global = await findChromeInCache(globalCache);
  if (global) return global;

  return null;
}

if (process.argv[1] && resolve(process.argv[1]) === __filename) {
  main().catch((error: Error) => {
    console.error('Error:', error.message);
    process.exit(1);
  });
}
