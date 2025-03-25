import React from "react";

import { Typography } from "@mui/material";

/**
 * Converts a text string with line breaks into an array of JSX elements with <br /> tags.
 *
 * @param {string} text - The text with line breaks.
 * @returns {JSX.Element[]} The formatted text as an array of JSX elements.
 */
export const nl2br = (text) => {
  return text.split("\n").map((line, index, array) => (
    <React.Fragment key={index}>
      {line}
      {index < array.length - 1 && <br />}
    </React.Fragment>
  ));
};

/**
 * Formats text with line breaks and wraps each non-empty line in a <Typography> component using MUI.
 *
 * @param {string} text - The input text with line breaks.
 * @param {object} [typographyProps={}] - Additional props to pass to MUI Typography.
 * @returns {JSX.Element} - The formatted text with <Typography> components for non-empty lines.
 */
export const autop = (text, typographyProps = {}) => {
  return text
    .split("\n")
    .filter((line) => line.trim() !== "") // Filter out empty lines
    .map((line, index) => (
      <Typography
        key={index}
        variant="body1"
        paragraph
        dangerouslySetInnerHTML={{ __html: line }} // Render HTML directly
        {...typographyProps}
      />
    ));
};

/**
 * Cleans text by removing newline, carriage return, and tab characters.
 *
 * @param {string} text - The text to be cleaned.
 * @returns {string} The cleaned text.
 */
export const cleanText = (text) => {
  return text.replace(/[\n\r\t]/g, "");
};
