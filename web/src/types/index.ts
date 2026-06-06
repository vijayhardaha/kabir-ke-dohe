/**
 * A Kabir couplet (doha) with full content, translations, and metadata.
 *
 * @type {Post}
 * @property {string} id - Unique identifier for the post
 * @property {number} post_number - Sequential numbering of the couplet
 * @property {number} post_order - Display ordering position
 * @property {string} slug - URL‑friendly unique slug
 * @property {string} identifier - External unique reference identifier
 * @property {string} text_hi - Couplet text in Hindi (Devanagari)
 * @property {string} text_en - Couplet text in English transliteration
 * @property {string | null} meaning_hi - Hindi meaning/translation
 * @property {string | null} meaning_en - English meaning/translation
 * @property {string | null} interpretation_hi - Hindi interpretation
 * @property {string | null} interpretation_en - English interpretation
 * @property {string | null} philosophical_analysis_hi - Hindi philosophical analysis
 * @property {string | null} philosophical_analysis_en - English philosophical analysis
 * @property {string | null} practical_example_hi - Hindi practical example
 * @property {string | null} practical_example_en - English practical example
 * @property {string | null} practice_guidance_hi - Hindi practice guidance
 * @property {string | null} practice_guidance_en - English practice guidance
 * @property {string | null} core_message_hi - Hindi core message summary
 * @property {string | null} core_message_en - English core message summary
 * @property {string | null} reflection_questions_hi - Hindi reflection questions
 * @property {string | null} reflection_questions_en - English reflection questions
 * @property {CategoryRef | null} category - Category reference with name and slug
 * @property {TagRef[]} tags - List of associated tag references
 * @property {boolean} is_popular - Whether marked as popular
 * @property {boolean} is_featured - Whether marked as featured
 * @property {number} view_count - Number of views
 * @property {string} post_status - Publication status (draft/publish)
 * @property {string} created_at - ISO creation timestamp
 * @property {string} updated_at - ISO last update timestamp
 */
export interface Post {
  id: string;
  post_number: number;
  post_order: number;
  slug: string;
  identifier: string;
  text_hi: string;
  text_en: string;
  meaning_hi: string | null;
  meaning_en: string | null;
  interpretation_hi: string | null;
  interpretation_en: string | null;
  philosophical_analysis_hi: string | null;
  philosophical_analysis_en: string | null;
  practical_example_hi: string | null;
  practical_example_en: string | null;
  practice_guidance_hi: string | null;
  practice_guidance_en: string | null;
  core_message_hi: string | null;
  core_message_en: string | null;
  reflection_questions_hi: string | null;
  reflection_questions_en: string | null;
  category: CategoryRef | null;
  tags: TagRef[];
  is_popular: boolean;
  is_featured: boolean;
  view_count: number;
  post_status: string;
  created_at: string;
  updated_at: string;
}

/**
 * A content category for organising couplets.
 *
 * @type {Category}
 * @property {string} id - Unique identifier for the category
 * @property {string} slug - URL‑friendly unique slug
 * @property {string} name - Display name of the category
 * @property {string | null} description - Category description
 * @property {string | null} meta_description - SEO meta description
 * @property {string} created_at - ISO creation timestamp
 * @property {string} updated_at - ISO last update timestamp
 */
export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * A content tag used for organising couplets.
 *
 * @type {Tag}
 * @property {string} id - Unique identifier for the tag
 * @property {string} slug - URL‑friendly unique slug
 * @property {string} name - Display name of the tag
 * @property {string | null} meta_description - SEO meta description
 * @property {string} created_at - ISO creation timestamp
 * @property {string} updated_at - ISO last update timestamp
 */
export interface Tag {
  id: string;
  slug: string;
  name: string;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Lightweight reference to a category, used in post listings.
 *
 * @type {CategoryRef}
 * @property {string} name - Display name of the category
 * @property {string} slug - URL‑friendly category slug
 */
export interface CategoryRef {
  name: string;
  slug: string;
}

/**
 * Lightweight reference to a tag, used in post listings.
 *
 * @type {TagRef}
 * @property {string} id - Unique identifier for the tag
 * @property {string} name - Display name of the tag
 * @property {string} slug - URL‑friendly tag slug
 */
export interface TagRef {
  id: string;
  name: string;
  slug: string;
}

/**
 * A light reference to a couplet — just the slug and Hindi text.
 * Used for adjacent couplet navigation and related couplets display.
 *
 * @type {CoupletRef}
 */
export type CoupletRef = Pick<Post, 'slug' | 'text_hi'>;

/**
 * Pagination metadata for list responses.
 *
 * @type {PaginationMeta}
 * @property {number} page - Current page number (1‑based)
 * @property {number} perPage - Number of items per page
 * @property {number} total - Total number of items across all pages
 * @property {number} totalPages - Number of pages
 */
export interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

/**
 * Response envelope returned by the couplets data‑fetching functions.
 *
 * @type {CoupletsResponse}
 * @property {Post[]} posts - List of posts for the current page
 * @property {PaginationMeta} pagination - Pagination metadata
 */
export interface CoupletsResponse {
  posts: Post[];
  pagination: PaginationMeta;
}
