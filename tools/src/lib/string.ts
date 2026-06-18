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
