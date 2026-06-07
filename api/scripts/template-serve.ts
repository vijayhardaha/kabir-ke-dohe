#!/usr/bin/env bun
/**
 * Development server for the quote card template.
 *
 * Watches templates/quote-card.hbs for changes, compiles it to
 * templates/index.html with sample content (sample doha + background image),
 * and serves it via Browsersync with live reload.
 *
 * Usage:
 *   bun run couplets:template:serve
 *
 * Then edit templates/quote-card.hbs — the browser will auto-reload
 * on every save, giving you instant feedback at 1200×630.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import browserSync from 'browser-sync';
import { watch } from 'chokidar';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = resolve(__dirname, 'templates');
const HBS_PATH = resolve(TEMPLATES_DIR, 'quote-card.hbs');
const HTML_PATH = resolve(TEMPLATES_DIR, 'index.html');

/** Sample doha with a line break for visual preview. */
const SAMPLE_TEXT = `बलिहारी गुरु आपनो, घड़ी-घड़ी सौ-सौ बार।
मानुष से देवत किया, करत न लागी बार।।`;

/**
 * Compiles the Handlebars template into a standalone HTML file.
 *
 * Replaces {{couplet_text}} with a sample doha and
 * {{background_image}} with a relative path to the background image.
 */
async function compile(): Promise<void> {
  let template = await readFile(HBS_PATH, 'utf-8');

  template = template
    .replace('{{couplet_text}}', SAMPLE_TEXT)
    .replace('{{background_image}}', 'http://localhost:2580/backgrounds/sample-bg.jpg');

  await writeFile(HTML_PATH, template);
}

async function main(): Promise<void> {
  try {
    await compile();
    console.log(`✓ Compiled to ${HTML_PATH}`);
  } catch (error) {
    console.error(`✗ Failed to compile template: ${(error as Error).message}`);
    process.exit(1);
  }

  // Start Browsersync (serves templates/ and reloads on HTML changes)
  const bs = browserSync.create();

  bs.init({ server: TEMPLATES_DIR, port: 2580, open: true, files: [HTML_PATH], ui: false, notify: false });

  // Watch the .hbs file for changes and recompile
  const watcher = watch(HBS_PATH, { ignoreInitial: true, awaitWriteFinish: { stabilityThreshold: 200 } });

  watcher.on('change', async () => {
    try {
      await compile();
      console.log('✓ Recompiled on .hbs change');
    } catch (error) {
      console.error(`✗ Compile error: ${(error as Error).message}`);
    }
  });

  console.log(`\nWatching ${HBS_PATH} for changes…`);
  console.log(`Preview at http://localhost:2580\n`);

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\nShutting down…');
    await watcher.close();
    bs.exit();
  });
}

main().catch((error) => {
  console.error('Error:', (error as Error).message);
  process.exit(1);
});
