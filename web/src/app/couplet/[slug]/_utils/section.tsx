import type { JSX } from 'react';
import { Fragment } from 'react';

/**
 * A single content section within a couplet detail page.
 *
 * @type {SectionData}
 * @property {string} title - Section heading text (e.g. "Meaning", "Core Message").
 * @property {string | null} contentHi - Hindi content of the section, or null if unavailable.
 * @property {string | null} contentEn - English content of the section, or null if unavailable.
 */
export interface SectionData {
  title: string;
  contentHi: string | null;
  contentEn: string | null;
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
export function renderSectionContent(section: SectionData): JSX.Element {
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
