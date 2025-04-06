import { Alert, Box, Typography } from "@mui/material";
import Image from "next/image";

import Link from "@/src/components/common/Link";
import PageHeader from "@/src/components/layout/PageHeader";
import PageTemplate from "@/src/components/layout/PageTemplate";
import SectionBody from "@/src/components/layout/SectionBody";
import SEO from "@/src/components/seo/SEO";
import { PAGES_SEO_CONFIG } from "@/src/constants/seo";
import { nl2br } from "@/src/utils/formatting";
import { getPermalinkWithBase } from "@/src/utils/seo";

/**
 * Array of dohas (couplets) attributed to Sant Kabir Das.
 * Each doha reflects on life, spirituality, and human nature.
 *
 * @type {string[]}
 */
const VERSES = [
  "अपना तो कोई नहीं, देखा ठोक बजाय।\nअपना अपना क्या करे, मोह भरम लपटाय।।",
  "ऐसी वाणी बोलिए, मन का आपा खोय।\nऔरन को शीतल करे, आपहुं शीतल होय।।",
  "एक दिन ऐसा होएगा, कोई काहू का नाहि।\nघर की नारी को कहै, तन की नारी जाहि।।",
  "कबीरा खड़ा बाज़ार में, मांगे सबकी खैर।\nना काहू से दोस्ती, ना काहू से बैर।।",
  "कबीरा यह संसार है, जैसा सेमल फूल।\nदिन दस के व्यवहार में, झूठे रंग ना भूल।।",
  "काल करे सो आज कर, आज करे सो अब।\nपल में परलय होएगी, बहुरि करेगा कब।।",
  "गगन दमामा बाजिया, पड़े निसाने घाव।\nखेत बुहारे सूरमा, मोहे मरण का चाव।।",
  "गुरु गोविंद दोउ खड़े, काके लागूं पाँय।\nबलिहारी गुरु आपने, गोविंद दियो बताय।।",
  "चाह गयी चिंता मिटी, मनुआ बेपरवाह।\nजिनको कुछ नहीं चाहिए, वो शाहन के शाह।।",
  "दुःख में सुमिरन सब करे, सुख में करे न कोय।\nजो सुख में सुमिरन करे, तो दुःख काहे को होय।।",
  "प्रेम पियाला जो पिये, शीश दक्षिणा देय।\nलोभी शीश न दे सके, नाम प्रेम का लेय।।",
  "बड़ा भया तो क्या भया, जैसे पेड़ खजूर।\nपंथी को छाया नहीं, फल लागे अति दूर।।",
  "मरण भला तब जानिए, छूट जाए हंकार।\nजग की मरनी क्यों मरें, दिन में सौ-सौ बार।।",
  "माटी कहे कुम्हार से, तू क्या रोंदे मोहे।\nएक दिन ऐसा आएगा, मैं रोंदुंगी तोहे।।",
  "राम नाम कड़वा लगे, मीठा लागे दाम।\nदुविधा में दोनों गए, माया मिली ना राम।।",
  "राम बुलावा भेजिया, दिया कबीरा रोय।\nजो सुख साधू संग में, सो बैकुंठ ना होय।।",
  "सोना सज्जन साधुजन, टूट जुड़े सौ बार।\nदुर्जन कुंभ कुम्हार के, एके धक्का दरार।।",
  "हाड़ जले ज्यो लाकड़ी, केस जले ज्यों घास।\nसब जग जलता देख के, भए कबीर उदास।।",
];

/**
 * About component displaying information about Sant Kabir Das.
 *
 * This component provides an overview of Sant Kabir Das, including his early life, core teachings, legacy, and literary contributions. It also includes a selection of his famous dohas.
 *
 * @returns {JSX.Element} The rendered About component.
 */
