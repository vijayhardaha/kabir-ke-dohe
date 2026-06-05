import type { JSX } from 'react';

import Link from 'next/link';

import { Container } from '@/components/layout/Container';
import { PageLayout } from '@/components/layout/PageLayout';
import { ButtonLink } from '@/components/ui/Button';
import { getFeaturedCouplets, getPopularCouplets, getLatestCouplets } from '@/lib/server/couplets';
import { formatDoha } from '@/lib/utils/doha';

/**
 * Home page featuring hero section, featured, popular, and latest couplets.
 *
 * @returns {Promise<JSX.Element>} The homepage with curated couplet sections.
 */
export default async function HomePage(): Promise<JSX.Element> {
  const [featured, popular, latest] = await Promise.all([
    getFeaturedCouplets(4).catch(() => []),
    getPopularCouplets(4).catch(() => []),
    getLatestCouplets(6).catch(() => []),
  ]);

  return (
    <PageLayout className="pt-0">
      {/* Hero Section */}
      <section className="bg-primary relative overflow-hidden">
        <div className="from-primary/50 absolute inset-0 bg-linear-to-br to-transparent" />
        <Container className="relative py-20 text-center text-white md:py-28">
          <h1 className="mb-4 text-4xl leading-tight font-bold md:text-5xl lg:text-6xl">Wisdom of Sant Kabir</h1>
          <p className="text-primary-foreground/80 mx-auto mb-8 max-w-2xl text-lg leading-relaxed">
            Explore the timeless dohas (couplets) of Sant Kabir Das &mdash; spiritual teachings that transcend
            centuries, offering wisdom on life, devotion, and self-realization.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <ButtonLink variant="white" size="lg" href="/couplets">
              Explore Dohas
            </ButtonLink>
            <ButtonLink variant="outline-white" size="lg" href="/couplets">
              Browse All
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* Featured Couplets */}
      {featured.length > 0 && (
        <Container className="py-16">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-foreground">Featured Couplets</h2>
              <p className="text-muted-foreground mt-1">Specially curated selections</p>
            </div>
            <ButtonLink variant="outline-primary" size="sm" href="/couplets?is_featured=true">
              View All
            </ButtonLink>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {featured.map((post) => (
              <CoupletCard key={post.id} post={post} />
            ))}
          </div>
        </Container>
      )}

      {/* Popular Couplets */}
      {popular.length > 0 && (
        <section className="bg-muted">
          <Container className="py-16">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="text-foreground">Popular Couplets</h2>
                <p className="text-muted-foreground mt-1">Most loved by readers</p>
              </div>
              <ButtonLink variant="outline-primary" size="sm" href="/popular-couplets">
                View All
              </ButtonLink>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {popular.map((post) => (
                <CoupletCard key={post.id} post={post} compact />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Latest Couplets */}
      <Container className="py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-foreground">Latest Couplets</h2>
            <p className="text-muted-foreground mt-1">Recently added dohas</p>
          </div>
          <ButtonLink variant="outline-primary" size="sm" href="/couplets">
            View All
          </ButtonLink>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {latest.map((post) => (
            <CoupletCard key={post.id} post={post} compact />
          ))}
        </div>
      </Container>
    </PageLayout>
  );
}

/**
 * Props for the {@link CoupletCard} component.
 *
 * @interface CoupletCardProps
 * @property {object} post - The couplet post data.
 * @property {string} post.slug - URL slug.
 * @property {string} post.text_hi - Hindi couplet text.
 * @property {string} post.text_en - English transliteration.
 * @property {{ name: string; slug: string } | null} post.category - Category reference, or null.
 * @property {boolean} [compact] - Whether to render a compact card variant.
 */
interface CoupletCardProps {
  post: { slug: string; text_hi: string; text_en: string; category: { name: string; slug: string } | null };
  compact?: boolean;
}

/**
 * Small card for displaying a couplet in a grid layout.
 *
 * @param {CoupletCardProps} props - Component props.
 *
 * @returns {JSX.Element} A clickable couplet card.
 */
function CoupletCard({ post, compact = false }: CoupletCardProps): JSX.Element {
  return (
    <Link href={`/couplet/${post.slug}`} className="bg-card group block p-5 no-underline">
      {post.category && (
        <span className="text-primary mb-2 inline-block text-xs font-semibold tracking-wide uppercase">
          {post.category.name}
        </span>
      )}
      <p
        className={`text-foreground leading-relaxed font-semibold ${compact ? 'line-clamp-2 text-base' : 'line-clamp-3 text-lg'}`}
      >
        {formatDoha(post.text_hi)}
      </p>
      <p className={`text-muted-foreground mt-2 italic ${compact ? 'line-clamp-1 text-sm' : 'line-clamp-2 text-sm'}`}>
        {post.text_en}
      </p>
    </Link>
  );
}
