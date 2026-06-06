import type { JSX } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { type IconType } from 'react-icons';
import { FaFacebook, FaInstagram } from 'react-icons/fa';

/**
 * Social media platform configuration.
 */
const socialLinks: Array<{ href: string; label: string; icon: IconType }> = [
  { href: 'https://www.facebook.com/kabirkedohe.official', label: 'Facebook', icon: FaFacebook },
  { href: 'https://www.instagram.com/kabirkedohe.official', label: 'Instagram', icon: FaInstagram },
];

/**
 * Footer brand column with logo, description, and social media links.
 *
 * @returns {JSX.Element} Footer brand component.
 */
export function FooterBrand(): JSX.Element {
  return (
    <div className="flex flex-col gap-4 md:col-span-3">
      <Link href="/" className="flex shrink-0 items-center no-underline">
        <Image
          src="/logo.svg"
          alt="Kabir Dohe Hub"
          width={140}
          height={32}
          className="h-8 w-auto brightness-0 invert"
          priority
        />
      </Link>

      <p className="text-secondary-foreground/70 mb-0 text-sm leading-relaxed">
        संत कबीर के अमर दोहों की दुनिया &mdash; Explore timeless spiritual wisdom on life, devotion,
        and self-realisation in Hindi and English.
      </p>

      <div className="flex items-center gap-3">
        {socialLinks.map(({ href, label, icon: Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="flex size-9 items-center justify-center bg-white/10 text-white transition-colors duration-200 hover:bg-white/20"
          >
            <Icon size={16} />
          </a>
        ))}
      </div>
    </div>
  );
}
