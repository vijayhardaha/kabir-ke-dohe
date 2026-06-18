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
import juice from 'juice';

import { COLOR_PALETTES, generateVariants, generateSvgShades } from '../lib/colors';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = resolve(__dirname, '..', '..', 'templates');
const HBS_PATH = resolve(TEMPLATES_DIR, 'quote-card.hbs');
const CSS_PATH = resolve(TEMPLATES_DIR, 'card.css');
const HTML_PATH = resolve(TEMPLATES_DIR, 'index.html');

/** Sample doha with a line break for visual preview. */
const SAMPLE_TEXT = `बलिहारी गुरु आपनो, घड़ी-घड़ी सौ-सौ बार।
मानुष से देवत किया, करत न लागी बार।।`;

/** Sample meaning for visual preview. */
const SAMPLE_MEANING = `कबीर दास जी कहते हैं कि मैं अपने गुरु पर बार-बार न्योछावर होता हूँ, क्योंकि उन्होंने मुझे मनुष्य की सीमित चेतना से उठाकर देवत्व की उच्च अवस्था तक पहुँचा दिया है, और इस महान आध्यात्मिक रूपांतरण में उन्होंने जरा भी समय नहीं लगाया।`;

/** Sample color palette for visual preview (color-9: dark blue). */
const SAMPLE_PALETTE = COLOR_PALETTES['color-9'];

const WEBSITE_URL = 'kabirdohehub.vercel.app';

/**
 * Compiles the Handlebars template into a standalone HTML file.
 *
 * Reads card.css, replaces color variables with sample values, then uses
 * juice to inline all CSS into style attributes on the HTML elements.
 *
 * @returns {Promise<void>}
 */
async function compile(): Promise<void> {
  const [template, cssRaw] = await Promise.all([readFile(HBS_PATH, 'utf-8'), readFile(CSS_PATH, 'utf-8')]);

  // Generate heading/description variants and SVG shades from the sample background
  const variants = generateVariants(SAMPLE_PALETTE.background);
  const svgColors = generateSvgShades(SAMPLE_PALETTE.background);

  // Strip Handlebars helpers and replace content + SVG vars
  let html = template
    .replace(/\{\{#if\s+\w+\}\}/g, '')
    .replace(/\{\{\/if\}\}/g, '')
    .replace('{{couplet_text}}', SAMPLE_TEXT)
    .replace('{{couplet_meaning}}', SAMPLE_MEANING)
    .replace('{{website_url}}', WEBSITE_URL)
    .replace('{{svg_color_1}}', svgColors[0])
    .replace('{{svg_color_2}}', svgColors[1])
    .replace('{{svg_color_3}}', svgColors[2])
    .replace('{{svg_color_4}}', svgColors[3])
    .replace('{{svg_color_5}}', svgColors[4]);

  // Wrap in a container with CSS variables injected via inline style
  // so card.css can reference them with var(--heading-color) and var(--description-color).
  html = `<div style="--heading-color: ${variants.heading}; --description-color: ${variants.description}">${html}</div>`;

  // Inline the CSS into the HTML
  html = (juice as (html: string, opts: { extraCss: string }) => string)(html, { extraCss: cssRaw });

  await writeFile(HTML_PATH, html);
}

/**
 * Main function that initializes the dev server and file watcher.
 *
 * @returns {Promise<void>}
 */
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

  bs.init({ server: TEMPLATES_DIR, port: 2580, open: true, files: [HTML_PATH, CSS_PATH], ui: false, notify: false });

  // Watch both the .hbs and .css files for changes and recompile
  const watcher = watch([HBS_PATH, CSS_PATH], { ignoreInitial: true, awaitWriteFinish: { stabilityThreshold: 200 } });

  watcher.on('change', async (changedPath: string) => {
    try {
      await compile();
      const label = changedPath.endsWith('.css') ? '.css change' : '.hbs change';
      console.log(`✓ Recompiled on ${label}`);
    } catch (error) {
      console.error(`✗ Compile error: ${(error as Error).message}`);
    }
  });

  console.log(`\nWatching ${HBS_PATH} and ${CSS_PATH} for changes…`);
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
