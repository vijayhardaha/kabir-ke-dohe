import type { JSX } from 'react';

import { JsonLd } from '@vijayhardaha/schema-builder/react';
import Image from 'next/image';
import { RiArrowRightLine, RiDoubleQuotesL } from 'react-icons/ri';

import QuoteCard from '@/components/features/QuoteCard';
import { Container } from '@/components/layout/Container';
import { PageLayout } from '@/components/layout/PageLayout';
import { ButtonLink } from '@/components/ui/Button';
import { KABIR_QUOTES } from '@/constants/kabir-quotes';
import { getFeaturedCouplets, getPopularCouplets, getLatestCouplets } from '@/lib/server/couplets';

import { PAGE_SCHEMA, metadata } from './_home/config';

export { metadata };

/**
 * Pick a random message from KABIR_QUOTES.
 *
 * @param {string} [exclude] - Optional message to avoid (prevents duplicates).
 *
 * @returns {string} A random wisdom message.
 */
function getRandomMessage(exclude?: string): string {
  let message: string;
  do {
    message = KABIR_QUOTES[Math.floor(Math.random() * KABIR_QUOTES.length)]!;
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
          <RiDoubleQuotesL
            size={72}
            className={`mx-auto mb-4 ${isPrimary ? 'text-primary-foreground' : 'text-secondary-foreground'}`}
            aria-hidden="true"
          />
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
  const [featured, popular, latest] = await Promise.all([
    getFeaturedCouplets(4).catch(() => []),
    getPopularCouplets(4).catch(() => []),
    getLatestCouplets(6).catch(() => []),
  ]);

  const quote1 = getRandomMessage();
  const quote2 = getRandomMessage(quote1);

  return (
    <>
      <JsonLd data={PAGE_SCHEMA} />

      <PageLayout className="pt-0">
        {/* ═══════════════ HERO SECTION ═══════════════ */}
        <section className="bg-primary relative overflow-hidden">
          <div className="from-primary/50 absolute inset-0 bg-linear-to-br to-transparent" />
          <Container className="relative pt-20 lg:pt-6">
            <div className="flex flex-col items-center gap-0 lg:flex-row lg:items-stretch lg:gap-10">
              {/* ── Hero text ── */}
              <div className="flex flex-col justify-center pb-0 text-center lg:flex-1 lg:pb-20 lg:text-left">
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

              {/* ── Hero illustration (touches container bottom) ── */}
              <div className="flex w-full justify-center lg:w-auto lg:flex-1">
                <Image
                  src="/hero-illustration.svg"
                  width={500}
                  height={500}
                  priority
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="relative -bottom-0.5 h-auto w-full"
                  alt="Decorative cherry tree illustration representing the growth of wisdom through Kabir's teachings"
                />
              </div>
            </div>
          </Container>
        </section>

        {/* ═══════════════ FEATURED COUPLETS ═══════════════ */}
        {featured.length > 0 && (
          <>
            <Container className="py-16">
              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-foreground">
                    चुनिंदा <span className="text-primary">दोहे</span> — Featured Couplets
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    कबीर के अनमोल वचन, आपके लिए चुने गए — Handpicked gems of Kabir&apos;s timeless wisdom, specially
                    curated for your spiritual journey.
                  </p>
                </div>
                <div>
                  <ButtonLink variant="outline-primary" size="sm" href="/couplets?is_featured=true">
                    View All <RiArrowRightLine size={14} />
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

        {/* ═══════════════ POPULAR COUPLETS ═══════════════ */}
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
                      View All <RiArrowRightLine size={14} />
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

        {/* ═══════════════ LATEST COUPLETS ═══════════════ */}
        <Container className="py-16">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-foreground">
                नए <span className="text-primary">दोहे</span> — Latest Couplets
              </h2>
              <p className="text-muted-foreground mt-1">
                हाल ही में जुड़े कबीर के प्रेरणादायक दोहे — Freshly added couplets to deepen your connection with
                Kabir&apos;s eternal wisdom and teachings.
              </p>
            </div>
            <div>
              <ButtonLink variant="outline-primary" size="sm" href="/couplets">
                View All <RiArrowRightLine size={14} />
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
