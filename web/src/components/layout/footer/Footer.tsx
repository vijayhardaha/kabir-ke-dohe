import type { JSX } from 'react';

import { Container } from '@/components/layout/Container';
import { POPULAR_CATEGORIES, QUICK_LINKS, USEFUL_LINKS } from '@/constants/footer';

import { FooterBottomBar } from './FooterBottomBar';
import { FooterBrand } from './FooterBrand';
import { FooterLinkColumn } from './FooterLinkColumn';

/**
 * Footer component with a 3/9 grid layout — brand (logo + text + social)
 * on the left and three link columns on the right.
 * On small screens the brand spans full width and links wrap into 2 columns.
 *
 * @returns {JSX.Element} Footer component
 */
export function Footer(): JSX.Element {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <Container className="py-12">
        <div className="grid gap-8 md:grid-cols-12">
          {/* Brand column */}
          <FooterBrand />

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 md:col-span-9 md:grid-cols-3">
            <FooterLinkColumn title="Quick Links" links={QUICK_LINKS} />
            <FooterLinkColumn
              title="Popular Categories"
              links={POPULAR_CATEGORIES.map((cat) => ({ href: `/category/${cat.slug}`, label: cat.name }))}
            />
            <FooterLinkColumn title="Useful Links" links={USEFUL_LINKS} />
          </div>
        </div>
      </Container>

      <FooterBottomBar />

      {/* Disclaimer */}
      <div className="border-t border-white/10">
        <Container className="py-4">
          <p className="text-secondary-foreground/50 text-left text-xs leading-relaxed">
            <strong>Disclaimer:</strong> Kabir Dohe Hub provides dohe of Sant Kabir Das for educational and
            informational use through its platforms — Kabir Ke Dohe, Kabir Dohe API, and Kabir Dohe Images. While we
            strive for accuracy, we do not guarantee completeness or correctness. Users are responsible for their use of
            the content. The verses are not owned by us, only the services are.
          </p>
        </Container>
      </div>
    </footer>
  );
}
