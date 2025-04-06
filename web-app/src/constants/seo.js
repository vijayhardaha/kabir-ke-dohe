/**
 * The base URL of the site, retrieved from environment variables.
 * Defaults to an empty string if the environment variable is not set.
 * @type {string}
 */
export const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || ""; // Default to an empty string if NEXT_PUBLIC_BASE_URL is not defined.

/**
 * Default site title for SEO.
 *
 * @type {string}
 */
export const SITE_TITLE = "Kabir ke Dohe";

/**
 * Default site description for SEO.
 *
 * @type {string}
 */
export const SITE_DESC =
  "Explore the profound spiritual wisdom of Kabir through his dohas (couplets). Find detailed translations and insightful explanations to deepen your understanding.";

/**
 * Default SEO configuration for the site.
 *
 * @type {object}
 * @property {string} title - The default title for the site.
 * @property {string} description - The default description for the site.
 * @property {string} keywords - Keywords for SEO to enhance discoverability.
 * @property {string} language - Language code for the site content.
 * @property {string} author - Author of the content for attribution.
 * @property {object} og - Open Graph metadata for better sharing on social media.
 * @property {string} og.title - Open Graph title for social media previews.
 * @property {string} og.description - Open Graph description for social media previews.
 * @property {string} og.image - URL of the image for social media previews.
 * @property {string} og.url - URL of the site for Open Graph metadata.
 */
export const DEFAULT_SEO = {
  title: SITE_TITLE,
  description: SITE_DESC,
  keywords: "Kabir, Dohe, Wisdom, Hindi Poetry, Spirituality",
  language: "en-US",
  author: "Vijay Hardaha",
  image: `${SITE_URL}/thumbnail.png`,
  url: SITE_URL,
};

/**
 * SEO configuration for the site.
 *
 * @type {object}
 * @property {object} home - SEO settings for the homepage.
 * @property {object} about - SEO settings for the About page.
 * @property {object} featured - SEO settings for the Featured Dohe page.
 * @property {object} popular - SEO settings for the Popular Dohe page.
 * @property {object} "all-collection" - SEO settings for the Complete Collection page.
 */
export const PAGES_SEO_CONFIG = {
  home: {
    title: "Kabir ke Dohe",
    description:
      "Welcome to Kabir ke Dohe, your gateway to exploring the spiritual wisdom of Kabir through his dohas. Discover translations, insights, and profound teachings.",
    keywords: "Kabir, Dohe, Spiritual Teachings, Hindi Poetry, Kabir Dohas, Wisdom of Kabir, Spiritual Quotes",
  },
  about: {
    title: "About",
    description:
      "Learn more about Kabir ke Dohe, our mission, and our approach to presenting Kabir's dohas with detailed translations and explanations.",
    keywords: "About Kabir, Kabir Dohe, Spiritual Wisdom, Hindi Poetry, Kabir's Teachings, Kabir ke Dohe Overview",
  },
  popular: {
    title: "Popular Dohe",
    description:
      "Discover the most popular dohas by Kabir, renowned for their spiritual depth and impactful teachings.",
    keywords: "Popular Kabir Dohe, Kabir's Most Read Dohe, Spiritual Wisdom, Hindi Poetry, Kabir's Top Dohe",
  },
  couplets: {
    title: "Complete Collection of Kabir's Dohas",
    description:
      "Explore the complete collection of Kabir's dohas. This page features all dohas by Kabir with detailed translations and explanations. Use our pagination feature to navigate through the full set of Kabir's spiritual wisdom.",
    keywords:
      "Complete Collection Kabir Dohas, Kabir's Full Dohe Collection, All Kabir Dohas, Spiritual Teachings, Hindi Poetry, Kabir Dohe List",
  },
};
