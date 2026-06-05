import { type JSX } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { FaFacebook, FaInstagram } from 'react-icons/fa';

import { CATEGORIES } from '@/constants/categories';

import { Container } from './Container';

/**
 * Quick-link items for column navigation.
 */
const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/couplets', label: 'Couplets' },
  { href: '/featured-couplets', label: 'Featured Couplets' },
  { href: '/popular-couplets', label: 'Popular Couplets' },
  { href: '/categories', label: 'Categories' },
  { href: '/tags', label: 'Tags' },
];

/**
 * Useful links column.
 */
const usefulLinks = [
  { href: '/about', label: 'About' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms & Conditions' },
  { href: '/docs', label: 'API Documentation' },
];

/**
 * Popular categories shown in the footer (first 6).
 */
const popularCategories = CATEGORIES.slice(0, 10);

/**
 * Social media platform configuration.
 */
const socialLinks = [
  { href: '#', label: 'Facebook', icon: FaFacebook },
  { href: '#', label: 'Instagram', icon: FaInstagram },
];

/**
 * Footer component with a 3/9 grid layout — sidebar (logo + text + social)
 * on the left and three link columns on the right.
 * On small screens the sidebar spans full width and links wrap into 2 columns.
 *
 * @returns {JSX.Element} Footer component
 */
export function Footer(): JSX.Element {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-secondary-foreground mt-16">
      <Container className="py-12">
        <div className="grid gap-8 md:grid-cols-12">
          {/* ---- Sidebar: Logo + Description + Social (3/12 on desktop, full on mobile) ---- */}
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
              Explore the timeless dohas of Sant Kabir &mdash; spiritual wisdom on life, devotion, and self-realisation
              in Hindi and English.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex size-9 items-center justify-center bg-white/10 text-white transition-colors duration-200 hover:bg-white/20"
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* ---- Link Columns (9/12 on desktop) ---- */}
          <div className="grid grid-cols-2 gap-8 md:col-span-9 md:grid-cols-3">
            {/* ---- Quick Links ---- */}
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold tracking-wider uppercase">Quick Links</h3>
              <ul className="flex flex-col gap-2">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-secondary-foreground/70 text-sm no-underline transition-colors duration-200 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ---- Popular Categories ---- */}
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold tracking-wider uppercase">Popular Categories</h3>
              <ul className="flex flex-col gap-2">
                {popularCategories.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`/category/${cat.slug}`}
                      className="text-secondary-foreground/70 text-sm no-underline transition-colors duration-200 hover:text-white"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ---- Useful Links ---- */}
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold tracking-wider uppercase">Useful Links</h3>
              <ul className="flex flex-col gap-2">
                {usefulLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-secondary-foreground/70 text-sm no-underline transition-colors duration-200 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>

      {/* ---- Bottom Bar ---- */}
      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-secondary-foreground/60 text-sm">
            &copy; {currentYear} Kabir Dohe Hub. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="text-secondary-foreground/60 text-sm no-underline transition-colors duration-200 hover:text-white"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-secondary-foreground/60 text-sm no-underline transition-colors duration-200 hover:text-white"
            >
              Terms &amp; Conditions
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
