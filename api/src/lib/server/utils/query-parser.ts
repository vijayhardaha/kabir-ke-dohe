import type { ZodSchema } from 'zod';

/**
 * Converts URLSearchParams to a plain object for Zod validation.
 *
 * @param {URLSearchParams} searchParams - The URL search parameters.
 * @param {Record<string, unknown>} defaults - Default parameter values.
 * @param {ZodSchema} schema - Zod schema for validation.
 *
 * @returns {Record<string, unknown>} Validated and parsed query parameters.
 */
export function parseQueryParams<T extends Record<string, unknown>>(
  searchParams: URLSearchParams,
  defaults: T,
  schema: ZodSchema
): unknown {
  const params: Record<string, unknown> = {};

  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  return schema.parse({ ...defaults, ...params });
}