const About = () => {
  const { title, description, keywords } = PAGES_SEO_CONFIG.about;

  return (
    <PageTemplate>
      <SEO title={title} description={description} keywords={keywords} url={getPermalinkWithBase("about")} />
      <SectionBody>
        <Box component="article">
          <PageHeader title="About Sant Kabir Das" />

          <Box>
            <Typography component="p">
              Sant Kabir, born in the 15th century, is one of India’s most revered poets and spiritual leaders. His life
              and works have left an indelible mark on the spiritual landscape of India, transcending the boundaries of
              religion, caste, and creed. Kabir’s teachings were primarily conveyed through his dohas (couplets), which
              are simple yet profound reflections on life, spirituality, and human nature. These teachings continue to
              be relevant in today’s world, guiding millions toward a life of love, simplicity, and truth.
            </Typography>

            <Box component="figure" sx={{ margin: 0 }}>
              <Image
                src="/sant-kabir-and-disciples.jpg"
                alt="Kabir with Namadeva, Raidas and Pipaji. Jaipur, early 19th century"
                width={1200}
                height={900}
                priority
              />
              <Box
                component="figcaption"
                style={{
                  textAlign: "center",
                  fontStyle: "italic",
                  marginTop: "0.5rem",
                }}
              >
                Kabir with Namadeva, Raidas and Pipaji. Jaipur, early 19th century
                <br />
                Source: Wikimedia Commons
              </Box>
            </Box>

            <Typography
              variant="h3"
              sx={{
                mt: 5,
                mb: 1.5,
              }}
            >
              Early Life and Spiritual Awakening
            </Typography>

            <Typography component="p">
              Kabir was born in{" "}
              <Link showExternalIcon href="https://en.wikipedia.org/wiki/Varanasi" aria-label="Varanasi - Wikipedia">
                Varanasi
              </Link>
              , one of the holiest cities in India, around 1440 CE. Though his exact birth details remain a mystery, it
              is widely believed that he was born into a Muslim family of weavers. Kabir was adopted and raised by a
              poor Muslim couple, Neeru and Neema, who found him floating on a lotus in the{" "}
              <Link
                showExternalIcon
                href="https://en.wikipedia.org/wiki/Lahartara"
                aria-label="Lahartara lake - Wikipedia"
              >
                Lahartara lake
              </Link>
              . Despite his humble beginnings, Kabir was drawn to the teachings of various religious traditions from a
              young age.
            </Typography>

            <Typography component="p">
              His spiritual journey began under the guidance of the Hindu saint,{" "}
              <Link showExternalIcon href="https://en.wikipedia.org/wiki/Ramananda" aria-label="Ramananda - Wikipedia">
                Ramananda
              </Link>
              , who unknowingly accepted Kabir as his disciple. Kabir’s teachings reflect a blend of both Hindu and{" "}
              <Link
                showExternalIcon
                href="https://en.wikipedia.org/wiki/Islamic_mysticism"
                aria-label="Islamic mysticism - Wikipedia"
              >
                Islamic mysticism
              </Link>
              , focusing on a personal experience of the Divine rather than adherence to rituals or dogma. He rejected
              the{" "}
              <Link
                showExternalIcon
                href="https://en.wikipedia.org/wiki/Caste_system_in_India"
                aria-label="Caste system - Wikipedia"
              >
                caste system
              </Link>
              , religious orthodoxy, and ritualistic practices, advocating instead for a direct and simple relationship
              with the Divine.
            </Typography>

            <Typography
              variant="h3"
              sx={{
                mt: 5,
                mb: 1.5,
              }}
            >
              Core Teachings of Sant Kabir
            </Typography>

            <Typography
              component="ul"
              sx={{
                mb: 2,
              }}
            >
              <li>
                <strong>Unity of God:</strong> Kabir emphasized that there is only one God, who is known by different
                names in different religions. He believed in the unity of all religions and that the Divine resides
                within every individual.
              </li>
              <li>
                <strong>Personal Spirituality:</strong> Kabir taught that true spirituality is found within oneself. He
                encouraged introspection and self-realization, urging people to seek the Divine within rather than
                through external rituals.
              </li>
              <li>
                <strong>Simplicity and Humility:</strong> Kabir advocated for a life of simplicity and humility. He
                believed that the ego is the greatest barrier to spiritual progress and that one must surrender their
                pride to truly connect with the Divine.
              </li>
              <li>
                <strong>Equality and Brotherhood:</strong> Kabir rejected the caste system and all forms of social
                discrimination. He preached that all humans are equal in the eyes of God, regardless of their social or
                religious background.
              </li>
              <li>
                <strong>Detachment from Materialism:</strong> Kabir warned against attachment to material possessions
                and worldly pleasures, which he saw as distractions from the true purpose of life—spiritual
                enlightenment.
              </li>
            </Typography>

            <Typography
              variant="h3"
              sx={{
                mt: 5,
                mb: 1.5,
              }}
            >
              The Legacy of Sant Kabir
            </Typography>

            <Typography component="p">
              Kabir’s influence extends far beyond his lifetime. His teachings inspired the formation of the{" "}
              <Link
                showExternalIcon
                href="https://en.wikipedia.org/wiki/Kabir_Panth"
                aria-label="Kabir Panth - Wikipedia"
              >
                Kabir Panth
              </Link>
              , a religious community that follows his ideals. This community, which still exists today, practices a
              simple, devotional lifestyle focused on the teachings of Kabir. His dohas are recited, sung, and revered
              across India, particularly in the northern states.
            </Typography>

            <Typography component="p">
              Kabir’s works have been included in the{" "}
              <Link
                showExternalIcon
                href="https://en.wikipedia.org/wiki/Guru_Granth_Sahib"
                aria-label="Guru Granth Sahib - Wikipedia"
              >
                Guru Granth Sahib
              </Link>
              , the holy scripture of{" "}
              <Link showExternalIcon href="https://en.wikipedia.org/wiki/Sikhism" aria-label="Sikhism - Wikipedia">
                Sikhism
              </Link>
              , demonstrating his impact on multiple religious traditions. His verses are often quoted in discussions on
              spirituality, ethics, and humanism, serving as a bridge between different faiths and philosophies.
            </Typography>

            <Typography
              variant="h3"
              sx={{
                mt: 5,
                mb: 1.5,
              }}
            >
              Kabir’s Contribution to Indian Literature
            </Typography>

            <Typography component="p">
              Kabir’s dohas are considered literary treasures, reflecting the wisdom and experiences of a mystic deeply
              connected with the essence of life. Written in the{" "}
              <Link
                showExternalIcon
                href="https://en.wikipedia.org/wiki/Indian_languages"
                aria-label="Indian languages - Wikipedia"
              >
                vernacular language
              </Link>{" "}
              of his time, his verses are accessible to people of all backgrounds. His ability to convey complex
              spiritual truths in simple, relatable language is one of the reasons his teachings have endured for
              centuries.
            </Typography>

            <Typography component="p">
              Kabir’s poetry is characterized by its brevity and depth, often using{" "}
              <Link showExternalIcon href="https://en.wikipedia.org/wiki/Metaphor" aria-label="Metaphor - Wikipedia">
                metaphors
              </Link>{" "}
              and{" "}
              <Link showExternalIcon href="https://en.wikipedia.org/wiki/Analogy" aria-label="Analogy - Wikipedia">
                analogies
              </Link>{" "}
              drawn from everyday life. His verses challenge the listener or reader to think critically about their
              beliefs, behaviors, and the nature of reality itself. This blend of simplicity and profundity makes
              Kabir’s work a timeless guide to living a life of meaning and purpose.
            </Typography>

            <Typography
              variant="h3"
              sx={{
                mt: 5,
                mb: 1.5,
              }}
            >
              Famous Dohas by Sant Kabir
            </Typography>

            <Typography
              component="ul"
              sx={{
                mb: 2,
              }}
            >
              {VERSES.map((doha, index) => (
                <Typography
                  component="li"
                  key={index}
                  sx={{
                    mb: 1,
                    fontWeight: 600,
                  }}
                >
                  {nl2br(doha)}
                </Typography>
              ))}
            </Typography>

            <Typography component="p">
              Sant Kabir’s teachings and writings offer a path to spiritual awakening and a life of harmony. This
              website is dedicated to sharing his wisdom, helping you explore the depths of his dohas, and guiding you
              on your spiritual journey. Let Kabir’s words illuminate your path and inspire you to live a life of truth,
              simplicity, and love.
            </Typography>
          </Box>

          <Box>
            <Alert severity="info" sx={{ mt: 2, borderRadius: 0 }}>
              <Typography variant="sans" sx={{ fontSize: "1rem" }}>
                This page contains information generated by{" "}
                <Link showExternalIcon href="https://chatgpt.com/" aria-label="ChatGPT - Website">
                  ChatGPT
                </Link>
                . For accuracy and additional details about Sant Kabir Das, please verify the information on{" "}
                <Link showExternalIcon href="https://en.wikipedia.org/" aria-label="Wikipedia - Main">
                  Wikipedia
                </Link>
                . Visit the official Wikipedia page here:{" "}
                <strong>
                  <Link showExternalIcon href="https://en.wikipedia.org/wiki/Kabir" aria-label="Kabir - Wikipedia">
                    Kabir - Wikipedia
                  </Link>
                </strong>
                .
              </Typography>
            </Alert>
          </Box>
        </Box>
      </SectionBody>
    </PageTemplate>
  );
};

export default About;
