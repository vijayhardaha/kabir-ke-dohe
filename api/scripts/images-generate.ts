#!/usr/bin/env bun
/**
 * Generates OG-style images for couplets from data/couplets.json.
 *
 * Reads slug → text_hi pairs, renders each through the quote-card Handlebars
 * template, and outputs 1200×630 JPEG images to output/images/original/.
 *
 * Usage:
 *   bun run couplets:images --all               generate images for all couplets
 *   bun run couplets:images balihari-guru-...    generate for a single slug
 */

import { existsSync } from 'node:fs';
import { readFile, mkdir, readdir, stat } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import ora from 'ora';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main(): Promise<void> {
  /* ── 1. Parse CLI args ── */
  const args = process.argv.slice(2);
  const isAll = args.includes('--all');
  const slug = isAll ? null : args[0];

  if (!isAll && !slug) {
    console.error('Usage: bun run couplets:images [--all | <slug>]');
    console.error();
    console.error('  --all     Generate images for every couplet in output/data/couplets.json');
    console.error('  <slug>    Generate image for a single couplet (e.g. balihari-guru-...)');
    process.exit(1);
  }

  /* ── 2. Read couplets data ── */
  const spinner = ora('Reading couplets data…').start();

  const dataPath = resolve(__dirname, 'output', 'data', 'couplets.json');
  const raw = await readFile(dataPath, 'utf-8');
  const couplets = JSON.parse(raw) as Record<string, string>;
  const entries = Object.entries(couplets);

  if (entries.length === 0) {
    spinner.fail("No couplets found in output/data/couplets.json. Run 'couplets:fetch' first.");
    return;
  }

  /* ── 3. Filter entries ── */
  const filtered = isAll ? entries : entries.filter(([s]) => s === slug);

  if (filtered.length === 0) {
    spinner.fail(`No couplet found with slug "${slug}".`);
    process.exit(1);
  }

  /* ── 4. Read template ── */
  const templatePath = resolve(__dirname, 'templates/quote-card.hbs');
  const template = await readFile(templatePath, 'utf-8');

  /* ── 5. Background image URL (hardcoded — serve api/public/ on :2580) ── */
  const backgroundImage = 'http://localhost:2580/backgrounds/sample-bg.jpg';

  /* ── 6. Ensure original output directory ── */
  const outputDir = resolve(__dirname, 'output', 'images', 'original');
  await mkdir(outputDir, { recursive: true });

  /* ── 7. Detect Chrome path ── */
  const chromePath = await findChromePath();
  if (chromePath) {
    spinner.text = `Using Chrome: ${chromePath}`;
  }

  /* ── 8. Import node-html-to-image ── */

  const { default: generate }: { default: (...args: any[]) => any } = await import('node-html-to-image');

  spinner.text = 'Generating images…';

  /* ── 9. Generate each image (sequential to avoid multiple Puppeteer instances) ── */
  for (let i = 0; i < filtered.length; i++) {
    const [s, text] = filtered[i];
    const output = resolve(outputDir, `${s}.jpg`);

    // Insert line breaks at natural doha line endings (। + space → । + newline)
    const textWithBreaks = text.replace(/। /g, '।\n');

    await generate({
      output,
      html: template,
      content: { couplet_text: textWithBreaks, background_image: backgroundImage },
      type: 'jpeg',
      quality: 100,
      puppeteerArgs: {
        executablePath: chromePath ?? undefined,
        defaultViewport: { width: 1200, height: 630 },
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
    });

    spinner.text = `Generating images… (${i + 1}/${filtered.length})`;
  }

  spinner.succeed(`${filtered.length} image(s) generated in output/images/original/`);
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
 *  2. Local cache at   api/.cache/puppeteer/chrome/  (project-local install)
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
  const localCache = resolve(__dirname, '.cache', 'puppeteer', 'chrome');
  const local = await findChromeInCache(localCache);
  if (local) return local;

  // 3. Global cache (~/.cache/puppeteer/chrome/)
  const homedir = process.env.HOME ?? process.env.USERPROFILE ?? process.env.HOMEPATH ?? '';
  const globalCache = resolve(homedir, '.cache/puppeteer/chrome');
  const global = await findChromeInCache(globalCache);
  if (global) return global;

  return null;
}

main().catch((error: Error) => {
  console.error('Error:', error.message);
  process.exit(1);
});
