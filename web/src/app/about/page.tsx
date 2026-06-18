import type { JSX } from 'react';

import { aboutPageSchema, breadcrumbSchema } from '@vijayhardaha/schema-builder';
import { JsonLd } from '@vijayhardaha/schema-builder/react';
import type { Metadata } from 'next';
import Image from 'next/image';

import { Container } from '@/components/layout/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageLayout } from '@/components/layout/PageLayout';
import { buildMetadata } from '@/lib/utils/meta';
import { type PageConfig } from '@/lib/utils/schema';
import { globalSchema } from '@/lib/utils/schema';
import { siteUrl } from '@/lib/utils/seo';

// ── SEO ───────────────────────────────────────────────────────────────────

const SITE_DESCRIPTION =
  'Learn about the life, teachings, and legacy of Sant Kabir Das, the 15th-century mystic poet whose dohas continue to inspire millions with spiritual wisdom.';

const pageConfig: PageConfig = {
  seoTitle: 'About Sant Kabir Das',
  seoDescription: SITE_DESCRIPTION,
  seoPath: 'about',
  seoKeywords: ['about Kabir', 'Sant Kabir biography', 'Kabir life story', 'Kabir Das history'],
};

/** SEO metadata for the page. */
export const metadata: Metadata = buildMetadata({
  title: pageConfig.seoTitle,
  description: pageConfig.seoDescription,
  path: pageConfig.seoPath,
});

// ── Famous dohas ──────────────────────────────────────────────────────────

/**
 * Famous dohas of Sant Kabir rendered on the about page.
 * Each entry is a tuple of [firstLine, secondLine].
 *
 * @type {Array<[string, string]>}
 */
const FAMOUS_DOHAS: Array<[string, string]> = [
  ['अपना तो कोई नहीं, देखा ठोक बजाय।', 'अपना अपना क्या करे, मोह भरम लपटाय।।'],
  ['ऐसी वाणी बोलिए, मन का आपा खोय।', 'औरन को शीतल करे, आपहुं शीतल होय।।'],
  ['एक दिन ऐसा होएगा, कोई काहू का नाहि।', 'घर की नारी को कहै, तन की नारी जाहि।।'],
  ['कबीरा खड़ा बाज़ार में, मांगे सबकी खैर।', 'ना काहू से दोस्ती, ना काहू से बैर।।'],
  ['कबीरा यह संसार है, जैसा सेमल फूल।', 'दिन दस के व्यवहार में, झूठे रंग ना भूल।।'],
  ['काल करे सो आज कर, आज करे सो अब।', 'पल में परलय होएगी, बहुरि करेगा कब।।'],
  ['गगन दमामा बाजिया, पड़े निसाने घाव।', 'खेत बुहारे सूरमा, मोहे मरण का चाव।।'],
  ['गुरु गोविंद दोउ खड़े, काके लागूं पाँय।', 'बलिहारी गुरु आपने, गोविंद दियो बताय।।'],
  ['चाह गयी चिंता मिटी, मनुआ बेपरवाह।', 'जिनको कुछ नहीं चाहिए, वो शाहन के शाह।।'],
  ['दुःख में सुमिरन सब करे, सुख में करे न कोय।', 'जो सुख में सुमिरन करे, तो दुःख काहे को होय।।'],
  ['प्रेम पियाला जो पिये, शीश दक्षिणा देय।', 'लोभी शीश न दे सके, नाम प्रेम का लेय।।'],
  ['बड़ा भया तो क्या भया, जैसे पेड़ खजूर।', 'पंथी को छाया नहीं, फल लागे अति दूर।।'],
  ['मरण भला तब जानिए, छूट जाए हंकार।', 'जग की मरनी क्यों मरें, दिन में सौ-सौ बार।।'],
  ['माटी कहे कुम्हार से, तू क्या रोंदे मोहे।', 'एक दिन ऐसा आएगा, मैं रोंदुंगी तोहे।।'],
  ['राम नाम कड़वा लगे, मीठा लागे दाम।', 'दुविधा में दोनों गए, माया मिली ना राम।।'],
  ['राम बुलावा भेजिया, दिया कबीरा रोय।', 'जो सुख साधू संग में, सो बैकुंठ ना होय।।'],
  ['सोना सज्जन साधुजन, टूट जुड़े सौ बार।', 'दुर्जन कुंभ कुम्हार के, एके धक्का दरार।।'],
  ['हाड़ जले ज्यो लाकड़ी, केस जले ज्यों घास।', 'सब जग जलता देख के, भए कबीर उदास।।'],
];

// ── Schema (JSON-LD) ──────────────────────────────────────────────────────

