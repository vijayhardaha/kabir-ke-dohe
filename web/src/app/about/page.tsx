import type { JSX } from 'react';

import Image from 'next/image';

import { Container } from '@/components/layout/Container';
import { PageLayout } from '@/components/layout/PageLayout';

/**
 * About page detailing Sant Kabir's life, teachings, and legacy.
 *
 * @returns {JSX.Element} About page
 */
export default function AboutPage(): JSX.Element {
  return (
    <PageLayout>
      <Container>
        <article>
          <header>
            <h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">About Sant Kabir Das</h1>
          </header>

          <div className="text-foreground/80 mt-8 space-y-6 leading-relaxed">
            <p>
              Sant Kabir, born in the 15th century, is one of India&rsquo;s most revered poets and spiritual leaders.
              His life and works have left an indelible mark on the spiritual landscape of India, transcending the
              boundaries of religion, caste, and creed. Kabir&rsquo;s teachings were primarily conveyed through his
              dohas (couplets), which are simple yet profound reflections on life, spirituality, and human nature. These
              teachings continue to be relevant in today&rsquo;s world, guiding millions toward a life of love,
              simplicity, and truth.
            </p>

            <figure className="my-8">
              <Image
                src="/sant-kabir-and-disciples.jpg"
                alt="Kabir with Namadeva, Raidas and Pipaji. Jaipur, early 19th century"
                width={1200}
                height={900}
                className="rounded-lg"
              />
              <figcaption className="text-muted-foreground mt-2 text-sm">
                Kabir with Namadeva, Raidas and Pipaji. Jaipur, early 19th century
                <br />
                Source: Wikimedia Commons
              </figcaption>
            </figure>

            <h3 className="text-foreground text-xl font-semibold">Early Life and Spiritual Awakening</h3>
            <p>
              Kabir was born in{' '}
              <a href="https://en.wikipedia.org/wiki/Varanasi" target="_blank" rel="noopener noreferrer">
                Varanasi
              </a>
              , one of the holiest cities in India, around 1440 CE. Though his exact birth details remain a mystery, it
              is widely believed that he was born into a Muslim family of weavers. Kabir was adopted and raised by a
              poor Muslim couple, Neeru and Neema, who found him floating on a lotus in the{' '}
              <a href="https://en.wikipedia.org/wiki/Lahartara" target="_blank" rel="noopener noreferrer">
                Lahartara lake
              </a>
              . Despite his humble beginnings, Kabir was drawn to the teachings of various religious traditions from a
              young age.
            </p>
            <p>
              His spiritual journey began under the guidance of the Hindu saint,{' '}
              <a href="https://en.wikipedia.org/wiki/Ramananda" target="_blank" rel="noopener noreferrer">
                Ramananda
              </a>
              , who unknowingly accepted Kabir as his disciple. Kabir&rsquo;s teachings reflect a blend of both Hindu
              and{' '}
              <a href="https://en.wikipedia.org/wiki/Islamic_mysticism" target="_blank" rel="noopener noreferrer">
                Islamic mysticism
              </a>
              , focusing on a personal experience of the Divine rather than adherence to rituals or dogma. He rejected
              the{' '}
              <a href="https://en.wikipedia.org/wiki/Caste_system_in_India" target="_blank" rel="noopener noreferrer">
                caste system
              </a>
              , religious orthodoxy, and ritualistic practices, advocating instead for a direct and simple relationship
              with the Divine.
            </p>

            <h3 className="text-foreground text-xl font-semibold">Core Teachings of Sant Kabir</h3>
            <ul className="text-muted-foreground list-disc space-y-2 pl-6">
              <li>
                <strong className="text-foreground">Unity of God:</strong> Kabir emphasized that there is only one God,
                who is known by different names in different religions. He believed in the unity of all religions and
                that the Divine resides within every individual.
              </li>
              <li>
                <strong className="text-foreground">Personal Spirituality:</strong> Kabir taught that true spirituality
                is found within oneself. He encouraged introspection and self-realization, urging people to seek the
                Divine within rather than through external rituals.
              </li>
              <li>
                <strong className="text-foreground">Simplicity and Humility:</strong> Kabir advocated for a life of
                simplicity and humility. He believed that the ego is the greatest barrier to spiritual progress and that
                one must surrender their pride to truly connect with the Divine.
              </li>
              <li>
                <strong className="text-foreground">Equality and Brotherhood:</strong> Kabir rejected the caste system
                and all forms of social discrimination. He preached that all humans are equal in the eyes of God,
                regardless of their social or religious background.
              </li>
              <li>
                <strong className="text-foreground">Detachment from Materialism:</strong> Kabir warned against
                attachment to material possessions and worldly pleasures, which he saw as distractions from the true
                purpose of life&mdash;spiritual enlightenment.
              </li>
            </ul>

            <h3 className="text-foreground text-xl font-semibold">The Legacy of Sant Kabir</h3>
            <p>
              Kabir&rsquo;s influence extends far beyond his lifetime. His teachings inspired the formation of the{' '}
              <a href="https://en.wikipedia.org/wiki/Kabir_Panth" target="_blank" rel="noopener noreferrer">
                Kabir Panth
              </a>
              , a religious community that follows his ideals. This community, which still exists today, practices a
              simple, devotional lifestyle focused on the teachings of Kabir. His dohas are recited, sung, and revered
              across India, particularly in the northern states.
            </p>
            <p>
              Kabir&rsquo;s works have been included in the{' '}
              <a href="https://en.wikipedia.org/wiki/Guru_Granth_Sahib" target="_blank" rel="noopener noreferrer">
                Guru Granth Sahib
              </a>
              , the holy scripture of{' '}
              <a href="https://en.wikipedia.org/wiki/Sikhism" target="_blank" rel="noopener noreferrer">
                Sikhism
              </a>
              , demonstrating his impact on multiple religious traditions. His verses are often quoted in discussions on
              spirituality, ethics, and humanism, serving as a bridge between different faiths and philosophies.
            </p>

            <h3 className="text-foreground text-xl font-semibold">Kabir&rsquo;s Contribution to Indian Literature</h3>
            <p>
              Kabir&rsquo;s dohas are considered literary treasures, reflecting the wisdom and experiences of a mystic
              deeply connected with the essence of life. Written in the{' '}
              <a href="https://en.wikipedia.org/wiki/Indian_languages" target="_blank" rel="noopener noreferrer">
                vernacular language
              </a>{' '}
              of his time, his verses are accessible to people of all backgrounds. His ability to convey complex
              spiritual truths in simple, relatable language is one of the reasons his teachings have endured for
              centuries.
            </p>
            <p>
              Kabir&rsquo;s poetry is characterized by its brevity and depth, often using{' '}
              <a href="https://en.wikipedia.org/wiki/Metaphor" target="_blank" rel="noopener noreferrer">
                metaphors
              </a>{' '}
              and{' '}
              <a href="https://en.wikipedia.org/wiki/Analogy" target="_blank" rel="noopener noreferrer">
                analogies
              </a>{' '}
              drawn from everyday life. His verses challenge the listener or reader to think critically about their
              beliefs, behaviors, and the nature of reality itself. This blend of simplicity and profundity makes
              Kabir&rsquo;s work a timeless guide to living a life of meaning and purpose.
            </p>

            <h3 className="text-foreground text-xl font-semibold">Famous Dohas by Sant Kabir</h3>
            <ul className="text-muted-foreground list-disc space-y-2 pl-6">
              <li>
                अपना तो कोई नहीं, देखा ठोक बजाय।
                <br />
                अपना अपना क्या करे, मोह भरम लपटाय।।
              </li>
              <li>
                ऐसी वाणी बोलिए, मन का आपा खोय।
                <br />
                औरन को शीतल करे, आपहुं शीतल होय।।
              </li>
              <li>
                एक दिन ऐसा होएगा, कोई काहू का नाहि।
                <br />
                घर की नारी को कहै, तन की नारी जाहि।।
              </li>
              <li>
                कबीरा खड़ा बाज़ार में, मांगे सबकी खैर।
                <br />
                ना काहू से दोस्ती, ना काहू से बैर।।
              </li>
              <li>
                कबीरा यह संसार है, जैसा सेमल फूल।
                <br />
                दिन दस के व्यवहार में, झूठे रंग ना भूल।।
              </li>
              <li>
                काल करे सो आज कर, आज करे सो अब।
                <br />
                पल में परलय होएगी, बहुरि करेगा कब।।
              </li>
              <li>
                गगन दमामा बाजिया, पड़े निसाने घाव।
                <br />
                खेत बुहारे सूरमा, मोहे मरण का चाव।।
              </li>
              <li>
                गुरु गोविंद दोउ खड़े, काके लागूं पाँय।
                <br />
                बलिहारी गुरु आपने, गोविंद दियो बताय।।
              </li>
              <li>
                चाह गयी चिंता मिटी, मनुआ बेपरवाह।
                <br />
                जिनको कुछ नहीं चाहिए, वो शाहन के शाह।।
              </li>
              <li>
                दुःख में सुमिरन सब करे, सुख में करे न कोय।
                <br />
                जो सुख में सुमिरन करे, तो दुःख काहे को होय।।
              </li>
              <li>
                प्रेम पियाला जो पिये, शीश दक्षिणा देय।
                <br />
                लोभी शीश न दे सके, नाम प्रेम का लेय।।
              </li>
              <li>
                बड़ा भया तो क्या भया, जैसे पेड़ खजूर।
                <br />
                पंथी को छाया नहीं, फल लागे अति दूर।।
              </li>
              <li>
                मरण भला तब जानिए, छूट जाए हंकार।
                <br />
                जग की मरनी क्यों मरें, दिन में सौ-सौ बार।।
              </li>
              <li>
                माटी कहे कुम्हार से, तू क्या रोंदे मोहे।
                <br />
                एक दिन ऐसा आएगा, मैं रोंदुंगी तोहे।।
              </li>
              <li>
                राम नाम कड़वा लगे, मीठा लागे दाम।
                <br />
                दुविधा में दोनों गए, माया मिली ना राम।।
              </li>
              <li>
                राम बुलावा भेजिया, दिया कबीरा रोय।
                <br />
                जो सुख साधू संग में, सो बैकुंठ ना होय।।
              </li>
              <li>
                सोना सज्जन साधुजन, टूट जुड़े सौ बार।
                <br />
                दुर्जन कुंभ कुम्हार के, एके धक्का दरार।।
              </li>
              <li>
                हाड़ जले ज्यो लाकड़ी, केस जले ज्यों घास।
                <br />
                सब जग जलता देख के, भए कबीर उदास।।
              </li>
            </ul>

            <p>
              Sant Kabir&rsquo;s teachings and writings offer a path to spiritual awakening and a life of harmony. This
              website is dedicated to sharing his wisdom, helping you explore the depths of his dohas, and guiding you
              on your spiritual journey. Let Kabir&rsquo;s words illuminate your path and inspire you to live a life of
              truth, simplicity, and love.
            </p>
          </div>
        </article>
      </Container>
    </PageLayout>
  );
}
