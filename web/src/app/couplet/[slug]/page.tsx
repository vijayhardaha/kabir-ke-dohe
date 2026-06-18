import type { JSX } from 'react';

import { webPageSchema, breadcrumbSchema } from '@vijayhardaha/schema-builder';
import { JsonLd } from '@vijayhardaha/schema-builder/react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { CoupletImage } from '@/components/features/archive/CoupletImage';
import { ViewTracker } from '@/components/features/ViewTracker';
import { Container } from '@/components/layout/Container';
import { PageLayout } from '@/components/layout/PageLayout';
import { getCoupletBySlug, getAdjacentCouplets, getRelatedCouplets } from '@/lib/server/couplets';
import { formatDoha } from '@/lib/utils/doha';
import { buildMetadata } from '@/lib/utils/meta';
import { getOgImageUrl } from '@/lib/utils/og-image';
import { buildKeywords, globalSchema, blogPostingSchema } from '@/lib/utils/schema';
import { getPermaLink, siteUrl } from '@/lib/utils/seo';

import { CoupletNavigation } from './_components/CoupletNavigation';
import { RelatedCouplets } from './_components/RelatedCouplets';
import { ShareSection } from './_components/ShareSection';
import { type SectionData, renderSectionContent } from './_utils/section';

/**
 * Generate metadata for the couplet detail page.
 *
 * @param {{ params: Promise<{ slug: string }> }} props - Route params
 *
 * @returns {Promise<Metadata>} The metadata object.
 */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getCoupletBySlug(slug);

  if (!post) {
    return buildMetadata({
      title: 'Couplet Not Found',
      description: 'The requested couplet could not be found.',
      path: `couplet/${slug}`,
    });
  }

  return buildMetadata({
    title: `${post.text_hi.slice(0, 60)}`,
    description: `${post.text_hi} — ${post.text_en}`.slice(0, 300),
    path: `couplet/${slug}`,
  });
}

// ── Types ─────────────────────────────────────────────────────────────────

/**
 * Props for the single couplet detail page.
 *
 * @type {SingleCoupletPageProps}
 * @property {Promise<{ slug: string }>} params - Route parameters containing the couplet slug.
 */
interface SingleCoupletPageProps {
  params: Promise<{ slug: string }>;
}

// ── Page component ─────────────────────────────────────────────────────────

/**
 * Single couplet detail page showing full text, translations, and analysis sections.
 *
 * @param {SingleCoupletPageProps} props - Component props
 * @param {Promise<{ slug: string }>} props.params - Route parameters containing the couplet slug.
 *
 * @returns {Promise<JSX.Element>} The couplet detail page.
 */
