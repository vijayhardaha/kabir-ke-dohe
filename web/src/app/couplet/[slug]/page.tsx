import type { JSX } from 'react';
import { Fragment } from 'react';

import { webPageSchema, breadcrumbSchema } from '@vijayhardaha/schema-builder';
import { JsonLd } from '@vijayhardaha/schema-builder/react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  RiWhatsappFill,
  RiTwitterXFill,
  RiBlueskyFill,
  RiFacebookFill,
  RiTelegramFill,
  RiLinkedinFill,
  RiMailLine,
} from 'react-icons/ri';

import { CoupletImage } from '@/components/features/archive/CoupletImage';
import { ViewTracker } from '@/components/features/ViewTracker';
import { Container } from '@/components/layout/Container';
import { PageLayout } from '@/components/layout/PageLayout';
import { Tooltip } from '@/components/ui/Tooltip';
import { getCoupletBySlug, getAdjacentCouplets, getRelatedCouplets } from '@/lib/server/couplets';
import { formatDoha } from '@/lib/utils/doha';
import { buildMetadata } from '@/lib/utils/meta';
import { globalSchema, BASE_KEYWORDS } from '@/lib/utils/schema';
import { getPermaLink, siteUrl } from '@/lib/utils/seo';

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

/**
 * A single content section within a couplet detail page.
 *
 * @type {SectionData}
 * @property {string} title - Section heading text (e.g. "Meaning", "Core Message").
 * @property {string | null} contentHi - Hindi content of the section, or null if unavailable.
 * @property {string | null} contentEn - English content of the section, or null if unavailable.
 */
interface SectionData {
  title: string;
  contentHi: string | null;
  contentEn: string | null;
}

/**
 * A social media share button rendered as an anchor link.
 *
 * @param {{ href: string; label: string; children: JSX.Element }} props - Button props.
 * @param {string} props.href - The share URL to open.
 * @param {string} props.label - Accessible label for the button.
 * @param {JSX.Element} props.children - SVG path elements for the icon.
 *
 * @returns {JSX.Element} A styled share button link.
 */
function ShareButton({ href, label, children }: { href: string; label: string; children: JSX.Element }): JSX.Element {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground inline-flex size-10 items-center justify-center transition-colors"
      aria-label={label}
    >
      <span className="flex items-center justify-center" aria-hidden="true">
        {children}
      </span>
    </a>
  );
}

/**
 * Props for the single couplet detail page.
 *
 * @type {SingleCoupletPageProps}
 * @property {Promise<{ slug: string }>} params - Route parameters containing the couplet slug.
 */
interface SingleCoupletPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Set of section titles whose content should render as bullet points instead of prose.
 */
const BULLET_SECTIONS: ReadonlySet<string> = new Set([
  'मूल संदेश (Core Message)',
  'अभ्यास मार्गदर्शन (Practice Guidance)',
  'चिंतन प्रश्न (Reflection Questions)',
]);

/**
 * Renders section content as bullet points, splitting by line breaks.
 *
 * @param {string} content - Text content to split on newlines and render as list items.
 * @param {string} className - Tailwind classes to apply to the unordered list element.
 *
 * @returns {JSX.Element} Unordered list with non-empty lines rendered as list items.
 */
function renderBulletItems(content: string, className: string): JSX.Element {
  const items = content.split('\n').filter((line) => line.trim().length > 0);

  return (
    <ul className={`${className} list-disc space-y-2 pl-6`}>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

/**
 * Renders prose content, converting newlines to `<br>` tags.
 *
 * @param {string} content - Text content whose newlines should become line breaks.
 * @param {string} className - Tailwind classes to apply to the paragraph element.
 *
 * @returns {JSX.Element} Paragraph element with newlines replaced by `<br />` tags.
 */
function renderProseContent(content: string, className: string): JSX.Element {
  return (
    <p className={className}>
      {content.split('\n').map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {line}
        </Fragment>
      ))}
    </p>
  );
}

/**
 * Routes section content to the appropriate renderer based on section title.
 *
 * @param {SectionData} section - Section data to render.
 *
 * @returns {JSX.Element} Rendered section content in bullet or prose format.
 */
