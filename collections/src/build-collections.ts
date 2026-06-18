/**
 * Build Collections Script
 *
 * Reads couplets data from data/couplets.json and generates markdown
 * collection files in docs/, each containing 50 couplets.
 *
 * Usage:
 *   bun run build
 *
 * Data source: data/couplets.json (copied from tools/dist/data/ via prebuild)
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, basename } from 'node:path';

import ora from 'ora';
import { format } from 'prettier';

import type { CoupletsData, IndexedEntry } from './types';

const ENTRIES_PER_FILE = 50;

/**
 * SEO keywords appended to each collection file.
 */
const KABIR_KEYWORDS = [
  // Educational/Student Intent
  'Kabir ke dohe with meaning in English',
  'कबीर के दोहे अर्थ सहित English में',
  'Kabir ke dohe for students',
  'छात्रों के लिए कबीर के दोहे',
  'Kabir Das dohe and arth in Hindi',
  'कबीर दास के दोहे और उनका अर्थ',
  'Easy Kabir dohe for school project',
  'स्कूल प्रोजेक्ट के लिए आसान कबीर के दोहे',

  // Thematic/Life-Lesson Intent
  'Kabir ke dohe on truth and honesty',
  'सत्य और ईमानदारी पर कबीर के दोहे',
  'Kabir quotes on spirituality and God',
  'अध्यात्म और ईश्वर पर कबीर के विचार',
  'Kabir ke dohe on friendship (Mitrata)',
  'मित्रता पर कबीर के दोहे',
  'Kabir Das couplets on ego and pride',
  'अहंकार और घमंड पर कबीर के दोहे',

  // Format-Specific Intent
  'Kabir ke dohe PDF download',
  'कबीर के दोहे PDF डाउनलोड',
  'Best Kabir Das quotes for WhatsApp status',
  'व्हाट्सएप स्टेटस के लिए कबीर दास के विचार',
  'Kabir Amritvani lyrics in Hindi',
  'कबीर अमृतवाणी लिरिक्स हिंदी में',
];

/**
 * Generates an SEO keywords section appended to each collection file.
 * Uses HTML comments so they are invisible to readers but indexed by search engines.
 *
 * @returns {string} The SEO keywords comment block.
 */
function generateSeoKeywordsSection(): string {
  const listItems = KABIR_KEYWORDS.map((kw) => `-${kw}`).join('\n');
  return `\n---\n\n## Tags\n\n${listItems}\n`;
}

/**
 * Hindi digits for converting Latin numbers to Devanagari numerals.
 */
const HINDI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

/**
 * Converts a Latin number to Hindi (Devanagari) numerals.
 *
 * @param {number | string} latinNumber - The number to convert.
 *
 * @returns {string} The number in Hindi numerals.
 */
function latinToHindiNumber(latinNumber: number | string): string {
  return latinNumber
    .toString()
    .split('')
    .map((digit) => {
      const num = parseInt(digit, 10);
      return HINDI_DIGITS[num];
    })
    .join('');
}

/**
 * Formats newlines in a string for Markdown compatibility by adding
 * trailing backslashes for hard line breaks.
 *
 * @param {string} text - The text to format.
 *
 * @returns {string} The formatted text with Markdown line breaks.
 */
function formatMarkdownBreaks(text: string): string {
  return text.split('\n').join('\\\n');
}

/**
 * Pads a number with leading zeros to a given width.
 *
 * @param {number} number - The number to pad.
 * @param {number} width - The desired total width.
 *
 * @returns {string} The zero-padded number string.
 */
function padNumber(number: number, width: number): string {
  return number.toString().padStart(width, '0');
}

/**
 * Generates markdown content for a batch of couplet entries.
 *
 * @param {IndexedEntry[]} entries - The entries to render.
 * @param {number} startNum - The starting index (1-based) for numbering.
 *
 * @returns {string} The markdown content string.
 */
function generateMarkdownContent(entries: IndexedEntry[], startNum: number): string {
  return entries
    .map((entry, index) => {
      const entryIndex = startNum + index;
      let content = '';

      // Couplet text: split at danda (।) into separate lines with markdown breaks
      const coupletLines = entry.couplet_hindi
        .split('।')
        .map((l) => l.trim())
        .filter((l) => l.length > 0);
      const coupletText = coupletLines
        .map((line, i) => {
          if (i < coupletLines.length - 1) {
            return line + '।';
          }
          // Last line: couplet-ending ।। + numeral + marker ।।
          return line + '।।' + latinToHindiNumber(entryIndex) + '।।';
        })
        .join('\n');
      content += formatMarkdownBreaks(coupletText);
      content += '\n\n';

      // Meaning (Hindi)
      if (entry.translation_hindi) {
        content += '**अर्थ:** ' + formatMarkdownBreaks(entry.translation_hindi) + '\n\n';
      }

      return content;
    })
    .join('\n\n---\n\n');
}

/**
 * Creates markdown collection files from the couplets data.
 *
 * @param {CoupletsData} data - The couplets data map.
 * @param {ReturnType<typeof ora>} spinner - The ora spinner for progress feedback.
 *
 * @returns {Promise<void>}
 */
async function createMarkdownFiles(data: CoupletsData, spinner: ReturnType<typeof ora>): Promise<void> {
  const docsDir = resolve(process.cwd(), 'docs');

  // Ensure the docs directory exists
  await mkdir(docsDir, { recursive: true });

  // Convert the map to an array of indexed entries, sorted by post_number
  const entries: IndexedEntry[] = Object.entries(data)
    .map(([_slug, entry]) => ({
      index: entry.post_number,
      couplet_hindi: entry.text,
      translation_hindi: entry.meaning ?? '',
    }))
    .sort((a, b) => a.index - b.index);

  for (let i = 0; i < entries.length; i += ENTRIES_PER_FILE) {
    const batch = entries.slice(i, i + ENTRIES_PER_FILE);
    const startNum = i + 1;
    const startNumber = padNumber(i + 1, 2);
    const endNumber = padNumber(i + ENTRIES_PER_FILE, 2);

    const heading = `# संत कबीर जी के दोहे — ${startNumber} to ${endNumber}`;
    const content = `${heading}\n\n${generateMarkdownContent(batch, startNum)}`;

    const fileName = `collection-${startNumber}-to-${endNumber}.md`;
    const filePath = resolve(docsDir, fileName);

    let finalContent = await format(content, { parser: 'markdown' });
    // Append SEO keywords after formatting to avoid prettier stripping HTML comments
    finalContent += generateSeoKeywordsSection();
    await writeFile(filePath, finalContent, 'utf-8');

    spinner.text = `File created: ${basename(filePath)}`;
  }
}

/**
 * Main entry point.
 * Reads couplets.json and generates markdown collections.
 */
async function main(): Promise<void> {
  const spinner = ora('Reading couplets data...').start();

  try {
    const filePath = resolve(process.cwd(), 'data', 'couplets.json');
    const jsonData = await readFile(filePath, 'utf-8');
    const data: CoupletsData = JSON.parse(jsonData);

    const entryCount = Object.keys(data).length;
    spinner.text = `Found ${entryCount} couplets. Generating collections...`;

    await createMarkdownFiles(data, spinner);
    spinner.succeed(`Created ${Math.ceil(entryCount / ENTRIES_PER_FILE)} collection files in docs/`);
  } catch (error) {
    spinner.fail('Error reading or processing data:');
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Unexpected error:', error instanceof Error ? error.message : String(error));
  process.exit(1);
});