export default async function SingleCoupletPage({ params }: SingleCoupletPageProps): Promise<JSX.Element> {
  const { slug } = await params;
  const post = await getCoupletBySlug(slug);

  if (!post) {
    notFound();
  }

  const adjacent = await getAdjacentCouplets(post.post_order);
  const related = await getRelatedCouplets(
    post.category?.slug ?? null,
    post.tags.map((t) => t.slug),
    post.slug,
    6
  );
  const postUrl = getPermaLink(`/couplet/${post.slug}`);

  const brandKeywords = buildKeywords([post.category?.name ?? '', ...post.tags.map((t) => t.name)]);
  const rootUrl = siteUrl();
  const coupletPath = `couplet/${post.slug}`;
  const seoTitle = `${post.text_hi.slice(0, 60)} — Kabir Ke Dohe`;
  const seoDescription = `${post.text_hi} — ${post.text_en}`.slice(0, 300);

  const coupletSchema = [
    ...globalSchema(),
    webPageSchema(
      { rootUrl, path: coupletPath },
      { name: seoTitle, description: seoDescription, keywords: brandKeywords }
    ),
    blogPostingSchema(
      { rootUrl, path: coupletPath },
      {
        headline: post.text_hi.slice(0, 200),
        description: seoDescription,
        image: getOgImageUrl(`couplet/${post.slug}`) ?? '',
        datePublished: post.created_at,
        dateModified: post.updated_at,
        author: { '@type': 'Person', name: 'Sant Kabir Das' },
      }
    ),
    breadcrumbSchema({
      rootUrl,
      items: [
        { name: 'Home', path: '' },
        { name: 'Couplets', path: 'couplets' },
        { name: post.text_hi.slice(0, 40), path: coupletPath },
      ],
    }),
  ];

  const sections: SectionData[] = [
    { title: 'अर्थ (Meaning)', contentHi: post.meaning_hi, contentEn: post.meaning_en },
    { title: 'व्याख्या (Interpretation)', contentHi: post.interpretation_hi, contentEn: post.interpretation_en },
    {
      title: 'दार्शनिक विश्लेषण (Philosophical Analysis)',
      contentHi: post.philosophical_analysis_hi,
      contentEn: post.philosophical_analysis_en,
    },
    { title: 'मूल संदेश (Core Message)', contentHi: post.core_message_hi, contentEn: post.core_message_en },
    {
      title: 'व्यावहारिक उदाहरण (Practical Example)',
      contentHi: post.practical_example_hi,
      contentEn: post.practical_example_en,
    },
    {
      title: 'अभ्यास मार्गदर्शन (Practice Guidance)',
      contentHi: post.practice_guidance_hi,
      contentEn: post.practice_guidance_en,
    },
    {
      title: 'चिंतन प्रश्न (Reflection Questions)',
      contentHi: post.reflection_questions_hi,
      contentEn: post.reflection_questions_en,
    },
  ];

  return (
    <>
      <JsonLd data={coupletSchema} />
      <ViewTracker slug={post.slug} />

      <div className="bg-primary h-24"></div>

      <PageLayout>
        <Container>
          <article className="-mt-30 bg-white p-6 shadow-xl md:p-12 md:py-16">
            <div className="mx-auto max-w-4xl">
              {/* ═══════════════ HEADER ═══════════════ */}
              <header className="mb-8">
                {post.category && (
                  <Link
                    href={`/category/${post.category.slug}`}
                    className="text-primary-foreground bg-primary hover:bg-muted hover:text-muted-foreground mb-3 inline-flex items-center justify-center px-3 py-1 text-xs font-semibold tracking-wide uppercase no-underline"
                  >
                    {post.category.name}
                  </Link>
                )}

                <div className="mb-6">
                  <CoupletImage slug={post.slug} text={post.text_hi} />
                </div>

                <h1 className="text-foreground mb-4 text-2xl leading-normal md:text-3xl lg:text-4xl xl:text-5xl">
                  {formatDoha(post.text_hi)}
                </h1>

                <div>
                  <p className="bg-muted inline-flex px-2 py-1 text-sm font-medium italic md:text-base">
                    {post.text_en}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2 gap-x-2 gap-y-1.5 text-sm font-medium">
                  <span>
                    By{' '}
                    <a
                      href="https://en.wikipedia.org/wiki/Kabir"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground hover:text-primary underline"
                    >
                      Sant Kabir Das
                    </a>
                  </span>
                  <span aria-hidden="true" className="text-xs">
                    |
                  </span>
                  {post.tags.length > 0 && (
                    <>
                      {post.tags.map((tag) => (
                        <Link
                          href={`/tag/${tag.slug}`}
                          key={tag.slug}
                          className="bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground px-2 py-1 no-underline"
                        >
                          {tag.name}
                        </Link>
                      ))}
                    </>
                  )}
                </div>
              </header>

              {/* ═══════════════ CONTENT SECTIONS ═══════════════ */}
              <div className="prose-doha space-y-8">
                {sections.map(
                  (section) =>
                    (section.contentHi || section.contentEn) && (
                      <section key={section.title}>
                        <h2 className="text-primary mb-4 text-xl font-bold md:text-2xl">{section.title}:</h2>
                        {renderSectionContent(section)}
                      </section>
                    )
                )}
              </div>

              {/* ═══════════════ SHARE SECTION ═══════════════ */}
              <ShareSection textHi={post.text_hi} postUrl={postUrl} />

              {/* ═══════════════ PREV / NEXT NAVIGATION ═══════════════ */}
              <CoupletNavigation adjacent={adjacent} />

              {/* ═══════════════ RELATED COUPLETS ═══════════════ */}
              <RelatedCouplets couplets={related} />
            </div>
          </article>
        </Container>
      </PageLayout>
    </>
  );
}
