/**
 * A single couplet entry from the data file.
 */
export interface CoupletEntry {
  /** Hindi text of the couplet. */
  text: string;
  /** Hindi meaning/translation, may be null. */
  meaning: string | null;
  /** Sequential post number. */
  post_number: number;
}

/**
 * The data file format: a map of slug → CoupletEntry.
 */
export type CoupletsData = Record<string, CoupletEntry>;

/**
 * An entry with its index for markdown generation.
 */
export interface IndexedEntry {
  index: number;
  couplet_hindi: string;
  translation_hindi: string;
}
