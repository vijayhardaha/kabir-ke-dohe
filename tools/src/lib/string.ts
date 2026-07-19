/**
 * Capitalizes the first letter in a word, preserving leading
 * non-letter characters (e.g. parentheses).
 *
 * @param {string} word - The word to capitalize.
 *
 * @returns {string} The word with its first alphabetic character uppercased.
 *
 * @example
 * capitalizeWord('(the'); // '(The'
 * capitalizeWord('hello'); // 'Hello'
 */
function capitalizeWord(word: string): string {
  const match = word.match(/[a-zA-Z]/);
  if (!match) return word;
  const idx = match.index!;
  return word.slice(0, idx) + word[idx].toUpperCase() + word.slice(idx + 1);
}

/**
 * Splits a Hindi doha (couplet) into 2 or 4 lines.
 *
 * When `fourLines` is false (default), splits at the first `। ` (danda + space)
 * only, producing exactly 2 lines. When true, splits at every `। ` and `, `
 * boundary, producing up to 4 lines.
 *
 * If no matching boundary is found the entire text is returned as-is.
 *
 * @param {string} text - The Hindi doha text (e.g. `text_hi`).
 * @param {boolean} [fourLines] - When true, split at every danda and comma.
 *
 * @returns {string} Text split into 2 or 4 lines.
 *
 * @example
 *   formatCoupletText('बलिहारी गुरु... बार। मानुष... देव...')
 *   // → "बलिहारी ... बार।\nमानुष ... देव..."
 *
 *   formatCoupletText('भक्ति पंथ... कठिन है, रती... खोट। निराधार... है, अधर... चोट।।', true)
 *   // → "भक्ति पंथ... कठिन है,\nरती... खोट।\nनिराधार... है,\nअधर... चोट।।"
 */
export function formatCoupletText(text: string, fourLines = false): string {
  if (fourLines) {
    return text.replace(/(।|,)\s+/g, '$1\n');
  }
  return text.replace(/^(.+?)। (.+)$/, '$1।\n$2');
}

/**
 * Converts a string to sentence case (first letter uppercase, rest lowercase).
 *
 * @param {string} str - The string to convert to sentence case.
 *
 * @returns {string} The string in sentence case format.
 *
 * @example
 * toSentenceCase('HELLO WORLD'); // 'Hello World'
 * toSentenceCase('heLLo'); // 'Hello'
 * toSentenceCase('जागृति (the Wake-up Call)'); // 'जागृति (The Wake-up Call)'
 */
export function toSentenceCase(str: string): string {
  if (!str) return str;

  const lowercaseWords = new Set(['of', 'vs', 'and', 'the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'by', 'with']);

  return str
    .replace(/&/g, 'and')
    .toLowerCase()
    .split(/\s+/)
    .map((word, index) => {
      // Strip leading/trailing non-letters for lowercase word matching (e.g. '(the' → 'the').
      const strippedWord = word.replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, '');
      const startsWithLetter = /^[a-zA-Z]/.test(word);

      // Only apply lowercase-word rule when the word starts with a letter
      // (skip for parenthetical prefixes like '(the').
      if (index > 0 && startsWithLetter && strippedWord && lowercaseWords.has(strippedWord)) {
        return word;
      }

      return capitalizeWord(word);
    })
    .join(' ');
}
