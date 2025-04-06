import Head from "next/head";

import { DEFAULT_SEO } from "@/src/constants/seo";

/**
 * DefaultSEO component that sets up default SEO metadata for the application.
 * This includes general meta tags, Open Graph, and Twitter Card metadata.
 *
 * @returns {JSX.Element} The Head element with default SEO metadata.
 */
const DefaultSEO = () => (
  <Head>
    <meta charSet="UTF-8" />
    <meta name="viewport" content="initial-scale=1, width=device-width" />

    <title>{DEFAULT_SEO.title}</title>

    <meta name="description" content={DEFAULT_SEO.description} />
    <meta name="keywords" content={DEFAULT_SEO.keywords} />

    <meta property="og:title" content={DEFAULT_SEO.title} />
    <meta property="og:description" content={DEFAULT_SEO.description} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={DEFAULT_SEO.url} />
    <meta property="og:image" content={DEFAULT_SEO.image} />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={DEFAULT_SEO.title} />
    <meta name="twitter:description" content={DEFAULT_SEO.description} />
    <meta name="twitter:image" content={DEFAULT_SEO.image} />
  </Head>
);

export default DefaultSEO;
