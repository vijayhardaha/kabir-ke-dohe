'use client';

import { useCallback, useState, type JSX } from 'react';

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
 * Renders the OG image for a couplet from Supabase Storage, or nothing when
 * the image hasn't been generated yet (e.g. image not found / 404).
 *
 * Wraps the image in a link to the couplet page and maintains the
 * `aspect-[120/63]` container used by archive cards.
 *
 * @param {CoupletImageProps} props - Component props.
 *
 * @returns {JSX.Element} The image element wrapped in a link, or an empty fragment.
 */
export function CoupletImage({ slug, text }: CoupletImageProps): JSX.Element {
  const [hasError, setHasError] = useState(false);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  const src = getOgImageUrl(slug);

  if (!src || hasError) {
    return <></>;
  }

  return (
    <div className="relative aspect-[120/63] w-full overflow-hidden">
      <Link href={`/couplet/${slug}`}>
        <Image
          src={src}
          alt={`Preview for ${text.slice(0, 60)}`}
          fill
          className="object-cover"
          onError={handleError}
          sizes="(max-width: 375px) 300px, (max-width: 450px) 350px, (max-width: 560px) 480px, (max-width: 768px) 650px, (max-width: 1020px) 570px, 850px"
        />
      </Link>
    </div>
  );
}
