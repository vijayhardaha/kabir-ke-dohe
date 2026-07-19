import type { JSX } from 'react';

import { JsonLd } from '@vijayhardaha/schema-builder/react';
import Link from 'next/link';

import { Container } from '@/components/layout/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageLayout } from '@/components/layout/PageLayout';
import { getTags } from '@/lib/server/couplets';
import { cn } from '@/lib/utils/cn';

import { PAGE_SCHEMA } from './_config';

export { metadata } from './_config';

// ── Helpers ───────────────────────────────────────────────────────────────

/**
 * Groups an array of tag-like items by the first letter of their name.
 *
 * @template T - Item type with a `name` string property.
 *
 * @param {T[]} items - Items to group.
 *
 * @returns {Map<string, T[]>} Map keyed by uppercase letter to items starting with that letter.
 */
function groupByFirstLetter<T extends { name: string }>(items: T[]): Map<string, T[]> {
  const groups = new Map<string, T[]>();

  for (const item of items) {
    const letter = item.name.charAt(0).toUpperCase();
    if (!groups.has(letter)) {
      groups.set(letter, []);
    }
    groups.get(letter)!.push(item);
  }

  return groups;
}

/**
 * Tags overview page that displays all tags grouped alphabetically
 * in a 3‑column directory layout with letter headings.
 *
 * @returns {Promise<JSX.Element>} The tags listing page.
 */
export default async function TagsPage(): Promise<JSX.Element> {
  const tags = await getTags();

  // Sort alphabetically by name
  tags.sort((a, b) => a.name.localeCompare(b.name));

  // Group by first letter
  const groups = groupByFirstLetter(tags);
  const letters = Array.from(groups.keys()).sort();

  return (
    <>
      <JsonLd data={PAGE_SCHEMA} />
      <PageLayout>
        <Container>
          <PageHeader
            title="विषय (Tags)"
            description="कबीर के दोहों को विषय आधार पर खोजें — हर टैग एक साझा आध्यात्मिक सूत्र के आसपास दोहों को संग्रहित करता है (Browse Kabir&rsquo;s dohas by thematic tags &mdash; each tag gathers couplets around a shared spiritual thread)"
          />

          {/* ═══════════════ A–Z JUMP NAV ═══════════════ */}
          <nav aria-label="Alphabetical filter" className="mb-10 flex flex-wrap gap-2">
            {letters.map((letter) => (
              <a
                key={letter}
                href={`#tag-group-${letter}`}
                className={cn(
                  'flex size-9 items-center justify-center text-sm font-bold no-underline transition-colors duration-200',
                  'bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground'
                )}
              >
                {letter}
              </a>
            ))}
          </nav>

          {/* ═══════════════ ALPHABETICAL GROUPS ═══════════════ */}
          <div className="grid grid-cols-1 gap-6">
            {letters.map((letter) => {
              const tags = groups.get(letter)!;
              return (
                <section key={letter} id={`tag-group-${letter}`} className="bg-card relative mt-5 p-5 pt-12">
                  {/* ── Letter heading badge ── */}
                  <h2 className="bg-primary text-primary-foreground absolute -top-7 z-10 mb-4 flex h-14 w-14 items-center justify-center text-2xl font-bold">
                    {letter}
                  </h2>

                  {/* ── Tag chips ── */}
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Link
                        key={tag.slug}
                        href={`/tag/${tag.slug}`}
                        className={cn(
                          'group inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium no-underline transition-colors duration-200',
                          tag.post_count > 0
                            ? 'bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground'
                            : 'bg-muted/50 text-muted-foreground/50 pointer-events-none'
                        )}
                      >
                        {tag.name}
                        <span className="bg-foreground/10 text-foreground/60 px-1.5 py-0.5 text-xs font-semibold group-hover:bg-white group-hover:text-black">
                          {tag.post_count}
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </Container>
      </PageLayout>
    </>
  );
}
