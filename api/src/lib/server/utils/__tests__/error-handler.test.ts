/**
 * Unit tests for error-handler helpers, verifying status codes and payload shapes for API outputs
 * and error handling behavior.
 *
 * @package
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { z } from 'zod';

import { success, handleRouteError } from '@/lib/server/utils/error-handler';

// Keep response utilities isolated to verify shared response contract consistency.
describe('success', () => {
  // Verify cached response returns 200 status
  it('should return NextResponse with 200 status', () => {
    const response = success({ message: 'test' });

    expect(response.status).toBe(200);
  });

  // Verify cached response includes success flag
  it('should include success: true in body', async () => {
    const response = success({ id: 1 });
    const body = await response.json();

    expect(body.success).toBe(true);
  });

  // Verify cached response includes provided data
  it('should include data in body', async () => {
    const testData = { id: 1, name: 'test' };
    const response = success(testData);
    const body = await response.json();

    expect(body.data).toEqual(testData);
  });

  // Verify cached response includes Cache-Control header
  it('should include Cache-Control header', () => {
    const response = success({ message: 'test' });

    expect(response.headers.get('Cache-Control')).toBe('s-maxage=60, stale-while-revalidate=300');
  });
});

describe('handleRouteError', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should handle ZodError', () => {
    const schema = z.object({ name: z.string().min(3, 'Name must be at least 3 characters') });
    let zodError: z.ZodError;
    try {
      schema.parse({ name: 'ab' });
    } catch (e) {
      zodError = e as z.ZodError;
    }
    const response = handleRouteError(zodError!);
    expect(response.status).toBe(500);
  });

  it('should return 500 for generic Error', () => {
    const response = handleRouteError(new Error('Route failed'));
    expect(response.status).toBe(500);
  });

  it('should use custom status from ApiError', async () => {
    const { ApiError } = await import('@/lib/server/utils/api-error');
    const response = handleRouteError(new ApiError('Not found', 404));
    expect(response.status).toBe(404);
  });

  it('should include error message in body for ApiError', async () => {
    const { ApiError } = await import('@/lib/server/utils/api-error');
    const response = handleRouteError(new ApiError('Invalid token', 401));
    const body = await response.json();
    expect(body.error).toBe('Invalid token');
  });

  it('should use fallback message for non-error throws', async () => {
    const response = handleRouteError('string error', 'Custom fallback');
    const body = await response.json();
    expect(body.error).toContain('Custom fallback');
  });
});
