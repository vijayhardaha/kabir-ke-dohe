/**
 * Constructs a permalink based on the given slug, prefix, and base URL.
 * @param {string} [slug=""] - The slug to include in the permalink.
 * @param {string} [prefix=""] - The prefix to include in the permalink.
 * @param {boolean} [baseUrl=false] - Whether to use the base URL or not.
 * @returns {string} The constructed permalink.
 */
export const getPermalink = (slug = "", prefix = "", baseUrl = false) => {
  const effectiveBaseUrl = baseUrl ? process.env.NEXT_PUBLIC_BASE_URL : "";

  // Join parts and ensure leading slash if baseUrl is false.
  const parts = [effectiveBaseUrl, prefix, slug].filter((part) => part).join("/");
  return baseUrl ? parts : `/${parts}`;
};

/**
 * Constructs a permalink for a couplet based on the given slug and base URL flag.
 * @param {string} slug - The slug to include in the permalink.
 * @param {boolean} [baseUrl=false] - Whether to use the base URL or not.
 * @returns {string} The constructed couplet permalink.
 */
export const getCoupletLink = (slug, baseUrl = false) => getPermalink(slug, "couplet", baseUrl);

/**
 * Constructs a permalink for a tag based on the given slug and base URL flag.
 * @param {string} slug - The slug to include in the permalink.
 * @param {boolean} [baseUrl=false] - Whether to use the base URL or not.
 * @returns {string} The constructed tag permalink.
 */
export const getTagLink = (slug, baseUrl = false) => getPermalink(slug, "tag", baseUrl);

/**
 * Constructs a permalink with the base URL based on the given slug and prefix.
 * @param {string} [slug=""] - The slug to include in the permalink.
 * @param {string} [prefix=""] - The prefix to include in the permalink.
 * @returns {string} The constructed permalink with the base URL.
 */
export const getPermalinkWithBase = (slug = "", prefix = "") => getPermalink(slug, prefix, true);
