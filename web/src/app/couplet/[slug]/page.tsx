import type { JSX } from 'react';
import { Fragment } from 'react';

import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Container } from '@/components/layout/Container';
import { PageLayout } from '@/components/layout/PageLayout';
import { getCoupletBySlug, getAdjacentCouplets, getRelatedCouplets } from '@/lib/server/couplets';
import { formatDoha } from '@/lib/utils/doha';
import { getPermaLink } from '@/lib/utils/seo';

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
      <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
        {children}
      </svg>
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

                <h1 className="text-foreground mb-2 text-3xl leading-tight md:text-4xl">{formatDoha(post.text_hi)}</h1>

                <p className="text-lg">{post.text_en}</p>

                <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
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
                    <span className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Link
                          href={`/tag/${tag.slug}`}
                          key={tag.slug}
                          className="bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground px-2 py-1 text-xs font-medium no-underline"
                        >
                          {tag.name}
                        </Link>
                      ))}
                    </span>
                  )}
                </div>
              </header>

              {/* Content sections */}
              <div className="prose-doha space-y-8">
                {sections.map(
                  (section) =>
                    (section.contentHi || section.contentEn) && (
                      <section key={section.title}>
                        <h2 className="text-primary mb-4 text-2xl font-bold">{section.title}:</h2>
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
                  <ShareButton
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.text_hi)}&url=${encodeURIComponent(postUrl)}`}
                    label="Share on X"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </ShareButton>
                  <ShareButton
                    href={`https://wa.me/?text=${encodeURIComponent(`${post.text_hi} ${postUrl}`)}`}
                    label="Share on WhatsApp"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </ShareButton>
                  <ShareButton
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`}
                    label="Share on Facebook"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </ShareButton>
                  <ShareButton
                    href={`https://t.me/share/url?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(post.text_hi)}`}
                    label="Share on Telegram"
                  >
                    <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </ShareButton>
                  <ShareButton
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`}
                    label="Share on LinkedIn"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </ShareButton>
                  <ShareButton
                    href={`mailto:?subject=${encodeURIComponent(post.text_hi)}&body=${encodeURIComponent(`${post.text_hi} - ${postUrl}`)}`}
                    label="Share via Email"
                  >
                    <>
                      <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                      <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                    </>
                  </ShareButton>
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
                          <p className="group-hover:text-primary text-sm leading-snug font-bold transition-colors">
                            {formatDoha(couplet.text_hi)}
                          </p>
                          {couplet.tags.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {couplet.tags.map((tag) => (
                                <span
                                  key={tag.slug}
                                  className="bg-secondary text-secondary-foreground inline-block px-1.5 py-0.5 text-[10px] leading-tight font-medium tracking-wide uppercase"
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
