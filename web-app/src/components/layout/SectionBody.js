import React from "react";

import { Box } from "@mui/material";
import PropTypes from "prop-types";

/**
 * SectionBody component wraps content within a styled section container.
 *
 * @param {Object} props - The props for the component.
 * @param {React.ReactNode} props.children - The content to be displayed inside the section.
 * @returns {JSX.Element} The rendered SectionBody component.
 */
const SectionBody = ({ children }) => (
  <Box
    sx={{
      maxWidth: "820px",
      margin: "0 auto",
      "&>:last-child": { marginBottom: "0" },
    }}
  >
    {children}
  </Box>
);

SectionBody.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SectionBody;
