import { NextResponse, type NextRequest } from 'next/server';

export const runtime = 'edge';

import { getSupabase } from '@/lib/server/supabase';

/**
 * Cookie name for storing viewed couplets and identity hash.
 */
const COOKIE_NAME = 'kabirhub_views';

/**
 * Cookie expiry in seconds (1 day).
 */
const COOKIE_MAX_AGE = 86400;

/**
 * Simple non-crypto hash for IP + User-Agent identity.
 * Good enough for deduplication without storing raw PII.
 *
 * @param {string} str - The string to hash (concatenated IP + User-Agent).
 *
 * @returns {string} Base-36 encoded numeric hash.
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return Math.abs(hash).toString(36);
}

/**
 * Parsed shape of the view-tracking cookie.
 *
 * @type {ViewCookie}
 * @property {string} h - Hash of IP + User-Agent
 * @property {string[]} v - Array of viewed couplet slugs
 */
interface ViewCookie {
  h: string;
  v: string[];
}

/**
 * POST /api/couplets/view
 *
 * Tracks a unique view for a couplet. Uses a 1-day cookie with identity
 * hashing (IP + User-Agent) to deduplicate views without storing PII.
 *
 * @param {NextRequest} request - The incoming request object.
 *
 * @returns {Promise<NextResponse>} JSON response indicating success.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as { slug?: string };
    const slug = body.slug;

    if (!slug || typeof slug !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid slug' }, { status: 400 });
    }

    // Gather identity signals from request headers
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? request.headers.get('x-real-ip') ?? 'unknown';
    const userAgent = request.headers.get('user-agent') ?? 'unknown';

    const identityHash = simpleHash(`${ip}|${userAgent}`);

    // Read and parse the existing cookie
    const rawCookie = request.cookies.get(COOKIE_NAME)?.value;
    let cookieData: ViewCookie | null = null;

    if (rawCookie) {
      try {
        const parsed = JSON.parse(rawCookie) as ViewCookie;
        if (typeof parsed.h === 'string' && Array.isArray(parsed.v)) {
          cookieData = parsed;
        }
      } catch {
        // Malformed cookie — treat as missing
      }
    }

    const supabase = getSupabase();
    let shouldIncrement = false;

    if (!cookieData || cookieData.h !== identityHash) {
      // New visitor or identity changed — always increment
      shouldIncrement = true;
      cookieData = { h: identityHash, v: [slug] };
    } else if (!cookieData.v.includes(slug)) {
      // Same visitor, new couplet — increment
      shouldIncrement = true;
      cookieData.v.push(slug);
    }
    // If same visitor + already viewed slug → skip (no action needed)

    if (shouldIncrement) {
      const { error } = await supabase.rpc('increment_couplet_view', { p_slug: slug } as never);

      if (error) {
        console.error('[view] Supabase RPC error:', error.message);
        return NextResponse.json({ error: 'Failed to record view' }, { status: 500 });
      }
    }

    // Set/update the cookie
    const response = NextResponse.json({ ok: true });
    response.cookies.set(COOKIE_NAME, JSON.stringify(cookieData), {
      maxAge: COOKIE_MAX_AGE,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return response;
  } catch (err) {
    console.error('[view] Unexpected error:', err instanceof Error ? err.message : String(err));
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
