import { mkdir, readdir, writeFile } from 'node:fs/promises';
import { dirname, extname } from 'node:path';

/**
 * Ensures a directory exists, creating it recursively if needed.
 *
 * @param {string} dirPath - Path to the directory.
 *
 * @returns {Promise<void>}
 */
export async function ensureDir(dirPath: string): Promise<void> {
  await mkdir(dirPath, { recursive: true });
}

/**
 * Reads all files in a directory with a specific extension.
 *
 * @param {string} dirPath - Path to the directory.
 * @param {string} extension - File extension to filter by (e.g. ".jpg", ".webp").
 *
 * @returns {Promise<string[]>} Sorted array of matching filenames, or empty array if directory doesn't exist.
 */
export async function readFilesWithExtension(dirPath: string, extension: string): Promise<string[]> {
  try {
    return (await readdir(dirPath)).filter((f) => extname(f).toLowerCase() === extension).sort();
  } catch {
    return [];
  }
}

/**
 * Writes data to a JSON file with formatting.
 *
 * @param {string} filePath - Path to the output JSON file.
 * @param {unknown} data - Data to write (will be stringified).
 *
 * @returns {Promise<void>}
 */
export async function writeJsonFile(filePath: string, data: unknown): Promise<void> {
  await ensureDir(dirname(filePath));
  await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * Writes text to a file.
 *
 * @param {string} filePath - Path to the output text file.
 * @param {string} content - Text content to write.
 *
 * @returns {Promise<void>}
 */
export async function writeTextFile(filePath: string, content: string): Promise<void> {
  await ensureDir(dirname(filePath));
  await writeFile(filePath, content, 'utf-8');
}
