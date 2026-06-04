import { NextResponse } from 'next/server';

/**
 * Interface for the API response.
 *
 * @type {ApiResponse}
 * @property {boolean} success - Indicates success.
 * @property {string} message - Response message.
 */
interface ApiResponse {
  success: boolean;
  message: string;
}

/**
 * Edge runtime configuration for the API route.
 */
export const runtime = 'edge';

/**
 * Handles GET requests to the root API endpoint.
 *
 * @returns {Promise<NextResponse>} A JSON response containing a success message
 * and instructions for using the API.
 *
 * @async
 * @function GET
 */
export async function GET(): Promise<NextResponse<ApiResponse>> {
  return NextResponse.json({
    success: true,
    message: 'Welcome to the Kabir Dohe API! Use the /api/couplets endpoint to retrieve and filter couplets.',
  });
}