const rootUrl = siteUrl();
const aboutSchema = [
  ...globalSchema(),
  aboutPageSchema({ rootUrl, path: pageConfig.seoPath }, { name: `${pageConfig.seoTitle} — Kabir Ke Dohe` }),
  breadcrumbSchema({
    rootUrl,
    items: [
      { name: 'Home', path: '' },
      { name: pageConfig.seoTitle, path: pageConfig.seoPath },
    ],
  }),
];

/**
 * About page detailing Sant Kabir's life, teachings, and legacy.
 *
 * @returns {JSX.Element} About page
 */
export default function AboutPage(): JSX.Element {
  return (
    <>
      <JsonLd data={aboutSchema} />
      <PageLayout>
        <Container>
          <PageHeader title="संत कबीर दास के बारे में (About Sant Kabir Das)" />

          <article>
            <div className="mt-8 space-y-6 leading-relaxed">
              <p>
                संत कबीर, 15वीं शताब्दी में जन्मे, भारत के सबसे प्रतिष्ठित कवियों और आध्यात्मिक नेताओं में से एक हैं।
                उनके जीवन और कार्यों ने भारत के आध्यात्मिक परिदृश्य पर एक अमिट छाप छोड़ी है, जो धर्म, जाति और संप्रदाय
                की सीमाओं से परे है। कबीर की शिक्षाएँ मुख्यतः उनके दोहों के माध्यम से व्यक्त की गईं, जो जीवन,
                आध्यात्मिकता और मानव स्वभाव पर सरल लेकिन गहन चिंतन हैं। ये शिक्षाएँ आज भी प्रासंगिक हैं, लाखों लोगों को
                प्रेम, सादगी और सत्य के जीवन की ओर मार्गदर्शन करती हैं।
              </p>
              <p>
                Sant Kabir, born in the 15th century, is one of India&rsquo;s most revered poets and spiritual leaders.
                His life and works have left an indelible mark on the spiritual landscape of India, transcending the
                boundaries of religion, caste, and creed. Kabir&rsquo;s teachings were primarily conveyed through his
                dohas (couplets), which are simple yet profound reflections on life, spirituality, and human nature.
                These teachings continue to be relevant in today&rsquo;s world, guiding millions toward a life of love,
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

              <h3 className="text-primary text-2xl font-bold">
                प्रारंभिक जीवन और आध्यात्मिक जागृति (Early Life and Spiritual Awakening)
              </h3>
              <p>
                कबीर का जन्म लगभग 1440 ईस्वी में{' '}
                <a href="https://en.wikipedia.org/wiki/Varanasi" target="_blank" rel="noopener noreferrer">
                  वाराणसी
                </a>{' '}
                में हुआ, जो भारत के सबसे पवित्र शहरों में से एक है। हालाँकि उनके जन्म का सटीक विवरण रहस्य बना हुआ है, यह
                व्यापक रूप से माना जाता है कि वे एक मुस्लिम जुलाहा परिवार में पैदा हुए थे। कबीर को एक गरीब मुस्लिम
                दंपति, नीरू और नीमा ने गोद लिया और पाला, जिन्होंने उन्हें{' '}
                <a href="https://en.wikipedia.org/wiki/Lahartara" target="_blank" rel="noopener noreferrer">
                  लहरतारा तालाब
                </a>{' '}
                में कमल पर तैरते हुए पाया था। अपनी साधारण शुरुआत के बावजूद, कबीर बचपन से ही विभिन्न धार्मिक परंपराओं की
                शिक्षाओं की ओर आकर्षित थे।
              </p>
              <p>
                Kabir was born in{' '}
                <a href="https://en.wikipedia.org/wiki/Varanasi" target="_blank" rel="noopener noreferrer">
                  Varanasi
                </a>
                , one of the holist cities in India, around 1440 CE. Though his exact birth details remain a mystery, it
                is widely believed that he was born into a Muslim family of weavers. Kabir was adopted and raised by a
                poor Muslim couple, Neeru and Neema, who found him floating on a lotus in the{' '}
                <a href="https://en.wikipedia.org/wiki/Lahartara" target="_blank" rel="noopener noreferrer">
                  Lahartara lake
                </a>
                . Despite his humble beginnings, Kabir was drawn to the teachings of various religious traditions from a
                young age.
              </p>
              <p>
                उनकी आध्यात्मिक यात्रा हिंदू संत{' '}
                <a href="https://en.wikipedia.org/wiki/Ramananda" target="_blank" rel="noopener noreferrer">
                  रामानंद
                </a>{' '}
                के मार्गदर्शन में शुरू हुई, जिन्होंने अनजाने में कबीर को अपना शिष्य स्वीकार कर लिया। कबीर की शिक्षाएँ
                हिंदू और{' '}
                <a href="https://en.wikipedia.org/wiki/Islamic_mysticism" target="_blank" rel="noopener noreferrer">
                  इस्लामिक रहस्यवाद
                </a>{' '}
                दोनों का मिश्रण हैं, जो अनुष्ठानों या हठधर्मिता के पालन के बजाय ईश्वर के व्यक्तिगत अनुभव पर केंद्रित
                हैं। उन्होंने{' '}
                <a href="https://en.wikipedia.org/wiki/Caste_system_in_India" target="_blank" rel="noopener noreferrer">
                  जाति व्यवस्था
                </a>
                , धार्मिक रूढ़िवादिता और कर्मकांडी प्रथाओं को अस्वीकार किया, और ईश्वर के साथ सीधे और सरल संबंध की वकालत
                की।
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
                , religious orthodoxy, and ritualistic practices, advocating instead for a direct and simple
                relationship with the Divine.
              </p>

              <h3 className="text-primary text-2xl font-bold">
                संत कबीर की मुख्य शिक्षाएँ (Core Teachings of Sant Kabir)
              </h3>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  <strong>ईश्वर की एकता (Unity of God):</strong> कबीर ने जोर दिया कि केवल एक ही ईश्वर है, जो विभिन्न
                  धर्मों में अलग-अलग नामों से जाना जाता है। वे सभी धर्मों की एकता में विश्वास करते थे और मानते थे कि
                  ईश्वर हर व्यक्ति के भीतर निवास करता है। Kabir emphasized that there is only one God, who is known by
                  different names in different religions. He believed in the unity of all religions and that the Divine
                  resides within every individual.
                </li>
                <li>
                  <strong>व्यक्तिगत आध्यात्मिकता (Personal Spirituality):</strong> कबीर ने सिखाया कि सच्ची आध्यात्मिकता
                  स्वयं के भीतर पाई जाती है। उन्होंने आत्मचिंतन और आत्म-साक्षात्कार को प्रोत्साहित किया, लोगों से बाहरी
                  अनुष्ठानों के बजाय भीतर ईश्वर की खोज करने का आग्रह किया। Kabir taught that true spirituality is found
                  within oneself. He encouraged introspection and self-realization, urging people to seek the Divine
                  within rather than through external rituals.
                </li>
                <li>
                  <strong>सादगी और विनम्रता (Simplicity and Humility):</strong> कबीर ने सादगी और विनम्रता के जीवन की
                  वकालत की। वे मानते थे कि अहंकार आध्यात्मिक प्रगति की सबसे बड़ी बाधा है और व्यक्ति को ईश्वर से सच्चा
                  जुड़ने के लिए अपना अभिमान त्यागना होगा। Kabir advocated for a life of simplicity and humility. He
                  believed that the ego is the greatest barrier to spiritual progress and that one must surrender their
                  pride to truly connect with the Divine.
                </li>
                <li>
                  <strong>समानता और भाईचारा (Equality and Brotherhood):</strong> कबीर ने जाति व्यवस्था और सभी प्रकार के
                  सामाजिक भेदभाव को अस्वीकार किया। उन्होंने उपदेश दिया कि सभी मनुष्य ईश्वर की दृष्टि में समान हैं, चाहे
                  उनकी सामाजिक या धार्मिक पृष्ठभूमि कुछ भी हो। Kabir rejected the caste system and all forms of social
                  discrimination. He preached that all humans are equal in the eyes of God, regardless of their social
                  or religious background.
                </li>
                <li>
                  <strong>भौतिकवाद से विरक्ति (Detachment from Materialism):</strong> कबीर ने भौतिक वस्तुओं और सांसारिक
                  सुखों के आसक्ति के प्रति चेतावनी दी, जिसे वे जीवन के वास्तविक उद्देश्य — आध्यात्मिक ज्ञान — से विचलित
                  करने वाला मानते थे। Kabir warned against attachment to material possessions and worldly pleasures,
                  which he saw as distractions from the true purpose of life&mdash;spiritual enlightenment.
                </li>
              </ul>

              <h3 className="text-primary text-2xl font-bold">संत कबीर की विरासत (The Legacy of Sant Kabir)</h3>
              <p>
                कबीर का प्रभाव उनके जीवनकाल से कहीं आगे तक फैला है। उनकी शिक्षाओं ने{' '}
                <a href="https://en.wikipedia.org/wiki/Kabir_Panth" target="_blank" rel="noopener noreferrer">
                  कबीर पंथ
                </a>{' '}
                के गठन को प्रेरित किया, जो एक धार्मिक समुदाय है जो उनके आदर्शों का पालन करता है। यह समुदाय, जो आज भी
                अस्तित्व में है, कबीर की शिक्षाओं पर केंद्रित एक सरल, भक्तिपूर्ण जीवन शैली का अभ्यास करता है। उनके दोहे
                पूरे भारत में, विशेषकर उत्तरी राज्यों में, गाए, सुनाए और श्रद्धेय माने जाते हैं।
              </p>
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
                कबीर की रचनाओं को{' '}
                <a href="https://en.wikipedia.org/wiki/Guru_Granth_Sahib" target="_blank" rel="noopener noreferrer">
                  गुरु ग्रंथ साहिब
                </a>{' '}
                में शामिल किया गया है, जो{' '}
                <a href="https://en.wikipedia.org/wiki/Sikhism" target="_blank" rel="noopener noreferrer">
                  सिख धर्म
                </a>{' '}
                का पवित्र ग्रंथ है, जो कई धार्मिक परंपराओं पर उनके प्रभाव को दर्शाता है। उनके छंद अक्सर आध्यात्मिकता,
                नैतिकता और मानवतावाद पर चर्चाओं में उद्धृत किए जाते हैं, जो विभिन्न धर्मों और दर्शनों के बीच एक पुल का
                काम करते हैं।
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
                , demonstrating his impact on multiple religious traditions. His verses are often quoted in discussions
                on spirituality, ethics, and humanism, serving as a bridge between different faiths and philosophies.
              </p>

              <h3 className="text-primary text-2xl font-bold">
                भारतीय साहित्य में कबीर का योगदान (Kabir&rsquo;s Contribution to Indian Literature)
              </h3>
              <p>
                कबीर के दोहे साहित्यिक खजाने माने जाते हैं, जो जीवन के सार से गहराई से जुड़े एक रहस्यवादी के ज्ञान और
                अनुभवों को दर्शाते हैं। अपने समय की{' '}
                <a href="https://en.wikipedia.org/wiki/Indian_languages" target="_blank" rel="noopener noreferrer">
                  स्थानीय भाषा
                </a>{' '}
                में लिखे गए, उनके छंद सभी पृष्ठभूमि के लोगों के लिए सुलभ हैं। जटिल आध्यात्मिक सत्य को सरल, संबंधित भाषा
                में व्यक्त करने की उनकी क्षमता एक कारण है कि उनकी शिक्षाएँ सदियों तक कायम रहीं।
              </p>
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
                कबीर की कविता अपनी संक्षिप्तता और गहराई की विशेषता है, जो अक्सर रोजमर्रा के जीवन से लिए गए{' '}
                <a href="https://en.wikipedia.org/wiki/Metaphor" target="_blank" rel="noopener noreferrer">
                  रूपकों
                </a>{' '}
                और{' '}
                <a href="https://en.wikipedia.org/wiki/Analogy" target="_blank" rel="noopener noreferrer">
                  समानताओं
                </a>{' '}
                का उपयोग करती है। उनके छंद श्रोता या पाठक को उनके विश्वासों, व्यवहारों और वास्तविकता की प्रकृति के बारे
                में गंभीरता से सोचने की चुनौती देते हैं। सादगी और गहराई का यह मिश्रण कबीर के काम को अर्थ और उद्देश्य से
                भरे जीवन जीने के लिए एक कालातीत मार्गदर्शक बनाता है।
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

              <h3 className="text-primary text-2xl font-bold">
                संत कबीर के प्रसिद्ध दोहे (Famous Dohas by Sant Kabir)
              </h3>
              <ul className="list-disc space-y-2 pl-6">
                {FAMOUS_DOHAS.map(([line1, line2], idx) => (
                  <li key={idx}>
                    {line1}
                    <br />
                    {line2}
                  </li>
                ))}
              </ul>

              <p>
                संत कबीर की शिक्षाएँ और रचनाएँ आध्यात्मिक जागृति और सामंजस्यपूर्ण जीवन का मार्ग प्रस्तुत करती हैं। यह
                वेबसाइट उनके ज्ञान को साझा करने, आपको उनके दोहों की गहराइयों का अन्वेषण करने और आपकी आध्यात्मिक यात्रा
                में मार्गदर्शन करने के लिए समर्पित है। कबीर के शब्द आपके मार्ग को प्रकाशित करें और आपको सत्य, सादगी और
                प्रेम का जीवन जीने के लिए प्रेरित करें।
              </p>
              <p>
                Sant Kabir&rsquo;s teachings and writings offer a path to spiritual awakening and a life of harmony.
                This website is dedicated to sharing his wisdom, helping you explore the depths of his dohas, and
                guiding you on your spiritual journey. Let Kabir&rsquo;s words illuminate your path and inspire you to
                live a life of truth, simplicity, and love.
              </p>
            </div>
          </article>
        </Container>
      </PageLayout>
    </>
  );
}
