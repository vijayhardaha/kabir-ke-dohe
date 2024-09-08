import React from "react";

import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";

import { createResponsiveFontSize } from "@/src/utils/theme/utils";

/**
 * PageHeader component renders a section header with a title.
 *
 * @param {Object} props - The props for the component.
 * @param {string} props.title - The title to be displayed in the section head.
 * @param {string} [props.variant="h1"] - The variant of the Typography component for the title.
 * @param {React.ReactNode} [props.children] - The content to be displayed inside the section.
 * @returns {JSX.Element} The rendered PageHeader component.
 */
const PageHeader = ({ title, variant = "h1", children }) => (
	<Box component="header" sx={{ position: "relative", zIndex: 2, marginBottom: "1.5rem" }}>
		<Typography
			variant={variant}
			component="h1"
			sx={{
				textTransform: "uppercase",
				wordWrap: "break-word",
				fontWeight: 700,
				...createResponsiveFontSize("3rem"),
			}}
		>
			{title}
		</Typography>
		{children}
	</Box>
);

PageHeader.propTypes = {
	title: PropTypes.string.isRequired,
	variant: PropTypes.string,
	children: PropTypes.node,
};

export default PageHeader;
