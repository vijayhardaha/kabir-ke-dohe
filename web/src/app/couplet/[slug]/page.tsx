import type { JSX } from 'react';

import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Container } from '@/components/layout/Container';
import { PageLayout } from '@/components/layout/PageLayout';
import { ButtonLink } from '@/components/ui/Button';
import { getCoupletBySlug } from '@/lib/server/couplets';
import { formatDoha } from '@/lib/utils/doha';

interface SingleCoupletPageProps {
  params: Promise<{ slug: string }>;
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

  const sections: Array<{ title: string; contentHi: string | null; contentEn: string | null }> = [
    { title: 'Meaning', contentHi: post.meaning_hi, contentEn: post.meaning_en },
    { title: 'Interpretation', contentHi: post.interpretation_hi, contentEn: post.interpretation_en },
    {
      title: 'Philosophical Analysis',
      contentHi: post.philosophical_analysis_hi,
      contentEn: post.philosophical_analysis_en,
    },
    { title: 'Core Message', contentHi: post.core_message_hi, contentEn: post.core_message_en },
    { title: 'Practical Example', contentHi: post.practical_example_hi, contentEn: post.practical_example_en },
    { title: 'Practice Guidance', contentHi: post.practice_guidance_hi, contentEn: post.practice_guidance_en },
    { title: 'Reflection Questions', contentHi: post.reflection_questions_hi, contentEn: post.reflection_questions_en },
  ];

  return (
    <PageLayout>
      <Container>
        <div className="bg-white p-6 shadow-xl md:p-12">
          {/* Header */}
          <header className="mb-8">
            {post.category && (
              <span className="text-primary mb-2 inline-block text-xs font-semibold tracking-wide uppercase">
                <Link href={`/category/${post.category.slug}`} className="no-underline">
                  {post.category.name}
                </Link>
              </span>
            )}

            <h1 className="text-foreground mb-2 text-3xl leading-tight md:text-4xl">{formatDoha(post.text_hi)}</h1>
            <p className="text-muted-foreground text-lg italic">{post.text_en}</p>

            <div className="text-muted-foreground mt-4 flex flex-wrap items-center gap-4 text-sm">
              <span>Couplet #{post.post_number}</span>
              {post.tags.length > 0 && (
                <span className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag.slug} className="bg-muted text-muted-foreground px-2 py-0.5 text-xs font-medium">
                      {tag.name}
                    </span>
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
                  <section key={section.title} className="bg-muted p-6 md:p-8">
                    <h2 className="text-foreground mb-4 text-lg font-bold">{section.title}</h2>
                    {section.contentHi && (
                      <p className="text-foreground mb-3 text-base font-medium">{section.contentHi}</p>
                    )}
                    {section.contentEn && (
                      <p className="text-muted-foreground text-sm leading-relaxed">{section.contentEn}</p>
                    )}
                  </section>
                )
            )}
          </div>

          {/* Navigation */}
          <div className="mt-12 flex flex-col gap-4 pt-8 sm:flex-row sm:justify-between">
            <ButtonLink variant="outline-primary" size="md" href="/couplets">
              &larr; Browse All Couplets
            </ButtonLink>
            <ButtonLink variant="primary" size="md" href="/couplets">
              Explore More Dohas
            </ButtonLink>
          </div>
        </div>
      </Container>
    </PageLayout>
  );
}
