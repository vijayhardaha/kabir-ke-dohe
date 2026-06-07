'use client';

import { useCallback, useEffect, useState, type JSX } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { getOgImageUrl } from '@/lib/utils/og-image';

/**
 * Props for the CoupletImage component.
 *
 * @type {CoupletImageProps}
 * @property {string} slug - Couplet slug used to construct the OG image URL.
 * @property {string} text - Hindi text of the couplet (used in the alt attribute).
 */
interface CoupletImageProps {
  slug: string;
  text: string;
}

/**
 * Tracks whether the image at a given URL exists on the server.
 *
 * - `'loading'` – HEAD request in-flight (render nothing).
 * - `'exists'`  – HEAD confirmed 200 OK (render with confidence).
 * - `'missing'` – HEAD returned 404 (definitely gone, render nothing).
 * - `'unknown'` – HEAD failed (likely CORS) — render and rely on
 *                 the browser's native onError to detect actual 404s.
 */
type ImageStatus = 'loading' | 'exists' | 'missing' | 'unknown';

/**
 * Environment flag — uses a plain `<img>` in development (NEXT_PUBLIC_SUPABASE_URL
 * points to a local 127.0.0.1 instance, which Next.js blocks as a private IP)
 * and the full `<Image>` component in production with responsive sizes.
 */
const IS_DEV = process.env.NODE_ENV === 'development';

/**
 * Renders the OG image for a couplet from Supabase Storage when the image
 * exists on the server. Performs a lightweight HEAD request before rendering
 * to avoid broken-image loads.
 *
 * In development uses a plain `<img>` to bypass Next.js's private-IP security
 * block (local Supabase on 127.0.0.1). In production uses `<Image>` from
 * next/image to generate responsive sizes and automatic format negotiation.
 *
 * When the HEAD request can't complete (e.g. CORS in local dev) the
 * component falls through to the native `onError` handler so valid images
 * still show — only confirmed-404 responses are hidden.
 *
 * Wraps the image in a link to the couplet page and maintains the
 * `aspect-[120/63]` container used by archive cards.
 *
 * @param {CoupletImageProps} props - Component props.
 *
 * @returns {JSX.Element} The image element wrapped in a link, or an empty fragment.
 */
export function CoupletImage({ slug, text }: CoupletImageProps): JSX.Element {
  const src = getOgImageUrl(slug);

  // 'missing' when no src URL is available, 'loading' otherwise
  const [imageStatus, setImageStatus] = useState<ImageStatus>(src ? 'loading' : 'missing');

  // Lightweight pre-check: does the image exist on the server?
  useEffect(() => {
    if (!src) return;

    let cancelled = false;

    fetch(src, { method: 'HEAD' })
      .then((res) => {
        if (!cancelled) {
          setImageStatus(res.ok ? 'exists' : 'missing');
        }
      })
      .catch(() => {
        // Network error (e.g. CORS in local dev) — don't assume missing;
        // the onError handler below will handle actual load failures.
        if (!cancelled) {
          setImageStatus('unknown');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [src]);

  // Browser-level fallback — if the image load actually 404s, hide it.
  const [loadFailed, setLoadFailed] = useState(false);

  const handleError = useCallback(() => {
    setLoadFailed(true);
  }, []);

  // ❌ Missing or src-less — nothing to render.
  if (!src || imageStatus === 'missing' || loadFailed) {
    return <></>;
  }

  // ⏳ Still checking — render nothing briefly.
  if (imageStatus === 'loading') {
    return <></>;
  }

  // ✅ Confirmed exists, or HEAD failed (likely CORS) — render the image.
  return (
    <div className="w-full overflow-hidden">
      <Link href={`/couplet/${slug}`}>
        {IS_DEV ? (
          /* In development: plain <img> bypasses Next.js private-IP security. */
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={src}
            alt={`Preview for ${text.slice(0, 60)}`}
            loading="lazy"
            className="h-auto w-full object-cover"
            onError={handleError}
          />
        ) : (
          /* In production: <Image> provides responsive sizes + optimisation. */
          <Image
            src={src}
            alt={`Preview for ${text.slice(0, 60)}`}
            width={1200}
            height={630}
            className="h-auto w-full object-cover"
            onError={handleError}
            sizes="(max-width: 375px) 300px, (max-width: 450px) 350px, (max-width: 560px) 480px, (max-width: 768px) 650px, (max-width: 1020px) 570px, 850px"
          />
        )}
      </Link>
    </div>
  );
}
