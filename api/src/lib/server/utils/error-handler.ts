import { NextResponse } from 'next/server';
import { z } from 'zod';

import { ApiError } from '@/lib/server/utils/api-error';

// ---------------------------------------------------------------------------
// Response types
// ---------------------------------------------------------------------------

/**
 * Defines the standardized successful API response envelope carrying typed response payloads.
 *
 * @template T - The type of the response data.
 *
 * @type {ApiSuccess<T>}
 * @property {true} success - Indicates success.
 * @property {T} data - Response data.
 */
interface ApiSuccess<T> {
  success: true;
  data: T;
}

/**
 * Defines the standardized error API response envelope for predictable client handling.
 *
 * @type {ApiError}
 * @property {number} code - HTTP status code.
 * @property {string} error - Error message.
 */
interface ApiErrorResponse {
  code: number;
  error: string;
}

// ---------------------------------------------------------------------------
// Response helpers
// ---------------------------------------------------------------------------

/**
 * Creates a cached success response with Cache-Control headers for CDN-level caching.
 *
 * @template T - The type of the response data.
 *
 * @param {T} data - Serialized payload returned to API consumers.
 *
 * @returns {NextResponse} JSON response containing success metadata, data, and cache headers.
 *
 * @example
 * return success({ posts: [...], total: 100 });
 */
export function success<T>(data: T): NextResponse {
  return NextResponse.json({ success: true, data } as ApiSuccess<T>, {
    status: 200,
    headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' },
  });
}

/**
 * Creates a standardized error response payload for predictable API failure handling.
 *
 * @param {string} message - Human-readable error message safe for clients.
 * @param {number} [status] - HTTP status code returned with the failure payload.
 *
 * @returns {NextResponse} JSON response containing error details and status code.
 *
 * @example
 * return failure("Unauthorized request", 401);
 */
function failure(message: string, status: number = 500): NextResponse {
  return NextResponse.json({ code: status, error: message } as ApiErrorResponse, { status });
}

// ---------------------------------------------------------------------------
// Error handlers
// ---------------------------------------------------------------------------

/**
 * Handles API route errors consistently and returns standardized JSON failure responses.
 *
 * @param {Error} error - Error instance thrown from route handlers or service layers.
 *
 * @returns {NextResponse} Structured error response with safe message and HTTP status.
 *
 * @example
 * return handleError(new ApiError("Invalid token", 401));
 * // Responds with a typed 401 failure payload.
 */
function handleError(error: Error): NextResponse {
  // Capture diagnostic fields while avoiding stack traces in production logs.
  console.error('Error:', {
    name: error.name,
    message: error.message,
    //stack: process.env.NODE_ENV === 'production' ? undefined : error.stack,
  });

  // Operational ApiError instances carry intentional status codes for client responses.
  if (error instanceof ApiError && error.isOperational) {
    return failure(error.message, error.statusCode);
  }

  // Treat generic Error instances as internal failures when no richer type is available.
  if (error.name === 'Error' || error.constructor.name === 'Error') {
    return failure(error.message || 'Internal Server Error: Something went wrong. Please try again later.', 500);
  }

  // Emit extra debugging context in non-production to speed up local troubleshooting.
  if (process.env.NODE_ENV !== 'production') {
    console.error('UNEXPECTED ERROR:', error);
  }

  // Fallback for non-Error throwables and unknown runtime exception shapes.
  return failure('Unexpected error occurred during sync process', 500);
}

/**
 * Handles route-level errors including Zod validation errors.
 *
 * @param {unknown} error - The error thrown in a route handler.
 * @param {string} [fallbackMessage] - Fallback message when the error is not an Error instance.
 *
 * @returns {NextResponse} A standardized error response.
 */
export function handleRouteError(error: unknown, fallbackMessage: string = 'An error occurred'): NextResponse {
  if (error instanceof z.ZodError) {
    const message = error.issues.map((e: z.ZodIssue) => e.message).join(', ');
    return handleError(new Error(`Validation error: ${message}`));
  }

  return handleError(error instanceof Error ? error : new Error(fallbackMessage));
}
