import type { ReactNode } from 'react';

import type { JSX } from 'react/jsx-runtime';

/**
 * Props for the SeoSection component.
 */
interface SeoSectionProps {
  /** Section ID for anchor linking. */
  id: string;
  /** Section heading text. */
  heading: string;
  /** Children (typically paragraphs and/or lists). */
  children: ReactNode;
}

/**
 * A reusable documentation section wrapper with an ID and heading.
 *
 * @param {SeoSectionProps} props - Component props.
 *
 * @returns {JSX.Element} A styled section element.
 */
function SeoSection({ id, heading, children }: SeoSectionProps): JSX.Element {
  return (
    <section id={id}>
      <h2>{heading}</h2>
      {children}
    </section>
  );
}

/**
 * A bullet list of items.
 *
 * @param {{ items: ReactNode[] }} props - Component props.
 *
 * @returns {JSX.Element} An unordered list.
 */
function BulletList({ items }: { items: ReactNode[] }): JSX.Element {
  return (
    <ul>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

/**
 * Component that displays SEO-friendly content for API endpoints.
 *
 * @returns {JSX.Element} - The rendered SEO content section.
 */
export default function SEOContent(): JSX.Element {
  const sections: Array<{ id: string; heading: string; content: ReactNode }> = [
    {
      id: 'who-was-sant-kabir',
      heading: 'Who Was Sant Kabir?',
      content: (
        <>
          <p>
            <strong>
              <a href="https://en.wikipedia.org/wiki/Kabir" target="_blank" rel="noopener noreferrer">
                Sant Kabir Das
              </a>
            </strong>
            (1440–1518) was a well-known Indian poet and spiritual teacher linked to the Bhakti and Sufi traditions. He
            is respected by Hindus, Muslims, and Sikhs. Some of his verses are also included in the{' '}
            <a
              href="https://www.searchgurbani.com/guru-granth-sahib/introduction"
              target="_blank"
              rel="noopener noreferrer"
            >
              Guru Granth Sahib
            </a>
            , the holy book of Sikhism.
          </p>
          <p>
            Kabir believed in <strong>Nirguna Bhakti</strong>, which means devotion to a formless God. He spoke against
            caste system and blind religious practices, and encouraged people to follow truth and inner understanding.
          </p>
          <p>
            His main work, the <strong>Bijak</strong>, is an important text in the{' '}
            <a href="https://en.wikipedia.org/wiki/Kabir_panth" target="_blank" rel="noopener noreferrer">
              Kabir Panth
            </a>{' '}
            tradition. Through Kabir Dohe API, we aim to make his timeless teachings easy to access in the modern
            digital world.
          </p>
        </>
      ),
    },
    {
      id: 'unlock-the-wisdom-of-kabir',
      heading: 'Explore the Wisdom of Kabir with Our Dohe API',
      content: (
        <>
          <p>
            <strong>Kabir Dohe API</strong> is a simple and easy-to-use{' '}
            <a href="https://developer.mozilla.org/en-US/docs/Glossary/REST" target="_blank" rel="noopener noreferrer">
              REST API
            </a>{' '}
            that gives access to over <a href="/api/couplets">2500+ dohe (couplets)</a> of Sant Kabir, a well-known
            Indian poet and saint. Each doha includes the original Hindi text, meaning, and English translation.
          </p>
          <p>
            This API is useful for building educational apps, websites, or tools that focus on Indian philosophy and
            spiritual content. It helps you easily add meaningful and culturally rich content to your projects.
          </p>
        </>
      ),
    },
    {
      id: 'why-use-kabir-dohe-api',
      heading: 'Why use Kabir Dohe API?',
      content: (
        <ul>
          <li>
            Provides Kabir dohe in{' '}
            <a href="https://www.json.org/json-en.html" target="_blank" rel="noopener noreferrer">
              JSON format
            </a>
            , making it easy to use across different platforms and applications.
          </li>
          <li>
            Built on fast and reliable{' '}
            <a href="https://aws.amazon.com/serverless/" target="_blank" rel="noopener noreferrer">
              serverless architecture
            </a>{' '}
            and hosted on{' '}
            <a href="https://vercel.com/docs" target="_blank" rel="noopener noreferrer">
              Vercel
            </a>
            , ensuring good performance and uptime.
          </li>
          <li>
            Fully{' '}
            <a href="https://opensource.org/osd" target="_blank" rel="noopener noreferrer">
              open-source
            </a>
            , allowing anyone to view, use, and contribute to the project.
          </li>
          <li>
            Easy to integrate with technologies like{' '}
            <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noopener noreferrer">
              JavaScript
            </a>
            ,{' '}
            <a href="https://www.python.org/" target="_blank" rel="noopener noreferrer">
              Python
            </a>
            , and frameworks like{' '}
            <a href="https://reactnative.dev/" target="_blank" rel="noopener noreferrer">
              React Native
            </a>
            .
          </li>
          <li>Supports pagination and filtering, making it easy to work with large collections of dohe.</li>
        </ul>
      ),
    },
    {
      id: 'when-to-use-kabir-dohe-api',
      heading: 'When to Use Kabir Dohe API?',
      content: (
        <BulletList
          items={[
            <>
              <strong>Educational Platforms:</strong> Use it in learning apps, school projects, or websites to teach
              Indian philosophy, values, and literature in a simple way.
            </>,
            <>
              <strong>Daily Quote Apps:</strong> Show dohe as daily quotes to inspire users and encourage
              self-reflection.
            </>,
            <>
              <strong>Research and Study:</strong> Helpful for students and researchers exploring Kabir&apos;s
              teachings, Bhakti movement, or cultural studies.
            </>,
            <>
              <strong>Content Websites and Blogs:</strong> Add meaningful and SEO-friendly content related to
              spirituality, motivation, and Indian culture.
            </>,
            <>
              <strong>Mobile Apps:</strong> Easily integrate dohe into Android or iOS apps for learning, quotes, or
              reading experiences.
            </>,
            <>
              <strong>Chatbots and AI Tools:</strong> Use dohe as responses or training data for apps focused on
              philosophy and knowledge sharing.
            </>,
            <>
              <strong>Language Learning Tools:</strong> Help users learn Hindi with real cultural content and simple
              meanings.
            </>,
            <>
              <strong>Social Media Content:</strong> Generate posts, reels, or shareable content based on Kabir&apos;s
              dohe.
            </>,
          ]}
        />
      ),
    },
    {
      id: 'who-can-use-kabir-dohe-api',
      heading: 'Who Can Use Kabir Dohe API?',
      content: (
        <BulletList
          items={[
            <>
              <strong>Developers:</strong> Build apps, websites, or tools that use meaningful and cultural content.
            </>,
            <>
              <strong>Students and Learners:</strong> Study Kabir&apos;s dohe, Indian philosophy, and moral teachings in
              a simple format.
            </>,
            <>
              <strong>Teachers and Educators:</strong> Use dohe as learning material in classrooms, courses, or online
              teaching.
            </>,
            <>
              <strong>Content Creators:</strong> Create blogs, videos, or social media content based on Kabir&apos;s
              teachings.
            </>,
            <>
              <strong>Researchers:</strong> Analyze dohe for cultural, linguistic, or philosophical studies.
            </>,
            <>
              <strong>AI and NLP Developers:</strong> Use the dataset for tasks like text analysis, translation, or
              training language models.
            </>,
            <>
              <strong>Startups and Indie Makers:</strong> Add unique and valuable content to apps focused on learning,
              quotes, or spirituality.
            </>,
          ]}
        />
      ),
    },
    {
      id: 'what-can-you-build',
      heading: 'What Can You Build with Kabir Dohe API?',
      content: (
        <BulletList
          items={[
            <>
              <strong>Quote Apps:</strong> Create daily doha apps that show meaningful quotes for inspiration and
              reflection.
            </>,
            <>
              <strong>Social Media Bots:</strong> Build bots that automatically post Kabir&apos;s dohe on platforms like{' '}
              <a href="https://docs.x.com/overview" target="_blank" rel="noopener noreferrer">
                Twitter (X)
              </a>{' '}
              or other social platforms.
            </>,
            <>
              <strong>Educational Websites:</strong> Develop platforms to teach Indian philosophy, values, and
              literature.
            </>,
            <>
              <strong>Language Learning Tools:</strong> Help users learn Hindi with dohe and their English translations.
            </>,
            <>
              <strong>Mobile Apps:</strong> Build Android or iOS apps focused on reading, learning, or sharing dohe.
            </>,
            <>
              <strong>Chatbots and AI Tools:</strong> Create bots that share dohe or answer questions using Kabir&apos;s
              teachings.
            </>,
            <>
              <strong>Voice Assistants:</strong> Integrate dohe into voice apps using{' '}
              <a href="https://developer.amazon.com/en-US/alexa" target="_blank" rel="noopener noreferrer">
                Amazon Alexa
              </a>{' '}
              or{' '}
              <a href="https://developers.google.com/assistant" target="_blank" rel="noopener noreferrer">
                Google Assistant
              </a>
              .
            </>,
            <>
              <strong>Content Platforms:</strong> Build blogs, tools, or websites that share spiritual and cultural
              content.
            </>,
          ]}
        />
      ),
    },
  ];

  return (
    <>
      {sections.map((section) => (
        <SeoSection key={section.id} id={section.id} heading={section.heading}>
          {section.content}
        </SeoSection>
      ))}
    </>
  );
}
