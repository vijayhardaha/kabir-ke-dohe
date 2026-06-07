import type { JSX } from 'react';

import { webPageSchema } from '@vijayhardaha/schema-builder';
import { JsonLd } from '@vijayhardaha/schema-builder/react';
import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

import HeroCarousel from '@/components/features/HeroCarousel';
import QuoteCard from '@/components/features/QuoteCard';
import { Container } from '@/components/layout/Container';
import { PageLayout } from '@/components/layout/PageLayout';
import { ButtonLink } from '@/components/ui/Button';
import { KABIR_MESSAGES } from '@/constants/kabirMessages';
import { getFeaturedCouplets, getPopularCouplets, getLatestCouplets } from '@/lib/server/couplets';
import { buildMetadata } from '@/lib/utils/meta';
import { globalSchema } from '@/lib/utils/schema';
import { siteUrl } from '@/lib/utils/seo';

/**
 * Home page featuring hero section, featured, popular, and latest couplets.
 *
 * @returns {Promise<JSX.Element>} The homepage with curated couplet sections.
 */
const SITE_DESCRIPTION =
  "Explore the timeless wisdom of Sant Kabir through his dohas (couplets). Read, learn, and reflect on the spiritual teachings of one of India's most revered poets with Hindi and English translations.";

export const metadata: Metadata = buildMetadata({
  title: 'Kabir Ke Dohe - Wisdom of Sant Kabir',
  description: SITE_DESCRIPTION,
  path: '',
});

const rootUrl = siteUrl();
const homeSchema = [...globalSchema(), webPageSchema({ rootUrl, path: '' })];

/**
 * Pick a random message from KABIR_MESSAGES.
 *
 * @param {string} [exclude] - Optional message to avoid (prevents duplicates).
 *
 * @returns {string} A random wisdom message.
 */
function getRandomMessage(exclude?: string): string {
  let message: string;
  do {
    message = KABIR_MESSAGES[Math.floor(Math.random() * KABIR_MESSAGES.length)]!;
  } while (exclude && message === exclude);
  return message;
}

/**
 * A decorative wisdom quote display section with alternating backgrounds.
 *
 * @param {{ message: string; variant?: 'primary' | 'secondary' }} root0 - Component props.
 * @param {string} root0.message - The wisdom message to display.
 * @param {'primary' | 'secondary'} [root0.variant] - Background color variant.
 *
 * @returns {JSX.Element} A styled quote section.
 */
function WisdomQuote({
  message,
  variant = 'primary',
}: {
  message: string;
  variant?: 'primary' | 'secondary';
}): JSX.Element {
  const isPrimary = variant === 'primary';

  return (
    <section className={isPrimary ? 'bg-primary' : 'bg-secondary'}>
      <Container className="py-12 md:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <svg
            className={`mx-auto mb-4 h-18 w-18 ${isPrimary ? 'text-primary-foreground' : 'text-secondary-foreground'}`}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          <p
            className={`text-lg leading-relaxed font-semibold md:text-xl ${
              isPrimary ? 'text-primary-foreground' : 'text-secondary-foreground'
            }`}
          >
            &ldquo;{message}&rdquo;
          </p>
        </div>
      </Container>
    </section>
  );
}

/**
 * Home page component — renders the hero section, followed by featured, popular,
 * and latest couplets sections with random wisdom quotes in between.
 *
 * @returns {Promise<JSX.Element>} The homepage JSX.
 */
