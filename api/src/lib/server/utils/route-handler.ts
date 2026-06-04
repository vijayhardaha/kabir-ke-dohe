import type { NextResponse } from 'next/server';

import { success, handleRouteError } from './error-handler';

/**
 * Creates a standardized GET route handler that parses query parameters,
 * executes a request handler, and returns a cached success response.
 *
 * @template TParams - The parsed query parameter type.
 * @template TResult - The request handler result type.
 *
 * @param {(searchParams: URLSearchParams) => TParams} parseQueryParams - Parses URL params into typed parameters.
 * @param {(params: TParams) => Promise<TResult>} handleRequest - Executes the request with parsed params.
 * @param {string} [errorMessage] - Optional fallback error message.
 *
 * @returns {(request: Request) => Promise<NextResponse>} A GET route handler function.
 *
 * @example
 * ```ts
 * export const GET = createGetHandler(parseQueryParams, handleRequest, 'Failed to fetch');
 * ```
 */
export function createGetHandler<TParams, TResult>(
  parseQueryParams: (searchParams: URLSearchParams) => TParams,
  handleRequest: (params: TParams) => Promise<TResult>,
  errorMessage?: string
): (request: Request) => Promise<NextResponse> {
  return async (request: Request): Promise<NextResponse> => {
    try {
      const { searchParams } = new URL(request.url);
      const params = parseQueryParams(searchParams);
      const result = await handleRequest(params);

      return success(result);
    } catch (error) {
      return handleRouteError(error, errorMessage);
    }
  };
}
