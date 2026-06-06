'use client';

import type { JSX } from 'react';

import { FaFacebook, FaInstagram } from 'react-icons/fa';

/**
 * Social media platform configuration.
 */
const socialLinks = [
  { href: 'https://www.facebook.com/kabirkedohe.official', label: 'Facebook', icon: FaFacebook },
  { href: 'https://www.instagram.com/kabirkedohe.official', label: 'Instagram', icon: FaInstagram },
];

/**
 * Mobile sidebar footer with social media links.
 *
 * @returns {JSX.Element} Sidebar footer component.
 */
export function SidebarFooter(): JSX.Element {
  return (
    <div className="border-t border-gray-100 px-8 py-5">
      <div className="flex flex-nowrap items-center justify-between gap-4">
        <h3 className="text-foreground text-lg font-bold">Follow us on:</h3>
        <div className="flex items-center gap-3">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="text-secondary-foreground hover:text-primary-foreground bg-secondary hover:bg-primary flex h-9 w-9 items-center justify-center transition-colors duration-200"
            >
              <social.icon size={16} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
