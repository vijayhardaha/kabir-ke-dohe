import { redirect } from 'next/navigation';

/**
 * Redirects when `page` is present in search params, converting to path-based URLs.
 * If `?page=N` is found, redirects to `/baseUrl/N` (or `/baseUrl` for page 1).
 * Preserves all other query parameters.
 *
 * Call this at the top of a base listing page. If a redirect fires, it throws
 * `NEXT_REDIRECT` and the function never returns normally.
 *
 * @param {Record<string, string | string[] | undefined>} searchParams - The page's searchParams.
 * @param {string} baseUrl - The clean base URL path (e.g. "/couplets").
 */
export function handlePageRedirect(searchParams: Record<string, string | string[] | undefined>, baseUrl: string): void {
  const pageStr = typeof searchParams.page === 'string' ? searchParams.page : undefined;
  if (pageStr === undefined) return;

  const page = Math.max(1, parseInt(pageStr, 10) || 1);

  const rest = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (key !== 'page' && typeof value === 'string') {
      rest.set(key, value);
    }
  }

  const qs = rest.toString();
  const destination = page > 1 ? `${baseUrl}/${page}` : baseUrl;
  redirect(qs ? `${destination}?${qs}` : destination);
}

/**
 * Validates and returns the page number from a `[page]` route param.
 * If the value is not a valid number or is 1 or less, redirects to the base URL.
 * When `searchParams` is provided, query parameters (except `page`) are preserved
 * in the redirect URL.
 *
 * @param {string} pageStr - The raw `[page]` route param string.
 * @param {string} baseUrl - The clean base URL path to redirect to on invalid input.
 * @param {Record<string, string | string[] | undefined>} [searchParams] - Optional search params to preserve on redirect.
 *
 * @returns {number} A validated page number (always >= 2).
 */
export function validatePageParam(
  pageStr: string,
  baseUrl: string,
  searchParams?: Record<string, string | string[] | undefined>
): number {
  const page = parseInt(pageStr, 10);

  if (isNaN(page) || page <= 1) {
    if (searchParams) {
      const rest = new URLSearchParams();
      for (const [key, value] of Object.entries(searchParams)) {
        if (key !== 'page' && typeof value === 'string') {
          rest.set(key, value);
        }
      }
      const qs = rest.toString();
      redirect(qs ? `${baseUrl}?${qs}` : baseUrl);
    }
    redirect(baseUrl);
  }

  return page;
}
