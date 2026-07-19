import type { JSX } from 'react';

import { JsonLd } from '@vijayhardaha/schema-builder/react';
import Image from 'next/image';

import { CoupletsSection } from '@/components/common/CoupletsSection';
import { Container } from '@/components/layout/Container';
import { PageLayout } from '@/components/layout/PageLayout';
import { ButtonLink } from '@/components/ui/Button';
import { KABIR_QUOTES } from '@/constants/kabir-quotes';
import { getFeaturedCouplets, getPopularCouplets, getLatestCouplets } from '@/lib/server/couplets';

import { PAGE_SCHEMA } from './_home/config';

export { metadata } from './_home/config';

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
          <CoupletsSection
            title={
              <>
                चुनिंदा <span className="text-primary">दोहे</span> — Featured Couplets
              </>
            }
            description="कबीर के अनमोल वचन, आपके लिए चुने गए — Handpicked gems of Kabir's timeless wisdom, specially curated for your spiritual journey."
            href="/couplets?is_featured=true"
            couplets={featured}
            wisdomQuote={{ message: quote1, variant: 'primary' }}
          />
        )}

        {/* ═══════════════ POPULAR COUPLETS ═══════════════ */}
        {popular.length > 0 && (
          <CoupletsSection
            sectionClassName="bg-muted"
            title={
              <>
                लोकप्रिय <span className="text-primary">दोहे</span> — Popular Couplets
              </>
            }
            description="पाठकों की पसंद, सबसे अधिक पढ़े गए दोहे — The most beloved couplets, cherished and shared by thousands of readers on their spiritual path."
            href="/popular-couplets"
            couplets={popular}
            wisdomQuote={{ message: quote2, variant: 'secondary' }}
          />
        )}

        {/* ═══════════════ LATEST COUPLETS ═══════════════ */}
        <CoupletsSection
          title={
            <>
              नए <span className="text-primary">दोहे</span> — Latest Couplets
            </>
          }
          description="हाल ही में जुड़े कबीर के प्रेरणादायक दोहे — Freshly added couplets to deepen your connection with Kabir's eternal wisdom and teachings."
          href="/couplets"
          couplets={latest}
        />
      </PageLayout>
    </>
  );
}