export default async function HomePage(): Promise<JSX.Element> {
  const [featured, popular, latest, carouselCouplets] = await Promise.all([
    getFeaturedCouplets(4).catch(() => []),
    getPopularCouplets(4).catch(() => []),
    getLatestCouplets(6).catch(() => []),
    getFeaturedCouplets(5).catch(() => []),
  ]);

  const quote1 = getRandomMessage();
  const quote2 = getRandomMessage(quote1);

  return (
    <>
      <JsonLd data={homeSchema} />
      <PageLayout className="pt-0">
        {/* Hero Section */}
        <section className="bg-primary relative overflow-hidden">
          <div className="from-primary/50 absolute inset-0 bg-linear-to-br to-transparent" />
          <Container className="relative py-12 md:py-20">
            <div className="flex flex-col items-center gap-20 lg:flex-row lg:items-center lg:gap-10">
              {/* Left: Hero text */}
              <div className="max-w-xl text-center lg:flex-1 lg:text-left">
                <h1 className="mb-4 text-4xl leading-tight font-bold text-white md:text-5xl lg:text-6xl">
                  Wisdom of Sant Kabir
                </h1>
                <p className="text-primary-foreground/80 mx-auto mb-8 max-w-2xl text-lg leading-relaxed lg:mx-0">
                  Explore the timeless dohas (couplets) of Sant Kabir Das &mdash; spiritual teachings that transcend
                  centuries, offering wisdom on life, devotion, and self-realization.
                </p>
                <div className="flex flex-wrap items-center gap-4 max-lg:justify-center">
                  <ButtonLink variant="white" size="lg" href="/couplets">
                    Browse All
                  </ButtonLink>
                  <ButtonLink variant="outline-white" size="lg" href="/categories">
                    Explore Categories
                  </ButtonLink>
                </div>
              </div>

              {/* Right: Carousel */}
              <div className="flex w-full justify-center lg:w-auto lg:flex-1 lg:justify-end">
                <HeroCarousel
                  slides={carouselCouplets.map((c) => ({ slug: c.slug, text_hi: c.text_hi, meaning_hi: c.meaning_hi }))}
                />
              </div>
            </div>
          </Container>
        </section>

        {/* Featured Couplets */}
        {featured.length > 0 && (
          <>
            <Container className="py-16">
              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-foreground">
                    चुनिंदा <span className="text-primary">दोहे</span> — Featured Couplets
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    कबीर के अनमोल वचन, आपके लिए चुने गए — Handpicked gems of Kabir\u2019s timeless wisdom, specially
                    curated for your spiritual journey.
                  </p>
                </div>
                <div>
                  <ButtonLink variant="outline-primary" size="sm" href="/couplets?is_featured=true">
                    View All <ArrowRight size={14} />
                  </ButtonLink>
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {featured.map((post, idx) => (
                  <QuoteCard
                    key={post.id}
                    slug={post.slug}
                    text_hi={post.text_hi}
                    meaning_hi={post.meaning_hi}
                    category={post.category}
                    index={idx + 1}
                  />
                ))}
              </div>
            </Container>

            <WisdomQuote message={quote1} variant="primary" />
          </>
        )}

        {/* Popular Couplets */}
        {popular.length > 0 && (
          <>
            <section className="bg-muted">
              <Container className="py-16">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-foreground">
                      लोकप्रिय <span className="text-primary">दोहे</span> — Popular Couplets
                    </h2>
                    <p className="text-muted-foreground mt-1">
                      पाठकों की पसंद, सबसे अधिक पढ़े गए दोहे — The most beloved couplets, cherished and shared by
                      thousands of readers on their spiritual path.
                    </p>
                  </div>
                  <div>
                    <ButtonLink variant="outline-primary" size="sm" href="/popular-couplets">
                      View All <ArrowRight size={14} />
                    </ButtonLink>
                  </div>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  {popular.map((post, idx) => (
                    <QuoteCard
                      key={post.id}
                      slug={post.slug}
                      text_hi={post.text_hi}
                      meaning_hi={post.meaning_hi}
                      category={post.category}
                      index={idx + 1}
                    />
                  ))}
                </div>
              </Container>
            </section>

            <WisdomQuote message={quote2} variant="secondary" />
          </>
        )}

        {/* Latest Couplets */}
        <Container className="py-16">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-foreground">
                नए <span className="text-primary">दोहे</span> — Latest Couplets
              </h2>
              <p className="text-muted-foreground mt-1">
                हाल ही में जुड़े कबीर के प्रेरणादायक दोहे — Freshly added couplets to deepen your connection with
                Kabir\u2019s eternal wisdom and teachings.
              </p>
            </div>
            <div>
              <ButtonLink variant="outline-primary" size="sm" href="/couplets">
                View All <ArrowRight size={14} />
              </ButtonLink>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {latest.map((post, idx) => (
              <QuoteCard
                key={post.id}
                slug={post.slug}
                text_hi={post.text_hi}
                meaning_hi={post.meaning_hi}
                category={post.category}
                index={idx + 1}
              />
            ))}
          </div>
        </Container>
      </PageLayout>
    </>
  );
}
