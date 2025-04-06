/**
 * Creates a responsive font size based on a base size and scaling ratio.
 *
 * @param {string} baseSize - The base font size in 'rem' units (e.g., "1.2rem").
 * @param {number} [ratio=0.55] - The scaling ratio to calculate the responsive size.
 * @returns {Object} The responsive font size style object.
 */
export const createResponsiveFontSize = (baseSize, ratio = 0.55) => {
  const baseValue = parseFloat(baseSize);
  const responsiveSize = baseValue * ratio;

  return {
    fontSize: `calc(${responsiveSize}rem + 1.5vw)`,
    "@media (min-width: 1200px)": {
      fontSize: `${baseValue}rem`,
    },
  };
};