function renderSectionContent(section: SectionData): JSX.Element {
  const isBullet = BULLET_SECTIONS.has(section.title);
  const proseBase = 'text-base leading-relaxed font-medium';
  const render = isBullet ? renderBulletItems : renderProseContent;

  return (
    <div className="space-y-4">
      {section.contentHi && render(section.contentHi, proseBase)}
      {section.contentHi && section.contentEn && <hr className="border-border" />}
      {section.contentEn && render(section.contentEn, proseBase)}
    </div>
  );
}

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

  const brandKeywords = [...BASE_KEYWORDS, post.category?.name ?? '', ...post.tags.map((t) => t.name)].filter(Boolean);
  const rootUrl = siteUrl();
  const coupletPath = `couplet/${post.slug}`;

  const coupletSchema = [
    ...globalSchema(),
    webPageSchema(
      { rootUrl, path: coupletPath },
      {
        name: `${post.text_hi.slice(0, 60)} — Kabir Ke Dohe`,
        description: `${post.text_hi} — ${post.text_en}`.slice(0, 300),
        keywords: [...new Set(brandKeywords)].join(', '),
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
              {/* Header */}
              <header className="mb-8">
                {post.category && (
                  <Link
                    href={`/category/${post.category.slug}`}
                    className="text-primary-foreground bg-primary hover:bg-muted hover:text-muted-foreground mb-3 inline-flex items-center justify-center px-3 py-1 text-xs font-semibold tracking-wide uppercase no-underline"
                  >
                    {post.category.name}
                  </Link>
                )}

                <CoupletImage slug={post.slug} text={post.text_hi} />

                <h1 className="text-foreground mb-2 text-2xl leading-tight md:text-3xl lg:text-4xl xl:text-5xl">
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

              {/* Content sections */}
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

              {/* Share section */}
              <section className="border-border mt-12 border-t border-b py-8">
                <h2 className="text-foreground mb-4 text-lg font-semibold">
                  इस प्रेरणादायक दोहे को अपने दोस्तों के साथ साझा करें (Share this inspiring couplet with your friends):
                </h2>
                <div className="flex flex-wrap gap-3">
                  <Tooltip content="WhatsApp">
                    <ShareButton
                      href={`https://wa.me/?text=${encodeURIComponent(`${post.text_hi} ${postUrl}`)}`}
                      label="Share on WhatsApp"
                    >
                      <RiWhatsappFill size={20} />
                    </ShareButton>
                  </Tooltip>
                  <Tooltip content="X (Twitter)">
                    <ShareButton
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.text_hi)}&url=${encodeURIComponent(postUrl)}`}
                      label="Share on X"
                    >
                      <RiTwitterXFill size={20} />
                    </ShareButton>
                  </Tooltip>
                  <Tooltip content="Bluesky">
                    <ShareButton
                      href={`https://bsky.app/intent/compose?text=${encodeURIComponent(`${post.text_hi} ${postUrl}`)}`}
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
                      href={`https://t.me/share/url?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(post.text_hi)}`}
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
                      href={`mailto:?subject=${encodeURIComponent(post.text_hi)}&body=${encodeURIComponent(`${post.text_hi} - ${postUrl}`)}`}
                      label="Share via Email"
                    >
                      <RiMailLine size={20} />
                    </ShareButton>
                  </Tooltip>
                </div>
              </section>

              {/* Prev / Next navigation */}
              <nav className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-between">
                {adjacent.prev ? (
                  <Link
                    href={`/couplet/${adjacent.prev.slug}`}
                    className="bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground flex flex-1 flex-col px-5 py-4 no-underline transition-colors"
                  >
                    <span className="text-xs font-bold tracking-wide uppercase">&larr; Previous</span>
                    <span className="mt-1 text-sm leading-snug font-medium">{formatDoha(adjacent.prev.text_hi)}</span>
                  </Link>
                ) : (
                  <div className="flex-1" />
                )}
                {adjacent.next ? (
                  <Link
                    href={`/couplet/${adjacent.next.slug}`}
                    className="bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground flex flex-1 flex-col px-5 py-4 text-right no-underline transition-colors"
                  >
                    <span className="text-xs font-bold tracking-wide uppercase">Next &rarr;</span>
                    <span className="mt-1 text-sm leading-snug font-medium">{formatDoha(adjacent.next.text_hi)}</span>
                  </Link>
                ) : (
                  <div className="flex-1" />
                )}
              </nav>

              {related.length > 0 && (
                <>
                  <hr className="border-border my-12" />

                  <section>
                    <h2 className="text-foreground mb-6 text-2xl font-bold">संबंधित दोहे (Related Couplets)</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {related.map((couplet) => (
                        <Link
                          key={couplet.slug}
                          href={`/couplet/${couplet.slug}`}
                          className="bg-muted text-foreground hover:bg-muted/80 group px-5 py-4 no-underline transition-colors"
                        >
                          <h3 className="group-hover:text-primary mb-2 text-base leading-snug font-bold transition-colors">
                            {formatDoha(couplet.text_hi)}
                          </h3>
                          {couplet.tags.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {couplet.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag.slug}
                                  className="bg-secondary/65 text-secondary-foreground inline-block px-1.5 py-0.5 text-[10px] leading-tight font-medium tracking-wide uppercase"
                                >
                                  {tag.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </Link>
                      ))}
                    </div>
                  </section>
                </>
              )}
            </div>
          </article>
        </Container>
      </PageLayout>
    </>
  );
}
