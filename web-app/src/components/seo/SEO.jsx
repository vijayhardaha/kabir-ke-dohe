import Head from "next/head";
import PropTypes from "prop-types";

import { DEFAULT_SEO } from "@/src/constants/seo";

/**
 * SEO Component to manage page metadata.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.title] - Page title.
 * @param {string} [props.description] - Page description.
 * @param {string} [props.keywords] - SEO keywords.
 * @param {string} [props.author] - Page author.
 * @param {string} [props.googlebot] - Googlebot directive.
 * @param {string} [props.robots] - Robots directive.
 * @param {string} [props.image] - Open Graph image URL.
 * @param {string} [props.url] - Open Graph URL.
 * @param {boolean} [props.isHomePage] - Flag to determine if it's the homepage.
 * @returns {JSX.Element} SEO metadata.
 */
const SEO = ({ title, description, keywords, author, googlebot, robots, url, image, isHomePage = false }) => {
  const pageTitle = isHomePage ? title : `${title} - ${DEFAULT_SEO.title}`;

  const seo = {
    title: pageTitle || DEFAULT_SEO.title,
    description: description || DEFAULT_SEO.description,
    keywords: keywords || DEFAULT_SEO.keywords,
    author: author || DEFAULT_SEO.author,
    googlebot: googlebot || DEFAULT_SEO.googlebot,
    robots: robots || DEFAULT_SEO.robots,
    image: image || DEFAULT_SEO.image,
    url: url || DEFAULT_SEO.url,
  };

  return (
    <Head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="initial-scale=1, width=device-width" />

      <title>{seo.title}</title>

      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords} />
      <meta name="author" content={seo.author} />
      <meta name="googlebot" content={seo.googlebot} />
      <meta name="robots" content={seo.robots} />

      <link rel="canonical" href={seo.url} />

      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={DEFAULT_SEO.title} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@vijayhardaha" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />
    </Head>
  );
};

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  author: PropTypes.string,
  googlebot: PropTypes.string,
  robots: PropTypes.string,
  image: PropTypes.string,
  url: PropTypes.string,
  isHomePage: PropTypes.bool,
};

export default SEO;
