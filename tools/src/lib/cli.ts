import ora from 'ora';

/**
 * Type alias for ora spinner instance or null.
 */
export type Spinner = ReturnType<typeof ora> | null;

/**
 * Initializes a spinner with Ctrl+C handler for graceful shutdown.
 *
 * @param {string} [initialText] - Initial spinner text.
 *
 * @returns {ReturnType<typeof ora>} The initialized spinner instance.
 *
 * @example
 * const spinner = initSpinner('Loading...');
 * spinner.succeed('Done!');
 */
export function initSpinner(initialText?: string): ReturnType<typeof ora> {
  const spinner = ora(initialText).start();

  // Listen for raw Ctrl+C on stdin
  process.stdin.on('data', (data: Buffer) => {
    if (data.length === 1 && data[0] === 3) {
      spinner.stop();
      process.exit(0);
    }
  });

  return spinner;
}

/**
 * Handles script errors and exits with spinner feedback.
 *
 * @param {ReturnType<typeof ora>} spinner - The spinner instance.
 * @param {string} message - Error message to display.
 * @param {unknown} [error] - The error object (optional).
 *
 * @returns {never} Exits the process with code 1.
 *
 * @example
 * if (!data) {
 *   handleScriptError(spinner, 'Failed to load data', error);
 * }
 */
export function handleScriptError(spinner: ReturnType<typeof ora>, message: string, error?: unknown): never {
  const errorMsg = error instanceof Error ? `: ${error.message}` : '';
  spinner.fail(message + errorMsg);
  process.exit(1);
}

/**
 * Fetches paginated data from Supabase with automatic pagination.
 *
 * @template T - Type of the data being fetched.
 *
 * @param {(from: number, size: number) => Promise<T[]>} fetcher - Async function that fetches a page of data.
 * @param {number} [pageSize] - Number of items per page.
 *
 * @returns {Promise<T[]>} All fetched items from all pages.
 *
 * @example
 * const allPosts = await fetchPaginated(async (from, size) => {
 *   const { data } = await supabase.from('posts')
 *     .select('*')
 *     .range(from, from + size - 1);
 *   return data ?? [];
 * });
 */
export async function fetchPaginated<T>(
  fetcher: (from: number, size: number) => Promise<T[]>,
  pageSize: number = 1000
): Promise<T[]> {
  const allItems: T[] = [];
  let from = 0;

  while (true) {
    const items = await fetcher(from, pageSize);

    if (items.length === 0) break;

    allItems.push(...items);

    if (items.length < pageSize) break;

    from += pageSize;
  }

  return allItems;
}
