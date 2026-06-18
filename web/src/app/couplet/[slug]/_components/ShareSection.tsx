import type { JSX } from 'react';

import {
  RiWhatsappFill,
  RiTwitterXFill,
  RiBlueskyFill,
  RiFacebookFill,
  RiTelegramFill,
  RiLinkedinFill,
  RiMailLine,
} from 'react-icons/ri';

import { Tooltip } from '@/components/ui/Tooltip';

import { ShareButton } from './ShareButton';

/**
 * Social media sharing section for a couplet detail page.
 * Renders buttons for WhatsApp, X, Bluesky, Facebook, Telegram, LinkedIn, and Email.
 *
 * @param {{ textHi: string; postUrl: string }} props - Component props.
 * @param {string} props.textHi - Hindi text of the couplet to share.
 * @param {string} props.postUrl - Absolute URL of the couplet page.
 *
 * @returns {JSX.Element} The share section with action buttons.
 */
export function ShareSection({ textHi, postUrl }: { textHi: string; postUrl: string }): JSX.Element {
  return (
    <section className="border-border mt-12 border-t border-b py-8">
      <h2 className="text-foreground mb-4 text-lg font-semibold">
        इस प्रेरणादायक दोहे को अपने दोस्तों के साथ साझा करें (Share this inspiring couplet with your friends):
      </h2>
      <div className="flex flex-wrap gap-3">
        <Tooltip content="WhatsApp">
          <ShareButton
            href={`https://wa.me/?text=${encodeURIComponent(`${textHi} ${postUrl}`)}`}
            label="Share on WhatsApp"
          >
            <RiWhatsappFill size={20} />
          </ShareButton>
        </Tooltip>
        <Tooltip content="X (Twitter)">
          <ShareButton
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(textHi)}&url=${encodeURIComponent(postUrl)}`}
            label="Share on X"
          >
            <RiTwitterXFill size={20} />
          </ShareButton>
        </Tooltip>
        <Tooltip content="Bluesky">
          <ShareButton
            href={`https://bsky.app/intent/compose?text=${encodeURIComponent(`${textHi} ${postUrl}`)}`}
            label="Share on Bluesky"
          >
            <RiBlueskyFill size={20} />
          </ShareButton>
        </Tooltip>
        <Tooltip content="Facebook">
          <ShareButton
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`}
            label="Share on Facebook"
          >
            <RiFacebookFill size={20} />
          </ShareButton>
        </Tooltip>
        <Tooltip content="Telegram">
          <ShareButton
            href={`https://t.me/share/url?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(textHi)}`}
            label="Share on Telegram"
          >
            <RiTelegramFill size={20} />
          </ShareButton>
        </Tooltip>
        <Tooltip content="LinkedIn">
          <ShareButton
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`}
            label="Share on LinkedIn"
          >
            <RiLinkedinFill size={20} />
          </ShareButton>
        </Tooltip>
        <Tooltip content="Email">
          <ShareButton
            href={`mailto:?subject=${encodeURIComponent(textHi)}&body=${encodeURIComponent(`${textHi} - ${postUrl}`)}`}
            label="Share via Email"
          >
            <RiMailLine size={20} />
          </ShareButton>
        </Tooltip>
      </div>
    </section>
  );
}
