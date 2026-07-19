/**
 * @module site-data - Shared helper to load data.json for scripts.
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

import type { SiteData } from './types';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.resolve(__dirname, '../data.json');

/**
 * Loads and parses data.json. Exits the process with an error if missing.
 *
 * @returns {SiteData} The parsed site data.
 */
export function loadSiteData(): SiteData {
  if (!fs.existsSync(DATA_FILE)) {
    console.error('data.json not found. Run fetch:data first.');
    process.exit(1);
  }

  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw) as SiteData;
}
