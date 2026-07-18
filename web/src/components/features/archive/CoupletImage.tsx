'use client';

import { useState, type JSX } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { getFeaturedImageUrl } from '@/lib/utils/og-image';

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
 * Environment flag — uses a plain `<img>` in development (NEXT_PUBLIC_SUPABASE_URL
 * points to a local 127.0.0.1 instance, which Next.js blocks as a private IP)
 * and the full `<Image>` component in production with responsive sizes.
 */
const IS_DEV = process.env.NODE_ENV === 'development';

/**
 * Renders the OG image for a couplet from Supabase Storage when the image
 * exists on the server. Relies on the browser's native `onError` handler to
 * hide broken images — no pre-flight HEAD request.
 *
 * In development uses a plain `<img>` to bypass Next.js's private-IP security
 * block (local Supabase on 127.0.0.1). In production uses `<Image>` from
 * next/image to generate responsive sizes and automatic format negotiation.
 *
 * When the image fails to load (404 etc.) the component returns an empty
 * fragment via `onError`.
 *
 * Wraps the image in a link to the couplet page and maintains the
 * `aspect-[120/63]` container used by archive cards.
 *
 * @param {CoupletImageProps} props - Component props.
 *
 * @returns {JSX.Element} The image element wrapped in a link, or an empty fragment.
 */
export function CoupletImage({ slug, text }: CoupletImageProps): JSX.Element {
  const src = getFeaturedImageUrl(slug);

  // Browser-level fallback — if the image load actually 404s, hide it.
  const [loadFailed, setLoadFailed] = useState(false);

  // ❌ Missing or src-less, or load failure — nothing to render.
  if (!src || loadFailed) {
    return <></>;
  }

  // ✅ Render the image and rely on native onError for 404s.
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
            onError={() => setLoadFailed(true)}
          />
        ) : (
          /* In production: <Image> provides responsive sizes + optimisation. */
          <Image
            src={src}
            alt={`Preview for ${text.slice(0, 60)}`}
            width={1200}
            height={630}
            className="h-auto w-full object-cover"
            onError={() => setLoadFailed(true)}
            sizes="(max-width: 375px) 300px, (max-width: 450px) 350px, (max-width: 560px) 480px, (max-width: 768px) 650px, (max-width: 1020px) 570px, 850px"
          />
        )}
      </Link>
    </div>
  );
}
