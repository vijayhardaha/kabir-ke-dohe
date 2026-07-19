/**
 * A lighter snapshot of a published post — enough for sitemaps and llms.txt.
 *
 * @type {PostSnapshot}
 * @property {string} id - Unique post identifier
 * @property {string} slug - URL-friendly post slug
 * @property {string} identifier - External unique reference
 * @property {number} post_number - Sequential post number
 * @property {number} post_order - Display ordering position
 * @property {string} text_hi - Original Hindi couplet text
 * @property {string} text_en - English transliteration
 * @property {string | null} meaning_hi - Hindi meaning
 * @property {string | null} meaning_en - English meaning
 * @property {string | null} core_message_hi - Hindi core message
 * @property {string | null} core_message_en - English core message
 * @property {{ name: string; slug: string } | null} category - Linked category data
 * @property {{ id: string; name: string; slug: string }[]} tags - Linked tag list
 * @property {boolean} is_popular - Popular post flag
 * @property {boolean} is_featured - Featured post flag
 * @property {number} view_count - Total view count
 * @property {string} post_status - Publication status
 */
export interface PostSnapshot {
  id: string;
  slug: string;
  identifier: string;
  post_number: number;
  post_order: number;
  text_hi: string;
  text_en: string;
  meaning_hi: string | null;
  meaning_en: string | null;
  core_message_hi: string | null;
  core_message_en: string | null;
  category: { name: string; slug: string } | null;
  tags: { id: string; name: string; slug: string }[];
  is_popular: boolean;
  is_featured: boolean;
  view_count: number;
  post_status: string;
}

/**
 * A category with its number of published posts.
 *
 * @type {CategoryWithCount}
 * @property {string} id - Unique category identifier
 * @property {string} slug - URL-friendly category slug
 * @property {string} name - Display name
 * @property {string | null} description - Category description
 * @property {number} post_count - Number of published posts
 */
export interface CategoryWithCount {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  post_count: number;
}

/**
 * A tag with its number of published posts.
 *
 * @type {TagWithCount}
 * @property {string} id - Unique tag identifier
 * @property {string} slug - URL-friendly tag slug
 * @property {string} name - Display name
 * @property {number} post_count - Number of published posts
 */
export interface TagWithCount {
  id: string;
  slug: string;
  name: string;
  post_count: number;
}

/**
 * The full shape of data.json — the cached site snapshot used by downstream scripts.
 *
 * @type {SiteData}
 * @property {PostSnapshot[]} posts - All published posts
 * @property {CategoryWithCount[]} categories - Categories with counts
 * @property {TagWithCount[]} tags - Tags with counts
 * @property {number} totalCount - Total published post count
 * @property {number} popularCount - Popular post count
 * @property {number} featuredCount - Featured post count
 * @property {string} fetchedAt - ISO timestamp of when data was fetched
 */
export interface SiteData {
  posts: PostSnapshot[];
  categories: CategoryWithCount[];
  tags: TagWithCount[];
  totalCount: number;
  popularCount: number;
  featuredCount: number;
  fetchedAt: string;
}
