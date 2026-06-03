'use client';

import { useState, type JSX } from 'react';

/**
 * Interface for the CopyButton component props.
 */
interface CopyButtonProps {
  textToCopy: string;
}

/**
 * Client-side component that provides copy-to-clipboard functionality
 *
 * @param {object} props - Component props
 * @param {string} props.textToCopy - The text to be copied to clipboard
 *
 * @returns {JSX.Element} A button with copy functionality
 */
export function CopyButton({ textToCopy }: CopyButtonProps): JSX.Element {
  const [isCopied, setIsCopied] = useState(false);

  /**
   * Handles the copy action when the button is clicked.
   * It copies the text to the clipboard and updates the state to show a "Copied!" message.
   * The message disappears after 500 milliseconds.
   */
  const handleCopy = async () => {
    await navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1000);
  };

  return (
    <button
      className="btn btn-white min-w-16 px-2 py-1 text-xs uppercase"
      onClick={handleCopy}
      aria-label="Copy code to clipboard"
    >
      {isCopied ? 'Copied!' : 'Copy'}
    </button>
  );
}
