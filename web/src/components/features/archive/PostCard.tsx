'use client';

import type { JSX } from 'react';

import { Share2 } from 'lucide-react';
import Link from 'next/link';

import { Button, ButtonLink } from '@/components/ui/Button';
import { formatDoha } from '@/lib/utils/doha';
import type { Post } from '@/types';

/**
 * Single post card used within the archive loop — one card per row.
 *
 * @param {{ post: Post }} props - Component props
 * @param {Post} props.post - The post to display
 *
 * @returns {JSX.Element} Post card component
 */
export function PostCard({ post }: { post: Post }): JSX.Element {
  /**
   * Shares the couplet URL using the Web Share API or clipboard fallback.
   */
  const handleShare = async (): Promise<void> => {
    const url = `${window.location.origin}/couplet/${post.slug}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Kabir Doha', text: post.text_hi, url });
      } else {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      // User dismissed share dialog or clipboard write failed — no action needed
    }
  };

  return (
    <article className="bg-card flex flex-col gap-4 p-6 md:p-8">
      {/* ---- Doha heading ---- */}
      <h2 className="text-foreground text-xl leading-snug tracking-normal whitespace-pre-line md:text-3xl lg:text-4xl">
        <Link href={`/couplet/${post.slug}`} className="text-secondary hover:text-primary hover:underline">
          {formatDoha(post.text_hi)}
        </Link>
      </h2>

      {/* ---- Meta: author + tags ---- */}
      <div className="text-foreground flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium md:text-base">
        <span>
          By{' '}
          <a
            href="https://en.wikipedia.org/wiki/Kabir"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            Sant Kabir Das
          </a>
        </span>
        {post.tags.length > 0 && (
          <>
            <span aria-hidden="true" className="text-xs">
              |
            </span>{' '}
            {post.tags.map((tag, idx) => (
              <span key={tag.slug}>
                <Link href={`/tag/${tag.slug}`} className="text-foreground hover:text-primary underline">
                  {tag.name}
                </Link>
                {idx < post.tags.length - 1 && <span>, </span>}
              </span>
            ))}
          </>
        )}
      </div>

      {/* ---- Meanings ---- */}
      {(post.meaning_hi || post.meaning_en) && (
        <div className="bg-muted flex flex-col p-4">
          {post.meaning_hi && (
            <p className="text-foreground leading-relaxed">
              <strong className="text-foreground font-bold">अर्थ:</strong> {post.meaning_hi}
            </p>
          )}
          {post.meaning_en && (
            <p className="text-foreground leading-relaxed">
              <strong className="text-foreground font-bold">Meaning:</strong> {post.meaning_en}
            </p>
          )}
        </div>
      )}

      {/* ---- Actions ---- */}
      <div className="flex flex-wrap items-center gap-3">
        <ButtonLink href={`/couplet/${post.slug}`} variant="primary" size="md">
          Read More
        </ButtonLink>
        <Button variant="outline-primary" size="md" onClick={handleShare}>
          <Share2 size={16} aria-label="Share" />
          Share
        </Button>
      </div>
    </article>
  );
}
