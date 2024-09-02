import React from "react";

import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";

/**
 * SectionHeader component renders a section header with a title.
 *
 * @param {Object} props - The props for the component.
 * @param {string} props.title - The title to be displayed in the section header.
 * @param {string} [props.variant="h6"] - The variant of the Typography component for the title.
 * @param {string} [props.component="h3"] - The component type for the Typography.
 * @param {React.ReactNode} props.children - The content to be displayed inside the section.
 * @returns {JSX.Element} The rendered SectionHeader component.
 */
const SectionHeader = ({ title, variant = "h4", component = "h3", children, ...typographyProps }) => (
	<Box
		component="header"
		sx={{
			marginBottom: {
				xs: "3rem",
				md: "5rem",
			},
		}}
	>
		<Typography
			variant={variant}
			component={component}
			sx={{
				textTransform: "uppercase",
				lineHeight: 1,
				textAlign: "center",
				position: "relative",
				paddingBottom: "1.5rem",
				marginBottom: 0,
				"&::after": {
					content: '""',
					height: "2px",
					width: "100px",
					position: "absolute",
					bottom: 0,
					left: "50%",
					transform: "translateX(-50%)",
					background: "rgba(0, 0, 0, 0.18)",
				},
			}}
			{...typographyProps}
		>
			{title}
		</Typography>
		{children}
	</Box>
);

SectionHeader.propTypes = {
	title: PropTypes.string.isRequired,
	variant: PropTypes.string,
	component: PropTypes.string,
	children: PropTypes.node,
};

export default SectionHeader;
