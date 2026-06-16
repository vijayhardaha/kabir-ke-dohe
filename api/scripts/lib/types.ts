import { z } from 'zod';

/**
 * Zod schema for tag response from database.
 * Validates tags with their associated published posts.
 */
export const TagResponseSchema = z.object({
  name: z.string(),
  post_tags: z.array(z.object({ post: z.object({ post_status: z.string() }) })),
});

/**
 * Type for validated tag response.
 *
 * @typedef {object} TagResponse
 * @property {string} name - Tag name.
 * @property {Array<{ post: { post_status: string } }>} post_tags - Associated posts.
 */
export type TagResponse = z.infer<typeof TagResponseSchema>;

/**
 * Zod schema for couplet entry in output JSON.
 * Validates the structure of couplets in the data file.
 */
export const CoupletEntrySchema = z.object({
  text: z.string(),
  meaning: z.string().nullable(),
  post_number: z.number(),
});

/**
 * Type for validated couplet entry (used internally, not exported).
 */
export type CoupletEntry = z.infer<typeof CoupletEntrySchema>;
