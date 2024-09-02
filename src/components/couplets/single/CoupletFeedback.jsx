import React from "react";

import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";

import CoupletFeedbackForm from "../common/CoupletFeedbackForm";

/**
 * Component for displaying feedback form for the couplet.
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.couplet - The couplet data.
 * @param {string} props.couplet_hindi - The couplet text in Hindi.
 * @returns {JSX.Element} The rendered CoupletFeedback component.
 */
const CoupletFeedback = ({ couplet }) => {
	const { id, couplet_hindi } = couplet;

	return (
		<Box
			component="div"
			sx={{
				mt: 3,
			}}
		>
			<Typography
				component="h4"
				variant="h3"
				sx={{
					mb: 1,
				}}
			>
				We Value Your Feedback
			</Typography>
			<CoupletFeedbackForm coupletId={id} couplet={couplet_hindi} />
		</Box>
	);
};

CoupletFeedback.propTypes = {
	couplet: PropTypes.shape({
		id: PropTypes.number.isRequired,
		couplet_hindi: PropTypes.string.isRequired,
	}).isRequired,
};

export default CoupletFeedback;
