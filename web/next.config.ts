/**
 * ======================================================================
 * Next Configuration
 * ======================================================================
 * Purpose: Centralized runtime and build-time configuration for Next.js.
 * Docs:    https://nextjs.org/docs/app/api-reference/config/next-config-js
 * ======================================================================
 */

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // ---- Core runtime settings ----
  reactStrictMode: true,

  // ---- Security & headers ----
  poweredByHeader: false,

  // ---- Images ----
  images: { remotePatterns: [{ protocol: 'https', hostname: '*.supabase.co' }], formats: ['image/avif', 'image/webp'] },
};

export default nextConfig;
