import React from "react";

import { Box } from "@mui/material";
import PropTypes from "prop-types";

import { autop } from "@/src/utils/formatting";

/**
 * Component displaying the content of the couplet including translations and explanations.
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.couplet - The couplet data.
 * @param {string} props.couplet.couplet_hindi - Hindi text of the couplet.
 * @param {string} props.couplet.translation_english - English translation of the couplet.
 * @param {string} props.couplet.translation_hindi - Hindi translation of the couplet.
 * @param {string} props.couplet.explanation_hindi - Explanation of the couplet in Hindi.
 * @returns {JSX.Element} The rendered CoupletContent component.
 */
const CoupletContent = ({ couplet }) => {
	const { translation_english, translation_hindi, explanation_hindi } = couplet;

	return (
		<Box
			component="div"
			sx={{
				mt: 3,
			}}
		>
			{translation_hindi && autop(`<strong>अर्थ:</strong> ${translation_hindi}`)}
			{translation_english && autop(`<strong>Meaning:</strong> ${translation_english}`)}
			{explanation_hindi && autop(`<strong>व्याख्या:</strong> ${explanation_hindi}`)}
		</Box>
	);
};

CoupletContent.propTypes = {
	couplet: PropTypes.shape({
		translation_english: PropTypes.string,
		translation_hindi: PropTypes.string,
		explanation_hindi: PropTypes.string,
	}).isRequired,
};

export default CoupletContent;
